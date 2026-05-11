# 每日痕跡

一個 PWA 互動式小 app，把 research workflow 和五支柱成長框架融合成每天 3-5 分鐘可執行的節奏。

## 使用方式

本機預覽可以直接用瀏覽器打開：

`index.html`

iPhone / iPad 使用方式見 `DEPLOY.md`。部署到 GitHub Pages HTTPS 網址後，可以用 Safari 加入主畫面。

## 三個功能

- 今日 5 分鐘：只選一個成長支柱，寫 100 字內痕跡。
- 研究分流：判斷資訊現在的狀態，決定去 Zotero / Red / A6 / A5 / Blue / Green / Notion / Finder。
- 每週回顧：用五支柱看最近紀錄，匯出 Markdown。
- 雲端同步：接 Supabase Auth + RLS，讓 iPhone / iPad / Mac 同步。

## 資料儲存

方案 B 使用 PWA + Supabase free。已預設連到 Supabase。使用 Google 登入後，資料會同步到 `growth_entries` table；未登入時仍會先存在瀏覽器 `localStorage`。

這個版本不需要 Apple Developer Program，也不使用 CloudKit / iCloud entitlement。

Supabase SQL 見 `supabase-schema.sql`。
