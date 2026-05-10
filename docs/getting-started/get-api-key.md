---
sidebar_position: 2
---

# Get Your API Key

Every request to the OpenWeatherMap API requires an API key for authentication.
This guide walks you through generating one.

## Step 1: Create an Account

1. Go to [home.openweathermap.org/users/sign_up](https://home.openweathermap.org/users/sign_up)
2. Fill in your email, username, and password
3. Agree to the terms of service
4. Click **Create Account**
5. Verify your email address

## Step 2: Generate an API Key

1. Log in to your [OpenWeatherMap dashboard](https://home.openweathermap.org/)
2. Navigate to **API keys** in the top menu
3. You'll see a default key already generated
4. (Optional) Click **Generate** to create a new key with a custom name

## Step 3: Wait for Activation

:::caution
New API keys take **up to 2 hours** to activate. If you get a `401` error
immediately after generating a key, wait and try again.
:::

## Step 4: Test Your Key

Run this command in your terminal, replacing `YOUR_API_KEY` with your actual key:

```bash
curl "https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY"
```

**Expected response** (abbreviated):

```json
{
  "coord": { "lon": -0.1257, "lat": 51.5085 },
  "weather": [{ "main": "Clouds", "description": "overcast clouds" }],
  "main": { "temp": 285.15, "humidity": 72 },
  "name": "London",
  "cod": 200
}
```

If you see `"cod": 200`, your key is active and working.

:::tip
Store your API key as an environment variable to avoid hardcoding it in scripts:

```bash
export OPENWEATHER_API_KEY="your_key_here"
```
:::

**Next:** [Make Your First Request →](./first-request)
