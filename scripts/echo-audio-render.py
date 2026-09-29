#!/usr/bin/env python3
"""Arizona v12 synthesis with conservative, non-overlapping sentence joins.

Raw generation and pronunciation inputs live only in the caller's private workdir.
No leading speech, internal pauses, or speech samples are removed or overlapped.
"""
import argparse
import array
import hashlib
import json
import math
import os
from pathlib import Path
import re
import subprocess
import sys

RATE = 24000


def sha(data):
    return hashlib.sha256(data).hexdigest()


def speech_bounds(samples, rate=RATE, threshold_db=-65, window_ms=10):
    """Conservative full-window RMS bounds; retains the entire last active window."""
    width = max(1, round(rate * window_ms / 1000))
    threshold = 32768 * 10 ** (threshold_db / 20)
    active = []
    for start in range(0, len(samples), width):
        frame = samples[start:start + width]
        if math.sqrt(sum(float(x) ** 2 for x in frame) / len(frame)) >= threshold:
            active.append((start, min(len(samples), start + width)))
    if not active:
        raise ValueError("Silent sentence; refusing to finish")
    return active[0][0], active[-1][1]


def finish_sentence(samples, keep_seconds=.2):
    """Only remove verified trailing silence, then guarantee a gentle 200ms tail."""
    _, end = speech_bounds(samples)
    target = end + round(keep_seconds * RATE)
    result = array.array('h', samples[:target])
    result.extend([0] * max(0, target - len(result)))
    return result


def join_sentences(chunks, paragraph_ends, sentence_pause=.22, paragraph_pause=.4):
    if not chunks or len(chunks) != len(paragraph_ends):
        raise ValueError("Sentence boundary metadata mismatch")
    result = array.array('h', chunks[0])
    joins = []
    for index, nxt in enumerate(chunks[1:]):
        _, end = speech_bounds(chunks[index])
        onset, _ = speech_bounds(nxt)
        target = paragraph_pause if paragraph_ends[index] else sentence_pause
        existing = len(chunks[index]) - end + onset
        gap = max(0, round(target * RATE) - existing)
        pause = (existing + gap) / RATE
        if pause > .8:
            raise ValueError(f"Unexpected boundary pause {pause:.3f}s at sentence {index}; inspect raw audio")
        joins.append({'afterSentence': index, 'paragraph': paragraph_ends[index],
                      'pauseSeconds': pause, 'addedSilenceSeconds': gap / RATE})
        result.extend([0] * gap)
        result.extend(nxt)
    return result, joins


def prepare_sentences(transcript, config=None):
    replacements = []
    if config:
        if config.get('transcriptSha256') != sha(transcript.encode()):
            raise ValueError('Pronunciation configuration does not match canonical transcript SHA-256')
        replacements = config.get('replacements', [])
        seen = set()
        for item in replacements:
            canonical, spoken = item['canonical'], item['spoken']
            if (not canonical or canonical not in transcript or canonical in seen
                    or not spoken.strip() or '\n' in spoken):
                raise ValueError('Pronunciation replacement missing, duplicate, or invalid')
            seen.add(canonical)
    sentences, ends = [], []
    for paragraph in re.split(r'\n\s*\n', transcript.strip()):
        parts = [x.strip() for x in re.split(r'(?<=[.!?])\s+', paragraph) if x.strip()]
        for index, canonical_text in enumerate(parts):
            text = canonical_text
            # Match against original text once; never cascade substitutions.
            if replacements:
                mapping = {x['canonical']: x['spoken'] for x in replacements}
                pattern = '|'.join(re.escape(x) for x in sorted(mapping, key=len, reverse=True))
                text = re.sub(pattern, lambda match: mapping[match.group()], text)
            sentences.append(text)
            ends.append(index == len(parts) - 1)
    if not sentences:
        raise ValueError('Empty transcript')
    return sentences, ends


def command(args):
    return subprocess.run(args, capture_output=True, check=True)


def decode(path):
    pcm = command(['ffmpeg', '-v', 'error', '-i', str(path), '-ac', '1', '-ar', str(RATE), '-f', 's16le', 'pipe:1']).stdout
    samples = array.array('h')
    samples.frombytes(pcm)
    if sys.byteorder != 'little':
        samples.byteswap()
    return samples


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('transcript', type=Path)
    parser.add_argument('output', type=Path)
    parser.add_argument('--workdir', required=True, type=Path)
    parser.add_argument('--pronunciation-config', type=Path)
    parser.add_argument('--max-tokens', type=int, default=1536)
    parser.add_argument('--sentence-pause', type=float, default=.22)
    parser.add_argument('--paragraph-pause', type=float, default=.4)
    args = parser.parse_args()
    if not 1024 <= args.max_tokens <= 4096:
        raise ValueError('max_tokens must be between 1024 and 4096')
    if not .20 <= args.sentence_pause <= .24 or not .30 <= args.paragraph_pause <= .60:
        raise ValueError('Pause settings outside approved finishing bounds')
    os.umask(0o077)
    args.workdir.mkdir(parents=True, exist_ok=True)
    transcript = args.transcript.read_text()
    config_bytes = args.pronunciation_config.read_bytes() if args.pronunciation_config else None
    config = json.loads(config_bytes) if config_bytes else None
    sentences, ends = prepare_sentences(transcript, config)
    private_input = '\n\n'.join(sentences)
    (args.workdir / 'spoken-input.txt').write_text(private_input)
    if config_bytes:
        (args.workdir / 'pronunciation.json').write_bytes(config_bytes)
    from mlx_audio.tts.generate import generate_audio, load_model
    import mlx.core as mx
    model_id = os.environ['AVC_MODEL']
    model = load_model(model_path=model_id)
    ref_text = Path(os.environ['AVC_REF_TXT']).read_text().strip()
    chunks, raw_records = [], []
    for index, text in enumerate(sentences):
        mx.random.seed(42)
        prefix = f'sentence-{index:03d}'
        generate_audio(model=model, text=text, voice=None,
                       ref_audio=os.environ['AVC_REF_WAV'], ref_text=ref_text,
                       lang_code='english', temperature=.9, top_k=50,
                       repetition_penalty=1.5, max_tokens=args.max_tokens,
                       output_path=str(args.workdir), file_prefix=prefix,
                       audio_format='wav', join_audio=False, verbose=True)
        files = sorted(args.workdir.glob(f'{prefix}*.wav'))
        if len(files) != 1:
            raise ValueError(f'Expected one complete raw sentence WAV: {prefix}')
        samples = decode(files[0])
        # Qwen emits 12 acoustic frames per second. Reaching the cap can mean
        # generation stopped before the sentence ended. Fail rather than clip.
        if len(samples) / RATE >= args.max_tokens / 12 - 1:
            raise ValueError(f'Possible token-limit truncation: {prefix}')
        finished = finish_sentence(samples)
        chunks.append(finished)
        raw_records.append({'sentence': index, 'sha256': sha(files[0].read_bytes()),
                            'rawSeconds': len(samples) / RATE, 'finishedSeconds': len(finished) / RATE})
    joined, joins = join_sentences(chunks, ends, args.sentence_pause, args.paragraph_pause)
    pcm = args.workdir / 'joined.s16'
    if sys.byteorder != 'little':
        joined.byteswap()
    pcm.write_bytes(joined.tobytes())
    base = ['ffmpeg', '-hide_banner', '-f', 's16le', '-ar', str(RATE), '-ac', '1', '-i', str(pcm)]
    eq = 'highpass=f=80,equalizer=f=250:t=q:w=1:g=-3,equalizer=f=3500:t=q:w=1:g=2,deesser=i=0.2:m=0.5:f=0.55'
    measured = command(base + ['-af', eq + ',loudnorm=I=-16:TP=-2:LRA=11:dual_mono=true:print_format=json', '-f', 'null', '-']).stderr.decode()
    stats = json.loads(measured[measured.rfind('{'):measured.rfind('}') + 1])
    normalizer = ('loudnorm=I=-16:TP=-2:LRA=11:linear=true:dual_mono=true:'
                  f"measured_I={stats['input_i']}:measured_LRA={stats['input_lra']}:"
                  f"measured_TP={stats['input_tp']}:measured_thresh={stats['input_thresh']}:offset={stats['target_offset']}")
    command(base + ['-y', '-af', eq + ',' + normalizer, '-ar', str(RATE), '-ac', '1',
                    '-c:a', 'libmp3lame', '-b:a', '160k', '-write_xing', '1', str(args.output)])
    metadata = {'renderer': 'echo-audio-render.py', 'transcriptSha256': sha(transcript.encode()),
                'spokenInputSha256': sha(private_input.encode()),
                'pronunciationConfigSha256': sha(config_bytes) if config_bytes else None,
                'maxTokens': args.max_tokens, 'trailingPaddingSeconds': .2,
                'sentencePauseSeconds': args.sentence_pause, 'paragraphPauseSeconds': args.paragraph_pause,
                'tempoMultiplier': 1, 'crossfadeSeconds': 0, 'globalPauseCollapse': False,
                'endpointRmsThresholdDb': -65, 'endpointWindowMilliseconds': 10,
                'joins': joins, 'rawSentences': raw_records}
    (args.workdir / 'render-metadata.json').write_text(json.dumps(metadata, indent=2) + '\n')


if __name__ == '__main__':
    main()
