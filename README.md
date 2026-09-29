# The Echo — Phoenix Suns

Review edition: **In the Same Building** — Suns Media Day, September 28, 2026.

This edition has two parts: a review of September 28 Media Day and a Word Resonance map of the sampled media and fan language. The review connects reported preparation, development, resources and public expectations for ownership. The Alignment section compares named principals and links each statement to its reporting source. The September 29 morning update adds eight official interviews and four original reports or commentary pieces. The final Editor script is complete; Arizona narration is rendered for review. Listening approval and release remain open.

## Existing base

Reuse of **Aligned and Extended**, August 6, 2026, main commit `d33c43b9f6cfaa5b9d19d4af3ff1c8daf54d2945`. Echo's audience sections, source filters, quote cards, responsive design, AVC wordmarks and GitHub Pages hosting are preserved. Prior approved content remains on main and in Git history.

The reusable changes add attributed alignment cards, a qualitative assessment without an invented numeric score, a Blender video hero with poster and reduced-motion support, and the approved AVC audio player. No new dependencies or hosting service.

## Review and release

- Review branch: `codex/suns-echo-media-day-2026-09-28`.
- Isolated review destination: <https://meltckr.github.io/suns-echo/review/media-day-2026-09-28/>. The manual review workflow builds this branch there and preserves the approved main edition at the root.
- Approved production root: <https://meltckr.github.io/suns-echo/>. It returned 404 during September 28 verification; do not treat that as a working preview.
- PR builds verify and package the preview without deploying. A manual review deployment packages the approved main edition at the root and this draft under its isolated review path.
- GitHub's `github-pages` environment now permits main and the exact review branch `codex/suns-echo-media-day-2026-09-28`. This was verified by read-only API on September 29. No persistent environment-policy change was made by this update.
- Do not merge. The Editor script and audio are technically complete. Perceptual listening and Mel's explicit release approval remain separate gates in `npm run release:check`.

## Media production

Blender 5.2.2 LTS is installed on the Studio. Official Suns photographs from the September 28 Media Day post are recorded in `research/media-day-2026-09-28/photo-ledger.json`. The eight-second silent landscape and portrait heroes use EEVEE, three photographic planes at distinct depths, shallow depth of field, volumetric purple/orange light, an extruded edition title and a periodic dolly. Two-and-a-half-second chapter stings and title cards carry the same look. Every MP4 is H.264/yuv420p and under 8 MB. Packed scenes, posters and a 1200×630 hero-frame OG remain reproducible in the repository.

```bash
blender -b -P scripts/hero.py
```

Both the hero and chapter motion pause when reduced motion is enabled. Posters remain available when playback is restricted. Chapter clips play when they enter the viewport.

## Word Resonance

`data/word-resonance.json` is a byte-for-byte snapshot of the supplied `~/suns-resonance/data/suns-media-day-resonance.json`. Its 25 phrases retain the exact eight-field schema. `research/media-day-2026-09-28/resonance-source-texts.json` contains the source text needed to verify every quote and recover original source URLs. This phrase dataset stays separate from the review's 25 source records: 21 event and four context records, including eight official interviews.

Bubbles are green for positive scores, red for negative and gray for zero; size follows high/medium/low relative volume. The six themes and All/Fans/Media/Both filters preserve the sampled audience distinctions. Fans and Media include shared phrases; shared scores blend their contributing fan and media candidates. The exact methodology caveat appears in the component and the report methodology.

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
