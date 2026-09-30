# Take 8 — Arizona v12-v4 recipe restored

Review-ready file; human listening and name approval remain open. ElevenLabs was stopped before any TTS request. No alternate provider was used.

The unchanged 200-word locked transcript is rendered with the Mercury Portland September 17 v12-v4 recipe and the approved declarative 18-second reference pair. The model and runtime match Portland: Qwen3-TTS Base 8-bit, mlx-audio 0.5.1, MLX 0.32.1. The adapter applies pronunciation substitutions only in a private generation input. Public text remains exact.

The copied generator, guarded factory and QA preserve all synthesis and finishing settings. Echo paths and closing are adapted; the factory retains private sentence WAVs and accepts selected sentence indices for the requested retries. The QA duration range accepts this shorter locked Echo script. The obsolete take-6 renderer and its penalty override/paragraph-join regressions are removed.

- Duration: 58.580208 seconds.
- Delivery: 24 kHz mono, 160 kbps MP3 with Xing/Info header.
- Integrated loudness: -16.49 LUFS, measured with Portland's `dual_mono=true` convention.
- True peak: -1.92 dBTP.
- End silence: 0.227667 seconds; full Dominate recognized.
- No clipping, unexpected 900ms silence, digital-black gaps or interior zero runs.
- Audio SHA-256: `76affad0317d92feadc36b725caeb1a321a83c40ba68cff646c38187c77e23ec`.
- Public script SHA-256: `9928d7cea83e41626a15337f57db6497a44def4f7cf2a05d20bd196d8deaa6e7`.

## Whisper and sentence retries

The full unprompted Whisper comparison is [TAKE8-ARIZONA-WHISPER-DIFF.md](TAKE8-ARIZONA-WHISPER-DIFF.md). It preserves all eleven differences, including Mat/Matt, number spelling, name spelling, from/for and centers/sinners. Nothing in the raw transcript was corrected to manufacture a pass.

Only sentences 2, 4, 8, 9 and 12 were re-rendered, once each. Every regenerated WAV was byte-for-byte identical to its initial WAV with the required seed 42 and exact same settings/input; the other seventeen sentences were reused. Repeating identical generation further cannot repair these ASR flags. The four-retry ceiling was never exceeded. Ighodaro, Khaman, Maluach and Kennard remain unresolved ASR spelling flags. Mat/Matt is the explicitly permitted private-input spelling; the raw difference still appears. Oso, Booker, Fleming, the Valley Suns, Williams, Gregory and Bridges match in the full transcript.

A Whisper spelling difference does not establish how the name sounds. No complete perceptual listen or pronunciation approval is claimed.

## Product verification

`review:check` passes lint, eighteen resonance regressions, source/copy/recipe/proof validation, TypeScript and static export. One active player uses only v8; the export contains its MP3 and two metadata files. The locked title and `Audio` label remain exact. Desktop 1440px and phone 390px checks pass play/pause, seeking, -15/+15, 1/1.5/2 speed, duration, transcript/download links and no horizontal overflow. The approved player bytes are unchanged.

The Desktop copy is `/Users/meltucker/Desktop/Take8-Echo-002.mp3`, with the same SHA-256. `release:check` remains held for human listening and Mel's release approval. Only the draft PR and isolated review preview may update; merge and production release remain held.
