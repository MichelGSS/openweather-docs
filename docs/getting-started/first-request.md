---
sidebar_position: 3
title: Make your first request
description: Fetch live metric weather data for Rio de Janeiro with curl, Node.js, or Python and inspect the JSON response.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Make your first request

Fetch current weather conditions in Celsius (`units=metric`) for Rio de Janeiro using the `OPENWEATHER_API_KEY` environment variable you configured in [Get your API key](./get-api-key).

## Send a request

Select `curl`, **Node.js**, or **Python** and run the request in the same terminal session where `OPENWEATHER_API_KEY` is set.

<Tabs groupId="language">
<TabItem value="curl" label="curl" default>

Send a `GET` request to `/data/2.5/weather` with URL-encoded city and `units=metric` query parameters:

<Tabs groupId="os">
<TabItem value="unix" label="macOS / Linux" default>

```bash
curl "https://api.openweathermap.org/data/2.5/weather?q=Rio%20de%20Janeiro&units=metric&appid=$OPENWEATHER_API_KEY"
```

</TabItem>
<TabItem value="windows" label="Windows (PowerShell)">

```powershell
curl.exe "https://api.openweathermap.org/data/2.5/weather?q=Rio%20de%20Janeiro&units=metric&appid=$env:OPENWEATHER_API_KEY"
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="nodejs" label="Node.js">

Save the following ES module as `weather.mjs`. Using the `.mjs` extension enables top-level `await` in Node.js 18 and later without requiring a `package.json` file:

```javascript title="weather.mjs"
const apiKey = process.env.OPENWEATHER_API_KEY;

if (!apiKey) {
  console.error(
    "Error: Missing OPENWEATHER_API_KEY environment variable. Set it before running weather.mjs."
  );
  process.exit(1);
}

const url = new URL("https://api.openweathermap.org/data/2.5/weather");
url.search = new URLSearchParams({
  q: "Rio de Janeiro",
  units: "metric",
  appid: apiKey,
}).toString();

const response = await fetch(url, {
  signal: AbortSignal.timeout(10000),
});

if (!response.ok) {
  const errorBody = await response.json().catch(() => null);
  const detail = errorBody?.message ?? response.statusText;
  console.error(`HTTP error ${response.status}: ${detail}`);
  process.exit(1);
}

const data = await response.json();
console.log(
  `${data.name}: ${data.main.temp}°C, ${data.weather[0].description} (humidity: ${data.main.humidity}%)`
);
```

Run the script from your terminal:

```bash
node weather.mjs
```

**Expected output:**

```text
Rio de Janeiro: 28.5°C, clear sky (humidity: 70%)
```

</TabItem>
<TabItem value="python" label="Python">

Save the following script as `weather.py`:

```python title="weather.py"
import os
import sys
import requests

api_key = os.environ.get("OPENWEATHER_API_KEY")

if not api_key:
    print(
        "Error: Missing OPENWEATHER_API_KEY environment variable. Set it before running weather.py.",
        file=sys.stderr,
    )
    sys.exit(1)

response = requests.get(
    "https://api.openweathermap.org/data/2.5/weather",
    params={
        "q": "Rio de Janeiro",
        "units": "metric",
        "appid": api_key,
    },
    timeout=10,
)
response.raise_for_status()

data = response.json()
print(
    f"{data['name']}: {data['main']['temp']}°C, {data['weather'][0]['description']} (humidity: {data['main']['humidity']}%)"
)
```

Run the script from your terminal:

<Tabs groupId="os">
<TabItem value="unix" label="macOS / Linux" default>

```bash
python3 weather.py
```

</TabItem>
<TabItem value="windows" label="Windows (PowerShell)">

```powershell
python weather.py
```

</TabItem>
</Tabs>

**Expected output:**

```text
Rio de Janeiro: 28.5°C, clear sky (humidity: 70%)
```

</TabItem>
</Tabs>

## Inspect the response

A `200 OK` call to `/data/2.5/weather` returns a JSON object containing geographic coordinates, weather condition codes, atmospheric readings, wind measurements, and metadata (abbreviated below):

```json
{
  "coord": {
    "lon": -43.2075,
    "lat": -22.9028
  },
  "weather": [
    {
      "id": 800,
      "main": "Clear",
      "description": "clear sky",
      "icon": "01d"
    }
  ],
  "main": {
    "temp": 28.5,
    "feels_like": 30.8,
    "temp_min": 27.2,
    "temp_max": 29.4,
    "pressure": 1014,
    "humidity": 70
  },
  "wind": {
    "speed": 3.6,
    "deg": 120
  },
  "sys": {
    "country": "BR",
    "sunrise": 1715244180,
    "sunset": 1715284620
  },
  "name": "Rio de Janeiro",
  "cod": 200
}
```

The table below summarizes the primary fields you'll work with in most applications:

| Field | Type | Description |
| --- | --- | --- |
| `name` | `string` | Matched city name (`"Rio de Janeiro"`). |
| `sys.country` | `string` | Two-letter ISO 3166-1 alpha-2 country code (`"BR"`). |
| `main.temp` | `number` | Current temperature in the requested unit system (`°C` for `metric`, `°F` for `imperial`, `K` for `standard`). |
| `main.feels_like` | `number` | Perceived temperature accounting for humidity and wind. |
| `main.humidity` | `integer` | Relative humidity percentage (`0`–`100`). |
| `weather[0].description` | `string` | Weather condition summary (`"clear sky"`). |
| `wind.speed` | `number` | Wind speed in `m/s` for `metric` and `standard` units, or `mph` for `imperial` units. |
| `cod` | `integer` | Response status code (`200` indicates success). |

## Next steps

You've authenticated with the OpenWeatherMap API, sent a parameterized request, and parsed live weather data. Choose where to go next:

- **Experiment in the browser:** Test live queries, switch unit systems, and inspect raw responses in the interactive [API playground](/playground).
- **Build a complete project:** Follow the hands-on [Tutorials](../tutorials/weather-dashboard) to build a multi-city Node.js dashboard or a [Python weather CLI tool](../tutorials/weather-cli).
- **Review full schemas:** Look up every query parameter and response property in the [Current weather reference](../reference/current-weather).
