---
sidebar_position: 4
---

# Geocoding endpoint

The Geocoding API allows you to convert a city name into geographic coordinates (Latitude and Longitude), which is highly recommended for accurate weather queries.

## Endpoint

```
GET https://api.openweathermap.org/geo/1.0/direct
```

## Query parameters

| Parameter | Type   | Required | Default  | Description                            |
|-----------|--------|----------|----------|----------------------------------------|
| `q`       | string | Yes      | —        | City name, state code (only US), and country code divided by comma. (e.g., `London`, or `New York,US`) |
| `limit`   | number | No       | 1        | Number of the locations in the API response (up to 5 results) |
| `appid`   | string | Yes      | —        | Your API key                           |

## Request example

```bash
curl "https://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=YOUR_API_KEY"
```

## Response snippet

The response is a JSON array. If multiple cities match your query, and `limit` is set > 1, multiple objects are returned. The example below is truncated: the real `local_names` object contains dozens of translations.

```json
[
  {
    "name": "London",
    "local_names": {
      "en": "London",
      "ru": "Лондон",
      "ar": "لندن"
    },
    "lat": 51.5073219,
    "lon": -0.1276474,
    "country": "GB",
    "state": "England"
  },
  {
    "name": "London",
    "lat": 42.9834,
    "lon": -81.233,
    "country": "CA",
    "state": "Ontario"
  }
]
```

## Reverse geocoding

If you have coordinates and want to know the name of the city, use the Reverse Geocoding endpoint.

```
GET https://api.openweathermap.org/geo/1.0/reverse
```

**Parameters:** `lat`, `lon`, `limit`, `appid`.

**Example:**
```bash
curl "https://api.openweathermap.org/geo/1.0/reverse?lat=51.5098&lon=-0.1180&limit=1&appid=YOUR_API_KEY"
```
