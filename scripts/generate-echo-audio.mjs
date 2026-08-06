#!/usr/bin/env node
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const DEFAULT_VOICE_ID = "Ib97zM6uFBc71OWgj75I";

const inputPath = resolve("content/audio-brief-transcript.txt");
const outputPath = resolve("public/audio/the-echo-suns-001-aligned-and-extended.mp3");
const narration = (await readFile(inputPath, "utf8")).trim();
if (!narration) throw new Error("Narration text is empty.");
if (!narration.endsWith("Dominate.")) throw new Error("Narration must end with Dominate.");

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) throw new Error("ELEVENLABS_API_KEY is required to generate narration.");

const workDir = await mkdtemp(join(tmpdir(), "the-echo-elevenlabs-"));
try {
  await mkdir(dirname(outputPath), { recursive: true });
  const voiceId = process.env.ELEVENLABS_VOICE_ID ?? DEFAULT_VOICE_ID;
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      text: narration,
      model_id: "eleven_multilingual_v2",
      language_code: "en",
      voice_settings: { stability: 0.42, similarity_boost: 0.76, style: 0.12, use_speaker_boost: true, speed: 0.96 }
    })
  });
  if (!response.ok) throw new Error(`ElevenLabs generation failed with status ${response.status}.`);

  const rawPath = join(workDir, "raw.mp3");
  await writeFile(rawPath, Buffer.from(await response.arrayBuffer()));
  const ffmpeg = spawnSync("ffmpeg", [
    "-hide_banner", "-loglevel", "error", "-y", "-i", rawPath,
    "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ac", "1",
    "-codec:a", "libmp3lame", "-b:a", "96k",
    "-metadata", "title=The Echo Suns 001: Aligned and Extended",
    "-metadata", "artist=Accelerated Velocity Consulting",
    outputPath
  ], { encoding: "utf8" });
  if (ffmpeg.error) throw ffmpeg.error;
  if (ffmpeg.status !== 0) throw new Error(`Audio finishing failed: ${ffmpeg.stderr}`);
  console.log(`Generated ${outputPath}`);
} finally {
  await rm(workDir, { recursive: true, force: true });
}
