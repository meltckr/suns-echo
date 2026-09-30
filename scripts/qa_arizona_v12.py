#!/usr/bin/env python3
"""Bounded local Arizona v12 proof. This never claims a perceptual listen."""
from __future__ import annotations

import argparse
import array
import hashlib
import json
import math
import os
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SIGNOFF = "Dominate!"
MODEL = "mlx-community/Qwen3-TTS-12Hz-1.7B-Base-8bit"
FACTORY = ROOT / "scripts" / "avc_arizona_v12_factory.sh"


def run(args: list[str]) -> subprocess.CompletedProcess:
    env = {**os.environ, "DYLD_LIBRARY_PATH": "/opt/homebrew/Cellar/x265/4.1/lib"}
    return subprocess.run(args, check=True, capture_output=True, env=env)


def longest_run(samples: array.array, threshold: int) -> float:
    longest = current = 0
    for value in samples:
        if abs(value) < threshold:
            current += 1
            longest = max(longest, current)
        else:
            current = 0
    return longest / 24000


def edge_silence(samples: array.array, threshold: int, reverse: bool = False) -> float:
    sequence = reversed(samples) if reverse else samples
    count = 0
    for value in sequence:
        if abs(value) >= threshold:
            break
        count += 1
    return count / 24000


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--brief", required=True, type=Path)
    parser.add_argument("--audio", type=Path)
    parser.add_argument("--calibration", action="store_true")
    parser.add_argument("--asr-report", type=Path, help="Optional private local-ASR output for this exact audio")
    args = parser.parse_args()
    brief_path = args.brief if args.brief.is_absolute() else ROOT / args.brief
    brief = json.loads(brief_path.read_text())
    transcript = brief["audio"]["transcript"].strip()
    transcript_bytes = transcript.encode()
    audio = args.audio or ROOT / brief["audio"]["filename"]
    data = audio.read_bytes()

    ffprobe = json.loads(run(["/opt/homebrew/bin/ffprobe", "-v", "error", "-show_format", "-show_streams", "-of", "json", str(audio)]).stdout)
    stream = next(item for item in ffprobe["streams"] if item["codec_type"] == "audio")
    duration = float(ffprobe["format"]["duration"])
    decoded = run(["/opt/homebrew/bin/ffmpeg", "-hide_banner", "-loglevel", "error", "-i", str(audio), "-ac", "1", "-ar", "24000", "-f", "s16le", "pipe:1"])
    samples = array.array("h")
    samples.frombytes(decoded.stdout)
    silence = run(["/opt/homebrew/bin/ffmpeg", "-hide_banner", "-i", str(audio), "-af", "silencedetect=noise=-50dB:d=0.90", "-f", "null", "-"])
    loudness = run(["/opt/homebrew/bin/ffmpeg", "-hide_banner", "-i", str(audio), "-af", "loudnorm=I=-16:TP=-1.5:LRA=11:dual_mono=true:print_format=json", "-f", "null", "-"])
    loud_text = loudness.stderr.decode()
    measured = json.loads(loud_text[loud_text.rfind("{"):loud_text.rfind("}") + 1])
    clipped = sum(1 for sample in samples if abs(sample) >= 32767)
    longest_black = longest_run(samples, 4)
    longest_zero = longest_run(samples, 1)
    leading_silence = edge_silence(samples, 80)
    trailing_silence = edge_silence(samples, 80, reverse=True)
    # Ignore normal MP3 encoder delay at the file edges when checking for
    # digital-zero gaps inside the spoken program.
    edge = int(0.15 * 24000)
    interior = samples[edge:-edge] if len(samples) > edge * 2 else samples
    longest_zero_interior = longest_run(interior, 1)
    checks = {
        "nonempty_mp3": len(data) > 10000 and stream["codec_name"] == "mp3",
        "mono": stream["channels"] == 1,
        "sample_rate_24000": int(stream["sample_rate"]) == 24000,
        "delivery_bitrate_160k": int(stream["bit_rate"]) == 160000,
        "xing_or_cbr_info_header": b"Xing" in data[:4096] or b"Info" in data[:4096],
        "duration_in_range": (15 <= duration <= 60) if args.calibration else (30 <= duration <= 150),
        "no_clipped_samples": clipped == 0,
        "opening_guard_120ms": 0.12 <= leading_silence <= 1.0,
        "closing_guard_120ms": 0.12 <= trailing_silence <= 1.0,
        "no_unexpected_silence_holes_900ms": "silence_start" not in silence.stderr.decode(),
        "no_digital_black_900ms": longest_black < 0.90,
        "no_interior_zero_runs_900ms": longest_zero_interior < 0.90,
        "integrated_loudness_near_target": abs(float(measured["input_i"]) - (-16)) <= 1.5,
        "true_peak_at_or_below_target": float(measured["input_tp"]) <= -1.5,
        "transcript_starts_with_mat": transcript.startswith("Mat, "),
        "transcript_exact_signoff": transcript.endswith(SIGNOFF),
        "no_visible_matt": not re.search(r"\bMatt\b", transcript),
    }
    metadata = {
        "schema_version": 2,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "edition": brief.get("edition", brief_path.stem),
        "title": brief["title"],
        "provider": "arizona-v12",
        "voice_name": "AVC Arizona v12",
        "model_id": MODEL,
        "runtime": {"mlx_audio": "0.5.1", "mlx": "0.32.1"},
        "factory_sha256": hashlib.sha256(FACTORY.read_bytes()).hexdigest(),
        "recipe": {
            "reference_profile": "approved-declarative-18s",
            "sentence_level": True,
            "seed": 42,
            "temperature": 0.9,
            "top_k": 50,
            "repetition_penalty": 1.5,
            "max_tokens_per_sentence": 384,
            "mlx_join_audio": False,
            "atempo": 1.15,
            "join_guard_version": "guarded-v1",
            "crossfade_ms": 0,
            "leading_guard_ms": 90,
            "trailing_guard_ms": 180,
            "sentence_gap_ms": 70,
            "paragraph_gap_ms": 220,
            "file_lead_ms": 160,
            "file_tail_ms": 180,
            "loudnorm_passes": 2,
            "target_integrated_lufs_dual_mono": -16,
            "target_true_peak_dbtp": -1.5,
            "delivery_bitrate_kbps": 160,
            "sample_rate_hz": 24000,
            "channels": 1,
        },
        "delivery_bitrate_kbps": 160,
        "sample_rate_hz": 24000,
        "channels": 1,
        "duration_seconds": duration,
        "duration_label": f"{int(round(duration)) // 60}:{int(round(duration)) % 60:02d}",
        "byte_count": len(data),
        "word_count": len(transcript.split()),
        "transcript_sha256": hashlib.sha256(transcript_bytes).hexdigest(),
        "audio_sha256": hashlib.sha256(data).hexdigest(),
        "required_sign_off": SIGNOFF,
        "measured_audio": {
            "integrated_lufs_dual_mono": float(measured["input_i"]),
            "true_peak_dbtp": float(measured["input_tp"]),
            "loudness_range_lu": float(measured["input_lra"]),
            "sample_peak_dbfs": 20 * math.log10(max(abs(value) for value in samples) / 32768),
            "clipped_samples": clipped,
            "longest_digital_black_seconds": longest_black,
            "longest_zero_run_seconds": longest_zero,
            "longest_interior_zero_run_seconds": longest_zero_interior,
            "leading_silence_seconds": leading_silence,
            "trailing_silence_seconds": trailing_silence,
        },
        "review": {
            "mode": "bounded-technical",
            "technical_pass": all(checks.values()),
            "checks": checks,
            "perceptual_listening_completed": False,
            "full_listen_status": "pending",
            "spoken_word_alignment_verified": False,
            "hosted_audio_verified": False,
            "publication_authorized": False,
            "note": "Technical file checks only. A complete human listen remains required before approval or publication.",
        },
    }
    output = audio.with_suffix(".metadata.json")
    previous_word_check = None
    if output.exists():
        previous = json.loads(output.read_text())
        if previous.get("audio_sha256") == metadata["audio_sha256"]:
            previous_word_check = (previous.get("review") or {}).get("automated_word_check")
    if args.asr_report:
        asr = json.loads(args.asr_report.read_text())
        recognized = re.sub(r"[^a-z0-9 ]", "", asr.get("text", "").lower())
        recognized = re.sub(r"\s+", " ", recognized).strip()
        recognized_close = recognized.endswith("dominate")
        metadata["review"]["automated_word_check"] = {
            "provider": "local-mlx-whisper",
            "model": asr.get("model", "whisper-base-mlx"),
            "audio_sha256": metadata["audio_sha256"],
            "exact_signoff_recognized": recognized_close,
            "perceptual_listening": False,
        }
        checks["automated_signoff_recognized"] = recognized_close
        metadata["review"]["technical_pass"] = all(checks.values())
    elif previous_word_check:
        metadata["review"]["automated_word_check"] = previous_word_check
        checks["automated_signoff_recognized"] = bool(previous_word_check.get("exact_signoff_recognized"))
        metadata["review"]["technical_pass"] = all(checks.values())
    if args.calibration:
        print(json.dumps(metadata, indent=2))
    else:
        output.write_text(json.dumps(metadata, indent=2) + "\n")
        print(json.dumps({"metadata": str(output), "duration_seconds": duration, "technical_pass": all(checks.values()), "checks": checks}, indent=2))
    if not all(checks.values()):
        raise SystemExit(1)


if __name__ == "__main__":
    main()
