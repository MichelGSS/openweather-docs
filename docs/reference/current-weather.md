---
sidebar_position: 2
---

# Current weather endpoint

Returns current weather data for a specified location.

## Endpoint

```
GET https://api.openweathermap.org/data/2.5/weather
```

## Query parameters

### Location (choose one)

Provide the location as a city name **or** as a coordinate pair — not both.

| Parameter    | Type   | Description                                  |
|--------------|--------|----------------------------------------------|
| `q`          | string | City name (e.g., `London`, `Rio+de+Janeiro`) |
| `lat`, `lon` | number | Latitude and longitude coordinates           |

### Other parameters

| Parameter | Type   | Required | Default  | Description                            |
|-----------|--------|----------|----------|----------------------------------------|
| `appid`   | string | Yes      | —        | Your API key                           |
| `units`   | string | No       | standard | `standard` (Kelvin), `metric` (Celsius), `imperial` (Fahrenheit) |
| `lang`    | string | No       | en       | Response language (e.g., `pt_br`, `es`, `fr`) |

## Request examples

**By city name:**

```bash
curl "https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=YOUR_API_KEY"
```

**By coordinates:**

```bash
curl "https://api.openweathermap.org/data/2.5/weather?lat=51.5085&lon=-0.1257&units=metric&appid=YOUR_API_KEY"
```

## Response

```json
{
  "coord": {
    "lon": -0.1257,
    "lat": 51.5085
  },
  "weather": [
    {
      "id": 804,
      "main": "Clouds",
      "description": "overcast clouds",
      "icon": "04d"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 12.3,
    "feels_like": 10.8,
    "temp_min": 10.5,
    "temp_max": 13.7,
    "pressure": 1015,
    "humidity": 81
  },
  "visibility": 10000,
  "wind": {
    "speed": 5.2,
    "deg": 230,
    "gust": 8.1
  },
  "clouds": {
    "all": 90
  },
  "dt": 1715270400,
  "sys": {
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

| Field                   | Type   | Description                                      |
|-------------------------|--------|--------------------------------------------------|
| `coord.lat`, `coord.lon`| number | Geographic coordinates                           |
| `weather[].main`        | string | Weather condition group (Rain, Snow, Clouds, etc)|
| `weather[].description` | string | Human-readable condition description             |
| `weather[].icon`        | string | Icon ID ([view icons](https://openweathermap.org/weather-conditions)) |
| `main.temp`             | number | Temperature in requested units                   |
| `main.feels_like`       | number | Perceived temperature                            |
| `main.temp_min`         | number | Minimum temperature at the moment                |
| `main.temp_max`         | number | Maximum temperature at the moment                |
| `main.pressure`         | number | Atmospheric pressure (hPa)                       |
| `main.humidity`         | number | Humidity percentage (%)                           |
| `visibility`            | number | Visibility distance (meters, max 10km)           |
| `wind.speed`            | number | Wind speed (m/s for metric, mph for imperial)    |
| `wind.deg`              | number | Wind direction (degrees)                         |
| `wind.gust`             | number | Wind gust speed                                  |
| `clouds.all`            | number | Cloudiness percentage (%)                        |
| `dt`                    | number | Data calculation time (Unix timestamp, UTC)      |
| `sys.country`           | string | Country code (ISO 3166)                          |
| `sys.sunrise`           | number | Sunrise time (Unix timestamp, UTC)               |
| `sys.sunset`            | number | Sunset time (Unix timestamp, UTC)                |
| `timezone`              | number | Shift from UTC in seconds                        |
| `name`                  | string | City name                                        |
| `cod`                   | number | HTTP status code                                 |

## Error responses

See [Error codes](./error-codes) for a complete list.
