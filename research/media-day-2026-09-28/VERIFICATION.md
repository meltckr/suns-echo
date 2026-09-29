# September 29 morning review verification

State: editorial complete; Arizona audio technically verified. Review PR remains draft. Perceptual listening, the isolated Pages preview and release approval remain open.

## Editorial

- 25 included source records: 21 September 28 event records and four dated preview/background records. Eight official Suns interviews add original speaker context. Four completed local reports or commentary pieces were reviewed in the morning pass. PHNX/Bourguet completed reactions and additional national basketball analysis were not retrieved; previews and episode descriptions are excluded from reaction claims.
- Five Alignment themes show each named speaker, an attributed paraphrase or reported statement, its source and a next-watch item. Reciprocal Ighodaro–Maluach accounts and Kennard–Ighodaro accounts strengthen the group-work reading. Speakers are counted as named people, not independent reporting outlets or universal organizational consensus.
- Official recording captions were exported with timestamps and used for paraphrases. Exact quotes in the edition come from named published reporting. Gregory's original answer establishes several months until a reliable Williams return-to-play assessment; it supplies no return date. The proposed additional ownership acquisition remains unverified complete.
- The readout separates reported accounts from Mel's interpretation and open questions. AP syndication counts once. Two Duffy articles remain one commentator's perspective. One public fan thread is indicative, not a poll. Scores remain qualitative.
- Independent editorial read-through found and corrected one Booker/Maluach pronoun ambiguity before the final Arizona render. Direct quotation exposure remains within the source budgets: Gregory 24 repeated displayed words, Booker 12, Mat 10.

## Blender media

Blender 5.2.2 LTS verified on the Studio. Two real photographs from the Suns' September 28 official Media Day post, with provenance and source dimensions in `photo-ledger.json`. No installation or illustrative replacement.

Both silent MP4 loops: 7.000 seconds, 24 fps, 168 frames, H264/yuv420p, faststart. Landscape 1920×1080; portrait 1080×1920. The packed `.blend` files and headless render script remain checked in. Reopened frame 169 matches frame 1 camera position and lens. Mobile and landscape posters work. Blender's OG plate and final AVC/title card are 1200×630. Source and output hashes are in `media-manifest.json`.

## Audio

- Arizona v12/Qwen3-TTS rendered locally through the approved Studio reference pair. No ElevenLabs or fallback. Final Editor/public transcript SHA-256: `408cb6476e210a781f41c62cb054d644d56fe2ec202302ceff223441953131d5`. Final MP3 SHA-256: `7b307de3543a67238cc5ac5f0de860d3edf4ead035730f952075e78bbc38e5c5`. The exact fingerprints, model and format are in the adjacent MP3 manifest.
- 78.355 seconds, 24 kHz mono, 160 kb/s MP3; integrated -17.2 LUFS, true peak -2.32 dBTP, trailing silence 0.058 seconds. Full-file silence and digital-black-hole scans pass. Full and separate ending ASR checks include the complete standalone `Dominate.` close. ASR is a technical check; pronunciation and natural delivery still require human listening.
- The local review page binds the versioned MP3 and exact public transcript. The visible label is `Audio` plus `In the Same Building`. Browser play/pause, back/forward 15 seconds and 1.5× speed worked; the local server returned HTTP 206 for the MP3. The player JS and utility files match approved SHA-256 values. `playerVerified=true`, `listeningConfirmed=false` in the manifest.

## Page and build

- `npm run lint`: pass; `npx tsc --noEmit`: pass; `NEXT_PUBLIC_ECHO_BASE_PATH=/suns-echo/review/media-day-2026-09-28 npm run review:check`: pass, including static export.
- Browser 390×844 and 1440×1000: no horizontal document overflow; both full AVC wordmarks loaded. Mobile uses 1080×1920 video and portrait poster; desktop uses 1920×1080 video and landscape poster. Both durations are seven seconds. Source filter returns 5 creator records of 25 after the morning update.
- Canonical and OG URLs target the isolated review path, with `noindex, nofollow`. MP4 hero, posters, portrait cut, 1200×630 OG, checked-in `.blend` and script, transcript and MP3 are present. No screenshots were produced for handoff.

## GitHub Pages and release

Approved main remains `d33c43b9f6cfaa5b9d19d4af3ff1c8daf54d2945`. The Pages environment still permits main only. Mel explicitly approved adding `codex/suns-echo-media-day-2026-09-28` on September 29; automatic approval review still rejected that persistent security-policy change and forbade an indirect workaround. Policy readback remained main-only. The planned preview returned 404 and is not claimed live. PR-only CI passed on the completed review edition and skipped deployment. A user-controlled GitHub settings change is needed before this agent can dispatch and verify the isolated preview. Do not merge or replace the approved root. `npm run release:check` remains blocked by human listening and Mel's explicit release approval.

## Two-part cinematic v2 verification — September 29, 2026

- Original review ledger retained: 25 records, 21 event/four context, eight official interview records.
- Exact 25-phrase resonance snapshot; every evidence string matches its saved source text. Six themes and All/Fans/Media/Both filters. All 25 quote/source detail panels checked on desktop and phone. No full source article text is bundled into public client data.
- EEVEE heroes: eight seconds, 24 fps/192 frames, 1920×1080 and 1080×1920, H.264/yuv420p, 2.13/1.91 MB. Four 2.5-second sting/title-card exports are each below 1.08 MB. All packed scene, first-frame, loop-endpoint and fingerprint evidence is in CINEMATIC-VISUAL-QA.md and media-manifest.json.
- Arizona v2 duration 110.419 seconds; trailing silence 0.04783 seconds. Audio SHA-256 `47861e95df80231032079afcbd146f65d718fcd2000f1f585334eace490b940c`. Transcript SHA-256 `67b84e2e8db00c97f7378deabadb2b705ee0e4bc96ab6c3e6dc975ea4e6775cf`. Full-file and ending ASR recorded; human listening unconfirmed.
- Browser checks at 1440×900 and 390×844 pass: no overflow/script errors, all audience filters, exact quote/source details, source-ledger filters, hero and chapter stopping for reduced motion, player label/title, playback, seek, skip and speed. A byte-range-capable server was used for seeking, matching GitHub Pages delivery.
- Lint, type checking, static export and review validator pass. Release validator enforces separate listening and production-release approvals; those remain open.

Changed groups: edition/page/metadata/CSS; WordResonance and CinematicDivider components; resonance JSON, source URLs and source-text evidence; final transcript/audio v2 and fingerprint manifest; hero.py, four packed scenes, six MP4s/posters/OG and media manifest; validation and review documentation. Existing quotes, methodology and filterable review ledger remain.
