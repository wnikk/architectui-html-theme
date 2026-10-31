// Palettes of all themes for the Theme Palettes page. In the browser only one theme is active at a time, so the
// values are collected at build: Sass compiles the core and each theme, and the custom properties that reach <html>
// are resolved with the cascade (selector match, specificity, order) for the light and the dark mode.
// var() inside a theme is expanded; color-mix() and gradients stay CSS that the browser draws.

import * as sass from "sass";
import { readFileSync } from "node:fs";

const themes = JSON.parse(readFileSync(new URL("./themes.json", import.meta.url), "utf8"));

// Colors shown on the page: group, label, custom property, a class that uses it. A solid color is bg-<color> with
// fg-contrast-<color>: in the theme bg-<color> paints the gradient over the color.
const tokens = [
  ["Brand", "Primary", "--bs-primary-base", "bg-primary fg-contrast-primary"],
  ["Brand", "Primary subtle", "--bs-primary-bg-subtle", "bg-subtle-primary"],
  ["Brand", "Primary text", "--bs-primary-fg", "fg-primary"],
  ["Brand", "Primary emphasis", "--bs-primary-fg-emphasis", "fg-emphasis-primary"],
  ["Brand", "Link", "--bs-link-color", ""],
  ["Brand", "Accent", "--bs-accent-base", "bg-accent fg-contrast-accent"],
  ["Status", "Secondary", "--bs-secondary-base", "bg-secondary fg-contrast-secondary"],
  ["Status", "Success", "--bs-success-base", "bg-success fg-contrast-success"],
  ["Status", "Info", "--bs-info-base", "bg-info fg-contrast-info"],
  ["Status", "Warning", "--bs-warning-base", "bg-warning fg-contrast-warning"],
  ["Status", "Danger", "--bs-danger-base", "bg-danger fg-contrast-danger"],
  ["Status", "Inverse", "--bs-inverse-base", "bg-inverse fg-contrast-inverse"],
  ["Status", "Focus", "--bs-focus-base", "bg-focus fg-contrast-focus"],
  ["Surfaces", "Page", "--aui-app-bg", ""],
  ["Surfaces", "Surface", "--bs-bg-body", "bg-body"],
  ["Surfaces", "Surface 1", "--bs-bg-1", "bg-1"],
  ["Surfaces", "Surface 2", "--bs-bg-2", "bg-2"],
  ["Surfaces", "Surface 3", "--bs-bg-3", "bg-3"],
  ["Surfaces", "Border", "--bs-border-color", "border"],
  ["Text", "Body text", "--bs-fg-body", "fg-body"],
  ["Text", "Text 1", "--bs-fg-1", "fg-1"],
  ["Text", "Text 2", "--bs-fg-2", "fg-2"],
  ["Text", "Text 3", "--bs-fg-3", "fg-3"],
  ["Gradients", "Primary", "--aui-gradient-primary", "bg-primary"],
  ["Gradients", "Success", "--aui-gradient-success", "bg-success"],
  ["Gradients", "Info", "--aui-gradient-info", "bg-info"],
  ["Gradients", "Warning", "--aui-gradient-warning", "bg-warning"],
  ["Gradients", "Danger", "--aui-gradient-danger", "bg-danger"],
  ["Gradients", "Inverse", "--aui-gradient-inverse", "bg-inverse"],
].map(([group, label, name, cls]) => ({ group, label, name, cls, gradient: name.startsWith("--aui-gradient") }));

// Bootstrap 6 values that a theme may leave as they are (Bootstrap CSS comes from the CDN, not from the sources)
const bootstrap = {
  light: { "--bs-bg-body": "#fff", "--bs-fg-body": "#212529", "--bs-border-color": "#dee2e6", "--bs-link-color": "#0d6efd" },
  dark: { "--bs-bg-body": "#111", "--bs-fg-body": "#f8f9fa", "--bs-border-color": "#495057", "--bs-link-color": "#6ea8fe" },
};

// Bootstrap 6 writes both modes in one value: light-dark(light, dark). Keep the value of one mode.
function pickMode(value, mode) {
  let out = value;
  for (;;) {
    const i = out.indexOf("light-dark(");
    if (i < 0) return out;
    let depth = 0, j = i + 10, comma = -1;
    for (; j < out.length; j++) {
      if (out[j] === "(") depth++;
      else if (out[j] === ")") { depth--; if (depth === 0) break; }
      else if (out[j] === "," && depth === 1 && comma < 0) comma = j;
    }
    const light = out.slice(i + 11, comma).trim();
    const dark = out.slice(comma + 1, j).trim();
    out = out.slice(0, i) + (mode === "dark" ? dark : light) + out.slice(j + 1);
  }
}

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

// Only the token blocks matter here; the component rules in @layer custom carry no tokens
const compile = (file) => sass.compile(file, { loadPaths: ["src/scss"], style: "expanded" }).css.replace(/@layer custom \{[\s\S]*?\n\}\n/g, "");
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
    const value = map[token.name] === undefined ? undefined : pickMode(resolve(map, map[token.name]), mode);
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
