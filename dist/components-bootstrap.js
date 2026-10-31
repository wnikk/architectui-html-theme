/*!
 * =========================================================
 * ArchitectUI v6.2.37 - a theme layer on Bootstrap
 * =========================================================
 * https://github.com/wnikk/architectui-html-theme
 * Copyright (c) 2026 Wnikk
 * Released under the MIT License, see LICENSE
 * =========================================================
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */
// Bootstrap Components page: the few things the data API does not do by itself.
// Indeterminate check: the state is a property, not an attribute. Spy nav: Bootstrap ScrollSpy comes from data-bs-spy.
(() => {
  document.querySelectorAll("[data-bs-indeterminate]").forEach((input) => {
    input.indeterminate = true;
  });
})();
