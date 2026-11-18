---
sidebar_position: 2
sidebar_label: FAQ
description: Answers to common developer questions about OpenWeatherMap free-tier limits, One Call API 3.0 billing, API key activation, Kelvin units, CORS, and licensing.
---

# Frequently asked questions

Find concise answers to common questions about OpenWeatherMap pricing tiers, API key behavior, payload quirks, frontend architecture, and data attribution.

## Pricing, plans, and API keys

### Is the OpenWeatherMap API free without a credit card?

Yes. OpenWeatherMap's default Free plan gives you **60 calls per minute** and **1,000,000 calls per month** across Weather API 2.5 (`/data/2.5/weather` and `/data/2.5/forecast`) and Geocoding API 1.0 (`/geo/1.0/direct`, `/geo/1.0/reverse`, and `/geo/1.0/zip`) with **no credit card required**. For quota details across tiers, see [Rate limits](../reference/rate-limits).

### What is the difference between Weather API 2.5 and One Call API 3.0?

Weather API 2.5 and Geocoding API 1.0 are included automatically on every free OpenWeatherMap account without entering billing information. **One Call API 3.0** (`/data/3.0/onecall`) is a separate "One Call by Call" pay-as-you-go product that bundles current, minute-by-minute, hourly, and 8-day daily forecasts into one endpoint.

Even though One Call API 3.0 includes 1,000 free calls per day, activating `/data/3.0/onecall` requires adding a payment method (and setting a daily call cap if you want to prevent overage charges). Calling `/data/3.0/onecall` with a standard free-tier key without an active One Call subscription returns `401 Unauthorized`. Everything documented on this site uses the free-tier **2.5** and **1.0** endpoints.

### Why does my newly created API key return a 401 Unauthorized error?

Newly generated API keys take **10–15 minutes** on average—and **up to 2 hours** during peak synchronization windows—to propagate across OpenWeatherMap's global edge servers. Wait at least 15 minutes and test against `/data/2.5/weather` before generating another key. If `401` persists past 2 hours, verify that your key is marked **Active** in your dashboard and that your URL uses `/data/2.5/weather` rather than `/data/3.0/onecall`. See [Common errors](./common-errors#401-unauthorized) for a `curl` diagnostic check.

### Do multiple API keys under one account increase my rate limit?

No. OpenWeatherMap enforces the **60 calls per minute** and **1,000,000 calls per month** quotas across your entire account, pooling traffic from every active key you generate. Creating separate keys is useful for isolating credentials between development, staging, and production environments so you can rotate one key without disrupting others—not for expanding throughput. To scale to thousands of users within the free quota, see [Set up rate limiting and caching](../how-to/rate-limiting).

## Endpoints, payloads, and units

### Why does the API return temperatures around 285 to 305?

When you omit the `units` query parameter, OpenWeatherMap defaults to the `standard` unit system and returns temperatures in **Kelvin (`K`)**. Append `&units=metric` for Celsius (`°C`) or `&units=imperial` for Fahrenheit (`°F`). Remember that `units` affects only temperature and wind speed: pressure (`hPa`), precipitation (`mm`), and visibility (`m`) remain in SI units across all three modes. See [Unit systems and conversions](../concepts/units) for the complete field matrix and conversion formulas.

### Why does `temp_min` equal `temp_max` in current weather responses?

In `/data/2.5/weather`, `main.temp_min` and `main.temp_max` do **not** represent the 24-hour daily low and high forecast. Instead, they report instantaneous spatial temperature variation across reporting stations within a large metropolitan region. In smaller cities or single-grid-cell locations, `temp`, `temp_min`, and `temp_max` hold the exact same value. To calculate upcoming daily highs and lows on the free tier, aggregate intervals from `/data/2.5/forecast`. See [How weather data works](../concepts/how-weather-data-works) for details.

### Why do `rain`, `snow`, or `wind.gust` fields disappear from some responses?

OpenWeatherMap omits optional precipitation (`rain`, `snow`) and wind gust (`wind.gust`) properties whenever no measurable accumulation or gust was observed during that interval, rather than returning `0`. Always read optional properties defensively—such as `data.rain?.['1h'] ?? 0` in JavaScript or `data.get("rain", {}).get("1h", 0.0)` in Python. For the full schema, see [Current weather reference](../reference/current-weather).

### Why did my city name search return 404 or resolve to the wrong country?

City names frequently collide across countries and states (for example, dozens of municipalities share the name `"Springfield"` or `"San Jose"`), and non-ASCII characters require URL encoding. Instead of passing city strings directly to `/data/2.5/weather?q=`, resolve the place name through the [Geocoding API](../reference/geocoding) (`/geo/1.0/direct`) first and pass the resulting `lat` and `lon` coordinates to the weather endpoint. Follow the step-by-step recipe in [Query weather by coordinates](../how-to/use-coordinates).

## Architecture and licensing

### Can I call OpenWeatherMap directly from a React or Vue frontend?

During local prototyping, a preflight-exempt `GET` request from browser JavaScript to `https://api.openweathermap.org` succeeds as long as your HTTP client doesn't attach custom headers such as `Authorization` or `Content-Type: application/json` (which trigger `OPTIONS` preflight checks that OpenWeatherMap blocks under CORS).

For any public or multi-user production application, however, **do not call OpenWeatherMap directly from a React or Vue frontend**:

1. **Exposed credentials**: Every visitor can read your `appid` in browser DevTools network logs and reuse your quota.
2. **Uncoalesced rate limits**: Concurrent visitors multiply upstream traffic linearly and trip `429 Too Many Requests` once traffic exceeds 60 requests per minute.

Route frontend requests through a lightweight backend proxy (such as an Express route, FastAPI endpoint, Next.js Route Handler, or serverless worker) that stores `OPENWEATHER_API_KEY` on the server and caches responses for 10 minutes. See [API architecture overview](../concepts/architecture) and [Common errors](./common-errors#browser-cors-preflight-and-mixed-content-errors).

### Can I use free-tier weather data in commercial projects, and is attribution required?

Yes. OpenWeatherMap licenses free-tier data under the Creative Commons Attribution-ShareAlike 4.0 International license (**CC BY-SA 4.0**), which permits both personal and commercial applications as long as you satisfy its license obligations—specifically crediting **OpenWeatherMap** as the source (for example, displaying *"Weather data provided by OpenWeatherMap"* linked to [OpenWeatherMap](https://openweathermap.org/)) and applying compatible share-alike terms if you redistribute adapted datasets. Paid enterprise tiers provide commercial licensing options with adjusted attribution terms; review the [official OpenWeatherMap pricing and terms](https://openweathermap.org/price) before launching a commercial product.
