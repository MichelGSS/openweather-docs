# OpenWeatherMap API Docs

Unofficial, developer-focused documentation for the [OpenWeatherMap REST API](https://openweathermap.org/api) — designed and written as a technical writing and developer experience portfolio sample by [Michel Silveira](https://michelgss.github.io/portfolio/).

**Live site:** [https://michelgss.github.io/openweather-docs/](https://michelgss.github.io/openweather-docs/)

> **Note:** This repository is an independent portfolio project and is not affiliated with or endorsed by OpenWeatherMap.

---

## Information architecture (Diátaxis)

The documentation separates content by developer intent using the [Diátaxis framework](https://diataxis.fr/), preventing step-by-step lessons, task recipes, technical specifications, and conceptual background from blurring together:

| Section | Orientation | Purpose | Key pages |
| :--- | :--- | :--- | :--- |
| **Getting started** | Onboarding | Configure local prerequisites, generate an API key, and send a verified first request | `prerequisites`, `get-api-key`, `first-request` |
| **Tutorials** | Learning-oriented | Build complete, runnable Node.js and Python weather tools from scratch | `weather-dashboard`, `weather-cli` |
| **How-to guides** | Task-oriented | Solve concrete integration tasks such as geocoding, forecasts, error recovery, and rate limits | `get-current-weather`, `get-forecast`, `use-coordinates`, `handle-errors`, `rate-limiting` |
| **API reference** | Information-oriented | Consult exact HTTP endpoints, query parameters, status codes, rate limits, and JSON schemas | `authentication`, `current-weather`, `forecast`, `geocoding`, `error-codes`, `rate-limits` |
| **Concepts** | Understanding-oriented | Understand observation pipelines, measurement units, and REST request flows | `how-weather-data-works`, `units`, `architecture` |
| **Troubleshooting** | Diagnostic | Resolve `401`, `404`, and `429` responses, review common questions, and find support | `common-errors`, `faq`, `getting-help` |

---

## Editorial standards

All prose, headings, UI microcopy, and code comments follow the **Microsoft Writing Style Guide**:

- **Sentence-style capitalization** across page titles, section headings, navigation items, tabs, and buttons.
- **Direct, active, second-person voice** ("you") focused on developer outcomes without filler words.
- **Scannable reference tables** documenting parameter types, constraints, defaults, and units.
- **Runnable multi-language code samples** in `curl`, Node.js (native `fetch`), and Python (`requests`) using environment variables (`OPENWEATHER_API_KEY`) instead of hardcoded credentials.

---

## Interactive developer experience

- **API playground (`/playground`):** Supports four endpoints (`Current weather`, `5-day forecast`, `Direct geocoding`, and `Reverse geocoding`) with coordinate (`lat`, `lon`) and city (`q`) lookup modes, location presets, live latency telemetry (`ms`), and auto-updating `curl`, Node.js, and Python snippets.
- **Zero-key sample mode:** Visitors without an active OpenWeatherMap API key can inspect schema-accurate `200 OK`, `401 Unauthorized`, `404 Not Found`, and `429 Too Many Requests` payloads directly in the playground.
- **Multi-language homepage terminal:** Interactive `curl`, Node.js, and Python preview paired with a realistic `200 OK` JSON response.
- **Instant geolocation weather demo:** Client-side widget powered by Open-Meteo and Nominatim reverse geocoding that requires zero sign-up or API keys.
- **Offline full-text search and architecture diagrams:** Indexed client-side search (`@easyops-cn/docusaurus-search-local`) and theme-aware Mermaid diagrams (`@docusaurus/theme-mermaid`).

---

## Design system and tech stack

Built around a monochrome **"Terminal meets editorial"** aesthetic (`#0A0A0A` dark mode and `#FFFFFF` light mode) with WCAG AA contrast, keyboard focus indicators, explicit form label associations, and `prefers-reduced-motion` support:

- **Framework:** [Docusaurus 3.10](https://docusaurus.io/) + React 19 + TypeScript 6 (`strict: true`)
- **Typography:** `Space Grotesk` (headings), `Plus Jakarta Sans` (prose and UI), and `IBM Plex Mono` (code, endpoints, and telemetry)
- **Syntax highlighting:** Dual-theme Prism (`github` in light mode, `vsDark` in dark mode) for `bash`, `python`, `json`, `powershell`, `http`, and `typescript`
- **CI/CD:** Automated production builds with strict broken-link enforcement (`onBrokenLinks: 'throw'`, `onBrokenMarkdownLinks: 'throw'`) deployed to GitHub Pages through GitHub Actions

---

## Repository structure

```text
openweather-docs/
├── .github/workflows/deploy.yml   # Automated GitHub Pages CI/CD pipeline
├── docs/                          # Diátaxis-structured Markdown documentation
│   ├── intro.md
│   ├── getting-started/
│   ├── tutorials/
│   ├── how-to/
│   ├── reference/
│   ├── concepts/
│   └── troubleshooting/
├── src/
│   ├── components/
│   │   ├── GeoWeather/            # Zero-key browser geolocation weather demo
│   │   ├── WeatherWidget/         # Live OpenWeatherMap lookup widget
│   │   └── Reveal/                # SSR-safe IntersectionObserver scroll reveal
│   ├── css/custom.css             # Monochrome design tokens, tables, tabs, and typography
│   └── pages/
│       ├── index.tsx              # Landing page, Diátaxis showcase, and multi-language terminal
│       └── playground.tsx         # Interactive 4-endpoint API explorer and code generator
├── static/img/                    # Custom SVG brand mark, favicon, and Open Graph card
├── docusaurus.config.ts           # Site configuration, fonts, Prism, Mermaid, and search
└── sidebars.ts                    # Autogenerated documentation sidebar
```

---

## Local development

Install dependencies and start the local development server (Node.js 20 or later):

```bash
npm install
npm start
```

The development server opens at `http://localhost:3000/openweather-docs/` with hot module replacement.

### Type checking and production build

```bash
# Run strict TypeScript validation
npm run typecheck

# Build static production assets into ./build
npm run build
```

---

## Author

**Michel Silveira** — Technical writer  
- **Portfolio:** [https://michelgss.github.io/portfolio/](https://michelgss.github.io/portfolio/)  
- **GitHub:** [https://github.com/michelgss](https://github.com/michelgss)
