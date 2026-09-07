import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { createReadStream, existsSync, statSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import http from "node:http";
import { tmpdir } from "node:os";
import { extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

if (typeof WebSocket === "undefined") {
  const result = spawnSync(process.execPath, ["--experimental-websocket", ...process.execArgv, fileURLToPath(import.meta.url), ...process.argv.slice(2)], {
    stdio: "inherit",
    env: process.env,
  });
  process.exit(result.status ?? 0);
}

const here = fileURLToPath(new URL(".", import.meta.url));
const siteDir = resolve(here, "../site");

const localServer = http.createServer((req, res) => {
    let filePath = join(siteDir, req.url.split("?")[0]);
    if (existsSync(filePath) && statSync(filePath).isDirectory()) filePath = join(filePath, "index.html");
    if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    const ext = extname(filePath).toLowerCase();
    const mimeTypes = {
      ".html": "text/html; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".mjs": "text/javascript; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".png": "image/png",
      ".json": "application/json",
      ".svg": "image/svg+xml",
    };
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
    createReadStream(filePath).pipe(res);
});

const defaultChrome = process.platform === "win32"
  ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const chromePath = process.env.CHROME_PATH || defaultChrome;
const screenshotDir = process.env.SCREENSHOT_DIR || (process.platform === "win32" ? tmpdir() : "/private/tmp");
let profile;
let chrome;
let chromeError;
let chromeStderr = "";

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
let socket;
let sequence = 0;
const pending = new Map();
const browserErrors = [];

try {
  await new Promise((resolve, reject) => {
    localServer.once("error", reject);
    localServer.listen(0, "127.0.0.1", resolve);
  });
  const siteUrl = `http://127.0.0.1:${localServer.address().port}/four-shifts/`;
  profile = await mkdtemp(join(tmpdir(), "restaurant-rookie-chrome-"));
  chrome = spawn(chromePath, [
    "--headless", "--disable-gpu", "--hide-scrollbars",
    "--remote-debugging-address=127.0.0.1", "--remote-debugging-port=0",
    `--user-data-dir=${profile}`, "about:blank",
  ], { stdio: ["ignore", "ignore", "pipe"], windowsHide: true });
  chrome.on("error", (error) => { chromeError = error; });
  chrome.stderr.on("data", (chunk) => { chromeStderr = (chromeStderr + chunk).slice(-8000); });
  console.log(`Browser test serving current checkout at ${siteUrl}`);
  let browserEndpoint;
  for (let attempt = 0; attempt < 100 && !browserEndpoint; attempt += 1) {
    if (chromeError || chrome.exitCode !== null) {
      throw new Error(`Chrome failed to start (${chromePath}): ${chromeError?.message || `exit ${chrome.exitCode}`}\n${chromeStderr}`);
    }
    try {
      const [port, endpoint] = (await readFile(join(profile, "DevToolsActivePort"), "utf8")).trim().split(/\r?\n/);
      if (/^\d+$/.test(port) && endpoint?.startsWith("/devtools/browser/")) browserEndpoint = `ws://127.0.0.1:${port}${endpoint}`;
    } catch {
      // Chrome writes this file when its own random debugging port is ready.
    }
    if (!browserEndpoint) await delay(100);
  }
  assert.ok(browserEndpoint, `Chrome debugging endpoint starts within 10 seconds\n${chromeStderr}`);
  socket = new WebSocket(browserEndpoint);
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Chrome WebSocket connection timed out")), 10_000);
    socket.addEventListener("open", () => { clearTimeout(timeout); resolve(); }, { once: true });
    socket.addEventListener("error", () => { clearTimeout(timeout); reject(new Error(`Chrome WebSocket connection failed\n${chromeStderr}`)); }, { once: true });
  });
  socket.addEventListener("close", () => {
    for (const item of pending.values()) item.reject(new Error(`Chrome connection closed\n${chromeStderr}`));
    pending.clear();
  });
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    }
    if (message.method === "Runtime.exceptionThrown") browserErrors.push(message.params.exceptionDetails.text);
    if (message.method === "Log.entryAdded" && message.params.entry.level === "error") browserErrors.push(message.params.entry.text);
  });

  const command = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = ++sequence;
    const timeout = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`CDP ${method} timed out after 15 seconds\n${chromeStderr}`));
    }, 15_000);
    const finish = (handler) => (value) => { clearTimeout(timeout); pending.delete(id); handler(value); };
    pending.set(id, { resolve: finish(resolve), reject: finish(reject) });
    try {
      socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    } catch (error) {
      pending.get(id).reject(error);
    }
  });

  const { targetId } = await command("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await command("Target.attachToTarget", { targetId, flatten: true });
  await command("Runtime.enable", {}, sessionId);
  await command("Log.enable", {}, sessionId);
  await command("Page.enable", {}, sessionId);
  await command("Emulation.setDeviceMetricsOverride", { width: 1365, height: 950, deviceScaleFactor: 1, mobile: false }, sessionId);
  await command("Page.navigate", { url: siteUrl }, sessionId);

  const evaluate = async (expression) => {
    const result = await command("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }, sessionId);
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };
  const waitFor = async (expression, timeout = 12_000) => {
    const started = Date.now();
    while (Date.now() - started < timeout) {
      if (await evaluate(expression)) return;
      await delay(200);
    }
    throw new Error(`Timed out waiting for: ${expression}`);
  };
  const screenshot = async (path) => {
    const result = await command("Page.captureScreenshot", { format: "png", captureBeyondViewport: false }, sessionId);
    await writeFile(path, Buffer.from(result.data, "base64"));
  };

  await waitFor("document.readyState === 'complete' && window.__game_state__ && document.querySelector('[data-toggle]') && document.querySelector('[data-canvas]').clientWidth > 500");
  assert.deepEqual(await evaluate(`Promise.all([
    ["pixel-atlas-v3.png", 576, 320],
    ["female-waiter-v3.png", 576, 80],
  ].map(([name]) => new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve({ name, width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => resolve({ name, error: true });
    image.src = \`./assets/\${name}?qa=\${Date.now()}\`;
  })))`), [
    { name: "pixel-atlas-v3.png", width: 576, height: 320 },
    { name: "female-waiter-v3.png", width: 576, height: 80 },
  ], "production sprite atlases load and decode at their A-phase dimensions");
  assert.deepEqual(await evaluate("(() => { const canvas = document.querySelector('[data-canvas]'); return { width: canvas.width, height: canvas.height }; })()"), { width: 960, height: 540 }, "canvas keeps 960 x 540 internal coordinates");
  assert.equal(await evaluate("document.querySelector('[data-coins]').textContent"), "160");
  assert.equal(await evaluate("document.querySelector('[data-effect=tables]').textContent"), "同時接待 2 位客人", "one table advertises both seats");
  await evaluate("document.querySelector('[data-upgrade=chef]').click()");
  assert.equal(await evaluate("document.querySelector('[data-level=chef]').textContent"), "Lv.1");
  assert.equal(await evaluate("document.querySelector('[data-coins]').textContent"), "90");
  await evaluate("document.querySelector('[data-toggle]').click()");
  await waitFor("document.querySelector('[data-live]').textContent.includes('入座') && !document.querySelector('[data-live]').textContent.includes('0 位入座')", 60_000);
  const desktopPath = join(screenshotDir, "restaurant-rookie-desktop.png");
  const flowPath = join(screenshotDir, "restaurant-rookie-flow.png");
  const mobilePath = join(screenshotDir, "restaurant-rookie-mobile.png");

  await screenshot(desktopPath);
  assert.equal(await evaluate("document.querySelector('[data-debug]')"), null, "scene debug button is removed from UI");
  assert.equal(await evaluate("document.querySelector('[data-scene-report]')"), null, "scene report section is removed from UI");
  const sceneResult = await evaluate("import('./game-rules.mjs').then((m) => m.validateScene(window.__game_state__).status)");
  assert.equal(sceneResult, "PASS", "formal scene validator reports PASS in the running browser");
  await waitFor("Number(document.querySelector('[data-served]').textContent.replaceAll(',', '')) >= 1", 90_000);
  const earnedCoins = Number((await evaluate("document.querySelector('[data-coins]').textContent")).replaceAll(",", ""));
  assert.ok(earnedCoins > 90, "browser flow increases coins");
  await screenshot(flowPath);

  await command("Page.reload", { ignoreCache: true }, sessionId);
  await waitFor("document.readyState === 'complete' && document.querySelector('[data-level=chef]')?.textContent === 'Lv.1'");
  assert.ok(await evaluate("Number(document.querySelector('[data-served]').textContent) >= 1"), "saved progress survives reload");

  await command("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true }, sessionId);
  await delay(500);
  const layout = await evaluate(`(() => {
    const canvas = document.querySelector('[data-canvas]').getBoundingClientRect();
    const upgrades = document.querySelector('.upgrade-panel').getBoundingClientRect();
    return { canvasRight: canvas.right, viewport: innerWidth, canvasBottom: canvas.bottom, upgradesTop: upgrades.top };
  })()`);
  assert.ok(layout.canvasRight <= layout.viewport + 1, "mobile canvas stays inside the viewport");
  assert.ok(layout.upgradesTop >= layout.canvasBottom, "mobile upgrade panel does not cover the game canvas");
  await screenshot(mobilePath);

  await evaluate("document.querySelector('[data-toggle]').click()");
  console.log("Waiting for seating and the first completed order...");
  assert.equal(await evaluate("window.__game_state__.running"), false, "pause stops operation");
  const pausedElapsed = await evaluate("window.__game_state__.elapsed");
  await delay(350);
  assert.equal(await evaluate("window.__game_state__.elapsed"), pausedElapsed, "simulation remains paused");
  await evaluate("document.querySelector('[data-toggle]').click()");
  await waitFor(`window.__game_state__.running && window.__game_state__.elapsed > ${pausedElapsed}`);
  await evaluate("document.querySelector('[data-reset]').click()");
  assert.equal(await evaluate("document.querySelector('[data-reset]').textContent"), "再按一次重置", "reset asks for a second click");
  await evaluate("document.querySelector('[data-reset]').click()");
  assert.deepEqual(await evaluate("({ coins: document.querySelector('[data-coins]').textContent, served: document.querySelector('[data-served]').textContent, chef: document.querySelector('[data-level=chef]').textContent, running: window.__game_state__.running })"), { coins: "160", served: "0", chef: "Lv.0", running: false }, "confirmed reset restores a fresh paused game");

  assert.deepEqual(browserErrors, [], `browser has no console errors: ${browserErrors.join("; ")}`);
  console.log("Restaurant Rookie browser tests passed");
  console.log(`Screenshots: ${desktopPath}, ${flowPath}, ${mobilePath}`);
} catch (err) {
  console.error("Browser test failed:", err);
  throw err;
} finally {
  socket?.close();
  for (const item of pending.values()) item.reject(new Error("Browser test is shutting down"));
  pending.clear();
  if (chrome && chrome.exitCode === null) chrome.kill();
  localServer.closeAllConnections();
  await new Promise((resolve) => localServer.close(resolve));
  if (profile) {
    const resolvedProfile = resolve(profile);
    assert.ok(resolvedProfile.startsWith(resolve(tmpdir()) + sep + "restaurant-rookie-chrome-"), "cleanup targets only this test's temporary Chrome profile");
    try {
      await delay(500);
      await rm(resolvedProfile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    } catch (error) {
      console.warn(`Could not remove test profile ${resolvedProfile}: ${error.message}`);
    }
  }
}
