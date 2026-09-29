import { readFile, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import sharp from "sharp";
import { sources, edition, alignment, audioBrief, heroMedia } from "../data/edition.ts";

const release = process.argv.includes("--release");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const localPath = (url) => `public${url.slice(edition.basePath.length)}`;
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
const [dashboard, layout, styles, data, transcript, publicTranscript] = await Promise.all(
  ["app/Dashboard.tsx", "app/layout.tsx", "app/globals.css", "data/edition.ts", "content/audio-brief-transcript.txt", "public/content/audio-brief-transcript.txt"].map(path => readFile(path, "utf8"))
);
const allText = [dashboard, layout, styles, data, transcript].join("\n");
for (const token of ["THE ECHO", edition.title, "Ownership readout", "Source ledger", "Where the voices align", "#DOMINATE", "Mat"]) check(allText.includes(token), `Missing edition element: ${token}`);
for (const token of ["Matt Ishbia", "Aligned and Extended", "The Plum Effect", "Kelsey Plum", "Phoenix Mercury", "dillon-brooks-hero-v2", "suns-echo.netlify.app"]) check(!allText.includes(token), `Stale or forbidden content: ${token}`);
check(sources.length === edition.sourceCount, "Source count mismatch");
check(new Set(sources.map(source => source.id)).size === sources.length, "Duplicate source IDs");
for (const source of sources) {
  check(source.url.startsWith("https://"), `Source must use HTTPS: ${source.id}`);
  check(["Event", "Preview", "Background"].includes(source.phase), `Missing reporting phase: ${source.id}`);
  if (source.quote) {
    check(source.quoteType === "Direct quote" && !!source.speaker && !!source.quoteContext, `Quote attribution incomplete: ${source.id}`);
    check(!source.quote.includes("…"), `Omitted quote passage: ${source.id}`);
  }
}
for (const item of alignment) {
  check(new Set(item.evidence.map(voice => voice.speaker)).size >= 2, `Alignment needs multiple named principals: ${item.id}`);
  for (const voice of item.evidence) check(sources.some(source => source.id === voice.sourceId && source.phase === "Event"), `Alignment source missing or predates event: ${voice.sourceId}`);
}
for (const id of edition.readoutSourceIds) check(sources.some(source => source.id === id), `Readout source missing: ${id}`);
check(transcript.trim() === audioBrief.paragraphs.join("\n\n"), "Editor transcript differs from page transcript");
check(transcript === publicTranscript, "Public transcript differs from Editor transcript");
check(transcript.trim().endsWith("\n\nDominate."), "Required standalone audio closing missing");
check(audioBrief.title === edition.title, "Audio title differs from edition title");
check(dashboard.includes('eyebrow: "Audio"'), "Player label must be Audio");
check(styles.includes("prefers-reduced-motion") && dashboard.includes("Pause background motion"), "Motion accessibility missing");
const playerHashes = {
  "mel-audio-player.js": "14644aeeab42d18917aa155c5511ba4ec7db56bafc039c748cda14ca15fa86ac",
  "player-utils.mjs": "fbf4d7ddfdcb301341564811dc1ad16847b03e7374e2de52389b2b181e01666e",
};
for (const [file, expected] of Object.entries(playerHashes)) check(sha(await readFile(`public/assets/mel-audio-player/${file}`)) === expected, `Approved player changed: ${file}`);
await access("public/assets/brand/AVC-logo-horizontal-dark.svg");
await access("public/assets/teams/suns-logo.svg");
const og = await sharp("public/og-media-day-2026-09-28-v1.png").metadata();
check(og.width === 1200 && og.height === 630 && og.format === "png", "OG must be a 1200x630 PNG");
for (const token of ["https://meltckr.github.io", "summary_large_image", "siteName", "1200", "630", "og-media-day-2026-09-28-v1.png"]) check(layout.includes(token), `Social metadata incomplete: ${token}`);
const photos = JSON.parse(await readFile("research/media-day-2026-09-28/photo-ledger.json", "utf8"));
check(photos.eventDate === "2026-09-28", "Photos must be from current Media Day");
check(Array.isArray(photos.photos) && photos.photos.length > 0, "Real photo ledger missing");
for (const photo of photos.photos ?? []) { await access(photo.localPath); check(!!photo.sourceUrl && !!photo.credit, "Photo provenance incomplete"); }
await access("scripts/render-media-day.py");
await access("assets/blender/media-day-2026-09-28-landscape-v1.blend");
const mediaManifest = JSON.parse(await readFile("research/media-day-2026-09-28/media-manifest.json", "utf8"));
for (const [url, width, height] of [[heroMedia.landscape, 1920, 1080], [heroMedia.portrait, 1080, 1920]]) {
  const probe = spawnSync("ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", localPath(url)], { encoding: "utf8" });
  let metadata;
  if (probe.error?.code === "ENOENT") {
    // Minimal CI runners can verify the exact bytes probed on the Studio.
    const recorded = mediaManifest.assets.find(asset => asset.file === localPath(url));
    const matching = recorded?.sha256 === sha(await readFile(localPath(url)));
    check(matching && recorded?.probedOn === "Studio" && !!recorded?.probe, `No matching Studio probe for video: ${url}`);
    if (matching) metadata = recorded.probe;
    console.log(`ffprobe unavailable here; checking fingerprint-bound Studio probe: ${url}`);
  } else {
    check(probe.status === 0, `Video probe failed: ${url}: ${probe.stderr || probe.error?.message || probe.status}`);
    if (probe.status === 0) metadata = JSON.parse(probe.stdout);
  }
  if (metadata) {
    const video = metadata.streams.find(stream => stream.codec_type === "video");
    check(video?.width === width && video?.height === height && video?.codec_name === "h264" && video?.pix_fmt === "yuv420p", `Video format mismatch: ${url}`);
    check(Number(metadata.format.duration) >= 6 && Number(metadata.format.duration) <= 8, `Loop must last 6-8 seconds: ${url}`);
    check(metadata.streams.every(stream => stream.codec_type !== "audio"), `Hero loop must be silent: ${url}`);
    check(video?.r_frame_rate === "24/1" && Number(video?.nb_frames) === 168, `Frame cadence mismatch: ${url}`);
  }
}
await access(localPath(heroMedia.poster));
if (audioBrief.ready) {
  const audio = await readFile(localPath(audioBrief.src));
  const manifest = JSON.parse(await readFile(`${localPath(audioBrief.src)}.json`, "utf8"));
  check(manifest.audioSha256 === sha(audio) && manifest.transcriptSha256 === sha(Buffer.from(transcript)), "Audio/transcript fingerprint mismatch");
  check(manifest.model === "mlx-community/Qwen3-TTS-12Hz-1.7B-Base-8bit" && manifest.voice === "Arizona v12", "Wrong audio engine");
  check(manifest.sampleRate === 24000 && manifest.channels === 1 && manifest.bitrate === 160000 && manifest.trailingSilenceSeconds <= 0.3, "Audio format/silence gate failed");
  if (release) {
    check(manifest.listeningConfirmed === true, "Audio listening approval remains open");
    check(manifest.playerVerified === true, "Audio player verification remains open");
  }
}
if (release) {
  check(edition.editorialFinal, "Editorial update remains open");
  check(audioBrief.ready, "Final Arizona audio remains open");
  check(edition.releaseAuthorized, "Mel's release approval remains open");
}
if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log(`Verified ${release ? "release" : "review draft"}: ${sources.length} sources, ${alignment.length} alignment themes, real-photo Blender videos, OG, transcript and approved player. Audio: ${audioBrief.ready ? "rendered" : "pending final Editor script"}.`);
