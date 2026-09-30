#!/usr/bin/env python3
"""Arizona v12 synthesis with conservative, non-overlapping unit joins.

Raw generation and pronunciation inputs live only in the caller's private workdir.
Paragraph mode replaces verified boundary silence; active windows and internal
pauses are preserved. Sentence mode retains its historical joining behavior.
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


def crossfade_boundary(left, right, samples):
    """Blend quiet boundary padding; never overlap active speech."""
    if len(left) < samples or len(right) < samples:
        raise ValueError('Crossfade needs complete quiet boundary padding')
    joined = left[:-samples]
    for index in range(samples):
        weight = (index + 1) / (samples + 1)
        joined.append(round(left[-samples + index] * (1 - weight) + right[index] * weight))
    joined.extend(right[samples:])
    return joined


def join_paragraphs(chunks, pause=.5):
    """Keep active windows intact; crossfade padding around a 0.5s gap."""
    if not chunks or pause != .5:
        raise ValueError('Paragraph mode requires chunks and exactly 0.5s spacing')
    result = array.array('h')
    joins = []
    fade = round(.03 * RATE)
    for index, chunk in enumerate(chunks):
        onset, end = speech_bounds(chunk)
        # The crossfade operates on padding outside the detected active windows.
        leading = chunk[max(0, onset - fade):onset]
        if index:
            leading = array.array('h', [0] * (fade - len(leading))) + leading
            result = crossfade_boundary(result, leading + chunk[onset:end], fade)
        else:
            result.extend(chunk[:end])
        if index < len(chunks) - 1:
            tail = chunk[end:end + fade]
            tail.extend([0] * (fade - len(tail)))
            result.extend(tail)
            result = crossfade_boundary(result, array.array('h', [0] * round(pause * RATE)), fade)
            joins.append({'afterParagraph': index, 'paragraph': True,
                          'pauseSeconds': pause, 'addedSilenceSeconds': pause,
                          'crossfadeSeconds': .03})
        else:
            result.extend(chunk[end:end + round(.2 * RATE)])
            result.extend([0] * max(0, round(.2 * RATE) - (len(chunk) - end)))
    return result, joins


def measure_loudness(base, filters):
    result = command(base + ['-af', filters, '-f', 'null', '-']).stderr.decode()
    return json.loads(result[result.rfind('{'):result.rfind('}') + 1])


def normalize_and_encode(base, output):
    """Two-pass EQ/normalization; verify MP3 and retry only from original PCM.

    dual_mono=false is explicit in both passes and measurements, so the
    encoded mono file meets the ordinary integrated LUFS target.
    """
    eq = 'highpass=f=80,equalizer=f=250:t=q:w=1:g=-3,equalizer=f=3500:t=q:w=1:g=2,deesser=i=0.2:m=0.5:f=0.55'
    target, ceiling = -16., -1.5  # measure encoded peak; reserve only required MP3 headroom
    attempts = []
    for attempt in range(6):
        settings = f'loudnorm=I={target}:TP={ceiling}:LRA=11:dual_mono=false'
        stats = measure_loudness(base, eq + ',' + settings + ':print_format=json')
        normalizer = (settings + ':linear=true:'
                      f"measured_I={stats['input_i']}:measured_LRA={stats['input_lra']}:"
                      f"measured_TP={stats['input_tp']}:measured_thresh={stats['input_thresh']}:offset={stats['target_offset']}")
        command(base + ['-y', '-af', eq + ',' + normalizer, '-ar', str(RATE), '-ac', '1',
                        '-c:a', 'libmp3lame', '-b:a', '160k', '-write_xing', '1', str(output)])
        encoded = measure_loudness(['ffmpeg', '-hide_banner', '-i', str(output)],
                                  'loudnorm=I=-16:TP=-1.5:LRA=11:dual_mono=false:print_format=json')
        actual, peak = float(encoded['input_i']), float(encoded['input_tp'])
        attempts.append({'targetLufs': target, 'encoderCeilingDbtp': ceiling,
                         'integratedLufs': actual, 'truePeakDbtp': peak})
        if abs(actual + 16) <= .3 and peak <= -1.5:
            return {'targetIntegratedLufs': -16, 'truePeakCeilingDbtp': -1.5,
                    'dualMono': False, 'toleranceLu': .3, 'attempts': attempts}
        target = max(-20., min(-10., target + (-16 - actual)))
        if peak > -1.5:
            ceiling -= peak + 1.5 + .15
    raise ValueError(f'Encoded loudness/peak target failed after PCM-only retries: {attempts}')


def prepare_sentences(transcript, config=None, mode="sentence"):
    if mode not in ("sentence", "paragraph"):
        raise ValueError("Unknown generation mode")
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
        parts = ([paragraph.strip()] if mode == 'paragraph' else
                 [x.strip() for x in re.split(r'(?<=[.!?])\s+', paragraph) if x.strip()])
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


def configure_icl_sampling(model):
    """Keep the same Qwen ICL engine while honoring the requested penalty.

    This installed mlx-audio version floors its public ICL argument at 1.5.
    Override that argument at the instance's ICL entry point, leaving the
    installed package and all reference/model inputs unchanged.
    """
    original = model._generate_icl

    def generate_icl(*args, **kwargs):
        kwargs['repetition_penalty'] = 1.05
        return original(*args, **kwargs)

    model._generate_icl = generate_icl


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
    parser.add_argument('--resume', action='store_true', help='Reuse private raw WAVs after validating saved spoken input and pronunciation configuration')
    parser.add_argument('--generation-mode', choices=['sentence', 'paragraph'], default='sentence')
    parser.add_argument('--max-tokens', type=int, default=1536)
    parser.add_argument('--sentence-pause', type=float, default=.22)
    parser.add_argument('--paragraph-pause', type=float, default=None)
    args = parser.parse_args()
    if args.paragraph_pause is None:
        args.paragraph_pause = .5 if args.generation_mode == 'paragraph' else .4
    if args.generation_mode == 'paragraph' and args.paragraph_pause != .5:
        raise ValueError('Paragraph mode requires exactly 0.5s spacing')
    if not 1024 <= args.max_tokens <= 4096:
        raise ValueError('max_tokens must be between 1024 and 4096')
    if not .20 <= args.sentence_pause <= .24 or not .30 <= args.paragraph_pause <= .60:
        raise ValueError('Pause settings outside approved finishing bounds')
    os.umask(0o077)
    args.workdir.mkdir(parents=True, exist_ok=True)
    transcript = args.transcript.read_text()
    config_bytes = args.pronunciation_config.read_bytes() if args.pronunciation_config else None
    config = json.loads(config_bytes) if config_bytes else None
    sentences, ends = prepare_sentences(transcript, config, args.generation_mode)
    private_input = '\n\n'.join(sentences)
    if args.resume:
        if (args.workdir / 'spoken-input.txt').read_text() != private_input:
            raise ValueError('Resume spoken input does not match current SHA-bound script')
        saved_config = args.workdir / 'pronunciation.json'
        if (saved_config.read_bytes() if saved_config.exists() else None) != config_bytes:
            raise ValueError('Resume pronunciation configuration mismatch')
        expected = {f'{args.generation_mode}-{index:03d}' for index in range(len(sentences))}
        wavs = list(args.workdir.glob(f'{args.generation_mode}-*.wav'))
        if len(wavs) != len(expected) or any(not any(p.name.startswith(prefix) for p in wavs) for prefix in expected):
            raise ValueError('Resume raw generation set mismatch')
    else:
        (args.workdir / 'spoken-input.txt').write_text(private_input)
        if config_bytes:
            (args.workdir / 'pronunciation.json').write_bytes(config_bytes)
        from mlx_audio.tts.generate import generate_audio, load_model
        import mlx.core as mx
        model_id = os.environ['AVC_MODEL']
        model = load_model(model_path=model_id)
        configure_icl_sampling(model)
        ref_text = Path(os.environ['AVC_REF_TXT']).read_text().strip()
    chunks, raw_records = [], []
    for index, text in enumerate(sentences):
        prefix = f'{args.generation_mode}-{index:03d}'
        if not args.resume:
            mx.random.seed(42)
            generate_audio(model=model, text=text, voice=None,
                           ref_audio=os.environ['AVC_REF_WAV'], ref_text=ref_text,
                           lang_code='english', temperature=.8, top_k=50, top_p=.95,
                           repetition_penalty=1.05, max_tokens=args.max_tokens,
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
        raw_records.append({args.generation_mode: index, 'sha256': sha(files[0].read_bytes()),
                            'rawSeconds': len(samples) / RATE, 'finishedSeconds': len(finished) / RATE})
    joined, joins = (join_paragraphs(chunks, args.paragraph_pause) if args.generation_mode == 'paragraph'
                     else join_sentences(chunks, ends, args.sentence_pause, args.paragraph_pause))
    pcm = args.workdir / 'joined.s16'
    if sys.byteorder != 'little':
        joined.byteswap()
    pcm.write_bytes(joined.tobytes())
    base = ['ffmpeg', '-hide_banner', '-f', 's16le', '-ar', str(RATE), '-ac', '1', '-i', str(pcm)]
    normalization = normalize_and_encode(base, args.output)
    metadata = {'renderer': 'echo-audio-render.py', 'transcriptSha256': sha(transcript.encode()),
                'spokenInputSha256': sha(private_input.encode()),
                'pronunciationConfigSha256': sha(config_bytes) if config_bytes else None,
                'resumedRawGeneration': args.resume, 'generationMode': args.generation_mode, 'generationPasses': len(sentences),
                'normalization': normalization,
                'sampling': {'repetitionPenalty': 1.05, 'temperature': .8, 'topP': .95, 'seed': 42},
                'maxTokens': args.max_tokens, 'trailingPaddingSeconds': .2,
                'sentencePauseSeconds': args.sentence_pause if args.generation_mode == 'sentence' else None, 'paragraphPauseSeconds': args.paragraph_pause,
                'tempoMultiplier': 1, 'crossfadeSeconds': .03 if args.generation_mode == 'paragraph' else 0, 'globalPauseCollapse': False,
                'endpointRmsThresholdDb': -65, 'endpointWindowMilliseconds': 10,
                'joins': joins, 'rawGenerations': raw_records}
    if args.generation_mode == 'sentence':
        metadata['rawSentences'] = raw_records
    (args.workdir / 'render-metadata.json').write_text(json.dumps(metadata, indent=2) + '\n')


if __name__ == '__main__':
    main()
