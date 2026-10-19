// ArchitectUI theme script: layout behavior on top of Bootstrap 5, no dependencies. Load it after Bootstrap
// with <script defer src="architectui.js"></script>. Its only global is window.ArchitectUI.
// Settings are stored in localStorage under "architectui" and applied as data-aui-* attributes on <html>.
// The inline <head> script applies them before the first paint; this script changes and saves them.
(() => {
  const root = document.documentElement;
  const STORAGE_KEY = "architectui";
  const systemDark = matchMedia("(prefers-color-scheme: dark)");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const DEFAULTS = {
    header: "fixed", sidebar: "fixed", footer: "static", tabs: "shadow", mode: "light", theme: "",
    density: "", "header-scheme": "", "sidebar-scheme": "", "sidebar-collapsed": "",
  };
  const attrName = (key) => `data-aui-${key}`;
  const currentValue = (key) => root.getAttribute(attrName(key)) || DEFAULTS[key];
  const notify = () => document.dispatchEvent(new CustomEvent("aui:theme-change", { detail: { theme: currentValue("theme") } }));

  function readSettings() {
    try {
      const settings = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
      if (settings.theme === "light" || settings.theme === "dark") {
        [settings.mode, settings.theme] = [settings.theme, undefined]; // 5.0 stored the mode as "theme"
      }
      if (settings.theme === "blue") settings.theme = undefined; // Business is built in since 5.3
      return settings;
    } catch {
      return {};
    }
  }

  function writeSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Storage is unavailable (private mode): the setting lasts until the page reloads
    }
  }

  // Resolves the light/dark/system mode into data-bs-theme. Dark-only themes are always dark.
  function applyMode() {
    const theme = currentValue("theme");
    const darkOnly = theme && (root.dataset.auiDarkOnly || "").split(" ").includes(theme);
    const mode = currentValue("mode");
    const dark = darkOnly || mode === "dark" || (mode === "system" && systemDark.matches);
    root.setAttribute("data-bs-theme", dark ? "dark" : "light");
  }

  // Theme and mode changes cross-fade the whole page with the View Transitions API.
  // Without it, with reduced motion or on a hidden tab the change applies at once.
  function smoothly(update) {
    if (!document.startViewTransition || reducedMotion.matches || document.hidden) {
      update();
    } else {
      // A transition is skipped when the next change comes before it starts; the change itself still applies
      document.startViewTransition(update).ready.catch(() => {});
    }
  }

  // A theme is a stylesheet next to architectui.css: themes/<name>.css. The new link loads with media="not all",
  // so the page keeps the old colors; then the attribute, the link and the mode change in one step.
  let pendingTheme = null;

  function applyTheme(theme) {
    pendingTheme?.remove();
    pendingTheme = null;
    const swap = (link) => smoothly(() => {
      document.querySelectorAll("#aui-theme").forEach((old) => old !== link && old.remove());
      if (link) {
        link.media = "all";
        link.id = "aui-theme";
        root.setAttribute(attrName("theme"), theme);
      } else {
        root.removeAttribute(attrName("theme"));
      }
      applyMode();
      syncControls();
      notify();
    });
    if (!/^[a-z0-9-]+$/.test(theme)) {
      swap(null);
      return;
    }
    const base = document.querySelector('link[href$="architectui.css"]');
    const link = Object.assign(document.createElement("link"), {
      rel: "stylesheet",
      media: "not all",
      href: base.getAttribute("href").replace(/architectui\.css$/, `themes/${theme}.css`),
    });
    pendingTheme = link;
    link.addEventListener("load", () => {
      if (pendingTheme !== link) return;
      pendingTheme = null;
      swap(link);
    }, { once: true });
    link.addEventListener("error", () => link.remove(), { once: true });
    (document.getElementById("aui-theme") ?? base).after(link);
  }

  // Inputs show the setting as checked; buttons (a theme in the header list) as .active with aria-current
  function syncControls() {
    document.querySelectorAll("[data-aui-setting]").forEach((control) => {
      const on = currentValue(control.dataset.auiSetting) === control.value;
      if (control.matches("input")) {
        control.checked = on;
      } else {
        control.classList.toggle("active", on);
        if (on) control.setAttribute("aria-current", "true");
        else control.removeAttribute("aria-current");
      }
    });
    const collapsed = String(root.hasAttribute(attrName("sidebar-collapsed")));
    document.querySelectorAll('[data-aui-toggle="sidebar"]').forEach((button) => button.setAttribute("aria-pressed", collapsed));
  }

  function setSetting(key, value, store = true) {
    if (store) {
      const settings = readSettings();
      settings[key] = value === DEFAULTS[key] ? undefined : value;
      writeSettings(settings);
    }
    if (key === "theme") {
      applyTheme(value);
      return;
    }
    const update = () => {
      if (value) {
        root.setAttribute(attrName(key), value);
      } else {
        root.removeAttribute(attrName(key));
      }
      if (key === "mode") {
        applyMode();
        notify();
      }
      syncControls();
    };
    if (key === "mode") {
      smoothly(update);
    } else {
      update();
    }
  }

  // Renders Lucide icons and initialises Bootstrap components that need it.
  // Page scripts call ArchitectUI.refresh() after adding markup.
  function refresh(scope = document) {
    window.lucide?.createIcons();
    const { Tooltip, Popover } = window.bootstrap ?? {};
    scope.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => Tooltip?.getOrCreateInstance(el));
    scope.querySelectorAll('[data-bs-toggle="popover"]').forEach((el) => Popover?.getOrCreateInstance(el));
  }

  // File drop zone: data-aui-dropzone="#list" on the area; the chosen files appear in the list
  function listFiles(zone, files) {
    const list = document.querySelector(zone.dataset.auiDropzone);
    if (!list) return;
    const size = (bytes) => (bytes < 1048576 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1048576).toFixed(1)} MB`);
    list.replaceChildren(...[...files].map((file) => {
      const item = document.createElement("li");
      item.className = "list-group-item d-flex align-items-center gap-2";
      const icon = document.createElement("i");
      icon.dataset.lucide = file.type.startsWith("image/") ? "image" : "file";
      const name = Object.assign(document.createElement("span"), { className: "text-truncate", textContent: file.name });
      const note = Object.assign(document.createElement("span"), { className: "ms-auto small text-body-secondary text-nowrap", textContent: size(file.size) });
      item.append(icon, name, note);
      return item;
    }));
    refresh(list);
  }

  ["dragenter", "dragover"].forEach((type) => document.addEventListener(type, (event) => {
    event.target.closest?.("[data-aui-dropzone]")?.classList.add("is-dragover");
  }));
  ["dragleave", "drop"].forEach((type) => document.addEventListener(type, (event) => {
    event.target.closest?.("[data-aui-dropzone]")?.classList.remove("is-dragover");
  }));

  document.addEventListener("change", (event) => {
    const input = event.target.closest("[data-aui-setting]");
    if (input) {
      const value = input.type === "checkbox" ? (input.checked ? input.value : input.dataset.auiOff) : input.value;
      setSetting(input.dataset.auiSetting, value ?? "");
    }
    const zone = event.target.closest("[data-aui-dropzone]");
    if (zone && event.target.type === "file") listFiles(zone, event.target.files);
  });

  document.addEventListener("click", (event) => {
    const option = event.target.closest("button[data-aui-setting]");
    if (option) setSetting(option.dataset.auiSetting, option.value);
    const target = event.target.closest("[data-aui-toggle], [data-aui-reset], [data-aui-expand-toggle], [data-aui-expand-close], [data-aui-toast]");
    const field = target?.closest("[data-aui-expand]");
    if (target?.matches('[data-aui-toggle="sidebar"]')) {
      setSetting("sidebar-collapsed", root.hasAttribute(attrName("sidebar-collapsed")) ? "" : "true");
    } else if (target?.matches('[data-aui-toggle="mode"]')) {
      setSetting("mode", root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark");
    } else if (target?.matches("[data-aui-reset]")) {
      writeSettings({});
      Object.entries(DEFAULTS).forEach(([key, value]) => setSetting(key, value, false));
    } else if (target?.matches("[data-aui-expand-toggle], [data-aui-expand-close]")) {
      const open = field.classList.toggle("is-open", target.matches("[data-aui-expand-toggle]"));
      if (open) field.querySelector("input")?.focus({ preventScroll: true });
    } else if (target?.matches("[data-aui-toast]")) {
      const toast = document.querySelector(target.dataset.auiToast);
      if (toast) window.bootstrap?.Toast.getOrCreateInstance(toast).show();
    }
  });

  // A tab pane that Bootstrap shows fades in (.aui-tab-in). The pane active on load has no class:
  // it appears with the page content. The class stays, so every next show runs the animation again.
  document.addEventListener("show.bs.tab", (event) => {
    const selector = event.target.getAttribute("data-bs-target") || event.target.getAttribute("href");
    if (selector?.startsWith("#")) document.querySelector(selector)?.classList.add("aui-tab-in");
  });

  // During the page animation the content is the frame of position: fixed children. A modal or an offcanvas
  // opened in that time ends the animation first, so it takes the whole window.
  ["show.bs.modal", "show.bs.offcanvas"].forEach((type) => document.addEventListener(type, () => {
    document.querySelector(".aui-content")?.getAnimations().forEach((animation) => animation.finish());
  }));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") document.querySelectorAll("[data-aui-expand].is-open").forEach((el) => el.classList.remove("is-open"));
  });

  // Offcanvas does not set aria-expanded on its toggle; the burger animation relies on it
  ["show.bs.offcanvas", "hide.bs.offcanvas"].forEach((type) => document.addEventListener(type, (event) => {
    document.querySelectorAll(`[data-bs-target="#${event.target.id}"][aria-expanded]`)
      .forEach((button) => button.setAttribute("aria-expanded", String(type.startsWith("show"))));
  }));

  systemDark.addEventListener("change", () => {
    if (currentValue("mode") === "system") setSetting("mode", "system", false);
  });

  window.ArchitectUI = Object.freeze({ refresh });
  refresh();
  syncControls();
})();
