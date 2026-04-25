---
title: ''
summary: ''
date: 2024-01-01
type: landing

sections:
  - block: resume-biography-3
    content:
      username: me
      text: ''
      button:
        text: 下載 CV
        url: uploads/resume.pdf
      headings:
        about: ''
        education: ''
        interests: ''
    design:
      background:
        gradient_mesh:
          enable: true
      name:
        size: md
      avatar:
        size: medium
        shape: circle
  - block: markdown
    content:
      title: '📚 我的研究'
      subtitle: ''
      text: |-
        我的研究探討來自日本海帶（*Saccharina japonica*）的褐藻醣膠（SJF）如何調控早期血小板活化，進而促進燒燙傷傷口癒合的分子機制。

        研究聚焦於 SJF → NRP-1 → FAK → Akt 訊號路徑，及其對 PDGF/VEGF 釋放與組織修復的貢獻。

        歡迎交流合作 😃
    design:
      columns: '1'
  - block: collection
    id: papers
    content:
      title: 精選發表
      filters:
        folders:
          - publications
        featured_only: true
    design:
      view: article-grid
      columns: 2
  - block: collection
    content:
      title: 近期發表
      text: ''
      filters:
        folders:
          - publications
        exclude_featured: false
    design:
      view: citation
---
