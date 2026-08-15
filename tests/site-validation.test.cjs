const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../site");
const publicPages = [
  ["/", "index.html"],
  ["/research/urolithin-a/", "research/urolithin-a/index.html"],
  ["/publications/", "publications/index.html"],
  ["/projects/", "projects/index.html"],
  ["/projects/phase-shift/", "projects/phase-shift/index.html"],
  ["/projects/lighthouse/", "projects/lighthouse/index.html"],
  ["/about/", "about/index.html"],
];

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

function resolvesToFile(urlPath) {
  const clean = urlPath.split(/[?#]/)[0];
  const relative = clean.replace(/^\//, "");
  const candidate = path.join(root, relative);
  if (clean.endsWith("/")) return fs.existsSync(path.join(candidate, "index.html"));
  return fs.existsSync(candidate);
}

for (const [route, relativeFile] of publicPages) {
  const file = path.join(root, relativeFile);
  const html = fs.readFileSync(file, "utf8");
  check(/<title>[^<]+<\/title>/.test(html), `${route} is missing a title`);
  check(/<meta name="description" content="[^"]+">/.test(html), `${route} is missing a description`);
  check(html.includes(`rel="canonical" href="https://lucinuo.github.io${route}"`), `${route} has the wrong canonical URL`);
  check(/property="og:title"/.test(html), `${route} is missing og:title`);
  check(/property="og:description"/.test(html), `${route} is missing og:description`);
  check(/property="og:image" content="https:\/\/lucinuo\.github\.io\/[^"]+"/.test(html), `${route} is missing a local social image`);
  check(/<h1(?:\s|>)/.test(html), `${route} is missing an h1`);
  check(html.includes("viewport-fit=cover"), `${route} does not account for Apple safe areas`);
  check(html.includes('href="https://github.com/Lucinuo"'), `${route} does not link to the Lucinuo GitHub profile`);
  check(html.includes('href="mailto:stu9500149@gmail.com"'), `${route} does not expose a direct contact path`);
  check(html.includes("data-theme-toggle"), `${route} is missing the shared theme toggle`);
  check(html.includes("theme-icon-sun") && html.includes("theme-icon-moon"), `${route} does not use sun and moon icons`);
  check(html.includes('href="/publications/"'), `${route} does not expose Publications`);
  check(!html.includes('class="button"') && !html.includes('class="button secondary"'), `${route} still contains a filled CTA link`);
  check(!html.includes('href="/bearing/"'), `${route} still promotes the former public workspace`);
  check(!html.includes(">Notes<"), `${route} still exposes Notes as a public section`);
  check(!html.includes("黃詩婷"), `${route} still uses the former public name`);
  check(!html.includes("176"), `${route} exposes private literature-source counts`);
  check(
    !html.includes("Paper_SJF") &&
      !html.includes("evidence_records_core.csv") &&
      !html.includes("NO43"),
    `${route} exposes private research files or internal record identifiers`
  );

  const links = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const link of links) {
    if (!link.startsWith("/") || link.startsWith("//")) continue;
    check(resolvesToFile(link), `${route} points to missing local asset or route: ${link}`);
  }
}

const traceIsle = fs.readFileSync(path.join(root, "trace-isle/index.html"), "utf8");
const traceIsleCss = fs.readFileSync(path.join(root, "trace-isle/styles.css"), "utf8");
const traceIsleModules = ["game.js", "world-model.mjs", "nature-rules.mjs", "world-rules.mjs", "renderer.mjs"]
  .map((file) => fs.readFileSync(path.join(root, "trace-isle", file), "utf8"));
check(traceIsle.includes('rel="canonical" href="https://lucinuo.github.io/trace-isle/"'), "Trace Isle preview has the wrong canonical URL");
check(/property="og:image" content="https:\/\/lucinuo\.github\.io\/trace-isle\/assets\/starter-[^"]+\.webp"/.test(traceIsle), "Trace Isle preview is missing a local social image");
check(traceIsle.includes('href="/projects/"'), "Trace Isle preview has no return path to Projects");
check(traceIsleCss.includes("prefers-reduced-motion"), "Trace Isle does not respect reduced motion");
check(/@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\.position-choice \{ animation: none; \}/.test(traceIsleCss), "Trace Isle still pulses location choices with reduced motion");
check(traceIsleModules[0].includes("data-object-id") && traceIsleModules[0].includes("trigger?.focus()"), "Trace Isle does not restore focus after closing an object detail");
check(!/<script[^>]+src="https?:\/\//.test(traceIsle), "Trace Isle loads a third-party script");
for (const bannedNetworkApi of ["fetch(", "XMLHttpRequest", "WebSocket", "sendBeacon"]) {
  check(!traceIsleModules.some((source) => source.includes(bannedNetworkApi)), `Trace Isle contains prohibited network API: ${bannedNetworkApi}`);
}
for (const asset of ["starter-cove.webp", "starter-river.webp", "starter-ridge.webp"]) {
  const assetPath = path.join(root, "trace-isle/assets", asset);
  check(fs.existsSync(assetPath), `Trace Isle is missing ${asset}`);
  check(fs.statSync(assetPath).size < 500 * 1024, `Trace Isle asset exceeds 500 KB: ${asset}`);
}

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
for (const [route] of publicPages) {
  check(sitemap.includes(`<loc>https://lucinuo.github.io${route}</loc>`), `sitemap is missing ${route}`);
}
check(sitemap.includes("<loc>https://lucinuo.github.io/phase-shift/</loc>"), "sitemap is missing the playable Phase Shift game");
for (const privateOrLegacy of ["/workspace/", "/bearing/", "/growth-compass/", "/notes/"]) {
  check(!sitemap.includes(`<loc>https://lucinuo.github.io${privateOrLegacy}</loc>`), `sitemap exposes ${privateOrLegacy}`);
}

const notesRedirect = fs.readFileSync(path.join(root, "notes/index.html"), "utf8");
check(notesRedirect.includes('location.replace("/publications/"'), "Notes does not redirect to Publications");
check(notesRedirect.includes('rel="canonical" href="https://lucinuo.github.io/publications/"'), "Notes canonical is not Publications");

const bearingRedirect = fs.readFileSync(path.join(root, "bearing/index.html"), "utf8");
check(bearingRedirect.includes('location.replace("/workspace/"'), "former workspace route does not redirect to the private boundary");
check(bearingRedirect.includes('name="robots" content="noindex, nofollow"'), "former workspace route remains indexable");
check(!bearingRedirect.includes("script.js"), "former public workspace still loads application code");

const legacyRedirect = fs.readFileSync(path.join(root, "growth-compass/index.html"), "utf8");
check(legacyRedirect.includes('location.replace("/workspace/")'), "legacy route does not redirect to the private boundary");
check(legacyRedirect.includes("not being deleted"), "legacy route does not explain data preservation");

const workspace = fs.readFileSync(path.join(root, "workspace/index.html"), "utf8");
check(workspace.includes('name="robots" content="noindex, nofollow"'), "workspace boundary remains indexable");
check(workspace.includes('location.replace("https://bearing-private.pages.dev/")'), "workspace does not open the deployed private sign-in");
check(workspace.includes('rel="canonical" href="https://bearing-private.pages.dev/"'), "workspace canonical does not point to the private host");
check(!workspace.includes("password") && !workspace.includes("Password"), "public workspace redirect contains password implementation");

const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
const uaStory = fs.readFileSync(path.join(root, "research/urolithin-a/index.html"), "utf8");
const uaStoryCss = fs.readFileSync(path.join(root, "research/urolithin-a/styles.css"), "utf8");
check(home.includes("public digital studio"), "home does not define the public studio role");
check(home.includes("Research, tools, and work in progress"), "home lacks the direct public-studio introduction");
check(home.includes("Saccharina japonica fucoidan (SJF)"), "home is missing the approved public SJF research summary");
check(home.includes("HTML") && home.includes("CSS") && home.includes("JavaScript") && home.includes("no framework"), "home does not give a concrete Digital systems example");
check(home.includes("流式細胞技術"), "home does not use the requested Chinese term for flow cytometry");
check(!home.includes("calcium mobilization") && !home.includes("鈣離子動員"), "home overstates the Urolithin A thesis with calcium mobilization");
check(!home.includes("FeCl") && !home.includes("arterial occlusion"), "home overstates the Urolithin A thesis with an animal thrombosis model");
check(home.includes("HTML、CSS 和 JavaScript 自己做的"), "home does not clearly state that the website was self-built with JavaScript");
check(home.includes('class="project-gallery"') && home.includes("phase-shift-arena.webp"), "home is missing the image-led project gallery or Phase Shift visual");
check(home.includes('href="/research/urolithin-a/"'), "home does not link to the Urolithin A research story");
check(home.includes('href="/trace-isle/"') && home.includes("starter-cove.webp"), "home does not expose the playable Trace Isle preview");
check(sitemap.includes("<loc>https://lucinuo.github.io/trace-isle/</loc>"), "sitemap is missing Trace Isle");
check(!home.includes("Storytelling Demo"), "home overpromises an interactive storytelling demo");
check(!home.includes("Featured product"), "home still uses public product marketing language");
check(uaStory.includes('class="ua-hero-art"') && uaStory.includes('class="ua-molecule"'), "Urolithin A story is missing its original platelet illustration system");
check(uaStoryCss.includes("@media (prefers-reduced-motion: reduce)") && uaStoryCss.includes(".flow"), "Urolithin A story motion does not include a reduced-motion fallback");

const publications = fs.readFileSync(path.join(root, "publications/index.html"), "utf8");
check(publications.includes("formally published") && publications.includes("checked it"), "Publications does not prevent unverified records");
check(publications.includes("No public publication records yet"), "Publications is missing the concise empty state");
check(!publications.includes("record-structure"), "Publications still exposes an internal record specification");

const projects = fs.readFileSync(path.join(root, "projects/index.html"), "utf8");
check(projects.includes('id="phase-shift-project"'), "Projects is missing Phase Shift");
check(projects.includes('href="/projects/phase-shift/"') && projects.includes('href="/phase-shift/"'), "Projects is missing the Phase Shift case-study or game links");
check(projects.includes("phase-shift-arena.webp"), "Projects is missing the Phase Shift visual");
check(projects.includes('id="lighthouse-project"'), "Projects is missing Lighthouse");
check(projects.includes('href="/projects/lighthouse/"') && projects.includes('href="/lighthouse/"'), "Projects is missing Lighthouse case-study or concept links");
check(projects.includes("Lucinuo Website System"), "Projects does not explain the public website repository");
check(projects.includes("lucinuo-homepage-preview.png"), "Projects is missing the current homepage visual evidence");
check(projects.includes("Plain HTML, CSS, and JavaScript") && projects.includes("No framework"), "Projects does not name the website implementation stack");
check(projects.includes("就是這個網站。自己做的，把上面這些東西收在一起。"), "Projects does not use the approved Lucinuo Website System description");
check(projects.includes('href="https://github.com/Lucinuo/lucinuo.github.io"'), "Projects does not link to the public source repository");

const phaseShiftCase = fs.readFileSync(path.join(root, "projects/phase-shift/index.html"), "utf8");
check(phaseShiftCase.includes("Clear the field. Change the phase."), "Phase Shift case study is missing its product statement");
check(phaseShiftCase.includes('href="/phase-shift/"'), "Phase Shift case study does not link to the playable game");
check(phaseShiftCase.includes("phase-shift-arena.webp"), "Phase Shift case study is missing its game visual");
check(phaseShiftCase.includes("Shift Attack") && phaseShiftCase.includes("Shift Guard"), "Phase Shift case study does not explain both phase choices");

const phaseShift = fs.readFileSync(path.join(root, "phase-shift/index.html"), "utf8");
const phaseShiftCss = fs.readFileSync(path.join(root, "phase-shift/styles.css"), "utf8");
const phaseShiftScript = fs.readFileSync(path.join(root, "phase-shift/game.js"), "utf8");
check(phaseShift.includes('rel="canonical" href="https://lucinuo.github.io/phase-shift/"'), "Phase Shift game has the wrong canonical URL");
check(phaseShift.includes('href="/projects/phase-shift/"'), "Phase Shift game has no way back to its case study");
check(phaseShift.includes("data-player-board") && phaseShift.includes("data-ai-board"), "Phase Shift is missing a player or AI field");
for (const control of ["left", "right", "rotate", "soft", "drop", "hold", "phase"]) {
  check(phaseShift.includes(`data-control="${control}"`), `Phase Shift is missing the ${control} touch control`);
}
check(phaseShift.includes('data-phase-mode="attack"') && phaseShift.includes('data-phase-mode="guard"'), "Phase Shift is missing an attack or guard phase choice");
check(phaseShiftCss.includes("prefers-reduced-motion"), "Phase Shift does not respect reduced motion");
check(phaseShiftCss.includes("arena-background.webp") && phaseShiftScript.includes("block-tile.png"), "Phase Shift does not use its generated production assets");
check(phaseShiftScript.includes("chooseAIPlacement") && phaseShiftScript.includes("removeInterferenceRows"), "Phase Shift is missing AI placement or guard rules");
check(fs.existsSync(path.join(root, "phase-shift/assets/arena-background.webp")), "Phase Shift arena background is missing");
check(fs.existsSync(path.join(root, "phase-shift/assets/block-tile.png")), "Phase Shift block tile is missing");

const lighthouseCase = fs.readFileSync(path.join(root, "projects/lighthouse/index.html"), "utf8");
check(lighthouseCase.includes("Presence without pressure"), "Lighthouse case study is missing its core design principle");
check(lighthouseCase.includes('href="/lighthouse/"'), "Lighthouse case study does not link to the public concept");
check(lighthouseCase.includes("not a production communication service"), "Lighthouse case study overstates the prototype");

const lighthouse = fs.readFileSync(path.join(root, "lighthouse/index.html"), "utf8");
check(lighthouse.includes('rel="canonical" href="https://lucinuo.github.io/lighthouse/"'), "Lighthouse concept has the wrong canonical URL");
check(lighthouse.includes("data:image/webp;base64,"), "Lighthouse concept does not embed its scene images");
check(!lighthouse.includes("__LIT_IMAGE__") && !lighthouse.includes("__UNLIT_IMAGE__"), "Lighthouse concept still contains image placeholders");
check(!lighthouse.includes('<script src=') && !lighthouse.includes('rel="stylesheet"'), "Lighthouse concept is not self-contained");
check(lighthouse.includes("data-lamp-toggle") && lighthouse.includes("aria-pressed"), "Lighthouse lamp is not an accessible control");
check(lighthouse.includes("prefers-reduced-motion"), "Lighthouse concept does not respect reduced motion");
check(lighthouse.includes('href="/projects/lighthouse/"'), "Lighthouse concept has no way back to its case study");

check(!fs.existsSync(path.join(root, "research/index.html")), "the retired /research/ landing page is back");
check(!home.includes("HCC") && !home.includes("TAM"), "home research section still centers the separate HCC/TAM demonstration");

const about = fs.readFileSync(path.join(root, "about/index.html"), "utf8");
check(about.includes("I’m Lucille Huang"), "About does not begin with a direct introduction");
check(about.includes('class="about-portrait"') && about.includes("lucille.jpg"), "About does not use the original portrait in the editorial layout");
check(about.includes("我是 Lucille Huang"), "About does not use Lucille Huang in Chinese mode");
check(about.includes("PhD Candidate, Graduate Institute of Life Sciences, National Defense Medical University"), "About contact context is missing the institutional affiliation");
check(about.includes("國防醫學大學生命科學研究所博士候選人"), "About page is missing Chinese PhD candidate status");
check(about.includes("M.S. in Pharmacology, National Defense Medical University, 2023"), "About page is missing the master's institution and year");
check(about.includes("國防醫學大學藥理學碩士，2023"), "About page is missing the Chinese master's institution and year");
check(about.includes("國防醫學大學生命科學研究所"), "About page is missing the current Chinese affiliation");
check(about.includes('class="plain-link" href="mailto:stu9500149@gmail.com"'), "About email link is not using the plain-link style");
check(about.includes('class="plain-link" href="https://github.com/Lucinuo"'), "About GitHub URL is not using the plain-link style");
check(about.indexOf("Biological research") < about.indexOf("Background"), "About leads with academic status instead of current work");

const siteCss = fs.readFileSync(path.join(root, "assets/site.css"), "utf8");
check(siteCss.includes("@media (max-width: 1080px)"), "iPad-width navigation does not collapse before clipping");
check(siteCss.includes("safe-area-inset-top"), "site header does not account for Apple safe areas");
check(siteCss.includes(':root[data-theme="dark"]'), "shared design system is missing dark mode tokens");
check(siteCss.includes(".plain-link") && siteCss.includes("text-decoration: none"), "shared design system is missing the no-underline contact link style");
const siteScript = fs.readFileSync(path.join(root, "assets/site.js"), "utf8");
check(siteScript.includes('matchMedia("(prefers-color-scheme: dark)")'), "theme does not default to the system setting");
check(siteScript.includes("data-theme-toggle"), "theme script does not manage the icon toggle");
check(siteScript.includes("setStored(themeKey"), "theme choice is not remembered");
check(siteScript.includes('event.key === "Escape"'), "compact navigation cannot be dismissed with Escape");

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`Site validation passed (${publicPages.length} public routes, redirects, metadata, privacy boundary, theme, and device rules).`);
