import sharp from "sharp";
import { readFile } from "node:fs/promises";

const width = 1200;
const height = 630;
const photo = "public/assets/share/dillon-brooks-extension-source.png";
const avcLogo = await readFile("public/assets/brand/AVC-logo-horizontal-dark.svg");
const sunsLogo = await readFile("public/assets/teams/suns-logo.svg");

const overlay = Buffer.from(`
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#090611" stop-opacity="1"/>
      <stop offset=".5" stop-color="#160b38" stop-opacity=".94"/>
      <stop offset=".78" stop-color="#160b38" stop-opacity=".22"/>
      <stop offset="1" stop-color="#160b38" stop-opacity=".03"/>
    </linearGradient>
    <linearGradient id="edge" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#1d1160"/><stop offset=".5" stop-color="#e56020"/><stop offset="1" stop-color="#f9a01b"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#shade)"/>
  <rect x="0" y="0" width="1200" height="10" fill="url(#edge)"/>
  <text x="70" y="128" fill="#f9a01b" font-family="Arial,Helvetica,sans-serif" font-size="19" font-weight="800" letter-spacing="4.5">THE ECHO · SUNS EDITION 001</text>
  <text x="70" y="215" fill="#ffffff" font-family="Arial,Helvetica,sans-serif" font-size="74" font-weight="900" letter-spacing="-3">ALIGNED AND</text>
  <text x="70" y="286" fill="#ffffff" font-family="Arial,Helvetica,sans-serif" font-size="74" font-weight="900" letter-spacing="-3">EXTENDED</text>
  <rect x="70" y="320" width="70" height="6" fill="#e56020"/>
  <text x="70" y="374" fill="#ece8f3" font-family="Georgia,serif" font-size="25">Dillon Brooks · 3 years · $73 million</text>
  <text x="70" y="412" fill="#ece8f3" font-family="Georgia,serif" font-size="25">Commitment with age protection</text>
  <text x="70" y="478" fill="#aaa2b8" font-family="Arial,Helvetica,sans-serif" font-size="14" font-weight="700" letter-spacing="2">AUGUST 6, 2026 · OWNERSHIP INTELLIGENCE</text>
  <rect x="70" y="518" rx="17" width="326" height="36" fill="#e56020" fill-opacity=".16" stroke="#f9a01b" stroke-opacity=".7"/>
  <text x="89" y="541" fill="#f9a01b" font-family="Arial,Helvetica,sans-serif" font-size="13" font-weight="800" letter-spacing="1.1">DIRECTIONAL READ · STRONGLY POSITIVE</text>
  <rect x="0" y="620" width="1200" height="10" fill="url(#edge)"/>
</svg>`);

const cropped = await sharp(photo)
  .extract({ left: 48, top: 258, width: 1082, height: 609 })
  .resize(width, height, { fit: "cover", position: "center" })
  .modulate({ saturation: 0.92, brightness: 0.72 })
  .toBuffer();

await sharp(cropped)
  .composite([
    { input: overlay, top: 0, left: 0 },
    { input: avcLogo, top: 48, left: 70, blend: "over" },
    { input: await sharp(sunsLogo).resize(86, 86, { fit: "contain" }).toBuffer(), top: 42, left: 1050, blend: "over" },
  ])
  .png({ quality: 96, compressionLevel: 8 })
  .toFile("public/og-image.png");

console.log("Generated public/og-image.png (1200×630)");
