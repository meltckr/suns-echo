#!/usr/bin/env python3
"""Bind the exact Portland recipe and honest Whisper proof to Echo's MP3.

This does not synthesize speech or grant listening/publication approval.
Raw sentence WAVs, generation text and logs remain in the private workdir.
"""
import argparse
import hashlib
import json
from pathlib import Path
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / 'public/audio/the-echo-suns-002-media-day-2026-09-29-v8.mp3'
NAMES = ['Mat', 'Oso', 'Ighodaro', 'Khaman', 'Maluach', 'Booker', 'Kennard',
         'Fleming', 'Valley Suns', 'Williams', 'Gregory', 'Bridges']


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def save(path, value):
    path.write_text(json.dumps(value, indent=2) + '\n')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--whisper', type=Path, required=True)
    parser.add_argument('--comparison', type=Path, required=True)
    parser.add_argument('--rerenders', type=Path, required=True)
    args = parser.parse_args()
    transcript = ROOT / 'content/audio-brief-transcript.txt'
    text = transcript.read_text()
    if sha(transcript) != '9928d7cea83e41626a15337f57db6497a44def4f7cf2a05d20bd196d8deaa6e7':
        raise SystemExit('Locked transcript changed')
    metadata_path = AUDIO.with_suffix('.metadata.json')
    metadata = json.loads(metadata_path.read_text())
    whisper = json.loads(args.whisper.read_text())
    comparison = json.loads(args.comparison.read_text())
    rerenders = json.loads(args.rerenders.read_text())
    if not metadata['review']['technical_pass'] or metadata['audio_sha256'] != sha(AUDIO):
        raise SystemExit('Technical audio proof is missing or stale')
    if (whisper['audioSha256'] != sha(AUDIO) or comparison['audioSha256'] != sha(AUDIO)
            or comparison['scriptSha256'] != sha(transcript)
            or comparison['whisperSha256'] != sha(args.whisper)
            or whisper['prompted'] is not False or comparison['prompted'] is not False):
        raise SystemExit('Whisper proof binding failed')
    if not re.sub(r'[^a-z]+', ' ', whisper['text'].lower()).strip().endswith('dominate'):
        raise SystemExit('Full closing not recognized')
    def normalized(value):
        return re.sub(r'[^a-z0-9]+', ' ', value.lower()).strip()
    def count(value, name):
        return (' ' + normalized(value) + ' ').count(' ' + normalized(name) + ' ')
    name_checks = [dict(name=name, expectedCount=count(text, name),
                       actualCount=count(whisper['text'], name),
                       matched=count(text, name) == count(whisper['text'], name)) for name in NAMES]
    sentences = [sentence for paragraph in re.split(r'\n\s*\n+', text.strip())
                 for sentence in re.split(r'(?<=[.!?])\s+', paragraph) if sentence.strip()]
    if len({item['sentenceIndex'] for item in rerenders}) != len(rerenders):
        raise SystemExit('Duplicate rerender entries')
    if any(not 0 <= item['sentenceIndex'] < len(sentences) or not 1 <= item['attempts'] <= 4
           for item in rerenders):
        raise SystemExit('Sentence retry cap failed')
    proofdir = ROOT / 'research/media-day-2026-09-28'
    whisper_target = proofdir / 'take8-arizona-whisper.json'
    comparison_target = proofdir / 'TAKE8-ARIZONA-WHISPER-DIFF.json'
    shutil.copyfile(args.whisper, whisper_target)
    shutil.copyfile(args.comparison, comparison_target)
    shutil.copyfile(args.comparison.with_suffix('.md'), comparison_target.with_suffix('.md'))
    measured = metadata['measured_audio']
    pair = Path.home() / 'avc-tools/breeze-proof'
    manifest = dict(provider='arizona-v12', voice='Arizona v12', model=metadata['model_id'],
        generatedAt=metadata['generated_at'], title=metadata['title'], file=AUDIO.name,
        transcript='content/audio-brief-transcript.txt', transcriptSha256=sha(transcript),
        audioSha256=sha(AUDIO), sampleRate=24000, channels=1, bitrate=160000,
        durationSeconds=metadata['duration_seconds'],
        integratedLufs=measured['integrated_lufs_dual_mono'], loudnessMeasurement='dual_mono=true',
        truePeakDbtp=measured['true_peak_dbtp'], trailingSilenceSeconds=measured['trailing_silence_seconds'],
        silenceScanPassed=True, digitalBlackHoleScanPassed=True, recipe=metadata['recipe'],
        reference=dict(audioSha256=sha(pair / 'mel-az-2026-decl-18s.wav'),
                       textSha256=sha(pair / 'mel-az-2026-decl-18s.txt')),
        finishing=dict(renderer='avc_arizona_v12_factory.sh',
                       rendererSha256=sha(ROOT / 'scripts/avc_arizona_v12_factory.sh'),
                       generationMode='sentence', generationPasses=len(sentences),
                       joinGuardVersion='guarded-v1', crossfadeSeconds=0, tempoMultiplier=1.15,
                       sampling=dict(repetitionPenalty=1.5, temperature=.9, topK=50, seed=42),
                       maxTokens=384, globalPauseCollapse=False),
        proof=dict(prompted=False, whisperFile=str(whisper_target.relative_to(ROOT)),
                   whisperSha256=sha(whisper_target), comparisonFile=str(comparison_target.relative_to(ROOT)),
                   comparisonSha256=sha(comparison_target), mismatchSpans=len(comparison['mismatches']),
                   nameChecks=name_checks, requiredNamesMatched=all(item['matched'] for item in name_checks),
                   sentenceRerenders=rerenders), listeningConfirmed=False, playerVerified=False)
    save(Path(str(AUDIO) + '.json'), manifest)
    metadata['public_transcript_sha256'] = sha(transcript)
    metadata['review']['automated_word_check'] = dict(provider='local-mlx-whisper',
        model=whisper['model'], audio_sha256=sha(AUDIO), exact_signoff_recognized=True,
        perceptual_listening=False, raw_name_checks=name_checks,
        full_diff=str(comparison_target.relative_to(ROOT)))
    save(metadata_path, metadata)
    print(json.dumps(dict(file=str(AUDIO), durationSeconds=manifest['durationSeconds'],
                          audioSha256=manifest['audioSha256'], nameChecks=name_checks,
                          mismatchSpans=manifest['proof']['mismatchSpans'], sentenceRerenders=rerenders)))


if __name__ == '__main__':
    main()
