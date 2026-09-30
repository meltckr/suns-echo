# Take 10 — Whisper comparison

Case and punctuation ignored; apostrophes standardized. Words and contractions remain distinct.

Audio SHA-256: `7e0e2a255aa2559a571f51e1675f00e6b412f7c98e44c8847fbc7bfb8beb1a18`

Script SHA-256: `4c3d2deee9ff25caef7aa2b7c5e0c26c80a19f14baf6add2433d46866e9a08eb`

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
| 88 | kennard | canard |
| 91 | oso | also |
| 103 | peat | pete |

Whisper differences may be recognition errors or delivery errors; they do not establish perceptual listening approval.

## Full recognized text

Matt, the best moment for media day wasn't at a podium. It was Oso Iguodaro talking about pickup games with Kamal Malouak. They were on opposite teams fighting for the same minutes and Oso kept giving him pointers anyway. Malouak said he'd go to Oso after plays and ask what he saw. That's what continuity actually looks like. 12 of the 15 players from the end of last season are back, and so is every coach. The young guys know who to ask. Malouak goes to Booker. Canard works with also. Fleming credits film study and his time with the Valley Suns. Pete described advice from Bridges on driving to the basket and handling contact. Younger teammates stayed after workouts to talk. The help kept going after the workout ended. Three things to watch in camp. First, Williams Gregory says it'll be months before there's a real read on his return. Second, how fast the young centers grow into that gap. Third, the Bridges decision because people will keep measuring it against the standards you laid out. That's the value I see in this returning group. Players can name the people helping them and explain what they're learning. Camp will show how that work carries over. Dominate.

## Raw text diff

```diff
--- Editor script
+++ Whisper
@@ -1,11 +1 @@
-Mat, the best moment from Media Day wasn't at a podium. It was Oso Ighodaro talking about pickup games with Khaman Maluach. They were on opposite teams, fighting for the same minutes, and Oso kept giving him pointers anyway. Maluach said he'd go to Oso after plays and ask what he saw.
-
-That's what continuity actually looks like. Twelve of the fifteen players from the end of last season are back, and so is every coach. The young guys know who to ask. Maluach goes to Booker. Kennard works with Oso. Fleming credits film study and his time with the Valley Suns.
-
-Peat described advice from Bridges on driving to the basket and handling contact. Younger teammates stayed after workouts to talk. The help kept going after the workout ended.
-
-Three things to watch in camp. First, Williams: Gregory says it'll be months before there's a real read on his return. Second, how fast the young centers grow into that gap. Third, the Bridges decision, because people will keep measuring it against the standards you laid out.
-
-That's the value I see in this returning group. Players can name the people helping them and explain what they're learning. Camp will show how that work carries over.
-
-Dominate!
+Matt, the best moment for media day wasn't at a podium. It was Oso Iguodaro talking about pickup games with Kamal Malouak. They were on opposite teams fighting for the same minutes and Oso kept giving him pointers anyway. Malouak said he'd go to Oso after plays and ask what he saw. That's what continuity actually looks like. 12 of the 15 players from the end of last season are back, and so is every coach. The young guys know who to ask. Malouak goes to Booker. Canard works with also. Fleming credits film study and his time with the Valley Suns. Pete described advice from Bridges on driving to the basket and handling contact. Younger teammates stayed after workouts to talk. The help kept going after the workout ended. Three things to watch in camp. First, Williams Gregory says it'll be months before there's a real read on his return. Second, how fast the young centers grow into that gap. Third, the Bridges decision because people will keep measuring it against the standards you laid out. That's the value I see in this returning group. Players can name the people helping them and explain what they're learning. Camp will show how that work carries over. Dominate.
```
