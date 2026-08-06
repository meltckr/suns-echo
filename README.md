# The Echo — Phoenix Suns

Separate Phoenix Suns edition of AVC’s reusable perception and sentiment intelligence product.

Current edition: **The Echo: Aligned and Extended** — August 6, 2026.

Production: `https://meltckr.github.io/suns-echo/`

## Approved base

This repository reuses the approved Mercury Echo edition, **The Plum Effect**, while preserving its page architecture, quote treatment, glowing two-minute audio player, methodology, filterable source ledger, responsive behavior, share-card pipeline and GitHub Pages workflow. The edition content, Suns identity, assets, metadata and source record are independent.

## Update the next Suns edition

1. Replace the edition copy, audience signals, themes, watch items, implications and source records in `data/edition.ts`.
2. Replace the share-card source image in `public/assets/share/` and update the crop in `scripts/generate-og.mjs`.
3. Update page metadata in `app/layout.tsx`.
4. Generate the matching audio brief and run `npm run release:check`.
5. Commit and push to `main`; the GitHub Pages workflow publishes the static `out/` directory.

Preserve the system. Refresh the edition.
