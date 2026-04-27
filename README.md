# lucinuo.github.io

Personal academic website of **Lucille Huang**, PhD Candidate at the Graduate Institute of Life Sciences, National Defense Medical University (NDMU), Taiwan.

🔗 **Live site:** [lucinuo.github.io](https://lucinuo.github.io)

---

## About

Personal academic website presenting a concise professional introduction for a PhD Candidate in biomedical research.

**Keywords:** biomedical research · platelet biology · wound healing · molecular signaling · translational medicine

---

## Site Structure

| Section | Content |
|---------|---------|
| **Home** | Name, title, role statement |
| **About** | Introduction, institution, contact info |
| **Education** | PhD Candidate · Graduate Institute of Life Sciences · NDMU · Passed Qualifying Examination |
| **Academic Interests** | Biomedical research · Platelet biology · Wound healing · Molecular signaling · Translational medicine |
| **Skills** | Experimental design · Molecular biology · Cell-based assays · Scientific writing · Literature review |
| **CV** | Available upon request |
| **Contact** | Email form |

Bilingual EN / 中文 switcher — language preference persisted via `localStorage`.

---

## Stack

- Pure custom static HTML, deployed from `/site`
- GitHub Actions → GitHub Pages (no build step)
- Google Fonts: Roboto + Noto Sans TC

---

## Repository Structure

```
site/           ← deployed files (GitHub Pages serves this)
  index.html
  css_yen/
  js_yen/
  images_yen/
.github/
  workflows/
    deploy.yml  ← checkout → upload ./site → deploy to Pages
content/        ← Hugo-compatible markdown scaffold (not deployed)
```

---

## Deployment

Push to `main` → GitHub Actions runs `deploy.yml` → uploads `./site` → GitHub Pages serves it.

---

## Contact

📧 stu9500149@gmail.com
🏫 National Defense Medical University, Taipei, Taiwan
