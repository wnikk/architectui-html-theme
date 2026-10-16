# AGENTS.md

Guide for AI agents that build pages or applications with ArchitectUI. The complete reference is [`llms-full.txt`](llms-full.txt); the short index is [`llms.txt`](llms.txt).

## What it is

ArchitectUI is a ready-made admin theme for Bootstrap 5.3: one stylesheet and one small script on top of Bootstrap and Lucide icons loaded from a CDN. Standard Bootstrap 5 markup gets a finished, consistent look: page frame (header, sidebar, page title, footer), every Bootstrap component, dark mode and ten switchable visual themes. It is a set of styles and basic scripts for markup, an extended Bootstrap base. It is not a framework and not an npm package, and it needs no build step.

## Files

Take them from `dist/`:

| File | Purpose |
|------|---------|
| `architectui.css` | The theme with the default look (Business) |
| `architectui.js` | Sidebar collapse, settings panel, theme and mode switching, header search, icon rendering |
| `themes/<id>.css` | Optional visual themes, loaded after `architectui.css` |
| `assets/images/` | Logos and images used by the frame |
| `index.html` and other pages | Complete demo pages to copy markup from |

Bootstrap 5.3 (CSS and bundle JS) and Lucide come from a CDN; the exact URLs are in the `<head>` of `dist/index.html`.

## Build a page

1. Copy `dist/index.html`. Keep the `<head>` and the frame; replace the content after the page title inside `main`.
2. Write standard Bootstrap 5.3 markup: grid, cards, tables, forms, navs, modals, toasts. The theme already styles them.
3. Build layout with Bootstrap utilities. Add `aui-` classes only for what Bootstrap does not have (number font, colored card shadows, scroll areas, chart heights). The list is in `llms-full.txt`, section 8.
4. Icons: `<i data-lucide="name"></i>`. After inserting markup dynamically, call `ArchitectUI.refresh(element)`.
5. Keep paths relative and scripts as classic `<script defer>`: the pages then work from any folder and from disk.

## Settings, themes, modes

- Layout modes are attributes on `<html>`: `data-aui-header`, `data-aui-sidebar`, `data-aui-footer`, `data-aui-sidebar-collapsed`, `data-aui-tabs`, `data-aui-header-scheme`, `data-aui-sidebar-scheme`.
- Theme: `data-aui-theme="<id>"` plus `themes/<id>.css`. No attribute means the default Business look.
- Mode: `data-aui-mode` (`light`, `dark`, `system`) becomes `data-bs-theme`.
- The settings panel stores choices in `localStorage` under `architectui`; the inline script in `<head>` applies them before the first paint.
- Event `aui:theme-change` on `document` fires after a theme or mode change.

## Customize

- Colors, radii, shadows and sizes are CSS variables (`--bs-*`, `--aui-*`). Override them in your own stylesheet loaded after `architectui.css`; no rebuild is needed.
- For your own styles, use the variables instead of fixed colors, so themes and dark mode keep working.
- A new visual theme is one Sass file in `src/scss/themes/`: a palette for both modes and the rules only this theme needs. Build it with `npm install` and `npm run build` (Node 22 or newer). Check it on `components-bootstrap.html`: every Bootstrap component is on that page.

## Rules

- Use Bootstrap 5.3 markup. Do not use Bootstrap 4 classes or attributes (`data-toggle`, `ml-*`, `custom-control`, inputs inside labels).
- Do not add Tailwind, jQuery, Font Awesome or another CSS framework; they break the consistent look.
- Every tab list has an active first tab; every `data-bs-target` points to an existing element; every form check has a label with `for`.
- Check the result visually in the browser: light and dark mode, the default look and at least one other theme, phone and desktop widths. A page without console errors can still look wrong.
