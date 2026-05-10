# OpenWeatherMap API Docs

Unofficial, developer-focused documentation for the [OpenWeatherMap REST API](https://openweathermap.org/api) — built as a Technical Writing portfolio sample by [Michel Silveira](https://michelgss.github.io/portfolio/).

**Live site:** https://michelgss.github.io/openweather-docs/

---

## About

This project showcases technical writing skills through a fully structured API documentation site. It is not affiliated with or endorsed by OpenWeatherMap.

The documentation follows the **Diátaxis framework**, organizing content into four distinct types:

| Type | Purpose |
|---|---|
| Tutorials | Step-by-step learning (weather dashboard, CLI tool) |
| How-to guides | Task-oriented instructions (fetch weather, handle errors) |
| Reference | API endpoints, parameters, error codes, rate limits |
| Explanation | Conceptual material (architecture, units, data model) |

## Stack

- [Docusaurus 3](https://docusaurus.io/) — static site generator
- TypeScript + React
- GitHub Actions — automated deploy to GitHub Pages
- Custom CSS with dark/light mode and responsive layout

## Local Development

```bash
npm install
npm start
```

Opens at `http://localhost:3000/openweather-docs/`. Changes are reflected live.

## Build

```bash
npm run build
```

Generates static files into `build/`. Deploy is handled automatically via GitHub Actions on every push to `main`.

## Author

**Michel Silveira** — Technical Writer  
Portfolio: https://michelgss.github.io/portfolio/  
GitHub: https://github.com/MichelGSS
