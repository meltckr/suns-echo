# Take 9 — Whisper comparison

Case and punctuation ignored; apostrophes standardized. Words and contractions remain distinct.

Audio SHA-256: `29767837e4bcf5f244c69d7a4b847c53257e09b7e881ff49ed3953d667dfa3d2`

Script SHA-256: `9928d7cea83e41626a15337f57db6497a44def4f7cf2a05d20bd196d8deaa6e7`

Unprompted Whisper model: `mlx-community/whisper-large-v3-turbo`. 11 word-difference spans.

| Script word | Expected | Whisper recognized |
| --- | --- | --- |
| 1 | mat | matt |
| 5 | from | for |
| 15 | ighodaro | iguodaro |
| 21 | khaman maluach | kamal malouak |
| 40 | maluach | malouak |
| 59 | twelve | 12 |
| 62 | fifteen | 15 |
| 84 | maluach | malouak |
| 91 | oso | also |
| 111 | maluach | malueck |
| 156 | centers | sinners |

Whisper differences may be recognition errors or delivery errors; they do not establish perceptual listening approval.

## Full recognized text

Matt, the best moment for media day wasn't at a podium. It was Oso Iguodaro talking about pickup games with Kamal Malouak. They were on opposite teams fighting for the same minutes and Oso kept giving him pointers anyway. Malouak said he'd go to Oso after plays and ask what he saw. That's what continuity actually looks like. 12 of the 15 players from the end of last season are back, and so is every coach. The young guys know who to ask. Malouak goes to Booker. Kennard works with also. Fleming credits film study and his time with the Valley Suns. Fans noticed they loved what they heard about Malueck. What they didn't love was trying to watch. People went looking for a stream and couldn't find one. Three things to watch in camp. First, Williams Gregory says it'll be months before there's a real read on his return. Second, how fast the young sinners grow into that gap. Third, the Bridges decision because people will keep measuring it against the standards you laid out. My one call next media day, one official stream pinned everywhere. The fans showed up, Make it easy for them to get in. Dominate.

## Raw text diff

```diff
--- Editor script
+++ Whisper
@@ -1,11 +1 @@
-Mat, the best moment from Media Day wasn't at a podium. It was Oso Ighodaro talking about pickup games with Khaman Maluach. They were on opposite teams, fighting for the same minutes, and Oso kept giving him pointers anyway. Maluach said he'd go to Oso after plays and ask what he saw.
-
-That's what continuity actually looks like. Twelve of the fifteen players from the end of last season are back, and so is every coach. The young guys know who to ask. Maluach goes to Booker. Kennard works with Oso. Fleming credits film study and his time with the Valley Suns.
-
-Fans noticed. They loved what they heard about Maluach. What they didn't love was trying to watch. People went looking for a stream and couldn't find one.
-
-Three things to watch in camp. First, Williams: Gregory says it'll be months before there's a real read on his return. Second, how fast the young centers grow into that gap. Third, the Bridges decision, because people will keep measuring it against the standards you laid out.
-
-My one call: next Media Day, one official stream, pinned everywhere. The fans showed up. Make it easy for them to get in.
-
-Dominate.
+Matt, the best moment for media day wasn't at a podium. It was Oso Iguodaro talking about pickup games with Kamal Malouak. They were on opposite teams fighting for the same minutes and Oso kept giving him pointers anyway. Malouak said he'd go to Oso after plays and ask what he saw. That's what continuity actually looks like. 12 of the 15 players from the end of last season are back, and so is every coach. The young guys know who to ask. Malouak goes to Booker. Kennard works with also. Fleming credits film study and his time with the Valley Suns. Fans noticed they loved what they heard about Malueck. What they didn't love was trying to watch. People went looking for a stream and couldn't find one. Three things to watch in camp. First, Williams Gregory says it'll be months before there's a real read on his return. Second, how fast the young sinners grow into that gap. Third, the Bridges decision because people will keep measuring it against the standards you laid out. My one call next media day, one official stream pinned everywhere. The fans showed up, Make it easy for them to get in. Dominate.
```
