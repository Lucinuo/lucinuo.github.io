# PWA + Supabase free 使用方式

## 目前方案

這個 app 是純靜態 PWA，可以直接部署到 GitHub Pages，不需要 Apple Developer Program。

目前已部署到：

https://lucinuo.github.io/growth-compass/

推薦路線：

1. GitHub Pages
2. Netlify
3. Cloudflare Pages

用 iPhone / iPad 開 Safari：

1. 打開網址
2. 按分享
3. 選「加入主畫面」
4. 之後就會像 app 一樣開啟

## Supabase 自動同步

已設定 Supabase 自動同步：

1. 打開 app 的「雲端同步」頁。
2. 輸入 Email，按「寄登入連結」。
3. 在 iPhone / iPad / Mac 各自登入同一個 Email。
4. 登入後紀錄會同步到 Supabase 的 `growth_entries` table。

未登入時仍可使用，資料會先存在該裝置瀏覽器的 `localStorage`。登入後按「立即同步」，會把本機資料和雲端資料合併。

JSON 備份 / 匯入仍保留，作為手動備份保險。

安全注意：前端只使用 Supabase publishable key，不使用 secret key 或 service role key。

## Supabase 必要設定

在 Supabase Dashboard：

1. SQL Editor 執行 `supabase-schema.sql`。
2. Authentication → URL Configuration：
   - Site URL: `https://lucinuo.github.io/growth-compass/`
   - Redirect URLs 加入 `https://lucinuo.github.io/growth-compass/`
3. Authentication → Providers 確認 Email provider 開啟。
