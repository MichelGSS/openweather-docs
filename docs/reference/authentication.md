---
sidebar_position: 1
title: Authentication
description: Query-parameter authentication specification, transport security requirements, key activation window, and 401 Unauthorized triggers for the OpenWeatherMap REST API.
---

# Authentication

Every request to OpenWeatherMap Weather API 2.5 and Geocoding API 1.0 authenticates with an API key passed in the `appid` URL query parameter over HTTPS.

For account registration, key generation, and environment variable setup, see [Get your API key](../getting-started/get-api-key).

## Authentication specification

| Attribute | Specification |
| --- | --- |
| Parameter | `appid` |
| Location | Query string |
| Type and format | `string`—32-character lowercase hexadecimal token (such as `a1b2c3d4e5f60718293a4b5c6d7e8f90`) |
| HTTP header authentication | Unsupported—`Authorization` and `X-API-Key` headers are rejected and trigger CORS preflight failures in browsers |
| Transport security | HTTPS required to encrypt the query string in transit |
| Key activation window | 10–15 minutes typical; up to 2 hours maximum |
| Multiple keys | Supported per account; all keys share the account rate-limit quota |

## Request syntax

Append `appid` as a query parameter on every HTTPS request:

```http
GET https://api.openweathermap.org/data/2.5/weather?lat=51.5085&lon=-0.1257&appid={API_KEY}
```

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `appid` | `string` | Yes | — | 32-character lowercase hexadecimal API key associated with your OpenWeatherMap account. |

:::warning Credential exposure in client applications
Because `appid` travels in the URL query string, calling `api.openweathermap.org` directly from browser JavaScript or mobile clients exposes your key in browser developer tools and network logs. Route client requests through a backend proxy as shown in [Set up rate limiting and caching](../how-to/rate-limiting).
:::

## Authentication errors

When authentication fails, the API responds with HTTP `401 Unauthorized` and a JSON payload containing a numeric `cod` field:

```json
{
  "cod": 401,
  "message": "Invalid API key. See https://openweathermap.org/faq#error401 for more info."
}
```

### `401 Unauthorized` triggers

OpenWeatherMap returns `401 Unauthorized` under four conditions:

| Trigger | Condition |
| --- | --- |
| Missing `appid` | The request URL omits the `appid` query parameter, passes an empty value (`appid=`), or supplies the key in an HTTP header instead of the query string. |
| Invalid or revoked key | The `appid` value contains a typo, extra whitespace, or belongs to a key that was deleted or deactivated on the OpenWeatherMap dashboard. |
| Newly generated key pending activation | The key was created within the past 2 hours and has not finished propagating across OpenWeatherMap edge servers (10–15 minutes typical; up to 2 hours maximum). |
| Endpoint outside subscription plan | The key is valid and active, but the request targets an endpoint outside your active subscription tier, such as One Call API 3.0 (`/data/3.0/onecall`) or 16-day daily forecast (`/data/2.5/forecast/daily`) without an active plan for that product. |

For additional status codes and error schemas, see [Error codes](./error-codes). For account quota rules across keys, see [Rate limits](./rate-limits).
