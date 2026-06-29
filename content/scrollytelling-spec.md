# Scrollytelling 移植規格 — research 段（HCC/TAM）

> 給 Codex 冷讀。CC 與 Lucille 在對話中把原型用內建 Artifact 做好、Lucille 確認定稿（2026-06-29）。
> 你的任務：把這個「分步敘事 + 視覺同步」搬進 `site/index.html` 的 research 段。
> **這是規格不是 drop-in code**——原型跑在 Artifact host（有它自己的 CSS 變數與 Tabler 字體），
> 網站沒有那些，請用網站既有 stack 重做（Bootstrap/style.css + 既有 JS）。

## 內容決定（已定，別改）
- **維持現有 HCC/TAM 展示範例**，不換成 SJF。文案直接用 `site/index.html` research 段現有句子。
- 雙語站（en-only / zh-only + localStorage）→ 兩語都要給對應步驟文字。

## 視覺：單線垂直流程，6 個節點
順序與語義配色（用網站自己的色，下面只標語義）：
1. `HCC 腫瘤微環境` / TAM 位於腫瘤基質 — 中性
2. `缺氧 → HIF-1α` / hypoxia-driven — 警示/暖色
3. `糖解重編程` / glycolytic reprogramming — 警示/暖色
4. `mTOR 訊號` / 代謝協同維持表現型 — accent/紫
5. `免疫抑制 → 治療抗性` / protumoral phenotype — danger/紅珊瑚
6. `代謝弱點（標靶）` / 重塑免疫微環境 — success/綠

節點間單向箭頭往下。建議 inline SVG（viewBox 0 0 680 502，節點 rect x=210 w=260 h=48，y=44/122/200/278/356/434，箭頭 x=340）。可沿用原型座標。

## 敘事：5 步節拍，每步只亮對應節點、其餘變淡（opacity 0.25）
| 步 | 亮哪些節點 | 標題(zh) | 一句話(zh) |
|----|-----------|---------|-----------|
| 1 | n1 | 巨噬細胞在 HCC 基質裡 | 腫瘤相關巨噬細胞（TAM）位於肝細胞癌的腫瘤基質中，是塑造免疫微環境的關鍵細胞。|
| 2 | n2, n3 | 缺氧驅動 HIF-1α 糖解重編程 | 缺氧微環境誘導 HIF-1α，驅動 TAM 的糖解代謝重編程，改變其功能狀態。|
| 3 | n4 | mTOR 協同維持促腫瘤表現型 | mTOR 訊號與糖解重編程協同，維持促腫瘤的巨噬細胞表現型。|
| 4 | n5 | 免疫抑制微環境 → 治療抗性 | 重編程後的 TAM 形成免疫抑制微環境，助長腫瘤進展與對治療的抗性。|
| 5 | n6 | 鎖定代謝弱點重塑微環境 | 目標是識別這些代謝弱點，作為重塑 HCC 免疫微環境的介入點。|

en 版文字 Codex 從 research 段現有英文文案對應翻寫即可（語氣與現站一致）。

## 互動：原型用按鈕，網站改成捲動觸發
- 原型是「上一步/下一步 + 圓點」手動推進（排練節拍用）。
- **網站版改成捲動觸發**：每個敘事段落捲進畫面時，切換到對應步驟、更新 SVG 高亮。
- 站上**已載 `jquery.appear.js`**（元素進場觸發）與 `smooth-scroll` → 用既有的，不要引入 Astro/MDX/新框架。最多裝單檔 D3，但這張簡單軸 inline SVG 就夠，多半不需要 D3。
- sticky 視覺：SVG 用 `position: sticky` 固定在側/上，文字段落往下捲，視覺留在原地隨段落切換高亮。

## 限制 / 別做
- 純靜態 no-build：push `site/` → GitHub Actions(`deploy.yml`) → Pages。不要加 build step。
- 不要碰 `site/growth-compass/`（獨立工具）。
- 改完本機開 `site/index.html` 目視驗證捲動高亮對得上節拍，再 commit。
- 不確定語義配色對應網站哪個既有色 → 先問，別硬猜。

原型細節若需更多，背景在 CC 的記憶 project_scrollytelling_site.md（但你以本檔為準）。
