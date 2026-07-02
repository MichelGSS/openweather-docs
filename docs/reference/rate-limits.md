---
sidebar_position: 6
---

# Rate limits

Access to the OpenWeatherMap API is restricted based on your subscription tier to ensure platform stability. 

## Free tier limitations

When you generate a free API key, your account is placed on the free tier. The limitations are strict and enforced automatically.

| Limitation            | Free tier value      |
|-----------------------|----------------------|
| **Requests per minute** | 60 calls / minute    |
| **Requests per month**  | 1,000,000 calls      |
| **Available endpoints** | Current Weather, 5-Day Forecast, Geocoding, Air Pollution |
| **Data freshness**      | ~10 minutes          |

## What happens when you exceed the limit?

If you exceed 60 requests in a 60-second window, the API will respond with HTTP Status `429 Too Many Requests`.

```json
{
  "cod": 429,
  "message": "Your account is temporary blocked due to exceeding of requests limitation of your subscription type. Please choose the proper subscription https://openweathermap.org/price"
}
```

Your account will be temporarily blocked for a short cooldown period (usually a few minutes). Once the cooldown expires, normal service resumes.

## Staying under the limit

The common strategies for avoiding `429` errors in production are caching, a
backend proxy, and request throttling. For step-by-step instructions and code
examples, see the [Set up rate limiting](../how-to/rate-limiting) guide.
