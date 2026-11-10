# ArchitectUI reference

> A ready-made Bootstrap 6 admin theme: `architectui.css` + `architectui.js` on top of CDN Bootstrap 6 (`bootstrap@6.0.0-alpha.1`) and Lucide. Write standard Bootstrap 6 markup, add `aui-` classes for the theme extras, and every page gets the same finished look, dark mode and switchable themes. MIT license.

This file is the complete usage reference for people and AI agents. The short index is [`llms.txt`](../llms.txt); a short how-to is [`AGENTS.md`](../AGENTS.md).

## 1. What it is and when to use it

ArchitectUI is a theme, not a component framework. It styles the HTML that Bootstrap 6 already defines and adds a page frame (header, sidebar, page title, footer) plus a few dashboard pieces (number widgets, card actions, animated tabs).

Use it when you need:

- an admin panel, dashboard or back office that looks finished without design work;
- plain HTML, server-rendered templates (PHP, Python, Ruby, Go, Node) or static pages;
- a consistent look across many pages and people, with themes and dark mode for free;
- no build pipeline on the consumer side.

It is a poor fit when you need a marketing site with a unique visual identity, or a fully custom design system built from scratch.

Browsers: Bootstrap 6 needs Chrome and Edge 130, Firefox 132 or Safari 18 and newer. It builds on `light-dark()`, `:has()`, container queries, CSS layers, `@starting-style`, `interpolate-size` and the native `<dialog>` element, with no fallbacks for older browsers.

### Compared with Tailwind CSS and other utility-first kits

| Topic | ArchitectUI | Tailwind-style utility CSS |
|-------|-------------|---------------------------|
| Starting point | Finished components: cards, buttons, tables, forms, navs, menus, dialogs, toasts | Low-level utilities; each component is designed by you |
| Consistency | Built in: one class pair (`btn-solid theme-primary`) gives the same result on every page | Depends on discipline; long class lists drift apart |
| Build step | None: link CDN files and the theme | Required to generate CSS |
| Theme switch | One attribute plus one stylesheet; every page changes together | Markup changes in many places |
| Dark mode | Every component and every theme has it, through `light-dark()` | Each component needs `dark:` variants |
| Behavior | Sidebar collapse, icon rail, drawer menu, search, interface settings, theme switching, Bootstrap JS components | Not included |
| Markup | Standard, documented Bootstrap 6 | Project-specific class combinations |

Do not add Tailwind, Bulma, Foundation or another CSS framework to ArchitectUI pages. They fight over base styles and break the consistent look.

### Compared with plain Bootstrap 6

Same markup and JavaScript API. ArchitectUI adds the admin frame, a designed default look (Business), nine more themes, one extra color (`focus`), dashboard widgets, Lucide icon rendering and persistent layout settings. Anything that works in Bootstrap 6 works inside the theme.

### Coming from Bootstrap 5

The theme follows the Bootstrap 6 names. The most common renames: `btn btn-primary` → `btn-solid theme-primary` (`btn-outline-*` → `btn-outline theme-*`); `col-md-6` → `md:col-6` and every responsive class → `<bp>:class` (`xxl` → `2xl`); `text-body-secondary` → `fg-2`, `text-*` → `fg-*`, `text-bg-*` → `bg-* fg-contrast-*`, `bg-*-subtle` → `bg-subtle-*`, `bg-body-tertiary` → `bg-1`; `badge bg-success` → `badge theme-success`; `alert alert-danger` → `alert theme-danger`; `dropdown-menu` → `menu` with `data-bs-toggle="menu"`; `modal` → `dialog` (a `<dialog>` element); `offcanvas` → `drawer`; `form-check` → `form-field` with `input.check`, `input.radio` or a `.switch` wrapper; `form-select` → `form-control`; `fs-3` → `fs-2xl`; the spacer scale has 13 steps (`mb-3` is 0.5rem, the old `mb-3` is `mb-5`). `Changelog.md` has the full table.

## 2. Files and dependencies

Built files in `dist/`:

- `architectui.css` — the theme: layout, components, tokens, the default Business look. Its component rules sit in the CSS layer `custom` that Bootstrap 6 leaves to the project: they win over the Bootstrap components, and the Bootstrap helpers and utilities win over them. The token blocks (`:root`) stay outside of the layers, as the Bootstrap tokens do.
- `architectui.js` — the theme behavior of the admin pages. Classic script, no dependencies.
- `architectui-auth.js` — the script of the guest pages (sign in, sign up, password reset, errors): mode toggle, icons and the form flow. Load it instead of `architectui.js`.
- `themes/<id>.css` — optional visual themes, loaded after `architectui.css`.
- `assets/images/` — logos, avatars, theme background image.
- `LICENSE` — the MIT license; keep it in the project copy.
- `*.html` — demo pages; `*.js` next to them — scripts of individual demo pages.

Getting the files:

ArchitectUI is a template: the project keeps its own copy and adapts it. The `dist/` folder of the repository holds the latest built files (version in `package.json` and `Changelog.md`). Take a ZIP of the `master` branch (https://github.com/wnikk/architectui-html-theme/archive/refs/heads/master.zip) or clone the repository (a fixed version: the ZIP of `dist/` on the Releases page, https://github.com/wnikk/architectui-html-theme/releases), copy the files from `dist/` into the project and link them with relative paths. Themes load from the folder next to `architectui.css`; images in the markup (logo, avatars) come from the copied `assets/`. Do not link the theme files from the repository or from a CDN.

CDN dependencies. The exact, tested URLs are in `src/_data/cdn.json` and in the `<head>` of `dist/index.html`:

- Bootstrap 6: `bootstrap.min.css` and `bootstrap.bundle.min.js`. The bundle is an ES module (Floating UI and Vanilla Calendar Pro are inside it); there is no global `bootstrap` object. The page declares an import map with the name `bootstrap` and one inline module that imports it and keeps it as `window.bootstrap` (section 3).
- Lucide: the UMD bundle `lucide.min.js`, global `lucide`
- Optional, per page: Chart.js 4 (`chart.umd.min.js`, global `Chart`), Leaflet 1.9 (`leaflet.js` + `leaflet.css`, global `L`), FullCalendar 7 with its classic theme plugin (`all/global.min.js` + `themes/classic/global.js`, `skeleton.css` + `themes/classic/theme.css`, global `FullCalendar`), DataTables 3 with the Bootstrap 5 integration and Responsive (`dataTables.min.js`, `dataTables.bootstrap5.min.js`, `dataTables.responsive.min.js`, `responsive.bootstrap5.min.js` + two CSS files, global `DataTable`, no jQuery; the classes it renders exist in Bootstrap 6).

All paths are relative; the theme and page scripts are classic `defer` scripts and the only module is inline. The demo works from any folder of a web server and from disk (`file://`): a page opened from disk can import a module from the CDN but not a local module file, so the theme and page scripts stay classic. To work offline, copy the CDN files to a local folder and change the URLs; the markup does not change.

The demo pages link the theme files with `?v=<version>`, so a new version reaches visitors past their browser cache. Do the same on your pages; the theme stylesheets keep the query.

## 3. Minimal page

Load order matters: Bootstrap CSS, page library CSS, `architectui.css`, the inline settings script, the import map and the inline module that loads Bootstrap, then deferred classic scripts in this order: Lucide, page libraries, `architectui.js`, the page script. Module and deferred scripts run in document order after the parse, so `window.bootstrap` exists when `architectui.js` runs.

```html
<!doctype html>
<html lang="en" data-aui-header="fixed" data-aui-sidebar="fixed" data-aui-footer="static" data-aui-tabs="shadow" data-aui-dark-only="cyberpunk">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Page title</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/css/bootstrap.min.css" crossorigin="anonymous">
  <link rel="stylesheet" href="architectui.css">
  <script>
  // Applies saved settings before the first paint (attributes, theme stylesheet, light/dark mode)
  (function () {
    var d = document.documentElement, s = {}, m, t;
    try { s = JSON.parse(localStorage.getItem("architectui")) || {}; } catch (e) {}
    t = /^[a-z0-9-]+$/.test(s.theme || "") ? s.theme : "";
    for (var k in s) if (s[k] && k !== "theme") d.setAttribute("data-aui-" + k, s[k]);
    if (t) d.setAttribute("data-aui-theme", t);
    m = s.mode || "light";
    if (t) {
      // The theme link goes right after architectui.css; until it loads the page stays hidden (data-aui-loading)
      var base = document.querySelector('link[href*="architectui.css"]'), link = document.createElement("link");
      var shown = function () { d.removeAttribute("data-aui-loading"); };
      link.rel = "stylesheet";
      link.id = "aui-theme";
      link.href = base.getAttribute("href").replace(/architectui\.css(\?|$)/, "themes/" + t + ".css$1");
      link.setAttribute("blocking", "render");
      link.onload = link.onerror = shown;
      setTimeout(shown, 3000);
      d.setAttribute("data-aui-loading", "");
      base.parentNode.insertBefore(link, base.nextSibling);
      if ((" " + d.getAttribute("data-aui-dark-only") + " ").indexOf(" " + t + " ") > -1) m = "dark";
    }
    if (m === "system") m = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    d.setAttribute("data-bs-theme", m);
  })();
  </script>
  <script type="importmap">{ "imports": { "bootstrap": "https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/js/bootstrap.bundle.min.js" } }</script>
  <script type="module">import * as bootstrap from "bootstrap"; window.bootstrap = bootstrap; document.dispatchEvent(new Event("aui:bootstrap"));</script>
  <script defer src="https://cdn.jsdelivr.net/npm/lucide@1.65.0/dist/umd/lucide.min.js" crossorigin="anonymous"></script>
  <script defer src="architectui.js"></script>
</head>
<body>
  <div class="aui-app">
    <header class="navbar navbar-expand aui-header">...</header>
    <aside class="aui-sidebar">...</aside>
    <main class="d-flex flex-column" id="main" tabindex="-1">
      <div class="flex-grow-1 aui-content">
        <div class="aui-page-title">...</div>
        <!-- page content: Bootstrap rows, cards, forms, tables -->
      </div>
      <footer class="aui-footer d-flex align-items-center">...</footer>
    </main>
  </div>
</body>
</html>
```

The fastest correct start is to copy `dist/pages-starter.html` (an empty page with the frame) and replace the card after the page title inside `main`. The inline settings script is optional when you do not use the interface settings or a stored theme; without it the page uses the attributes written in the HTML. Your own module scripts can `import { Toast } from "bootstrap"`; classic scripts read `window.bootstrap.Toast`.

### Guest frame (sign in, sign up, errors)

Pages for a visitor who is not signed in use the guest frame: the same `<head>`, themes and modes, a top row (logo, help link, mode toggle), the content and a bottom row. There is no menu. These pages load `architectui-auth.js` instead of `architectui.js`: the guest script has the form flow and no admin features, the admin script has no form flow. Copy `dist/pages-login.html`, `dist/pages-register.html`, `dist/pages-forgot-password.html`, an error page (`dist/pages-403.html`, `pages-404.html`, `pages-500.html`) or `dist/pages-maintenance.html`.

```html
<body class="aui-guest">
  <div class="d-flex flex-column min-vh-100">
    <header class="d-flex align-items-center gap-5 px-5 sm:px-7 py-5">logo, help link, button.aui-mode-toggle[data-aui-toggle="mode"]</header>
    <main id="main" class="flex-grow-1 d-flex align-items-center py-5" tabindex="-1">
      <div class="container"><div class="row justify-content-center"><div class="sm:col-10 md:col-8 lg:col-11 xl:col-10 2xl:col-9">
        <div class="card aui-guest-card overflow-hidden"><div class="row g-0">
          <div class="lg:col-5 d-none lg:d-flex flex-column fg-white p-12 aui-guest-brand">brand panel</div>
          <div class="lg:col-7 p-7 sm:p-12" data-aui-auth>steps</div>
        </div></div>
      </div></div></div>
    </main>
    <footer class="d-flex flex-wrap justify-content-center gap-5 px-5 sm:px-7 py-5 small fg-2">links</footer>
  </div>
</body>
```

Form flow (attributes read by `architectui-auth.js`):

| Attribute | Meaning |
|-----------|---------|
| `data-aui-auth` | Flow container with steps |
| `data-aui-auth-step="name"` | One step; every step except the first has `hidden` |
| `form[data-aui-auth-form]` | Checks the fields (Bootstrap 6 validation with `data-bs-validate` on the form); when they are valid, locks the form for the request and opens the next step |
| `data-aui-auth-next="name"` | The step that opens after the request |
| `data-aui-auth-delay="2000"` | Request time in ms (the demo has no server) |
| `data-aui-auth-reject="000000"` | A code that the demo request refuses |
| `.otp[data-bs-otp]` | The Bootstrap 6 OTP input for the verification code: one real `input.otp-input` drawn as digit slots; a complete code sends the form (`complete.bs.otpInput`); a refused code marks the input `is-invalid` and clears it |
| `data-aui-auth-error` | Message shown when the code is refused; `data-aui-auth-message` holds its text |
| `data-aui-auth-back="name"` | Button that returns to a step |
| `data-aui-auth-resend` | Button that sends the code again; `data-aui-auth-timer="30"` seconds, `[data-aui-auth-countdown]` inside shows the seconds left |
| `data-aui-auth-echo="#id"` | Shows the value of a field from an earlier step |
| `data-aui-auth-redirect="url"` | On a step: opens the address after a short pause |

While a request runs, the form has `aria-busy="true"`, its `fieldset` is disabled and the `.spinner-border` with `hidden` inside the submit button is shown. A refused form shakes with the Bootstrap 6 `animation-shake` utility. To send real requests, replace the demo timer in your copy of the script with `fetch`; the markup does not change. Wrap form fields in one `fieldset`. Step headings have `tabindex="-1"`: the focus moves to the new step. Animations stop with `prefers-reduced-motion: reduce`.

## 4. Page frame

### Structure

Each frame part is Bootstrap markup with one root `aui-` class. Inside a part there are only Bootstrap classes.

```text
body
├── a.aui-skip-link (skip to content)
├── svg (gradient definitions for aui-icon-gradient-*; optional)
├── .aui-app
│   ├── header.navbar.navbar-expand.aui-header
│   │   ├── .navbar-brand: mobile burger (button.aui-burger.md:d-none, opens the sidebar drawer), a.aui-logo, collapse burger (button.aui-burger, from 1280 px), "more" button (phones)
│   │   └── .collapse.aui-header-panel#auiHeaderContent (a Collapse on phones, always open from 768 px)
│   │       ├── form.aui-expand (search, sends ?q= to pages-search.html), ul.navbar-nav (header menu)
│   │       └── .d-flex.ms-auto: status badges, a.aui-header-btn (the bell with an unread count), .aui-theme-switch (button.aui-mode-toggle + theme Menu), user Menu, user name (from 1536 px)
│   ├── aside.aui-sidebar
│   │   └── dialog.drawer.drawer-start.drawer-sheet.md:drawer#auiSidebar
│   │       ├── .drawer-header (logo, close button; phones only)
│   │       └── .drawer-body > ul.nav.flex-column.flex-nowrap#auiNav
│   └── main#main.d-flex.flex-column
│       ├── div.flex-grow-1.aui-content
│       │   ├── .aui-page-path (optional)
│       │   ├── .aui-page-title
│       │   └── page content
│       └── footer.aui-footer
└── .toast-container (optional)
```

The logo is `a.aui-logo` with two images: the first for light backgrounds, the second for dark ones. Put status badges, alerts or extra forms into the right-hand group of the header; give each a `d-none <bp>:d-flex` breakpoint by importance.

The left part of the header holds the search field and quick links (`ul.navbar-nav`). A page can show its path there instead: a Bootstrap 6 breadcrumb (`.breadcrumb-link` items with `.breadcrumb-divider` elements between them) takes the header link colors, so it follows the header color schemes. A crumb above the page can be a Bootstrap Menu with the pages of its level. When the header runs out of room, the current page shortens with an ellipsis; while the search field is open and below 1024 px, only the home link and the current page stay, and below 1536 px the open search hides the quick links. The demo does this on `components-bootstrap.html` (front matter `breadcrumbs: "header"` in `src/pages`; the path comes from the menu).

```html
<nav class="d-none md:d-block" aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li><a class="breadcrumb-link" href="index.html" aria-label="Home"><i data-lucide="house"></i></a></li>
    <li class="breadcrumb-divider" aria-hidden="true"></li>
    <li>
      <a href="#" class="breadcrumb-link" role="button" data-bs-toggle="menu" aria-expanded="false">Components<i data-lucide="chevron-down"></i></a>
      <div class="menu">
        <a class="menu-item active" href="components-bootstrap.html" aria-current="page">Bootstrap Components</a>
        <a class="menu-item" href="components-tabs.html">Tabs</a>
      </div>
    </li>
    <li class="breadcrumb-divider" aria-hidden="true"></li>
    <li><span class="breadcrumb-link active" aria-current="page">Bootstrap Components</span></li>
  </ol>
</nav>
```

### Responsive behavior

- 1280 px (Bootstrap `xl`) and wider: full sidebar; the collapse burger (`data-aui-toggle="sidebar"`) collapses it to an icon rail.
- 768–1279 px: icon rail; it expands over the content on hover and while a menu item has keyboard focus.
- Below 768 px: the sidebar is a Bootstrap Drawer (a sheet from the left edge; swipe left to close it) opened by the mobile burger; header items fold into `#auiHeaderContent`.

### Sidebar menu

```html
<ul class="nav flex-column flex-nowrap" id="auiNav">
  <li class="nav-item"><h6>Dashboards</h6></li>
  <li class="nav-item"><a class="nav-link active" href="index.html" aria-current="page"><i data-lucide="rocket"></i>Analytics</a></li>
  <li class="nav-item">
    <a class="nav-link" href="#nav-elements" role="button" data-bs-toggle="collapse" aria-expanded="false" aria-controls="nav-elements">
      <i data-lucide="gem"></i>Elements<i data-lucide="chevron-down"></i>
    </a>
    <div class="collapse" id="nav-elements" data-bs-parent="#auiNav">
      <ul class="nav flex-column flex-nowrap">
        <li class="nav-item"><a class="nav-link" href="elements-buttons-standard.html">Buttons</a></li>
      </ul>
    </div>
  </li>
</ul>
```

The first icon of a link is its menu icon (20 px, `--aui-nav-icon-size`); `chevron-down` is the group caret. A nested `nav` is a submenu. Mark the current page with `active` and `aria-current="page"`; open its group with `show` on the `.collapse` and `aria-expanded="true"` on the toggle (Bootstrap 6 keeps the state in `aria-expanded`; there is no `collapsed` class).

### Page title

```html
<div class="aui-page-title md:d-flex align-items-center text-center md:text-start">
  <div class="d-none md:d-flex align-items-center justify-content-center flex-shrink-0 me-7">
    <i data-lucide="archive" class="aui-icon-gradient-primary"></i>
  </div>
  <div>
    <h1>Page name</h1>
    <p>One sentence about the page.</p>
  </div>
  <div class="md:ms-auto mt-5 md:mt-0"><!-- buttons, menus --></div>
</div>
```

From 768 px the title is one row: the title text wraps, the actions block after it keeps its buttons in one line. On phones the actions go under the text, centered.

Spacing of the page head follows `--aui-gutter`: the content padding above the first line, one gutter between the title and the content or the section tabs, one gutter between the tabs and the content. Do not add margins to these blocks.

### Path line

A Back link and the path in small, quiet text, as a line of its own: `.aui-page-path`. Put it before `.aui-page-title`, or at the top of a page without a title. Half a gutter separates it from the title. From 768 px the Back link is as wide as the title icon box and stands centered over it, so the breadcrumb starts where the title text starts; without a Back link the breadcrumb starts at the left edge, over the icon. The same breadcrumb (with menus) fits in it. Below 576 px only the Back link stays. `data-aui-back` on the link returns to the previous page of the same site; without one, the link follows its `href`. The demo does this on `pages-profile.html` (front matter `breadcrumbs: "title"`).

```html
<div class="aui-page-path">
  <a href="index.html" data-aui-back><i data-lucide="arrow-left"></i>Back</a>
  <nav class="d-none sm:d-block" aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li><a class="breadcrumb-link" href="index.html" aria-label="Home"><i data-lucide="house"></i></a></li>
      <li class="breadcrumb-divider" aria-hidden="true"></li>
      <li><span class="breadcrumb-link active" aria-current="page">My Profile</span></li>
    </ol>
  </nav>
</div>
<div class="aui-page-title md:d-flex align-items-center text-center md:text-start">...</div>
```

### Section tabs under the title

```html
<ul class="nav aui-body-tabs" role="tablist">
  <li class="nav-item"><a role="tab" class="nav-link active" data-bs-toggle="tab" href="#tab-1"><span>Overview</span></a></li>
  <li class="nav-item"><a role="tab" class="nav-link" data-bs-toggle="tab" href="#tab-2"><span>Details</span></a></li>
</ul>
<div class="tab-content">
  <div class="tab-pane active" id="tab-1" role="tabpanel">...</div>
  <div class="tab-pane" id="tab-2" role="tabpanel">...</div>
</div>
```

Always give the first tab `active`. Panes fade in by themselves (no `fade` or `show` class). The style (`shadow` or `line`) comes from `data-aui-tabs` on `<html>`.

### Logo

Replace the files, nothing else: `assets/images/logo.svg` for light backgrounds and `assets/images/logo-on-dark.svg` for dark backgrounds. Wide and square logos both fit into `--aui-logo-max-height` (2.25rem).

### Print

The browser print shows only the page content: the header, sidebar, footer, path line, menus and toasts stay off paper, and the page title prints on the left without its icon. The print uses the light mode of the theme (a dark-only theme keeps its colors); the screen mode returns after it. Cards get a thin border instead of the shadow, scroll areas and wide tables print in full, colors print as on the screen, and a card, a table row or a chart does not break across pages. Page margins are 12 mm.

- `print:d-none` keeps an element off paper: put it on the title actions and other buttons. `print:d-block`, `print:d-inline-block` and `print:d-flex` show an element only on paper. Bootstrap 6.0.0-alpha.1 ships no print utilities; these come from the theme in the Bootstrap utilities layer.
- `data-aui-print` on a button opens the print dialog.
- An A4 page is about 700px wide, narrower than `md`: a document that must keep its columns on paper uses `sm:` columns.

`dist/pages-invoice.html` is a complete example: the invoice card is the whole document, its title has `print:d-none`, and the Print button has `data-aui-print`.

## 5. Settings, attributes and JavaScript API

### Attributes on `<html>`

| Attribute | Values | Default |
|-----------|--------|---------|
| `data-aui-header` | `fixed`, `static` | `fixed` |
| `data-aui-sidebar` | `fixed`, `static` | `fixed` |
| `data-aui-footer` | `fixed`, `static` | `static` |
| `data-aui-sidebar-collapsed` | present or absent | absent |
| `data-aui-tabs` | `shadow`, `line` | `shadow` |
| `data-aui-density` | `compact`; absent means the normal density | absent |
| `data-aui-header-scheme`, `data-aui-sidebar-scheme` | `primary`, `accent`, `success`, `info`, `warning`, `danger`, `secondary`, `inverse`, `focus` | none |
| `data-aui-mode` | `light`, `dark`, `system` | `light` |
| `data-aui-theme` | theme id (see section 6); absent means Business | absent |
| `data-aui-dark-only` | space-separated ids of dark-only themes | `cyberpunk` |
| `data-bs-theme` | `light`, `dark`; set by the theme script from the mode | `light` |

A header or sidebar color scheme takes its background, text color and logo from the theme: tokens `--aui-scheme-<color>-bg` (a gradient in the theme colors, dark or light enough for its text), `--aui-scheme-<color>-ink` (`#fff` or `#000`), `--aui-scheme-<color>-logo` and `-logo-dark` (which logo image shows). Text on every scheme reads at WCAG AA in every theme. On phones the folded header panel keeps the theme colors; the scheme colors only the top bar.

### Storage

The settings are one JSON object in `localStorage` under the key `architectui`, for example `{"theme":"coffee","mode":"dark","sidebar-collapsed":"true"}`. Keys match the attribute names without `data-aui-`. Default values are not stored.

### Declarative controls (handled by `architectui.js`)

- `data-aui-setting="<key>"` on a radio or checkbox: sets the attribute and stores it. Checkboxes use `value` when checked and `data-aui-off` when not. The inputs sit inside Bootstrap 6 wrappers: a `.switch` in a `.form-field`, a `label.btn-check` with the input inside, or the theme labels `aui-theme-option` and `aui-swatch`.
- `data-aui-setting="<key>"` with `value` on a `button` (for example a `.menu-item`): a click sets that value; the button of the current value gets `.active` and `aria-current="true"`. The header theme list is built this way:

```html
<div class="aui-theme-switch">
  <button type="button" class="aui-mode-toggle" data-aui-toggle="mode" aria-label="Toggle light and dark mode">
    <i data-lucide="moon"></i><i data-lucide="sun"></i>
  </button>
  <button type="button" class="aui-mode-toggle" data-bs-toggle="menu" data-bs-placement="bottom-end" aria-expanded="false" aria-label="Choose a theme"><i data-lucide="chevron-down"></i></button>
  <div class="menu">
    <h6 class="menu-header">Theme</h6>
    <button type="button" class="menu-item" data-aui-setting="theme" value="">
      <span class="aui-theme-dot" style="--aui-dot-brand: #2f5f9e; --aui-dot-accent: #3c7185"></span><span>Business</span>
      <i data-lucide="check" class="ms-auto aui-theme-check"></i>
    </button>
    <!-- one button per theme: value="orange", value="teal" ... -->
  </div>
</div>
```
- `data-aui-toggle="sidebar"`: collapses or expands the sidebar (sets `aria-pressed`).
- `data-aui-toggle="mode"`: switches light and dark.
- `data-aui-reset`: restores all defaults and clears storage.
- `data-aui-expand`, `data-aui-expand-toggle`, `data-aui-expand-close`: the expanding field (section 8); Escape closes it.
- `data-aui-toast="#id"`: shows that Bootstrap toast.
- `data-aui-print` on a button: opens the print dialog (see Print).
- `data-aui-back` on a link: returns to the previous page when the visitor came from the same site; otherwise follows the `href`.
- `data-aui-dropzone="#list"` on `.aui-dropzone`: marks the area while files are dragged over it and lists the chosen files in that element (name, size, icon).

The controls work on any page. The Interface section of `dist/pages-profile.html` (template `partials/interface-settings.njk`) holds all of them: layout switches, mode, density, page section tabs, theme, header and sidebar colors, and a `data-aui-reset` button; copy it into an account or settings page.

### Script API

- Markup added later (by a page script, DataTables, `fetch`) renders by itself: the script watches the page and renders new `i[data-lucide]` icons. Bootstrap 6 tooltips, popovers, menus, dialogs and the other data-API components initialise themselves, also in new markup.
- `window.ArchitectUI.refresh()`: renders the Lucide icons at once. Use it only when code needs the rendered SVG before its next step.
- `ArchitectUI.token(name)`: the current value of a theme variable as `#rrggbb` (or `rgba(…)` for a translucent color): `token("primary")` reads the solid color `--bs-primary-base` (the same for the other theme colors), `token("fg-2")` reads `--bs-fg-2`, `token("--aui-surface")` reads that variable. Bootstrap 6 writes colors as `oklch()`, `color-mix()` and `light-dark()`; the script resolves them on the page, so chart libraries get a plain color.
- `ArchitectUI.rgba(name, alpha)`: the token color with an alpha: `rgba("primary", .5)`.
- `ArchitectUI.chartDefaults(Chart)`: sets Chart.js defaults (font, text color, grid color) from the theme. Call it before you create charts and again on `aui:theme-change`.
- Event `aui:theme-change` on `document`, `event.detail.theme` = the theme id. It fires after a theme or mode change. Re-read CSS variables there (charts do this).
- `ArchitectUI` is the only global the theme script adds. The inline module in `<head>` adds `bootstrap` and fires `aui:bootstrap` on `document`; Lucide adds `lucide`.
- Bootstrap 6 API names: `bootstrap.Menu` (was Dropdown), `bootstrap.Dialog` (was Modal), `bootstrap.Drawer` (was Offcanvas), events `show.bs.dialog`, `shown.bs.drawer`, `complete.bs.otpInput`. `show()`, `hide()` and `toggle()` return a Promise.

## 6. Themes and modes

| Id | Name | Character |
|----|------|-----------|
| none | Business (default) | Built into `architectui.css`. Dense, smaller type, lines instead of shadows |
| `orange` | Orange | The original ArchitectUI look: orange accents, color gradients, soft shadows |
| `indigo` | Indigo | Indigo palette with the depth of Orange: soft shadows instead of lines, a floating header and sidebar, vivid two-color gradients |
| `indigo-img` | Indigo Calathea | Indigo with a subtle photo of Calathea leaves behind the content |
| `coffee` | Coffee | Warm browns with the depth of Orange (warm shadows, caramel and honey gradients) at the compact sizes of Business |
| `green` | Garden | Calm green, serif headings, airy rows |
| `raspberry` | Warm | Berry accent, pill buttons, rounder corners |
| `teal` | Operations | Zebra tables, monospace numbers |
| `violet` | Space | Large radii, soft violet shadows, heavy headings |
| `cyberpunk` | Cyberpunk | Neon on black, monospace; dark only |

How it works:

- `architectui.css` holds the shared component rules of all themes. They read colors, fonts, radii, shadows and table density from CSS variables.
- Business values of these variables apply only while `<html>` has no `data-aui-theme`.
- Any other theme is one small stylesheet in `themes/`: the variable values (both modes in one `light-dark()` value) and the rules only this theme needs. Orange keeps the classic component rules instead of the shared ones. Selecting a theme sets `data-aui-theme="<id>"` (this switches the Business values off) and adds `<link id="aui-theme" href="themes/<id>.css">` after `architectui.css`. At runtime the new link loads with `media="not all"`, so the page keeps the old colors; then the attribute, the link and the mode change in one step, and the page cross-fades to the new colors (View Transitions API, 0.3 s; at once where the browser has no View Transitions or with `prefers-reduced-motion`). A light/dark switch cross-fades the same way.
- On page load the inline script in `<head>` adds the stored theme link right after `architectui.css` with `blocking="render"`. Until it loads, `data-aui-loading` on `<html>` keeps the page hidden (at most 3 s), then the page fades in (0.2 s). Business needs no extra file and shows at once.
- Modes: `light`, `dark`, `system`. The mode becomes `data-bs-theme` on `<html>`, which sets `color-scheme`; every `light-dark()` token of Bootstrap and of the theme follows it.

A fixed theme without the interface settings:

```html
<html data-aui-theme="coffee">
<link rel="stylesheet" href="architectui.css">
<link rel="stylesheet" href="themes/coffee.css">
```

A new theme is one Sass file in `src/scss/themes/` that passes a palette for both modes; the shared rules are already in `architectui.css`:

```scss
@use "theme" as t;

@include t.palette(
  (bg: #f8fafc, surface: #fff, surface-2: #f1f5f9, surface-muted: #f8fafc, border: #e2e8f0,
   text: #0f172a, text-muted: #475569, text-faint: #617087, text-dim: #778aa5, danger: #e11d48,
   brand-solid: #4f46e5, brand-solid-hover: #6366f1, brand-soft: #eef2ff, brand-veil: rgba(238, 242, 255, .45),
   brand-text: #4f46e5, brand-text-hover: #6366f1, brand-ink: #4338ca, brand-faint: #626ff6,
   brand-line: #4f46e5, brand-line-soft: #c7d2fe, brand-focus: #4f46e5, brand-shadow: rgba(199, 210, 254, .7),
   shadow: "0 1px 2px 0 rgba(15, 23, 42, .05)"),
  (/* the same keys for dark mode */)
);
```

`t.palette` writes every color as `--aui-<key>: light-dark(<light>, <dark>)` in one `:root` block and computes the header and sidebar schemes per mode. The theme base maps the palette to the Bootstrap 6 tokens: `--bs-bg-body`, `--bs-bg-1…4`, `--bs-fg-body`, `--bs-fg-1…4`, `--bs-border-color`, `--bs-link-color`, and the nine tokens of `primary` (from the `brand-*` keys), `accent` (from the `accent-*` keys), `danger` (from `danger`), `secondary` (the neutral of the theme: a light surface with the body text on it), `inverse` (text and surface swapped), `success`, `info`, `warning` and `focus` (fixed colors). Optional palette keys: `fill` (defaults to `surface-2`), `accent-solid`, `accent-soft`, `accent-text`, `accent-ink`, `accent-line` (default to the brand values), `brand-contrast` and `accent-contrast` (the text on the solid colors, default `#fff`). After the palette, set other variables in `:root` (`--aui-root-size`, `--aui-font`, `--aui-heading-font`, `--aui-radius*`, `--aui-card-shadow`, `--aui-cell-py`, `--aui-th-*`) and add rules that only this theme needs inside `@layer custom { }`.

Two optional looks come as mixins of the theme base; include them after the palette:

- `@include t.depth($tint, $gradients)`: the depth of Orange on the theme tokens. Soft shadows instead of border lines (colored by `$tint` in light mode, black in dark mode; `--bs-shadow-color` follows, so `.shadow` and `.hover-lift` take the tint), a floating header and sidebar, a lifted active menu link, cards without a border line, uppercase card titles in the brand color, layered shadows on menus and dialogs, uppercase badges. `$gradients` is a map of `--aui-gradient-<name>` values, a pair of colors (a 120° gradient that also sets the scheme of that color) or any CSS gradient (keys `primary`, `success`, `info`, `warning`, `danger`, `secondary`, `inverse` and their `-subtle`) that `bg-<color>` paints. Indigo and Coffee use it.
- Header and sidebar schemes come with the palette: `t.palette` computes them for `primary`, `accent`, `secondary`, `inverse` and `danger`, the base for the status colors and `focus`, and `t.depth` for every gradient given as a pair of colors. For other colors of a theme call `@include t.scheme(<color>, <from>, <to>)` inside the light and dark blocks (`t.light()`, `t.dark()`); `t.scheme-ink(<color>, #fff | #000)` sets only the text and the logo when the theme sets the background itself.
- `@include t.compact`: the compact sizes of Business: 14.5px root type, line height 1.45, denser table headers and cells, a smaller table font. Radii and shadows stay with the theme. Coffee uses it.

```scss
@include t.compact;
@include t.depth(#77552b, (
  primary: (#8b4513, #d99235),
  danger: (#a63a2b, #d9694f),
));
```

Add the theme to `src/_data/themes.json` to list it in the interface settings. Check it on `components-bootstrap.html` in both modes: every Bootstrap 6 component is on that page.

## 7. Tokens (CSS variables)

Override tokens after `architectui.css` (or after the theme stylesheet). No rebuild is needed.

Colors: `dist/elements-palettes.html` shows the values of every color token in every theme and mode, with the class and the variable for each. Rules for colors:

- In markup, use the Bootstrap 6 color classes. `theme-<color>` on a component (button, badge, alert, table row, list group item, progress, accordion, avatar, card) is the color with the text that reads on it; `bg-<color>` with `fg-contrast-<color>` is the solid color (in the theme `bg-<color>` paints the theme gradient over it); `bg-subtle-<color>` with `fg-emphasis-<color>` is a pale note; `fg-<color>`, `border-<color>`, `shadow-<color>`, `underline-<color>`. The theme adds `focus` with the same classes.
- In CSS, read `var(--bs-<color>-base)` (the solid color), `--bs-<color>-fg`, `--bs-<color>-fg-emphasis`, `--bs-<color>-bg-subtle`, `--bs-<color>-border`, `--bs-<color>-contrast`; the surfaces `--bs-bg-body`, `--bs-bg-1`, `--bs-bg-2`, `--bs-bg-3`; the text `--bs-fg-body`, `--bs-fg-1`, `--bs-fg-2`, `--bs-fg-3`; `--bs-border-color`; `--aui-surface` (cards), `--aui-app-bg` (page), `--aui-gradient-<color>`. For transparency use `color-mix(in srgb, var(--bs-primary-base) 50%, transparent)`; Bootstrap 6 has no `-rgb` triplets. These exist in every theme, Orange included; never write fixed HEX values for theme colors.
- Override for every theme in `:root`, for one theme in `[data-aui-theme="<id>"]`; write both modes in one `light-dark()` value.

Layout, shared by all themes:

- `--aui-header-height` (60px), `--aui-sidebar-width` (250px), `--aui-sidebar-collapsed-width` (80px)
- `--aui-logo-max-height` (2.25rem), `--aui-nav-icon-size` (20px), `--aui-gutter` (1.5rem, 1rem on phones), `--aui-card-header-height` (3.5rem), `--aui-transition`
- `--aui-density` (1): factor for card and table cell padding
- `--aui-page-animation` (`aui-page-in .3s ease-out backwards`): the content area (`.aui-content`) appears on every page load, from transparent and 8px lower; the header, sidebar and footer stay still. Set it to `none` to turn the animation off. It is off with `prefers-reduced-motion: reduce` and in print. A dialog or a drawer opened during the animation ends it first.

Compact density: `data-aui-density="compact"` on `<html>`, or the "Density" group in the interface settings (`pages-profile.html#interface`). It makes the content denser on every page and in every theme:

- `--aui-gutter` is 1rem: the content area, page title, header, sidebar and footer padding;
- `--aui-card-header-height` is 2.75rem;
- `--aui-density` is 2/3: the card padding and the table cell padding of the theme are two thirds of the normal values;
- a `.row` without its own `g-*`, `gx-*` or `<bp>:g-*` class gets a 1rem gutter.

On phones the content padding is 1rem in both densities. A page made for both densities uses Bootstrap utilities for its own spacing (`g-5`, `mb-5`), and the theme variables for custom CSS: `padding: calc(1rem * var(--aui-density))`.

Theme palette (set by every theme and by Business, both modes in one value):

- Surfaces: `--aui-app-bg`, `--aui-surface`, `--aui-surface-2`, `--aui-surface-muted`, `--aui-fill`, `--aui-border`
- Text: `--aui-text`, `--aui-text-muted`, `--aui-text-faint`, `--aui-text-dim`
- Brand and accent: `--aui-brand-solid`, `--aui-brand-soft`, `--aui-brand-text`, `--aui-brand-ink`, `--aui-brand-line`, `--aui-brand-contrast`, `--aui-accent-solid` and related keys
- Rhythm: `--aui-root-size`, `--aui-font`, `--aui-heading-font`, `--aui-radius-lg`, `--aui-radius`, `--aui-radius-sm`, `--aui-shadow-sm`, `--aui-shadow-md`, `--aui-shadow-xl`, `--aui-card-padding`, `--aui-cell-py`, `--aui-th-size`
- Gradients: `--aui-gradient-<color>` and `--aui-gradient-<color>-subtle`

Bootstrap 6 tokens are set from the palette: the surfaces and text (`--bs-bg-*`, `--bs-fg-*`), the borders, the links, the focus ring, the shared button and input sizes (`--bs-btn-input-*`), the radii (`--bs-radius-5`, `-7`, `-9`) and the nine tokens of every theme color. To recolor the brand in every theme, change the palette tokens:

```css
:root { --aui-brand-solid: #3f6ad8; --aui-brand-text: light-dark(#3f6ad8, #8fb0f0); --aui-brand-ink: light-dark(#2c4fa8, #b3c8f4); }
```

Colors: Bootstrap's `primary`, `accent`, `success`, `info`, `warning`, `danger`, `secondary`, `inverse` plus the theme's `focus`. Every color has `theme-*`, `bg-*`, `bg-subtle-*`, `bg-muted-*`, `fg-*`, `fg-emphasis-*`, `fg-contrast-*`, `border-*`, `border-subtle-*`, `shadow-*`. `bg-<color>` paints the theme gradient for the Bootstrap colors and a solid fill for `focus`; `bg-subtle-<color>` is the pale background of the theme palette, in every theme and mode; pair it with `fg-emphasis-<color>` or use `badge badge-subtle theme-success`. The `--aui-gradient-<color>-subtle` tokens are for custom CSS.

## 8. Component reference

Use Bootstrap 6 components as documented by Bootstrap. The theme already styles them, the new ones included: avatars, chips and the chip input, stepper, OTP input, password strength, range, combobox, date picker, dialogs, drawers, menus with submenus, nav overflow, toggler. The `aui-` classes below add what Bootstrap does not have.

### Number widget

A card with Bootstrap flex utilities. The theme adds only `aui-number` (the number font of the theme).

```html
<div class="card mb-5 d-flex flex-row align-items-center p-5">
  <div class="d-flex flex-grow-1 align-items-center">
    <div>
      <div class="fw-bold opacity-75">Total Orders</div>
      <div class="opacity-50">Last year expenses</div>
    </div>
    <div class="ms-auto">
      <div class="aui-number fs-2xl fw-bold lh-1 fg-success">1896</div>
    </div>
  </div>
</div>
```

Filled variant: add `bg-primary` (or another color) to the card and `fg-white` to the inner row. Choose a dark color (`bg-primary`, `bg-success`, `bg-danger`, `bg-inverse`) for white text. For a pale card use `bg-subtle-<color>` with `fg-emphasis-<color>` instead of `fg-white`. Progress row: wrap the inner row in `div.d-flex.flex-column.flex-grow-1` and add after it:

```html
<div class="mt-5">
  <div class="progress"><div class="progress-bar bg-primary" style="width: 65%"></div></div>
  <div class="d-flex align-items-center mt-1 opacity-50"><div>YoY Growth</div><div class="ms-auto">100%</div></div>
</div>
```

### Card header with icon and actions

```html
<div class="card mb-5">
  <div class="card-header">
    <i data-lucide="laptop" class="me-3"></i>Header Menu
    <div class="ms-auto text-nowrap">
      <button type="button" class="btn-text btn-icon btn-sm theme-secondary" aria-label="Download"><i data-lucide="download"></i></button>
    </div>
  </div>
  <div class="card-body">...</div>
</div>
```

The first icon in the card header gets the muted color. The card header has a fixed height; tabs inside it stay on one line. Header tabs: put `ul.nav` directly in `.card-header`; add `ms-auto` to move it to the right and `nav-underline` for the moving bar. A `.btn-group.nav` of buttons in a `.ms-auto` wrapper also works. The card body of Bootstrap 6 is a flex column with a gap between its children; a `card theme-<color>` colors the header and the border, `card-subtle theme-<color>` gives a pale themed card, `card-row` puts an image column next to the body, `hover-lift` lifts a card on hover.

An icon directly inside a button is drawn larger than the button text. Buttons have a gap, so an icon and text need no utilities; an icon-only button is `btn-icon`.

### Wide-screen breakpoint

Bootstrap 6 breakpoints: `sm` 576, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536 px. The theme continues the row after `2xl` for monitors 1920 px wide:

| Name | From | For |
|------|------|-----|
| `3xl` | 1860 px | monitors 1920 px wide (Full HD) |

The threshold is lower than the monitor width: a media query counts the scrollbar, and the window frame takes a few pixels. So the breakpoint applies in a full-screen browser window with a scrollbar. For 1600 px monitors use the Bootstrap `2xl` classes.

Classes for `3xl`, in the prefix form of Bootstrap 6 and with the same rules as its `2xl` classes:

- Columns: `3xl:col`, `3xl:col-auto`, `3xl:col-1` … `3xl:col-12`.
- Offsets: `3xl:offset-0` … `3xl:offset-11`.
- Columns per row: `3xl:row-cols-auto`, `3xl:row-cols-1` … `3xl:row-cols-8`.
- Gutters: `3xl:g-0` … `3xl:g-12`, `3xl:gx-*`, `3xl:gy-*`.
- Display: `3xl:d-none`, `3xl:d-block`, `3xl:d-flex`, `3xl:d-grid`, `3xl:d-inline-flex`, `3xl:d-inline-block`, `3xl:d-inline`, `3xl:d-table-cell`.

Add them after the Bootstrap classes of the same element, from small to large:

```html
<div class="row row-cols-1 md:row-cols-2 2xl:row-cols-4 3xl:row-cols-6 g-5">
  <div class="col"><div class="card">…</div></div>
</div>
<div class="row">
  <div class="col-12 2xl:col-8 3xl:col-6">…</div>
  <div class="col-12 2xl:col-4 3xl:col-3">…</div>
  <div class="d-none 3xl:d-block 3xl:col-3">…</div>
</div>
```

Other Bootstrap utilities (spacing, text, order) stop at `2xl`.

### Other theme classes

- Navs: `aui-tabs-shadow`; Bootstrap `nav-underline` gets the moving bar of the theme. The first icon in a `.nav-link` is the link icon.
- Numbers: `aui-number`.
- Page head: `aui-page-path` (Back link and breadcrumb line before the page title, see Path line).
- Forms: `aui-dropzone` (file drop zone, see Forms).
- Apps: `aui-kanban`, `aui-kanban-column`, `aui-kanban-list`, `aui-kanban-card` (see Kanban board), `aui-chat`, `aui-chat-message`, `aui-chat-bubble` (see Chat).
- Header: `aui-header-btn` (an icon button of the header, like the bell: the same box as the mode toggle). A `.badge` inside is a count on the top right corner: a circle for one digit, wider from two; it grows into the button, so it does not cover the next button. `aui-mode-toggle` is the light/dark button, `aui-burger` the animated menu button; both are plain `<button>` elements without Bootstrap button classes.
- Settings controls: `aui-theme-option` (theme picker label with the radio inside and a dot), `aui-theme-dot` (small theme dot for a list), `aui-swatch aui-swatch--<scheme>` (color swatch label with the radio inside), `aui-theme-switch` (header group of the mode toggle and the theme menu; `aui-theme-check` marks the current theme).
- Scroll areas: `aui-scroll` with a height class `aui-scroll-sm`, `-md`, `-lg`.
- Charts and maps: `aui-chart` (`aui-chart-xs`, `aui-chart-sm`, `aui-chart-lg`) sets the chart height; `aui-sparkline` is a 2.5rem trend line under a number (a Chart.js line without axes); `aui-map` (`aui-map-lg`) for Leaflet maps.
- Animations: `aui-animate-fade-in`, `aui-animate-flip`, `aui-animate-light-speed-in`, `aui-animate-pulse`, `aui-animate-spin`. Bootstrap 6 adds `animation-shake` and `animation-pop`.
- Icon color: `aui-icon-gradient-<color>` strokes a Lucide icon with a theme gradient (needs the SVG gradient definitions from `partials/icon-gradients.njk` in the page).

Native in Bootstrap 6 now, so the theme has no class of its own: avatars and avatar stacks (`avatar`, `avatar-img`, `avatar-stack`), the stepper (`stepper`, `stepper-item`), colored shadows (`shadow shadow-<color>`), lifted buttons and cards (`hover-lift`, `btn-styled`), the one-time code input (`otp`), the fade of tab panes. Everything else is Bootstrap: `hr` for a divider, `fs-*` and `opacity-*` for text, `list-group-flush` for a list without borders, `menu-header` and `menu-divider` in menus.

### Tables

A regular Bootstrap table. For a list with tools, put a search `input-group` and `form-control` selects in the `card-body` above, the table in `.table-responsive` (or `md:table-responsive`), the counter, rows per page and `pagination` in the `card-footer`. A sortable header is a link inside the `th`: `aria-sort` on the `th`, `chevrons-up-down` icon (`opacity-50`) when not sorted, `arrow-up` or `arrow-down` (`fg-primary`) when sorted. An empty result is one row with `colspan` and a centered message. `.table-responsive` keeps its content inside: a `.visually-hidden` header label does not widen the page. New in Bootstrap 6: `md:table-stacked` turns every row into a card below 768 px (give each `td` a `data-cell` with the column name), `table-card` frames the table, `theme-<color>` colors a table, a row or a cell; `table-dark` is `data-bs-theme="dark"` on the table.

### Chat

`.aui-chat`: messages as bubbles in a scroll area (height `--aui-chat-height`, 26rem). A message is `.aui-chat-message` with an avatar and a `div` holding `.aui-chat-bubble` and a time; `.is-own` puts it on the right in the brand color with the theme's contrast text. Give the area `role="log"`.

```html
<div class="aui-chat p-5" role="log" aria-label="Messages">
  <div class="aui-chat-message">
    <span class="avatar avatar-sm"><img class="avatar-img" src="assets/images/avatars/11.jpg" alt=""></span>
    <div><div class="aui-chat-bubble">Will it arrive before Friday?</div><div class="small fg-2 mt-1">10:31</div></div>
  </div>
  <div class="aui-chat-message is-own">
    <span class="avatar avatar-sm"><img class="avatar-img" src="assets/images/avatars/1.jpg" alt=""></span>
    <div><div class="aui-chat-bubble">Yes, on Thursday.</div><div class="small fg-2 mt-1">10:38</div></div>
  </div>
</div>
```

`dist/apps-inbox.html` uses it in a three-pane inbox (folders, list, conversation; on phones the list and the conversation take turns).

### Kanban board

`.aui-kanban`: columns side by side; when they do not fit, the board scrolls sideways inside itself (the page does not). Each column is a `.card.aui-kanban-column` with a `.card-header`, a `.card-body` holding `.aui-kanban-list` and a `.card-footer`. Cards are `.card.aui-kanban-card` (`draggable="true"`, `tabindex="0"`). A page script moves the cards: `.is-over` marks the list under a dragged card, `.is-dragging` the card. Column width: `--aui-kanban-column-width` (17rem). Give every card a "Move to" menu as well: HTML drag and drop works with a mouse only. The people on a card are a Bootstrap 6 avatar stack: `<span class="avatar-stack avatar-stack-xs"><span class="avatar"><img class="avatar-img" src="..." alt=""></span>…</span>`. `dist/apps-kanban.html` and `apps-kanban.js` are a complete example (drag, Move to, add a card, filters, column limits, a live region for screen readers).

### Form in several steps

The Bootstrap 6 stepper shows the steps: `ol.stepper` (add `stepper-horizontal`, or `sm:stepper-horizontal` inside a `.contains-inline` parent) with `li.stepper-item`; the finished steps and the current one have `.active`, the current one `aria-current="step"`. Put one `<form novalidate data-bs-validate>` around all steps, one `<section>` per step with `hidden` on the others. On Next, check the fields of the current section with `checkValidity()`; Bootstrap 6 shows the feedback by itself after the first interaction. `dist/forms-wizard.html` and `forms-wizard.js` are a complete example (review step, skip, result). Escape a hyphen in a `pattern` character class (`[a-z0-9\-]`): browsers compile `pattern` with the `v` flag and ignore an invalid one.

### Expanding field

A round button that opens into a field: search in the header, search above a table, a field in a form. An empty toggle draws a magnifier; put an icon inside the toggle to show it instead.

```html
<div class="aui-expand" role="search" data-aui-expand>
  <input type="search" class="form-control" placeholder="Search" aria-label="Search">
  <button type="button" data-aui-expand-toggle aria-label="Search"></button>
  <button type="button" class="btn-close" data-aui-expand-close aria-label="Close"></button>
</div>
```

The expanding field can be a `form`: give it an `action` and the input a `name`. Enter sends the form; the magnifier of the open field sends it too when the field has words. The header does this: `form.aui-expand[action="pages-search.html"]` with `input[name="q"]` opens the Search Results page.

The script adds `is-open`. Size, open width and colors are CSS variables: `--aui-expand-size`, `--aui-expand-width`, `--aui-expand-bg`, `--aui-expand-color`.

### Toasts

Filled toasts use `theme-<color>`; the header and the close button follow the text color:

```html
<div class="toast-container position-fixed top-0 end-0 p-5">
  <div class="toast theme-success" role="status" aria-live="polite" aria-atomic="true">
    <div class="toast-header">
      <i data-lucide="circle-check" class="me-3"></i><strong class="me-auto">Saved</strong>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">The changes are stored.</div>
  </div>
</div>
```

### Forms

Use Bootstrap 6 form markup. A field is a `.form-field` with the label, the control, `.form-text` and the feedback. A check is `<input class="check" type="checkbox">`, a radio `<input class="radio" type="radio">`, a switch `<div class="switch"><input type="checkbox" role="switch" switch></div>`; each gets a `<label for>` next to it inside the `.form-field`. A `<select>` is a `.form-control`. Validation: `data-bs-validate` (and `novalidate`) on the form shows the feedback after the first interaction; `.is-invalid` and `.is-valid` work without it. Feedback tooltips need `tooltip invalid-tooltip`. Toggle buttons are `<label class="btn-check btn-outline theme-primary"><input type="radio" name="…">Label</label>`.

Native fields need no library: `type="date"`, `time`, `datetime-local`, `month` and `week` with `.form-control`; a text field with `list` and a `datalist` for suggestions; `type="color"` with `.form-control-color`; `type="file"` with `.form-control`. The theme keeps the picker icon quiet until the pointer is on it and follows dark mode. New Bootstrap 6 controls: `.form-range` wrapper with `input.form-range-input` (filled track, `data-bs-bubble`, tick marks from a `datalist`), `label.form-control.form-adorn` with an icon or text next to a `.form-ghost` input, `.otp[data-bs-otp]` for a code, `.strength[data-bs-strength]` for a password meter, `button.form-control.combobox-toggle[data-bs-toggle="combobox"]` with a `.menu` of options, `data-bs-toggle="datepicker"` on an input, `.chip-input[data-bs-chips]` for several values. `dist/components-bootstrap.html` shows all of them.

File drop zone: a native file input covers the whole area, so a click and a drop both work.

```html
<div class="aui-dropzone" data-aui-dropzone="#uploadList">
  <input type="file" id="upload" multiple accept="image/*,.pdf" aria-describedby="uploadHelp">
  <i data-lucide="cloud-upload"></i>
  <div class="fw-bold mt-3">Drop files here or <span class="fg-primary">browse</span></div>
  <div class="small fg-2" id="uploadHelp">PNG, JPG or PDF, up to 10 MB each</div>
</div>
<ul class="list-group" id="uploadList"></ul>
```

### Icons

Lucide icons: `<i data-lucide="name"></i>`. The full list with search is on the Icons demo page (`dist/elements-icons.html`) and at https://lucide.dev/icons. Icons take the text color and scale with the font size. After inserting markup with icons, call `ArchitectUI.refresh()` only when the next line needs the SVG; otherwise the icons render by themselves.

## 9. Third-party libraries on a page

- Chart.js: load the UMD bundle before the page script. Call `ArchitectUI.chartDefaults(Chart)`, take series colors from `ArchitectUI.token("success")` and `ArchitectUI.rgba("success", .5)`, and re-render on `aui:theme-change` (call `chartDefaults` again first). Put the canvas in `.aui-chart`.
- FullCalendar 7: load `skeleton.css` and the classic theme `themes/classic/theme.css`, then `all/global.min.js` and `themes/classic/global.js`; the theme plugin registers itself. Set `headerToolbar` (it is off by default in 7). The theme sets the `--fc-classic-*` variables from its tokens, so the calendar follows the theme and the mode. Event colors: `color` and `contrastColor` (for example `token("success")` and `token("success-contrast")`); repaint them on `aui:theme-change` with `event.setProp()`.
- Leaflet: load `leaflet.css` and `leaflet.js`; put the map in `.aui-map`. The Maps demo page uses public OpenStreetMap tiles: fine for a demo; use your own tile server or a tile provider in production.
- DataTables 3: load the CSS of `datatables.net-bs5` and `datatables.net-responsive-bs5`, then `dataTables.min.js`, `dataTables.bootstrap5.min.js`, `dataTables.responsive.min.js`, `responsive.bootstrap5.min.js`. The Bootstrap 5 integration renders `pagination`, `page-item`, `page-link` and `form-control`, which exist in Bootstrap 6; set `DataTable.ext.classes.length.select = "form-control form-control-sm"` before the first table, because `form-select` is gone. Put rows in a regular `table.table` and call `new DataTable(table, { responsive: true })`. The theme styles the toolbar, sorting, empty result and pagination. Put `data-order` on cells whose text does not sort well (dates, amounts). DataTables right-aligns date columns; add `className: "dt-left"` to keep them left. Set `responsivePriority` so the key columns stay on a phone.
- Wrap page scripts in an IIFE and read libraries from `window` (`window.bootstrap` included) so nothing leaks into the global scope.

## 10. Rules for agents building pages with ArchitectUI

1. Start from `dist/pages-starter.html` (admin frame), `dist/pages-login.html` (guest frame) or a demo page close to the task. Keep the frame and change the content.
2. Use Bootstrap 6 markup and utilities: a variant class plus a theme class on buttons (`btn-solid theme-primary`), `theme-*` on components, `fg-*` and `bg-*` for colors, the `<bp>:class` prefix for responsive classes. Add `aui-` classes only from section 8. Do not invent new `aui-` classes in pages; put new styles in your own stylesheet after `architectui.css`.
3. Style through tokens. Use `var(--aui-*)` and `var(--bs-*)` in custom CSS instead of fixed hex colors, both modes in one `light-dark()` value, so themes and dark mode keep working.
4. Do not add Tailwind, jQuery, Font Awesome or another CSS framework.
5. Keep relative paths and classic `defer` scripts for the theme and the pages; the import map and the inline module in `<head>` are the only module code. Do not use root-absolute URLs.
6. Give every tab list an `active` first tab inside a `[role="tablist"]` or `.nav`, every dialog or drawer trigger a `data-bs-target="#id"` that exists, and every form check a label with `for`.
7. Markup inserted later renders its icons by itself, and Bootstrap 6 components initialise themselves; call `ArchitectUI.refresh()` only when the next line needs the rendered SVG.
8. Check the page in light and dark mode and at least in Business and Orange.

## 11. Demo pages

| File | Shows |
|------|-------|
| `index.html` | Analytics dashboard: widgets, charts, table, progress widgets |
| `dashboard-boxes.html` | Number widgets in every variant |
| `dashboard-operations.html` | Operations Wall for wide screens: filter bar, key figures with sparklines, requests by region, regions, capacity, service charts, event table, activity; `2xl` and `3xl:` columns, auto-refresh, works in both densities |
| `elements-buttons-standard.html` | Buttons: solid, outline, subtle, text and link variants, groups, states |
| `elements-dropdowns.html` | Menus, split buttons, sizes, placements |
| `elements-badges-labels.html` | Badges on buttons and alone, chips and the chip input |
| `elements-icons.html` | Lucide icon catalog with search and copy; a Bootstrap Icons tab that loads that set from the CDN on first open, with its own catalog and search (for comparison; the theme uses Lucide) |
| `elements-cards.html` | Cards: hover lift, subtle and themed cards, row cards, headers, footers, colored borders and shadows |
| `elements-list-group.html` | List groups |
| `elements-navigation.html` | Vertical and horizontal navs |
| `elements-utilities.html` | Animations, colors, helpers, the new Bootstrap 6 utilities (colored shadows, divide, space, keyline borders, text balance, color scheme) |
| `elements-palettes.html` | Theme Palettes: the current theme live, all 10 themes side by side in light or dark mode, a guide to colors in classes, CSS variables and scripts, copy on click |
| `components-bootstrap.html` | Every Bootstrap 6 component on one page, the new ones included: buttons, badges and chips, alerts and toasts, forms, range, form adorn, floating labels, OTP input, password strength, combobox, date picker, avatars, stepper, lists, tables (stacked), progress, cards, nav overflow, navbar with a drawer, menus with submenus, breadcrumb, pagination, dialogs, drawers, tooltips, popovers, collapse, accordion, scrollspy, toggler, spinners, placeholders, icon links, prose, utilities. The page to check a theme in both modes |
| `components-tabs.html` | Card tabs, animated tabs, button tabs, tabs with overflow |
| `components-accordions.html` | Collapse and accordions on native details and summary |
| `components-notifications.html` | Toast configurator and alerts |
| `components-modals.html` | Dialog sizes, a scrollable dialog, a slide animation with fullscreen on phones, a static backdrop, a non-modal dialog |
| `components-progress-bar.html` | Progress bars |
| `components-tooltips-popovers.html` | Tooltips and popovers |
| `components-carousel.html` | Carousels on CSS scroll snap: overlay controls with play and pause, a crossfade with indicators, several slides in view; slides drawn as SVG in the theme colors |
| `components-pagination.html` | Pagination |
| `components-scrollable-elements.html` | Scroll areas and card actions |
| `components-maps.html` | Leaflet with OpenStreetMap |
| `components-calendar.html` | FullCalendar 7 with its classic theme on the theme tokens |
| `forms-controls.html` | Inputs, selects, checks, input groups; native date, time, suggestions, color and file fields with a drop zone |
| `forms-layouts.html` | Grid and inline forms |
| `apps-inbox.html` | Inbox: folders with an unread counter, labels, search, a conversation list, the conversation as a chat (`aui-chat`), star, archive, a reply box; on phones the list and the conversation take turns |
| `apps-notifications.html` | Notifications: a feed by day with filters (All, Unread, Mentions, System), unread marks, Mark all as read, remove; delivery settings per kind (email, browser, digest). The bell in the header shows the same unread count |
| `apps-users.html` | Users: counters by status, search and role and status filters, a table with avatars or initials, roles, teams, two-step sign-in, pages of 10; Add and Edit in one dialog form with Bootstrap validation (unique email), Delete with a confirmation dialog; owners cannot be deleted; changes stay until reload |
| `apps-kanban.html` | Kanban board: five columns, cards with labels, due dates, checklists and people (avatar stacks); drag and drop, a "Move to" menu, new cards, search and label filter, column limits |
| `forms-wizard.html` | Form in four steps with the Bootstrap 6 stepper: check of each step, plan cards, optional step with Skip, review of all answers, result screen |
| `forms-validation.html` | Bootstrap 6 validation with `data-bs-validate` |
| `tables-regular.html` | A Bootstrap list of orders with search, filters, sorting links in the header, selection, row actions and pages; an empty state; table variants; a stacked table |
| `tables-datatables.html` | The same orders in DataTables 3: search, sorting, pages, rows per page, responsive rows on a phone |
| `charts-chartjs.html` | Chart.js charts colored by tokens |
| `pages-starter.html` | An empty page with the frame: the start for a new screen |
| `pages-pricing.html` | Pricing: Monthly / Yearly switch with the saving, four plans (the recommended one with a primary border and a colored shadow), a comparison table by groups, common questions in an accordion |
| `pages-search.html` | Search Results: the header search sends ?q= here; results across pages, users, orders and conversations (without ?q= a sample search shows the look at once), tabs with counts, matching words in `<mark>`, a title match first, an empty state with suggestions; a new search keeps the page and updates the address. The index is part of the page, so it works from disk |
| `pages-invoice.html` | Invoice ready for print: seller, bill to, ship to, details, items, totals with discount and VAT, bank details; Send and Print buttons. The print shows only the invoice on one A4 page |
| `pages-settings.html` | Settings: a menu of sections on the left (a select on phones) and the open section as a Bootstrap tab; the address keeps the section (#security). General (name, address, logo drop zone, regional formats), Security (password with a match check, two-step sign-in, devices), Billing (plan, payment method, invoices), Integrations (connect, disconnect), API keys (create in a dialog, the demo key shown once, revoke), Privacy & data (data export, account deletion confirmed by typing DELETE and a check mark, 30 days to cancel) |
| `pages-profile.html` | My Profile: profile card, personal information form, and the Interface section with every setting (layout, mode, density, tabs, theme, header and sidebar colors, restore default). The user menu links to it |
| `pages-login.html`, `pages-register.html`, `pages-forgot-password.html` | Guest frame: sign in with a code from an authenticator app (the Bootstrap 6 OTP input), sign up with a password strength meter and a code from the email, password reset; demo requests lock the form for 2 s |
| `pages-403.html`, `pages-404.html`, `pages-500.html` | Error pages on the guest frame: access denied (with the signed-in account and Switch account), not found, server error |
| `pages-maintenance.html` | Scheduled maintenance (HTTP 503) on the guest frame: time window, progress of the work, status and support links. Its menu label is long on purpose: it shows how a long sub-item wraps in the sidebar |
