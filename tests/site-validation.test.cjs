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

for (const manifest of ["bearing/manifest.webmanifest"]) {
  JSON.parse(fs.readFileSync(path.join(root, manifest), "utf8"));
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`Site validation passed (${pages.length} routes, links, metadata, sitemap, redirect, manifest).`);
