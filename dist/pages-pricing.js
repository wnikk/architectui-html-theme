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
// Pricing page: the billing period switch shows monthly or yearly prices and billing notes (data-monthly / data-yearly).
(() => {
  const root = document.getElementById("pricing");
  if (!root) return;

  function show(period) {
    document.querySelectorAll("[data-price], [data-billed]").forEach((el) => {
      el.textContent = el.dataset[period];
    });
  }

  root.addEventListener("change", (event) => {
    if (event.target.name === "billing") show(event.target.value);
  });
  show(root.querySelector('[name="billing"]:checked').value);
})();
