import React, {useState} from 'react';
import styles from './styles.module.css';

type WeatherKind = 'clear' | 'partly' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'storm';

const WMO_DESCRIPTIONS: Record<number, {label: string; kind: WeatherKind}> = {
  0: {label: 'Clear sky', kind: 'clear'},
  1: {label: 'Mainly clear', kind: 'partly'},
  2: {label: 'Partly cloudy', kind: 'partly'},
  3: {label: 'Overcast', kind: 'cloudy'},
  45: {label: 'Fog', kind: 'fog'},
  48: {label: 'Depositing rime fog', kind: 'fog'},
  51: {label: 'Light drizzle', kind: 'rain'},
  53: {label: 'Moderate drizzle', kind: 'rain'},
  55: {label: 'Dense drizzle', kind: 'rain'},
  61: {label: 'Slight rain', kind: 'rain'},
  63: {label: 'Moderate rain', kind: 'rain'},
  65: {label: 'Heavy rain', kind: 'rain'},
  71: {label: 'Slight snow', kind: 'snow'},
  73: {label: 'Moderate snow', kind: 'snow'},
  75: {label: 'Heavy snow', kind: 'snow'},
  80: {label: 'Slight rain showers', kind: 'rain'},
  81: {label: 'Moderate rain showers', kind: 'rain'},
  82: {label: 'Heavy rain showers', kind: 'storm'},
  85: {label: 'Slight snow showers', kind: 'snow'},
  86: {label: 'Heavy snow showers', kind: 'snow'},
  95: {label: 'Thunderstorm', kind: 'storm'},
  96: {label: 'Thunderstorm with slight hail', kind: 'storm'},
  99: {label: 'Thunderstorm with heavy hail', kind: 'storm'},
};

function getWmo(code: number): {label: string; kind: WeatherKind} {
  return WMO_DESCRIPTIONS[code] ?? {label: 'Current conditions', kind: 'partly'};
}

function MapPinIcon({size = 20}: {size?: number}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function WeatherConditionSvg({kind}: {kind: WeatherKind}) {
  switch (kind) {
    case 'clear':
      return (
        <svg viewBox="0 0 64 64" width="60" height="60" fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="13" fill="#FBBF24" />
          <g stroke="#F59E0B" strokeWidth="3" strokeLinecap="round">
            <line x1="32" y1="8" x2="32" y2="13" />
            <line x1="32" y1="51" x2="32" y2="56" />
            <line x1="8" y1="32" x2="13" y2="32" />
            <line x1="51" y1="32" x2="56" y2="32" />
            <line x1="15" y1="15" x2="18.6" y2="18.6" />
            <line x1="45.4" y1="45.4" x2="49" y2="49" />
            <line x1="49" y1="15" x2="45.4" y2="18.6" />
            <line x1="18.6" y1="45.4" x2="15" y2="49" />
          </g>
        </svg>
      );
    case 'partly':
      return (
        <svg viewBox="0 0 64 64" width="60" height="60" fill="none" aria-hidden="true">
          <circle cx="24" cy="24" r="10" fill="#FBBF24" />
          <g stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round">
            <line x1="24" y1="8" x2="24" y2="11" />
            <line x1="8" y1="24" x2="11" y2="24" />
            <line x1="12.7" y1="12.7" x2="15" y2="15" />
            <line x1="35.3" y1="12.7" x2="33" y2="15" />
          </g>
          <path
            d="M22 48h24a8 8 0 0 0 1.1-15.92A11 11 0 0 0 25.8 29a9 9 0 0 0-3.8 19Z"
            fill="currentColor"
            opacity="0.88"
          />
        </svg>
      );
    case 'cloudy':
      return (
        <svg viewBox="0 0 64 64" width="60" height="60" fill="none" aria-hidden="true">
          <path
            d="M18 46h28a9 9 0 0 0 1.2-17.92A12 12 0 0 0 23.6 24.5 10 10 0 0 0 18 46Z"
            fill="currentColor"
            opacity="0.86"
          />
        </svg>
      );
    case 'fog':
      return (
        <svg viewBox="0 0 64 64" width="60" height="60" fill="none" aria-hidden="true">
          <path
            d="M18 36h28a8 8 0 0 0 1-15.9A11 11 0 0 0 25.4 17 9 9 0 0 0 18 36Z"
            fill="currentColor"
            opacity="0.75"
          />
          <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.6">
            <line x1="14" y1="44" x2="50" y2="44" />
            <line x1="18" y1="51" x2="46" y2="51" />
          </g>
        </svg>
      );
    case 'rain':
      return (
        <svg viewBox="0 0 64 64" width="60" height="60" fill="none" aria-hidden="true">
          <path
            d="M18 40h28a8.5 8.5 0 0 0 1.1-16.92A11.5 11.5 0 0 0 24.4 19.6 9.5 9.5 0 0 0 18 40Z"
            fill="currentColor"
            opacity="0.85"
          />
          <g stroke="#60A5FA" strokeWidth="2.8" strokeLinecap="round">
            <line x1="23" y1="45" x2="20" y2="54" />
            <line x1="33" y1="45" x2="30" y2="54" />
            <line x1="43" y1="45" x2="40" y2="54" />
          </g>
        </svg>
      );
    case 'snow':
      return (
        <svg viewBox="0 0 64 64" width="60" height="60" fill="none" aria-hidden="true">
          <path
            d="M18 40h28a8.5 8.5 0 0 0 1.1-16.92A11.5 11.5 0 0 0 24.4 19.6 9.5 9.5 0 0 0 18 40Z"
            fill="currentColor"
            opacity="0.85"
          />
          <g fill="#93C5FD">
            <circle cx="23" cy="49" r="2.5" />
            <circle cx="32" cy="52" r="2.5" />
            <circle cx="41" cy="49" r="2.5" />
          </g>
        </svg>
      );
    case 'storm':
      return (
        <svg viewBox="0 0 64 64" width="60" height="60" fill="none" aria-hidden="true">
          <path
            d="M18 39h28a8.5 8.5 0 0 0 1.1-16.92A11.5 11.5 0 0 0 24.4 18.6 9.5 9.5 0 0 0 18 39Z"
            fill="currentColor"
            opacity="0.85"
          />
          <path
            d="M34 40 27 50h6l-2 9 9-11h-6l2-8Z"
            fill="#FBBF24"
          />
        </svg>
      );
  }
}

type WeatherState =
  | {status: 'idle'}
  | {status: 'loading'}
  | {status: 'error'; message: string}
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

export default function GeoWeather(): React.JSX.Element {
  const [state, setState] = useState<WeatherState>({status: 'idle'});

  function handleLocate() {
    if (!navigator.geolocation) {
      setState({
        status: 'error',
        message: 'Geolocation is not supported by your browser.',
      });
      return;
    }

    setState({status: 'loading'});

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const {latitude: lat, longitude: lon} = pos.coords;
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

          if (!weatherRes.ok) {
            throw new Error('Weather fetch failed');
          }

          const weather = await weatherRes.json();
          const geo = await geoRes.json();

          const c = weather.current;
          const city =
            geo.address?.city ||
            geo.address?.town ||
            geo.address?.village ||
            geo.address?.county ||
            'Current coordinates';
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
          setState({
            status: 'error',
            message: 'Could not retrieve weather observations. Check your connection and try again.',
          });
        }
      },
      (err) => {
        const messages: Record<number, string> = {
          1: 'Location access was denied. Allow location permissions in your browser settings and try again.',
          2: 'Location information is currently unavailable. Try again in a moment.',
          3: 'The location request timed out. Try again.',
        };
        setState({
          status: 'error',
          message: messages[err.code] ?? 'Could not determine your location.',
        });
      },
      {timeout: 10000}
    );
  }

  function handleReset() {
    setState({status: 'idle'});
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>Instant demo · Zero setup</span>
          <h2>See the weather where you are</h2>
          <p>Powered by open meteorological data — no account or API key required.</p>
        </div>
        <div
          className={styles.card}
          aria-live="polite"
          aria-busy={state.status === 'loading'}>
          {state.status === 'idle' && (
            <div className={styles.idle}>
              <div className={styles.idleIconBox}>
                <MapPinIcon size={26} />
              </div>
              <p className={styles.idleDesc}>
                Reads your browser coordinates to query live meteorological conditions. Your
                coordinates are used only for this weather and reverse-geocoding lookup.
              </p>
              <button
                type="button"
                className={styles.locateBtn}
                onClick={handleLocate}>
                Use my location →
              </button>
              <span className={styles.noKeyBadge}>No API key required</span>
            </div>
          )}

          {state.status === 'loading' && (
            <div className={styles.loading}>
              <div className={styles.spinner} aria-hidden="true" />
              <p>Detecting your coordinates and fetching live weather…</p>
            </div>
          )}

          {state.status === 'error' && (
            <div className={styles.errorState} role="alert">
              <div className={styles.errorIcon}>
                <AlertIcon />
              </div>
              <p>{state.message}</p>
              <button
                type="button"
                className={styles.retryBtn}
                onClick={handleReset}>
                Try again
              </button>
            </div>
          )}

          {state.status === 'done' && (
            <div className={styles.dashboard}>
              <div className={styles.dashTop}>
                <div className={styles.wmoIcon}>
                  <WeatherConditionSvg kind={getWmo(state.wmoCode).kind} />
                </div>
                <div className={styles.dashPrimary}>
                  <div className={styles.location}>
                    <MapPinIcon size={15} />
                    <span>
                      {state.city}
                      {state.country ? `, ${state.country}` : ''}
                    </span>
                  </div>
                  <div className={styles.temp}>{state.temp}°C</div>
                  <div className={styles.condition}>
                    {getWmo(state.wmoCode).label}
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.refreshBtn}
                  onClick={handleReset}
                  aria-label="Reset location weather demo">
                  <ResetIcon />
                  <span>Reset</span>
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
                Data provided by{' '}
                <a
                  href="https://open-meteo.com"
                  target="_blank"
                  rel="noopener noreferrer">
                  Open-Meteo
                </a>
                {' and '}
                <a
                  href="https://nominatim.openstreetmap.org"
                  target="_blank"
                  rel="noopener noreferrer">
                  Nominatim
                </a>
                {' · Open access, no API key'}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
