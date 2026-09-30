# Expanded fan evidence and ten-section review

State: technically verified review on `codex/suns-echo-media-day-2026-09-28`. These checks were collected before publication. Mel subsequently authorized pushing this branch and updating the isolated review preview; merge and production release remain held. Deployment and public-origin verification will be recorded in PR #1.

## Fan sample and coding

118 distinct captured comment texts: 25 original supplied Instagram/Facebook comments, 59 indexed comments from the existing r/suns Media Day megathread and 34 indexed comments from a Maluach reaction thread. Date labels are September 28–29, 2026. This exceeds the requested 100-comment target; 103 captured comments contribute to displayed topic scores, while 15 contextual comments have explicit exclusions.

Direct www.reddit.com JSON returned 403. old.reddit.com redirected to login and returned 404. Four attempted responses and skips are recorded. No direct Reddit API comment was retrieved. Public web-index captures are partial, with absent platform comment IDs, exact timestamps and verified author identity. Local capture IDs are content hashes. Captured texts do not establish unique respondents or representative fan sentiment.

Every indexed text is checked at its recorded Unicode offset against the saved raw capture. Whitespace-normalized text is deduplicated across both threads and supplied posts. Original wording and spelling remain intact. One separate supplied paraphrase remains excluded. No post likes or platform totals weight the sample.

AI-assisted editorial coding was recomputed through `scripts/recode-resonance-review.mjs` using complete reviewed assignments in `resonance-expanded-coding.json`. Each captured comment has exactly one coding/exclusion record; one comment can concern multiple topics. There was no new paid API call. Five media article inputs remain unchanged. Only journalist framing enters media sentiment; attributed principal remarks and reported facts remain unscored as opinion.

Fifteen curated phrase groups now include viewing/coverage access, Dunn and Fleming. A second review restored the Booker/Maluach summer-work comment to the shared-work topic. Fan tiers are 1–4 low, 5–14 medium and 15+ high; media tiers remain 1 low, 2 medium and 3+ high. Null, neutral and opposing reactions averaging zero remain distinct. Updated findings show positive development interest, coverage-access frustration, and season anticipation alongside roster doubts.

The visible ledger contains 31 rows: all original 25 review records plus six supplementary fan-source rows. All seven fan input URLs resolve to Fans ledger records; the existing megathread row states its 59-comment indexed contribution. All supplied sources explicitly disclose that they were not independently retrieved. The methodology caveat carries 118/93/25/103/15 counts and the relative-tier limitation.

## Density and preservation

Sixteen numbered sections became ten: review, alignment, signal/source mix, direct evidence, combined coverage, fan pulse, ownership, synthesis, Word Resonance and methodology. Source ledger remains an unnumbered reference section. Distinct availability, standards and player-identity narratives remain accessible under Alignment; overlapping themes are carried by the named Alignment cards. Quotes appear once in Direct Evidence. Ownership contains the perception/watch material. Existing anchors reveal nested disclosures.

The first-minute markup and ownershipBrief data are byte-for-byte unchanged. Validators bind their SHA-256 fingerprints and enforce ten section numbers. All original 25 source records and eight official interviews remain. Hero assets, title, full AVC wordmarks, quote treatment, approved player, source filtering and page architecture are preserved.

## Verification

- `npm run review:check`: passes lint, 18 regression tests, review validation, TypeScript and static export using the isolated review base path.
- `node scripts/validate-resonance-review.mjs`: passes quote fidelity, comment boundaries/raw offsets, denominator counts, roles, scores, tiers and source-link checks.
- `scripts/test-echo-audio-render.py`: eight finishing regressions pass. Arizona v5 matches the revised public transcript; see AUDIO-V5-QA.md.
- Browser checks at 1440×900 and 390×844: no horizontal overflow, full header/footer AVC marks, correct landscape/portrait hero source and poster, working evidence disclosure/focus, filters All15/Fans15/Media11/Both11, all31 ledger rows and all7 Fans URLs, audio controls and motion pause.
- Existing reduced-motion handlers remain statically verified; the browser capability did not expose preference emulation, so this update does not claim a fresh runtime reduced-motion emulation.
- `npm run release:check`: correctly stops on exactly two held gates, human audio listening approval and Mel’s production-release approval. Its build stage does not run after those held gates; the separate review build passes.
- Git diff whitespace check passes. No new package dependency. An existing unrelated `.next 2/` remains untouched. Three duplicate generated type files in `.next/types/` were recoverably moved to `/private/tmp/echo-duplicate-generated-types/`; the fresh build succeeds.

The local verification above performed no push or deployment. Mel subsequently authorized branch push, PR update and isolated review publication. The deployment must package approved main at the root. No merge or production release is authorized.
