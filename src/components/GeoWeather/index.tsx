import React, { useState } from 'react';
import styles from './styles.module.css';

const WMO_DESCRIPTIONS: Record<number, { label: string; icon: string }> = {
  0:  { label: 'Clear sky',          icon: '☀️' },
  1:  { label: 'Mainly clear',       icon: '🌤️' },
  2:  { label: 'Partly cloudy',      icon: '⛅' },
  3:  { label: 'Overcast',           icon: '☁️' },
  45: { label: 'Fog',                icon: '🌫️' },
  48: { label: 'Icy fog',            icon: '🌫️' },
  51: { label: 'Light drizzle',      icon: '🌦️' },
  53: { label: 'Drizzle',            icon: '🌦️' },
  55: { label: 'Heavy drizzle',      icon: '🌧️' },
  61: { label: 'Light rain',         icon: '🌧️' },
  63: { label: 'Rain',               icon: '🌧️' },
  65: { label: 'Heavy rain',         icon: '🌧️' },
  71: { label: 'Light snow',         icon: '🌨️' },
  73: { label: 'Snow',               icon: '❄️' },
  75: { label: 'Heavy snow',         icon: '❄️' },
  80: { label: 'Rain showers',       icon: '🌦️' },
  81: { label: 'Rain showers',       icon: '🌧️' },
  82: { label: 'Violent showers',    icon: '⛈️' },
  85: { label: 'Snow showers',       icon: '🌨️' },
  86: { label: 'Heavy snow showers', icon: '❄️' },
  95: { label: 'Thunderstorm',       icon: '⛈️' },
  96: { label: 'Thunderstorm',       icon: '⛈️' },
  99: { label: 'Thunderstorm',       icon: '⛈️' },
};

function getWmo(code: number) {
  return WMO_DESCRIPTIONS[code] ?? { label: 'Unknown', icon: '🌡️' };
}

type WeatherState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | {
      status: 'done';
      city: string;
      country: string;
      temp: number;
      feelsLike: number;
      humidity: number;
      windSpeed: number;
      pressure: number;
      wmoCode: number;
    };

export default function GeoWeather() {
  const [state, setState] = useState<WeatherState>({ status: 'idle' });

  async function handleLocate() {
    if (!navigator.geolocation) {
      setState({ status: 'error', message: 'Geolocation is not supported by your browser.' });
      return;
    }

    setState({ status: 'loading' });

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        try {
          const [weatherRes, geoRes] = await Promise.all([
            fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
              `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,surface_pressure,weather_code` +
              `&wind_speed_unit=ms&timezone=auto`
            ),
            fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
            ),
          ]);

          if (!weatherRes.ok) throw new Error('Weather fetch failed');

          const weather = await weatherRes.json();
          const geo = await geoRes.json();

          const c = weather.current;
          const city =
            geo.address?.city ||
            geo.address?.town ||
            geo.address?.village ||
            geo.address?.county ||
            'Unknown location';
          const country = geo.address?.country_code?.toUpperCase() ?? '';

          setState({
            status: 'done',
            city,
            country,
            temp: Math.round(c.temperature_2m),
            feelsLike: Math.round(c.apparent_temperature),
            humidity: c.relative_humidity_2m,
            windSpeed: Math.round(c.wind_speed_10m * 10) / 10,
            pressure: Math.round(c.surface_pressure),
            wmoCode: c.weather_code,
          });
        } catch {
          setState({ status: 'error', message: 'Could not fetch weather data. Try again.' });
        }
      },
      (err) => {
        const messages: Record<number, string> = {
          1: 'Location access denied. Allow location in your browser settings.',
          2: 'Location unavailable. Try again.',
          3: 'Location request timed out. Try again.',
        };
        setState({ status: 'error', message: messages[err.code] ?? 'Location error.' });
      },
      { timeout: 10000 }
    );
  }

  function handleReset() {
    setState({ status: 'idle' });
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>Instant demo · No API key</span>
          <h2>See the weather where you are</h2>
          <p>Powered entirely by open data — no signup, no key, one click.</p>
        </div>
        <div className={styles.card} aria-live="polite" aria-busy={state.status === 'loading'}>
          {state.status === 'idle' && (
            <div className={styles.idle}>
              <div className={styles.idleIcon} aria-hidden="true">📍</div>
              <p className={styles.idleDesc}>
                Uses your browser's location and open-source weather data. Your
                coordinates never leave your device beyond the weather lookup.
              </p>
              <button className={styles.locateBtn} onClick={handleLocate}>
                Use my location →
              </button>
              <span className={styles.noKeyBadge}>No API key required</span>
            </div>
          )}

          {state.status === 'loading' && (
            <div className={styles.loading}>
              <div className={styles.spinner} aria-hidden="true" />
              <p>Detecting your location…</p>
            </div>
          )}

          {state.status === 'error' && (
            <div className={styles.errorState} role="alert">
              <div className={styles.errorIcon} aria-hidden="true">⚠</div>
              <p>{state.message}</p>
              <button className={styles.retryBtn} onClick={handleReset}>Try again</button>
            </div>
          )}

          {state.status === 'done' && (
            <div className={styles.dashboard}>
              <div className={styles.dashTop}>
                <div className={styles.wmoIcon}>{getWmo(state.wmoCode).icon}</div>
                <div className={styles.dashPrimary}>
                  <div className={styles.location}>
                    📍 {state.city}{state.country ? `, ${state.country}` : ''}
                  </div>
                  <div className={styles.temp}>{state.temp}°C</div>
                  <div className={styles.condition}>{getWmo(state.wmoCode).label}</div>
                </div>
                <button className={styles.refreshBtn} onClick={handleReset} title="Refresh">
                  ↩ Reset
                </button>
              </div>
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Feels like</span>
                  <span className={styles.statValue}>{state.feelsLike}°C</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Humidity</span>
                  <span className={styles.statValue}>{state.humidity}%</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Wind</span>
                  <span className={styles.statValue}>{state.windSpeed} m/s</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Pressure</span>
                  <span className={styles.statValue}>{state.pressure} hPa</span>
                </div>
              </div>
              <div className={styles.poweredBy}>
                Powered by{' '}
                <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer">Open-Meteo</a>
                {' & '}
                <a href="https://nominatim.openstreetmap.org" target="_blank" rel="noopener noreferrer">Nominatim</a>
                {' — free, no API key'}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
