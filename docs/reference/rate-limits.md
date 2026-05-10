---
sidebar_position: 6
---

# Rate Limits

Access to the OpenWeatherMap API is restricted based on your subscription tier to ensure platform stability. 

## Free Tier Limitations

When you generate a free API key, your account is placed on the Free tier. The limitations are strict and enforced automatically.

| Limitation            | Free Tier Value      |
|-----------------------|----------------------|
| **Requests per minute** | 60 calls / minute    |
| **Requests per month**  | 1,000,000 calls      |
| **Available Endpoints** | Current Weather, 5-Day Forecast, Geocoding, Air Pollution |
| **Data Freshness**      | ~10 to 15 minutes    |

## What Happens When You Exceed the Limit?

If you exceed 60 requests in a 60-second window, the API will respond with HTTP Status `429 Too Many Requests`.

```json
{
  "cod": 429,
  "message": "Your account is temporary blocked due to exceeding of requests limitation of your subscription type. Please choose the proper subscription https://openweathermap.org/price"
}
```

Your account will be temporarily blocked for a short cooldown period (usually a few minutes). Once the cooldown expires, normal service resumes.

## Staying Under the Limit

To avoid hitting `429` errors in production environments:

1. **Use Caching:** Store weather data in memory or a database for at least 10 minutes. Do not query the API every time a user refreshes the page.
2. **Backend Proxy:** Never place your API key directly in frontend code. Route all requests through a backend server where you can control the request rate.
3. **Throttling:** If running a cron job, intentionally delay requests using `setTimeout` or similar logic.

For code examples on implementing these strategies, read the [Set Up Rate Limiting](../how-to/rate-limiting) guide.
