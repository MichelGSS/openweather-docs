---
sidebar_position: 1
title: Build a weather dashboard in Node.js
description: Build a concurrent multi-city terminal weather dashboard in Node.js using native fetch, URLSearchParams, and fault-isolated error handling.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Build a weather dashboard in Node.js

In this tutorial, you'll build a command-line weather dashboard in Node.js that fetches live conditions for five cities concurrently and renders an aligned summary table in your terminal.

- **Time:** 15–20 minutes
- **Level:** Beginner
- **What you'll build:** An ES module script (`dashboard.mjs`) that queries the OpenWeatherMap API in parallel, isolates single-city failures, and prints a formatted multi-city weather table.
- **What you'll learn:**
  - Validate environment credentials upfront before sending network requests.
  - Construct safe query strings with `URL` and `URLSearchParams` and enforce timeouts with `AbortSignal.timeout`.
  - Fetch multiple cities concurrently with `Promise.all` without letting one failed request crash the batch.
  - Align negative, single-digit, and double-digit readings into fixed-width terminal columns.

## Prerequisites

- **Environment and credentials:** Completed the [Getting started guide](../getting-started/prerequisites), with `OPENWEATHER_API_KEY` set in your active terminal session.
- **Runtime:** **Node.js 20 LTS or later** installed (Node.js 18 and later include native `fetch` and `AbortSignal.timeout`).
- **Code editor:** [Visual Studio Code](https://code.visualstudio.com/) or another text editor.

## Step 1: Create the project directory and module file

1. Create a `weather-dashboard` directory, navigate into it, and create an empty `dashboard.mjs` file. Using the `.mjs` extension tells Node.js to load the file as an ECMAScript module with top-level `await` support.

<Tabs groupId="os">
<TabItem value="unix" label="macOS / Linux" default>

```bash
mkdir weather-dashboard && cd weather-dashboard
touch dashboard.mjs
```

</TabItem>
<TabItem value="windows" label="Windows (PowerShell)">

```powershell
New-Item -ItemType Directory -Path weather-dashboard | Out-Null
Set-Location weather-dashboard
New-Item -ItemType File -Path dashboard.mjs | Out-Null
```

</TabItem>
</Tabs>

## Step 2: Validate credentials and define target cities

1. Open `dashboard.mjs` in Visual Studio Code and add the API key guard, endpoint URL constant, and list of cities to monitor. Checking `process.env.OPENWEATHER_API_KEY` at startup fails fast with a clear message instead of sending five unauthenticated `401` requests.

```javascript title="dashboard.mjs"
const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

if (!API_KEY) {
  console.error(
    "Error: Missing OPENWEATHER_API_KEY environment variable. Set it before running dashboard.mjs."
  );
  process.exit(1);
}

const cities = ["London", "New York", "Tokyo", "Rio de Janeiro", "Sydney"];
```

## Step 3: Build the single-city fetch function

1. Append the `getWeather` function to `dashboard.mjs`. It encodes query parameters with `URLSearchParams`, enforces a 10-second timeout with `AbortSignal.timeout(10000)`, extracts OpenWeatherMap's `message` field when `!response.ok`, and returns `null` on failure so a single bad request doesn't abort other cities.

```javascript title="dashboard.mjs"
async function getWeather(city) {
  const url = new URL(BASE_URL);
  url.search = new URLSearchParams({
    q: city,
    units: "metric",
    appid: API_KEY,
  }).toString();

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      const detail = errorBody?.message ?? response.statusText;
      throw new Error(`HTTP ${response.status} (${detail})`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Warning: Failed to fetch "${city}" - ${error.message}`);
    return null;
  }
}
```

### Checkpoint: Verify a single-city fetch

Confirm that your credentials and `getWeather` function work before building the table formatter.

1. Temporarily append these four lines to the bottom of `dashboard.mjs`.

```javascript title="dashboard.mjs"
const sample = await getWeather("London");
if (sample) {
  console.log(`Verified: ${sample.name} (${sample.main.temp.toFixed(1)}°C)`);
}
```

2. Run `dashboard.mjs` from your terminal.

```bash
node dashboard.mjs
```

**Expected output:**

```text
Verified: London (12.3°C)
```

Live temperature values vary with current weather conditions in London.

3. Remove the temporary `sample` lines from the bottom of `dashboard.mjs` before moving to Step 4.

## Step 4: Format aligned table rows

1. Append the `formatWeather` helper to `dashboard.mjs`. Right-padding text columns (`padEnd`) and left-padding numeric columns (`padStart`—including `` `${main.temp.toFixed(1)}°C`.padStart(8) ``) keeps negative, single-digit, and double-digit values aligned across every row.

```javascript title="dashboard.mjs"
function formatWeather(data) {
  if (!data) {
    return null;
  }

  const { name, sys, main, weather, wind } = data;
  const location = (sys?.country ? `${name}, ${sys.country}` : name).padEnd(20);
  const temp = `${main.temp.toFixed(1)}°C`.padStart(8);
  const condition = (weather?.[0]?.description ?? "unavailable").padEnd(24);
  const humidity = `${main.humidity}%`.padStart(8);
  const windSpeed = `${wind.speed.toFixed(1)} m/s`.padStart(10);

  return ` ${location}  ${temp}  ${condition}  ${humidity}  ${windSpeed}`;
}
```

## Step 5: Fetch all cities concurrently and render the table

1. Append `runDashboard` and invoke it at the bottom of `dashboard.mjs`. Calling `Promise.all(cities.map(getWeather))` dispatches all five HTTP requests concurrently rather than waiting for each city sequentially.

```javascript title="dashboard.mjs"
async function runDashboard() {
  const divider = "=".repeat(80);
  const header = [
    ` ${"City".padEnd(20)}`,
    "Temp".padStart(8),
    "Condition".padEnd(24),
    "Humidity".padStart(8),
    "Wind".padStart(10),
  ].join("  ");
  const subdivider = [
    ` ${"-".repeat(20)}`,
    "-".repeat(8),
    "-".repeat(24),
    "-".repeat(8),
    "-".repeat(10),
  ].join("  ");

  const results = await Promise.all(cities.map(getWeather));
  const rows = results.map(formatWeather).filter(Boolean);

  console.log(divider);
  console.log(" Current weather dashboard");
  console.log(divider);
  console.log(header);
  console.log(subdivider);

  for (const row of rows) {
    console.log(row);
  }

  console.log(divider);
  console.log(
    ` Last updated: ${new Date().toISOString()} (${rows.length}/${cities.length} cities)`
  );
}

await runDashboard();
```

2. Expand the block below to compare your file against the complete script before running it.

<details>
<summary>View complete dashboard.mjs</summary>

```javascript title="dashboard.mjs"
const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

if (!API_KEY) {
  console.error(
    "Error: Missing OPENWEATHER_API_KEY environment variable. Set it before running dashboard.mjs."
  );
  process.exit(1);
}

const cities = ["London", "New York", "Tokyo", "Rio de Janeiro", "Sydney"];

async function getWeather(city) {
  const url = new URL(BASE_URL);
  url.search = new URLSearchParams({
    q: city,
    units: "metric",
    appid: API_KEY,
  }).toString();

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      const detail = errorBody?.message ?? response.statusText;
      throw new Error(`HTTP ${response.status} (${detail})`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Warning: Failed to fetch "${city}" - ${error.message}`);
    return null;
  }
}

function formatWeather(data) {
  if (!data) {
    return null;
  }

  const { name, sys, main, weather, wind } = data;
  const location = (sys?.country ? `${name}, ${sys.country}` : name).padEnd(20);
  const temp = `${main.temp.toFixed(1)}°C`.padStart(8);
  const condition = (weather?.[0]?.description ?? "unavailable").padEnd(24);
  const humidity = `${main.humidity}%`.padStart(8);
  const windSpeed = `${wind.speed.toFixed(1)} m/s`.padStart(10);

  return ` ${location}  ${temp}  ${condition}  ${humidity}  ${windSpeed}`;
}

async function runDashboard() {
  const divider = "=".repeat(80);
  const header = [
    ` ${"City".padEnd(20)}`,
    "Temp".padStart(8),
    "Condition".padEnd(24),
    "Humidity".padStart(8),
    "Wind".padStart(10),
  ].join("  ");
  const subdivider = [
    ` ${"-".repeat(20)}`,
    "-".repeat(8),
    "-".repeat(24),
    "-".repeat(8),
    "-".repeat(10),
  ].join("  ");

  const results = await Promise.all(cities.map(getWeather));
  const rows = results.map(formatWeather).filter(Boolean);

  console.log(divider);
  console.log(" Current weather dashboard");
  console.log(divider);
  console.log(header);
  console.log(subdivider);

  for (const row of rows) {
    console.log(row);
  }

  console.log(divider);
  console.log(
    ` Last updated: ${new Date().toISOString()} (${rows.length}/${cities.length} cities)`
  );
}

await runDashboard();
```

</details>

## Step 6: Run the dashboard and verify fault isolation

1. Execute `dashboard.mjs` to display live weather conditions for all five cities.

```bash
node dashboard.mjs
```

**Expected output:**

```text
================================================================================
 Current weather dashboard
================================================================================
 City                      Temp  Condition                 Humidity        Wind
 --------------------  --------  ------------------------  --------  ----------
 London, GB              12.3°C  overcast clouds                81%     5.2 m/s
 New York, US            -2.4°C  light snow                     64%     4.8 m/s
 Tokyo, JP                8.4°C  scattered clouds               68%     2.8 m/s
 Rio de Janeiro, BR      28.5°C  clear sky                      70%     3.6 m/s
 Sydney, AU              15.9°C  light rain                     88%     6.7 m/s
================================================================================
 Last updated: 2026-05-09T14:30:00.000Z (5/5 cities)
```

### Verify fault isolation with an invalid city

Confirm that an invalid city name logs a warning without preventing valid cities from rendering.

1. Temporarily add `"AtlantisNotACity"` to the `cities` array in `dashboard.mjs`.

```javascript title="dashboard.mjs"
const cities = [
  "London",
  "AtlantisNotACity",
  "New York",
  "Tokyo",
  "Rio de Janeiro",
  "Sydney",
];
```

2. Run `node dashboard.mjs` again.

**Expected output:**

```text
Warning: Failed to fetch "AtlantisNotACity" - HTTP 404 (city not found)
================================================================================
 Current weather dashboard
================================================================================
 City                      Temp  Condition                 Humidity        Wind
 --------------------  --------  ------------------------  --------  ----------
 London, GB              12.3°C  overcast clouds                81%     5.2 m/s
 New York, US            -2.4°C  light snow                     64%     4.8 m/s
 Tokyo, JP                8.4°C  scattered clouds               68%     2.8 m/s
 Rio de Janeiro, BR      28.5°C  clear sky                      70%     3.6 m/s
 Sydney, AU              15.9°C  light rain                     88%     6.7 m/s
================================================================================
 Last updated: 2026-05-09T14:31:15.000Z (5/6 cities)
```

3. Remove `"AtlantisNotACity"` from `cities` to restore your clean five-city configuration.

## What you learned

- Validated `process.env.OPENWEATHER_API_KEY` at startup so missing credentials fail immediately with a nonzero exit code.
- Built URL-encoded requests with `URL` and `URLSearchParams` and protected network calls with `AbortSignal.timeout(10000)`.
- Parsed OpenWeatherMap JSON error messages and returned `null` on failure to isolate per-city errors inside `Promise.all`.
- Formatted terminal output with `padEnd` and `padStart` so negative, single-digit, and double-digit readings stay aligned.

## Next steps

- **Try the Python track:** Follow [Build a weather CLI tool in Python](./weather-cli) to accept dynamic city arguments and unit flags from the command line.
- **Harden production calls:** Add retry logic and status-specific recovery patterns with [Handle errors](../how-to/handle-errors) and [Manage rate limits](../how-to/rate-limiting).
- **Explore response fields:** Check the [Current weather reference](../reference/current-weather) to add cloud cover, atmospheric pressure, or sunrise timestamps to your dashboard.
