# Lucinuo

Source for [lucinuo.github.io](https://lucinuo.github.io).

**Status:** public beta. The integrated Lucinuo and Bearing site is live; follow-up features continue through review branches.

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

Bearing centers a quieter loop:

1. Notice — Where am I?
2. Choose — What matters now?
3. Reorient — What is changing?
4. Move — What should I do next?

The original five perspectives remain available as an optional **Life overview** inside Reflect: Knowledge, Expression, Aesthetic, Deep interest, and Emotion. They are lenses rather than scores; people may skip any perspective and save an overview after naming one useful observation and one current focus.

Existing browser records, JSON backups, and Google Drive app data remain readable through an explicit compatibility layer. Legacy storage keys are read-only migration inputs; all new records use the Bearing v4 model. Bearing v3 records migrate forward without losing observations, priorities, direction notes, or next moves.

## Architecture

- Static HTML, CSS, and JavaScript; no framework and no build step.
- Shared design system and navigation in `site/assets/`.
- Bearing data migration logic in `site/bearing/data-model.js`.
- GitHub Actions deploys the `site/` directory to GitHub Pages.
- Bilingual English / Traditional Chinese interface.
- Device-local storage with optional Google Drive `appDataFolder` sync.

## Content responsibilities

- **Lucinuo website:** brand narrative, project selection, context, case studies, and live experiences.
- **Bearing:** the focused product experience for reflection, direction, and action.
- **GitHub:** public source, technical documentation, change history, issues, and reproducibility.

Not every case study has a public repository. Private research records and source collections stay private; the Projects page states the available destination for each project.

## Local preview

From the repository root:

```bash
python3 -m http.server 4181 --directory site
```

Then open `http://127.0.0.1:4181/`. The same preview includes `/projects/` and `/bearing/`.

## Data and privacy

- Bearing stores new records on the current device unless optional Google Drive sync is connected.
- Legacy Growth Compass data is read as a migration input and is not deleted automatically.
- JSON import validates compatible Bearing or legacy backups before confirmation.
- No private research source files are included in this repository.

## Accessibility and device support

- Keyboard-visible controls, skip links, readable contrast, and text labels for essential actions.
- Reduced-motion support and no scroll hijacking.
- Responsive layouts tested for Mac, iPad, and iPhone widths, including Apple safe areas.

## Verification

```bash
node tests/site-validation.test.cjs
node tests/bearing-data.test.cjs
```

The site test checks routes, metadata, internal links, the legacy redirect, GitHub destinations, Life overview, Apple-device rules, and install metadata. The migration test covers v1–v4 precedence, corrupted current data fallback, updated-record merging, Life overview records, and preservation of legacy meaning.

## Deployment

Push to `main` → GitHub Actions uploads `./site` → GitHub Pages publishes the site.

Merging is therefore also the publication decision. Review branches and pull requests do not change the live website.

## License

Copyright remains with Lucille Huang. A separate code or content license has not yet been selected; reuse permission should not be assumed.
