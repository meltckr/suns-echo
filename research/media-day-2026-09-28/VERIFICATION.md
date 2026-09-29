# September 28 evening review verification

State: technically verified working draft. Morning editorial finalization, final narration and release approval remain open.

## Editorial

- Fourteen unique reporting records; ten concern the event and four provide dated preview/background context. One AP dispatch counts once; two Bridges articles represent two editorial frames of one exchange. One public thread supplies indicative discussion.
- Three alignment themes with named speakers, reported-statement labels and linked event sources. Speaker counts describe principals, not independent reporting pages. No organization-wide consensus is inferred.
- An independent read-only source review supported the core narrative. Corrections applied: team-focused Roundtable commentary categorized with creators; both Williams sources added to readout citations.
- Publication clocks converted to America/Phoenix. Maluach's September 29 UTC article belongs to September 28 locally. Ownership stake acquisition remains unverified complete. Summer activity stays attributed.
- Selected quotation totals including repeated UI appearances: Gregory 24 words, Booker 12, Mat 10. No further SI quotation added.
- Later local recaps, official recordings and wider national basketball response remain in the morning queue.

## Media

Blender 5.2.2 LTS verified on the Studio. Two original photographs from the Suns' official September 28 post; provenance and source dimensions in photo-ledger.json. No installation.

Both loops: 7.000 seconds, 24 fps, 168 frames, H264/yuv420p, silent, faststart. Landscape 1920×1080; portrait 1080×1920. Blender .blend files retain packed photo textures. Reopened files confirm frame169 matches frame1 camera position and lens, completing the periodic loop. Exported posters visually reviewed; subjects remain complete. OG photographic plate and final AVC/title card are 1200×630. Hashes in media-manifest.json.

## Page and checks

- `npm run lint`: pass.
- `npx tsc --noEmit`: pass.
- `NEXT_PUBLIC_ECHO_BASE_PATH=/suns-echo/review/media-day-2026-09-28 npm run review:check`: pass, including sources, attribution, transcript, approved player hashes, photographs, OG, videos and static build.
- Browser 390×844 and 1440×1000: no document overflow; full AVC wordmarks loaded in header and footer; alignment cards render at the appropriate breakpoint. Creators filter returns 3 of 14 rows.
- Browser confirms portrait source 1080×1920 on mobile, landscape 1920×1080 on desktop, respective posters, duration 7 seconds and muted playback. Pause and Play controls successfully stop and resume motion. Reduced-motion handling inspected in code; OS preference was not changed for this check.
- Canonical and OG URLs resolve to the planned isolated preview path in emitted HTML. Preview is noindex.
- Existing audio player JS and utilities match both approved SHA-256 hashes. Arizona factory, runtime module, required cached model assets and approved reference pair pass verify-only preflight. No draft audio rendered; audio.ready=false and no audio controls bind stale files.
- Release check intentionally fails on exactly three open gates: editorial finalization, final Arizona narration and Mel's release authorization.

## GitHub Pages

Approved main remains d33c43b9f6cfaa5b9d19d4af3ff1c8daf54d2945. Public root returned 404 during this check. Existing August 6 workflow failures were runner-assignment failures, not current-edition content failures. GitHub Actions and Pages service status were operational.

The github-pages environment permits main only. Automatic approval review rejected adding this exact review branch because a persistent deployment security setting requires explicit review. No policy change or workaround performed. The first PR build7612d18 received a runner and passed lint, then found ffprobe unavailable on that Linux runner. Added fingerprint-bound Studio probe metadata as the portable verification path. Studio and minimal-PATH validation both pass. A PR-only build verifies the package without deploying; actual review deployment remains pending explicit approval. No merge or production-edition replacement.
