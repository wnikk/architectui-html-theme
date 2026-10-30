// The notice at the top of the built files: the version, the author and the homepage from package.json, and
// the copyright line of that author from LICENSE. The full LICENSE is copied to dist/ next to the files.
// Eleventy gives the lines to the pages as "banner"; run with node after the sass build, this file puts
// the same notice at the top of every CSS and JS file in dist/. A notice already there is replaced: the scripts
// are copied by Eleventy, not by sass, and keep it between builds.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("../../", import.meta.url);
const pkg = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));
const copyright = readFileSync(new URL("LICENSE", root), "utf8").split("\n")
  .find((line) => line.startsWith("Copyright ") && line.endsWith(` ${pkg.author}`)) ?? `Copyright (c) ${pkg.author}`;

const banner = [
  `=========================================================`,
  `ArchitectUI v${pkg.version} - a theme layer on Bootstrap`,
  `=========================================================`,
  pkg.homepage,
  copyright,
  `Released under the ${pkg.license} License, see LICENSE`,
  `=========================================================`,
  `The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.`,
];

export default banner;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const comment = `/*!\n${banner.map((line) => ` * ${line}`).join("\n")}\n */\n`;
  const dist = new URL("dist/", root);
  const files = [
    ...readdirSync(dist).filter((name) => name.endsWith(".css") || name.endsWith(".js")),
    ...readdirSync(new URL("themes/", dist)).filter((name) => name.endsWith(".css")).map((name) => `themes/${name}`),
  ];
  for (const name of files) {
    const file = new URL(name, dist);
    writeFileSync(file, comment + readFileSync(file, "utf8").replace(/^\/\*![\s\S]*?\*\/\n/, ""));
  }
  console.log(`Banner v${pkg.version} added to ${files.length} CSS and JS files`);
}
