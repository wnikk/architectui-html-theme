// Eleventy builds the demo pages. Styles are compiled separately by the sass CLI.

// "elements-cards.html" -> "/elements-cards", compared with page.filePathStem
const stemOf = (href) => "/" + String(href).replace(/\.html$/, "");

export default function (eleventyConfig) {
  eleventyConfig.addFilter("isActive", (href, stem) => Boolean(href) && stemOf(href) === stem);
  eleventyConfig.addFilter("hasActive", (items, stem) => items.some((item) => stemOf(item.href) === stem));

  // Every page uses the same layout and is written to the dist/ root under its own file name
  eleventyConfig.addGlobalData("layout", "base.njk");
  eleventyConfig.addGlobalData("permalink", () => (data) => `${data.page.filePathStem}.html`);

  eleventyConfig.addPassthroughCopy({
    "src/assets/images": "assets/images",
    "src/assets/favicon.ico": "favicon.ico",
    "src/js/architectui.js": "architectui.js",
    "llms.txt": "llms.txt",
    "llms-full.txt": "llms-full.txt",
  });
  // Page scripts live next to their pages and are copied to the dist/ root
  eleventyConfig.addPassthroughCopy("src/pages/*.js");

  eleventyConfig.addWatchTarget("src/js/");
  eleventyConfig.addWatchTarget("src/pages/*.js");
  // sass --watch writes CSS straight into dist/; reload the page when it changes
  eleventyConfig.setServerOptions({ watch: ["dist/architectui.css"] });

  return {
    dir: {
      input: "src/pages",
      includes: "../_includes",
      layouts: "../_includes/layouts",
      data: "../_data",
      output: "dist",
    },
    templateFormats: ["html", "njk"],
    htmlTemplateEngine: "njk",
  };
}
