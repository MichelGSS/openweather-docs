---
sidebar_position: 6
title: Rate limits
description: Free tier request quotas, account-level quota accounting rules, HTTP header behavior, and 429 Too Many Requests enforcement for OpenWeatherMap REST APIs.
---

# Rate limits

OpenWeatherMap enforces per-minute burst limits and monthly call quotas at the account level based on your subscription tier.

For caching proxy architecture, client-side throttling, and backoff implementation patterns, see [Set up rate limiting and caching](../how-to/rate-limiting).

## Free tier limits

| Quota or attribute | Free tier specification |
| --- | --- |
| Calls per minute | `60` calls/minute |
| Calls per month | `1,000,000` calls/month |
| Included endpoints | Current weather (`/data/2.5/weather`), 5-day forecast (`/data/2.5/forecast`), Geocoding (`/geo/1.0/direct`, `/geo/1.0/zip`, `/geo/1.0/reverse`), and Air pollution (`/data/2.5/air_pollution`) |
| Model update interval | Every `10` minutes |
| Payment card required | No |

## Quota accounting rules

- **Pooled across all API keys**: Creating multiple API keys under the same OpenWeatherMap account does not multiply your quota. Every active key on an account draws from a single shared pool of 60 calls per minute and 1,000,000 calls per month.
- **Pooled across all free endpoints**: Requests to Current weather, 5-day forecast, Geocoding, and Air pollution endpoints all increment the same account-level call counter.
- **Two-step geocoding and weather lookups**: Resolving a place name through `/geo/1.0/direct` and fetching observations through `/data/2.5/weather` without caching consumes **2 calls**. Cache resolved coordinates persistently and cache weather payloads for up to the 10-minute model update interval.
- **Free Weather API 2.5 vs. One Call API 3.0**: Free Weather API 2.5 (`/data/2.5/*`) and Geocoding API 1.0 (`/geo/1.0/*`) require no credit card and include 1,000,000 calls per month with hard rate-limit blocking above quota. **One Call API 3.0** (`/data/3.0/onecall`) is a separate "Pay as you call" subscription that requires a payment card, includes 1,000 free calls per day, and bills per overage increment unless you set a daily limit equal to 1,000 calls in your billing dashboard.

## HTTP headers

OpenWeatherMap Weather API 2.5 and Geocoding API 1.0 omit rate-limit telemetry headers—such as `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, and `Retry-After`—from both `200 OK` and `429 Too Many Requests` responses. Client applications must meter outbound request rates locally rather than reading remaining quota from HTTP response headers.

## Rate-limit enforcement (`429`)

When combined traffic across your account's API keys exceeds 60 calls per minute or exhausts your monthly quota, the API returns HTTP `429 Too Many Requests` with a numeric `cod` value (`429`) and temporarily blocks subsequent requests during a short cooldown window:

```json
{
  "cod": 429,
  "message": "Your account is temporary blocked due to exceeding of requests limitation of your subscription type."
}
```

For retry and exponential backoff handling on `429` responses, see [Handle errors in production](../how-to/handle-errors).
