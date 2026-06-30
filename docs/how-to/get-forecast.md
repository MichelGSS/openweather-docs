---
sidebar_position: 2
---

# Get a 5-day forecast

The 5-Day Forecast endpoint (`/forecast`) provides weather data with a 3-hour step. This means you will receive 40 data points covering the next 5 days.

## The endpoint

```http
GET https://api.openweathermap.org/data/2.5/forecast
```

The query parameters are identical to the Current Weather endpoint. You can query by `q` (city name) or `lat` / `lon` (coordinates).

## Making the request

```bash
curl "https://api.openweathermap.org/data/2.5/forecast?q=London&units=metric&appid=$OPENWEATHER_API_KEY"
```

## Understanding the payload

The response structure is slightly different from the current weather endpoint. Instead of a single object, you get a `list` array containing 40 objects.

```json
{
  "cod": "200",
  "message": 0,
  "cnt": 40,
  "list": [
    {
      "dt": 1661871600,
      "main": {
        "temp": 14.5,
        "temp_min": 14.5,
        "temp_max": 15.2,
        "humidity": 80
      },
      "weather": [{"main": "Rain", "description": "light rain"}],
      "dt_txt": "2024-05-09 15:00:00"
    },
    // ... 39 more items ...
  ],
  "city": {
    "name": "London",
    "country": "GB",
    "timezone": 3600
  }
}
```

For this task, you only need two fields: `list[]`, the array of forecast blocks,
and `list[].dt_txt`, the forecasted date and time in text format (UTC). For the
complete field reference, see the [5-day forecast endpoint](../reference/forecast).

## Filtering by day

Because the API returns 3-hour steps, if you want to show the user a "Daily High/Low", you will need to aggregate this data on your client or backend.

Here is a quick Node.js example of how you might group the 3-hour steps into daily forecasts:

```javascript
// Assuming 'data' is the parsed JSON response
const dailyForecasts = {};

data.list.forEach(item => {
  // Extract just the date part (YYYY-MM-DD) from the dt_txt string
  const date = item.dt_txt.split(' ')[0];
  
  if (!dailyForecasts[date]) {
    dailyForecasts[date] = [];
  }
  
  dailyForecasts[date].push(item);
});

// Now dailyForecasts has keys for each day, containing arrays of 3-hour steps.
console.log(Object.keys(dailyForecasts)); 
// Output: [ '2024-05-09', '2024-05-10', '2024-05-11', '2024-05-12', '2024-05-13' ]
```

:::tip Pro tip
If your app only needs daily aggregations (and not 3-hour steps), consider looking at OpenWeatherMap's One Call API (requires a credit card even for the free tier), as it natively returns aggregated daily data.
:::
