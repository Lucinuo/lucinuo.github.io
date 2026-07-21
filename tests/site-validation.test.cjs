const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../site");
const publicPages = [
  ["/", "index.html"],
  ["/research/", "research/index.html"],
  ["/publications/", "publications/index.html"],
  ["/projects/", "projects/index.html"],
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
  check(html.includes('property="og:image" content="https://lucinuo.github.io/og.png"'), `${route} is missing the shared social image`);
  check(/<h1(?:\s|>)/.test(html), `${route} is missing an h1`);
  check(html.includes("viewport-fit=cover"), `${route} does not account for Apple safe areas`);
  check(html.includes('href="https://github.com/Lucinuo"'), `${route} does not link to the Lucinuo GitHub profile`);
  check(html.includes('href="mailto:stu9500149@gmail.com"'), `${route} does not expose a direct contact path`);
  check(html.includes("data-theme-toggle"), `${route} is missing the shared theme toggle`);
  check(html.includes("theme-icon-sun") && html.includes("theme-icon-moon"), `${route} does not use sun and moon icons`);
  check(html.includes('href="/publications/"'), `${route} does not expose Publications`);
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

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
for (const [route] of publicPages) {
  check(sitemap.includes(`<loc>https://lucinuo.github.io${route}</loc>`), `sitemap is missing ${route}`);
}
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
check(workspace.includes("real identity") || workspace.includes("身份驗證"), "workspace boundary does not explain real authentication");
check(workspace.includes("No public demo") || workspace.includes("不使用公開展示"), "workspace boundary does not reject a public demo or fake password");

const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
check(home.includes("public digital studio"), "home does not define the public studio role");
check(home.includes("Research, tools, and work in progress"), "home lacks the direct public-studio introduction");
check(home.includes("Saccharina japonica fucoidan (SJF)"), "home is missing the approved public SJF research summary");
check(home.includes("semantic HTML") && home.includes("GitHub Pages"), "home does not give a concrete Digital systems example");
check(home.includes("Read the case") && !home.includes("Storytelling Demo"), "home overpromises an interactive storytelling demo");
check(!home.includes("Featured product"), "home still uses public product marketing language");

const publications = fs.readFileSync(path.join(root, "publications/index.html"), "utf8");
check(publications.includes("Verified publication records"), "Publications does not prevent unverified records");
check(publications.includes("No public publication records yet"), "Publications is missing the concise empty state");
check(!publications.includes("record-structure"), "Publications still exposes an internal record specification");

const projects = fs.readFileSync(path.join(root, "projects/index.html"), "utf8");
check(!projects.includes('id="bearing-project"'), "Projects still presents the private workspace as a public project");
check(projects.includes("Lucinuo Website System"), "Projects does not explain the public website repository");
check(projects.includes("lucinuo-website-preview.png"), "Projects is missing visual evidence of the website implementation");
check(projects.includes("Semantic HTML, shared CSS and JavaScript"), "Projects does not name the website implementation stack");
check(projects.includes("Literature Knowledge System"), "Projects is missing the privacy-safe literature-system case study");
check(projects.includes("It is not a statement of Lucille Huang's own research"), "Projects does not label HCC/TAM as a demonstration");
check(projects.includes('href="https://github.com/Lucinuo/lucinuo.github.io"'), "Projects does not link to the public source repository");

const research = fs.readFileSync(path.join(root, "research/index.html"), "utf8");
check(!research.includes("HCC") && !research.includes("TAM"), "Research still centers the separate HCC/TAM demonstration");

const about = fs.readFileSync(path.join(root, "about/index.html"), "utf8");
check(about.includes("I’m Lucille Huang"), "About does not begin with a direct introduction");
check(about.includes('class="about-portrait"') && about.includes("lucille.jpg"), "About does not use the original portrait in the editorial layout");
check(about.includes("我是 Lucille Huang"), "About does not use Lucille Huang in Chinese mode");
check(about.includes("Graduate Institute of Life Sciences, National Defense Medical University"), "About contact context is missing the institutional affiliation");
check(about.indexOf("Biological research") < about.indexOf("Academic context"), "About leads with academic status instead of current work");

const siteCss = fs.readFileSync(path.join(root, "assets/site.css"), "utf8");
check(siteCss.includes("@media (max-width: 1080px)"), "iPad-width navigation does not collapse before clipping");
check(siteCss.includes("safe-area-inset-top"), "site header does not account for Apple safe areas");
check(siteCss.includes(':root[data-theme="dark"]'), "shared design system is missing dark mode tokens");
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
