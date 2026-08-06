# The Echo — Phoenix Suns

Separate Phoenix Suns edition of AVC’s reusable perception and sentiment intelligence product.

Current edition: **The Echo: Aligned and Extended** — August 6, 2026.

Production: `https://meltckr.github.io/suns-echo/`

## Approved base

This repository reuses the approved Mercury Echo edition, **The Plum Effect**, while preserving its page architecture, quote treatment, glowing two-minute audio player, methodology, filterable source ledger, responsive behavior, share-card pipeline and GitHub Pages workflow. The edition content, Suns identity, assets, metadata and source record are independent.

## Update the next Suns edition

1. Replace the edition copy, audience signals, themes, watch items, implications and source records in `data/edition.ts`.
2. Replace the share-card background in `public/assets/share/` and update the deterministic 1200×630 composition in `scripts/generate-og.mjs`. Every edition requires a professional, title-led Open Graph card designed to remain legible at Messages/social-preview size; a plain page screenshot is not release-ready.
3. Update page metadata in `app/layout.tsx`.
4. Generate the matching audio brief and run `npm run release:check`.
5. Commit and push to `main`; the GitHub Pages workflow publishes the static `out/` directory.

Preserve the system. Refresh the edition.
