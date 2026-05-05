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

已加入 Supabase 同步 UI。設定步驟：

1. 到 Supabase 建立 project。
2. 在 SQL Editor 執行 `supabase-schema.sql`。
3. 到 Authentication → URL Configuration：
   - Site URL 設為 `https://lucinuo.github.io/growth-compass/`
   - Redirect URLs 加入 `https://lucinuo.github.io/growth-compass/`
4. 到 Project Settings → API，複製 Project URL 和 anon public key。
5. 回到 app 的「雲端同步」頁貼上設定。
6. 輸入 Email，按「寄登入連結」。
7. 在 iPhone / iPad / Mac 各自登入同一個 Email。

安全注意：只能把 anon public key 放進前端，不能放 service role key。
