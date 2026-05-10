---
sidebar_position: 2
---

# Tutorial: Build a Weather CLI Tool (Python)

In this tutorial, you'll build a command-line interface (CLI) tool using Python to fetch and display the weather for any location directly from your terminal.

**Time:** ~25 minutes  
**Level:** Intermediate  
**What you'll learn:**
- How to structure a Python CLI script
- Parsing arguments using the `argparse` module
- Making HTTP requests with the `requests` library
- Managing environment variables safely

## Prerequisites

- Python 3.8+ installed
- A valid OpenWeatherMap API key (set as `OPENWEATHER_API_KEY` in your environment)
- Basic understanding of Python

## Step 1: Set Up the Environment

First, create a new directory for your project and set up a virtual environment:

```bash
mkdir weather-cli && cd weather-cli
python3 -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

Install the required library for HTTP requests:

```bash
pip install requests
```

Create the main script file:

```bash
touch weather.py
```

## Step 2: Import Modules and Setup Constants

Open `weather.py` and start by importing the necessary modules:

```python
import os
import sys
import argparse
import requests

API_KEY = os.environ.get("OPENWEATHER_API_KEY")
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

if not API_KEY:
    print("Error: OPENWEATHER_API_KEY environment variable not set.", file=sys.stderr)
    sys.exit(1)
```

## Step 3: Parse Command-Line Arguments

We'll use `argparse` to allow users to specify the city and preferred units:

```python
def setup_parser():
    parser = argparse.ArgumentParser(description="Fetch current weather data.")
    parser.add_argument("city", type=str, nargs="+", help="City name (e.g., London or 'New York')")
    parser.add_argument("-u", "--units", choices=["metric", "imperial", "standard"], default="metric",
                        help="Temperature units (default: metric)")
    return parser
```

## Step 4: Fetch and Display the Data

Now, write the function to interact with the API and format the output:

```python
def get_weather(city, units):
    params = {
        "q": city,
        "appid": API_KEY,
        "units": units
    }

    try:
        response = requests.get(BASE_URL, params=params)
        response.raise_for_status()  # Raise an exception for HTTP errors
        data = response.json()
        
        # Format the output
        temp = data["main"]["temp"]
        desc = data["weather"][0]["description"].capitalize()
        unit_symbol = "°C" if units == "metric" else "°F" if units == "imperial" else "K"
        
        print(f"\n🌤️  Weather in {data['name']}, {data['sys']['country']}:")
        print(f"   {desc}")
        print(f"   Temperature: {temp}{unit_symbol}")
        print(f"   Humidity:    {data['main']['humidity']}%")
        print(f"   Wind Speed:  {data['wind']['speed']} {'m/s' if units == 'metric' else 'mph'}\n")
        
    except requests.exceptions.HTTPError as err:
        if response.status_code == 404:
            print(f"Error: City '{city}' not found.")
        elif response.status_code == 401:
            print("Error: Invalid API key.")
        else:
            print(f"HTTP Error: {err}")
    except Exception as e:
        print(f"An error occurred: {e}")

def main():
    parser = setup_parser()
    args = parser.parse_args()
    
    # Re-join multi-word cities like "New York"
    city_name = " ".join(args.city)
    
    get_weather(city_name, args.units)

if __name__ == "__main__":
    main()
```

## Step 5: Run Your CLI Tool

Make the file executable (optional, Linux/macOS) or run it using Python:

```bash
python weather.py Tokyo
```

**Expected Output:**

```
🌤️  Weather in Tokyo, JP:
   Scattered clouds
   Temperature: 22.1°C
   Humidity:    68%
   Wind Speed:  2.8 m/s
```

Try testing it with imperial units and multi-word cities:

```bash
python weather.py New York -u imperial
```

## What You Learned

- Using `sys` and `os` to safely read environment variables.
- Using `argparse` to handle CLI flags.
- Catching HTTP errors cleanly with `requests.raise_for_status()`.

## Next Steps

- Try expanding this CLI to use the [Geocoding Endpoint](../reference/geocoding) first, then passing coordinates to the weather endpoint.
- Explore the [5-Day Forecast Endpoint](../reference/forecast) to add a `--forecast` flag.
