# Cinematic Media Day visuals — v2

Edition title: **In the Same Building**.

Reproduce from the repository root with `blender -b -P scripts/hero.py` using Blender 5.2.2 LTS, installed FFmpeg, Node and the repository Sharp dependency. The Mac GPU must be accessible to the Blender process. The restricted process failed to initialize rendering; the authorized GPU render succeeded.

## Source fidelity and treatment

Both packed textures are the official Suns September 28 Media Day photographs already verified in `photo-ledger.json`. Three photographic panels sit at distinct Z positions (-0.9, 0, 0.7). The group photo retains all four players. The layout uses photographic panels, without generated people or fabricated movement inside the photographs.

EEVEE renders at 16 samples. A closed cosine camera dolly, purple and orange area lights, shallow depth of field (f/3.2), a bounded scattering volume (density 0.012), extruded title geometry (depth 0.032), and an orange light sweep supply the motion and depth. FFmpeg adds a subtle uniform grain pass. The title card doubles as the 2.5-second section divider sting, preserving one title throughout the edition.

## Verification

- Landscape and portrait first-frame renders were inspected for title legibility, photo fidelity and framing.
- Hero camera and light-sweep transforms at frames 1 and 193 match within 0.000001. The render includes 192 unique samples at 24 fps, omitting the duplicate endpoint. Divider scenes use the same closed path over 60 unique samples.
- All saved scenes retain EEVEE, depth of field, three photographic planes and two packed official photo textures.
- Exact codec, dimensions, duration, file size and SHA-256 fingerprints are recorded in `media-manifest.json`.
- Posters are generated from the first hero/divider frame. The 1200×630 OG is a crop of the landscape hero's first frame and carries the same rendered title.

Page playback, reduced-motion behavior and deployed delivery are checked by the integration lane.

## Encoded deliverables

| Asset | Duration | Bytes |
| --- | ---: | ---: |
| `media-day-2026-09-28-1080x1920-v2.mp4` | 8s | 1,908,293 |
| `media-day-2026-09-28-1920x1080-v2.mp4` | 8s | 2,133,277 |
| `media-day-2026-09-28-sting-1080x1920-v2.mp4` | 2.5s | 960,829 |
| `media-day-2026-09-28-sting-1920x1080-v2.mp4` | 2.5s | 1,079,022 |
| `media-day-2026-09-28-title-card-1080x1920-v2.mp4` | 2.5s | 960,829 |
| `media-day-2026-09-28-title-card-1920x1080-v2.mp4` | 2.5s | 1,079,022 |
