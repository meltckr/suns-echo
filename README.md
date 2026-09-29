# The Echo — Phoenix Suns

Review edition: **In the Same Building** — Suns Media Day, September 28, 2026.

This edition connects the day's reported preparation, development, resources and public expectations for ownership. The Alignment section compares named principals and links each statement to its reporting source. The September 29 morning update adds eight official interviews and four original reports or commentary pieces. The final Editor script is complete; Arizona narration is rendered for review. Listening approval and release remain open.

## Existing base

Reuse of **Aligned and Extended**, August 6, 2026, main commit `d33c43b9f6cfaa5b9d19d4af3ff1c8daf54d2945`. Echo's audience sections, source filters, quote cards, responsive design, AVC wordmarks and GitHub Pages hosting are preserved. Prior approved content remains on main and in Git history.

The reusable changes add attributed alignment cards, a qualitative assessment without an invented numeric score, a Blender video hero with poster and reduced-motion support, and the approved AVC audio player. No new dependencies or hosting service.

## Review and release

- Review branch: `codex/suns-echo-media-day-2026-09-28`.
- Planned preview: <https://meltckr.github.io/suns-echo/review/media-day-2026-09-28/>. This URL is **pending deployment**, not a verified live handoff.
- Approved production root: <https://meltckr.github.io/suns-echo/>. It returned 404 during September 28 verification; do not treat that as a working preview.
- PR builds verify and package the preview without deploying. A manual review deployment packages the approved main edition at the root and this draft under its isolated review path.
- GitHub's `github-pages` environment currently permits only main. Mel explicitly approved adding this exact review branch on September 29. Automatic approval review still rejected the change as a persistent security-policy modification, even with that approval, and prohibited an indirect workaround. The branch allowance now requires a user-controlled change in GitHub settings before a Pages preview can deploy.
- Do not merge. The Editor script and audio are technically complete. Perceptual listening and Mel's explicit release approval remain separate gates in `npm run release:check`.

## Media production

Blender 5.2.2 LTS is installed on the Studio. Official Suns photographs from the September 28 Media Day post are recorded in `research/media-day-2026-09-28/photo-ledger.json`. The 7-second silent landscape and portrait loops use slow periodic camera motion over real photographs. Packed source textures and camera animation remain in `assets/blender/`.

```bash
blender -b --factory-startup --python scripts/render-media-day.py -- \
  --landscape-photo public/assets/media/source/suns-media-day-2026-09-28-group.jpg \
  --portrait-photo public/assets/media/source/suns-media-day-2026-09-28-booker.jpg
npm run og
```

The OG script places exact typography and the full AVC wordmark over the Blender-rendered 1200×630 photographic plate.

## Audio production

Visible label: **Audio** plus the exact edition title. Use Arizona v12/Qwen3-TTS on the Studio with the approved reference pair through `avc-audio-module`. The factory, reference files, model cache and logs stay local. No ElevenLabs fallback.

`npm run audio:generate -- --verify-only` checks the existing runtime, cached model and explicit reference pair. Rendering requires `edition.editorialFinal=true`, a synchronized final Editor transcript and an unused versioned MP3 filename. The generator records transcript and MP3 SHA-256, format, duration, loudness and silence checks. Listening and player verification remain explicit completion fields; a changed transcript requires a new audio version.

## Verification

```bash
npm run lint
npx tsc --noEmit
NEXT_PUBLIC_ECHO_BASE_PATH=/suns-echo/review/media-day-2026-09-28 npm run review:check
```

Review checks verify 25 source records, five alignment themes, transcript and MP3 SHA-256, canonical player hashes, real-photo provenance, video dimensions/duration and OG output. Where ffprobe is unavailable, CI validates each file SHA against the exact video probed on the Studio and checks its recorded metadata. Release checks require listening confirmation and Mel's release authorization.

See `research/media-day-2026-09-28/STATUS.md` for the morning checkpoint and `research/media-day-2026-09-28/VERIFICATION.md` for current evidence.

Preserve the system. Refresh the edition.
