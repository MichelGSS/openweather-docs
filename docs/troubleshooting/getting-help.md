---
sidebar_position: 3
description: Redact credentials safely, isolate SDK bugs with curl, check official OpenWeatherMap documentation, and contact upstream support.
---

# Getting help

If you encounter an issue that isn't resolved by [Common errors](./common-errors) or the [FAQ](./faq), gather a clean diagnostic snapshot before searching community trackers or opening an upstream support ticket.

## Prepare diagnostic details before asking

:::warning Redact your API key before sharing logs
Never paste a live `appid` value into GitHub issues, Stack Overflow questions, forum threads, or screenshots. Replace your credential with `appid=REDACTED` in every URL and log snippet before publishing. If you accidentally expose a live key in public, revoke it immediately in the [OpenWeatherMap API keys dashboard](https://home.openweathermap.org/api_keys) and generate a replacement.
:::

Collect these four diagnostic details before posting a question or filing a bug report:

1. **Isolate SDK and browser layers with a minimal `curl` request**: Run the failing query directly from a terminal using `curl -i` against `https://api.openweathermap.org`. If `curl` returns `200 OK` while your application fails, the bug lies in your HTTP client configuration, environment variable loading, third-party SDK wrapper, or browser CORS headers rather than OpenWeatherMap's servers:

   ```bash
   curl -i "https://api.openweathermap.org/data/2.5/weather?lat=51.5074&lon=-0.1278&units=metric&appid=REDACTED"
   ```

2. **Record the exact endpoint URL and query parameters**: Include the full versioned path (`/data/2.5/weather`, `/data/2.5/forecast`, or `/geo/1.0/direct`) and every query parameter (`lat`, `lon`, `q`, `zip`, `units`, `lang`) with `appid=REDACTED`.
3. **Capture the HTTP transport status and raw response body**: Copy both the HTTP status line (for example, `HTTP/2 401` or `HTTP/2 429`) and the exact JSON payload (or gateway HTML error text) returned by the server.
4. **Note the UTC timestamp of the failed call**: Record when the failure occurred in ISO 8601 UTC format (such as `2026-11-18T14:25:00Z`) so support engineers can correlate edge gateway logs and per-minute quota windows.

## Check official OpenWeatherMap resources

This portfolio documentation covers the free-tier Weather API 2.5 and Geocoding API 1.0 surface. For paid plans, historical archives, weather maps, and upstream policy updates, consult OpenWeatherMap's official documentation:

- [Official OpenWeatherMap API documentation](https://openweathermap.org/api) for the complete catalog of free, pay-as-you-go, and enterprise weather APIs
- [OpenWeatherMap pricing and plan comparison](https://openweathermap.org/price) for endpoint availability, call quotas, and commercial licensing terms across tiers
- [OpenWeatherMap official FAQ](https://openweathermap.org/faq) for account management, billing administration, and subscription troubleshooting

## Search community forums and SDK repositories

When a minimal `curl` command succeeds in your terminal, the root cause almost always involves language-specific HTTP handling (such as JavaScript, TypeScript, Python, or Go), UI framework lifecycle hooks (such as React, Vue, or Next.js), or a community wrapper library:

- Search [Stack Overflow questions tagged `openweathermap`](https://stackoverflow.com/questions/tagged/openweathermap) for solutions to framework integration patterns, async state bugs, and coordinate formatting issues.
- If you use a third-party client wrapper (such as `pyowm` for Python or community TypeScript SDKs), search the **Issues** tab of that library's GitHub repository to check whether the wrapper targets deprecated endpoint paths or requires a configuration flag for Weather API 2.5.

## Contact OpenWeatherMap support

If you reproduce a persistent `5xx` upstream error with `curl`, experience `401 Unauthorized` on `/data/2.5/weather` more than 2 hours after activating a key, or need assistance with account billing and enterprise quotas, contact the vendor's support team directly through the [OpenWeatherMap support center](https://home.openweathermap.org/questions). Include your redacted URL, HTTP status code, raw response body, and UTC timestamp in your ticket.

:::note Portfolio disclaimer
This documentation site is an independent technical writing portfolio sample authored by [Michel Silveira](https://michelgss.github.io/portfolio/). It is neither maintained nor endorsed by OpenWeatherMap, and Michel cannot view accounts, reset API keys, or provide official vendor support.
:::
