#!/usr/bin/env node
import { mkdir, mkdtemp, readFile, writeFile, access, copyFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { edition, audioBrief } from "../data/edition.ts";

const factory = "/Users/meltucker/avc-tools/avc-audio-render.sh";
const model = "mlx-community/Qwen3-TTS-12Hz-1.7B-Base-8bit";
const environment = {
  ...process.env,
  AVC_VENV: "/Users/meltucker/.local/venvs/mlx8080",
  AVC_MODEL: model,
  AVC_REF_WAV: "/Users/meltucker/avc-tools/breeze-proof/mel-az-2026-decl-18s.wav",
  AVC_REF_TXT: "/Users/meltucker/avc-tools/breeze-proof/mel-az-2026-decl-18s.txt",
  AVC_TRAIL_KEEP_MS: "120",
  AVC_GENERATE: "1",
};
const input = resolve("content/audio-brief-transcript.txt");
const output = resolve(`public${audioBrief.src.slice(edition.basePath.length)}`);
const transcript = await readFile(input, "utf8");
if (transcript.trim() !== audioBrief.paragraphs.join("\n\n")) throw new Error("Finalize and synchronize the Editor script first.");
if (!transcript.trim().endsWith("\n\nDominate.")) throw new Error("Required standalone closing missing.");
const work = await mkdtemp(join(tmpdir(), "echo-arizona-private-"));
const run = (program, args, options = {}) => {
  const result = spawnSync(program, args, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024, ...options });
  if (result.error || result.status !== 0) throw new Error(`Audio command failed; inspect private diagnostic ${work}.`);
  return result;
};
await access(environment.AVC_REF_WAV);
await access(environment.AVC_REF_TXT);
await access(`${environment.AVC_VENV}/bin/python`);
run(`${environment.AVC_VENV}/bin/python`, ["-c", "import mlx_audio; from huggingface_hub import snapshot_download; snapshot_download(repo_id=\"mlx-community/Qwen3-TTS-12Hz-1.7B-Base-8bit\",local_files_only=True,allow_patterns=[\"*.json\",\"*.safetensors\",\"*.model\",\"*.txt\"])"], { env: environment });
const preflight = run(factory, [], { env: environment });
await writeFile(join(work, "preflight.log"), preflight.stdout + preflight.stderr, { mode: 0o600 });
if (process.argv.includes("--verify-only")) {
  console.log("Arizona v12 factory and explicit approved reference pair verified. No narration rendered.");
  process.exit(0);
}
if (!edition.editorialFinal) throw new Error("Morning editorial update remains open; final Editor script required before rendering.");
try { await access(output); throw new Error("Output already exists. Increment the versioned filename after any transcript change."); }
catch (error) { if (error.code !== "ENOENT") throw error; }
await mkdir(dirname(output), { recursive: true });
const raw = join(work, "factory.mp3");
const rendered = spawnSync(factory, [input, raw], { env: environment, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
await writeFile(join(work, "render.log"), (rendered.stdout ?? "") + (rendered.stderr ?? ""), { mode: 0o600 });
if (rendered.error || rendered.status !== 0) throw new Error(`Arizona render failed; private diagnostic ${work}. No provider fallback.`);
const probe = JSON.parse(run("ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", raw]).stdout);
const stream = probe.streams.find(value => value.codec_type === "audio");
if (Number(stream.sample_rate) !== 24000 || stream.channels !== 1 || Number(stream.bit_rate) !== 160000) throw new Error("Arizona output does not match approved audio format.");
const decoded = spawnSync("ffmpeg", ["-v", "error", "-i", raw, "-f", "s16le", "-ac", "1", "-ar", "24000", "pipe:1"], { maxBuffer: 64 * 1024 * 1024 });
if (decoded.status !== 0) throw new Error("Audio decoding failed.");
const pcm = decoded.stdout;
let last = pcm.length / 2 - 1;
while (last >= 0 && Math.abs(pcm.readInt16LE(last * 2)) < 104) last--;
if (last < 0) throw new Error("Audio is silent.");
const tail = (pcm.length / 2 - last - 1) / 24000;
const end = (last + 1) / 24000 + 0.12;
const transcriptSha256 = createHash("sha256").update(transcript).digest("hex");
run("ffmpeg", ["-v", "error", "-y", "-i", raw, ...(tail > 0.3 ? ["-t", end.toFixed(6)] : []), "-ar", "24000", "-ac", "1", "-c:a", "libmp3lame", "-b:a", "160k", "-write_xing", "1", "-metadata", `title=${edition.title}`, "-metadata", "artist=Accelerated Velocity Consulting", "-metadata", `comment=transcript-sha256:${transcriptSha256}`, output]);
const silence = run("ffmpeg", ["-hide_banner", "-i", output, "-af", "silencedetect=noise=-50dB:d=0.3", "-f", "null", "-"]);
if (silence.stderr.includes("silence_start")) throw new Error("Final MP3 has a silence interval over 0.3 seconds. Keep audio readiness open.");
const loudness = run("ffmpeg", ["-hide_banner", "-i", output, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11:dual_mono=true:print_format=json", "-f", "null", "-"]);
const measured = JSON.parse(loudness.stderr.slice(loudness.stderr.lastIndexOf("{"), loudness.stderr.lastIndexOf("}") + 1));
if (Math.abs(Number(measured.input_i) + 16) > 1.5 || Number(measured.input_tp) > -1.5) throw new Error("Final loudness/true-peak gate failed.");
const finished = JSON.parse(run("ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", output]).stdout);
const finalDecoded = spawnSync("ffmpeg", ["-v", "error", "-i", output, "-f", "s16le", "-ac", "1", "-ar", "24000", "pipe:1"], { maxBuffer: 64 * 1024 * 1024 });
if (finalDecoded.status !== 0) throw new Error("Final audio decoding failed.");
let finalLast = finalDecoded.stdout.length / 2 - 1;
while (finalLast >= 0 && Math.abs(finalDecoded.stdout.readInt16LE(finalLast * 2)) < 104) finalLast--;
const finalTail = (finalDecoded.stdout.length / 2 - finalLast - 1) / 24000;
if (finalTail > 0.3) throw new Error("Final encoded file has excessive end silence.");
let blackRun = 0;
for (let index = 0; index < finalDecoded.stdout.length; index += 2) {
  blackRun = Math.abs(finalDecoded.stdout.readInt16LE(index)) < 4 ? blackRun + 1 : 0;
  if (blackRun >= 0.28 * 24000) throw new Error("Final encoded file has a digital black hole.");
}
const manifest = {
  voice: "Arizona v12", model, generatedAt: new Date().toISOString(),
  title: edition.title, file: output.split("/").at(-1), transcript: "content/audio-brief-transcript.txt",
  transcriptSha256, audioSha256: createHash("sha256").update(await readFile(output)).digest("hex"),
  sampleRate: 24000, channels: 1, bitrate: 160000, durationSeconds: Number(finished.format.duration),
  integratedLufs: Number(measured.input_i), truePeakDbtp: Number(measured.input_tp),
  trailingSilenceSeconds: finalTail, silenceScanPassed: true, digitalBlackHoleScanPassed: true,
  listeningConfirmed: false, playerVerified: false,
};
await writeFile(`${output}.json`, JSON.stringify(manifest, null, 2) + "\n");
await copyFile(input, "public/content/audio-brief-transcript.txt");
console.log(`Rendered ${manifest.file}; SHA-256 ${manifest.audioSha256}. Listening and player checks remain open.`);
