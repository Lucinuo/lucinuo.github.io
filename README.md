# lucinuo.github.io

Personal academic website of **Lucille Huang**, PhD Candidate in the Graduate Institute of Life Sciences, National Defense Medical University (NDMU), Taiwan.

Live site: [lucinuo.github.io](https://lucinuo.github.io)

---

## Site structure

| Section | Content |
|---------|---------|
| Hero | Name, title, institution |
| Research | Doctoral research description — fucoidan, platelet activation, burn wound healing |
| About | Academic biography, supervisor, institutional affiliation |
| Education | PhD (in progress) · M.S. Pharmacology · NDMU |
| Expertise | Molecular & cell biology, platelet assays, data analysis, scientific communication |
| CV | Available upon request |
| Contact | Email, institutional address |

Bilingual EN / 中文 — language preference persisted via `localStorage`.

---

## Stack

- Self-contained static HTML/CSS, no framework dependencies
- Google Fonts: Inter
- Deployed from `/site` via GitHub Actions → GitHub Pages (no build step)

---

## Repository structure

```
site/               ← deployed directory (GitHub Pages serves this)
  index.html
  images/
    lucille.jpg
  growth-compass/   ← separate internal tool, not linked from main site
.github/
  workflows/
    deploy.yml      ← push to main → upload ./site → Pages
content/            ← markdown scaffold, not deployed
```

---

## Deployment

Push to `main` → GitHub Actions runs `deploy.yml` → uploads `./site` → GitHub Pages serves it.

---

## Contact

stu9500149@gmail.com  
National Defense Medical University, Taipei, Taiwan
