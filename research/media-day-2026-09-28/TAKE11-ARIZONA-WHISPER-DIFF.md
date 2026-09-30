# Take 11 — Whisper comparison

Case and punctuation ignored; apostrophes standardized. Words and contractions remain distinct.

Audio SHA-256: `75fd71418ffdd7d2f347d25332f284726910e7dce04eee2ac91bbb644417b7fa`

Script SHA-256: `0959d7cc184f5a146c21be67f3ffb66a1cb4338b85d5c6771c380f743188116e`

Unprompted Whisper model: `mlx-community/whisper-large-v3-turbo`. 8 word-difference spans.

| Script word | Expected | Whisper recognized |
| --- | --- | --- |
| 1 | mat | matt |
| 3 | ighodaro | iguodaro |
| 6 | khaman maluach | kaman malouak |
| 18 | maluach | malouak |
| 51 | and | in |
| 60 | fifteen | 15 |
| 84 | maluach | malouak |
| 108 | and | in |

Whisper differences may be recognition errors or delivery errors; they do not establish perceptual listening approval.

## Full recognized text

Matt Oso-Iguodaro described helping Kaman Malouak during pickup games, even when they were on opposite teams. Malouak said he'd ask Oso what he saw after plays. Oso also said the starting job still had to be earned. That combination stood out to me. They were competing for a role in helping each other get better. Twelve of the 15 players from the end of last season are back, and so is every coach. The value is in what those people pass along. Malouak reached out to Booker to learn where Booker wanted the ball and how to help when defenses crowded him. Fleming said film study in his time with the Valley Suns helped him recognize plays earlier. That matters now because Williams is out. The team needs these young players while they're still learning. Gregory said it'll take months before there's a reliable read on his return. Camp will show us more. What can the young players do in live play? Does the help continue as roles are decided? People will also keep judging the Bridges' decision against the standards you described. Dominate.

## Raw text diff

```diff
--- Editor script
+++ Whisper
@@ -1,11 +1 @@
-Mat, Oso Ighodaro described helping Khaman Maluach during pickup games, even when they were on opposite teams. Maluach said he'd ask Oso what he saw after plays. Oso also said the starting job still had to be earned.
-
-That combination stood out to me. They were competing for a role and helping each other get better. Twelve of the fifteen players from the end of last season are back, and so is every coach. The value is in what those people pass along.
-
-Maluach reached out to Booker to learn where Booker wanted the ball and how to help when defenses crowded him. Fleming said film study and his time with the Valley Suns helped him recognize plays earlier.
-
-That matters now because Williams is out. The team needs these young players while they're still learning. Gregory said it'll take months before there's a reliable read on his return.
-
-Camp will show us more. What can the young players do in live play? Does the help continue as roles are decided? People will also keep judging the Bridges decision against the standards you described.
-
-Dominate!
+Matt Oso-Iguodaro described helping Kaman Malouak during pickup games, even when they were on opposite teams. Malouak said he'd ask Oso what he saw after plays. Oso also said the starting job still had to be earned. That combination stood out to me. They were competing for a role in helping each other get better. Twelve of the 15 players from the end of last season are back, and so is every coach. The value is in what those people pass along. Malouak reached out to Booker to learn where Booker wanted the ball and how to help when defenses crowded him. Fleming said film study in his time with the Valley Suns helped him recognize plays earlier. That matters now because Williams is out. The team needs these young players while they're still learning. Gregory said it'll take months before there's a reliable read on his return. Camp will show us more. What can the young players do in live play? Does the help continue as roles are decided? People will also keep judging the Bridges' decision against the standards you described. Dominate.
```
