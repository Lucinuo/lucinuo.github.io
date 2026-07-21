# Lucinuo

Source for [lucinuo.github.io](https://lucinuo.github.io).

**Status:** public-studio and private-workspace boundary redesign on a review branch. The current public site remains unchanged until the redesign is approved and merged.

Lucinuo is Lucille Huang's public digital studio. It brings research context, formally published work, selected projects, and public implementation records into one understandable system.

## Public routes

| Route | Purpose |
|:--|:--|
| `/` | Public studio overview and selected work |
| `/research/` | Research directions, questions, scientific context, and evidence practice |
| `/publications/` | Verified formal publications with complete citation records |
| `/projects/` | Selected digital tools, research workflows, visual systems, and open implementations |
| `/projects/bearing/` | Public case study for the private Bearing application; no app access or personal data |
| `/projects/lighthouse/` | Public case study for the Lighthouse presence concept |
| `/lighthouse/` | Self-contained public interaction demonstration for Lighthouse |
| `/about/` | Direct introduction, current work, academic context, and contact |
| `/notes/` | Compatibility redirect to `/publications/` |
| `/workspace/` | Non-indexed public boundary page; it does not expose the private application |
| `/bearing/` | Compatibility redirect to the private workspace boundary |
| `/growth-compass/` | Legacy compatibility redirect; old browser data is not deleted |

GitHub is not a replacement for the website. Lucinuo explains why a project matters and selects what should be seen; GitHub holds public source, technical documentation, and development history.

## Public and private boundary

The private workspace is a personal system, not a public product. Its design concept may be documented at `/projects/bearing/`, but the working application, authentication, records, and data remain private. It must use real identity authentication and private storage on a separate deployment origin. GitHub Pages, hidden URLs, front-end passwords, and obfuscated scripts are not acceptable protection.

The release and migration requirements are documented in [`docs/private-workspace-architecture.md`](docs/private-workspace-architecture.md). The public `/bearing/` route must not be withdrawn on `main` until authenticated access, compatible import, verified transfer, and recovery export are complete.

## Architecture

- Static HTML, CSS, and JavaScript; no framework or build step.
- Shared public design system and navigation in `site/assets/`.
- English and Traditional Chinese content.
- Theme follows the operating-system preference until the visitor chooses light or dark; the last explicit choice is remembered.
- GitHub Actions deploys the `site/` directory to GitHub Pages.
- Private workspace code, credentials, records, and sync state belong outside this public deployment.

## Content rules

- Publication records are added only after formal publication and bibliographic verification.
- The public site selects representative projects; it does not mirror every repository.
- Private research records, source collections, personal reflections, and credentials are not committed here.
- A future About photograph must be an authentic work or daily-life image supplied by Lucille. The site does not synthesize a false laboratory or work scene.

## Local preview

```bash
python3 -m http.server 4181 --directory site
```

Open `http://127.0.0.1:4181/`.

## Accessibility and device support

- Keyboard-visible controls, skip links, readable contrast, and text alternatives for icon controls.
- System-aware light and dark themes.
- Reduced-motion support and no scroll hijacking.
- Responsive layouts for Mac, iPad, and iPhone, including Apple safe areas.

## Verification

```bash
node tests/site-validation.test.cjs
```

The test checks public routes, metadata, internal links, Publications migration, private boundary rules, sitemap scope, GitHub destinations, theme behavior, and Apple-device layout safeguards.

## Deployment

Push to `main` → GitHub Actions uploads `./site` → GitHub Pages publishes the site.

Merging is the publication decision. Review branches do not change the live website.

## License

Copyright remains with Lucille Huang. A separate code or content license has not yet been selected; reuse permission should not be assumed.
