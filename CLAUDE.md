# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Missale Romanum — a Catholic Missal app originally built for Cordova (mobile) that also runs as a static web app. No build step; raw HTML/CSS/JS served as-is. Supports 7 languages and the full Roman Catholic liturgical calendar.

The actual app lives inside the `missale/` directory (this is the Cordova `www/` folder).

## Running Locally

```bash
cd missale
npm run dev          # http-server on port 5173, no caching
# or
python3 -m http.server 5173
```

Entry point: `index.html` → redirects to `misal_v2/feria_actual.html`

A local HTTP server is required because the app loads HTML fragments via AJAX (fails on `file://`).

## Deployment

Static hosting on Vercel (`vercel.json` at root). No build step — the `missale/` directory is deployed directly.

## Architecture

### Core JS Files (all in `misal_v2/`)

- **`feria_liturgica.js`** (~6000 lines) — The liturgical calendar engine. Key function: `dia_liturgico("D.M.YYYY")` calculates the liturgical day, feast, readings, and mass for any date. Computes Easter (Computus), moveable feasts, 3-year lectionary cycle (A/B/C), and even/odd year readings. Sets global state arrays `mienlace_misa`, `mienlace_lecturas`, `mienlace_santo` with paths to content files.
- **`mis_funciones_misal.js`** (~3500 lines) — UI functions: tab navigation (`pinta_tabs`), button generation (`pinta_botones`), language switching (`cambialengua`), content loading via AJAX into hidden buffer divs (`#mibuffer1-6`), iScroll setup, localStorage preferences (`dime_pref`/`pon_pref`).
- **`mis_funciones_devoc.js`** — Cordova web shims (stubs for `navigator.app.exitApp`, `plugins.insomnia`, synthetic `deviceready` event) and ES5 polyfills for Kindle support.
- **`home_clean.js`** — Modern calendar UI logic: `renderCalendar()`, `handleDayClick()` → calls `dia_liturgico()`, `handleFiatClick()` → calls `ejecuta_fiat()`.

### Execution Flow

```
index.html → feria_actual.html → cordova_loader.js (detects web vs Cordova)
→ deviceready → renderCalendar() → user picks date → dia_liturgico("D.M.YYYY")
→ pintacuadro() (select dropdowns) → "FIAT" button → prepara_misal()
→ loads content into localStorage → navigates to misal_todo.html (tab view)
```

### HTML Pages (in `misal_v2/`)

| Page | Purpose |
|------|---------|
| `feria_actual.html` | Primary entry — modern calendar UI |
| `misal_todo.html` | Tab-based mass text viewer (Ordinario/Tempora/Santos/Comunes/Lecturas/Prefacios/PE) |
| `devocionario.html` | Devotions and litanies |
| `oracoes.html` | Prayers database |
| `preferencias.html` | Settings (font, language, display) |

### Multi-Language System

Seven parallel directories with identical structure under `misal_v2/`:

`m_cast` (Spanish), `m_latin`, `m_engl`, `m_fran`, `m_germ`, `m_ital`, `m_port`

Each contains: `santos/`, `tiempos/`, `ordinario/`, `plegarias_euc/`, `prefacios/`, `comunes_votivas/`, `lecturas/`

Language is selected via `mipreferencia["misal_pral"]` (localStorage). Index maps to: `idiomas = ["latin", "cast", "engl", "germ", "ital", "port", "fran"]`.

`m_estructura/` holds shared HTML structure/templates that are combined with language-specific content at runtime.

### Content Loading Pattern

- Content files are HTML fragments loaded via AJAX into hidden buffer divs
- Anchor links (e.g., `#A141`) target specific sections within fragment files
- Loaded content is cached in localStorage with keys like `lht501`, `lhs501`
- `prepara_misal()` in `feria_liturgica.js` orchestrates the async loading

### CSS Files (in `misal_v2/`)

- `misal.css` — Core missal styling (brand color: `#7a0f12`)
- `misal_ui_moderno.css` — Modern theme overlay with CSS variables
- `home_clean.css` — Calendar interface (Shadcn-inspired design tokens)
- `devoc.css` — Devotional pages
- `feria_actual.html` has a large embedded `<style>` block with its own design system

### Cordova / Web Dual Runtime

`cordova_loader.js` detects environment:
- **Web** (HTTP/HTTPS/Kindle): loads `cordova_web_shim.js` (stub APIs + synthetic `deviceready`)
- **Cordova** (`file://`): loads real `cordova.js` + `cordova_plugins.js`

### Key Patterns

- **Global state**: `mienlace_misa/lecturas/santo` arrays, `miciclo` (cycle), `tipoanio2` (par/impar)
- **Preferences**: `dime_pref(key, default)` / `pon_pref(key, value)` wrapping localStorage
- **Date format**: Always `"D.M.YYYY"` (no zero-padding)
- **No framework**: jQuery for DOM/AJAX, everything else is vanilla JS
- **Kindle compat**: Silk browser detection, native scrolling fallback, ES5 polyfills
