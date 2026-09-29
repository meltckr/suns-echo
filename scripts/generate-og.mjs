import sharp from "sharp";
import {readFile} from "node:fs/promises";
const plate="public/assets/media/media-day-2026-09-28-og-plate-v1.png";
const logo=await readFile("public/assets/brand/AVC-logo-horizontal-dark.svg");
const overlay=Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="shade"><stop offset="0" stop-color="#090617" stop-opacity=".99"/><stop offset=".55" stop-color="#100821" stop-opacity=".92"/><stop offset="1" stop-color="#1d1160" stop-opacity=".15"/></linearGradient><linearGradient id="edge"><stop stop-color="#1d1160"/><stop offset=".5" stop-color="#e56020"/><stop offset="1" stop-color="#f9a01b"/></linearGradient></defs>
<rect width="1200" height="630" fill="url(#shade)"/><rect width="1200" height="9" fill="url(#edge)"/>
<rect x="58" y="110" width="242" height="36" rx="18" fill="#f9a01b"/><text x="77" y="135" fill="#1d1160" font-family="Arial,sans-serif" font-size="16" font-weight="900" letter-spacing="2">THE ECHO · SUNS 002</text>
<g font-family="Arial Black,Arial,sans-serif" font-weight="900" fill="white" letter-spacing="-2"><text x="55" y="248" font-size="78">IN THE SAME</text><text x="55" y="337" font-size="84">BUILDING</text></g>
<rect x="58" y="373" width="391" height="56" rx="8" fill="#e56020"/><text x="77" y="411" fill="white" font-family="Arial,sans-serif" font-size="27" font-weight="900">SUNS MEDIA DAY · 2026</text>
<text x="59" y="482" fill="white" font-family="Arial,sans-serif" font-size="24" font-weight="700">WHERE THE MESSAGES ALIGN</text>
<text x="59" y="523" fill="#c9c2d8" font-family="Arial,sans-serif" font-size="17" letter-spacing="1.5">OWNERSHIP PERSPECTIVE · SEPTEMBER 28</text>
<rect y="621" width="1200" height="9" fill="url(#edge)"/></svg>`);
await sharp(plate).resize(1200,630,{fit:"cover",position:"center"}).composite([{input:overlay,left:0,top:0},{input:await sharp(logo).resize(218,60,{fit:"contain"}).toBuffer(),left:58,top:27}]).png({compressionLevel:8}).toFile("public/og-media-day-2026-09-28-v1.png");
console.log("Generated 1200x630 edition card from Blender-rendered official photography.");
