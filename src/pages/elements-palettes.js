// Theme Palettes page: HEX values of the current theme (read from the page), the light or dark palettes of all themes
// (values from the build), live script values, copy on click. A canvas pixel turns any CSS color (rgb, color-mix,
// color()) into HEX; a translucent color gets the alpha byte.
(() => {
  const current = document.getElementById("paletteCurrent");
  const table = document.getElementById("paletteAll");
  if (!current || !table) return;

  const toast = document.getElementById("paletteCopied");
  const toastText = document.getElementById("paletteCopiedText");
  const pixel = Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext("2d", { willReadFrequently: true });
  const root = document.documentElement;

  function hex(color) {
    pixel.clearRect(0, 0, 1, 1);
    pixel.fillStyle = "#000";
    pixel.fillStyle = color;
    pixel.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = pixel.getImageData(0, 0, 1, 1).data;
    const bytes = a === 255 ? [r, g, b] : [r, g, b, a];
    return `#${bytes.map((n) => n.toString(16).padStart(2, "0")).join("")}`;
  }

  // Current theme: swatches read their color from the page
  function readCurrent() {
    current.querySelectorAll("[data-hex-for]").forEach((button) => {
      const swatch = current.querySelector(`[data-swatch="${button.dataset.hexFor}"]`);
      const value = hex(getComputedStyle(swatch).backgroundColor);
      button.textContent = value;
      button.dataset.copy = value;
    });
    const active = document.querySelector('.aui-theme-switch [data-aui-setting="theme"].active');
    current.querySelector("[data-current-theme]").textContent = active?.textContent.trim() || "Business";
    current.querySelector("[data-current-mode]").textContent = root.getAttribute("data-bs-theme") || "light";

    const { token, rgba } = window.ArchitectUI ?? {};
    if (token) {
      document.querySelector('[data-script="token-primary"]').textContent = token("primary");
      document.querySelector('[data-script="token-surface"]').textContent = token("--aui-surface");
      document.querySelector('[data-script="rgba-primary"]').textContent = rgba("primary", 0.25);
    }
  }

  // All themes: one mode at a time; each swatch stands on the surface of its theme
  function showMode(mode) {
    table.querySelectorAll(`[data-surface-${mode}]`).forEach((surface) => {
      surface.style.background = surface.dataset[mode === "light" ? "surfaceLight" : "surfaceDark"];
    });
    table.querySelectorAll("[data-light]").forEach((swatch) => {
      const value = swatch.dataset[mode];
      swatch.style.background = value;
      const label = swatch.parentElement.nextElementSibling;
      if (swatch.hasAttribute("data-gradient")) {
        label.textContent = "gradient";
        swatch.dataset.copy = value;
      } else {
        const code = hex(getComputedStyle(swatch).backgroundColor);
        label.textContent = code;
        swatch.dataset.copy = code;
      }
    });
  }

  table.addEventListener("change", (event) => {
    if (event.target.name === "paletteMode") showMode(event.target.value);
  });

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      toastText.textContent = `Copied: ${text}`;
    } catch {
      toastText.textContent = text;
    }
    window.bootstrap?.Toast.getOrCreateInstance(toast).show();
  }

  document.addEventListener("click", (event) => {
    const source = event.target.closest("[data-copy-from]");
    if (source) {
      copy(document.getElementById(source.dataset.copyFrom).textContent);
      return;
    }
    const target = event.target.closest("[data-copy]");
    if (target?.dataset.copy && (current.contains(target) || table.contains(target))) copy(target.dataset.copy);
  });

  // A theme or mode change applies the new stylesheet first; read the colors on the next frame
  let events = 0;
  document.addEventListener("aui:theme-change", () => {
    document.querySelector('[data-script="events"]').textContent = ++events;
    requestAnimationFrame(() => requestAnimationFrame(readCurrent));
  });

  const startMode = root.getAttribute("data-bs-theme") === "dark" ? "dark" : "light";
  table.querySelector(`[name="paletteMode"][value="${startMode}"]`).checked = true;
  showMode(startMode);
  readCurrent();
})();
