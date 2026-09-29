import { readFile, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import sharp from "sharp";
import { sources, edition, alignment, audioBrief, heroMedia, cinematicDivider, wordResonance, resonanceThemes, resonanceCopy, resonanceSourceLinks, reportParts, ownershipBrief, resonanceReview } from "../data/edition.ts";

import { validateResonanceReview } from "./validate-resonance-review.mjs";

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
check(sources.filter(source => source.phase === "Event").length === 21 && sources.filter(source => source.phase !== "Event").length === 4, "Media Day review must retain 21 event and four context records");
check(sources.filter(source => source.id.startsWith("official-")).length === 8, "Media Day review must retain eight official interviews");
check(reportParts.length === 2 && reportParts[0].id === "readout" && reportParts[1].id === "word-resonance", "Two-part edition navigation missing");
const resonanceComponent = await readFile("app/WordResonance.tsx", "utf8");
const resonanceSources = JSON.parse(await readFile("research/media-day-2026-09-28/resonance-source-texts.json", "utf8"));
const resonanceFields = ["phrase", "audience", "entity", "theme", "sentiment", "volume", "evidence", "source"].sort().join(",");
check(wordResonance.length > 0 && new Set(wordResonance.map(item => item.phrase)).size === wordResonance.length, "Empty or duplicate phrase dataset");
for (const item of wordResonance) {
  check(Object.keys(item).sort().join(",") === resonanceFields, `Phrase schema mismatch: ${item.phrase}`);
  check(["fans", "media", "both"].includes(item.audience) && resonanceThemes.includes(item.theme) && ["high", "medium", "low"].includes(item.volume), `Invalid phrase classification: ${item.phrase}`);
  check(Number.isFinite(item.sentiment) && Math.abs(item.sentiment) <= 1, `Invalid phrase sentiment: ${item.phrase}`);
  check([item.phrase, item.entity, item.evidence, item.source].every(value => typeof value === "string" && value.trim().length > 0), `Empty phrase field: ${item.phrase}`);
  check(resonanceSources.some(source => source.source === item.source && source.text.includes(item.evidence)), `Phrase evidence differs from saved source text: ${item.phrase}`);
  check(resonanceSourceLinks[item.phrase]?.startsWith("https://"), `Phrase original source missing: ${item.phrase}`);
}
check(resonanceCopy.caveat === "Sampled Sep 28–29, 2026 coverage — news articles + social posts. Volumes are relative tiers from the sampled pull, not exhaustive measurement.", "Required resonance caveat changed");
for (const token of ['id="word-resonance"', 'id="resonance-detail"', "aria-pressed", "resonanceThemes", "selected.fans", "selected.media", "AudienceEvidence", "resonanceReview", "resonanceCopy.caveat"]) check(resonanceComponent.includes(token), `Missing resonance behavior: ${token}`);
try {
  validateResonanceReview(resonanceReview, JSON.parse(await readFile("research/media-day-2026-09-28/resonance-review-source-texts.json", "utf8")));
} catch (error) { check(false, `Audience comparison audit failed: ${error.message}`); }
check(ownershipBrief.findings.length === 3 && ownershipBrief.next.length === 3, "First-minute ownership structure incomplete");
for (const item of [...ownershipBrief.findings, ownershipBrief.tension, ...ownershipBrief.next]) {
  check(item.sourceIds.length > 0 && item.sourceIds.every(id => sources.some(source => source.id === id)), `Ownership brief attribution missing: ${item.title}`);
}
check(dashboard.includes("<WordResonance />") && dashboard.includes("methodology.resonance"), "Resonance must be mounted with methodology disclosure");
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
const og = await sharp("public/og-media-day-2026-09-28-v3.png").metadata();
check(og.width === 1200 && og.height === 630 && og.format === "png", "OG must be a 1200x630 PNG");
for (const token of ["https://meltckr.github.io", "summary_large_image", "siteName", "1200", "630", "og-media-day-2026-09-28-v3.png"]) check(layout.includes(token), `Social metadata incomplete: ${token}`);
const photos = JSON.parse(await readFile("research/media-day-2026-09-28/photo-ledger.json", "utf8"));
check(photos.eventDate === "2026-09-28", "Photos must be from current Media Day");
check(Array.isArray(photos.photos) && photos.photos.length > 0, "Real photo ledger missing");
for (const photo of photos.photos ?? []) { await access(photo.localPath); check(!!photo.sourceUrl && !!photo.credit, "Photo provenance incomplete"); }
await access("scripts/hero.py");
await access("assets/blender/media-day-2026-09-28-hero-landscape-v3.blend");
const mediaManifest = JSON.parse(await readFile("research/media-day-2026-09-28/media-manifest.json", "utf8"));
for (const [url, width, height] of [[cinematicDivider.landscape, 1920, 1080], [cinematicDivider.portrait, 1080, 1920],
  [`${edition.basePath}/assets/media/media-day-2026-09-28-title-card-1920x1080-v3.mp4`, 1920, 1080],
  [`${edition.basePath}/assets/media/media-day-2026-09-28-title-card-1080x1920-v3.mp4`, 1080, 1920]]) {
  const recorded = mediaManifest.assets.find(asset => asset.file === localPath(url));
  const bytes = await readFile(localPath(url));
  check(recorded?.sha256 === sha(bytes) && recorded?.probedOn === "Studio", `Motion sting fingerprint mismatch: ${url}`);
  const video = recorded?.probe?.streams?.find(stream => stream.codec_type === "video");
  check(video?.width === width && video?.height === height && video?.codec_name === "h264" && video?.pix_fmt === "yuv420p", `Motion sting format mismatch: ${url}`);
  check(bytes.length < 8_000_000 && Math.abs(Number(recorded?.probe?.format?.duration) - 2.5) < 0.05, `Motion sting size/duration mismatch: ${url}`);
}
await access(localPath(cinematicDivider.poster));
await access(localPath(cinematicDivider.portraitPoster));
const dividerComponent = await readFile("app/CinematicDivider.tsx", "utf8");
check(dividerComponent.includes("prefers-reduced-motion") && dividerComponent.includes("element.pause()"), "Chapter motion must stop for reduced motion");
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
    check(Math.abs(Number(metadata.format.duration) - 8) < 0.05, `Hero loop must last eight seconds: ${url}`);
    check(Number(metadata.format.size) < 8_000_000, `Video exceeds eight MB: ${url}`);
    check(metadata.streams.every(stream => stream.codec_type !== "audio"), `Hero loop must be silent: ${url}`);
    check(video?.r_frame_rate === "24/1" && Number(video?.nb_frames) === 192, `Frame cadence mismatch: ${url}`);
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
console.log(`Verified ${release ? "release" : "review draft"}: ${sources.length} sources, ${alignment.length} alignment themes, ${resonanceReview.topics.length} audited phrase groups (${wordResonance.length} original phrase records preserved), real-photo Blender videos, OG, transcript and approved player. Audio: ${audioBrief.ready ? "rendered" : "pending final Editor script"}.`);
