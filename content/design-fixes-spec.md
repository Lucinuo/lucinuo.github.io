# Design review 修正規格 — site/index.html

> 給 Codex 冷讀。來源：CC 對線上站做的正式 design review（2026-06-29）。
> 全部改在 `site/index.html` 的 inline `<style>` 與既有 markup。純靜態 no-build，改完本機開來目視驗證再 commit。
> **只做下面 5 條「已定案機械修正」。§A 的「不做」清單交回 CC，別自己發揮。**

---

## 1.（High）SVG 色島：5 個飽和色收進 slate 家族
**問題**：全站 monochrome slate，唯獨 research SVG 用 5 個飽和分類色 → 看起來像外來元件，削弱重點。
**修法**：保留分類區辨，但全部拉成「深、低彩度、slate 家族」，**白字維持**（這些底色白字對比 ≥7:1，AA 通過）。

改 `style="--node-color: ..."`（在 `<g class="research-node" ...>`）：
| node | 現值 | 改成 |
|------|------|------|
| n1 HCC stroma | `#465468` | `#465468`（不動，當基準） |
| n2 Hypoxia | `#B57845` | `#5C5566` |
| n3 Glycolytic | `#B57845` | `#5C5566` |
| n4 mTOR | `#66507C` | `#4A5A5A` |
| n5 Immune suppression | `#A95B5F` | `#6B4F52` |
| n6 Metabolic vuln. | `#558B6E` | `#4A6356` |

（語義仍在：暖=代謝、青=訊號、鏽=抑制、綠=標靶，只是全被拉進低彩度深色。`.research-node text { fill:#fff }` 不動。）

## 2.（High）`:focus-visible` 焦點環
**問題**：連結/按鈕只靠 color 變化，鍵盤焦點看不見。
**修法**：inline `<style>` 加：
```css
a:focus-visible,
button:focus-visible,
.contact-btn:focus-visible,
.cv-cta:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  border-radius: 2px;
}
```

## 3.（High）`prefers-reduced-motion`
**問題**：scroll-synced opacity + 全域 smooth scroll 對前庭敏感者無退場。
**修法**：inline `<style>` 加（scrollytelling 仍可用，只是瞬切不過渡）：
```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .research-node,
  .research-arrow,
  .research-step { transition: none; }
}
```

## 4.（Medium）double-dimming 太重 + 作用態只有減法
**問題**：非作用 node `opacity:0.25`、非作用 step `opacity:0.42` 同時變淡 → 大片內容讀成「壞掉」；作用態只靠別人變暗，沒有正向強調。
**修法**：
- `.research-node, .research-arrow` 的 `opacity: 0.25` → `0.4`
- `.research-step`（非作用）的 `opacity: 0.42` → `0.5`
- 作用 node 加正向強調（描邊）：
```css
.research-node.is-active rect {
  stroke: var(--text);
  stroke-width: 1.5;
}
```
（`.research-node.is-active` 既有的 `opacity:1` + `translateX(2px)` 保留。）

## 5.（Medium）alternating background 失效
**問題**：`section:nth-child(even){ background:#EFEFEA }` 與底色 `#F7F7F5` 差太小，既不分段也非隱形，做白工。
**修法（CC 定案：移除）**：刪掉 `section:nth-child(even){ background: var(--bg-alt); }` 這條。段落已靠 7.5rem padding + label 分隔，移除後更乾淨。
（若 Lucille 之後想要可見分段，再改強到 `#EAEAE3`——但**現在先移除**，別自行加強。）

## 6.（Low 順手）lang toggle `aria-pressed`
`#btnEn` / `#btnZh` 加 `aria-pressed`，並在 `setLang()` 內同步：作用語言 `aria-pressed="true"`、另一個 `"false"`。

---

## §A 不做 —— 交回 CC，別碰
這兩項是設計方向（taste），要 Lucille 先在 Artifact 排版定案才落地，**不在本次範圍**：
- **段落節奏均質**（六段同一 label→內容模板）→ 需要 compositional variety 的設計探索。
- **hero 無視覺錨點 / identity mark** → 需要設計一個字標或視覺元素。

Codex 做完 1–6 即回報，§A 留給 CC。

## 驗收
本機開 `site/index.html`：①SVG 不再是色島、白字仍清楚 ②Tab 鍵看得到焦點環 ③系統開減少動態時 scrollytelling 不過渡但仍切換 ④非作用內容不再像壞掉、作用 node 有描邊 ⑤段落背景單一 ⑥雙語鍵 aria-pressed 正確。過了再 commit。
