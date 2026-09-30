import { readFile, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import sharp from "sharp";
import { sources, campUpdate, campUpdateSources, edition, alignment, audioBrief, heroMedia, cinematicDivider, wordResonance, resonanceThemes, resonanceCopy, resonanceSourceLinks, reportParts, resonanceReview, ledgerSources, resonanceFanLedger, recoveryReport, ownershipBrief } from "../data/edition.ts";

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
for (const token of ["THE ECHO", edition.title, "Source ledger", "#DOMINATE", "Mat"]) check(allText.includes(token), `Missing edition element: ${token}`);
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
check(resonanceCopy.caveat === resonanceReview.caveat && resonanceCopy.caveat.includes(`${resonanceReview.denominators.verbatimFanComments} fan comment texts`), "Resonance caveat must disclose the current sample count");
check(new Set(ledgerSources.map(source => source.id)).size === ledgerSources.length, "Duplicate ledger ID");
check(ledgerSources.length === sources.length + resonanceFanLedger.length + campUpdateSources.length, "Ledger populations must stay separate");
check(campUpdateSources.length === 1 && campUpdate.sourceIds.every(id => ledgerSources.some(source => source.id === id)), "Dated Camp update missing its ledger source");
check(!sources.some(source => campUpdate.sourceIds.includes(source.id)) && !resonanceReview.sources.some(source => source.url === campUpdateSources[0].url), "First-practice source must stay outside Media Day and resonance samples");
check(campUpdate.date.includes("September 29, 2026") && campUpdate.publishedAt === "2026-09-29T23:43:00Z", "First-practice date/publication provenance changed");
check(campUpdate.body.split(/\s+/).length >= 50 && campUpdate.body.split(/\s+/).length <= 70, "Camp addition must remain about 60 words");
for (const source of resonanceReview.sources.filter(source => source.kind === "fans")) check(ledgerSources.some(record => record.category === "Fans" && record.url === source.url), `Fan input missing from visible ledger: ${source.url}`);
for (const token of ['id="word-resonance"', 'id="resonance-detail"', "aria-pressed", "resonanceThemes", "selected.fans", "selected.media", "AudienceEvidence", "resonanceReview", "resonanceCopy.caveat"]) check(resonanceComponent.includes(token), `Missing resonance behavior: ${token}`);
try {
  validateResonanceReview(resonanceReview, JSON.parse(await readFile("research/media-day-2026-09-28/resonance-review-source-texts.json", "utf8")));
} catch (error) { check(false, `Audience comparison audit failed: ${error.message}`); }
const lockedCopy = await readFile("content/locked-copy.txt", "utf8");
check(sha(Buffer.from(lockedCopy)) === "d216c0dcacba767a01f2df9d9331c6ff022454b2a5a59242ea7728e774617ff5", "Mel's locked wording changed");
check(lockedCopy === `${edition.title}\n\n${transcript}`, "Page/script differ from Mel's locked copy");
check(edition.lockedCopy.map(item => item.text).join("\n\n") === transcript.trim(), "Locked page paragraphs differ from transcript");
check(audioBrief.paragraphs.join("\n\n") === transcript.trim() && publicTranscript === transcript, "Audio/public transcript differ from locked copy");
check(edition.lockedCopy.length === 6 && transcript.trim().endsWith("\n\nDominate."), "Locked paragraph structure/close changed");
for (const item of edition.lockedCopy) check(item.sourceIds.every(id => sources.some(source => source.id === id)), "Locked paragraph source tag missing");
check(dashboard.includes('hidden={view !== "sources"}') && dashboard.includes("<WordResonance />") && dashboard.includes("methodology.resonance"), "Sources tab must retain resonance and methodology");
check(dashboard.includes('edition.lockedCopy[0].text') && dashboard.includes('edition.lockedCopy.slice(1)'), "Recovery must preserve Mel's locked opening");
check(dashboard.includes('ownershipBrief.findings') && dashboard.includes('<AlignmentEvidence />') && dashboard.includes('<FanReading />'), "Full ownership report missing");
for (const id of ["readout", "alignment", "development", "coverage", "fan-response", "ownership", "camp"]) check(dashboard.includes(`id="${id}"`), `Report section missing: ${id}`);
const campSourceIds = new Set(recoveryReport.camp.flatMap(item => item.sourceIds));
for (const item of ownershipBrief.next) check(item.sourceIds.every(id => campSourceIds.has(id)), `Consolidated camp watchpoint lost sources: ${item.title}`);
for (const item of [...ownershipBrief.findings, ownershipBrief.tension, ...ownershipBrief.next, ...recoveryReport.development, ...recoveryReport.coverage, ...recoveryReport.ownership, ...recoveryReport.camp]) {
  check(item.sourceIds.length > 0 && item.sourceIds.every(id => sources.some(source => source.id === id)), `Recovery claim has missing sources: ${item.title}`);
  check(!/oppos(?:ite|ing) (?:pickup )?teams|pickup games/.test(item.body), `Pickup anecdote repeated outside the opening: ${item.title}`);
  check(!/keep in view|worth revisiting|directional evidence sample|reciprocal accounts|separate frames/i.test(item.body), `Opaque or rejected language: ${item.title}`);
}
for (const item of recoveryReport.fans) {
  const topic = resonanceReview.topics.find(topic => topic.id === item.topicId);
  check(topic && item.evidenceIds.length > 0 && item.evidenceIds.every(id => topic.fans.evidence.some(evidence => evidence.id === id)), `Fan finding has missing captured evidence: ${item.title}`);
}
check(dashboard.includes("source.evidence") && dashboard.includes("ledger-evidence"), "Source ledger must expose the original evidence and interview timestamps");
check(!/v[1-8](?:[-.])/.test(dashboard) && audioBrief.src.endsWith("/the-echo-suns-002-media-day-2026-09-29-v9.mp3"), "Retired take or wrong Arizona audio wired into page");
check(audioBrief.title === edition.title && dashboard.includes('eyebrow: "Audio"'), "Audio title/label differs from locked title");
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
  check(manifest.provider === "arizona-v12" && manifest.model === "mlx-community/Qwen3-TTS-12Hz-1.7B-Base-8bit", "Wrong Arizona provider or model");
  check(manifest.sampleRate === 24000 && manifest.channels === 1 && manifest.bitrate === 160000, "Arizona audio format gate failed");
  check(Number.isFinite(manifest.durationSeconds) && manifest.durationSeconds > 0, "Audio duration missing");
  check(Number.isFinite(manifest.trailingSilenceSeconds) && manifest.trailingSilenceSeconds >= 0 && manifest.trailingSilenceSeconds <= 0.3, "Audio trailing silence gate failed");
  check(Math.abs(manifest.integratedLufs + 16) <= 1.5 && Number.isFinite(manifest.truePeakDbtp) && manifest.truePeakDbtp <= -1.5, "Mercury dual-mono loudness/peak contract failed");
  // Frozen from the approved Portland Arizona v12-v4 metadata, not a new recipe.
  const canonicalRecipe = {
  "reference_profile": "approved-declarative-18s",
  "sentence_level": true,
  "seed": 42,
  "temperature": 0.9,
  "top_k": 50,
  "repetition_penalty": 1.5,
  "max_tokens_per_sentence": 384,
  "mlx_join_audio": false,
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
  "channels": 1
};
  check(manifest.recipe && Object.keys(manifest.recipe).length === Object.keys(canonicalRecipe).length && Object.entries(canonicalRecipe).every(([key, value]) => manifest.recipe[key] === value), "Approved Portland recipe changed");
  check(manifest.reference?.audioSha256 === "7f76d4482fd5ee9668d8e3ccee829adc69ec5d41043509ace95af69c38e07d99" && manifest.reference.textSha256 === "c68c23ec4fa89e0b86a3b2a638be38e7d4a3b05b164ffab99611923feac4e5e6", "Approved declarative reference pair differs");
  const sentenceCount = transcript.trim().split(/\n\s*\n/).flatMap(paragraph => paragraph.split(/(?<=[.!?])\s+/).filter(Boolean)).length;
  check(manifest.finishing?.generationMode === "sentence" && manifest.finishing.generationPasses === sentenceCount && manifest.finishing.crossfadeSeconds === 0 && manifest.finishing.joinGuardVersion === "guarded-v1", "Sentence generation/join contract failed");
  check(manifest.finishing?.sampling?.repetitionPenalty === 1.5 && manifest.finishing.sampling.temperature === 0.9 && manifest.finishing.sampling.topK === 50 && manifest.finishing.sampling.seed === 42 && manifest.finishing.maxTokens === 384 && manifest.finishing.tempoMultiplier === 1.15, "Approved sentence sampling/tempo changed");
  check(manifest.proof?.prompted === false, "Unprompted Whisper proof is required");
  if (manifest.proof) {
    const whisperBytes = await readFile(manifest.proof.whisperFile);
    const whisper = JSON.parse(whisperBytes);
    const comparisonBytes = await readFile(manifest.proof.comparisonFile);
    const comparison = JSON.parse(comparisonBytes);
    check(manifest.proof.comparisonSha256 === sha(comparisonBytes), "Whisper full-diff fingerprint mismatch");
    check(whisper.prompted === false && comparison.prompted === false, "Whisper/comparison must retain unprompted proof");
    check(manifest.proof.whisperSha256 === sha(whisperBytes) && comparison.whisperSha256 === sha(whisperBytes), "Whisper proof fingerprint mismatch");
    check(whisper.audioSha256 === manifest.audioSha256 && comparison.audioSha256 === manifest.audioSha256 && comparison.scriptSha256 === manifest.transcriptSha256, "Whisper comparison is bound to different audio or script");
    check(Array.isArray(comparison.mismatches) && comparison.mismatches.length === manifest.proof.mismatchSpans, "Whisper mismatch disclosure count differs");
    const requiredNames = ["Mat", "Oso", "Ighodaro", "Khaman", "Maluach", "Booker", "Kennard", "Fleming", "Valley Suns", "Williams", "Gregory", "Bridges"];
    const normalized = value => String(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    const count = (text, name) => (` ${normalized(text)} `).split(` ${normalized(name)} `).length - 1;
    check(Array.isArray(manifest.proof.nameChecks), "Whisper name checks missing");
    let allNamesMatched = true;
    for (const name of requiredNames) {
      const expectedCount = count(transcript, name);
      const actualCount = count(whisper.text, name);
      const checks = manifest.proof.nameChecks?.filter(item => item.name === name) ?? [];
      const matched = expectedCount > 0 && actualCount === expectedCount;
      allNamesMatched &&= matched;
      check(checks.length === 1 && checks[0].matched === matched && checks[0].expectedCount === expectedCount && checks[0].actualCount === actualCount, `Whisper name disclosure mismatch: ${name}`);
      if (!matched) console.log(`Whisper spelling review flag: ${name} (${actualCount}/${expectedCount}); human pronunciation approval remains separate.`);
    }
    check(manifest.proof.requiredNamesMatched === allNamesMatched, "Whisper name status differs from raw proof");
    check(Array.isArray(manifest.proof.sentenceRerenders), "Sentence rerender disclosure missing");
    const rerenders = manifest.proof.sentenceRerenders ?? [];
    check(new Set(rerenders.map(item => item.sentenceIndex)).size === rerenders.length, "Duplicate sentence rerender entries");
    for (const item of rerenders) {
      check(Number.isInteger(item.sentenceIndex) && item.sentenceIndex >= 0 && item.sentenceIndex < sentenceCount && Number.isInteger(item.attempts) && item.attempts >= 1 && item.attempts <= 4 && typeof item.reason === "string" && item.reason.trim().length > 0 && typeof item.remainingMismatch === "boolean", "Invalid sentence rerender disclosure or four-rerender cap exceeded");
    }
  }
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
console.log(`Verified ${release ? "release" : "review draft"}: ${sources.length} sources, ${alignment.length} alignment themes, ${resonanceReview.topics.length} audited phrase groups (${wordResonance.length} original phrase records preserved), real-photo Blender videos, OG, locked transcript and house player. Audio: ${audioBrief.ready ? "rendered" : "pending Arizona render and proof"}.`);
