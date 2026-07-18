const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../site");
const pages = [
  ["/", "index.html"],
  ["/research/", "research/index.html"],
  ["/projects/", "projects/index.html"],
  ["/bearing/", "bearing/index.html"],
  ["/notes/", "notes/index.html"],
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

for (const [route, relativeFile] of pages) {
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

  const links = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const link of links) {
    if (!link.startsWith("/") || link.startsWith("//")) continue;
    check(resolvesToFile(link), `${route} points to missing local asset or route: ${link}`);
  }
}

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
for (const [route] of pages) {
  check(sitemap.includes(`<loc>https://lucinuo.github.io${route}</loc>`), `sitemap is missing ${route}`);
}
check(!sitemap.includes("growth-compass"), "sitemap still exposes the legacy route");

const redirect = fs.readFileSync(path.join(root, "growth-compass/index.html"), "utf8");
check(redirect.includes('location.replace("/bearing/")'), "legacy page does not redirect to /bearing/");
check(redirect.includes('rel="canonical" href="https://lucinuo.github.io/bearing/"'), "legacy page canonical URL is not /bearing/");

const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
check(home.includes('class="bearing-interface"'), "home is missing the real Bearing interface preview");
check(!home.includes('class="bearing-preview"'), "home still contains the old illustrative Bearing preview");
check(home.includes("Lucinuo Website System"), "home does not include the public website system in Selected Work");

const projects = fs.readFileSync(path.join(root, "projects/index.html"), "utf8");
for (const status of ["Featured · Active", "Active", "Experimental", "Completed case study"]) {
  check(projects.includes(status), `projects is missing the ${status} status`);
}
check(projects.includes('href="https://github.com/Lucinuo/lucinuo.github.io"'), "projects does not link to the public source repository");
check(projects.includes("Lucinuo Website System"), "projects does not explain the public website repository");
const sjfSection = projects.slice(projects.indexOf('id="sjf-knowledge-system"'), projects.indexOf('id="information-router"'));
const routerSection = projects.slice(projects.indexOf('id="information-router"'), projects.indexOf('id="mechanism-story"'));
check(!sjfSection.includes("github.com"), "SJF case study incorrectly claims a public source repository");
check(!routerSection.includes("github.com"), "Research Information Router incorrectly claims a public source repository");

const research = fs.readFileSync(path.join(root, "research/index.html"), "utf8");
check(research.includes("View the implementation source"), "research storytelling does not identify its shared source repository");

const about = fs.readFileSync(path.join(root, "about/index.html"), "utf8");
check(about.includes("Lucinuo is the independent practice"), "about no longer defines Lucinuo as an independent practice");
check(about.indexOf("PhD candidate") > about.indexOf("The practice"), "academic status appears before the Lucinuo practice is explained");
check(about.includes("Source, technical notes, and development history"), "about does not explain GitHub's role");

const bearing = fs.readFileSync(path.join(root, "bearing/index.html"), "utf8");
check(!bearing.includes('class="about-bearing"'), "Bearing still contains the duplicated About Bearing feature list");
check(bearing.includes("Life overview"), "Bearing does not offer the optional Life overview");
check(bearing.includes("No score. No need to complete every perspective."), "Life overview does not explain its non-scoring, optional behavior");
for (const perspective of ["Knowledge", "Expression", "Aesthetic", "Deep interest", "Emotion"]) {
  check(bearing.includes(perspective), `Life overview is missing the ${perspective} perspective`);
}
const bearingScript = fs.readFileSync(path.join(root, "bearing/script.js"), "utf8");
check(!bearingScript.includes("saved records"), "Bearing still exposes an unnecessary saved-record count");
check(bearingScript.includes("Data.DATA_FORMAT"), "Bearing exports do not identify the shared data format");
check(bearingScript.includes("Data.isCompatibleBackup"), "Bearing import does not reject unrelated JSON files");
const bearingServiceWorker = fs.readFileSync(path.join(root, "bearing/sw.js"), "utf8");
check(bearingServiceWorker.includes('bearing-shell-v6'), "Bearing service worker cache was not advanced for Life overview");
check(bearingServiceWorker.includes('icon-192.png'), "Bearing service worker does not cache the 192px install icon");

const siteCss = fs.readFileSync(path.join(root, "assets/site.css"), "utf8");
check(siteCss.includes("@media (max-width: 1080px)"), "iPad-width navigation does not collapse before clipping");
check(siteCss.includes("safe-area-inset-top"), "site header does not account for Apple safe areas");
const siteScript = fs.readFileSync(path.join(root, "assets/site.js"), "utf8");
check(siteScript.includes('matchMedia("(max-width: 1080px)")'), "navigation rotation state does not match the iPad breakpoint");
check(siteScript.includes('event.key === "Escape"'), "compact navigation cannot be dismissed with Escape");

const manifest = JSON.parse(fs.readFileSync(path.join(root, "bearing/manifest.webmanifest"), "utf8"));
check(manifest.id === "/bearing/", "Bearing manifest has an unstable app id");
check(manifest.start_url === "/bearing/" && manifest.scope === "/bearing/", "Bearing manifest has the wrong launch scope");
check(manifest.display === "standalone", "Bearing manifest is not configured for standalone use");
check(manifest.icons.some((icon) => icon.sizes === "192x192" && icon.src === "/icon-192.png"), "Bearing manifest is missing the 192px install icon");
check(manifest.icons.some((icon) => icon.sizes === "512x512" && icon.src === "/icon-512.png"), "Bearing manifest is missing the 512px install icon");
check(fs.existsSync(path.join(root, "icon-192.png")), "192px install icon file is missing");

const dataSchema = JSON.parse(fs.readFileSync(path.join(root, "bearing/data-schema.json"), "utf8"));
check(dataSchema.$id === "https://lucinuo.github.io/bearing/data-schema.json", "Bearing data schema has the wrong id");
check(dataSchema.properties.version.const === 4, "Bearing data schema was not advanced to v4");
check(dataSchema.required.includes("lifeOverviews"), "Bearing data schema does not require lifeOverviews");

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`Site validation passed (${pages.length} routes, links, metadata, sitemap, redirect, manifest).`);
