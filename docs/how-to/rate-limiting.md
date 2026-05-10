---
sidebar_position: 5
---

# Set Up Rate Limiting

The Free Tier of OpenWeatherMap allows **60 requests per minute**. If you exceed this, you will receive a `429 Too Many Requests` response.

If you are fetching data for multiple locations in a loop, or if you have high traffic on your frontend, you must implement Rate Limiting.

## Frontend vs Backend Calls

**Never call the API directly from the frontend in production.**

If 100 users open your website at the same time, your frontend will make 100 API calls instantly. You will hit the rate limit, and 40 users will see broken data.

Instead, route calls through your own backend proxy.

## Setting up a Caching Proxy (Node.js/Express)

The best way to respect rate limits is to **cache** the data. Weather doesn't change every second. Caching data for 10 minutes is completely acceptable.

Here is an example using Express and an in-memory cache:

```javascript
const express = require('express');
const fetch = require('node-fetch');
const app = express();

const API_KEY = process.env.OPENWEATHER_API_KEY;

// Simple in-memory cache object
const cache = {};
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

app.get('/api/weather/:city', async (req, res) => {
  const city = req.params.city.toLowerCase();

  // 1. Check if we have valid cached data
  if (cache[city] && (Date.now() - cache[city].timestamp < CACHE_DURATION_MS)) {
    console.log(`Serving ${city} from Cache`);
    return res.json(cache[city].data);
  }

  // 2. If not, fetch from OpenWeatherMap
  try {
    console.log(`Fetching ${city} from OpenWeatherMap API...`);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch data" });
    }

    const data = await response.json();

    // 3. Save to cache
    cache[city] = {
      timestamp: Date.now(),
      data: data
    };

    return res.json(data);

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3000, () => console.log('Proxy running on port 3000'));
```

### Why this is powerful:
If 1,000 users ask your backend for the weather in "London" within a 10-minute window, your backend makes **exactly 1 request** to OpenWeatherMap. The other 999 are served instantly from memory. You will never hit the 60req/min limit.

## Dealing with Batch Scripts

If you are running a cron-job or batch script that needs to fetch 100 cities, add a delay between requests to ensure you don't exceed 60 per minute (1 per second).

```javascript
// Wait utility
const delay = ms => new Promise(res => setTimeout(res, ms));

async function fetchAllCities(cities) {
  for (const city of cities) {
    await getWeather(city);
    // Wait 1.1 seconds between requests to stay safe
    await delay(1100); 
  }
}
```
