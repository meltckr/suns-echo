#!/bin/bash
# Mercury pregame Arizona v12 factory.
# Qwen3-TTS-12Hz-1.7B-Base 8-bit ICL. Never --join_audio.
# Sentence joins preserve guarded onsets, endings, and natural paragraph space.
set -euo pipefail
export PATH="/opt/homebrew/bin:/usr/bin:/bin:$PATH"
export HF_HUB_DISABLE_XET=1
export DYLD_LIBRARY_PATH="/opt/homebrew/Cellar/x265/4.1/lib${DYLD_LIBRARY_PATH:+:$DYLD_LIBRARY_PATH}"

VENV="${AVC_VENV:-/tmp/avc/mlx-audio-venv}"
MODEL="${AVC_MODEL:-mlx-community/Qwen3-TTS-12Hz-1.7B-Base-8bit}"
REF_WAV="${AVC_REF_WAV:-/Users/meltucker/avc-tools/breeze-proof/mel-az-2026-decl-18s.wav}"
REF_TXT="${AVC_REF_TXT:-/Users/meltucker/avc-tools/breeze-proof/mel-az-2026-decl-18s.txt}"
CONSENT_WAV="/Users/meltucker/avc-tools/breeze-proof/chirp-consent.wav"
LANG="${AVC_LANG:-english}"

echo "== verify =="
command -v ffmpeg >/dev/null
command -v ffprobe >/dev/null
test -f "$REF_WAV"
test -f "$REF_TXT"
if echo "$MODEL" | grep -qi breeze; then echo "FAIL: Breeze is NC." >&2; exit 1; fi
if [ "${AVC_REF_WAV:-}" = "$CONSENT_WAV" ]; then echo "FAIL: consent wav" >&2; exit 1; fi
echo "MODEL=$MODEL"
echo "LANG_CODE=$LANG"
echo "ICL_REF_WAV=$REF_WAV"
echo "ICL_REF_TXT=$(tr -d '\n' < "$REF_TXT")"
echo "verify ok"
if [ "${1:-}" = "" ]; then echo "STOP: verify-only"; exit 0; fi
BRIEF="${1:?brief}"; OUT="${2:?out mp3}"
test -f "$BRIEF"
if [ "${AVC_GENERATE:-0}" != "1" ]; then echo "STOP: set AVC_GENERATE=1"; exit 2; fi
test -x "$VENV/bin/python"
WORKDIR="${AVC_WORKDIR:-${TMPDIR:-/tmp}/avc-audio-$$}"
umask 077
mkdir -p "$WORKDIR"
if [ -z "${AVC_WORKDIR:-}" ]; then trap 'rm -rf "$WORKDIR"' EXIT; fi
# shellcheck disable=SC1091
source "$VENV/bin/activate"
python - "$BRIEF" "$WORKDIR" "$OUT" "$MODEL" "$REF_WAV" "$REF_TXT" "$LANG" << 'PY'
import json, os, re, subprocess, sys, array
from pathlib import Path
brief, wd, out, model_id, ref_wav, ref_txt, lang = sys.argv[1:8]
wd, out = Path(wd), Path(out)
text = Path(brief).read_text().strip()
parts = []
gap_kinds = []
paragraphs = [p.strip() for p in re.split(r'\n\s*\n+', text) if p.strip()]
for paragraph_index, paragraph in enumerate(paragraphs):
    sentences = [p.strip() for p in re.split(r'(?<=[.!?])\s+', paragraph) if p.strip()]
    for sentence_index, sentence in enumerate(sentences):
        parts.append(sentence)
        if sentence_index < len(sentences) - 1:
            gap_kinds.append("sentence")
        elif paragraph_index < len(paragraphs) - 1:
            gap_kinds.append("paragraph")
if not parts:
    raise SystemExit("empty brief")
for i, p in enumerate(parts):
    (wd / f"{i:03d}.txt").write_text(p + "\n")
print(len(parts), "sentences")
ref_text = Path(ref_txt).read_text().strip()
print("ICL_REF_WAV", ref_wav)
print("ICL_REF_TXT", ref_text)
print("LANG_CODE", lang)
from mlx_audio.tts.generate import generate_audio, load_model
import mlx.core as mx
print("LOAD_MODEL_ONCE", model_id)
model = load_model(model_path=model_id)
print("MODEL_LOADED")
try:
    mx.random.seed(42)
    print("SEED=42 mx.random.seed")
except Exception as e:
    print("SEED_UNAVAILABLE", e)
requested = os.environ.get("AVC_SENTENCE_INDICES")
selected = set(int(value) for value in requested.split(",")) if requested else None
if selected is not None and any(i < 0 or i >= len(parts) for i in selected):
    raise SystemExit("invalid retry sentence index")
for i, sent in enumerate(parts):
    if selected is not None and i not in selected:
        if not list(wd.glob(f"{i:03d}*.wav")):
            raise SystemExit(f"missing cached sentence {i}")
        print(f"REUSE_RAW sentence={i:03d}")
        continue
    try:
        mx.random.seed(42)
    except Exception:
        pass
    print(f"ICL_CMD sentence={i:03d} lang={lang} temperature=0.9 top_k=50 max_tokens=384")
    generate_audio(
        model=model,
        text=sent,
        voice=None,
        ref_audio=ref_wav,
        ref_text=ref_text,
        lang_code=lang,
        temperature=0.9,
        top_k=50,
        repetition_penalty=1.5,
        max_tokens=384,
        output_path=str(wd),
        file_prefix=f"{i:03d}",
        audio_format="wav",
        join_audio=False,
        verbose=True,
    )
print("ICL_ATTACH=one reusable punchy prompt Voice=None")
sr = 24000
lead_keep = int(float(os.environ.get("AVC_LEAD_KEEP_MS", "90")) / 1000.0 * sr)
trail_keep = int(float(os.environ.get("AVC_TRAIL_KEEP_MS", "180")) / 1000.0 * sr)
sentence_gap = int(float(os.environ.get("AVC_SENTENCE_GAP_MS", "70")) / 1000.0 * sr)
paragraph_gap = int(float(os.environ.get("AVC_PARAGRAPH_GAP_MS", "220")) / 1000.0 * sr)
file_lead = int(float(os.environ.get("AVC_FILE_LEAD_MS", "160")) / 1000.0 * sr)
file_tail = int(float(os.environ.get("AVC_FILE_TAIL_MS", "180")) / 1000.0 * sr)
chunks = []
for i in range(len(parts)):
    cands = sorted(wd.glob(f"{i:03d}*.wav"))
    wav = next((p for p in cands if p.is_file()), None)
    if wav is None:
        raise SystemExit(f"missing {i:03d}")
    p = subprocess.run(
        ["ffmpeg","-hide_banner","-loglevel","error","-i",str(wav),"-ac","1","-ar",str(sr),"-f","s16le","pipe:1"],
        capture_output=True, check=True,
    )
    a = array.array("h"); a.frombytes(p.stdout)
    samps = [x/32768.0 for x in a]
    thr = 10 ** (-50/20.0)
    nsam = len(samps)
    lo = 0
    while lo < nsam and abs(samps[lo]) < thr:
        lo += 1
    hi = nsam
    while hi > 0 and abs(samps[hi-1]) < thr:
        hi -= 1
    if lo >= hi:
        raise SystemExit(f"FAIL: sentence {i} contains no audible speech")
    start = max(0, lo - lead_keep)
    end = min(nsam, hi + trail_keep)
    samps = samps[start:end]
    existing_lead = lo - start
    existing_trail = end - hi
    if existing_lead < lead_keep:
        samps = [0.0] * (lead_keep - existing_lead) + samps
    if existing_trail < trail_keep:
        samps += [0.0] * (trail_keep - existing_trail)
    if i == len(parts) - 1 and os.environ.get("AVC_HOTTER_SIGNOFF", "0") == "1":
        samps = [min(0.98, x * 1.22) for x in samps]
        print(f"guard sentence {i}: {nsam/sr:.3f}s -> {len(samps)/sr:.3f}s HOTTER_SIGNOFF=1.22")
    else:
        print(f"guard sentence {i}: {nsam/sr:.3f}s -> {len(samps)/sr:.3f}s")
    chunks.append(samps)
print(
    "JOIN_GUARDS"
    f" lead={lead_keep/sr:.3f}s trail={trail_keep/sr:.3f}s"
    f" sentence_gap={sentence_gap/sr:.3f}s paragraph_gap={paragraph_gap/sr:.3f}s"
    f" file_lead={file_lead/sr:.3f}s file_tail={file_tail/sr:.3f}s"
)
acc = [0.0] * file_lead
for i, chunk in enumerate(chunks):
    acc += chunk
    if i < len(chunks) - 1:
        gap = paragraph_gap if gap_kinds[i] == "paragraph" else sentence_gap
        if i == len(chunks) - 2 and parts[-1].strip() == "Dominate!":
            gap = int(float(os.environ.get("AVC_SIGNOFF_GAP_MS", "220")) / 1000.0 * sr)
            print(f"SIGNOFF_GAP_MS={gap / sr * 1000:.0f}")
        acc += [0.0] * gap
acc += [0.0] * file_tail
print(f"guarded_concat {len(acc)/sr:.3f}s")
pcm = wd/"cat.s16"
pcm.write_bytes(array.array("h", [max(-32767, min(32767, int(x*32767))) for x in acc]).tobytes())
# rubberband missing on this ffmpeg: atempo=1.15 ONCE on joined wav BEFORE loudnorm
sped = wd/"sped.s16"
subprocess.run([
    "ffmpeg","-y","-hide_banner","-loglevel","error",
    "-f","s16le","-ar",str(sr),"-ac","1","-i",str(pcm),
    "-af","atempo=1.15",
    "-f","s16le","-ar",str(sr),"-ac","1",str(sped),
], check=True)
print("SPEED_METHOD=atempo=1.15 once on joined wav (ffmpeg rubberband=NO)")
print("RUBBERBAND=NO")
eq = "highpass=f=80,equalizer=f=250:t=q:w=1:g=-3,equalizer=f=3500:t=q:w=1:g=2,deesser=i=0.2:m=0.5:f=0.55"
measure = subprocess.run([
    "ffmpeg","-hide_banner","-f","s16le","-ar",str(sr),"-ac","1","-i",str(sped),
    "-af", eq + ",loudnorm=I=-16:TP=-1.5:LRA=11:dual_mono=true:print_format=json",
    "-f","null","-",
], capture_output=True, text=True)
blob = measure.stderr + measure.stdout
start, end = blob.rfind("{"), blob.rfind("}")
if start < 0 or end < 0:
    raise SystemExit("FAIL: loudnorm pass1 JSON missing (no alimiter fallback)")
stats = json.loads(blob[start:end+1])
ln2 = (
    f"loudnorm=I=-16:TP=-1.5:LRA=11:linear=true:dual_mono=true:"
    f"measured_I={stats['input_i']}:measured_LRA={stats['input_lra']}:"
    f"measured_TP={stats['input_tp']}:measured_thresh={stats['input_thresh']}:"
    f"offset={stats['target_offset']}"
)
subprocess.run([
    "ffmpeg","-y","-hide_banner","-loglevel","error",
    "-f","s16le","-ar",str(sr),"-ac","1","-i",str(sped),
    "-af", eq + "," + ln2,
    "-ar",str(sr),"-ac","1","-c:a","libmp3lame","-b:a","160k","-write_xing","1",
    str(out),
], check=True)
print("NORM_METHOD=two-pass loudnorm I=-16 TP=-1.5 LRA=11 linear=true dual_mono=true")
print("EQ=highpass=f=80, -3@250, +2@3500, deesser 5-8k, no +6k")
print("JOIN_METHOD=guarded concatenation; no crossfade or global pause collapse")
det = subprocess.run(
    ["ffmpeg","-hide_banner","-i",str(out),"-af","silencedetect=noise=-50dB:d=0.90","-f","null","-"],
    capture_output=True, text=True,
)
if "silence_start" in (det.stderr+det.stdout):
    raise SystemExit("FAIL: unexpected silence longer than 0.90s in output")
p = subprocess.run(
    ["ffmpeg","-hide_banner","-loglevel","error","-i",str(out),"-ac","1","-ar",str(sr),"-f","s16le","pipe:1"],
    capture_output=True, check=True,
)
a = array.array("h"); a.frombytes(p.stdout)
thr, min_run, i, nsam = 4, int(0.90*sr), 0, len(a)
while i < nsam:
    if abs(a[i]) < thr:
        j=i
        while j<nsam and abs(a[j]) < thr:
            j+=1
        if j-i >= min_run:
            raise SystemExit(f"FAIL: digital-black {i/sr:.3f}-{j/sr:.3f}s")
        i=j
    else:
        i+=1
dur = subprocess.check_output(
    ["ffprobe","-v","error","-show_entries","format=duration","-of","default=nw=1:nk=1",str(out)],
    text=True,
).strip()
print("OK", out, "duration", dur)
PY
