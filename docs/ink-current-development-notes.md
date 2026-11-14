# Ink Current 開發筆記（2026-11-08 至 11-09）

這份筆記整理當時的工作紀錄，供日後維護 [Ink Current](https://lucinuo.github.io/ink-current/)。

## 設計與實作

- 水墨表現以真實筆刷質感、乾濕變化、飛白、飛濺、細線、濃黑墨塊、不對稱構圖和留白為主。一般結局維持抽象，只有台灣彩蛋使用少量朱紅。台灣意象用構圖間接呈現，避開地圖、旗幟與觀光拼貼。
- 點擊暈染、拖曳落墨。作品可收束、存成 PNG 或重設，預設靜音，支援鍵盤及減少動態偏好。已收束的畫面會在視窗改尺寸後保留。
- 互動程式在 `site/ink-current/ink-current.js`，規則在 `site/ink-current/ink-rules.mjs`。
- 發布時，Ink Current 接替首頁原先的 Lighthouse 精選卡位置，Lighthouse 仍列在 Projects。現行精選規格見[上線前檢查](release-checklist.md)。

## 驗證與發布紀錄

- 在 repo 根目錄可跑 `node tests/ink-current.test.mjs` 和 `node tests/ink-current-browser.test.mjs`。當時用真實 Chrome 檢查桌機與手機、鍵盤與觸控、PNG 儲存、重設、視窗改尺寸後保留畫面，以及一般結局和台灣彩蛋的配色。
- 測鍵盤時先點擊畫布讓它取得焦點，再送按鍵，並確認畫面狀態真的改變。線上檢查以元素可見、素材載入與互動結果為準。
- `df06f66` 調整首頁精選及手機觸控範圍，`c58b70b` 加入 Ink Current。[GitHub Pages 部署紀錄](https://github.com/Lucinuo/lucinuo.github.io/actions/runs/42561097214) 顯示發布成功，並實測手機線上版可以完成作品、啟用儲存。
- 當時的部署保留原有工作流程。Ink Current 的瀏覽器測試在本機執行，沒有加入部署工作流程。
