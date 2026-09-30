# Premium Media Day Echo — Arizona v4

State: technically verified review narration. Perceptual pronunciation and listening approval remain open. Production release remains held.

## Final Editor script and render

The 277-word Editor script introduces the reciprocal Ighodaro/Maluach account, distinguishes preparation from public expectations, and explains the new audience comparison. The source and public transcripts are identical. Arizona v12/Qwen3-TTS rendered on the Studio with the approved private reference pair. Researched pronunciation guidance is bound to the public script SHA; reference audio, temporary spellings, sentence WAVs and diagnostics remain private.

Finishing preserves quiet endings through 10ms / −65dB RMS endpoint detection, 200ms padding, and non-overlapping joins. Sentence and paragraph pause targets are 220ms and 400ms; longer natural boundary pauses are retained within the 800ms gate. No tempo acceleration, outgoing crossfades or global pause collapse. A token-cap hit fails generation. Unexpected internal silence is checked separately from ending silence.

## Fingerprints and measurements

- MP3: `the-echo-suns-002-media-day-2026-09-29-v4.mp3`
- Audio SHA-256: `abfff9d9a34f87fbfdc3aa8fc42daee0ee7121575c166e586fb5fbf3e84f151f`
- Final public transcript SHA-256: `940c887abd0d9530c43cb2b42b74d53b6598720f3bdc634479c4782fc25ce342`
- 119.84 seconds; 24kHz mono; 160kb/s MP3; Xing metadata.
- −16.97 LUFS; −2.4 dBTP; trailing silence 0.12 seconds.
- Eight endpoint, pause, join and pronunciation-binding regression tests pass.
- Full-file and separate final-15-second ASR cover the script and complete `Dominate.` ending. Name and short-word recognition ambiguities remain. ASR cannot establish naturalness or correct pronunciation.
- Desktop and phone player checks pass for play/pause, skips, speed, seek to end/start, displayed duration, Audio/title, source/transcript and absence of overflow.

`listeningConfirmed` remains false. Public-origin fingerprint and playback verification are recorded in the review PR after deployment.
