import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { createReadStream, existsSync, statSync } from "node:fs";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
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
const server = http.createServer((request, response) => {
  let filePath = join(siteDir, request.url.split("?")[0]);
  if (existsSync(filePath) && statSync(filePath).isDirectory()) filePath = join(filePath, "index.html");
  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }
  const mime = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".png": "image/png",
    ".webp": "image/webp",
  }[extname(filePath).toLowerCase()] || "application/octet-stream";
  response.writeHead(200, { "Content-Type": mime });
  createReadStream(filePath).pipe(response);
});

const chromePath = process.env.CHROME_PATH || (process.platform === "win32"
  ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome");
const screenshotDir = process.env.SCREENSHOT_DIR || (process.platform === "win32" ? tmpdir() : "/private/tmp");
const delay = (milliseconds) => new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));
const browserErrors = [];
let profile;
let chrome;
let socket;
let chromeError;
let chromeStderr = "";
let sequence = 0;
const pending = new Map();

try {
  await new Promise((resolveListen, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolveListen);
  });
  const siteUrl = `http://127.0.0.1:${server.address().port}/ink-current/`;
  profile = await mkdtemp(join(tmpdir(), "ink-current-chrome-"));
  chrome = spawn(chromePath, [
    "--headless", "--disable-gpu", "--hide-scrollbars",
    ...(process.platform === "linux" ? ["--no-sandbox"] : []),
    "--remote-debugging-address=127.0.0.1", "--remote-debugging-port=9223",
    `--user-data-dir=${profile}`, "about:blank",
  ], { stdio: ["ignore", "ignore", "pipe"], windowsHide: true });
  chrome.on("error", (error) => { chromeError = error; });
  chrome.stderr.on("data", (chunk) => { chromeStderr = (chromeStderr + chunk).slice(-8000); });

  let endpoint;
  for (let attempt = 0; attempt < 300 && !endpoint; attempt += 1) {
    if (chromeError || chrome.exitCode !== null) throw new Error(`Chrome failed to start: ${chromeError?.message || `exit ${chrome.exitCode}`}\n${chromeStderr}`);
    try {
      const response = await fetch("http://127.0.0.1:9223/json/version");
      if (response.ok) endpoint = (await response.json()).webSocketDebuggerUrl;
    } catch {
      // The local debugging endpoint is still starting.
    }
    if (!endpoint) await delay(100);
  }
  assert.ok(endpoint, `Chrome debugging endpoint starts within 30 seconds\n${chromeStderr}`);

  socket = new WebSocket(endpoint);
  await new Promise((resolveOpen, reject) => {
    const timeout = setTimeout(() => reject(new Error("Chrome WebSocket timed out")), 10_000);
    socket.addEventListener("open", () => { clearTimeout(timeout); resolveOpen(); }, { once: true });
    socket.addEventListener("error", () => { clearTimeout(timeout); reject(new Error("Chrome WebSocket failed")); }, { once: true });
  });
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const item = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) item.reject(new Error(message.error.message));
      else item.resolve(message.result);
    }
    if (message.method === "Runtime.exceptionThrown") browserErrors.push(message.params.exceptionDetails.text);
    if (message.method === "Log.entryAdded" && message.params.entry.level === "error") browserErrors.push(message.params.entry.text);
  });

  const command = (method, params = {}, sessionId) => new Promise((resolveCommand, reject) => {
    const id = ++sequence;
    const timeout = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`CDP ${method} timed out`));
    }, 15_000);
    pending.set(id, {
      resolve: (value) => { clearTimeout(timeout); resolveCommand(value); },
      reject: (error) => { clearTimeout(timeout); reject(error); },
    });
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });

  const { targetId } = await command("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await command("Target.attachToTarget", { targetId, flatten: true });
  await command("Runtime.enable", {}, sessionId);
  await command("Log.enable", {}, sessionId);
  await command("Page.enable", {}, sessionId);
  await command("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }, sessionId);
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
      await delay(150);
    }
    throw new Error(`Timed out waiting for: ${expression}`);
  };
  const mouse = (type, x, y, buttons = 0) => command("Input.dispatchMouseEvent", { type, x, y, button: "left", buttons, clickCount: type === "mousePressed" ? 1 : 0 }, sessionId);
  const tap = async (x, y) => {
    await mouse("mousePressed", x, y, 1);
    await mouse("mouseReleased", x, y, 0);
  };
  const drag = async (from, to) => {
    await mouse("mousePressed", from[0], from[1], 1);
    for (let step = 1; step <= 10; step += 1) {
      const progress = step / 10;
      await mouse("mouseMoved", from[0] + (to[0] - from[0]) * progress, from[1] + (to[1] - from[1]) * progress, 1);
    }
    await mouse("mouseReleased", to[0], to[1], 0);
  };
  const screenshot = async (path) => {
    const result = await command("Page.captureScreenshot", { format: "png", captureBeyondViewport: false }, sessionId);
    await writeFile(path, Buffer.from(result.data, "base64"));
  };

  await waitFor("document.readyState === 'complete' && document.querySelector('[data-ink-canvas]').width > 1000");
  assert.equal(await evaluate("document.querySelector('[data-sound]').getAttribute('aria-pressed')"), "false", "sound starts off");
  assert.equal(await evaluate("document.querySelector('[data-save]').disabled"), true, "save stays unavailable before resolution");
  const assetState = await evaluate(`Promise.all(["paper-texture.webp", "dry-brush.webp", "wet-bloom.webp"].map((name) => new Promise((resolve) => { const image = new Image(); image.onload = () => resolve({ name, width: image.naturalWidth, height: image.naturalHeight }); image.onerror = () => resolve({ name, error: true }); image.src = "./assets/" + name; })))`);
  assert.deepEqual(assetState, [
    { name: "paper-texture.webp", width: 1440, height: 810 },
    { name: "dry-brush.webp", width: 1600, height: 533 },
    { name: "wet-bloom.webp", width: 1200, height: 800 },
  ], "all production ink assets load at their optimized dimensions");

  for (const point of [[220, 220], [460, 300], [760, 210], [980, 640], [1240, 360]]) await tap(...point);
  await drag([180, 620], [620, 520]);
  await drag([780, 470], [1240, 230]);
  await drag([420, 740], [1050, 690]);
  await waitFor("!document.querySelector('[data-save]').disabled", 8_000);
  assert.equal(await evaluate("document.querySelector('[data-finale]').hidden"), false, "final message appears after resolution");
  assert.equal(await evaluate("document.querySelector('[data-finale-copy]').textContent"), "The current has settled.", "ordinary resolution stays abstract");
  await command("Emulation.setDeviceMetricsOverride", { width: 1180, height: 780, deviceScaleFactor: 1, mobile: false }, sessionId);
  await delay(300);
  assert.deepEqual(await evaluate("({ saveEnabled: !document.querySelector('[data-save]').disabled, finaleVisible: !document.querySelector('[data-finale]').hidden, width: document.querySelector('[data-ink-canvas]').width, height: document.querySelector('[data-ink-canvas]').height })"), {
    saveEnabled: true,
    finaleVisible: true,
    width: 1180,
    height: 780,
  }, "a resolved composition survives a viewport or orientation change");
  await command("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }, sessionId);
  await delay(300);
  const desktopPath = join(screenshotDir, "ink-current-desktop.png");
  const easterEggPath = join(screenshotDir, "ink-current-easter-egg.png");
  await screenshot(desktopPath);
  const redPixels = `(() => { const canvas = document.querySelector('[data-ink-canvas]'); const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data; let count = 0; for (let index = 0; index < data.length; index += 4) { if (data[index] > 110 && data[index + 1] < 95 && data[index + 2] < 85 && data[index + 3] > 80) count += 1; } return count; })()`;
  assert.equal(await evaluate(redPixels), 0, "ordinary resolution contains no accent color");

  await evaluate("document.querySelector('[data-reset]').click()");
  assert.deepEqual(await evaluate("({ saveDisabled: document.querySelector('[data-save]').disabled, finaleHidden: document.querySelector('[data-finale]').hidden, finaleCopy: document.querySelector('[data-finale-copy]').textContent })"), {
    saveDisabled: true,
    finaleHidden: true,
    finaleCopy: "The current has settled.",
  }, "reset removes the previous ending and returns to a fresh canvas");

  for (const point of [[260, 260], [380, 560], [960, 610], [1120, 330], [520, 720]]) await tap(...point);
  await drag([720, 165], [700, 720]);
  await drag([420, 245], [300, 700]);
  await drag([1010, 255], [1120, 700]);
  await waitFor("!document.querySelector('[data-save]').disabled", 8_000);
  assert.equal(await evaluate("document.querySelector('[data-finale-copy]').textContent"), "You found the island.", "the north-south spine and two currents reveal the Taiwan easter egg");
  assert.ok(await evaluate(redPixels) > 0, "the vermilion accent appears only in the easter egg");
  await screenshot(easterEggPath);
  await evaluate("document.querySelector('[data-reset]').click()");

  await command("Emulation.setDeviceMetricsOverride", { width: 375, height: 812, deviceScaleFactor: 1, mobile: true }, sessionId);
  await command("Page.reload", { ignoreCache: true }, sessionId);
  await waitFor("document.readyState === 'complete' && innerWidth === 375");
  const mobile = await evaluate(`(() => {
    const controls = [...document.querySelectorAll(".control")].map((element) => element.getBoundingClientRect());
    const canvas = document.querySelector("[data-ink-canvas]").getBoundingClientRect();
    return {
      viewport: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      canvasRight: canvas.right,
      controlMinimum: Math.min(...controls.map((rect) => Math.min(rect.width, rect.height)))
    };
  })()`);
  assert.equal(mobile.scrollWidth, mobile.viewport, "mobile page has no horizontal overflow");
  assert.ok(mobile.canvasRight <= mobile.viewport + 1, "mobile canvas stays inside the viewport");
  assert.ok(mobile.controlMinimum >= 44, "mobile controls remain at least 44px");
  await tap(187, 406);
  await evaluate("document.querySelector('[data-ink-canvas]').focus()");
  await command("Input.dispatchKeyEvent", { type: "rawKeyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 }, sessionId);
  await command("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 }, sessionId);
  await waitFor("document.querySelector('[data-status]').textContent.includes('6 gestures before it can settle')");
  const mobilePath = join(screenshotDir, "ink-current-mobile.png");
  await screenshot(mobilePath);

  assert.deepEqual(browserErrors, [], `browser has no console errors: ${browserErrors.join("; ")}`);
  console.log("Ink Current browser tests passed");
  console.log(`Screenshots: ${desktopPath}, ${easterEggPath}, ${mobilePath}`);
} finally {
  socket?.close();
  for (const item of pending.values()) item.reject(new Error("Browser test is shutting down"));
  pending.clear();
  if (chrome && chrome.exitCode === null) chrome.kill();
  server.closeAllConnections();
  await new Promise((resolveClose) => server.close(resolveClose));
  if (profile) {
    const resolvedProfile = resolve(profile);
    assert.ok(resolvedProfile.startsWith(resolve(tmpdir()) + sep + "ink-current-chrome-"), "cleanup targets only the test profile");
    await delay(350);
    await rm(resolvedProfile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }
}
