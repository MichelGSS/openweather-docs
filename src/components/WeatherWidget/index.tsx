import React, {useState, useEffect} from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './styles.module.css';

type WeatherData = {
  name: string;
  sys: {country: string};
  weather: Array<{description: string; icon: string; main: string}>;
  main: {temp: number; feels_like: number; humidity: number; pressure: number};
  wind: {speed: number};
};

const CITY_PRESETS = ['Tokyo,JP', 'London,GB', 'Rio de Janeiro,BR', 'New York,US'];

export default function WeatherWidget(): React.JSX.Element {
  const [city, setCity] = useState('Tokyo,JP');
  const [apiKey, setApiKey] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [keySaved, setKeySaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('owm_api_key');
    if (saved) {
      setApiKey(saved);
      setKeySaved(true);
    }
  }, []);

  async function fetchWeather(e: React.FormEvent) {
    e.preventDefault();
    if (!city.trim() || !apiKey.trim()) return;

    localStorage.setItem('owm_api_key', apiKey.trim());
    setKeySaved(true);
    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city.trim()
        )}&appid=${encodeURIComponent(apiKey.trim())}&units=metric`
      );
      const data = await res.json();
      if (!res.ok) {
        const msg = data.message || 'Request failed';
        setError(`HTTP ${data.cod ?? res.status}: ${msg}`);
      } else {
        setWeather(data as WeatherData);
      }
    } catch {
      setError('Network error — verify your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  function clearKey() {
    localStorage.removeItem('owm_api_key');
    setApiKey('');
    setKeySaved(false);
  }

  return (
    <section className={styles.widgetSection}>
      <div className="container">
        <div className={styles.widgetHeader}>
          <span className={styles.eyebrow}>Live endpoint test · GET /data/2.5/weather</span>
          <h2>Test with your OpenWeatherMap API key</h2>
          <p>
            Query real-time observations for any city with your personal API key.
          </p>
        </div>
        <div className={styles.widgetCard}>
          <form onSubmit={fetchWeather} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="owm-widget-api-key" className={styles.label}>
                  API key
                </label>
                <div className={styles.keyInputWrapper}>
                  <input
                    id="owm-widget-api-key"
                    type="password"
                    placeholder="Paste your 32-character API key"
                    value={apiKey}
                    onChange={(e) => {
                      setApiKey(e.target.value);
                      setKeySaved(false);
                    }}
                    className={clsx(styles.input, keySaved && styles.inputWithBadge)}
                    required
                    autoComplete="off"
                  />
                  {keySaved && (
                    <button
                      type="button"
                      onClick={clearKey}
                      className={styles.savedBadge}
                      aria-label="Clear saved API key">
                      Saved ✓ · Clear
                    </button>
                  )}
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="owm-widget-city" className={styles.label}>
                  City
                </label>
                <input
                  id="owm-widget-city"
                  type="text"
                  placeholder="Tokyo, London, or São Paulo"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.submitGroup}>
                <button
                  type="submit"
                  className={styles.fetchBtn}
                  disabled={loading || !apiKey.trim() || !city.trim()}>
                  {loading ? 'Fetching…' : 'Fetch weather →'}
                </button>
              </div>
            </div>

            <div
              className={styles.presetsRow}
              role="group"
              aria-label="City presets">
              <span className={styles.presetsLabel}>Quick presets:</span>
              {CITY_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  aria-pressed={city === preset}
                  onClick={() => setCity(preset)}
                  className={clsx(
                    styles.presetPill,
                    city === preset && styles.presetPillActive
                  )}>
                  {preset}
                </button>
              ))}
            </div>
          </form>

          {error && (
            <div className={styles.errorBox} role="alert">
              {error}
            </div>
          )}

          {weather && weather.weather[0] && (
            <div className={styles.result} aria-live="polite">
              <div className={styles.resultMain}>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                  className={styles.weatherIcon}
                  width="76"
                  height="76"
                />
                <div className={styles.resultPrimary}>
                  <div className={styles.cityName}>
                    {weather.name}, {weather.sys.country}
                  </div>
                  <div className={styles.temp}>
                    {Math.round(weather.main.temp)}°C
                  </div>
                  <div className={styles.description}>
                    {weather.weather[0].description}
                  </div>
                </div>
              </div>
              <div className={styles.resultStats}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Feels like</span>
                  <span className={styles.statValue}>
                    {Math.round(weather.main.feels_like)}°C
                  </span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Humidity</span>
                  <span className={styles.statValue}>
                    {weather.main.humidity}%
                  </span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Wind</span>
                  <span className={styles.statValue}>
                    {weather.wind.speed} m/s
                  </span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Pressure</span>
                  <span className={styles.statValue}>
                    {weather.main.pressure} hPa
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <p className={styles.disclaimer}>
          Need an API key?{' '}
          <Link to="/docs/getting-started/get-api-key">Get a free key</Link> —
          activation takes 10–15 minutes (up to 2 hours). Or{' '}
          <Link to="/playground">preview sample responses without a key →</Link>
        </p>
      </div>
    </section>
  );
}
