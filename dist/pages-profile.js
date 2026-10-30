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
// My Profile demo: the form stays on the page and a toast confirms the save. A real project sends the form with fetch.
(() => {
  const form = document.getElementById("profile-form");
  const toast = document.getElementById("profile-saved");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (toast) window.bootstrap?.Toast.getOrCreateInstance(toast).show();
  });
})();
