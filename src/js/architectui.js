// ArchitectUI — модуль темы. Поведение каркаса поверх Bootstrap 5, без зависимостей.
// Настройки хранятся в localStorage под ключом "architectui" и применяются атрибутами на <html>.
// Встроенный скрипт в <head> применяет их до отрисовки, этот модуль — обновляет и сохраняет.

const root = document.documentElement;
const STORAGE_KEY = "architectui";

const DEFAULTS = {
  header: "fixed",
  sidebar: "fixed",
  footer: "static",
  tabs: "shadow",
  theme: "light",
  "header-scheme": "",
  "sidebar-scheme": "",
  "sidebar-collapsed": "",
};

const attrName = (key) => (key === "theme" ? "data-bs-theme" : `data-aui-${key}`);
const currentValue = (key) => root.getAttribute(attrName(key)) || DEFAULTS[key];

function readSettings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
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

function applySetting(key, value) {
  if (value) {
    root.setAttribute(attrName(key), value);
  } else {
    root.removeAttribute(attrName(key));
  }
}

function syncControls() {
  document.querySelectorAll("[data-aui-setting]").forEach((input) => {
    input.checked = currentValue(input.dataset.auiSetting) === input.value;
  });

  const collapsed = String(root.hasAttribute(attrName("sidebar-collapsed")));
  document.querySelectorAll('[data-aui-toggle="sidebar"]').forEach((button) => {
    button.setAttribute("aria-pressed", collapsed);
  });
}

function setSetting(key, value) {
  const settings = readSettings();
  if (value === DEFAULTS[key]) {
    delete settings[key];
  } else {
    settings[key] = value;
  }
  writeSettings(settings);
  applySetting(key, value);
  syncControls();
}

function resetSettings() {
  writeSettings({});
  Object.entries(DEFAULTS).forEach(([key, value]) => applySetting(key, value));
  syncControls();
}

function toggleSearch(search, open) {
  search.classList.toggle("is-open", open);
  if (open) {
    search.querySelector("input")?.focus();
  }
}

// Иконки Lucide и компоненты Bootstrap, которым нужна инициализация. Модули страниц вызывают
// refresh() после того, как добавили разметку.
export function refresh(scope = document) {
  window.lucide?.createIcons();

  const { Tooltip, Popover } = window.bootstrap ?? {};
  if (Tooltip) {
    scope.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => Tooltip.getOrCreateInstance(el));
    scope.querySelectorAll('[data-bs-toggle="popover"]').forEach((el) => Popover.getOrCreateInstance(el));
  }
}

document.addEventListener("change", (event) => {
  const input = event.target.closest("[data-aui-setting]");
  if (!input) {
    return;
  }
  const value = input.type === "checkbox" ? (input.checked ? input.value : input.dataset.auiOff) : input.value;
  setSetting(input.dataset.auiSetting, value ?? "");
});

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-aui-toggle], [data-aui-reset], [data-aui-search-toggle], [data-aui-search-close], [data-aui-toast]");
  if (!target) {
    return;
  }

  if (target.matches('[data-aui-toggle="sidebar"]')) {
    setSetting("sidebar-collapsed", root.hasAttribute(attrName("sidebar-collapsed")) ? "" : "true");
  } else if (target.matches("[data-aui-reset]")) {
    resetSettings();
  } else if (target.matches("[data-aui-search-toggle]")) {
    toggleSearch(target.closest("[data-aui-search]"), true);
  } else if (target.matches("[data-aui-search-close]")) {
    toggleSearch(target.closest("[data-aui-search]"), false);
  } else if (target.matches("[data-aui-toast]")) {
    const toast = document.querySelector(target.dataset.auiToast);
    if (toast && window.bootstrap) {
      window.bootstrap.Toast.getOrCreateInstance(toast).show();
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.querySelectorAll("[data-aui-search].is-open").forEach((search) => toggleSearch(search, false));
  }
});

// Offcanvas не ставит aria-expanded на кнопку, а по нему анимируется бургер
["show.bs.offcanvas", "hide.bs.offcanvas"].forEach((type) => {
  document.addEventListener(type, (event) => {
    const expanded = String(type.startsWith("show"));
    document.querySelectorAll(`[data-bs-target="#${event.target.id}"][aria-expanded]`).forEach((button) => {
      button.setAttribute("aria-expanded", expanded);
    });
  });
});

refresh();
syncControls();
