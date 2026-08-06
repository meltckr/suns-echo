import { readFile, access } from "node:fs/promises";
import sharp from "sharp";
import { sources, edition, audioBrief } from "../data/edition.ts";

const dashboard = await readFile("app/Dashboard.tsx", "utf8");
const layout = await readFile("app/layout.tsx", "utf8");
const styles = await readFile("app/globals.css", "utf8");
const data = await readFile("data/edition.ts", "utf8");
const audioTranscript = (await readFile("content/audio-brief-transcript.txt", "utf8")).trim();
const allText = [dashboard, layout, styles, data, audioTranscript].join("\n");
const required = ["THE ECHO", "Aligned and Extended", "Ownership readout", "Source ledger", "#DOMINATE", "Mat", "Dillon Brooks"];
const forbidden = ["Matt Ishbia", "The Plum Effect", "Kelsey Plum", "Phoenix Mercury", "mercury-logo", "mercury-game-bg", "/the-echo/"];
const failures = [];

for (const token of required) if (!allText.includes(token)) failures.push(`Missing token: ${token}`);
for (const token of forbidden) if (allText.includes(token)) failures.push(`Stale or forbidden token: ${token}`);
for (const token of ["echo-audio-glow", "echo-audio-flow", "prefers-reduced-motion"]) if (!styles.includes(token)) failures.push(`Missing reusable audio treatment: ${token}`);
if (sources.length !== edition.sourceCount) failures.push(`Source count mismatch: data=${sources.length}, edition=${edition.sourceCount}`);
if (new Set(sources.map((source) => source.id)).size !== sources.length) failures.push("Duplicate source ids detected");
for (const source of sources) {
  if (!source.url.startsWith("https://")) failures.push(`Non-HTTPS source: ${source.id}`);
  if (source.quote && source.quoteType !== "Direct quote") failures.push(`Quote not labeled direct: ${source.id}`);
  if (source.quote && source.quote.includes("…")) failures.push(`Quote contains an omission ellipsis: ${source.id}`);
  if (source.quote && source.category !== "Fans" && (!source.speaker || !source.quoteContext)) failures.push(`Quote lacks speaker/context: ${source.id}`);
}
if (audioTranscript !== audioBrief.paragraphs.join("\n\n")) failures.push("Visible audio transcript does not match generation transcript");
await access("public/og-image-v2.png");
const ogMetadata = await sharp("public/og-image-v2.png").metadata();
if (ogMetadata.width !== 1200 || ogMetadata.height !== 630 || ogMetadata.format !== "png") failures.push(`OG image must be a 1200×630 PNG; received ${ogMetadata.width}×${ogMetadata.height} ${ogMetadata.format}`);
await access("public/audio/the-echo-suns-001-aligned-and-extended.mp3");
await access("public/assets/brand/AVC-logo-horizontal-dark.svg");
await access("public/assets/teams/suns-logo.svg");
await access("public/assets/share/dillon-brooks-extension-source.png");
await access("public/assets/share/dillon-brooks-og-background-v2.png");
await access("public/assets/share/dillon-brooks-hero-v2.webp");
if (styles.includes("dillon-brooks-extension-source.png")) failures.push("Source article screenshot must not be used as a page background");
for (const token of ["https://suns-echo.netlify.app", "summary_large_image", "publishedTime", "siteName", "1200", "630", "/suns-echo/og-image-v2.png"]) if (!layout.includes(token)) failures.push(`Incomplete social metadata: ${token}`);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Validated Suns Echo: ${sources.length} sources, metadata, audio, assets and stale-content tokens.`);
