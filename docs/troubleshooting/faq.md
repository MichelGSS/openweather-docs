---
sidebar_position: 2
---

# Frequently Asked Questions (FAQ)

### Is OpenWeatherMap really free?
Yes. The "Free tier" gives you 1,000,000 API calls per month and 60 calls per minute at absolutely no cost. You do not need to provide a credit card to generate a free API key.

### I just generated my API key but I'm getting a 401 error.
This is normal. New API keys take up to 2 hours to be synchronized across OpenWeatherMap's global server infrastructure. Please wait and try your request again later.

### Why does the temperature say 295 degrees?
By default, the API returns temperatures in Kelvin. To receive temperatures in Celsius, append `&units=metric` to your API request URL. For Fahrenheit, use `&units=imperial`.

### Can I use the API directly in my frontend React/Vue app?
You *can*, but it is highly discouraged for production apps. Your API key will be visible in the network tab of the user's browser, allowing anyone to steal it. You should build a lightweight backend (like an Express server, Next.js API route, or AWS Lambda function) to securely hold the key and make the calls to OpenWeatherMap on behalf of the client.

### Why did my request return "city not found" (404)?
City names can be ambiguous or spelled differently across languages. Ensure you are URL-encoding your requests (e.g., `Rio+de+Janeiro`). If the issue persists, the best approach is to use the [Geocoding API](../reference/geocoding) to find the exact latitude and longitude of the city, and query using coordinates.

### How accurate is the 5-day forecast?
The 5-day forecast is updated every 3 hours using global meteorological models. Accuracy naturally decreases the further into the future you look, but 1-to-3 day forecasts are generally highly reliable.
