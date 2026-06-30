import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type WeatherData = {
  name: string;
  sys: { country: string };
  weather: [{ description: string; icon: string; main: string }];
  main: { temp: number; feels_like: number; humidity: number; pressure: number };
  wind: { speed: number };
};

export default function WeatherWidget() {
  const [city, setCity] = useState('');
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
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city.trim())}&appid=${apiKey.trim()}&units=metric`
      );
      const data = await res.json();
      if (!res.ok) {
        const msg = data.message || 'Unknown error';
        setError(`${data.cod}: ${msg}`);
      } else {
        setWeather(data);
      }
    } catch {
      setError('Network error — check your internet connection');
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
          <span className={styles.eyebrow}>With your API key</span>
          <h2>Try the OpenWeatherMap API</h2>
          <p>Fetch real weather data for any city using your own OpenWeatherMap key.</p>
        </div>
        <div className={styles.widgetCard}>
          <form onSubmit={fetchWeather} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>API key</label>
                <div className={styles.keyInputWrapper}>
                  <input
                    type="password"
                    placeholder="Your OpenWeatherMap API key"
                    value={apiKey}
                    onChange={e => { setApiKey(e.target.value); setKeySaved(false); }}
                    className={styles.input}
                    required
                    autoComplete="off"
                  />
                  {keySaved && (
                    <button type="button" onClick={clearKey} className={styles.savedBadge}>
                      Saved ✓
                    </button>
                  )}
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>City</label>
                <input
                  type="text"
                  placeholder="e.g. Tokyo, London, São Paulo"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>&nbsp;</label>
                <button type="submit" className={styles.fetchBtn} disabled={loading}>
                  {loading ? 'Fetching…' : 'Fetch weather →'}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className={styles.errorBox} role="alert">
              <span aria-hidden="true">⚠</span> {error}
            </div>
          )}

          {weather && (
            <div className={styles.result} aria-live="polite">
              <div className={styles.resultMain}>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                  className={styles.weatherIcon}
                />
                <div className={styles.resultPrimary}>
                  <div className={styles.cityName}>
                    {weather.name}, {weather.sys.country}
                  </div>
                  <div className={styles.temp}>{Math.round(weather.main.temp)}°C</div>
                  <div className={styles.description}>{weather.weather[0].description}</div>
                </div>
              </div>
              <div className={styles.resultStats}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Feels like</span>
                  <span className={styles.statValue}>{Math.round(weather.main.feels_like)}°C</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Humidity</span>
                  <span className={styles.statValue}>{weather.main.humidity}%</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Wind</span>
                  <span className={styles.statValue}>{weather.wind.speed} m/s</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Pressure</span>
                  <span className={styles.statValue}>{weather.main.pressure} hPa</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <p className={styles.disclaimer}>
          No API key?{' '}
          <Link to="/docs/getting-started/get-api-key">Get one free</Link>{' '}
          — activation takes ~2 hours. Your key is stored only in your browser.
        </p>
      </div>
    </section>
  );
}
