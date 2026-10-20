# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Users page** (`apps-users.html`, menu Apps): the team of the store — counters by status, search, role and status filters, a table with photos or initials, roles, teams, two-step sign-in and last activity, pages of 10. Add and Edit open one modal form with Bootstrap validation (the email must be unique); Delete asks in a confirmation modal; an owner cannot be deleted. Changes stay until the page reloads. One row template (`partials/user-row.njk`) renders the first page at build and serves the script.
- **Pricing page** (`pages-pricing.html`, menu Pages): a Monthly / Yearly switch with the saving, four plans with features and actions (the recommended one with a primary border and a colored shadow), a comparison table by groups and common questions in an accordion. Prices come from `src/_data/pricing.js`.
- **Notifications page** (`apps-notifications.html`, menu Apps): what happened in the workspace — a feed by day with filters (All, Unread, Mentions, System), unread marks, Mark all as read and remove; delivery settings per kind of notification (email, browser) with an email digest.
- **Bell in the header.** A new icon button (`aui-header-btn`, the same box as the mode toggle) with the unread count links to the Notifications page; the page keeps the count current. In the user menu, Team members opens the Users page and Billing opens Pricing.

### Fixed
- **Card titles in Indigo and Coffee.** The depth layer colors card titles with the full brand text color; at 75% it read at 3.8:1 in Indigo.
- **Readable header and sidebar color schemes (K36).** A scheme took its text tone from a fixed table made for Orange, so in most themes the text was dark on a dark background or white on a light end of the gradient (about 25 texts below WCAG AA per scheme). Now each theme gives every scheme a background, a text color and a logo: tokens `--aui-scheme-<color>-bg`, `-ink`, `-logo`, `-logo-dark`. The theme base computes them from the theme colors at build: it picks white or black text and moves both ends of the gradient until the text reads at 5.8:1 or more. Orange keeps its classic gradients and tones (danger now takes dark text); Cyberpunk keeps its dimmed neon gradients with light text. All 10 schemes pass in all themes and modes. The active menu link takes a lighter veil. On phones the folded header panel keeps the theme colors. The scheme swatches on the profile page show the scheme background. The `$aui-schemes` map of `_config.scss` is replaced by the list `$aui-scheme-colors`; `t.depth()` also takes a gradient as a pair of colors.

## [6.2.26] - 2026-10-20

Readable guest pages in every theme and a fix for an empty stored theme. Markup does not change; to get the theme fix, copy the new inline `<head>` script from `dist/pages-starter.html`.

### Fixed
- **Readable guest pages.** Sign in, sign up, password reset, errors and maintenance reach WCAG AA contrast in every theme and mode: Orange links in the light mode take a deeper orange (`#9a5f22`; buttons and accents stay `#eeaa55`) and its muted text is darker; the label of `btn-outline-secondary` takes the muted text color of the theme in every theme; the error digits on 403, 404 and 500 use `text-*-emphasis`; Garden takes a deeper green for the dark-mode primary (`#2a8250`).
- **Empty theme setting.** A stored empty or unknown theme no longer puts `data-aui-theme` on `<html>`: before, `data-aui-theme=""` switched the built-in Business look off. Copy the new inline `<head>` script from `dist/pages-starter.html`.

## [6.2.21] - 2026-10-19

A reference page for the colors of every theme. Markup and styles do not change.

### Added
- **Theme Palettes page** (`elements-palettes.html`, menu Elements): the palette of the current theme, read live from the page and updated on a theme or mode change; all 10 themes side by side in the light or the dark mode, each swatch on the surface of its own theme; a guide to the colors in classes (`text-bg-<color>` for the solid color, `bg-<color>` for the theme gradient, `-subtle` and `-emphasis`), CSS variables (`var(--bs-<color>)`, `rgba(var(--bs-<color>-rgb), a)`, overrides for all themes, one theme or the dark mode) and scripts (`ArchitectUI.token`, `rgba`, `chartDefaults`, `aui:theme-change`). A click copies a variable, a class, a HEX value or a code block. The values of all themes are collected at build from the theme sources (`src/_data/palettes.js`).

## [6.2.19] - 2026-10-19

Indigo and Coffee take the depth of Orange in their own colors; Coffee is compact. Markup does not change. A custom theme can use the same look with the new `depth()` and `compact()` mixins of the theme base.

### Changed
- **Indigo with depth.** Indigo (and Indigo Calathea on top of it) takes the look of Orange in its own colors: soft indigo-tinted shadows instead of border lines, a floating header and sidebar, a lifted active menu link, cards without a border line, uppercase card titles in the brand color, layered shadows on menus and overlays, vivid two-color gradients for `bg-primary`, `bg-success`, `bg-info`, `bg-warning`, `bg-danger`, `bg-secondary`, `bg-dark` (widgets, progress bars, badges). The rules come from the new `depth()` mixin of the theme base (`src/scss/themes/_theme.scss`), which any theme can include.
- **Coffee with depth, compact.** Coffee takes the same depth in coffee tones (warm brown shadows; caramel, olive, honey and terracotta gradients; an espresso `bg-dark`) and the compact sizes of Business: 14.5px root type, line height 1.45, denser table headers and cells, a smaller table font. Its radii stay larger than in Business. The sizes come from the new `compact()` mixin of the theme base; Business includes the same mixin and looks as before.

## [6.2.0] - 2026-10-19

Profile page and theme list in the header instead of the settings panel, smooth theme switching, new demo pages and print styles. The 6.1.0 markup keeps working. To follow: copy the new inline `<head>` script from `dist/pages-starter.html`, and remove the settings panel markup (the cog button and the `#auiSettings` Offcanvas) if your pages have it.

### Added
- **Theme list in the header.** The light/dark button is a button group with a dropdown of all themes (`aui-theme-switch`): a dot in the theme colors, the name, a check mark at the current theme, a link to all interface settings. Works with the keyboard (arrows, Enter, Escape) and in the folded header on phones.
- **My Profile page** (`pages-profile.html`): profile card, personal information form, and the Interface section with every setting of the settings panel (template `partials/interface-settings.njk`). The user menu links to it: "My profile" and "Interface settings" (`#interface`). A link to an anchor stops below the fixed header.
- **Buttons as setting controls.** `button[data-aui-setting][value]` sets the value on click; the current one gets `.active` and `aria-current`. New class `aui-theme-dot`.
- **Print styles.** The browser print shows only the page content: no header, sidebar, footer, path line or toasts; the page title without its icon. The print uses the light mode of the theme (dark-only themes keep their colors) and returns to the screen mode after it. Cards get a thin border instead of the shadow, scroll areas and wide tables print in full, colors print as on the screen, cards, table rows and charts do not break across pages; page margins 12 mm. New attribute `data-aui-print` opens the print dialog. The title actions of the demo pages have `d-print-none`.
- **Breadcrumbs in the header.** A page can show its path in the left part of the header instead of the quick links; the breadcrumb takes the header link colors and follows the header color schemes. The group and the parent item are dropdowns with the pages of their level, built from the menu (front matter `breadcrumbs: "header"` in the demo sources). The Bootstrap Components page shows it.
- **Path line.** `.aui-page-path`: a line of its own before the page title (or at the top of a page without one) with a Back link and the breadcrumb (with the same dropdowns) in small, quiet text. Next to the title icon the Back link is centered over the icon and the breadcrumb starts with the title text; without a Back link the breadcrumb starts at the left edge. On phones only the Back link. New attribute `data-aui-back`: the link returns to the previous page of the same site or follows its `href`. The My Profile page shows it (front matter `breadcrumbs: "title"`).
- **Markup inserted later renders by itself.** `architectui.js` watches the page: new `i[data-lucide]` icons are rendered and new Bootstrap tooltips and popovers are initialised without `ArchitectUI.refresh()` (it stays for code that needs the SVG at once). `architectui-auth.js` renders new icons the same way.
- **Theme colors for scripts.** `ArchitectUI.token(name)`, `ArchitectUI.rgba(name, alpha)` and `ArchitectUI.chartDefaults(Chart)`; the Charts, Operations Wall and Calendar pages use them.
- **Cache busting.** The demo pages link `architectui.css`, `architectui.js`, `architectui-auth.js` and the page scripts with `?v=<version>`; the theme stylesheet link keeps the same query.
- **Forms Wizard page** (`forms-wizard.html`, menu Forms): a workspace form in four steps — check of each step with Bootstrap validation, plan cards, an optional step with Skip, a review of all answers and a result screen. New component `aui-stepper` (numbered steps joined by a line; on phones only the current label).
- **Kanban Board page** (`apps-kanban.html`, new menu group Apps): five columns of release tasks with labels, due dates, checklists and people. Cards move by drag and drop or with a "Move to" menu (keyboard, touch screens); new cards, search, a label filter, column limits, a live region for screen readers. New classes `aui-kanban` (board, columns, list, card) and `aui-avatars` (overlapping photos).
- **Inbox page** (`apps-inbox.html`, menu Apps): customer conversations of a store support desk — folders with an unread counter, labels, search, the conversation as a chat, star, archive and a reply box (Enter sends). Three panes on wide screens; on phones the list and the conversation take turns. New classes `aui-chat`, `aui-chat-message` (`.is-own`), `aui-chat-bubble`.
- **Invoice page** (`pages-invoice.html`, menu Pages): an invoice of the store to Bright Labs (the customer from the Inbox page) — seller and logo, bill to, ship to, details, items, totals with a discount and VAT, bank details, Send and Print buttons. The print gives only the invoice, on one A4 page.
- **Error 403 and maintenance pages** (`pages-403.html`, `pages-maintenance.html`, menu Pages → Errors) on the guest frame: access denied with the signed-in account, Request access and Switch account; scheduled maintenance with the time window, progress of the work and status and support links. The maintenance menu label is long on purpose and wraps in the sidebar.
- **Bootstrap Icons tab on the Icons page.** The tab loads Bootstrap Icons 1.13.2 (stylesheet and icon list) from jsDelivr the first time it opens and shows all 2078 icons with search and copy (`<i class="bi bi-name"></i>`). Only this page loads the set; the theme uses Lucide. URLs in `cdn.json` (`bootstrapIcons`).
- **Map tiles note.** The Maps page says under the maps that the public OpenStreetMap tiles suit a demo and a working project sets its own tile server in `components-maps.js`.

### Changed
- **Settings on the profile page.** The frame has no floating cog button and no settings Offcanvas: every setting is in the Interface section of `pages-profile.html` (user menu → Interface settings). The classes `aui-settings` and `aui-settings-toggle` and the partial `settings.njk` are removed; `aui-swatch` and `aui-theme-option` stay for the settings controls. Pages with the old panel markup lose its styles: take the Interface section from `partials/interface-settings.njk`.
- **Theme loading and switching.** The inline `<head>` script adds the stored theme stylesheet with `blocking="render"` instead of `document.write`; until it loads, `data-aui-loading` on `<html>` keeps the page hidden (at most 3 s) and the page then fades in. A theme change loads the new stylesheet first and then cross-fades the page to the new colors with the View Transitions API; a light/dark change cross-fades too (also on guest pages). With `prefers-reduced-motion` or without View Transitions the change applies at once. Copy the new inline script from `dist/pages-starter.html`.
- **Sidebar 250px.** `--aui-sidebar-width` is 250px instead of 280px: more room for the content. Sub-items have narrower side padding, and a label longer than the sidebar wraps to a second line instead of running past the highlight.
- **Page head spacing.** One rule on every page: the content padding (`--aui-gutter`) above the first line, one gutter between the page title and the content or the section tabs, one gutter between the tabs and the content, half a gutter between the path line and the title. Before, the title stood two gutters above the content, and the shadow-style section tabs had 0.75rem above and below instead. The title no longer has negative margins and its own padding.
- **Pages menu in groups.** Starter Page, Invoice, "Authentication" (Sign In, Sign Up, Forgot Password), "Errors" (403, 404, 500, maintenance), My Profile.
- **Indigo Calathea.** The Indigo Photo theme is now Indigo Calathea with a new photo of Calathea orbifolia leaves (`assets/images/themes/indigo-calathea.jpg`, 1920 × 1280; `indigo-bg.jpg` is removed). The id stays `indigo-img`: stored settings and links to `themes/indigo-img.css` keep working.
- **New preview image.** `preview.png` in the README shows the current Analytics Dashboard in the default Business look (1600 × 1000).

### Fixed
- **Header with the search open.** The right part of the header (status badge, mode and theme buttons, user menu) keeps its place: the left part gives way. The current crumb shortens with an ellipsis; while the search is open and below 992 px only the home link and the current page stay; below 1400 px the open search hides the quick links. Before, the left part ran under the status badge.
- **Expanding field.** The open `aui-expand` field keeps its rounded shape: the field gets focus without scrolling its box (`focus({ preventScroll: true })`), and the box clips with `overflow: clip`. Before, the focus moved the field up by about 8px and its top edge was cut off.
- **Page animation and offcanvas.** During the page appear animation a hidden offcanvas inside the content no longer widens the page: the content clips its overflow while the animation runs.

## [6.1.0] - 2026-10-19

Wide screens and dense pages. The 6.0.0 markup keeps working; to follow the compact density, the content `div` of the frame takes the `aui-content` class.

### Added
- **Wide-screen breakpoints.** `3xl` from 1560 px and `4xl` from 1860 px continue the Bootstrap row after `xxl` for monitors 1600 and 1920 px wide; the thresholds allow for the scrollbar. Classes: `col-<bp>`, `col-<bp>-auto`, `col-<bp>-1…12`, `offset-<bp>-0…11`, `row-cols-<bp>-auto`, `row-cols-<bp>-1…8`, `g-`, `gx-`, `gy-<bp>-0…5`, `d-<bp>-none/block/flex/grid/inline-flex`.
- **Compact density.** `data-aui-density="compact"` on `<html>` and the "Density" group (Comfortable, Compact) in the settings panel: smaller frame gutter, card header, card and table cell padding, default row gutter, in every theme. Tokens `--aui-density` and `--aui-card-header-height`.
- **Operations Wall page** (`dashboard-operations.html`, menu Dashboards): a dense overview for 1600 and 1920 px monitors with the `3xl` and `4xl` columns, one column on phones. Key figures with sparklines, requests by region, regions, capacity, six service charts, an event table and the activity feed; period, region filter and auto-refresh.
- **Chart sizes.** `aui-chart-xs` (150px) and `aui-sparkline` (2.5rem trend line under a number).
- **Page appear animation.** The content area (`.aui-content`) appears on every page load: from transparent and 8px lower, 0.3 s, `ease-out`; token `--aui-page-animation` (`none` turns it off). Off with `prefers-reduced-motion` and in print. Tab panes fade in when a tab is switched, not on load, so the first tab appears together with the page.

### Changed
- **FullCalendar 7.** The Calendar demo uses FullCalendar 7.1.3 with its Bootstrap 5 theme plugin (`all/global.min.js`, `@fullcalendar/bootstrap5`, `skeleton.css`, `theme.css`) instead of 6.1.19. The plugin gives the calendar Bootstrap buttons and colors, so it follows every theme and mode; the theme draws the five plugin icons without Bootstrap Icons and keeps its gradients off the calendar tints. Event colors use `color` and `contrastColor` and follow theme changes. The theme rules for the FullCalendar 6 classes (`.fc`, `--fc-*`) are removed.
- **Content area padding.** The content `div` inside `main` is `div.flex-grow-1.aui-content` instead of `px-3 px-sm-4 pt-3 pt-sm-4`; the padding follows `--aui-gutter` and looks the same. Pages copied from 6.0.0 keep working with the old utilities, but follow the density only with the new class.
- **Libraries.** Lucide 1.59.0 (was 1.58.0); the icon list for the Icons page is rebuilt, 1891 icons.

### Fixed
- **`bg-<color>-subtle` in Orange.** The utilities are the pale Bootstrap background in the theme palette in every theme, so `badge bg-success-subtle text-success-emphasis` is readable in Orange. They no longer paint the `-subtle` gradients (in Orange the classic bright ones, in `dark-subtle` a dark one); the `--aui-gradient-<color>-subtle` tokens stay for custom CSS.
- **Badge in a card header on phones.** A `.badge.ms-auto` in `.card-header` keeps its shape below 576 px; only action blocks move to their own line.

## [6.0.0] - 2026-10-16

The markup of the frame and the demo pages is now standard Bootstrap 5.3 with a few `aui-` classes. It is not compatible with 5.x markup: take the frame from `dist/pages-starter.html` and the components from the demo pages.

### Breaking changes
- **Frame on Bootstrap markup.** Every frame part is Bootstrap markup with one root `aui-` class:
  - header — `navbar navbar-expand-md aui-header` with `navbar-brand` and `navbar-collapse`;
  - sidebar — `offcanvas-md` with `nav flex-column`;
  - page title, footer and settings panel — Bootstrap utilities;
  - logo — `a.aui-logo` with two images: the first for light backgrounds, the second for dark ones;
  - page section tabs — `ul.nav.aui-body-tabs`.
- **Pages on Bootstrap utilities.** Number widgets, card headers, button icons, nav and dropdown icons, dividers, font sizes and opacity use Bootstrap classes. Animated tabs are Bootstrap `nav-underline`.
- **Removed classes.**
  - Frame: `aui-header__*`, `aui-nav__*`, `aui-page-title__*`, `aui-footer__*`, `aui-user*`, `aui-logo__img*`, `aui-sidebar__panel`, `aui-scrollbar`, `aui-main`, `aui-main__inner`, `aui-settings__*`, `aui-segmented`, `aui-theme-grid`, `aui-swatches`.
  - Components: `aui-widget`, `aui-widget__*`, `aui-btn-wide`, `aui-btn-icon`, `aui-btn-icon-only`, `aui-card-border`, `aui-card-icon`, `aui-card-header-title`, `aui-card-actions`, `aui-card-tabs`, `aui-card-tabs-animated`, `aui-tabs-animated`, `aui-nav-icon`, `aui-nav-header`, `aui-nav-divider`, `aui-nav-btn`, `aui-dropdown-icon`, `aui-dropdown-shadow`, `aui-dropdown-hover-link`, `aui-list-borderless`, `aui-scroll-xs`, `aui-swatch-lg`, `aui-divider`, `aui-code`, `aui-fs-*`, `aui-opacity-*`, `aui-flex-2`.
- **Sidebar breakpoint.** The icon rail starts below 1200 px (Bootstrap `xl`) instead of 1250 px. The user name in the header shows from 1400 px (`xxl`).

### Changed
- **Theme files are small.** The shared rules of all themes are in `architectui.css` once. A theme file holds its variable values for both modes and the rules this theme alone needs: 4–5 KB instead of about 22 KB (Cyberpunk 9 KB instead of 27 KB).
- **Classic look in Orange.** The classic component rules (soft shadows, uppercase card titles and badges, small button text, brand-colored menus and focus rings) are in `themes/orange.css`. The look of every theme stays the same.
- **Icons in buttons.** An icon directly inside a `.btn` is drawn larger than the button text, without an extra class.
- **Divider.** `hr` uses the light theme line color.
- **Realistic demo content.** Orders, invoices, support and team data instead of lorem ipsum and generic labels. The user menu leads to profile, settings, billing and sign out. Carousel slides are charts drawn in the theme colors.
- **Getting the files.** README, `llms.txt`, `llms-full.txt` and `AGENTS.md` describe the `dist` archive of a GitHub release and jsDelivr by tag. `llms.txt` and `llms-full.txt` stay in the repository root; the README image is `preview.png`.
- Lucide 1.58.0, Sass 1.105.2.

### Added
- **Guest frame and `architectui-auth.js`.** Sign in, sign up, password reset and error pages have their own frame without the menu: logo, mode toggle, a brand panel from `lg`. Their own script runs the form steps: a demo request locks the form, then a 6-digit code from an authenticator app (sign in) or from the email (sign up), with paste, auto-fill, Backspace, a resend timer and an error state.
- **New pages.** `pages-starter.html` (empty page with the frame), `pages-login.html`, `pages-register.html`, `pages-forgot-password.html`, `pages-404.html`, `pages-500.html` in the "Pages" menu group; `components-bootstrap.html` with every Bootstrap 5.3 component on one page; `tables-datatables.html` with DataTables 3, Bootstrap 5 integration and Responsive from the CDN.
- **Tables.** A list of orders with search, filters, sorting links, selection, row actions and pages, and an empty state.
- **Native form fields.** Date, time, month, a date range, suggestions with `datalist`, number, color and file fields, and a file drop zone (`aui-dropzone`, `data-aui-dropzone`) that lists the chosen files.
- **Expanding field (`aui-expand`).** The animated search is a component for any place or form, with `data-aui-expand`, `data-aui-expand-toggle` and `data-aui-expand-close`.
- **Number font (`aui-number`).** Marks a widget number; themes can give it their own font.

### Fixed
- Headings in a carousel caption are white like the caption text.
- A `.visually-hidden` label in a table header inside `.table-responsive` no longer widens the page on a phone.
- The validation icon in a form field no longer slides across the field when it appears.
- Cyberpunk: outline secondary buttons are readable on black.
- The icon rail no longer shows a cut label next to the active menu item.

## [5.3.4] - 2026-10-16

### Changed
- Until Lucide draws an icon, its place shows a rounded neutral gray block, the same in every theme and mode.

## [5.3.3] - 2026-10-16

### Fixed
- The collapsed sidebar (icon rail) expands while a menu item has keyboard focus, not only on mouse hover.
- A "Skip to content" link appears above the header on the first Tab press and moves focus to the main content.
- Stacked progress bars use the Bootstrap 5.3 `progress-stacked` markup.
- Form demo pages no longer carry leftover `position-relative` classes.

### Changed
- Eleventy 3.1.7; `npm audit` reports no vulnerabilities.
- `package.json` is private: the theme is not an npm package.
- The unused `eslint.config.js` is removed; the build keeps two dev dependencies, Eleventy and Sass.

## [5.3.2] - 2026-10-15

### Added
- `llms.txt` and `llms-full.txt`: a description and a complete usage reference of the theme for AI agents; both are copied to `dist/`.
- `AGENTS.md`: a guide for agents that change this repository.

### Changed
- Toasts are filled with the status color again, with an icon per color; the header and the close button follow the text color.
- `text-bg-<color>` takes its text color from the theme contrast token for every color, not only the extra ones.
- The "PRO Version" menu section and all links to dashboardpack.com are removed. The page banner and `package.json` point to the GitHub repository; the MIT copyright notice stays.

### Fixed
- Large and Small modals open again.
- Tab button groups ("Alternate Tabs", "Tabs Variations") are one capsule: only the outer ends are rounded.
- Tabs in a card header stay on one line and no longer spill out of the header.

## [5.3.1] - 2026-10-15

### Fixed
- Card borders in themes stay visible above flush list groups; colored card shadows (`aui-card-shadow-*`) show in themes.
- Dashboard Boxes: four-tile groups fill one row on wide screens, rows no longer stick out of their cards, gradient tiles keep white text readable.
- Cards page: the active page tab is highlighted, text and buttons use Bootstrap 5 card markup.
- List groups: badges sit at the right edge; link lists use valid markup.
- Form checks use Bootstrap 5 markup (input next to label), so long labels wrap under the text.
- Popovers have titles and use `data-bs-container`; accordion buttons point to their panels.
- Content under shadow tabs keeps clear of the active tab shadow.

## [5.3.0] - 2026-10-15

### Changed
- **Business is the default look.** `architectui.css` draws it alone, without a theme stylesheet. Its rules switch off while `data-aui-theme` is set on `<html>`, so every other theme renders as before.
- **The classic look is the Orange theme** (`themes/orange.css`, id `orange`): orange accents, color gradients and soft shadows. Classic colors, gradients and shadows moved from `architectui.css` into this file.
- `themes/blue.css` is removed. A stored choice of `blue` is dropped, and the page opens in the built-in Business look.
- Fixed themes without the settings panel need `data-aui-theme="<id>"` on `<html>` next to the stylesheet link.

### Fixed
- The sidebar burger draws a proper cross when the menu is collapsed or open.
- Sidebar icons are 20px (`--aui-nav-icon-size`) and centered in their row; the caret is centered too.
- Icon names in the icon catalog wrap instead of being cut off.

## [5.2.0] - 2026-10-15

### Changed
- **Classic scripts instead of ES modules.** `architectui.js` and the page scripts load with `<script defer>`, so the demo works from any folder of a local server and from disk (`file://`). `type="module"` still works for `architectui.js`.
- `refresh()` is available as `window.ArchitectUI.refresh()`; this is the only global the theme script adds. The `import { refresh }` export is removed.
- Chart.js and Leaflet load as UMD bundles from the CDN. The import map is removed.
- Page front matter: the page script key is `script` (was `module`).

## [5.1.0] - 2026-10-15

### Added
- **Visual themes.** Nine switchable themes on top of the classic look: Indigo, Indigo Photo, Coffee, Garden, Warm, Business, Operations, Space and Cyberpunk (dark only). Each theme is one stylesheet in `dist/themes/` and changes palette, typography, radii, shadows and table density.
- **Mode "System"** next to Light and Dark. The page follows the operating system and reacts to its changes.
- Light/dark toggle button in the header.
- Theme picker in the settings panel: a grid of dots with the two accents of each theme.
- `aui:theme-change` event on `document` after a theme or mode change. Charts re-render with the new colors.
- Screenshot and console tools accept saved settings, so each theme can be checked in both modes.

### Changed
- Settings are applied before the first paint, including the theme stylesheet; switching at runtime swaps the stylesheet without a flash.
- ArchitectUI gradients (`bg-primary` and friends) are CSS variables (`--aui-gradient-*`), so themes can recolor them.
- The stored setting `theme: "light" | "dark"` from 5.0 is migrated to `mode` automatically.

## [5.0.0] - 2026-10-15

A rewrite on top of CDN Bootstrap 5.3 with the same look. This release is not backward compatible with 4.x markup.

### Breaking changes
- **Theme classes use the `aui-` prefix.** `widget-content` is now `aui-widget`, `btn-shadow` is `aui-btn-shadow`, `tabs-animated` is `aui-tabs-animated` and so on. Bootstrap 4 leftovers (`data-toggle`, `custom-control`, `dropdown-menu-right`, `dropright`) are replaced with Bootstrap 5 equivalents.
- **New frame markup.** The sidebar is a responsive Bootstrap Offcanvas, submenus are Bootstrap Collapse, layout modes are attributes on `<html>` instead of classes on `.app-container`.
- **Icons are Lucide** (`<i data-lucide="name">`). FontAwesome, Linearicons, Pe7 and Material Design Icons are removed.
- **Release files changed.** `dist/` now contains `architectui.css`, `architectui.js`, the demo pages and one script per page that needs it. `app.css`, `main.js`, `demo.js`, `toastr.js`, `scrollbar.js`, `fullcalendar.js`, `maps.js` and `chart_js.js` are gone.
- **Logo files.** `logo.png` is the logo for light backgrounds, `logo-on-dark.png` for dark ones (was `logo-inverse.png` and `logo.png`).

### Added
- Dark theme through `data-bs-theme="dark"`.
- Settings panel: fixed header, sidebar and footer, dark theme, page tab style, header and sidebar color schemes. Choices persist in `localStorage`.
- All theme values are CSS variables: recolor the theme without rebuilding.
- Lucide icon catalog with search and copy on click.
- Maps page on Leaflet and OpenStreetMap: world map, multiple markers, popups and controls. No API key needed.
- Toast configurator built on Bootstrap Toast.
- Logo of any shape fits the header without changes.

### Changed
- Build: Eleventy 3 for pages and the Sass CLI for styles instead of webpack, Babel and Handlebars. Two dev dependencies in total.
- Bootstrap, Lucide, Chart.js, FullCalendar and Leaflet load from jsDelivr. All URLs live in `src/_data/cdn.json`.
- Charts, calendar and notifications load only on their own pages.
- The theme stylesheet shrank from 142 KB to about 72 KB; the theme script is under 150 lines.

### Removed
- jQuery, metisMenu, perfect-scrollbar, toastr, animate-sass, hamburgers, Google Maps and Mapbox.
- The vendored Bootstrap 5.3.7 SCSS copy.

### Fixed
- Empty "Animate.css", "Solid Colors" and "Gradient Colors" sections on the Utilities page.
- Empty pie and doughnut charts, collapsed dashboard line chart.
- Invisible page-title and card-header icons that used FontAwesome 4 names or missing gradients.
- Dropleft and dropright menus that opened downwards.
- Logo path that only worked when the site lived under `/dist/`.

## [4.3.0] - 2025-09-17

### Major Updates
- **Complete dependency refresh** - All packages updated to September 2025 versions
- **FontAwesome 7 migration** - Successfully upgraded from FontAwesome 6.7.2 to 7.0.1
- **Latest build tools** - Webpack, Sass, and ESLint updated to current versions
- **Zero vulnerabilities** - All security issues resolved with latest dependencies

### Package Updates

#### Production Dependencies
- **@fortawesome/fontawesome-free**: 6.7.2 → 7.0.1 (major version upgrade)
- **Bootstrap**: 5.3.7 → 5.3.8
- **@fullcalendar/core**: 6.1.17 → 6.1.19
- **@fullcalendar/daygrid**: 6.1.17 → 6.1.19
- **@fullcalendar/interaction**: 6.1.17 → 6.1.19
- **@fullcalendar/list**: 6.1.17 → 6.1.19
- **@fullcalendar/timegrid**: 6.1.17 → 6.1.19
- **@googlemaps/js-api-loader**: 1.16.8 → 1.16.10

#### Development Dependencies
- **@babel/core**: 7.27.4 → 7.28.4
- **@babel/preset-env**: 7.27.2 → 7.28.3
- **ESLint**: 9.29.0 → 9.35.0
- **Sass**: 1.89.2 → 1.92.1
- **Webpack**: 5.99.9 → 5.101.3
- **Mini CSS Extract Plugin**: 2.9.2 → 2.9.4

### Technical Improvements
- **FontAwesome 7 Integration**: Updated SASS configuration to use new module syntax with proper namespacing
- **Build Optimization**: Both development and production builds compile successfully
- **Compatibility**: Resolved variable conflicts between FontAwesome 7 and Bootstrap 5
- **Font Loading**: Fixed webfont path resolution for FontAwesome 7

### Bug Fixes
- Fixed FontAwesome 7 font path issues with new Sass module configuration
- Resolved SASS variable conflicts by namespacing FontAwesome imports
- Corrected webfont loading paths for production builds

### Verified Functionality
- Development server runs without errors
- Production build completes successfully
- All HTML pages generate properly
- FontAwesome icons render correctly on all pages

## [4.2.0] - 2025-06-20

### 🚀 Major Updates
- **Complete dependency modernization** - All npm packages updated to latest versions
- **SASS future-proofing** - Migrated from deprecated SASS syntax to modern `@use` modules
- **Enhanced security** - Fixed all security vulnerabilities (0 vulnerabilities detected)
- **Modern tooling** - Upgraded to ESLint v9 with flat configuration
- **Performance optimizations** - Reduced bundle sizes and improved build times

### ✨ New Features
- **Enhanced Maps Component** - Completely rebuilt with 5 interactive map examples
  - CSS-based satellite terrain map
  - Interactive demo with animations
  - Multiple cities markers display
  - Custom gradient styling
  - Interactive controls demo
- **Improved Favicon Support** - Proper favicon serving and webpack integration
- **Better Development Experience** - Clean console output with no 404 errors

### 🔧 Technical Improvements
#### Package Updates
- **Bootstrap**: 5.3.5 → 5.3.7
- **Chart.js**: 4.4.8 → 4.5.0
- **Webpack**: 5.88.2 → 5.99.9
- **Babel Core**: 7.26.10 → 7.27.4
- **CSS Loader**: 6.11.0 → 7.1.2
- **SASS**: 1.86.3 → 1.89.2
- **ESLint**: 8.57.1 → 9.29.0
- And 15+ other package updates

#### SASS Modernization
- Replaced deprecated `map-merge()` with `map.merge()`
- Replaced deprecated `divide()` with `math.div()`
- Added modern `@use` statements for SASS modules
- Eliminated 500+ deprecation warnings in custom theme files
- Future-proof code ready for SASS 3.0

#### Dependency Optimization
- **Removed**: `moment.js` (unused, 67KB bundle reduction)
- **Replaced**: `gmaps` with modern `@googlemaps/js-api-loader`
- **Enhanced**: Security with latest package versions
- **Maintained**: Full backward compatibility

### 🐛 Bug Fixes
- Fixed broken maps implementation that relied on expired API keys
- Resolved favicon 404 errors in development
- Eliminated console source map warnings
- Fixed webpack dev server security vulnerabilities

### 💼 Developer Experience
- **ESLint v9** with modern flat config format
- **Zero security vulnerabilities** in all dependencies
- **Clean console output** during development
- **Optimized build process** with faster compilation
- **Better error handling** in map components

### 📦 Bundle Improvements
- **Reduced main bundle size**: 1.87 MiB → 1.82 MiB (50KB improvement)
- **Eliminated unused dependencies** for better performance
- **Modern ES modules** for better tree-shaking
- **Optimized asset loading** with proper webpack configuration

### 🎯 Migration Benefits
- **Future-proof codebase** ready for upcoming SASS and build tool updates
- **Enhanced security posture** with latest dependency versions
- **Improved development workflow** with modern tooling
- **Better performance** through optimized dependencies
- **Clean code architecture** following modern best practices

## [4.0.0] - 2023-10-17

### Changed
- Migrated to React v18
- Upgraded all dependencies

## [3.1.0] - 2022-08-22

### Changed
- Updated the library

## [3.0.0] - 2022-04-05

### Changed
- Migrated to WebPack v5

## [2.0.0] - 2021-09-07

### Changed
- Migrated to Bootstrap v5

## [1.2.3] - 2021-05-19

### Added
- Added mapbox-gl plugin

### Fixed
- Resolved alert dismissing issue
- Resolved card image issue
- Resolved Fontawesome icon issue

## [1.0.0] - 2019-01-17

### Added
Initial release of the project.
