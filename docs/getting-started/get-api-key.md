---
sidebar_position: 2
title: Get your API key
description: Create a free OpenWeatherMap account, copy your API key, store it in OPENWEATHER_API_KEY, and confirm activation.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Get your API key

Every request to the OpenWeatherMap REST API authenticates with an API key passed in the `appid` query parameter. Follow these steps to create a free account, retrieve your key, store it in an environment variable, and verify that it's active.

## Step 1: Create an OpenWeatherMap account

1. Open the [OpenWeatherMap sign-up page](https://home.openweathermap.org/users/sign_up) in your browser.
2. Enter a username, your email address, and a password.
3. Confirm that you meet the age requirement, accept the privacy policy and terms of service, and select **Create Account**.
4. Open the verification email from OpenWeatherMap and select the confirmation link to activate your account.

## Step 2: Copy or generate an API key

1. Sign in to your [OpenWeatherMap account](https://home.openweathermap.org/).
2. Select your username in the top navigation bar and select **My API keys**, or open `https://home.openweathermap.org/api_keys` directly on the [My API keys page](https://home.openweathermap.org/api_keys).
3. Locate the **Default** key created automatically for your account, or enter a label such as `local-dev` under **Create key** and select **Generate** to create a dedicated key.
4. Copy the 32-character hexadecimal key string to your clipboard.

## Step 3: Store your key in an environment variable

Code samples and tutorials throughout this documentation read your key from the `OPENWEATHER_API_KEY` environment variable so credentials stay out of your source code.

1. Set `OPENWEATHER_API_KEY` in your terminal session, replacing `your_api_key` with the 32-character key you copied.

<Tabs groupId="os">
<TabItem value="unix" label="macOS / Linux" default>

```bash
export OPENWEATHER_API_KEY="your_api_key"
```

To keep the variable available in future terminal windows, append the `export` line to `~/.zshrc` (macOS and Zsh) or `~/.bashrc` (Linux and Bash) and reload your shell configuration.

</TabItem>
<TabItem value="windows" label="Windows (PowerShell)">

```powershell
$env:OPENWEATHER_API_KEY = "your_api_key"
```

To persist the variable across future PowerShell sessions for your user account, run `[Environment]::SetEnvironmentVariable("OPENWEATHER_API_KEY", "your_api_key", "User")` and open a new terminal window.

</TabItem>
</Tabs>

2. Print the variable to confirm that your current terminal session recognizes it.

<Tabs groupId="os">
<TabItem value="unix" label="macOS / Linux" default>

```bash
echo "$OPENWEATHER_API_KEY"
```

</TabItem>
<TabItem value="windows" label="Windows (PowerShell)">

```powershell
$env:OPENWEATHER_API_KEY
```

</TabItem>
</Tabs>

:::warning Never commit API keys to Git
Treat your API key like a password. Never hardcode it in application files or commit it to Git repositories. Load credentials from environment variables, and add `.env` files to `.gitignore` before making your first commit.
:::

## Step 4: Wait for activation and verify your key

New API keys typically activate within 10–15 minutes, though activation can take up to 2 hours.

1. Send a test request for London using your `OPENWEATHER_API_KEY` environment variable.

<Tabs groupId="os">
<TabItem value="unix" label="macOS / Linux" default>

```bash
curl "https://api.openweathermap.org/data/2.5/weather?q=London&appid=$OPENWEATHER_API_KEY"
```

</TabItem>
<TabItem value="windows" label="Windows (PowerShell)">

```powershell
curl.exe "https://api.openweathermap.org/data/2.5/weather?q=London&appid=$env:OPENWEATHER_API_KEY"
```

</TabItem>
</Tabs>

2. Compare the JSON response against the two possible states below.

### Pending activation (`401 Unauthorized`)

If your key is still activating—or if `OPENWEATHER_API_KEY` contains a typo—the API returns HTTP `401` with this JSON error payload:

```json
{
  "cod": 401,
  "message": "Invalid API key. See https://openweathermap.org/faq#error401 for more info."
}
```

Confirm that `OPENWEATHER_API_KEY` matches the 32-character string on your [My API keys page](https://home.openweathermap.org/api_keys) with no extra spaces, wait 10–15 minutes, and run the command again.

### Active key (`200 OK`)

Once activation finishes, the endpoint returns a `200 OK` weather payload (abbreviated below):

```json
{
  "coord": { "lon": -0.1257, "lat": 51.5085 },
  "weather": [
    {
      "id": 804,
      "main": "Clouds",
      "description": "overcast clouds",
      "icon": "04d"
    }
  ],
  "main": {
    "temp": 285.15,
    "feels_like": 284.32,
    "humidity": 72
  },
  "name": "London",
  "cod": 200
}
```

When you see `"cod": 200`, your API key is active and ready to use. Notice that `"temp": 285.15` uses **Kelvin** by default when `units` is omitted, which you'll switch to Celsius on the next page.

## Next step

Continue to [Make your first request](./first-request) to fetch metric weather data with `curl`, Node.js, or Python.
