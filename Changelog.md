# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

Work towards 6.0.0. The frame markup changes without backward compatibility.

### Changed
- **Frame on Bootstrap markup.** Every frame part is Bootstrap markup with one root `aui-` class:
  - header — `navbar navbar-expand-md aui-header` with `navbar-brand` and `navbar-collapse`;
  - sidebar — `offcanvas-md` with `nav flex-column`;
  - page title, footer and settings panel — Bootstrap utilities.
- **Removed classes.** `aui-header__*`, `aui-nav__*`, `aui-page-title__*`, `aui-footer__*`, `aui-user*`, `aui-logo__img*`, `aui-sidebar__panel`, `aui-scrollbar`, `aui-main`, `aui-main__inner`, `aui-settings__*`, `aui-segmented`, `aui-theme-grid`, `aui-swatches`.
- **Sidebar breakpoint.** The icon rail now starts below 1200 px (Bootstrap `xl`) instead of 1250 px. The user name in the header shows from 1400 px (`xxl`), so the right-hand group has room for status badges and other items.
- **Logo markup.** The logo is `a.aui-logo` with two images: the first for light backgrounds, the second for dark ones.
- **Page section tabs.** Page tabs are `ul.nav.aui-body-tabs`; `aui-tabs-animated` is no longer needed on them.
- **Demo pages on Bootstrap utilities.** Number widgets, card headers, button icons, nav and dropdown icons, dividers, font sizes and opacity use Bootstrap classes. The look stays the same.
- **Animated tabs.** Bootstrap `nav-underline` gets the moving bar of the theme; it replaces `aui-tabs-animated` and `aui-card-tabs-animated`.
- **Icons in buttons.** An icon directly inside a `.btn` is drawn larger than the button text, without an extra class.
- **Divider.** `hr` uses the light theme line color.
- **Removed classes.** `aui-widget`, `aui-widget__*`, `aui-btn-wide`, `aui-btn-icon`, `aui-btn-icon-only`, `aui-card-border`, `aui-card-icon`, `aui-card-header-title`, `aui-card-actions`, `aui-card-tabs`, `aui-card-tabs-animated`, `aui-tabs-animated`, `aui-nav-icon`, `aui-nav-header`, `aui-nav-divider`, `aui-nav-btn`, `aui-dropdown-icon`, `aui-dropdown-shadow`, `aui-dropdown-hover-link`, `aui-list-borderless`, `aui-scroll-xs`, `aui-swatch-lg`, `aui-divider`, `aui-code`, `aui-fs-*`, `aui-opacity-*`, `aui-flex-2`.

### Added
- **Number font (`aui-number`).** Marks a widget number; themes can give it their own font.
- **Expanding field (`aui-expand`).** The animated search is now a component for any place or form: header search, search above a table, a password field. It uses `data-aui-expand`, `data-aui-expand-toggle` and `data-aui-expand-close`. An empty toggle draws a magnifier, a toggle with an icon shows that icon.
- **Status badge example** in the header.

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
