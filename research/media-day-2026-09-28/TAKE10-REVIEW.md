# Take 10 — player support opening, review only

September 30, 2026. The authorized finishing change removes the stream/access complaint from the opening, narration and ownership recommendations. Peat's account of veteran advice and the help young teammates described replace it. A small, qualified detail remains in the Fan section; source records and resonance data remain intact. The visible opening, locked-copy file, Editor transcript, public transcript and brief agree exactly.

This supersedes Take 9 for this review only. The Take 9 MP3 and its original metadata remain unchanged; the exact approved text is recoverable in TAKE9-APPROVED-TRANSCRIPT.txt and Git. Take 9 SHA-256 remains `29767837e4bcf5f244c69d7a4b847c53257e09b7e881ff49ed3953d667dfa3d2`. Its human approval does not transfer to Take 10.

## Render and technical proof

- Local Qwen3-TTS Arizona v12, Base 8-bit; approved declarative 18-second reference and matching text. No paid service or credits.
- Model loaded once; sentence passes; seed 42, temperature 0.9, top_k 50, repetition penalty 1.5, maximum 384 tokens. At tempo 1.15; guarded-v1, no crossfade. Existing guards and sentence/paragraph timing retained.
- The standalone close is `Dominate!`. Only the gap immediately before it changes to 400ms before tempo adjustment; no gain or pitch manipulation. Perceived emphasis remains a listening question.
- Duration 60.046042 seconds; 24 kHz mono, 160 kbps MP3 with Info/Xing header.
- Two-pass loudnorm target -16 LUFS/-1.5 dBTP. Measured -16.72 LUFS using the approved dual-mono convention, -1.92 dBTP. Trailing silence 0.244625 seconds.
- No clipping or unexpected 900ms silence/digital-black holes.
- Audio SHA-256 `7e0e2a255aa2559a571f51e1675f00e6b412f7c98e44c8847fbc7bfb8beb1a18`.
- Public script SHA-256 `4c3d2deee9ff25caef7aa2b7c5e0c26c80a19f14baf6add2433d46866e9a08eb`.

[Full unprompted Whisper diff](TAKE10-ARIZONA-WHISPER-DIFF.md) records eleven differences. It recognizes the complete closing and all new support sentences. Differences include Mat/Matt, from/for, Ighodaro/Iguodaro, Khaman Maluach/Kamal Malouak, Maluach/Malouak, twelve/12, fifteen/15, Kennard/Canard, Oso/also and Peat/Pete. These remain raw review flags, not rewritten recognition text or a pronunciation pass.

Fourteen unchanged sentence renders are byte-for-byte identical to their approved Take 9 raw WAVs, including the existing name-bearing sentences. No sentence rerenders or new voice tuning were performed. Prior deterministic retries with identical input/settings produced identical audio; repeating them supplies no independent pronunciation evidence. No full subjective listen is available in this runtime. Take 10 requires a human listen before release.

## Reading and sharing

The player now follows the title/purpose and precedes the complete written opening. Its visible duration is 1:00. Phone hero padding and height are compacted; the house player and controls remain unchanged and do not autoplay.

Header and footer retain the full AVC wordmark. The 1200×630 v4 card preserves the approved real-photo Blender composition and title, adds the full AVC wordmark and “Players helping players.” Metadata description foregrounds the development/support accounts and first-practice update, with a new versioned image URL to reduce stale previews.

Local review checks pass lint, eighteen resonance tests, evidence/transcript/audio/metadata validation, TypeScript and static build. Release checks correctly remain held for new-take listening, fresh player verification and Mel's release approval. Fresh mobile/desktop interaction checks and actual iMessage preview rendering are not claimed; the supported local browser was unavailable. Draft PR #2 and the isolated review preview may update. No merge, production release or message to Mat.
