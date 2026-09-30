import { readdir, rm } from "node:fs/promises";
import { audioBrief } from "../data/edition.ts";

// Keep historical media in the repository; export only this edition's audio.
const active = audioBrief.ready ? audioBrief.src.split("/").at(-1) : null;
const allowed = new Set(active ? [active, `${active}.json`, active.replace(/\.mp3$/, ".metadata.json")] : []);
for (const file of await readdir("out/audio").catch(() => [])) {
  if (!allowed.has(file)) await rm(`out/audio/${file}`, { recursive: true });
}
// Packed .blend files and repository originals provide re-rendering sources.
await rm("out/assets/media/source", { recursive: true, force: true });
