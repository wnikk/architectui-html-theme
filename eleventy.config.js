// Сборка демо-страниц (Eleventy 3). Стили собирает sass отдельной командой, Eleventy их не трогает.
// Правила: _dev_instructions/architecture/05-target.md

// "elements-cards.html" -> "/elements-cards", сравнивается с page.filePathStem
const stemOf = (href) => "/" + String(href).replace(/\.html$/, "");

export default function (eleventyConfig) {
  eleventyConfig.addFilter("isActive", (href, stem) => Boolean(href) && stemOf(href) === stem);
  eleventyConfig.addFilter("hasActive", (items, stem) => items.some((item) => stemOf(item.href) === stem));

  // Все страницы используют один макет и кладутся в корень dist/ под своим именем
  eleventyConfig.addGlobalData("layout", "base.njk");
  eleventyConfig.addGlobalData("permalink", () => (data) => `${data.page.filePathStem}.html`);

  eleventyConfig.addPassthroughCopy({
    "src/assets/images": "assets/images",
    "src/assets/favicon.ico": "favicon.ico",
    "src/js/architectui.js": "architectui.js",
  });
  // Модули страниц лежат рядом со страницами и копируются в корень dist/
  eleventyConfig.addPassthroughCopy("src/pages/*.js");

  eleventyConfig.addWatchTarget("src/js/");
  eleventyConfig.addWatchTarget("src/pages/*.js");
  // CSS пишет sass --watch прямо в dist/, dev-сервер перезагружает страницу по этому файлу
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
