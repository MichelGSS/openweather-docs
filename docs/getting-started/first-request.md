---
sidebar_position: 3
---

# Make your first request

Let's get the current weather for a city. This takes less than 2 minutes.

## Using curl

```bash
curl "https://api.openweathermap.org/data/2.5/weather?q=Rio+de+Janeiro&units=metric&appid=$OPENWEATHER_API_KEY"
```

## Using JavaScript (Node.js)

```javascript
const API_KEY = process.env.OPENWEATHER_API_KEY;
const city = "Rio de Janeiro";

const response = await fetch(
  `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
);

const data = await response.json();
console.log(`${data.name}: ${data.main.temp}°C, ${data.weather[0].description}`);
// Output: Rio de Janeiro: 28.5°C, clear sky
```

:::note
This example requires Node.js 18+ (for the built-in `fetch`) and uses
top-level `await`, which only works in ES modules. Save the file with the
`.mjs` extension (e.g., `weather.mjs`) or add `"type": "module"` to your
`package.json`, then run it with `node weather.mjs`.
:::

## Using Python

```python
import os
import requests

api_key = os.environ["OPENWEATHER_API_KEY"]
city = "Rio de Janeiro"

response = requests.get(
    f"https://api.openweathermap.org/data/2.5/weather?q={city}&units=metric&appid={api_key}"
)

data = response.json()
print(f"{data['name']}: {data['main']['temp']}°C, {data['weather'][0]['description']}")
# Output: Rio de Janeiro: 28.5°C, clear sky
```

## Understanding the response

| Field                        | Description                            |
|------------------------------|----------------------------------------|
| `name`                       | City name                              |
| `main.temp`                  | Temperature (in the unit you requested)|
| `main.humidity`              | Humidity percentage                    |
| `weather[0].description`     | Human-readable weather condition       |
| `wind.speed`                 | Wind speed (m/s for metric)            |
| `cod`                        | HTTP status code (200 = success)       |

**You're set.** You've authenticated, made a request, and parsed the response.

**Next steps:**
- [Build a weather dashboard →](../tutorials/weather-dashboard) (tutorial)
- [Explore the API reference →](../reference/current-weather) (reference)
