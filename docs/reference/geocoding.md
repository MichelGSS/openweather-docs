---
sidebar_position: 4
title: Geocoding endpoints
description: Complete API reference for OpenWeatherMap Geocoding API 1.0 endpoints (/geo/1.0/direct, /geo/1.0/zip, and /geo/1.0/reverse), including parameters, schemas, and empty-array behavior.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Geocoding endpoints

OpenWeatherMap Geocoding API 1.0 converts city names and postal codes into geographic coordinates (`lat` and `lon`) and converts coordinate pairs back into named localities.

For two-step coordinate resolution and caching recipes, see [Use geographic coordinates](../how-to/use-coordinates).

:::info Empty result behavior
The `/geo/1.0/direct` and `/geo/1.0/reverse` endpoints return HTTP `200 OK` with an empty JSON array (`[]`) when no location matches your query, rather than HTTP `404 Not Found`. Always verify that the array contains at least one element before reading index `0`. By contrast, `/geo/1.0/zip` returns HTTP `404 Not Found` with a JSON error object when a postal code is unrecognized.
:::

## Direct geocoding by place name

Resolves a city or locality name into up to 5 candidate coordinate records.

```http
GET https://api.openweathermap.org/geo/1.0/direct
```

### Query parameters

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `q` | `string` | Yes | — | Comma-separated city name, state code (US locations only), and ISO 3166-1 alpha-2 country code formatted as `{city},{state},{country}` (for example, `London,GB` or `Portland,OR,US`). URL-encode spaces and special characters. |
| `limit` | `number` | No | `1` | Maximum number of matching locations returned in the response array, from `1` to `5`. |
| `appid` | `string` | Yes | — | 32-character hexadecimal API key. See [Authentication](./authentication). |

### Request examples

<Tabs groupId="language">
<TabItem value="curl" label="curl" default>

```bash
curl --get "https://api.openweathermap.org/geo/1.0/direct" \
  --data-urlencode "q=London" \
  --data-urlencode "limit=2" \
  --data-urlencode "appid=$OPENWEATHER_API_KEY"
```

</TabItem>
<TabItem value="nodejs" label="Node.js">

```javascript
const params = new URLSearchParams({
  q: 'London',
  limit: '2',
  appid: process.env.OPENWEATHER_API_KEY,
});

const response = await fetch(
  `https://api.openweathermap.org/geo/1.0/direct?${params}`,
  { signal: AbortSignal.timeout(10000) }
);

if (!response.ok) {
  throw new Error(`HTTP ${response.status}`);
}

const locations = await response.json();
console.log(locations);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import os
import requests

response = requests.get(
    "https://api.openweathermap.org/geo/1.0/direct",
    params={
        "q": "London",
        "limit": 2,
        "appid": os.environ["OPENWEATHER_API_KEY"],
    },
    timeout=10,
)
response.raise_for_status()
locations = response.json()
print(locations)
```

</TabItem>
</Tabs>

### Response

Example `200 OK` JSON array payload (`local_names` abbreviated for readability):

```json
[
  {
    "name": "London",
    "local_names": {
      "ascii": "London",
      "en": "London",
      "es": "Londres",
      "feature_name": "London",
      "fr": "Londres"
    },
    "lat": 51.5073219,
    "lon": -0.1276474,
    "country": "GB",
    "state": "England"
  },
  {
    "name": "London",
    "local_names": {
      "en": "London",
      "fr": "London"
    },
    "lat": 42.9832406,
    "lon": -81.243372,
    "country": "CA",
    "state": "Ontario"
  }
]
```

### Response fields

The root response is a JSON array (`0`–`5` elements). Each element contains the following fields:

| Field | Type | Unit | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | Canonical name of the matched locality. |
| `local_names` | `object` | — | Optional. Map of localized names and transliterations for the locality. |
| `local_names.<lang>` | `string` | — | Optional. Locality name translated into ISO language code `<lang>` (such as `en`, `es`, or `fr`). |
| `local_names.ascii` | `string` | — | Optional. ASCII transliteration of the locality name. |
| `local_names.feature_name` | `string` | — | Optional. Internal OpenWeatherMap geographic feature name. |
| `lat` | `number` | Decimal degrees | Latitude of the matched locality (`-90` to `90`). |
| `lon` | `number` | Decimal degrees | Longitude of the matched locality (`-180` to `180`). |
| `country` | `string` | — | ISO 3166-1 alpha-2 country code (for example, `GB` or `CA`). |
| `state` | `string` | — | Optional. State, province, or administrative region name when available. |

## Direct geocoding by postal or ZIP code

Resolves a postal or ZIP code and country code into a single geographic coordinate object.

```http
GET https://api.openweathermap.org/geo/1.0/zip
```

### Query parameters

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `zip` | `string` | Yes | — | Postal or ZIP code and ISO 3166-1 alpha-2 country code formatted as `{zip code},{country code}` (for example, `E14,GB` or `94040,US`). Defaults to `US` when the country code is omitted. |
| `appid` | `string` | Yes | — | 32-character hexadecimal API key. See [Authentication](./authentication). |

### Request example

```bash
curl --get "https://api.openweathermap.org/geo/1.0/zip" \
  --data-urlencode "zip=E14,GB" \
  --data-urlencode "appid=$OPENWEATHER_API_KEY"
```

### Response

Example `200 OK` JSON object payload:

```json
{
  "zip": "E14",
  "name": "London",
  "lat": 51.5096,
  "lon": -0.0156,
  "country": "GB"
}
```

### Response fields

| Field | Type | Unit | Description |
| --- | --- | --- | --- |
| `zip` | `string` | — | Matched postal or ZIP code. |
| `name` | `string` | — | Locality or district name associated with the postal code. |
| `lat` | `number` | Decimal degrees | Latitude of the postal area centroid (`-90` to `90`). |
| `lon` | `number` | Decimal degrees | Longitude of the postal area centroid (`-180` to `180`). |
| `country` | `string` | — | ISO 3166-1 alpha-2 country code (for example, `GB` or `US`). |

## Reverse geocoding by coordinates

Resolves a geographic coordinate pair (`lat` and `lon`) into up to 5 nearby named localities.

```http
GET https://api.openweathermap.org/geo/1.0/reverse
```

### Query parameters

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `lat` | `number` | Yes | — | Latitude in decimal degrees, ranging from `-90` to `90` (positive for north, negative for south). |
| `lon` | `number` | Yes | — | Longitude in decimal degrees, ranging from `-180` to `180` (positive for east, negative for west). |
| `limit` | `number` | No | `1` | Maximum number of nearby localities returned in the response array, from `1` to `5`. |
| `appid` | `string` | Yes | — | 32-character hexadecimal API key. See [Authentication](./authentication). |

### Request example

```bash
curl --get "https://api.openweathermap.org/geo/1.0/reverse" \
  --data-urlencode "lat=51.5098" \
  --data-urlencode "lon=-0.1180" \
  --data-urlencode "limit=1" \
  --data-urlencode "appid=$OPENWEATHER_API_KEY"
```

### Response

Example `200 OK` JSON array payload:

```json
[
  {
    "name": "City of Westminster",
    "local_names": {
      "ascii": "City of Westminster",
      "en": "City of Westminster",
      "feature_name": "City of Westminster",
      "fr": "Cité de Westminster"
    },
    "lat": 51.4973206,
    "lon": -0.137149,
    "country": "GB",
    "state": "England"
  }
]
```

### Response fields

Returns a JSON array (`0`–`5` elements) using the identical element schema documented under [Direct geocoding by place name](#response-fields) (`name`, `local_names`, `lat`, `lon`, `country`, and `state`).

## Status codes

| Status code | Meaning | Description |
| --- | --- | --- |
| `200` | OK | Request succeeded. Returns a JSON array on `/direct` and `/reverse` (including `[]` when no location matches) or a JSON object on `/zip`. |
| `400` | Bad Request | Missing required query parameter (`"Nothing to geocode"`) or out-of-range coordinates (`cod` is `"400"`). |
| `401` | Unauthorized | Missing, invalid, inactive, or unauthorized `appid` (`cod` is `401`). |
| `404` | Not Found | Postal code not found on `/geo/1.0/zip` (`cod` is `"404"`). |
| `429` | Too Many Requests | Account rate limit exceeded (`cod` is `429`). |
| `5xx` | Server Error | Upstream OpenWeatherMap server or gateway error. |

For full error payload schemas and `cod` type behavior, see [Error codes](./error-codes).
