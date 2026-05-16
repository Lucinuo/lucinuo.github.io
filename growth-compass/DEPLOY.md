# PWA + Google Drive 同步使用方式

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

## Google Drive 自動同步

已設定 Google Drive appDataFolder 自動同步：

1. 打開 app 右上角的同步狀態按鈕，進入 Settings。
2. 按「使用 Google 登入」。
3. 在 iPhone / iPad / Mac 各自登入同一個 Email。
4. 登入後紀錄會同步到 Google Drive 的 app 專用隱藏 JSON。

未登入時仍可使用，資料會先存在該裝置瀏覽器的 `localStorage`。登入後按「立即同步」，會把本機資料和雲端資料合併。

JSON 備份 / 匯入仍保留，作為手動備份保險。

安全注意：前端只使用 Google OAuth Web Client ID，不使用 client secret。

## Google Cloud 必要設定

在 Google Cloud Console：

1. 啟用 Google Drive API。
2. 建立 OAuth Web Client。
3. Authorized JavaScript origins 加入 `https://lucinuo.github.io`。
4. OAuth consent scope 使用 `https://www.googleapis.com/auth/drive.appdata`。
5. 把 Web Client ID 填入 `script.js` 的 `googleClientId`。
