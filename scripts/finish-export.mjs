import { readdir, rm } from "node:fs/promises";
import { audioBrief } from "../data/edition.ts";

// Keep historical media in the repository; export only this edition's audio.
const active = audioBrief.ready ? audioBrief.src.split("/").at(-1) : null;
for (const file of await readdir("out/audio").catch(() => [])) {
  if (file !== active && file !== `${active}.json`) await rm(`out/audio/${file}`, { recursive: true });
}
// Packed .blend files and repository originals provide re-rendering sources.
await rm("out/assets/media/source", { recursive: true, force: true });
