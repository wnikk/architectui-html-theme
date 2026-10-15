// ArchitectUI — модуль темы. Поведение каркаса поверх Bootstrap 5, без зависимостей.
// Настройки хранятся в localStorage под ключом "architectui" и применяются атрибутами data-aui-* на <html>.
// Встроенный скрипт в <head> применяет их до отрисовки, этот модуль — меняет и сохраняет.

const root = document.documentElement;
const STORAGE_KEY = "architectui";
const systemDark = matchMedia("(prefers-color-scheme: dark)");

const DEFAULTS = {
  header: "fixed", sidebar: "fixed", footer: "static", tabs: "shadow", mode: "light", theme: "",
  "header-scheme": "", "sidebar-scheme": "", "sidebar-collapsed": "",
};

const attrName = (key) => `data-aui-${key}`;
const currentValue = (key) => root.getAttribute(attrName(key)) || DEFAULTS[key];
const notify = () => document.dispatchEvent(new CustomEvent("aui:theme-change", { detail: { theme: currentValue("theme") } }));

function readSettings() {
  try {
    const settings = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    if (settings.theme === "light" || settings.theme === "dark") {
      [settings.mode, settings.theme] = [settings.theme, undefined]; // настройка версии 5.0
    }
    return settings;
  } catch {
    return {};
  }
}

function writeSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Хранилище недоступно (приватный режим): настройка действует до перезагрузки страницы
  }
}

// Режим light/dark/system -> data-bs-theme. Тема «только тёмная» всегда тёмная.
function applyMode() {
  const theme = currentValue("theme");
  const darkOnly = theme && (root.dataset.auiDarkOnly || "").split(" ").includes(theme);
  const mode = currentValue("mode");
  const dark = darkOnly || mode === "dark" || (mode === "system" && systemDark.matches);
  root.setAttribute("data-bs-theme", dark ? "dark" : "light");
}

// Тема — отдельный файл CSS рядом с architectui.css: themes/<имя>.css.
// Новая ссылка подключается до удаления старой, поэтому смена идёт без вспышки.
function applyTheme(theme) {
  const current = document.getElementById("aui-theme");
  const done = () => (applyMode(), notify());
  if (!/^[a-z0-9-]+$/.test(theme)) {
    current?.remove();
    return done();
  }
  const base = document.querySelector('link[href$="architectui.css"]');
  const link = Object.assign(document.createElement("link"), {
    rel: "stylesheet",
    href: base.getAttribute("href").replace(/architectui\.css$/, `themes/${theme}.css`),
  });
  link.addEventListener("load", () => {
    current?.remove();
    link.id = "aui-theme";
    done();
  }, { once: true });
  (current ?? base).after(link);
}

function syncControls() {
  document.querySelectorAll("[data-aui-setting]").forEach((input) => {
    input.checked = currentValue(input.dataset.auiSetting) === input.value;
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
  if (value) {
    root.setAttribute(attrName(key), value);
  } else {
    root.removeAttribute(attrName(key));
  }
  if (key === "theme") {
    applyTheme(value);
  } else if (key === "mode") {
    applyMode();
    notify();
  }
  syncControls();
}

// Иконки Lucide и компоненты Bootstrap, которым нужна инициализация. Модули страниц вызывают
// refresh() после того, как добавили разметку.
export function refresh(scope = document) {
  window.lucide?.createIcons();
  const { Tooltip, Popover } = window.bootstrap ?? {};
  scope.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => Tooltip?.getOrCreateInstance(el));
  scope.querySelectorAll('[data-bs-toggle="popover"]').forEach((el) => Popover?.getOrCreateInstance(el));
}

document.addEventListener("change", (event) => {
  const input = event.target.closest("[data-aui-setting]");
  if (input) {
    const value = input.type === "checkbox" ? (input.checked ? input.value : input.dataset.auiOff) : input.value;
    setSetting(input.dataset.auiSetting, value ?? "");
  }
});

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-aui-toggle], [data-aui-reset], [data-aui-search-toggle], [data-aui-search-close], [data-aui-toast]");
  const search = target?.closest("[data-aui-search]");
  if (target?.matches('[data-aui-toggle="sidebar"]')) {
    setSetting("sidebar-collapsed", root.hasAttribute(attrName("sidebar-collapsed")) ? "" : "true");
  } else if (target?.matches('[data-aui-toggle="mode"]')) {
    setSetting("mode", root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark");
  } else if (target?.matches("[data-aui-reset]")) {
    writeSettings({});
    Object.entries(DEFAULTS).forEach(([key, value]) => setSetting(key, value, false));
  } else if (target?.matches("[data-aui-search-toggle], [data-aui-search-close]")) {
    const open = search.classList.toggle("is-open", target.matches("[data-aui-search-toggle]"));
    if (open) search.querySelector("input")?.focus();
  } else if (target?.matches("[data-aui-toast]")) {
    const toast = document.querySelector(target.dataset.auiToast);
    if (toast) window.bootstrap?.Toast.getOrCreateInstance(toast).show();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") document.querySelectorAll("[data-aui-search].is-open").forEach((el) => el.classList.remove("is-open"));
});

// Offcanvas не ставит aria-expanded на кнопку, а по нему анимируется бургер
["show.bs.offcanvas", "hide.bs.offcanvas"].forEach((type) => document.addEventListener(type, (event) => {
  document.querySelectorAll(`[data-bs-target="#${event.target.id}"][aria-expanded]`)
    .forEach((button) => button.setAttribute("aria-expanded", String(type.startsWith("show"))));
}));

systemDark.addEventListener("change", () => {
  if (currentValue("mode") === "system") setSetting("mode", "system", false);
});

refresh();
syncControls();
