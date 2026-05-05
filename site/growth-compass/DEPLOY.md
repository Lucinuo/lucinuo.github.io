# iPhone / iPad 使用方式

## 目前可用方式

這個 app 是純靜態網站，可以直接部署到任何 HTTPS 靜態網站服務。

推薦路線：

1. GitHub Pages
2. Netlify
3. Cloudflare Pages

部署後，用 iPhone / iPad 開 Safari：

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

## 真正自動同步的下一版

若要 iPhone、iPad、Mac 自動同步，需要接一個資料層，例如：

- Supabase
- Firebase
- iCloud Shortcuts + JSON 檔
- GitHub Gist / private repo

建議下一版先做 Supabase，因為跨裝置最穩、之後也能做登入與備份。
