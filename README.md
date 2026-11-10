# ArchitectUI — Bootstrap 5 Admin Dashboard Theme

[![Release](https://img.shields.io/github/v/release/wnikk/architectui-html-theme?label=release)](https://github.com/wnikk/architectui-html-theme/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Bootstrap 5.3](https://img.shields.io/badge/Bootstrap-5.3-7952b3)](https://getbootstrap.com)

ArchitectUI is a ready-made admin theme for Bootstrap 5.3. Write standard Bootstrap markup and get a finished
admin interface: a page frame, every Bootstrap component, a dark mode and ten visual themes.

**[Live demo](https://wnikk.github.io/architectui-html-theme/)** ·
[Download ZIP](https://github.com/wnikk/architectui-html-theme/archive/refs/heads/master.zip) ·
[Releases](https://github.com/wnikk/architectui-html-theme/releases) ·
[Changelog](Changelog.md)

![ArchitectUI dashboard in the default Business theme](docs/preview.png)

## Why ArchitectUI

| Advantage | What you get |
|-----------|--------------|
| **Standard Bootstrap markup** | Markup written for Bootstrap 5.3 works without changes. There is no second framework to learn. |
| **Two files** | One stylesheet and one script without dependencies. Bootstrap and the icons come from a CDN. |
| **No build step** | Copy the files and write HTML. Your project needs no jQuery, no bundler and no Node. |
| **Ten themes** | One extra stylesheet changes the look. Light, dark and system modes. |
| **48 demo pages** | Dashboards, forms, tables, charts, apps and sign-in pages. Copy the markup that you need. |
| **Ready for daily work** | Phones, wide monitors (1600 and 1920 px), a compact density and print styles. |
| **Ready for AI agents** | `AGENTS.md` and `docs/reference.md` tell a coding agent how to build pages with the theme. |

## Quick start

ArchitectUI is a template. Take your own copy and adapt it to your project.

1. Download the [ZIP of the `master` branch](https://github.com/wnikk/architectui-html-theme/archive/refs/heads/master.zip).
   For a fixed version, take the ZIP from the [Releases](https://github.com/wnikk/architectui-html-theme/releases) page.
2. Copy these items from `dist/` to your project: `architectui.css`, `architectui.js`, `themes/`, `assets/` and `LICENSE`.
3. Add these lines to the `<head>` of your page:

   ```html
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
   <link rel="stylesheet" href="architectui.css">
   <script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
   <script defer src="https://cdn.jsdelivr.net/npm/lucide@1.65.0/dist/umd/lucide.min.js"></script>
   <script defer src="architectui.js"></script>
   ```

4. Start from a demo page and replace its content with your Bootstrap markup:
   - `dist/pages-starter.html` — a page with the frame (header, sidebar, page title, footer);
   - `dist/pages-login.html` — a page without the frame. It loads `architectui-auth.js` instead of `architectui.js`; copy that file too.

All paths are relative. The pages work from any folder of a web server and from disk.

## Themes

`architectui.css` alone gives the default look, Business. A theme is one more stylesheet. It changes the colors,
type, radii and shadows. The markup stays the same.

![Nine optional themes of ArchitectUI](docs/preview-themes.png)

| Theme | Id | Look |
|-------|----|------|
| Business | default | Dense, small type, lines instead of shadows |
| Orange | `orange` | Orange accents, color gradients, soft shadows |
| Indigo | `indigo` | Indigo palette, floating header and sidebar, vivid gradients |
| Indigo Calathea | `indigo-img` | Indigo with a photo of leaves behind the content |
| Coffee | `coffee` | Warm browns, soft shadows, compact sizes |
| Garden | `green` | Calm green, serif headings, airy rows |
| Warm | `raspberry` | Berry accent, pill buttons, round corners |
| Operations | `teal` | Zebra tables, monospace numbers |
| Space | `violet` | Large radii, violet shadows, heavy headings |
| Cyberpunk | `cyberpunk` | Neon on black, monospace, dark only |

Users select a theme and a mode in the header. The browser keeps the selection.
To set one theme for all users, add its id and its stylesheet:

```html
<html data-aui-theme="coffee">
<link rel="stylesheet" href="architectui.css">
<link rel="stylesheet" href="themes/coffee.css">
```

## Demo pages

Each page is complete. Open it in the [live demo](https://wnikk.github.io/architectui-html-theme/) and copy its markup from `dist/`.

| Group | Pages |
|-------|-------|
| Dashboards | [Analytics](https://wnikk.github.io/architectui-html-theme/index.html) · [Operations Wall](https://wnikk.github.io/architectui-html-theme/dashboard-operations.html) · [Dashboard Boxes](https://wnikk.github.io/architectui-html-theme/dashboard-boxes.html) |
| Elements | [Buttons](https://wnikk.github.io/architectui-html-theme/elements-buttons-standard.html) · [Dropdowns](https://wnikk.github.io/architectui-html-theme/elements-dropdowns.html) · [Icons](https://wnikk.github.io/architectui-html-theme/elements-icons.html) · [Badges](https://wnikk.github.io/architectui-html-theme/elements-badges-labels.html) · [Cards](https://wnikk.github.io/architectui-html-theme/elements-cards.html) · [List Groups](https://wnikk.github.io/architectui-html-theme/elements-list-group.html) · [Navigation](https://wnikk.github.io/architectui-html-theme/elements-navigation.html) · [Utilities](https://wnikk.github.io/architectui-html-theme/elements-utilities.html) · [Theme Palettes](https://wnikk.github.io/architectui-html-theme/elements-palettes.html) |
| Components | [All Bootstrap components](https://wnikk.github.io/architectui-html-theme/components-bootstrap.html) · [Tabs](https://wnikk.github.io/architectui-html-theme/components-tabs.html) · [Accordions](https://wnikk.github.io/architectui-html-theme/components-accordions.html) · [Notifications](https://wnikk.github.io/architectui-html-theme/components-notifications.html) · [Modals](https://wnikk.github.io/architectui-html-theme/components-modals.html) · [Progress](https://wnikk.github.io/architectui-html-theme/components-progress-bar.html) · [Tooltips and Popovers](https://wnikk.github.io/architectui-html-theme/components-tooltips-popovers.html) · [Carousel](https://wnikk.github.io/architectui-html-theme/components-carousel.html) · [Calendar](https://wnikk.github.io/architectui-html-theme/components-calendar.html) · [Pagination](https://wnikk.github.io/architectui-html-theme/components-pagination.html) · [Scroll areas](https://wnikk.github.io/architectui-html-theme/components-scrollable-elements.html) · [Maps](https://wnikk.github.io/architectui-html-theme/components-maps.html) |
| Forms | [Controls](https://wnikk.github.io/architectui-html-theme/forms-controls.html) · [Layouts](https://wnikk.github.io/architectui-html-theme/forms-layouts.html) · [Validation](https://wnikk.github.io/architectui-html-theme/forms-validation.html) · [Wizard](https://wnikk.github.io/architectui-html-theme/forms-wizard.html) |
| Tables and charts | [Bootstrap tables](https://wnikk.github.io/architectui-html-theme/tables-regular.html) · [DataTables](https://wnikk.github.io/architectui-html-theme/tables-datatables.html) · [Chart.js](https://wnikk.github.io/architectui-html-theme/charts-chartjs.html) |
| Apps | [Kanban board](https://wnikk.github.io/architectui-html-theme/apps-kanban.html) · [Inbox](https://wnikk.github.io/architectui-html-theme/apps-inbox.html) · [Users](https://wnikk.github.io/architectui-html-theme/apps-users.html) · [Notifications](https://wnikk.github.io/architectui-html-theme/apps-notifications.html) |
| Pages | [Starter](https://wnikk.github.io/architectui-html-theme/pages-starter.html) · [Invoice](https://wnikk.github.io/architectui-html-theme/pages-invoice.html) · [Pricing](https://wnikk.github.io/architectui-html-theme/pages-pricing.html) · [Search](https://wnikk.github.io/architectui-html-theme/pages-search.html) · [Settings](https://wnikk.github.io/architectui-html-theme/pages-settings.html) · [Profile](https://wnikk.github.io/architectui-html-theme/pages-profile.html) |
| Sign-in and errors | [Sign in](https://wnikk.github.io/architectui-html-theme/pages-login.html) · [Sign up](https://wnikk.github.io/architectui-html-theme/pages-register.html) · [Password reset](https://wnikk.github.io/architectui-html-theme/pages-forgot-password.html) · [403](https://wnikk.github.io/architectui-html-theme/pages-403.html) · [404](https://wnikk.github.io/architectui-html-theme/pages-404.html) · [500](https://wnikk.github.io/architectui-html-theme/pages-500.html) · [Maintenance](https://wnikk.github.io/architectui-html-theme/pages-maintenance.html) |

## Customize

- **Colors, radii, shadows and sizes** are CSS variables. Change them in your own stylesheet after `architectui.css`:

  ```css
  :root {
    --bs-primary: #3f6ad8;
    --bs-primary-rgb: 63, 106, 216;
  }
  ```

  The [Theme Palettes](https://wnikk.github.io/architectui-html-theme/elements-palettes.html) page shows every color of every theme with its class and variable.
- **Layout** options are attributes on `<html>`. They set a fixed or static header, sidebar and footer, a collapsed sidebar,
  a compact density and the header and sidebar colors. Users change them on the [Profile](https://wnikk.github.io/architectui-html-theme/pages-profile.html#interface) page.
- **Icons** are [Lucide](https://lucide.dev): `<i data-lucide="rocket"></i>`. The [Icons](https://wnikk.github.io/architectui-html-theme/elements-icons.html) page has a search and copies a name on click.
- **Logo**: replace `assets/images/logo.svg` and `assets/images/logo-on-dark.svg`.

## Documentation

| Document | Content |
|----------|---------|
| [`docs/reference.md`](docs/reference.md) | The complete reference for people and AI agents: page template, frame markup, layout attributes, script API, themes, variables, component classes |
| [`AGENTS.md`](AGENTS.md) | A short guide for AI coding agents: files, steps to build a page, rules |
| [`llms.txt`](llms.txt) | A short index in the [llms.txt](https://llmstxt.org) format |
| [`Changelog.md`](Changelog.md) | The changes of each version |

## Development

You need Node 22 or newer only to change the theme sources or the demo pages.

```bash
npm install
npm run dev
```

`npm run dev` serves the demo at http://localhost:8080 and builds again on each change. `npm run build` writes the files to `dist/`.

```
src/pages/      demo pages and their scripts
src/_includes/  page layouts and partials
src/_data/      menu, theme list, demo data, CDN addresses
src/scss/       theme styles; themes/ has one file for each theme
src/js/         theme scripts
dist/           built files: copy these to your project
```

## License

MIT, see [LICENSE](LICENSE).

## Authors

Inspired by ArchitectUI by DashboardPack.
