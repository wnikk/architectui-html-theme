// Eleventy builds the demo pages. Styles are compiled separately by the sass CLI.

// "elements-cards.html" -> "/elements-cards", compared with page.filePathStem
const stemOf = (href) => "/" + String(href).replace(/\.html$/, "");

export default function (eleventyConfig) {
  eleventyConfig.addFilter("isActive", (href, stem) => Boolean(href) && stemOf(href) === stem);
  eleventyConfig.addFilter("hasActive", (items, stem) => items.some((item) => stemOf(item.href) === stem));

  // Path of a page in the menu for the header breadcrumbs: the heading and the parent item each with the links
  // of their level (for a dropdown), then the page itself. Empty when the page is not in the menu.
  // Initials of a name for an avatar without a photo: "Maria Chen" -> "MC"
  eleventyConfig.addFilter("initials", (name) => String(name).split(/\s+/).filter(Boolean).map((part) => part[0]).slice(0, 2).join("").toUpperCase());

  eleventyConfig.addFilter("breadcrumbsFor", (menu, stem) => {
    for (const group of menu) {
      const level = group.items.map((item) => ({ title: item.title, href: item.href ?? item.children?.[0]?.href }));
      for (const item of group.items) {
        if (item.href && stemOf(item.href) === stem) {
          return [{ title: group.heading, links: level }, { title: item.title }];
        }
        const child = item.children?.find((entry) => stemOf(entry.href) === stem);
        if (child) {
          return [{ title: group.heading, links: level }, { title: item.title, links: item.children }, { title: child.title }];
        }
      }
    }
    return [];
  });

  // Every page uses the same layout and is written to the dist/ root under its own file name
  eleventyConfig.addGlobalData("layout", "base.njk");
  eleventyConfig.addGlobalData("permalink", () => (data) => `${data.page.filePathStem}.html`);

  eleventyConfig.addPassthroughCopy({
    "src/assets/images": "assets/images",
    "src/assets/favicon.ico": "favicon.ico",
    "src/js/architectui.js": "architectui.js",
    "src/js/architectui-auth.js": "architectui-auth.js",
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
