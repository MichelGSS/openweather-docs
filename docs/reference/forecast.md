---
sidebar_position: 3
title: 5-day forecast endpoint
description: Complete API reference for GET /data/2.5/forecast, including query parameters, multi-language request examples, 3-hour interval schema, city metadata, and status codes.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 5-day forecast endpoint

Returns 3-hour weather forecast intervals across 5 days (up to 40 intervals) for a geographic coordinate pair (`lat` and `lon`).

For daily aggregation and precipitation filtering patterns, see [Get a 5-day forecast](../how-to/get-forecast).

## Endpoint

```http
GET https://api.openweathermap.org/data/2.5/forecast
```

## Query parameters

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `lat` | `number` | Yes | — | Latitude in decimal degrees, ranging from `-90` to `90` (positive for north, negative for south). |
| `lon` | `number` | Yes | — | Longitude in decimal degrees, ranging from `-180` to `180` (positive for east, negative for west). |
| `appid` | `string` | Yes | — | 32-character hexadecimal API key. See [Authentication](./authentication). |
| `units` | `string` | No | `standard` | Measurement system for temperature and wind speed: `standard` (Kelvin, m/s), `metric` (Celsius, m/s), or `imperial` (Fahrenheit, mph). See [Unit systems and conversions](../concepts/units). |
| `cnt` | `number` | No | `40` | Number of chronological 3-hour forecast intervals to return, from `1` to `40` across 5 days (for example, `8` covers 24 hours). |
| `lang` | `string` | No | `en` | Language code for the localized `list[].weather[].description` value (such as `es`, `fr`, `de`, `ja`, or `pt_br`). |
| `mode` | `string` | No | `json` | Response payload format: `json` or `xml`. |

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

<Tabs groupId="language">
<TabItem value="curl" label="curl" default>

```bash
curl --get "https://api.openweathermap.org/data/2.5/forecast" \
  --data-urlencode "lat=51.5085" \
  --data-urlencode "lon=-0.1257" \
  --data-urlencode "units=metric" \
  --data-urlencode "cnt=8" \
  --data-urlencode "appid=$OPENWEATHER_API_KEY"
```

</TabItem>
<TabItem value="nodejs" label="Node.js">

```javascript
const params = new URLSearchParams({
  lat: '51.5085',
  lon: '-0.1257',
  units: 'metric',
  cnt: '8',
  appid: process.env.OPENWEATHER_API_KEY,
});

const response = await fetch(
  `https://api.openweathermap.org/data/2.5/forecast?${params}`,
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
    "https://api.openweathermap.org/data/2.5/forecast",
    params={
        "lat": 51.5085,
        "lon": -0.1257,
        "units": "metric",
        "cnt": 8,
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

## Response

Example `200 OK` JSON payload requested with `units=metric` and `cnt=2` (showing one daytime rainy interval and one nighttime cloudy interval alongside the `city` object):

```json
{
  "cod": "200",
  "message": 0,
  "cnt": 2,
  "list": [
    {
      "dt": 1715277600,
      "main": {
        "temp": 14.2,
        "feels_like": 13.6,
        "temp_min": 13.8,
        "temp_max": 14.2,
        "pressure": 1015,
        "sea_level": 1015,
        "grnd_level": 1011,
        "humidity": 76,
        "temp_kf": 0.4
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10d"
        }
      ],
      "clouds": {
        "all": 88
      },
      "wind": {
        "speed": 4.6,
        "deg": 225,
        "gust": 7.4
      },
      "visibility": 10000,
      "pop": 0.64,
      "rain": {
        "3h": 0.82
      },
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2024-05-09 18:00:00"
    },
    {
      "dt": 1715288400,
      "main": {
        "temp": 11.1,
        "feels_like": 10.4,
        "temp_min": 11.1,
        "temp_max": 11.1,
        "pressure": 1017,
        "sea_level": 1017,
        "grnd_level": 1013,
        "humidity": 82,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04n"
        }
      ],
      "clouds": {
        "all": 62
      },
      "wind": {
        "speed": 3.1,
        "deg": 240,
        "gust": 5.2
      },
      "visibility": 10000,
      "pop": 0.12,
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2024-05-09 21:00:00"
    }
  ],
  "city": {
    "id": 2643743,
    "name": "London",
    "coord": {
      "lat": 51.5085,
      "lon": -0.1257
    },
    "country": "GB",
    "population": 1000000,
    "timezone": 3600,
    "sunrise": 1715230800,
    "sunset": 1715284800
  }
}
```

## Response fields

| Field | Type | Unit | Description |
| --- | --- | --- | --- |
| `cod` | `string` | — | Internal status code. Returned as the string `"200"` on success, unlike the integer `200` returned by the [Current weather endpoint](./current-weather). |
| `message` | `number` | — | Internal OpenWeatherMap response parameter (`0` on normal responses). |
| `cnt` | `number` | — | Number of 3-hour forecast intervals returned in `list` (`1`–`40`). |
| `list` | `array` | — | Chronologically ordered array of 3-hour forecast interval objects. |
| `list[].dt` | `number` | Unix UTC (s) | Forecasted interval timestamp in Unix epoch seconds (UTC). |
| `list[].main.temp` | `number` | K, °C, or °F | Forecasted air temperature (`Kelvin` for `standard`, `Celsius` for `metric`, `Fahrenheit` for `imperial`). |
| `list[].main.feels_like` | `number` | K, °C, or °F | Human-perceived forecasted temperature accounting for wind chill and relative humidity. |
| `list[].main.temp_min` | `number` | K, °C, or °F | Optional internal minimum temperature bound at forecast calculation time. |
| `list[].main.temp_max` | `number` | K, °C, or °F | Optional internal maximum temperature bound at forecast calculation time. |
| `list[].main.pressure` | `number` | hPa | Forecasted atmospheric pressure at sea level by default. |
| `list[].main.sea_level` | `number` | hPa | Forecasted atmospheric pressure adjusted to mean sea level. |
| `list[].main.grnd_level` | `number` | hPa | Forecasted atmospheric pressure at local ground elevation. |
| `list[].main.humidity` | `number` | % | Forecasted relative humidity percentage (`0`–`100`). |
| `list[].main.temp_kf` | `number` | K, °C, or °F | Internal model calibration parameter. |
| `list[].weather` | `array` | — | List of weather condition objects for the interval (`list[].weather[0]` is primary). |
| `list[].weather[].id` | `number` | — | Numeric weather condition code. See [OpenWeatherMap weather condition codes](https://openweathermap.org/weather-conditions). |
| `list[].weather[].main` | `string` | — | Weather condition category (`Thunderstorm`, `Drizzle`, `Rain`, `Snow`, `Atmosphere`, `Clear`, or `Clouds`). |
| `list[].weather[].description` | `string` | — | Localized condition description within the category, controlled by `lang`. |
| `list[].weather[].icon` | `string` | — | Icon identifier (such as `10d` or `04n`). See [OpenWeatherMap weather condition codes](https://openweathermap.org/weather-conditions). |
| `list[].clouds.all` | `number` | % | Forecasted cloudiness percentage (`0`–`100`). |
| `list[].wind.speed` | `number` | m/s or mph | Forecasted sustained wind speed (`m/s` for `standard` and `metric`; `mph` for `imperial`). |
| `list[].wind.deg` | `number` | Degrees | Forecasted meteorological wind direction (`0`–`360`). |
| `list[].wind.gust` | `number` | m/s or mph | Optional. Forecasted peak wind gust speed (`m/s` for `standard` and `metric`; `mph` for `imperial`). |
| `list[].visibility` | `number` | m | Forecasted horizontal visibility in meters, capped at a maximum of `10000` (10 km). |
| `list[].pop` | `number` | Ratio | Probability of precipitation from `0.0` to `1.0` (`0.0` equals 0%, `1.0` equals 100%). |
| `list[].rain.3h` | `number` | mm | Optional. Forecasted liquid precipitation volume over the preceding 3 hours. Omitted when no rain is forecasted. |
| `list[].snow.3h` | `number` | mm | Optional. Forecasted snow liquid-equivalent volume over the preceding 3 hours. Omitted when no snow is forecasted. |
| `list[].sys.pod` | `string` | — | Part of the day at the forecasted timestamp: `"d"` for day or `"n"` for night. |
| `list[].dt_txt` | `string` | UTC | Forecasted timestamp formatted as `YYYY-MM-DD HH:MM:SS` in UTC. |
| `city.id` | `number` | — | Deprecated OpenWeatherMap city identifier. |
| `city.name` | `string` | — | Matched locality name. |
| `city.coord.lat` | `number` | Decimal degrees | Latitude of the matched location (`-90` to `90`). |
| `city.coord.lon` | `number` | Decimal degrees | Longitude of the matched location (`-180` to `180`). |
| `city.country` | `string` | — | ISO 3166-1 alpha-2 country code (for example, `GB` or `US`). |
| `city.population` | `number` | — | Estimated resident population of the matched locality. |
| `city.timezone` | `number` | s | Offset in seconds from UTC for the local time zone. |
| `city.sunrise` | `number` | Unix UTC (s) | Sunrise time in Unix epoch seconds (UTC). |
| `city.sunset` | `number` | Unix UTC (s) | Sunset time in Unix epoch seconds (UTC). |

## Status codes

| Status code | Meaning | Description |
| --- | --- | --- |
| `200` | OK | Forecast payload returned (`cod` is `"200"`). |
| `400` | Bad Request | Missing location parameters, invalid `cnt`, or out-of-range coordinates (`cod` is `"400"`). |
| `401` | Unauthorized | Missing, invalid, inactive, or unauthorized `appid` (`cod` is `401`). |
| `404` | Not Found | Legacy `q`, `id`, or `zip` lookup matched no record (`cod` is `"404"`). |
| `429` | Too Many Requests | Account rate limit exceeded (`cod` is `429`). |
| `5xx` | Server Error | Upstream OpenWeatherMap server or gateway error. |

For full error payload schemas and `cod` type behavior, see [Error codes](./error-codes).
