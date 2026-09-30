# Cinematic Media Day visuals — v3

Edition title: **In the Same Building**.

Reproduce with `blender -b -P scripts/hero.py` using installed Blender 5.2.2 LTS, FFmpeg, Node and the repository Sharp dependency. The Mac GPU must be accessible to Blender. The restricted process could not initialize rendering; the authorized GPU process succeeded.

## Source fidelity and treatment

The packed texture is the official Suns September 28 Media Day group photograph already verified in `photo-ledger.json`. The composition preserves the four players together. Three shallow photographic bands sit at Z positions -0.04, 0 and 0.04. Band boundaries lie in the upper studio backdrop and lower floor; faces and bodies share one continuous central photographic plane. A smooth UV edge mask and oval falloff blend the source into the black-purple stage. No new people, likeness alteration or fabricated player movement was generated. Repeated Booker miniature panels have been removed.

The eight-second hero plates contain photography and lighting, leaving the existing HTML title accessible and free of competing burned-in text. The landscape reserves its left side for copy; the portrait preserves a dark lower area. The extruded title remains in the divider/title-card scenes. The OG uses landscape hero frame 1 with only the existing 3D title objects made visible; camera, photos, materials and lights remain at the exact hero-frame state.

EEVEE uses 16 samples, a closed cosine camera dolly and orange light sweep, purple fill light, f/3.2 depth of field and a bounded 0.012-density scattering volume. Photo-shadow casting is disabled to avoid artificial seams between photographic bands. FFmpeg applies subtle uniform grain. Title extrusion remains 0.032. The 2.5-second title card also serves as the section divider sting.

## Verification

- Landscape and portrait source/preview frames were inspected for identity preservation, continuous photographic subjects, edge blending and reserved copy space.
- Hero camera and light-sweep transforms at frames 1 and 193 match within 0.000001. The render includes 192 unique samples at 24 fps. Divider scenes use the same closed path over 60 unique samples.
- Saved scenes retain EEVEE, depth of field, three photographic bands and the packed official texture.
- All final dimensions, codecs, durations, sizes and SHA-256 fingerprints are recorded in `media-manifest.json`.
- Hero and divider posters come from their first rendered frame. The OG is 1200×630 from the landscape hero frame with its 3D title pass enabled.

Page playback, reduced-motion behavior and deployed delivery are checked by the integration lane.

## Encoded deliverables

| Asset | Duration | Bytes |
| --- | ---: | ---: |
| `media-day-2026-09-28-1080x1920-v3.mp4` | 8.000000s | 1,663,684 |
| `media-day-2026-09-28-1920x1080-v3.mp4` | 8.000000s | 2,265,489 |
| `media-day-2026-09-28-sting-1080x1920-v3.mp4` | 2.500000s | 924,258 |
| `media-day-2026-09-28-sting-1920x1080-v3.mp4` | 2.500000s | 1,159,555 |
| `media-day-2026-09-28-title-card-1080x1920-v3.mp4` | 2.500000s | 924,258 |
| `media-day-2026-09-28-title-card-1920x1080-v3.mp4` | 2.500000s | 1,159,555 |

All six videos are H.264/yuv420p, 24 fps, silent, fast-start and below 8 MB. All four saved scenes passed the EEVEE, packed-texture, title-visibility and camera/light endpoint checks. Final portrait divider and OG frames were inspected after encoding.
