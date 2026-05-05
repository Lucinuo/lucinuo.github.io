# iPhone / iPad 使用方式

## 目前可用方式

這個 app 是純靜態網站，可以直接部署到任何 HTTPS 靜態網站服務。

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

## 關於同步

目前資料存在各裝置瀏覽器的 localStorage。

- Mac 的紀錄不會自動出現在 iPhone。
- iPhone 的紀錄不會自動出現在 iPad。

已提供手動同步：

1. 在來源裝置按「備份 JSON」
2. 用 AirDrop / iCloud Drive 傳到另一台裝置
3. 在另一台裝置按「匯入 JSON」

## Supabase 自動同步

已設定 Supabase 自動同步：

1. 打開 app 的「雲端同步」頁。
2. 輸入 Email，按「寄登入連結」。
3. 在 iPhone / iPad / Mac 各自登入同一個 Email。
4. 登入後紀錄會同步到 Supabase 的 `growth_entries` table。

安全注意：前端只使用 Supabase publishable key，不使用 secret key 或 service role key。
