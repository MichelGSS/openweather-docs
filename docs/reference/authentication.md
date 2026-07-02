---
sidebar_position: 1
---

# Authentication

All OpenWeatherMap API requests require an API key passed as a query parameter.

## API key

Include your API key in every request using the `appid` query parameter:

```
GET https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY
```

| Parameter | Type   | Required | Description        |
|-----------|--------|----------|--------------------|
| `appid`   | string | Yes      | Your API key       |

## Free tier limits

Free API keys are subject to request quotas and endpoint restrictions. For the
full list of limits, available endpoints, and data freshness, see
[Rate limits](./rate-limits).

## Authentication errors

| Status Code | Meaning                            | Solution                          |
|-------------|------------------------------------|-----------------------------------|
| `401`       | Invalid API key                    | Check your key is correct         |
| `401`       | API key not activated              | Wait up to 2 hours after creation |
| `429`       | Rate limit exceeded                | Reduce request frequency          |

## Security best practices

:::warning
Never hardcode your API key in source code or commit it to Git repositories.
:::

Store your key as an environment variable:

```bash
# Linux/macOS
export OPENWEATHER_API_KEY="your_key_here"

# Windows (PowerShell)
$env:OPENWEATHER_API_KEY = "your_key_here"
```

Reference it in your code:

```javascript
const API_KEY = process.env.OPENWEATHER_API_KEY;
```

```python
import os
api_key = os.environ["OPENWEATHER_API_KEY"]
```
