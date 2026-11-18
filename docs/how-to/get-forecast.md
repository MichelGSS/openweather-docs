---
sidebar_position: 2
description: Fetch 5-day weather forecasts in 3-hour intervals, cap payload size with cnt, and aggregate intervals into timezone-accurate daily high and low summaries.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Get a 5-day forecast

Use `/data/2.5/forecast` to retrieve up to 5 days (120 hours) of forecast data in 3-hour increments, cap the number of returned intervals with `cnt`, and roll 3-hour intervals up into local calendar-day summaries.

## Fetch 3-hour forecast intervals

Query `/data/2.5/forecast` with `lat` and `lon` (recommended) or `q` along with `units=metric`. By default, the endpoint returns `40` forecast intervals (`40` intervals × `3` hours = `120` hours):

<Tabs groupId="language">
<TabItem value="curl" label="curl" default>

```bash
curl --get "https://api.openweathermap.org/data/2.5/forecast" \
  --data-urlencode "lat=35.6895" \
  --data-urlencode "lon=139.6917" \
  --data-urlencode "units=metric" \
  --data-urlencode "appid=$OPENWEATHER_API_KEY"
```

</TabItem>
<TabItem value="nodejs" label="Node.js">

```javascript
const params = new URLSearchParams({
  lat: '35.6895',
  lon: '139.6917',
  units: 'metric',
  appid: process.env.OPENWEATHER_API_KEY,
});

const response = await fetch(
  `https://api.openweathermap.org/data/2.5/forecast?${params}`,
  { signal: AbortSignal.timeout(10000) }
);

if (!response.ok) {
  throw new Error(`Forecast request failed with HTTP ${response.status}`);
}

const data = await response.json();
console.log(
  `Received ${data.cnt} intervals for ${data.city.name} (${data.city.country})`
);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import os
import requests

response = requests.get(
    "https://api.openweathermap.org/data/2.5/forecast",
    params={
        "lat": 35.6895,
        "lon": 139.6917,
        "units": "metric",
        "appid": os.environ["OPENWEATHER_API_KEY"],
    },
    timeout=10,
)
response.raise_for_status()

data = response.json()
print(f"Received {data['cnt']} intervals for {data['city']['name']} ({data['city']['country']})")
```

</TabItem>
</Tabs>

The response returns forecast blocks in `list[]` and location metadata—including `city.timezone`, the UTC offset in seconds—in `city`:

```json
{
  "cod": "200",
  "message": 0,
  "cnt": 40,
  "list": [
    {
      "dt": 1746813600,
      "main": {
        "temp": 18.4,
        "temp_min": 17.9,
        "temp_max": 19.1,
        "humidity": 68
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10n"
        }
      ],
      "pop": 0.42,
      "dt_txt": "2025-05-09 18:00:00"
    }
  ],
  "city": {
    "id": 1850147,
    "name": "Tokyo",
    "country": "JP",
    "timezone": 32400
  }
}
```

For definitions of every field in `list[]` and `city`, see the [5-day forecast reference](../reference/forecast).

## Limit the number of intervals

Pass `cnt` (`1`–`40`) when your application only displays upcoming hours. For example, setting `cnt=8` returns the next 24 hours (`8` intervals × `3` hours) and trims ~80% of the JSON payload:

<Tabs groupId="language">
<TabItem value="curl" label="curl" default>

```bash
curl --get "https://api.openweathermap.org/data/2.5/forecast" \
  --data-urlencode "lat=35.6895" \
  --data-urlencode "lon=139.6917" \
  --data-urlencode "cnt=8" \
  --data-urlencode "units=metric" \
  --data-urlencode "appid=$OPENWEATHER_API_KEY"
```

</TabItem>
<TabItem value="nodejs" label="Node.js">

```javascript
const params = new URLSearchParams({
  lat: '35.6895',
  lon: '139.6917',
  cnt: '8',
  units: 'metric',
  appid: process.env.OPENWEATHER_API_KEY,
});

const response = await fetch(
  `https://api.openweathermap.org/data/2.5/forecast?${params}`,
  { signal: AbortSignal.timeout(10000) }
);

if (!response.ok) {
  throw new Error(`Forecast request failed with HTTP ${response.status}`);
}

const data = await response.json();
for (const slot of data.list) {
  console.log(
    `${slot.dt_txt} UTC -> ${slot.main.temp} °C (precipitation probability: ${Math.round(slot.pop * 100)}%)`
  );
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import os
import requests

response = requests.get(
    "https://api.openweathermap.org/data/2.5/forecast",
    params={
        "lat": 35.6895,
        "lon": 139.6917,
        "cnt": 8,
        "units": "metric",
        "appid": os.environ["OPENWEATHER_API_KEY"],
    },
    timeout=10,
)
response.raise_for_status()

data = response.json()
for slot in data["list"]:
    pop_pct = round(slot["pop"] * 100)
    print(f"{slot['dt_txt']} UTC -> {slot['main']['temp']} °C (precipitation probability: {pop_pct}%)")
```

</TabItem>
</Tabs>

## Aggregate intervals into local daily summaries

Don't group forecast intervals by `item.dt_txt`. The `dt_txt` field is always formatted in UTC, so splitting `dt_txt` assigns late-afternoon and evening intervals in non-UTC cities (such as Tokyo at `UTC+9` or New York at `UTC-4`) to the wrong local calendar day.

To build accurate daily summaries:

1. Add `data.city.timezone` (seconds from UTC) to each interval's `item.dt` UTC Unix timestamp before formatting the `YYYY-MM-DD` date string in UTC.
2. Track `minTemp` (`item.main.temp_min`), `maxTemp` (`item.main.temp_max`), and the most frequent `item.weather[0].main` condition across all intervals belonging to each local date.

Because 40 three-hour intervals cover a rolling 120-hour window starting from the request time, the aggregated result spans **5–6 local calendar dates**. The first and last dates usually contain fewer than 8 intervals because they represent partial days.

<Tabs groupId="language">
<TabItem value="nodejs" label="Node.js" default>

```javascript
const apiKey = process.env.OPENWEATHER_API_KEY;

async function getDailyForecastSummary(lat, lon) {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    units: 'metric',
    appid: apiKey,
  });

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?${params}`,
    { signal: AbortSignal.timeout(10000) }
  );

  if (!response.ok) {
    throw new Error(`Forecast request failed with HTTP ${response.status}`);
  }

  const data = await response.json();
  const timezoneOffsetSeconds = data.city.timezone;
  const dailyBuckets = new Map();

  for (const item of data.list) {
    // Shift UTC epoch seconds by the target city's UTC offset before slicing YYYY-MM-DD
    const localDate = new Date((item.dt + timezoneOffsetSeconds) * 1000)
      .toISOString()
      .slice(0, 10);

    if (!dailyBuckets.has(localDate)) {
      dailyBuckets.set(localDate, {
        date: localDate,
        minTemp: Infinity,
        maxTemp: -Infinity,
        conditionCounts: new Map(),
        intervals: 0,
      });
    }

    const bucket = dailyBuckets.get(localDate);
    bucket.minTemp = Math.min(bucket.minTemp, item.main.temp_min);
    bucket.maxTemp = Math.max(bucket.maxTemp, item.main.temp_max);
    bucket.intervals += 1;

    const condition = item.weather[0].main;
    bucket.conditionCounts.set(
      condition,
      (bucket.conditionCounts.get(condition) ?? 0) + 1
    );
  }

  return Array.from(dailyBuckets.values()).map((bucket) => {
    let dominantCondition = '';
    let highestCount = 0;

    for (const [condition, count] of bucket.conditionCounts) {
      if (count > highestCount) {
        dominantCondition = condition;
        highestCount = count;
      }
    }

    return {
      date: bucket.date,
      minTemp: Number(bucket.minTemp.toFixed(1)),
      maxTemp: Number(bucket.maxTemp.toFixed(1)),
      dominantCondition,
      intervals: bucket.intervals,
    };
  });
}

const dailySummary = await getDailyForecastSummary(35.6895, 139.6917);
console.log(JSON.stringify(dailySummary, null, 2));
```

</TabItem>
<TabItem value="python" label="Python">

```python
from collections import Counter
from datetime import datetime, timezone
import json
import os
import requests

API_KEY = os.environ["OPENWEATHER_API_KEY"]
FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"


def get_daily_forecast_summary(lat: float, lon: float) -> list[dict]:
    params = {
        "lat": lat,
        "lon": lon,
        "units": "metric",
        "appid": API_KEY,
    }
    response = requests.get(FORECAST_URL, params=params, timeout=10)
    response.raise_for_status()
    data = response.json()

    timezone_offset_seconds = data["city"]["timezone"]
    daily_buckets: dict[str, dict] = {}

    for item in data["list"]:
        # Shift UTC epoch seconds by the target city's UTC offset before formatting YYYY-MM-DD
        local_date = datetime.fromtimestamp(
            item["dt"] + timezone_offset_seconds, tz=timezone.utc
        ).strftime("%Y-%m-%d")

        if local_date not in daily_buckets:
            daily_buckets[local_date] = {
                "min_temp": float("inf"),
                "max_temp": float("-inf"),
                "conditions": Counter(),
                "intervals": 0,
            }

        bucket = daily_buckets[local_date]
        bucket["min_temp"] = min(bucket["min_temp"], item["main"]["temp_min"])
        bucket["max_temp"] = max(bucket["max_temp"], item["main"]["temp_max"])
        bucket["conditions"][item["weather"][0]["main"]] += 1
        bucket["intervals"] += 1

    summaries = []
    for date_str, bucket in daily_buckets.items():
        dominant_condition = bucket["conditions"].most_common(1)[0][0]
        summaries.append(
            {
                "date": date_str,
                "minTemp": round(bucket["min_temp"], 1),
                "maxTemp": round(bucket["max_temp"], 1),
                "dominantCondition": dominant_condition,
                "intervals": bucket["intervals"],
            }
        )

    return summaries


daily_summary = get_daily_forecast_summary(35.6895, 139.6917)
print(json.dumps(daily_summary, indent=2))
```

</TabItem>
</Tabs>

Running either script produces timezone-aligned daily high and low summaries across the 5–6 local calendar dates covered by the 120-hour window:

```json
[
  {
    "date": "2025-05-10",
    "minTemp": 16.8,
    "maxTemp": 21.4,
    "dominantCondition": "Rain",
    "intervals": 7
  },
  {
    "date": "2025-05-11",
    "minTemp": 15.2,
    "maxTemp": 23.9,
    "dominantCondition": "Clear",
    "intervals": 8
  },
  {
    "date": "2025-05-12",
    "minTemp": 16.5,
    "maxTemp": 24.6,
    "dominantCondition": "Clouds",
    "intervals": 8
  },
  {
    "date": "2025-05-13",
    "minTemp": 17.1,
    "maxTemp": 22.8,
    "dominantCondition": "Clouds",
    "intervals": 8
  },
  {
    "date": "2025-05-14",
    "minTemp": 15.9,
    "maxTemp": 20.3,
    "dominantCondition": "Rain",
    "intervals": 8
  },
  {
    "date": "2025-05-15",
    "minTemp": 14.7,
    "maxTemp": 14.7,
    "dominantCondition": "Clear",
    "intervals": 1
  }
]
```

:::tip Filter partial boundary days when needed
If your UI displays full-day cards only, check `intervals >= 4` (or skip the final entry when `intervals < 4`) so a single midnight or early-morning interval doesn't misrepresent an entire day's high temperature.
:::

## Related resources

- [5-day forecast reference](../reference/forecast) for complete request parameter and response schema definitions
- [Use geographic coordinates](./use-coordinates) to look up `lat` and `lon` before requesting a forecast
- [Units and measurement systems](../concepts/units) for temperature, wind speed, and precipitation units
- [Set up rate limiting and caching](./rate-limiting) to cache aggregated forecasts on your backend
