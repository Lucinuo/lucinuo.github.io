#!/bin/bash

# scripts/setup-hooks.sh

# 啟用 .githooks/ 資料夾，讓 repo 層 hook 生效

# 每個 clone 各跑一次（core.hooksPath 存在 .git/config，不隨 git 傳送，新機器要重跑）

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)"
if [ -z "$REPO_ROOT" ]; then
echo "❌ 找不到 git repo，請在專案根目錄執行這個腳本"
exit 1
fi

git config core.hooksPath .githooks
for h in .githooks/*; do
[ -f "$REPO_ROOT/$h" ] && chmod +x "$REPO_ROOT/$h"
done

echo "✅ Git hooks 已啟用"
echo "   core.hooksPath = $(git config --get core.hooksPath)"
echo "   post-commit：commit 後提醒本機領先 GitHub 幾筆（只提醒，不自動推）"
echo ""
echo "驗證方式：git config --get core.hooksPath"
