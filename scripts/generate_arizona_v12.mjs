#!/usr/bin/env node
// Edition-aware adapter for the approved private AVC Arizona v12 factory.
import { closeSync, mkdtempSync, mkdirSync, openSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const productFactory = join(root, 'scripts/avc_arizona_v12_factory.sh');
const args = process.argv.slice(2);
const mode = ['--calibrate', '--generate', '--transcribe'].find(value => args.includes(value));
const briefIndex = args.indexOf('--brief');
if (!mode || briefIndex < 0 || !args[briefIndex + 1]) {
  console.error('Usage: node scripts/generate_arizona_v12.mjs --brief briefs/YYYY-MM-DD-opponent.json --calibrate|--generate|--transcribe [audio]');
  process.exit(2);
}
const briefPath = resolve(root, args[briefIndex + 1]);
const brief = JSON.parse(readFileSync(briefPath, 'utf8'));
const transcript = String(brief.audio?.transcript || '').trim();
const signoff = 'Dominate.';
if (!transcript.startsWith('Mat, ')) throw new Error('Opening must address Mat within the first sentence');
if (!transcript.endsWith(signoff)) throw new Error('Pregame sign-off missing');
if (/\bMatt\b/.test(transcript)) throw new Error('Public transcript must use Mat with one T');
const transcriptPath = join(root, 'content/audio-brief-transcript.txt');
mkdirSync(dirname(transcriptPath), { recursive: true });
if (readFileSync(transcriptPath, 'utf8').trim() !== transcript) throw new Error('Locked transcript differs from brief');
const audioPath = resolve(root, brief.audio.filename);
const privateJob = process.env.AVC_PRIVATE_JOB || mkdtempSync(join(tmpdir(), 'echo-arizona-v12-'));

if (mode === '--transcribe') {
  const position = args.indexOf('--transcribe');
  const sourceArg = args[position + 1] && !args[position + 1].startsWith('--') ? args[position + 1] : null;
  const source = resolve(root, sourceArg || audioPath);
  const output = join(privateJob, 'transcription.json');
  const log = join(privateJob, 'transcription.log');
  const fd = openSync(log, 'w', 0o600);
  console.log(JSON.stringify({ status: 'transcribing-locally', source, output, privateLog: log }));
  const child = spawn('/Users/meltucker/.local/venvs/mlx8080/bin/python', [
    join(root, 'scripts/transcribe-echo-whisper.py'), '--audio', source, '--output', output,
  ], { env: { ...process.env, HF_HUB_OFFLINE: '1', TRANSFORMERS_OFFLINE: '1', PYTHONDONTWRITEBYTECODE: '1', TMPDIR: privateJob, DYLD_LIBRARY_PATH: '/opt/homebrew/Cellar/x265/4.1/lib' }, stdio: ['ignore', fd, fd] });
  child.on('exit', code => { closeSync(fd); console.log(JSON.stringify({ status: 'transcription-finished', code, output, privateLog: log })); process.exitCode = code || 0; });
} else {
  const privateSpeech = transcript
    .replace(/\bMat\b/g, 'Matt')
    .replace(/\bIghodaro\b/g, 'Ee go dah roh')
    .replace(/\bMaluach\b/g, 'Mah loo ahch')
    .replace(/\bKhaman\b/g, 'Kah mahn');
  const calibration = `${privateSpeech.split(/(?<=[.!?])\s+/).slice(0, 4).join(' ')} ${signoff}\n`;
  const script = join(privateJob, 'speech.txt');
  writeFileSync(script, mode === '--calibrate' ? calibration : privateSpeech, { mode: 0o600 });
  const output = mode === '--calibrate' ? join(privateJob, 'calibration.mp3') : audioPath;
  mkdirSync(dirname(output), { recursive: true });
  const log = join(privateJob, 'factory.log');
  const logFd = openSync(log, 'w', 0o600);
  const env = {
    ...process.env,
    AVC_REF_WAV: '/Users/meltucker/avc-tools/breeze-proof/mel-az-2026-decl-18s.wav',
    AVC_REF_TXT: '/Users/meltucker/avc-tools/breeze-proof/mel-az-2026-decl-18s.txt',
    AVC_MODEL: 'mlx-community/Qwen3-TTS-12Hz-1.7B-Base-8bit',
    AVC_VENV: process.env.AVC_VENV || '/Users/meltucker/.local/venvs/mlx8080',
    AVC_GENERATE: '1',
    AVC_WORKDIR: join(privateJob, 'sentences'),
    AVC_LEAD_KEEP_MS: '90',
    AVC_TRAIL_KEEP_MS: '180',
    AVC_SENTENCE_GAP_MS: '70',
    AVC_PARAGRAPH_GAP_MS: '220',
    AVC_FILE_LEAD_MS: '160',
    AVC_FILE_TAIL_MS: '180',
    PYTHONUNBUFFERED: '1',
    PYTHONDONTWRITEBYTECODE: '1',
    HF_HUB_OFFLINE: '1',
    TRANSFORMERS_OFFLINE: '1',
    TMPDIR: privateJob,
  };
  console.log(JSON.stringify({ status: 'rendering', mode, output, privateLog: log }));
  const child = spawn('/bin/bash', [productFactory, script, output], { env, stdio: ['ignore', logFd, logFd] });
  child.on('error', error => { closeSync(logFd); throw error; });
  child.on('exit', code => {
    closeSync(logFd);
    console.log(JSON.stringify({ status: code === 0 ? 'rendered-awaiting-review' : 'failed', code, output, privateLog: log }));
    process.exitCode = code || 0;
  });
}
