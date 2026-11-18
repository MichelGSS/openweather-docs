---
sidebar_position: 2
description: Learn why OpenWeatherMap defaults to Kelvin, which SI fields never change under metric or imperial modes, and how unit choices affect backend caching.
---

# Unit systems and conversions

OpenWeatherMap exposes a `units` query parameter (`standard`, `metric`, or `imperial`) on its weather and forecast endpoints, alongside `timezone` offsets and `lang` translations. However, `units` does **not** transform every physical measurement in the JSON payload—a design detail that causes subtle display bugs when applications assume `units=imperial` converts pressure to inches of mercury or rain to inches.

## Why `standard` defaults to Kelvin

When a request omits the `units` parameter (or explicitly sets `units=standard`), OpenWeatherMap returns all temperature fields in **Kelvin (`K`)**. A mild afternoon reading of `20 °C` (`68 °F`) arrives as `293.15`.

OpenWeatherMap preserves Kelvin as the default for two reasons rooted in scientific computing:

- **Thermodynamic SI consistency**: Kelvin is the base unit of thermodynamic temperature in the International System of Units (SI), anchored at absolute zero (`0 K`, equivalent to `-273.15 °C`). Numerical Weather Prediction (NWP) models, radiative transfer formulas, and atmospheric gas-law equations compute directly in Kelvin because an absolute positive scale eliminates sign flips across the freezing point of water and keeps ratio math physically meaningful.
- **Backward compatibility for data pipelines**: Telemetry ingesters and scientific scripts built against Weather API 2.5 expect unparameterized requests to emit raw SI units (`K` for temperature and `m/s` for wind speed).

For human-facing interfaces, you must either pass `units=metric` or `units=imperial` in the request URL, or convert temperatures in your presentation layer.

## Unit-dependent versus unit-invariant fields

Only **temperature** and **wind speed** fields change when you switch `units` between `standard`, `metric`, and `imperial`. Every other physical measurement in OpenWeatherMap responses remains locked to a single SI or meteorological unit across all three modes.

### Fields modified by the `units` parameter

| Response fields | `standard` (default) | `units=metric` | `units=imperial` |
| --- | --- | --- | --- |
| `main.temp`, `main.feels_like`, `main.temp_min`, `main.temp_max` | Kelvin (`K`) | Celsius (`°C`) | Fahrenheit (`°F`) |
| `wind.speed`, `wind.gust` | Meters per second (`m/s`) | Meters per second (`m/s`) | Miles per hour (`mph`) |

:::info Metric wind speed uses meters per second
Both `standard` and `metric` report `wind.speed` and `wind.gust` in **meters per second (`m/s`)**, not kilometers per hour (`km/h`). To display `km/h` for metric locales such as Canada, Brazil, or mainland Europe, multiply the `m/s` value by `3.6`.
:::

### Unit-invariant fields across all `units` modes

| Response fields | Fixed unit across all modes | Common gotcha |
| --- | --- | --- |
| `main.pressure`, `main.sea_level`, `main.grnd_level` | Hectopascals (`hPa`, numerically equal to `mbar`) | Remains `hPa` even when `units=imperial`; never converted to inches of mercury (`inHg`). |
| `rain.1h`, `rain.3h`, `snow.1h`, `snow.3h` | Millimeters (`mm`) | Remains `mm` even when `units=imperial`; never converted to inches (`in`). |
| `visibility` | Meters (`m`), capped at `10000` (`10 km`) | Remains `m` across all modes; never converted to kilometers, miles, or feet. |
| `main.humidity`, `clouds.all` | Percentage (`%`, integer `0`–`100`) | Expressed as whole-number percentages (`75` means `75%`), unlike `pop`. |
| `pop` (5-day forecast) | Dimensionless ratio (`0`–`1` float) | Expressed as a decimal fraction (`0.75` means `75%`), unlike `humidity`. |
| `wind.deg` | Meteorological degrees (`0`–`360`) | Indicates the compass direction the wind blows **from** (`0` or `360` is north, `90` is east). |

## Side-by-side payload comparison

The three valid JSON excerpts below show the exact same London weather observation requested under `standard`, `metric`, and `imperial`. Compare `main.temp` and `wind.speed` against `main.pressure`, `visibility`, `wind.deg`, and `rain["1h"]`—the latter four fields remain byte-for-byte identical across all three payloads:

### Default `standard` payload

```json
{
  "main": {
    "temp": 288.55,
    "feels_like": 288.1,
    "pressure": 1012,
    "humidity": 76
  },
  "visibility": 10000,
  "wind": {
    "speed": 4.1,
    "deg": 240
  },
  "rain": {
    "1h": 2.54
  }
}
```

### `units=metric` payload

```json
{
  "main": {
    "temp": 15.4,
    "feels_like": 14.95,
    "pressure": 1012,
    "humidity": 76
  },
  "visibility": 10000,
  "wind": {
    "speed": 4.1,
    "deg": 240
  },
  "rain": {
    "1h": 2.54
  }
}
```

### `units=imperial` payload

```json
{
  "main": {
    "temp": 59.72,
    "feels_like": 58.91,
    "pressure": 1012,
    "humidity": 76
  },
  "visibility": 10000,
  "wind": {
    "speed": 9.17,
    "deg": 240
  },
  "rain": {
    "1h": 2.54
  }
}
```

## Standard conversion formulas

When building localized interfaces—especially for United States (`in`, `inHg`, `mi`), aviation (`kn`), or metric road-weather (`km/h`) displays—apply standard deterministic conversions in application code:

| Source measurement | Target unit | Conversion formula | Example |
| --- | --- | --- | --- |
| Temperature (`K`) | Celsius (`°C`) | `K - 273.15` | `288.55 K` → `15.40 °C` |
| Temperature (`°C`) | Fahrenheit (`°F`) | `(°C × 9 / 5) + 32` | `15.4 °C` → `59.72 °F` |
| Wind speed (`m/s`) | Kilometers per hour (`km/h`) | `m/s × 3.6` | `4.1 m/s` → `14.76 km/h` |
| Wind speed (`m/s`) | Miles per hour (`mph`) | `m/s × 2.23694` | `4.1 m/s` → `9.17 mph` |
| Wind speed (`m/s`) | Knots (`kn`) | `m/s × 1.94384` | `4.1 m/s` → `7.97 kn` |
| Precipitation (`mm`) | Inches (`in`) | `mm ÷ 25.4` | `2.54 mm` → `0.10 in` |
| Pressure (`hPa`) | Inches of mercury (`inHg`) | `hPa × 0.02953` | `1012 hPa` → `29.88 inHg` |
| Visibility (`m`) | Statute miles (`mi`) | `m ÷ 1609.344` | `10000 m` → `6.21 mi` |

## Architectural trade-off: server-side `units` versus client-side conversion

When designing an application that supports both Celsius and Fahrenheit users, you can choose between passing `units` dynamically to OpenWeatherMap or standardizing on a single canonical unit system inside your backend cache and converting values in the UI.

| Architectural dimension | Server-side `units` query parameter | Canonical backend `metric` + client UI conversion |
| --- | --- | --- |
| **Backend cache efficiency** | Splits cache entries by unit (`coord:51.507,-0.128:metric` versus `coord:51.507,-0.128:imperial`), doubling upstream API calls for international traffic. | Consolidates all visitors onto a single canonical cache key per location, cutting upstream API quota usage in half. |
| **UI unit-toggle responsiveness** | Switching between `°C` and `°F` requires an extra network round-trip (or storing duplicate payloads). | Toggling between `°C` and `°F` updates the screen instantaneously in memory with zero network latency. |
| **Coverage of SI-only fields** | Still requires client conversion if imperial users expect precipitation in `in`, pressure in `inHg`, or visibility in `mi`. | Centralizes all display formatting (`°C`/`°F`, `km/h`/`mph`, `mm`/`in`, `hPa`/`inHg`) in one pure formatting module. |
| **Best fit** | Single-locale CLI scripts, cron alerts, and stateless server-rendered views without unit toggles. | Multi-user web and mobile applications backed by a shared caching proxy. |

## Time zones (`timezone`) and localized text (`lang`)

Alongside physical units, OpenWeatherMap separates machine-invariant identifiers from human-localized presentation in timestamps and weather descriptions:

- **UTC timestamps and `timezone` shifts**: Every timestamp in the API (`dt`, `sys.sunrise`, `sys.sunset`, and `list[].dt`) is an integer count of **Unix UTC seconds**. To help format local civil clock times without an external time-zone database, `/data/2.5/weather` includes `timezone` (and `/data/2.5/forecast` includes `city.timezone`) representing the location's **shift in seconds from UTC** at the time of the request—such as `-18000` (`UTC-5`) or `32400` (`UTC+9`), automatically reflecting active daylight saving time rules.
- **Selective translation with `lang`**: Passing `lang` (for example, `lang=es`, `lang=fr`, or `lang=pt_br`) translates **only the human-readable `weather[].description` string** (and localized place names where available). Structural fields—including JSON keys, numeric condition codes (`weather[].id`), and category groups (`weather[].main`, such as `"Rain"`, `"Snow"`, or `"Clear"`)—remain in invariant English across every language so application icon mapping and conditional logic never break when you localize text.

## Related resources

- [Current weather reference](../reference/current-weather) for supported `units` and `lang` parameter values
- [How weather data works](./how-weather-data-works) for how spatial grids, observation windows, and `pop` ratios are modeled
- [API architecture overview](./architecture) for caching topologies across geocoding and weather services
- [Set up rate limiting and caching](../how-to/rate-limiting) for canonical cache-key normalization in Node.js and Python
