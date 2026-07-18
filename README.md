# Lucinuo

Source for [lucinuo.github.io](https://lucinuo.github.io).

**Lucinuo** is the personal brand and website of Lucille Huang, bringing together biomedical research, useful digital tools, research visualization, and systems for clearer thinking.

> Research. Build. Grow.

## Main routes

| Route | Purpose |
|:--|:--|
| `/` | Lucinuo home and brand overview |
| `/research/` | Biomedical research, evidence practice, and research visualization |
| `/projects/` | Digital tools and research workflows |
| `/bearing/` | Bearing — a personal system for reflection, direction, and action |
| `/notes/` | Short notes across Research, Build, and Grow |
| `/about/` | Lucille Huang's background, capabilities, and contact |
| `/growth-compass/` | Compatibility bridge to `/bearing/`; excluded from navigation and sitemap |

## Bearing

**Bearing by Lucinuo**
**See clearly. Move deliberately.**

Bearing replaces the previous five-pillar tracker with a quieter loop:

1. Notice — Where am I?
2. Choose — What matters now?
3. Reorient — What is changing?
4. Move — What should I do next?

Existing browser records, JSON backups, and Google Drive app data remain readable through an explicit legacy compatibility layer. Legacy storage keys are read-only migration inputs; all new records use the Bearing v3 model.

## Architecture

- Static HTML, CSS, and JavaScript; no framework and no build step.
- Shared design system and navigation in `site/assets/`.
- Bearing data migration logic in `site/bearing/data-model.js`.
- GitHub Actions deploys the `site/` directory to GitHub Pages.
- Bilingual English / Traditional Chinese interface.
- Device-local storage with optional Google Drive `appDataFolder` sync.

## Verification

```bash
node tests/bearing-data.test.cjs
```

The migration test covers v1, v2, v3 precedence, corrupted current data fallback, updated-record merging, and preservation of legacy meaning.

## Deployment

Push to `main` → GitHub Actions uploads `./site` → GitHub Pages publishes the site.
