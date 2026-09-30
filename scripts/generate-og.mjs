import sharp from "sharp";
import {readFile} from "node:fs/promises";

// Preserve the approved Blender/photo composition. Add the current story and
// full AVC wordmark deterministically so names and branding stay exact.
const approvedCard = "public/og-media-day-2026-09-28-v3.png";
const logo = await readFile("public/assets/brand/AVC-logo-horizontal-dark.svg");
const overlay = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
<text x="125" y="464" fill="#fff0e4" font-family="Arial,sans-serif" font-size="27" font-weight="700">Players helping players.</text>
</svg>`);
await sharp(approvedCard).composite([
  {input: overlay, left: 0, top: 0},
  {input: await sharp(logo).resize(340,64).png().toBuffer(), left: 125, top: 513}
]).png({compressionLevel:8}).toFile("public/og-media-day-2026-09-28-v4.png");
console.log("Generated 1200x630 Echo review share card with approved photography and AVC wordmark.");
