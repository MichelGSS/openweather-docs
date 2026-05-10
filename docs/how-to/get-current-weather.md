---
sidebar_position: 1
---

# Get Current Weather by City

The most common way to fetch weather data is by searching for a city name. 

## The Basics

To fetch weather by city name, you must use the `q` parameter on the `/weather` endpoint.

```http
GET https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
```

### Example: Single Word City

For a single-word city like Paris, just append it directly to `q`:

```bash
curl "https://api.openweathermap.org/data/2.5/weather?q=Paris&appid=$OPENWEATHER_API_KEY&units=metric"
```

### Example: Multi-Word City

If the city contains spaces, ensure it is properly URL-encoded. You can replace spaces with `%20` or `+`.

```bash
curl "https://api.openweathermap.org/data/2.5/weather?q=Rio+de+Janeiro&appid=$OPENWEATHER_API_KEY&units=metric"
```

## Dealing with Ambiguity (State and Country Codes)

Many cities share the same name (e.g., London, UK vs. London, Ontario, Canada). OpenWeatherMap returns the most relevant result based on their internal ranking. 

To be precise, you can append the **State Code** (US only) and **ISO 3166 Country Code**, separated by commas: `q={city name},{state code},{country code}`.

### Example: London, UK vs London, US

**London, UK:**
```bash
curl "https://api.openweathermap.org/data/2.5/weather?q=London,GB&appid=$OPENWEATHER_API_KEY"
```

**London, Kentucky, Canada:**
```bash
curl "https://api.openweathermap.org/data/2.5/weather?q=London,CA&appid=$OPENWEATHER_API_KEY"
```

:::warning Note on State Codes
State codes are only supported for locations within the United States. For other countries, specify only the city and the country code.
:::

## Best Practices

While querying by city name is convenient, city names change, have multiple spellings, and can be ambiguous. 
If you are building a production application where accuracy is critical, it is highly recommended to [Use Geographic Coordinates](./use-coordinates) instead.
