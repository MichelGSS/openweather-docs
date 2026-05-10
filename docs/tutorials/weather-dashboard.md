---
sidebar_position: 1
---

# Tutorial: Build a Weather Dashboard (Node.js)

In this tutorial, you'll build a simple weather dashboard that displays
current conditions for multiple cities. By the end, you'll have a working
Node.js script that fetches and formats weather data from the API.

**Time:** ~20 minutes
**Level:** Beginner
**What you'll learn:**
- How to make multiple API requests
- How to handle errors gracefully
- How to format weather data for display

## Prerequisites

- Completed [Getting Started](../getting-started/prerequisites)
- Node.js 18+ installed
- A valid API key

## Step 1: Set Up the Project

Create a new directory and initialize the project:

```bash
mkdir weather-dashboard && cd weather-dashboard
touch dashboard.js
```

## Step 2: Define Your Cities

Open `dashboard.js` and add the cities you want to track:

```javascript
const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const cities = ["London", "New York", "Tokyo", "Rio de Janeiro", "Sydney"];
```

## Step 3: Create the Fetch Function

Add a function that fetches weather data for a single city:

```javascript
async function getWeather(city) {
  try {
    const response = await fetch(
      `${BASE_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch weather for ${city}: ${error.message}`);
    return null;
  }
}
```

## Step 4: Format the Output

Add a function that formats the weather data into a readable line:

```javascript
function formatWeather(data) {
  if (!data) return null;

  const { name, main, weather, wind } = data;
  return `${name.padEnd(20)} ${main.temp.toFixed(1)}°C  ${weather[0].description.padEnd(25)} Humidity: ${main.humidity}%  Wind: ${wind.speed} m/s`;
}
```

## Step 5: Build the Dashboard

Add the main function that fetches all cities and displays the results:

```javascript
async function runDashboard() {
  console.log("=".repeat(90));
  console.log(" WEATHER DASHBOARD");
  console.log("=".repeat(90));
  console.log("");

  const results = await Promise.all(cities.map(getWeather));
  const formatted = results.map(formatWeather).filter(Boolean);

  formatted.forEach((line) => console.log(` ${line}`));

  console.log("");
  console.log("=".repeat(90));
  console.log(` Last updated: ${new Date().toISOString()}`);
}

runDashboard();
```

## Step 6: Run It

```bash
node dashboard.js
```

**Expected output:**

```
==========================================================================================
 WEATHER DASHBOARD
==========================================================================================

 London               12.3°C  overcast clouds           Humidity: 81%  Wind: 5.2 m/s
 New York             18.7°C  clear sky                 Humidity: 45%  Wind: 3.1 m/s
 Tokyo                22.1°C  scattered clouds          Humidity: 68%  Wind: 2.8 m/s
 Rio de Janeiro       28.5°C  clear sky                 Humidity: 70%  Wind: 1.5 m/s
 Sydney               15.9°C  light rain                Humidity: 88%  Wind: 6.7 m/s

==========================================================================================
 Last updated: 2026-05-09T14:30:00.000Z
```

## What You Learned

- How to make concurrent API requests with `Promise.all`
- How to handle individual request failures without crashing the whole script
- How to format and display API data in a user-friendly way

## Next Steps

- [Build a CLI Tool (Python) →](./weather-cli) for a different approach
- [Handle Errors Gracefully →](../how-to/handle-errors) for production-ready error handling
- [API Reference →](../reference/current-weather) for all available fields
