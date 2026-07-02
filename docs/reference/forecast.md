---
sidebar_position: 3
---

# 5-day forecast endpoint

Returns weather forecasting data with 3-hour steps for the next 5 days.

## Endpoint

```
GET https://api.openweathermap.org/data/2.5/forecast
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
| `cnt`     | number | No       | 40       | Number of timestamps returned in the API response |
| `units`   | string | No       | standard | `standard`, `metric`, `imperial`       |
| `lang`    | string | No       | en       | Response language                      |

## Request example

```bash
curl "https://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=YOUR_API_KEY"
```

## Response snippet

```json
{
  "cod": "200",
  "message": 0,
  "cnt": 40,
  "list": [
    {
      "dt": 1661871600,
      "main": {
        "temp": 296.76,
        "feels_like": 296.98,
        "temp_min": 296.76,
        "temp_max": 297.87,
        "pressure": 1015,
        "sea_level": 1015,
        "grnd_level": 933,
        "humidity": 69,
        "temp_kf": -1.11
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
        "all": 100
      },
      "wind": {
        "speed": 0.62,
        "deg": 349,
        "gust": 1.18
      },
      "visibility": 10000,
      "pop": 0.32,
      "rain": {
        "3h": 0.26
      },
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2022-08-30 15:00:00"
    }
  ],
  "city": {
    "id": 3163858,
    "name": "Zocca",
    "coord": {
      "lat": 44.34,
      "lon": 10.99
    },
    "country": "IT",
    "population": 4593,
    "timezone": 7200,
    "sunrise": 1661834187,
    "sunset": 1661882248
  }
}
```

## Response fields

*The inner structures of `main`, `weather`, `clouds`, and `wind` are identical to the [Current weather endpoint](./current-weather).*

| Field               | Type   | Description                                      |
|---------------------|--------|--------------------------------------------------|
| `cnt`               | number | Number of data points returned in the `list` array|
| `list`              | array  | Array containing the 3-hour forecast blocks      |
| `list[].dt`         | number | Time of data forecasted (Unix timestamp, UTC)    |
| `list[].dt_txt`     | string | Time of data forecasted, text format (UTC)       |
| `list[].pop`        | number | Probability of precipitation (0.0 to 1.0)        |
| `list[].rain.3h`    | number | Rain volume for last 3 hours, mm                 |
| `city`              | object | Data regarding the requested location            |
| `city.timezone`     | number | Shift in seconds from UTC                        |
