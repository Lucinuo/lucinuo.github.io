# Lucille Growth Compass

一個本機互動式小 app，把 research workflow 和五支柱成長框架融合成每天 3-5 分鐘可執行的節奏。

## 使用方式

直接用瀏覽器打開：

`index.html`

iPhone / iPad 使用方式見 `DEPLOY.md`。部署到 HTTPS 網址後，可以用 Safari 加入主畫面。

## 三個功能

- 今日 5 分鐘：只選一個成長支柱，寫 100 字內痕跡。
- 研究分流：判斷資訊現在的狀態，決定去 Zotero / Red / A6 / A5 / Blue / Green / Notion / Finder。
- 每週回顧：用五支柱看最近紀錄，匯出 Markdown。

## 資料儲存

目前使用瀏覽器 `localStorage`，不需要登入。跨裝置先用「備份 JSON / 匯入 JSON」手動同步；真正自動同步需要下一版接雲端資料層。
