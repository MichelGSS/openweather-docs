---
sidebar_position: 3
---

# API architecture overview

This page explains how the OpenWeatherMap API is structured and how data
flows from weather stations to your application.

## Request flow

```mermaid
sequenceDiagram
    participant App as Your Application
    participant API as OpenWeatherMap API
    participant DB as Weather Database
    participant WS as Weather Stations

    WS->>DB: Report conditions (every 10 min)
    App->>API: GET /weather?q=London&appid=KEY
    API->>API: Validate API key
    API->>DB: Query latest data for London
    DB-->>API: Return weather data
    API-->>App: JSON response (200 OK)
```

## API structure

The OpenWeatherMap API follows REST conventions:

```mermaid
graph LR
    A["api.openweathermap.org"] --> B["/data/2.5/weather"]
    A --> C["/data/2.5/forecast"]
    A --> D["/geo/1.0/direct"]
    B --> E["Current conditions"]
    C --> F["5-day forecast"]
    D --> G["City coordinates"]
```

## Data freshness

Weather data is collected from a global network of stations and updated
approximately every 10 minutes. When you make an API request, you receive
the most recent data available for that location.

| Data Type        | Update Frequency  | Source                    |
|------------------|-------------------|---------------------------|
| Current weather  | Every 10 minutes  | Weather stations globally |
| 5-day forecast   | Every 3 hours     | Weather prediction models |
| Geocoding        | Static            | Location database         |

## Units system

The API supports three unit systems, controlled by the `units` parameter. For
the full comparison and conversion notes, see [Understanding units](./units).
