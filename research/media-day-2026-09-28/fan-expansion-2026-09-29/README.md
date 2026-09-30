# Fan expansion audit — September 29, 2026

Captured 93 distinct indexed comments from two r/suns Media Day threads. Together with the 25 supplied Instagram/Facebook comments, the staged sample contains 118 unique comment texts.

Direct public JSON was unavailable: www.reddit.com returned HTTP 403; old.reddit.com redirected to login and returned HTTP 404. Exact responses are retained. Public search-index retrieval provided dated comment text; it does not provide Reddit comment IDs, exact timestamps or author identity. Local capture IDs are explicitly content-derived, and platformCommentId is null. Do not describe this as a successful Reddit API pull or a complete thread export.

- comments-indexed.json: new public indexed comments, source/thread/date/text and capture provenance.
- comments-combined.json: those comments plus the unchanged 25 supplied comments.
- audit.json: requests, search queries, counts, exclusions and limitations.
- discovery-*.json and open-results.json: exact returned tool text snapshots.
- direct-*.response: exact HTTP response bodies.

Text is deduplicated using whitespace-normalized content. Empty/deleted/removed/obvious bot responses and index image/URL placeholders are excluded. Original spelling and within-comment wording are preserved. Source threads are the [Media Day megathread](https://www.reddit.com/r/suns/comments/1wsj8c9/megathread_phoenix_suns_media_day_2026_10am_start/) and [Maluach reaction thread](https://www.reddit.com/r/suns/comments/1wsm1rd/_/). Date labels are September 28–29, 2026. These captures now feed the edition’s active audience-separated dataset. The complete reviewed coding is in ../resonance-expanded-coding.json; coding.json retains the initial retrieval-stage coding for audit. Rebuild with npm run resonance:recode.
