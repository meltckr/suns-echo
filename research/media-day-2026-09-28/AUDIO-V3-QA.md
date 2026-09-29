# Media Day Echo — audio v3 verification

State: corrected narration technically verified; pronunciation and perceptual listening approval remain open. Review-only publication is authorized. Production release and merge remain held.

## Change

Mel reported mispronounced Ighodaro/Maluach and clipped sentence endings. The v3 renderer uses the same approved Arizona v12/Qwen3-TTS model and private reference pair. The public Editor script is unchanged. Private pronunciation instructions are SHA-bound to the public transcript and guided by the [NBA Suns audio guide](https://www.nba.com/news/phoenix-suns-2025-26-pronunciation-guide) and [team game notes](https://www.nba.com/gamenotes/suns.pdf). Temporary spellings, reference recordings, raw sentences and logs stay outside the public package.

The previous finishing chain used samplewise -50dB trimming, outgoing crossfades, global pause collapse and tempo acceleration. The repo-local renderer preserves quiet endings through 10ms/-65dB RMS detection, 200ms endpoint padding, non-overlapping joins, 220ms sentence and 400ms paragraph pause targets. Existing longer natural boundary pauses are preserved up to the bounded 800ms gate. No tempo acceleration or global pause collapse occurs. Generation is bounded at 1,536 tokens per sentence; token-cap truncation fails. Only excessive trailing silence is trimmed. Unexpected internal silence is checked separately from intentional breaths.

## Evidence

- Audio: `the-echo-suns-002-media-day-2026-09-29-v3.mp3`; 147.32s, 24kHz mono, 160kb/s MP3 with Xing metadata.
- Audio SHA-256: `e47982290a51caaed64def97f466bd2e95ef6b99611ce914295e38a5c5326ecb`.
- Public transcript SHA-256: `67b84e2e8db00c97f7378deabadb2b705ee0e4bc96ab6c3e6dc975ea4e6775cf`; exact unchanged Editor script.
- Loudness -16.77 LUFS; true peak -2.3 dBTP; trailing silence 0.12s.
- Eight focused PCM/endpoint/join/pronunciation-binding regression tests passed.
- Lint, TypeScript, review validator and static export passed.
- Full-file and separate final-15s ASR cover all sentences and the complete `Dominate.` close. Names and short recognition ambiguities remain disclosed; ASR does not establish pronunciation quality.
- Internal browser playback passed at 1440px and 390px: play/pause, end/start seek, skips, speed, accurate displayed duration, Audio/title, no overflow.

Public-origin verification is recorded in the PR after deployment. `listeningConfirmed` and `listeningComparisonConfirmed` remain false pending perceptual review.
