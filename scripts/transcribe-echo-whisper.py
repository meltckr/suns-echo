#!/usr/bin/env python3
"""Unprompted local Whisper proof; never reads the script or voice reference."""
import argparse
import hashlib
import json
from pathlib import Path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--audio', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    from mlx_audio.stt.utils import load_model
    from transformers import WhisperProcessor
    model_id = 'mlx-community/whisper-large-v3-turbo'
    model = load_model(model_id)
    if model._processor is None:
        # This cached MLX conversion lacks processor files. Reuse the cached
        # official processor for the same Whisper model, without modifying it.
        model._processor = WhisperProcessor.from_pretrained(
            'openai/whisper-large-v3-turbo', local_files_only=True)
    result = model.generate(str(args.audio), language='en', temperature=0,
                            condition_on_previous_text=False,
                            initial_prompt=None, hotwords=None,
                            return_timestamps=True, verbose=None)
    record = {'model': model_id, 'prompted': False,
              'audioSha256': hashlib.sha256(args.audio.read_bytes()).hexdigest(),
              'text': result.text,
              'segments': [{'text': s['text'], 'start': float(s['start']),
                            'end': float(s['end'])} for s in result.segments]}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(record, indent=2) + '\n')
    print(f"Whisper proof saved: {args.output}; {len(record['segments'])} segments.")


if __name__ == '__main__':
    main()
