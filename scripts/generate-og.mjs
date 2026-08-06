import sharp from "sharp";
import { readFile } from "node:fs/promises";

const width = 1200;
const height = 630;
const background = "public/assets/share/dillon-brooks-og-background-v2.png";
const avcLogo = await readFile("public/assets/brand/AVC-logo-horizontal-dark.svg");

const overlay = Buffer.from(`
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="leftShade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#08050f" stop-opacity=".98"/>
      <stop offset=".47" stop-color="#0d071c" stop-opacity=".88"/>
      <stop offset=".7" stop-color="#1d1160" stop-opacity=".08"/>
      <stop offset="1" stop-color="#1d1160" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="topEdge" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#1d1160"/><stop offset=".52" stop-color="#e56020"/><stop offset="1" stop-color="#f9a01b"/>
    </linearGradient>
    <filter id="titleShadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="7" stdDeviation="5" flood-color="#000000" flood-opacity=".72"/>
    </filter>
  </defs>

  <rect width="1200" height="630" fill="url(#leftShade)"/>
  <rect width="1200" height="10" fill="url(#topEdge)"/>

  <rect x="58" y="101" width="208" height="35" rx="17.5" fill="#f9a01b"/>
  <text x="78" y="125" fill="#1d1160" font-family="Arial,Helvetica,sans-serif" font-size="15" font-weight="900" letter-spacing="2.4">THE ECHO · 001</text>

  <g filter="url(#titleShadow)" font-family="Arial Black,Arial,Helvetica,sans-serif" font-weight="900" letter-spacing="-4">
    <text x="55" y="245" fill="#ffffff" stroke="#09070f" stroke-width="5" paint-order="stroke" font-size="82">ALIGNED</text>
    <text x="55" y="332" fill="#ffffff" stroke="#09070f" stroke-width="5" paint-order="stroke" font-size="82">&amp; EXTENDED</text>
  </g>

  <rect x="58" y="365" width="407" height="62" rx="8" fill="#e56020"/>
  <text x="82" y="406" fill="#ffffff" font-family="Arial Black,Arial,Helvetica,sans-serif" font-size="29" font-weight="900" letter-spacing=".3">3 YEARS · $73 MILLION</text>

  <text x="59" y="474" fill="#ffffff" font-family="Arial,Helvetica,sans-serif" font-size="25" font-weight="800">DILLON BROOKS · PHOENIX SUNS</text>
  <text x="59" y="510" fill="#c9c2d8" font-family="Arial,Helvetica,sans-serif" font-size="17" font-weight="700" letter-spacing="1.1">OWNERSHIP INTELLIGENCE · AUGUST 6, 2026</text>

  <rect x="58" y="548" width="361" height="34" rx="17" fill="#1d1160" stroke="#f9a01b" stroke-width="2"/>
  <text x="78" y="571" fill="#ffffff" font-family="Arial,Helvetica,sans-serif" font-size="13" font-weight="900" letter-spacing="1.15">WHY THE THREE-YEAR TERM MATTERS</text>

  <rect y="620" width="1200" height="10" fill="url(#topEdge)"/>
</svg>`);

const base = await sharp(background)
  .resize(width, height, { fit: "cover", position: "center" })
  .modulate({ saturation: 1.06, brightness: 0.94 })
  .toBuffer();

await sharp(background)
  .resize(1600, 840, { fit: "cover", position: "center" })
  .webp({ quality: 88, effort: 5 })
  .toFile("public/assets/share/dillon-brooks-hero-v2.webp");

await sharp(base)
  .composite([
    { input: overlay, top: 0, left: 0 },
    { input: await sharp(avcLogo).resize(174, 48, { fit: "contain" }).toBuffer(), top: 32, left: 58, blend: "over" },
  ])
  .png({ quality: 96, compressionLevel: 8 })
  .toFile("public/og-image-v2.png");

console.log("Generated premium public/og-image-v2.png and clean responsive hero");
