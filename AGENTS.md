# AGENTS.md

Guide for coding agents that change this repository. To *use* the theme in another project, read `llms-full.txt` instead.

## Project

ArchitectUI 5 is a Bootstrap 5.3 admin theme: `dist/architectui.css`, `dist/architectui.js`, optional `dist/themes/*.css`, and 26 demo pages. Bootstrap and Lucide load from a CDN; the theme never rebuilds Bootstrap. The demo is built with Eleventy 3 (pages) and the Sass CLI (styles). These are the only two dev dependencies.

## Commands

Node 22 or newer.

```bash
npm install
npm run dev     # serve the demo at http://localhost:8080, rebuild on change
npm run build   # clean dist/ and build pages and styles
```

`dist/` is committed. Run `npm run build` after every source change and commit `src/` and `dist/` together. Never edit files in `dist/` by hand.

## Layout

| Path | Contents |
|------|----------|
| `src/scss/architectui.scss` | Entry point. Order: tokens, base, frame, ui, utilities, then `_business.scss` |
| `src/scss/_config.scss` | Sass maps: colors, gradients, header and sidebar schemes, breakpoints |
| `src/scss/_tokens.scss` | Layout tokens and colors that themes do not set |
| `src/scss/_business.scss` | The default Business look, compiled into `architectui.css` with `$scoped: true` |
| `src/scss/frame/` | Header, sidebar, logo, search, page title, footer, settings panel, burger |
| `src/scss/ui/` | Buttons, cards, dropdowns, navs, elements, widgets, third-party containers |
| `src/scss/utilities/` | Color utilities, helpers, animations, icon colors |
| `src/scss/themes/_theme.scss` | Shared theme base: `tokens`, `palette`, `base` mixins and the optional scope |
| `src/scss/themes/<id>.scss` | One visual theme each; compiled to `dist/themes/<id>.css` |
| `src/js/architectui.js` | Theme script (classic script, IIFE, one global `window.ArchitectUI`) |
| `src/pages/*.html` | Demo pages with front matter; `src/pages/*.js` page scripts |
| `src/_includes/` | Layout `base.njk` and frame partials (Nunjucks) |
| `src/_data/` | `menu.json`, `themes.json`, `cdn.json`, Lucide icon list, `pkg.js` |
| `eleventy.config.js` | Page build, passthrough copies, dev server |

Folders that start with `_` (for example `_old`) are local and ignored by git. Do not put project files there.

## Page front matter

| Key | Meaning |
|-----|---------|
| `title`, `description` | Page title and subtitle (required) |
| `icon`, `iconClass` | Lucide icon of the page title and its class (default `aui-icon-gradient-primary`) |
| `styles` | Keys from `cdn.styles`: library CSS for this page |
| `scripts` | Keys from `cdn.scripts`: library scripts for this page (UMD bundles) |
| `script` | Page script from `src/pages/`, loaded with `defer` |

## Conventions

- Markup is Bootstrap 5.3. No Bootstrap 4 attributes or classes (`data-toggle`, `ml-*`, `custom-control`, `form-group`, inputs inside labels).
- Theme classes use the `aui-` prefix with BEM-style parts (`aui-widget__heading`). Layout modes are `data-aui-*` attributes on `<html>`.
- Every color, size, radius and shadow is a CSS variable. Components read `--aui-*` and `--bs-*`; do not hard-code colors in component rules.
- Business rules must stay scoped (`:where(:root:not([data-aui-theme]))`), so that a selected theme turns them off. Use the `t.scope` mixin and `t.$root`, `t.$light`, `t.$dark` from `_theme.scss`.
- A new visual theme is one file in `src/scss/themes/` plus an entry in `src/_data/themes.json`. Tokens every theme must set are listed by the `tokens` mixin; colors themes set themselves are `$aui-theme-colors`.
- `src/js/architectui.js` stays a dependency-free classic script wrapped in an IIFE, at most 150 lines. Page scripts are IIFEs too and read libraries from `window`.
- All URLs in pages are relative; all scripts are classic `defer` scripts. The built demo must open from disk (`file://`).
- Comments are in English and describe only the code next to them: no task numbers, no history, no references to local notes.
- Icons are Lucide (`<i data-lucide="name">`). After inserting markup, call `ArchitectUI.refresh(element)`.

## Check before you finish

1. `npm run build` prints no errors or Sass warnings.
2. Open the changed pages in a browser (`npm run dev`, or open `dist/*.html` from disk) and check:
   - the browser console has no errors;
   - light and dark mode;
   - the Business look and at least the Orange theme;
   - widths 375, 1024 and 1366 px.
3. For a theme change, verify that other themes look as before: they must not depend on Business rules.

## Release

1. Change the version in `package.json`, in `package-lock.json` (the top two entries) and in the banner of `src/scss/architectui.scss`.
2. Add an entry to `Changelog.md` (Changed / Fixed).
3. Run `npm run build`.

The banner in the pages takes the version from `package.json`.
