---
sidebar_position: 1
description: Fetch current weather observations by city name, URL-encode multi-word queries, disambiguate duplicate names with state and country codes, and localize descriptions.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Get current weather by city

Use the `q` query parameter on `/data/2.5/weather` to fetch real-time weather observations for a named city when you don't yet have latitude and longitude coordinates.

:::tip Prefer coordinates for production lookups
OpenWeatherMap's built-in city-name lookup (`q`) is a legacy convenience feature that relies on internal ranking when multiple places share a name. For unambiguous production queries, resolve place names first and [use geographic coordinates](./use-coordinates).
:::

Before running these examples, export your API key as `OPENWEATHER_API_KEY`. If you haven't created a key yet, see [Get an API key](../getting-started/get-api-key).

## Query by city name

Pass the city name in `q`, set `units=metric` to receive temperatures in Celsius, and include your key in `appid`:

<Tabs groupId="language">
<TabItem value="curl" label="curl" default>

```bash
curl --get "https://api.openweathermap.org/data/2.5/weather" \
  --data-urlencode "q=Paris" \
  --data-urlencode "units=metric" \
  --data-urlencode "appid=$OPENWEATHER_API_KEY"
```

</TabItem>
<TabItem value="nodejs" label="Node.js">

```javascript
const apiKey = process.env.OPENWEATHER_API_KEY;

async function getWeatherByCity(cityQuery) {
  const params = new URLSearchParams({
    q: cityQuery,
    units: 'metric',
    appid: apiKey,
  });

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?${params}`,
    { signal: AbortSignal.timeout(10000) }
  );

  if (!response.ok) {
    throw new Error(`Weather request failed with HTTP ${response.status}`);
  }

  return response.json();
}

const weather = await getWeatherByCity('Paris');
console.log(
  `${weather.name} (${weather.sys.country}): ${weather.main.temp} °C, ${weather.weather[0].description}`
);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import os
import requests

API_KEY = os.environ["OPENWEATHER_API_KEY"]
WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"


def get_weather_by_city(city_query: str) -> dict:
    params = {
        "q": city_query,
        "units": "metric",
        "appid": API_KEY,
    }
    response = requests.get(WEATHER_URL, params=params, timeout=10)
    response.raise_for_status()
    return response.json()


weather = get_weather_by_city("Paris")
print(
    f"{weather['name']} ({weather['sys']['country']}): "
    f"{weather['main']['temp']} °C, {weather['weather'][0]['description']}"
)
```

</TabItem>
</Tabs>

## Encode multi-word city names

City names containing spaces or diacritics—such as `Rio de Janeiro`, `New York`, or `São Paulo`—must be percent-encoded in the query string. Avoid concatenating raw user input into URLs by hand; let your HTTP client serialize query parameters automatically:

<Tabs groupId="language">
<TabItem value="curl" label="curl" default>

```bash
curl --get "https://api.openweathermap.org/data/2.5/weather" \
  --data-urlencode "q=Rio de Janeiro" \
  --data-urlencode "units=metric" \
  --data-urlencode "appid=$OPENWEATHER_API_KEY"
```

</TabItem>
<TabItem value="nodejs" label="Node.js">

```javascript
const params = new URLSearchParams({
  q: 'Rio de Janeiro',
  units: 'metric',
  appid: process.env.OPENWEATHER_API_KEY,
});

const response = await fetch(
  `https://api.openweathermap.org/data/2.5/weather?${params}`,
  { signal: AbortSignal.timeout(10000) }
);

if (!response.ok) {
  throw new Error(`Weather request failed with HTTP ${response.status}`);
}

const data = await response.json();
console.log(`${data.name} (${data.sys.country}): ${data.main.temp} °C`);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import os
import requests

response = requests.get(
    "https://api.openweathermap.org/data/2.5/weather",
    params={
        "q": "Rio de Janeiro",
        "units": "metric",
        "appid": os.environ["OPENWEATHER_API_KEY"],
    },
    timeout=10,
)
response.raise_for_status()

data = response.json()
print(f"{data['name']} ({data['sys']['country']}): {data['main']['temp']} °C")
```

</TabItem>
</Tabs>

## Disambiguate duplicate city names

Hundreds of municipalities worldwide share identical names. Append comma-separated ISO 3166-1 alpha-2 country codes—and two-letter state codes for US cities—to target the exact jurisdiction you want.

### Specify a country code

Format `q` as `{city},{country}` to distinguish cities across countries, such as `London,GB` (United Kingdom) versus `London,CA` (Ontario, Canada):

<Tabs groupId="language">
<TabItem value="curl" label="curl" default>

```bash
# London, United Kingdom
curl --get "https://api.openweathermap.org/data/2.5/weather" \
  --data-urlencode "q=London,GB" \
  --data-urlencode "units=metric" \
  --data-urlencode "appid=$OPENWEATHER_API_KEY"

# London, Ontario, Canada
curl --get "https://api.openweathermap.org/data/2.5/weather" \
  --data-urlencode "q=London,CA" \
  --data-urlencode "units=metric" \
  --data-urlencode "appid=$OPENWEATHER_API_KEY"
```

</TabItem>
<TabItem value="nodejs" label="Node.js">

```javascript
const apiKey = process.env.OPENWEATHER_API_KEY;

for (const query of ['London,GB', 'London,CA']) {
  const params = new URLSearchParams({
    q: query,
    units: 'metric',
    appid: apiKey,
  });

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?${params}`,
    { signal: AbortSignal.timeout(10000) }
  );

  if (!response.ok) {
    throw new Error(`Request for ${query} failed with HTTP ${response.status}`);
  }

  const data = await response.json();
  console.log(
    `${query} -> ${data.name}, ${data.sys.country} (${data.coord.lat}, ${data.coord.lon}): ${data.main.temp} °C`
  );
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import os
import requests

API_KEY = os.environ["OPENWEATHER_API_KEY"]

for query in ("London,GB", "London,CA"):
    response = requests.get(
        "https://api.openweathermap.org/data/2.5/weather",
        params={"q": query, "units": "metric", "appid": API_KEY},
        timeout=10,
    )
    response.raise_for_status()
    data = response.json()
    print(
        f"{query} -> {data['name']}, {data['sys']['country']} "
        f"({data['coord']['lat']}, {data['coord']['lon']}): {data['main']['temp']} °C"
    )
```

</TabItem>
</Tabs>

### Specify a US state and country code

For cities in the United States, format `q` as `{city},{state},{country}`—for example, `Portland,OR,US` versus `Portland,ME,US`.

Always include `US` as the third segment when passing a US state code. A two-part query treats the second segment as an ISO country code: `Ontario,CA` targets Ontario in Canada (`CA`), whereas `Ontario,CA,US` targets Ontario in California (`CA,US`).

:::warning State codes apply only to the United States
OpenWeatherMap supports `{state}` codes exclusively for US locations (`US`). For cities in Canada, Australia, Brazil, or any other country, pass `{city},{country}` without a state or province segment.
:::

<Tabs groupId="language">
<TabItem value="curl" label="curl" default>

```bash
# Portland, Oregon, United States
curl --get "https://api.openweathermap.org/data/2.5/weather" \
  --data-urlencode "q=Portland,OR,US" \
  --data-urlencode "units=metric" \
  --data-urlencode "appid=$OPENWEATHER_API_KEY"

# Portland, Maine, United States
curl --get "https://api.openweathermap.org/data/2.5/weather" \
  --data-urlencode "q=Portland,ME,US" \
  --data-urlencode "units=metric" \
  --data-urlencode "appid=$OPENWEATHER_API_KEY"
```

</TabItem>
<TabItem value="nodejs" label="Node.js">

```javascript
const apiKey = process.env.OPENWEATHER_API_KEY;

for (const query of ['Portland,OR,US', 'Portland,ME,US', 'Ontario,CA,US']) {
  const params = new URLSearchParams({
    q: query,
    units: 'metric',
    appid: apiKey,
  });

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?${params}`,
    { signal: AbortSignal.timeout(10000) }
  );

  if (!response.ok) {
    throw new Error(`Request for ${query} failed with HTTP ${response.status}`);
  }

  const data = await response.json();
  console.log(
    `${query} -> ${data.coord.lat}, ${data.coord.lon}: ${data.main.temp} °C`
  );
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import os
import requests

API_KEY = os.environ["OPENWEATHER_API_KEY"]

for query in ("Portland,OR,US", "Portland,ME,US", "Ontario,CA,US"):
    response = requests.get(
        "https://api.openweathermap.org/data/2.5/weather",
        params={"q": query, "units": "metric", "appid": API_KEY},
        timeout=10,
    )
    response.raise_for_status()
    data = response.json()
    print(f"{query} -> {data['coord']['lat']}, {data['coord']['lon']}: {data['main']['temp']} °C")
```

</TabItem>
</Tabs>

## Localize weather descriptions

Add the `lang` parameter to translate `weather[0].description` and the returned city `name` into the user's preferred language. Numeric condition codes (`weather[0].id`) and group names (`weather[0].main`) remain unchanged across languages, so branch your UI icon logic on `weather[0].id` rather than the translated description string:

<Tabs groupId="language">
<TabItem value="curl" label="curl" default>

```bash
curl --get "https://api.openweathermap.org/data/2.5/weather" \
  --data-urlencode "q=Madrid,ES" \
  --data-urlencode "units=metric" \
  --data-urlencode "lang=es" \
  --data-urlencode "appid=$OPENWEATHER_API_KEY"
```

</TabItem>
<TabItem value="nodejs" label="Node.js">

```javascript
const params = new URLSearchParams({
  q: 'Madrid,ES',
  units: 'metric',
  lang: 'es',
  appid: process.env.OPENWEATHER_API_KEY,
});

const response = await fetch(
  `https://api.openweathermap.org/data/2.5/weather?${params}`,
  { signal: AbortSignal.timeout(10000) }
);

if (!response.ok) {
  throw new Error(`Weather request failed with HTTP ${response.status}`);
}

const data = await response.json();
console.log({
  city: data.name,
  conditionId: data.weather[0].id,
  group: data.weather[0].main,
  localizedDescription: data.weather[0].description,
  tempCelsius: data.main.temp,
});
```

</TabItem>
<TabItem value="python" label="Python">

```python
import os
import requests

response = requests.get(
    "https://api.openweathermap.org/data/2.5/weather",
    params={
        "q": "Madrid,ES",
        "units": "metric",
        "lang": "es",
        "appid": os.environ["OPENWEATHER_API_KEY"],
    },
    timeout=10,
)
response.raise_for_status()

data = response.json()
print(
    {
        "city": data["name"],
        "condition_id": data["weather"][0]["id"],
        "group": data["weather"][0]["main"],
        "localized_description": data["weather"][0]["description"],
        "temp_celsius": data["main"]["temp"],
    }
)
```

</TabItem>
</Tabs>

## Related resources

- [Current weather reference](../reference/current-weather) for all query parameters, response fields, and supported `lang` codes
- [Use geographic coordinates](./use-coordinates) to resolve cities with Geocoding API 1.0 before querying weather
- [Units and measurement systems](../concepts/units) for comparisons between `standard`, `metric`, and `imperial`
- [Handle errors in production](./handle-errors) to recover from `404 Not Found` and transient gateway errors
