---
sidebar_position: 5
---

# Error codes

The OpenWeatherMap API relies on standard HTTP status codes to indicate the success or failure of an API request.

## HTTP status codes overview

| Status code | Code title             | Description                                                                 |
|-------------|------------------------|-----------------------------------------------------------------------------|
| `200`       | OK                     | The request was successful, and data is returned.                           |
| `400`       | Bad Request            | The request is malformed. Usually caused by missing required parameters.    |
| `401`       | Unauthorized           | Authentication failed. Invalid API key or the key is not yet activated.     |
| `404`       | Not Found              | The requested data (like a specific city name) was not found in the DB.     |
| `429`       | Too Many Requests      | You have exceeded your rate limits.                                         |
| `5xx`       | Internal Server Error  | OpenWeatherMap servers are encountering issues. Try again later.            |

## Example error responses

Errors are returned in a standard JSON format, allowing you to parse the `message` string for debugging.

### 401 Unauthorized

```json
{
  "cod": 401,
  "message": "Invalid API key. Please see https://openweathermap.org/faq#error401 for more info."
}
```

### 404 Not Found

Notice that in `404` responses, the `cod` is often returned as a string rather than an integer.

```json
{
  "cod": "404",
  "message": "city not found"
}
```

### 429 Too Many Requests

```json
{
  "cod": 429,
  "message": "Your account is temporary blocked due to exceeding of requests limitation of your subscription type."
}
```

## Handling errors

When building applications, it is considered a best practice to check the `response.status` (HTTP code) at the network level rather than parsing the JSON for the `cod` field, due to type inconsistencies. See the [Handle errors gracefully](../how-to/handle-errors) guide for implementation patterns.
