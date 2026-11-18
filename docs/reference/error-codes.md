---
sidebar_position: 5
title: Error codes
description: HTTP status codes, JSON error schema, cod data type matrix across endpoints, and sample error payloads for OpenWeatherMap REST APIs.
---

# Error codes

OpenWeatherMap Weather API 2.5 and Geocoding API 1.0 report request outcomes through HTTP status codes paired with a JSON response body.

For retry policies, timeout guards, and safe JSON parsing patterns, see [Handle errors in production](../how-to/handle-errors) and [Common errors](../troubleshooting/common-errors).

## HTTP status codes

| Status code | Meaning | Description |
| --- | --- | --- |
| `200` | OK | Request succeeded. Returns a JSON object or JSON array depending on the endpoint. |
| `400` | Bad Request | Request is missing a required parameter or contains an invalid parameter value, such as omitted coordinates (`"Nothing to geocode"`) or out-of-range latitude and longitude (`"wrong latitude"` or `"wrong longitude"`). |
| `401` | Unauthorized | Authentication failed due to a missing `appid`, an invalid or revoked key, a newly generated key awaiting activation, or an endpoint outside your subscription plan. See [Authentication](./authentication). |
| `404` | Not Found | Requested city name, city ID, postal code, or endpoint path does not exist. Whereas `/geo/1.0/zip` returns `404` for unknown postal codes, `/geo/1.0/direct` and `/geo/1.0/reverse` return `200 OK` with an empty array (`[]`). |
| `429` | Too Many Requests | Request exceeded the account rate limit (60 calls per minute on the free tier) or monthly quota. See [Rate limits](./rate-limits). |
| `500` | Internal Server Error | Unhandled server error on OpenWeatherMap application nodes. |
| `502` / `503` / `504` | Bad Gateway / Service Unavailable / Gateway Timeout | Transient upstream load balancer or reverse proxy failure. Responses can return an HTML document (`text/html`) rather than a JSON payload. |

## Error payload schema

Application-layer `4xx` and `500` errors return a JSON object with the following fields:

| Field | Type | Description |
| --- | --- | --- |
| `cod` | `number \| string` | Internal status code mirroring the HTTP status code. Serialized as either a number or a string depending on the status code and endpoint. |
| `message` | `string` | Human-readable diagnostic description of the error condition. |

## `cod` data type matrix

OpenWeatherMap serializes the `cod` property inconsistently across endpoints and status codes. Inspect the HTTP transport status code (`response.status` in Node.js or `response.status_code` in Python) instead of comparing `cod` with strict type equality.

| HTTP status | `/data/2.5/weather` | `/data/2.5/forecast` | `/geo/1.0/direct` and `/geo/1.0/reverse` | `/geo/1.0/zip` |
| --- | --- | --- | --- | --- |
| `200 OK` | `number` (`200`) | `string` (`"200"`) | Absent (root is JSON array `[]`) | Absent (root is location object) |
| `400 Bad Request` | `string` (`"400"`) | `string` (`"400"`) | `string` (`"400"`) | `string` (`"400"`) |
| `401 Unauthorized` | `number` (`401`) | `number` (`401`) | `number` (`401`) | `number` (`401`) |
| `404 Not Found` | `string` (`"404"`) | `string` (`"404"`) | Not returned for unmatched queries (`200` with `[]`) | `string` (`"404"`) |
| `429 Too Many Requests` | `number` (`429`) | `number` (`429`) | `number` (`429`) | `number` (`429`) |
| `500 Internal Server Error` | `number` or `string` | `number` or `string` | `number` or `string` | `number` or `string` |
| `502` / `503` / `504` | Absent if HTML gateway body | Absent if HTML gateway body | Absent if HTML gateway body | Absent if HTML gateway body |

## Error response examples

### `400 Bad Request`

Returned when required location parameters are missing or empty, or when `lat` or `lon` falls outside valid geographic bounds:

```json
{
  "cod": "400",
  "message": "Nothing to geocode"
}
```

### `401 Unauthorized`

Returned when `appid` is missing, invalid, pending activation, or unauthorized for the target endpoint:

```json
{
  "cod": 401,
  "message": "Invalid API key. See https://openweathermap.org/faq#error401 for more info."
}
```

### `404 Not Found`

Returned when a city query on `/data/2.5/weather` or `/data/2.5/forecast` or a postal code on `/geo/1.0/zip` matches no record:

```json
{
  "cod": "404",
  "message": "city not found"
}
```

### `429 Too Many Requests`

Returned when account request volume exceeds your subscription rate limit:

```json
{
  "cod": 429,
  "message": "Your account is temporary blocked due to exceeding of requests limitation of your subscription type."
}
```
