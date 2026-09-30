# Take 6 — Whisper comparison

Case and punctuation ignored; apostrophes standardized. Words and contractions remain distinct.

Audio SHA-256: `ecdde0f329e0dd9917018df0cd8f40d7dfdc028d05b6bbabb6c13753e7dd1c87`

Script SHA-256: `8b999dcb022ae1840163dd3d04789cff2cbc19e9b1897f99121493f4f8487055`

Unprompted Whisper model: `mlx-community/whisper-large-v3-turbo`. 10 word-difference spans.

| Script word | Expected | Whisper recognized |
| --- | --- | --- |
| 1 | mat | matt |
| 11 | ighodaro | iga daro |
| 13 | khaman maluach | kamam malu watch |
| 28 | maluach | malu watch |
| 55 | maluach | malu watch |
| 59 | kennard | kinnar |
| 69 | and | in |
| 107 | maluach's | model watch's |
| 240 | williams | william's |
| 247 | said | says |

Whisper differences may be recognition errors or delivery errors; they do not establish perceptual listening approval.

## Full recognized text

Matt, the most useful detail from Media Day was Oso Iga Daro helping Kamam Malu watch during pickup games. They were on opposite teams. Oso still gave him pointers. Malu Watch described asking Oso what he saw. That gives you a concrete example of how experience is being shared. Other players described the same kind of help. Malu Watch sought Booker's guidance. Kinnar described his work with Oso Fleming-credited film study in his time with the Valley Suns. Those relationships give newcomers people they can turn to. Camp will show how that preparation carries into their work. The fan comments were direct. Some fans loved what they heard about Model Watch's development. Others hated how hard it was to watch Media Day. People were looking for a stream and dealing with signal problems. The interest was there. Getting to the coverage was the frustration. That matters to you because access shapes how people experience the team. The players gave fans plenty to be interested in. Fans wanted to see and hear them. Some of that attention went into finding the broadcast. Instead, it is a practical part of the day worth keeping in view. The coverage also brought your public commitments back into focus. Booker explained the basketball case for Bridges. You addressed his prior conduct and the organization's standards. Spending commitments received national attention. Those stories carry their own expectations. People will keep evaluating the decisions alongside what happens on the court. William's absence adds an immediate question. Gregory says several months are needed before a reliable return assessment. The return date remains unknown. As camp begins, I'd follow what the younger centers are learning and what newcomers say about the help they receive. Those accounts will give you something specific to revisit. Dominate.

## Raw text diff

```diff
--- Editor script
+++ Whisper
@@ -1,13 +1 @@
-Mat, the most useful detail from Media Day was Oso Ighodaro helping Khaman Maluach during pickup games. They were on opposite teams. Oso still gave him pointers. Maluach described asking Oso what he saw. That gives you a concrete example of how experience is being shared.
-
-Other players described the same kind of help. Maluach sought Booker's guidance. Kennard described his work with Oso. Fleming credited film study and his time with the Valley Suns. Those relationships give newcomers people they can turn to. Camp will show how that preparation carries into their work.
-
-The fan comments were direct. Some fans loved what they heard about Maluach's development. Others hated how hard it was to watch Media Day. People were looking for a stream and dealing with signal problems. The interest was there. Getting to the coverage was the frustration.
-
-That matters to you because access shapes how people experience the team. The players gave fans plenty to be interested in. Fans wanted to see and hear them. Some of that attention went into finding the broadcast instead. It is a practical part of the day worth keeping in view.
-
-The coverage also brought your public commitments back into focus. Booker explained the basketball case for Bridges. You addressed his prior conduct and the organization's standards. Spending commitments received national attention. Those stories carry their own expectations. People will keep evaluating the decisions alongside what happens on the court.
-
-Williams' absence adds an immediate question. Gregory said several months are needed before a reliable return assessment. The return date remains unknown. As camp begins, I'd follow what the younger centers are learning and what newcomers say about the help they receive. Those accounts will give you something specific to revisit.
-
-Dominate.
+Matt, the most useful detail from Media Day was Oso Iga Daro helping Kamam Malu watch during pickup games. They were on opposite teams. Oso still gave him pointers. Malu Watch described asking Oso what he saw. That gives you a concrete example of how experience is being shared. Other players described the same kind of help. Malu Watch sought Booker's guidance. Kinnar described his work with Oso Fleming-credited film study in his time with the Valley Suns. Those relationships give newcomers people they can turn to. Camp will show how that preparation carries into their work. The fan comments were direct. Some fans loved what they heard about Model Watch's development. Others hated how hard it was to watch Media Day. People were looking for a stream and dealing with signal problems. The interest was there. Getting to the coverage was the frustration. That matters to you because access shapes how people experience the team. The players gave fans plenty to be interested in. Fans wanted to see and hear them. Some of that attention went into finding the broadcast. Instead, it is a practical part of the day worth keeping in view. The coverage also brought your public commitments back into focus. Booker explained the basketball case for Bridges. You addressed his prior conduct and the organization's standards. Spending commitments received national attention. Those stories carry their own expectations. People will keep evaluating the decisions alongside what happens on the court. William's absence adds an immediate question. Gregory says several months are needed before a reliable return assessment. The return date remains unknown. As camp begins, I'd follow what the younger centers are learning and what newcomers say about the help they receive. Those accounts will give you something specific to revisit. Dominate.
```
