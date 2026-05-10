---
sidebar_position: 1
---

# Common Errors

Solutions for the most frequently encountered issues when working with
the OpenWeatherMap API.

## 401 Unauthorized

**Error response:**
```json
{
  "cod": 401,
  "message": "Invalid API key. Please see https://openweathermap.org/faq#error401 for more info."
}
```

**Causes and solutions:**

| Cause                         | Solution                                     |
|-------------------------------|----------------------------------------------|
| API key is incorrect          | Double-check the key in your dashboard       |
| Key was just created          | Wait up to 2 hours for activation            |
| Key was revoked or deleted    | Generate a new key from your dashboard       |
| Missing `appid` parameter    | Ensure `appid=YOUR_KEY` is in the URL        |

## 404 Not Found

**Error response:**
```json
{
  "cod": "404",
  "message": "city not found"
}
```

**Causes and solutions:**

| Cause                         | Solution                                     |
|-------------------------------|----------------------------------------------|
| City name is misspelled       | Check the spelling                           |
| City doesn't exist in database| Use coordinates (`lat`/`lon`) instead        |
| Special characters in name    | URL-encode the city name (e.g., `Rio+de+Janeiro`) |

## 429 Too Many Requests

**Error response:**
```json
{
  "cod": 429,
  "message": "Your account is temporary blocked due to exceeding of requests limitation of your subscription type."
}
```

**Solution:** Implement request throttling. Free tier allows 60 requests per minute.

```javascript
// Simple delay between requests
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

for (const city of cities) {
  const data = await getWeather(city);
  await delay(1000); // Wait 1 second between requests
}
```

## CORS Errors (Browser)

If calling the API from a browser, you may see:

```
Access-Control-Allow-Origin header is missing
```

**Solution:** Use a backend proxy or server-side request. The OpenWeatherMap
API is not designed for direct browser calls in production.

## Empty or Unexpected Data

| Symptom                        | Cause                       | Solution                    |
|--------------------------------|-----------------------------|-----------------------------|
| Temperature shows 285+         | Using default (Kelvin) units| Add `&units=metric`         |
| `weather` array is empty       | Rare API glitch             | Retry the request           |
| Old data returned              | API caches for ~10 minutes  | Wait and retry              |
| Wrong city returned            | Ambiguous city name         | Use coordinates instead     |
