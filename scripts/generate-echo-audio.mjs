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
  AVC_REF_WAV: process.env.AVC_REF_WAV,
  AVC_REF_TXT: process.env.AVC_REF_TXT,
  HF_HUB_DISABLE_XET: "1",
  AVC_GENERATE: "1",
};
if (!environment.AVC_REF_WAV || !environment.AVC_REF_TXT) throw new Error("An explicitly approved conversational Arizona WAV and matching TXT are required. Rendering is stopped; no reference fallback.");
if (environment.AVC_REF_WAV.endsWith("mel-az-2026-decl-18s.wav")) throw new Error("The final pass requires the approved conversational replacement reference.");
const input = resolve("content/audio-brief-transcript.txt");
const output = resolve(`public${audioBrief.src.slice(edition.basePath.length)}`);
const transcript = await readFile(input, "utf8");
if (transcript.trim() !== audioBrief.paragraphs.join("\n\n")) throw new Error("Finalize and synchronize the Editor script first.");
if (!transcript.trim().endsWith("\n\nDominate.")) throw new Error("Required standalone closing missing.");
const resumeIndex = process.argv.indexOf("--resume-workdir");
if (resumeIndex >= 0 && !process.argv[resumeIndex + 1]) throw new Error("Resume workdir required.");
const resumeWorkdir = resumeIndex < 0 ? null : resolve(process.argv[resumeIndex + 1]);
const work = resumeWorkdir ?? await mkdtemp(join(tmpdir(), "echo-arizona-private-"));
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
await writeFile(join(work, resumeWorkdir ? "preflight-resume.log" : "preflight.log"), preflight.stdout + preflight.stderr, { mode: 0o600 });
if (process.argv.includes("--verify-only")) {
  console.log("Arizona v12 factory and explicit approved reference pair verified. No narration rendered.");
  process.exit(0);
}
if (!edition.editorialFinal) throw new Error("Morning editorial update remains open; final Editor script required before rendering.");
try { await access(output); throw new Error("Output already exists. Increment the versioned filename after any transcript change."); }
catch (error) { if (error.code !== "ENOENT") throw error; }
await mkdir(dirname(output), { recursive: true });
const configIndex = process.argv.indexOf("--pronunciation-config");
if (configIndex >= 0 && !process.argv[configIndex + 1]) throw new Error("Pronunciation configuration path required.");
const pronunciationConfig = configIndex >= 0 ? resolve(process.argv[configIndex + 1]) : null;
const modeIndex = process.argv.indexOf("--generation-mode");
const generationMode = modeIndex < 0 ? "sentence" : process.argv[modeIndex + 1];
if (!["sentence", "paragraph"].includes(generationMode)) throw new Error("Generation mode must be sentence or paragraph.");
const raw = join(work, "finished.mp3");
const renderer = resolve("scripts/echo-audio-render.py");
const rendered = spawnSync(`${environment.AVC_VENV}/bin/python`, [renderer, input, raw, "--workdir", work, "--generation-mode", generationMode,
  ...(resumeWorkdir ? ["--resume"] : []),
  ...(pronunciationConfig ? ["--pronunciation-config", pronunciationConfig] : [])],
  { env: environment, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
await writeFile(join(work, resumeWorkdir ? "render-resume.log" : "render.log"), (rendered.stdout ?? "") + (rendered.stderr ?? ""), { mode: 0o600 });
if (rendered.error || rendered.status !== 0) throw new Error(`Arizona render failed; private diagnostic ${work}. No provider fallback.`);
const probe = JSON.parse(run("ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", raw]).stdout);
const stream = probe.streams.find(value => value.codec_type === "audio");
if (Number(stream.sample_rate) !== 24000 || stream.channels !== 1 || Number(stream.bit_rate) !== 160000) throw new Error("Arizona output does not match approved audio format.");
// Copy the finished bitstream without a second lossy encode or amplitude-based cut.
const transcriptSha256 = createHash("sha256").update(transcript).digest("hex");
run("ffmpeg", ["-v", "error", "-y", "-i", raw, "-c:a", "copy", "-write_xing", "1", "-metadata", `title=${edition.title}`, "-metadata", "artist=Accelerated Velocity Consulting", "-metadata", `comment=transcript-sha256:${transcriptSha256}`, output]);
const silence = run("ffmpeg", ["-hide_banner", "-i", output, "-af", "silencedetect=noise=-65dB:d=1.2", "-f", "null", "-"]);
if (silence.stderr.includes("silence_start")) throw new Error("Unexpected silence interval of at least 1.2 seconds. Inspect private sentence renders; never collapse speech pauses to pass QA.");
const loudness = run("ffmpeg", ["-hide_banner", "-i", output, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11:dual_mono=false:print_format=json", "-f", "null", "-"]);
const measured = JSON.parse(loudness.stderr.slice(loudness.stderr.lastIndexOf("{"), loudness.stderr.lastIndexOf("}") + 1));
if (Math.abs(Number(measured.input_i) + 16) > 0.3 || Number(measured.input_tp) > -1.5) throw new Error("Final loudness/true-peak gate failed.");
const finished = JSON.parse(run("ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", output]).stdout);
const finalDecoded = spawnSync("ffmpeg", ["-v", "error", "-i", output, "-f", "s16le", "-ac", "1", "-ar", "24000", "pipe:1"], { maxBuffer: 64 * 1024 * 1024 });
if (finalDecoded.status !== 0) throw new Error("Final audio decoding failed.");
// Match the renderer's 10ms / -65dB RMS endpoint detector, preserving quiet consonants.
const pcm = finalDecoded.stdout;
const windowSamples = 240;
let finalLast = -1;
for (let start = 0; start < pcm.length / 2; start += windowSamples) {
  const end = Math.min(start + windowSamples, pcm.length / 2);
  let energy = 0;
  for (let index = start; index < end; index++) energy += pcm.readInt16LE(index * 2) ** 2;
  if (Math.sqrt(energy / (end - start)) >= 32768 * 10 ** (-65 / 20)) finalLast = end;
}
if (finalLast < 0) throw new Error("Final audio is silent.");
const finalTail = (pcm.length / 2 - finalLast) / 24000;
if (finalTail > 0.3) throw new Error("Final encoded file has excessive end silence; inspect finishing without cutting speech.");
let blackRun = 0;
for (let index = 0; index < pcm.length; index += 2) {
  blackRun = Math.abs(pcm.readInt16LE(index)) < 4 ? blackRun + 1 : 0;
  if (blackRun >= 1.2 * 24000) throw new Error("Unexpected digital silence of at least 1.2 seconds.");
}
const renderMetadata = JSON.parse(await readFile(join(work, "render-metadata.json"), "utf8"));
if (renderMetadata.transcriptSha256 !== transcriptSha256) throw new Error("Renderer transcript binding mismatch.");
const manifest = {
  voice: "Arizona v12", model, generatedAt: new Date().toISOString(),
  title: edition.title, file: output.split("/").at(-1), transcript: "content/audio-brief-transcript.txt",
  reference: {
    audioSha256: createHash("sha256").update(await readFile(environment.AVC_REF_WAV)).digest("hex"),
    textSha256: createHash("sha256").update(await readFile(environment.AVC_REF_TXT)).digest("hex"),
  },
  transcriptSha256, audioSha256: createHash("sha256").update(await readFile(output)).digest("hex"),
  sampleRate: 24000, channels: 1, bitrate: 160000, durationSeconds: Number(finished.format.duration),
  integratedLufs: Number(measured.input_i), truePeakDbtp: Number(measured.input_tp),
  trailingSilenceSeconds: finalTail, silenceScanPassed: true, digitalBlackHoleScanPassed: true,
  finishing: {
    renderer: renderMetadata.renderer,
    generationMode: renderMetadata.generationMode,
    resumedRawGeneration: renderMetadata.resumedRawGeneration,
    generationPasses: renderMetadata.generationPasses,
    normalization: renderMetadata.normalization,
    sampling: renderMetadata.sampling,
    rendererSha256: createHash("sha256").update(await readFile(renderer)).digest("hex"),
    spokenInputSha256: renderMetadata.spokenInputSha256,
    pronunciationConfigSha256: renderMetadata.pronunciationConfigSha256,
    maxTokens: renderMetadata.maxTokens,
    trailingPaddingSeconds: renderMetadata.trailingPaddingSeconds,
    sentencePauseSeconds: renderMetadata.sentencePauseSeconds,
    paragraphPauseSeconds: renderMetadata.paragraphPauseSeconds,
    maximumBoundaryPauseSeconds: Math.max(0, ...renderMetadata.joins.map(value => value.pauseSeconds)),
    tempoMultiplier: 1, crossfadeSeconds: renderMetadata.crossfadeSeconds, globalPauseCollapse: false,
    endpointRmsThresholdDb: -65, endpointWindowMilliseconds: 10,
    unexpectedSilenceThresholdSeconds: 1.2,
  },
  listeningConfirmed: false, playerVerified: false,
};
await writeFile(`${output}.json`, JSON.stringify(manifest, null, 2) + "\n");
await copyFile(input, "public/content/audio-brief-transcript.txt");
console.log(`Rendered ${manifest.file}; SHA-256 ${manifest.audioSha256}. Private QA artifacts: ${work}. Listening and player checks remain open.`);
