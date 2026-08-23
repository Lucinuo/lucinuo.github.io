import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const profile = await mkdtemp(join(tmpdir(), "restaurant-rookie-chrome-"));
const port = 9234;
const chrome = spawn(chromePath, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  "about:blank",
], { stdio: "ignore" });

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
let socket;
let sequence = 0;
const pending = new Map();
const browserErrors = [];

try {
  let browserEndpoint;
  for (let attempt = 0; attempt < 40 && !browserEndpoint; attempt += 1) {
    try {
      browserEndpoint = (await (await fetch(`http://127.0.0.1:${port}/json/version`)).json()).webSocketDebuggerUrl;
    } catch {
      await delay(100);
    }
  }
  assert.ok(browserEndpoint, "Chrome debugging endpoint starts");
  socket = new WebSocket(browserEndpoint);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
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
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });

  const { targetId } = await command("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await command("Target.attachToTarget", { targetId, flatten: true });
  await command("Runtime.enable", {}, sessionId);
  await command("Log.enable", {}, sessionId);
  await command("Page.enable", {}, sessionId);
  await command("Emulation.setDeviceMetricsOverride", { width: 1365, height: 950, deviceScaleFactor: 1, mobile: false }, sessionId);
  await command("Page.navigate", { url: "http://127.0.0.1:4173/four-shifts/" }, sessionId);

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

  await waitFor("document.readyState === 'complete' && document.querySelector('[data-toggle]') && document.querySelector('[data-canvas]').clientWidth > 500");
  assert.equal(await evaluate("document.querySelector('[data-coins]').textContent"), "160");
  await evaluate("document.querySelector('[data-upgrade=chef]').click()");
  assert.equal(await evaluate("document.querySelector('[data-level=chef]').textContent"), "Lv.1");
  assert.equal(await evaluate("document.querySelector('[data-coins]').textContent"), "90");
  await evaluate("document.querySelector('[data-toggle]').click()");
  await waitFor("document.querySelector('[data-live]').textContent.includes('入座') && !document.querySelector('[data-live]').textContent.includes('0 位入座')", 22_000);
  await screenshot("/private/tmp/restaurant-rookie-desktop.png");
  await waitFor("Number(document.querySelector('[data-served]').textContent.replaceAll(',', '')) >= 1", 50_000);
  const earnedCoins = Number((await evaluate("document.querySelector('[data-coins]').textContent")).replaceAll(",", ""));
  assert.ok(earnedCoins > 90, "browser flow increases coins");

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
  await screenshot("/private/tmp/restaurant-rookie-mobile.png");

  assert.deepEqual(browserErrors, [], `browser has no console errors: ${browserErrors.join("; ")}`);
  console.log("Restaurant Rookie browser tests passed");
  console.log("Screenshots: /private/tmp/restaurant-rookie-desktop.png, /private/tmp/restaurant-rookie-mobile.png");
} finally {
  socket?.close();
  chrome.kill("SIGTERM");
  await rm(profile, { recursive: true, force: true });
}
