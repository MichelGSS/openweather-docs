---
sidebar_position: 2
title: Build a weather CLI tool in Python
description: Build a command-line weather tool in Python using virtual environments, argparse flags, accurate unit mappings, and structured HTTP error handling.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Build a weather CLI tool in Python

In this tutorial, you'll build a Python command-line interface (`weather.py`) that accepts any city name and unit system flag (`metric`, `imperial`, or `standard`) and prints live weather conditions in your terminal.

- **Time:** 20–25 minutes
- **Level:** Intermediate
- **What you'll build:** A standalone Python CLI application (`weather.py`) inside a virtual environment that parses command-line flags, fetches live OpenWeatherMap data, formats unit-accurate output, and exits cleanly with actionable error messages.
- **What you'll learn:**
  - Isolate project dependencies inside a `.venv` virtual environment.
  - Parse multi-word city names and optional `--units` flags with `argparse`.
  - Map temperature (`°C`, `°F`, `K`) and wind speed (`m/s`, `mph`) units accurately across OpenWeatherMap unit modes.
  - Handle HTTP status codes, network timeouts, and optional JSON fields safely using `requests`, `sys.stderr`, and `sys.exit(1)`.

## Prerequisites

- **Environment and credentials:** Completed the [Getting started guide](../getting-started/prerequisites), with `OPENWEATHER_API_KEY` set in your active terminal session.
- **Runtime:** **Python 3.10 or later** installed.
- **Code editor:** [Visual Studio Code](https://code.visualstudio.com/) or another text editor.

## Step 1: Create a virtual environment and install dependencies

1. Create a `weather-cli` project directory, initialize and activate a `.venv` virtual environment, install `requests`, and create an empty `weather.py` script.

<Tabs groupId="os">
<TabItem value="unix" label="macOS / Linux" default>

```bash
mkdir weather-cli && cd weather-cli
python3 -m venv .venv && source .venv/bin/activate
python -m pip install requests
touch weather.py
```

</TabItem>
<TabItem value="windows" label="Windows (PowerShell)">

```powershell
New-Item -ItemType Directory -Path weather-cli | Out-Null
Set-Location weather-cli
python -m venv .venv; .\.venv\Scripts\Activate.ps1
python -m pip install requests
New-Item -ItemType File -Path weather.py | Out-Null
```

If PowerShell blocks `.ps1` activation scripts, run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` for the current window and run `.\.venv\Scripts\Activate.ps1` again.

</TabItem>
</Tabs>

When activation succeeds, your shell prompt displays `(.venv)` at the beginning of the line, and `python` points to the virtual environment interpreter on all operating systems.

## Step 2: Add imports, constants, and unit mappings

1. Open `weather.py` in Visual Studio Code and define your imports, API endpoint constant, and temperature unit lookup dictionary.

```python title="weather.py"
import argparse
import os
import sys
import requests

BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

TEMP_UNITS = {
    "metric": "°C",
    "imperial": "°F",
    "standard": "K",
}
```

## Step 3: Parse command-line arguments

1. Append `build_parser` to `weather.py`. Using `nargs="+"` on `city` lets callers pass multi-word city names such as `New York` or `Rio de Janeiro` with or without surrounding quotation marks.

```python title="weather.py"
def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Fetch current weather conditions for a city from OpenWeatherMap."
    )
    parser.add_argument(
        "city",
        nargs="+",
        help="City name, such as London or New York (quotes optional).",
    )
    parser.add_argument(
        "-u",
        "--units",
        choices=["metric", "imperial", "standard"],
        default="metric",
        help="Unit system for temperature and wind speed (default: metric).",
    )
    return parser
```

### Checkpoint: Verify the CLI help menu

Test your argument parser before writing the network layer.

1. Temporarily append these two lines to the bottom of `weather.py`.

```python title="weather.py"
if __name__ == "__main__":
    build_parser().parse_args()
```

2. Run `weather.py` with the `--help` flag.

```bash
python weather.py --help
```

**Expected output:**

```text
usage: weather.py [-h] [-u {metric,imperial,standard}] city [city ...]

Fetch current weather conditions for a city from OpenWeatherMap.

positional arguments:
  city                  City name, such as London or New York (quotes optional).

options:
  -h, --help            show this help message and exit
  -u, --units {metric,imperial,standard}
                        Unit system for temperature and wind speed (default: metric).
```

3. Remove the temporary two-line `if __name__ == "__main__":` block before continuing to Step 4.

## Step 4: Fetch weather data and handle errors

1. Append `get_weather` and `main` to `weather.py`. OpenWeatherMap returns wind speed in `m/s` for both `standard` and `metric` modes and switches to `mph` only when `units` is `imperial`, so `wind_unit` checks specifically for `"imperial"`. All failure paths write to `sys.stderr` and exit with status code `1`.

```python title="weather.py"
def get_weather(city: str, units: str, api_key: str) -> None:
    params = {
        "q": city,
        "appid": api_key,
        "units": units,
    }

    try:
        response = requests.get(BASE_URL, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.HTTPError as http_err:
        status_code = (
            http_err.response.status_code if http_err.response is not None else None
        )
        if status_code == 404:
            print(f"Error: City '{city}' was not found.", file=sys.stderr)
        elif status_code == 401:
            print(
                "Error: Authentication failed (HTTP 401). Check your OPENWEATHER_API_KEY value and activation status.",
                file=sys.stderr,
            )
        elif status_code == 429:
            print(
                "Error: Rate limit exceeded (HTTP 429). Wait a minute before retrying.",
                file=sys.stderr,
            )
        else:
            print(f"HTTP error: {http_err}", file=sys.stderr)
        sys.exit(1)
    except requests.exceptions.Timeout:
        print(
            "Error: Request timed out after 10 seconds. Check your network connection.",
            file=sys.stderr,
        )
        sys.exit(1)
    except requests.exceptions.RequestException as req_err:
        print(f"Network error: {req_err}", file=sys.stderr)
        sys.exit(1)

    name = data.get("name", city)
    country = data.get("sys", {}).get("country", "")
    location = f"{name}, {country}" if country else name

    weather_entries = data.get("weather") or [{}]
    condition = weather_entries[0].get("description", "unavailable").capitalize()

    main_readings = data.get("main", {})
    temp = main_readings.get("temp", 0.0)
    feels_like = main_readings.get("feels_like", 0.0)
    humidity = main_readings.get("humidity", 0)
    wind_speed = data.get("wind", {}).get("speed", 0.0)

    temp_unit = TEMP_UNITS[units]
    wind_unit = "mph" if units == "imperial" else "m/s"

    print(f"Weather in {location}")
    print(f"  Condition:   {condition}")
    print(f"  Temperature: {temp:.1f}{temp_unit} (feels like {feels_like:.1f}{temp_unit})")
    print(f"  Humidity:    {humidity}%")
    print(f"  Wind speed:  {wind_speed:.1f} {wind_unit}")


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    api_key = os.environ.get("OPENWEATHER_API_KEY")
    if not api_key:
        print(
            "Error: Missing OPENWEATHER_API_KEY environment variable. Set it before running weather.py.",
            file=sys.stderr,
        )
        sys.exit(1)

    city_name = " ".join(args.city)
    get_weather(city_name, args.units, api_key)


if __name__ == "__main__":
    main()
```

2. Expand the block below to verify your file against the complete script before running it.

<details>
<summary>View complete weather.py</summary>

```python title="weather.py"
import argparse
import os
import sys
import requests

BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

TEMP_UNITS = {
    "metric": "°C",
    "imperial": "°F",
    "standard": "K",
}


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Fetch current weather conditions for a city from OpenWeatherMap."
    )
    parser.add_argument(
        "city",
        nargs="+",
        help="City name, such as London or New York (quotes optional).",
    )
    parser.add_argument(
        "-u",
        "--units",
        choices=["metric", "imperial", "standard"],
        default="metric",
        help="Unit system for temperature and wind speed (default: metric).",
    )
    return parser


def get_weather(city: str, units: str, api_key: str) -> None:
    params = {
        "q": city,
        "appid": api_key,
        "units": units,
    }

    try:
        response = requests.get(BASE_URL, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.HTTPError as http_err:
        status_code = (
            http_err.response.status_code if http_err.response is not None else None
        )
        if status_code == 404:
            print(f"Error: City '{city}' was not found.", file=sys.stderr)
        elif status_code == 401:
            print(
                "Error: Authentication failed (HTTP 401). Check your OPENWEATHER_API_KEY value and activation status.",
                file=sys.stderr,
            )
        elif status_code == 429:
            print(
                "Error: Rate limit exceeded (HTTP 429). Wait a minute before retrying.",
                file=sys.stderr,
            )
        else:
            print(f"HTTP error: {http_err}", file=sys.stderr)
        sys.exit(1)
    except requests.exceptions.Timeout:
        print(
            "Error: Request timed out after 10 seconds. Check your network connection.",
            file=sys.stderr,
        )
        sys.exit(1)
    except requests.exceptions.RequestException as req_err:
        print(f"Network error: {req_err}", file=sys.stderr)
        sys.exit(1)

    name = data.get("name", city)
    country = data.get("sys", {}).get("country", "")
    location = f"{name}, {country}" if country else name

    weather_entries = data.get("weather") or [{}]
    condition = weather_entries[0].get("description", "unavailable").capitalize()

    main_readings = data.get("main", {})
    temp = main_readings.get("temp", 0.0)
    feels_like = main_readings.get("feels_like", 0.0)
    humidity = main_readings.get("humidity", 0)
    wind_speed = data.get("wind", {}).get("speed", 0.0)

    temp_unit = TEMP_UNITS[units]
    wind_unit = "mph" if units == "imperial" else "m/s"

    print(f"Weather in {location}")
    print(f"  Condition:   {condition}")
    print(f"  Temperature: {temp:.1f}{temp_unit} (feels like {feels_like:.1f}{temp_unit})")
    print(f"  Humidity:    {humidity}%")
    print(f"  Wind speed:  {wind_speed:.1f} {wind_unit}")


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    api_key = os.environ.get("OPENWEATHER_API_KEY")
    if not api_key:
        print(
            "Error: Missing OPENWEATHER_API_KEY environment variable. Set it before running weather.py.",
            file=sys.stderr,
        )
        sys.exit(1)

    city_name = " ".join(args.city)
    get_weather(city_name, args.units, api_key)


if __name__ == "__main__":
    main()
```

</details>

## Step 5: Run and test your CLI tool

1. Query a single-word city using the default `metric` unit system.

```bash
python weather.py Tokyo
```

**Expected output:**

```text
Weather in Tokyo, JP
  Condition:   Scattered clouds
  Temperature: 22.1°C (feels like 21.8°C)
  Humidity:    68%
  Wind speed:  2.8 m/s
```

2. Query a multi-word city with `--units imperial` to verify Fahrenheit temperatures and miles-per-hour wind speeds.

```bash
python weather.py New York --units imperial
```

**Expected output:**

```text
Weather in New York, US
  Condition:   Clear sky
  Temperature: 65.7°F (feels like 64.2°F)
  Humidity:    45%
  Wind speed:  6.9 mph
```

3. Pass a nonexistent city name to verify `404` status handling and `stderr` output.

```bash
python weather.py AtlantisNotACity
```

**Expected output:**

```text
Error: City 'AtlantisNotACity' was not found.
```

Because `weather.py` writes error messages to `sys.stderr` and exits with status code `1`, shell scripts and automation pipelines can detect failed queries reliably.

## What you learned

- Created an isolated `.venv` virtual environment and installed `requests` without polluting global Python packages.
- Configured `argparse` to accept unquoted multi-word city names and validated `--units` choices while keeping `--help` accessible without credentials.
- Mapped `metric`, `imperial`, and `standard` units accurately so `standard` and `metric` report wind speed in `m/s` and `imperial` reports `mph`.
- Used `timeout=10`, `.get()` dictionary lookups, `http_err.response.status_code`, `sys.stderr`, and `sys.exit(1)` for defensive CLI error handling.

## Next steps

- **Try the Node.js track:** Follow [Build a weather dashboard in Node.js](./weather-dashboard) to fetch multiple cities concurrently in a formatted terminal table.
- **Disambiguate city names:** Resolve exact latitude and longitude coordinates with [Use coordinates](../how-to/use-coordinates) and the [Geocoding reference](../reference/geocoding).
- **Add multi-day forecasts:** Extend your CLI with a `--forecast` flag using [Get a 5-day forecast](../how-to/get-forecast) and the [5-day forecast reference](../reference/forecast).
