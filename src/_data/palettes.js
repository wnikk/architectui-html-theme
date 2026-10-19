// Palettes of all themes for the Theme Palettes page. In the browser only one theme is active at a time, so the
// values are collected at build: Sass compiles the core and each theme, and the custom properties that reach <html>
// are resolved with the cascade (selector match, specificity, order) for the light and the dark mode.
// var() inside a theme is expanded; color-mix() and gradients stay CSS that the browser draws.

import * as sass from "sass";
import { readFileSync } from "node:fs";

const themes = JSON.parse(readFileSync(new URL("./themes.json", import.meta.url), "utf8"));

// Colors shown on the page: group, label, custom property, a class that uses it
const tokens = [
  ["Brand", "Primary", "--bs-primary", "bg-primary"],
  ["Brand", "Primary subtle", "--bs-primary-bg-subtle", "bg-primary-subtle"],
  ["Brand", "Primary emphasis", "--bs-primary-text-emphasis", "text-primary-emphasis"],
  ["Brand", "Link", "--bs-link-color", "link-primary"],
  ["Brand", "Alternate", "--bs-alternate", "bg-alternate"],
  ["Status", "Secondary", "--bs-secondary", "bg-secondary"],
  ["Status", "Success", "--bs-success", "bg-success"],
  ["Status", "Info", "--bs-info", "bg-info"],
  ["Status", "Warning", "--bs-warning", "bg-warning"],
  ["Status", "Danger", "--bs-danger", "bg-danger"],
  ["Status", "Light", "--bs-light", "bg-light"],
  ["Status", "Dark", "--bs-dark", "bg-dark"],
  ["Status", "Focus", "--bs-focus", "bg-focus"],
  ["Status", "Tertiary", "--bs-tertiary", "bg-tertiary"],
  ["Surfaces", "Page", "--aui-app-bg", ""],
  ["Surfaces", "Surface", "--aui-surface", "bg-body"],
  ["Surfaces", "Secondary surface", "--bs-secondary-bg", "bg-body-secondary"],
  ["Surfaces", "Tertiary surface", "--bs-tertiary-bg", "bg-body-tertiary"],
  ["Surfaces", "Border", "--bs-border-color", "border"],
  ["Text", "Body text", "--bs-body-color", "text-body"],
  ["Text", "Secondary text", "--bs-secondary-color", "text-body-secondary"],
  ["Text", "Tertiary text", "--bs-tertiary-color", "text-body-tertiary"],
  ["Gradients", "Primary", "--aui-gradient-primary", "bg-primary"],
  ["Gradients", "Success", "--aui-gradient-success", "bg-success"],
  ["Gradients", "Info", "--aui-gradient-info", "bg-info"],
  ["Gradients", "Warning", "--aui-gradient-warning", "bg-warning"],
  ["Gradients", "Danger", "--aui-gradient-danger", "bg-danger"],
  ["Gradients", "Dark", "--aui-gradient-dark", "bg-dark"],
].map(([group, label, name, cls]) => ({ group, label, name, cls, gradient: name.startsWith("--aui-gradient") }));

// Bootstrap 5.3 values that a theme may leave as they are (Bootstrap CSS comes from the CDN, not from the sources)
const bootstrap = {
  light: {
    "--bs-body-color": "#212529", "--bs-body-bg": "#fff", "--bs-secondary-color": "rgba(33, 37, 41, .75)",
    "--bs-tertiary-color": "rgba(33, 37, 41, .5)", "--bs-secondary-bg": "#e9ecef", "--bs-tertiary-bg": "#f8f9fa",
    "--bs-border-color": "#dee2e6", "--bs-link-color": "#0d6efd", "--bs-primary-bg-subtle": "#cfe2ff",
    "--bs-primary-text-emphasis": "#052c65", "--bs-light": "#f8f9fa", "--bs-dark": "#212529",
  },
  dark: {
    "--bs-body-color": "#dee2e6", "--bs-body-bg": "#212529", "--bs-secondary-color": "rgba(222, 226, 230, .75)",
    "--bs-tertiary-color": "rgba(222, 226, 230, .5)", "--bs-secondary-bg": "#343a40", "--bs-tertiary-bg": "#2b3035",
    "--bs-border-color": "#495057", "--bs-link-color": "#6ea8fe", "--bs-primary-bg-subtle": "#031633",
    "--bs-primary-text-emphasis": "#6ea8fe", "--bs-light": "#f8f9fa", "--bs-dark": "#212529",
  },
};

// Rules with custom properties, in source order: { selector, declarations: [[name, value]] }
function rules(css) {
  const list = [];
  const plain = css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/@media[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, "");
  for (const m of plain.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const declarations = [...m[2].matchAll(/(--[\w-]+)\s*:\s*([^;]+?)\s*(?:;|$)/g)].map((d) => [d[1], d[2]]);
    if (declarations.length) list.push({ selector: m[1].trim(), declarations });
  }
  return list;
}

// Split by commas outside parentheses
const splitList = (text) => {
  const parts = [];
  let depth = 0, start = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "(") depth++;
    else if (text[i] === ")") depth--;
    else if (text[i] === "," && depth === 0) { parts.push(text.slice(start, i).trim()); start = i + 1; }
  }
  parts.push(text.slice(start).trim());
  return parts;
};

// Does a compound selector match <html> with these attributes? Returns its specificity [a, b, c] or null.
// Descendant parts never match the root; attributes not in `attrs` are absent.
function match(selector, attrs) {
  let rest = selector.trim();
  let outer = rest;
  while (/\([^()]*\)/.test(outer)) outer = outer.replace(/\([^()]*\)/g, "");
  if (/[\s>+~]/.test(outer)) return null;
  const spec = [0, 0, 0];
  while (rest) {
    let m;
    if ((m = rest.match(/^:root/))) spec[1]++;
    else if ((m = rest.match(/^html/))) spec[2]++;
    else if ((m = rest.match(/^\[([\w-]+)(?:=["']?([^\]"']*)["']?)?\]/))) {
      const value = attrs[m[1]];
      if (value === undefined || (m[2] !== undefined && value !== m[2])) return null;
      spec[1]++;
    } else if ((m = rest.match(/^:(where|is|not)\(/))) {
      let depth = 1, i = m[0].length;
      for (; depth && i < rest.length; i++) depth += rest[i] === "(" ? 1 : rest[i] === ")" ? -1 : 0;
      const inner = splitList(rest.slice(m[0].length, i - 1)).map((part) => match(part, attrs));
      const hits = inner.filter(Boolean);
      if (m[1] === "not") {
        if (hits.length) return null;
      } else if (!hits.length) return null;
      if (m[1] !== "where") {
        const all = m[1] === "not" ? splitList(rest.slice(m[0].length, i - 1)).map((part) => specOf(part)) : hits;
        const top = all.reduce((a, b) => (compare(a, b) >= 0 ? a : b), [0, 0, 0]);
        spec[0] += top[0]; spec[1] += top[1]; spec[2] += top[2];
      }
      rest = rest.slice(i);
      continue;
    } else return null;
    rest = rest.slice(m[0].length);
  }
  return spec;
}

// Specificity of a selector regardless of the match (for the arguments of :not)
const specOf = (selector) => match(selector, new Proxy({}, { get: () => "" })) ?? [0, 1, 0];
const compare = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

function resolve(map, value, seen = new Set()) {
  return value.replace(/var\((--[\w-]+)(?:\s*,\s*([^()]*(?:\([^()]*\))*[^()]*))?\)/g, (all, name, fallback) => {
    if (seen.has(name)) return all;
    const next = map[name] ?? fallback;
    return next === undefined ? all : resolve(map, next, new Set([...seen, name]));
  });
}

const compile = (file) => sass.compile(file, { loadPaths: ["src/scss"], style: "expanded" }).css;
const core = rules(compile("src/scss/architectui.scss"));
const unresolved = [];

function palette(theme, mode, themeRules) {
  const attrs = { "data-bs-theme": mode };
  if (theme.id) attrs["data-aui-theme"] = theme.id;
  const won = {};
  [...core, ...themeRules].forEach((rule, order) => {
    const specs = splitList(rule.selector).map((part) => match(part, attrs)).filter(Boolean);
    if (!specs.length) return;
    const spec = specs.reduce((a, b) => (compare(a, b) >= 0 ? a : b));
    for (const [name, value] of rule.declarations) {
      const prev = won[name];
      if (!prev || compare(spec, prev.spec) > 0 || (compare(spec, prev.spec) === 0 && order >= prev.order)) {
        won[name] = { value, spec, order };
      }
    }
  });
  const map = { ...bootstrap[mode], ...Object.fromEntries(Object.entries(won).map(([k, v]) => [k, v.value])) };
  const values = {};
  for (const token of tokens) {
    const value = map[token.name] === undefined ? undefined : resolve(map, map[token.name]);
    if (value === undefined || value.includes("var(")) unresolved.push(`${theme.name || "Business"} ${mode} ${token.name}: ${value}`);
    values[token.name] = value ?? "";
  }
  return values;
}

const list = themes.map((theme) => {
  const themeRules = theme.id ? rules(compile(`src/scss/themes/${theme.id}.scss`)) : [];
  return { ...theme, light: palette(theme, "light", themeRules), dark: palette(theme, "dark", themeRules) };
});

if (unresolved.length) console.warn(`[palettes] values without a color:\n  ${unresolved.join("\n  ")}`);

export default { tokens, groups: [...new Set(tokens.map((t) => t.group))], themes: list };
