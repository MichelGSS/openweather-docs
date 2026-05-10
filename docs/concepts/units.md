---
sidebar_position: 2
---

# Understanding Units (Metric vs Imperial)

The OpenWeatherMap API provides a single parameter, `units`, that dictates how all measurable data (temperature, wind speed) is formatted in the response.

## The Default State: Standard (Kelvin)

If you omit the `units` parameter from your API call, OpenWeatherMap defaults to `standard` units. 

In the `standard` format, temperature is returned in **Kelvin**. This is a common source of confusion for new developers who see an output like `"temp": 298.15` and believe the API is broken.

## Available Unit Systems

You can pass `units=metric` or `units=imperial` in your query string to receive formatted data.

| Measurement | `standard` (Default) | `units=metric` | `units=imperial` |
|-------------|----------------------|----------------|------------------|
| **Temperature** | Kelvin (K) | Celsius (°C) | Fahrenheit (°F) |
| **Wind Speed** | Meters per second (m/s) | Meters per second (m/s) | Miles per hour (mph) |

:::info Important Distinction
Notice that **Wind Speed** remains as meters per second (`m/s`) even when requesting `metric` units. If your application expects kilometers per hour (`km/h`), you must convert this manually on the client side by multiplying the `m/s` value by `3.6`.
:::

## Example Comparison

**Metric Request:**
```bash
curl "https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=API_KEY"
```
```json
"main": {
  "temp": 15.4
},
"wind": {
  "speed": 4.1
}
```

**Imperial Request:**
```bash
curl "https://api.openweathermap.org/data/2.5/weather?q=London&units=imperial&appid=API_KEY"
```
```json
"main": {
  "temp": 59.72
},
"wind": {
  "speed": 9.17
}
```
