# lucinuo.github.io

Personal academic website of **Lucille Huang**, PhD Candidate at the Graduate Institute of Life Sciences, National Defense Medical University (NDMU), Taiwan.

🔗 **Live site:** [lucinuo.github.io](https://lucinuo.github.io)

---

## About

This site presents my doctoral research on the molecular mechanisms of *Saccharina japonica*-derived fucoidan (SJF) in modulating early platelet activation to promote burn wound healing.

**Research keywords:** fucoidan · platelet activation · GPVI · P-selectin · NRP-1 · FAK · Akt · burn wound healing · hemostasis · coagulation cascade

---

## Site Structure

| Section | Content |
|---------|---------|
| **Home** | Name, title, typed role switcher (EN/ZH) |
| **About** | Background, research interests, skills, CV link |
| **Research** | Central question · Core hypothesis · Mechanistic model · Aims 1–3 · Unresolved questions · Publications |
| **Methods** | Experimental toolkit (Flow Cytometry, Platelet Assays, In Vivo Burn Model…) · Analytical toolkit (IPA, Phosphoproteomics, Western Blot…) |
| **Notes** | Concept notes · Paper summaries |
| **Contact** | Email form |

Bilingual EN / 中文 switcher — language preference persisted via `localStorage`.

---

## Stack

- Static single-page HTML (Bodo template, customized)
- Deployed via GitHub Actions → GitHub Pages
- No frameworks, no build step
- Google Fonts: Roboto + Noto Sans TC

---

## Repository Structure

```
site/           ← deployed files (GitHub Pages serves this)
  index.html
  css_yen/
  js_yen/
  fonts/
  images_yen/
.github/
  workflows/
    deploy.yml  ← GitHub Actions deployment (checkout → upload → deploy)
```

---

## Contact

📧 stu9500149@gmail.com  
🏫 National Defense Medical University, Taipei, Taiwan
