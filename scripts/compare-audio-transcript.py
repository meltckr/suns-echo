#!/usr/bin/env python3
"""Record every word difference in an unprompted Whisper transcription.

ASR differences are review flags, not proof of what a listener hears.
Reference audio and private pronunciation inputs are never read here.
"""
import argparse
import difflib
import hashlib
import json
from pathlib import Path
import re


def words(text):
    return re.findall(r"[\w]+(?:'[\w]+)*", text.replace('’', "'").casefold())


def fingerprint(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--script', type=Path, required=True)
    parser.add_argument('--whisper', type=Path, required=True)
    parser.add_argument('--audio', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    expected = args.script.read_text()
    result = json.loads(args.whisper.read_text())
    recognized = result['text'].strip()
    canonical, heard = words(expected), words(recognized)
    mismatches = []
    for operation, a, b, c, d in difflib.SequenceMatcher(None, canonical, heard, autojunk=False).get_opcodes():
        if operation != 'equal':
            mismatches.append({'operation': operation, 'scriptWord': a + 1,
                               'expected': ' '.join(canonical[a:b]),
                               'recognized': ' '.join(heard[c:d])})
    report = {'model': 'mlx-community/whisper-large-v3-turbo',
              'prompted': False, 'comparison': 'Case and punctuation ignored; apostrophes standardized. Words and contractions remain distinct.',
              'audioSha256': fingerprint(args.audio), 'scriptSha256': fingerprint(args.script),
              'whisperSha256': fingerprint(args.whisper), 'scriptWords': len(canonical),
              'recognizedWords': len(heard), 'mismatches': mismatches,
              'limitation': 'Whisper differences may be recognition errors or delivery errors; they do not establish perceptual listening approval.'}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.with_suffix('.json').write_text(json.dumps(report, indent=2) + '\n')
    lines = ['# Take 6 — Whisper comparison', '', report['comparison'], '',
             f"Audio SHA-256: `{report['audioSha256']}`", '',
             f"Script SHA-256: `{report['scriptSha256']}`", '',
             f"Unprompted Whisper model: `{report['model']}`. {len(mismatches)} word-difference spans.", '',
             '| Script word | Expected | Whisper recognized |', '| --- | --- | --- |']
    for item in mismatches:
        lines.append(f"| {item['scriptWord']} | {item['expected'] or '(nothing)'} | {item['recognized'] or '(nothing)'} |")
    if not mismatches:
        lines.append('| — | No word mismatches | — |')
    lines += ['', report['limitation'], '', '## Full recognized text', '', recognized, '',
              '## Raw text diff', '', '```diff']
    lines += list(difflib.unified_diff(expected.strip().splitlines(), recognized.splitlines(),
                                     fromfile='Editor script', tofile='Whisper', lineterm=''))
    lines += ['```', '']
    args.output.with_suffix('.md').write_text('\n'.join(lines))
    print(json.dumps({'mismatchSpans': len(mismatches), 'mismatches': mismatches,
                      'audioSha256': report['audioSha256']}))


if __name__ == '__main__':
    main()
