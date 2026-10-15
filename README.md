# ArchitectUI Bootstrap 5 HTML Theme

ArchitectUI is a clean, responsive admin dashboard theme. Version 5 is a thin layer on top of Bootstrap 5.3:
one stylesheet and one dependency-free ES module. Bootstrap and the icons come from a CDN, so any markup written
for Bootstrap 5 works inside the theme without changes, and you never rebuild Bootstrap.

![ArchitectUI Bootstrap 5](https://github.com/wnikk/architectui-html-theme/blob/master/dist/assets/images/architectui-bootstrap-5-preview.png)

## What you get

- `dist/architectui.css` — the theme: layout, components, colors and dark mode, all driven by CSS variables.
- `dist/architectui.js` — the theme behavior: collapsible sidebar, settings panel, theme and mode switching, header search, icon rendering.
- `dist/themes/*.css` — nine optional visual themes, loaded on top of `architectui.css`.
- `dist/*.html` — 26 demo pages: dashboards, elements, components, forms, tables, charts, calendar and maps.
- No jQuery, no build step for your app. Icons are [Lucide](https://lucide.dev).

## Quick start

Copy `dist/architectui.css`, `dist/architectui.js`, `dist/themes/` and `dist/assets/` to your project, then add to `<head>`:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="architectui.css">
<script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/lucide@1.49.0/dist/umd/lucide.min.js"></script>
<script type="module" src="architectui.js"></script>
```

Use any demo page in `dist/` as the starting point for the frame markup: header, sidebar, page title and footer.

## Icons

Write an element with the icon name. The theme module turns it into an inline SVG:

```html
<i data-lucide="rocket"></i>
```

Icons take the text color and scale with the font size. `aui-icon-gradient-<color>` strokes an icon with a theme gradient.
The Icons demo page lists every icon with search and copy on click.

## Logo

Replace the files, nothing else:

- `assets/images/logo.png` — logo for light backgrounds;
- `assets/images/logo-on-dark.png` — logo for dark backgrounds (dark theme, dark header colors).

Wide and square logos both fit automatically. The maximum height is the `--aui-logo-max-height` variable (2.25rem).

## Themes

Besides the classic look, the theme ships nine visual themes. A theme is one extra stylesheet loaded after
`architectui.css`; it changes palette, typography, radii, shadows and table density, not the markup.

| Theme | File | Character |
|-------|------|-----------|
| Indigo | `themes/indigo.css` | Neutral business palette |
| Indigo Photo | `themes/indigo-img.css` | Indigo with a subtle photo behind the content |
| Coffee | `themes/coffee.css` | Warm browns on neutral surfaces |
| Garden | `themes/green.css` | Calm green, serif headings, airy rows for long reading |
| Warm | `themes/raspberry.css` | Berry accent, pill buttons, rounder corners |
| Business | `themes/blue.css` | Dense, smaller type, lines instead of shadows |
| Operations | `themes/teal.css` | Zebra tables, monospace numbers |
| Space | `themes/violet.css` | Large radii, soft violet shadows, heavy headings |
| Cyberpunk | `themes/cyberpunk.css` | Neon on black, monospace; dark only |

Pick a theme and a mode (Light, Dark, System) in the settings panel, or toggle light/dark with the header button.
The choice is stored in `localStorage` and applied before the first paint. To ship a fixed theme without the panel,
add the stylesheet yourself:

```html
<link rel="stylesheet" href="architectui.css">
<link rel="stylesheet" href="themes/coffee.css">
```

Theme sources live in `src/scss/themes/`. A new theme is one file: its palette for both modes plus optional rhythm
rules; the shared base-theme rules come from `_theme.scss`. Add it to `src/_data/themes.json` to list it in the panel.

## Layout options

Layout modes are attributes on `<html>`. The settings panel (cog button) changes them and remembers the choice in `localStorage`.

| Attribute | Values | Default |
|-----------|--------|---------|
| `data-aui-header` | `fixed`, `static` | `fixed` |
| `data-aui-sidebar` | `fixed`, `static` | `fixed` |
| `data-aui-footer` | `fixed`, `static` | `static` |
| `data-aui-sidebar-collapsed` | present or absent | absent |
| `data-aui-tabs` | `shadow`, `line` | `shadow` |
| `data-aui-header-scheme`, `data-aui-sidebar-scheme` | `primary`, `secondary`, `success`, `info`, `warning`, `danger`, `light`, `dark`, `focus`, `alternate` | none |
| `data-aui-mode` | `light`, `dark`, `system` | `light` |
| `data-aui-theme` | theme id from the table above, or none for the classic look | none |
| `data-bs-theme` | `light`, `dark` — set by the theme script from the mode | `light` |

The sidebar is full width from 1250 px, an icon rail from 768 px (it expands on hover) and an off-canvas panel below 768 px.

## Theme colors

All colors are CSS variables. Override them after `architectui.css`, no rebuild needed:

```css
:root {
  --bs-primary: #3f6ad8;
  --bs-primary-rgb: 63, 106, 216;
}
```

The theme adds `focus`, `alternate` and `tertiary` to the Bootstrap color set (`btn-focus`, `bg-alternate`, `text-focus` and so on).

## Development

Requires Node 22 or newer.

```bash
npm install
npm run dev
```

`npm run dev` serves the demo at http://localhost:8080 and rebuilds pages and styles on change. `npm run build` writes the release into `dist/`.

| Path | Purpose |
|------|---------|
| `src/pages/*.html` | Demo pages. Front matter holds the title, description and icon. |
| `src/pages/*.js` | Scripts of individual pages (charts, calendar, maps, notifications, icons, validation). |
| `src/_includes/` | The page layout and frame partials (Eleventy + Nunjucks). |
| `src/_data/menu.json` | Sidebar menu. |
| `src/_data/cdn.json` | Every external URL and the import map. Point them to a local `vendor/` folder to work offline. |
| `src/scss/` | Theme styles. `architectui.scss` is the entry point. |
| `src/js/architectui.js` | Theme module. |

The demo pages are built with [Eleventy 3](https://www.11ty.dev), the styles with [Sass](https://sass-lang.com). These are the only two dependencies.

The Maps page uses public OpenStreetMap tiles. They are fine for a demo; use your own tile server or a tile provider in production.

## License

MIT, see [LICENSE](LICENSE).

## Authors

Forked from [DashboardPack ArchitectUI HTML Theme Free](https://github.com/DashboardPack/architectui-html-theme-free) and maintained by the community.
