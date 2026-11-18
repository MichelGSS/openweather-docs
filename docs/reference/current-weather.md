---
sidebar_position: 2
title: Current weather endpoint
description: Complete API reference for GET /data/2.5/weather, including query parameters, multi-language request examples, response schema, units, and status codes.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Current weather endpoint

Returns current weather observations for a geographic coordinate pair (`lat` and `lon`).

For implementation workflows, see [Use geographic coordinates](../how-to/use-coordinates) and [Get current weather by city](../how-to/get-current-weather).

## Endpoint

```http
GET https://api.openweathermap.org/data/2.5/weather
```

## Query parameters

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `lat` | `number` | Yes | — | Latitude in decimal degrees, ranging from `-90` to `90` (positive for north, negative for south). |
| `lon` | `number` | Yes | — | Longitude in decimal degrees, ranging from `-180` to `180` (positive for east, negative for west). |
| `appid` | `string` | Yes | — | 32-character hexadecimal API key. See [Authentication](./authentication). |
| `units` | `string` | No | `standard` | Measurement system for temperature and wind speed: `standard` (Kelvin, m/s), `metric` (Celsius, m/s), or `imperial` (Fahrenheit, mph). See [Unit systems and conversions](../concepts/units). |
| `lang` | `string` | No | `en` | Language code for the localized `weather[].description` value (such as `es`, `fr`, `de`, `ja`, or `pt_br`). |
| `mode` | `string` | No | `json` | Response payload format: `json`, `xml`, or `html`. |

### Legacy location parameters (deprecated)

:::note Built-in geocoding deprecation
OpenWeatherMap deprecated built-in city-name, city-ID, and postal-code lookups on weather endpoints. Although `q`, `id`, and `zip` remain functional for backward compatibility, resolve place names and postal codes to coordinates first through the [Geocoding endpoints](./geocoding) and pass `lat` and `lon` to this endpoint.
:::

Supply one legacy identifier only when omitting `lat` and `lon`:

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `q` | `string` | Conditional | — | Deprecated. Comma-separated city name, state code (US locations only), and ISO 3166-1 alpha-2 country code formatted as `{city},{state},{country}` (for example, `London,GB` or `Portland,OR,US`). URL-encode spaces and special characters. |
| `id` | `number` | Conditional | — | Deprecated. OpenWeatherMap numeric city identifier (for example, `2643743` for London). |
| `zip` | `string` | Conditional | — | Deprecated. Postal or ZIP code and ISO 3166-1 alpha-2 country code formatted as `{zip},{country}` (for example, `94040,US` or `EC1A,GB`). Defaults to `US` when the country code is omitted. |

## Request examples

### By coordinates

<Tabs groupId="language">
<TabItem value="curl" label="curl" default>

```bash
curl --get "https://api.openweathermap.org/data/2.5/weather" \
  --data-urlencode "lat=51.5085" \
  --data-urlencode "lon=-0.1257" \
  --data-urlencode "units=metric" \
  --data-urlencode "appid=$OPENWEATHER_API_KEY"
```

</TabItem>
<TabItem value="nodejs" label="Node.js">

```javascript
const params = new URLSearchParams({
  lat: '51.5085',
  lon: '-0.1257',
  units: 'metric',
  appid: process.env.OPENWEATHER_API_KEY,
});

const response = await fetch(
  `https://api.openweathermap.org/data/2.5/weather?${params}`,
  { signal: AbortSignal.timeout(10000) }
);

if (!response.ok) {
  throw new Error(`HTTP ${response.status}`);
}

const data = await response.json();
console.log(data);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import os
import requests

response = requests.get(
    "https://api.openweathermap.org/data/2.5/weather",
    params={
        "lat": 51.5085,
        "lon": -0.1257,
        "units": "metric",
        "appid": os.environ["OPENWEATHER_API_KEY"],
    },
    timeout=10,
)
response.raise_for_status()
data = response.json()
print(data)
```

</TabItem>
</Tabs>

### By city name (legacy)

```bash
curl --get "https://api.openweathermap.org/data/2.5/weather" \
  --data-urlencode "q=London,GB" \
  --data-urlencode "units=metric" \
  --data-urlencode "appid=$OPENWEATHER_API_KEY"
```

## Response

Example `200 OK` JSON payload requested with `units=metric`:

```json
{
  "coord": {
    "lon": -0.1257,
    "lat": 51.5085
  },
  "weather": [
    {
      "id": 500,
      "main": "Rain",
      "description": "light rain",
      "icon": "10d"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 12.3,
    "feels_like": 11.7,
    "temp_min": 10.8,
    "temp_max": 13.4,
    "pressure": 1015,
    "sea_level": 1015,
    "grnd_level": 1011,
    "humidity": 84
  },
  "visibility": 10000,
  "wind": {
    "speed": 5.2,
    "deg": 230,
    "gust": 8.1
  },
  "rain": {
    "1h": 0.65
  },
  "clouds": {
    "all": 90
  },
  "dt": 1715270400,
  "sys": {
    "type": 2,
    "id": 2075535,
    "country": "GB",
    "sunrise": 1715230800,
    "sunset": 1715284800
  },
  "timezone": 3600,
  "id": 2643743,
  "name": "London",
  "cod": 200
}
```

## Response fields

| Field | Type | Unit | Description |
| --- | --- | --- | --- |
| `coord.lon` | `number` | Decimal degrees | Longitude of the matched location (`-180` to `180`). |
| `coord.lat` | `number` | Decimal degrees | Latitude of the matched location (`-90` to `90`). |
| `weather` | `array` | — | List of weather condition objects. The first element (`weather[0]`) represents the primary condition. |
| `weather[].id` | `number` | — | Numeric weather condition code. See [OpenWeatherMap weather condition codes](https://openweathermap.org/weather-conditions). |
| `weather[].main` | `string` | — | Weather condition category: `Thunderstorm`, `Drizzle`, `Rain`, `Snow`, `Atmosphere` (serialized as specific 7xx phenomenon names such as `Mist`, `Smoke`, `Haze`, `Dust`, `Fog`, `Sand`, `Ash`, `Squall`, or `Tornado`), `Clear`, or `Clouds`. |
| `weather[].description` | `string` | — | Localized condition description within the category, controlled by `lang`. |
| `weather[].icon` | `string` | — | Icon identifier (such as `10d` for day or `10n` for night). See [OpenWeatherMap weather condition codes](https://openweathermap.org/weather-conditions). |
| `base` | `string` | — | Internal OpenWeatherMap parameter indicating the observation source (such as `stations`). |
| `main.temp` | `number` | K, °C, or °F | Current air temperature (`Kelvin` for `standard`, `Celsius` for `metric`, `Fahrenheit` for `imperial`). |
| `main.feels_like` | `number` | K, °C, or °F | Human-perceived temperature accounting for wind chill and relative humidity. |
| `main.temp_min` | `number` | K, °C, or °F | Lowest currently observed temperature across stations within a large metropolitan or extended area. Represents instantaneous spatial spread rather than a 24-hour daily low. |
| `main.temp_max` | `number` | K, °C, or °F | Highest currently observed temperature across stations within a large metropolitan or extended area. Represents instantaneous spatial spread rather than a 24-hour daily high. |
| `main.pressure` | `number` | hPa | Atmospheric pressure at sea level (when `sea_level` and `grnd_level` are absent) or station reference pressure. |
| `main.sea_level` | `number` | hPa | Optional. Atmospheric pressure adjusted to mean sea level. |
| `main.grnd_level` | `number` | hPa | Optional. Atmospheric pressure measured at local ground elevation. |
| `main.humidity` | `number` | % | Relative humidity percentage (`0`–`100`). |
| `visibility` | `number` | m | Horizontal visibility distance in meters, capped at a maximum of `10000` (10 km). |
| `wind.speed` | `number` | m/s or mph | Sustained wind speed (`m/s` for `standard` and `metric`; `mph` for `imperial`). |
| `wind.deg` | `number` | Degrees | Meteorological wind direction (`0`–`360`, indicating the direction from which wind blows). |
| `wind.gust` | `number` | m/s or mph | Optional. Peak wind gust speed (`m/s` for `standard` and `metric`; `mph` for `imperial`). Omitted when unavailable. |
| `clouds.all` | `number` | % | Cloudiness percentage (`0`–`100`). |
| `rain.1h` | `number` | mm | Optional. Liquid precipitation volume for the past 1 hour. Omitted when no rain occurred. |
| `snow.1h` | `number` | mm | Optional. Snow liquid-equivalent precipitation volume for the past 1 hour. Omitted when no snow occurred. |
| `dt` | `number` | Unix UTC (s) | Observation calculation timestamp in Unix epoch seconds (UTC). |
| `sys.type` | `number` | — | Optional. Internal OpenWeatherMap system parameter. |
| `sys.id` | `number` | — | Optional. Internal OpenWeatherMap station identifier. |
| `sys.country` | `string` | — | ISO 3166-1 alpha-2 country code (for example, `GB` or `US`). |
| `sys.sunrise` | `number` | Unix UTC (s) | Sunrise time in Unix epoch seconds (UTC). |
| `sys.sunset` | `number` | Unix UTC (s) | Sunset time in Unix epoch seconds (UTC). |
| `timezone` | `number` | s | Offset in seconds from UTC for the local time zone (for example, `3600` for UTC+1). |
| `id` | `number` | — | Deprecated OpenWeatherMap city identifier. |
| `name` | `string` | — | Deprecated matched locality name (returns an empty string for unpopulated or open-ocean coordinates). |
| `cod` | `number` | — | Internal status code (`200` as a JSON `number` on success). |

## Status codes

| Status code | Meaning | Description |
| --- | --- | --- |
| `200` | OK | Current weather payload returned (`cod` is `200`). |
| `400` | Bad Request | Missing location parameters or out-of-range coordinates (`cod` is `"400"`). |
| `401` | Unauthorized | Missing, invalid, inactive, or unauthorized `appid` (`cod` is `401`). |
| `404` | Not Found | Legacy `q`, `id`, or `zip` lookup matched no record (`cod` is `"404"`). |
| `429` | Too Many Requests | Account rate limit exceeded (`cod` is `429`). |
| `5xx` | Server Error | Upstream OpenWeatherMap server or gateway error. |

For full error payload schemas and `cod` type behavior, see [Error codes](./error-codes).
