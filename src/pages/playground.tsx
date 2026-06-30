import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './playground.module.css';

type ParamDef = {
  name: string;
  label: string;
  type: 'text' | 'select' | 'number';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
};

type EndpointDef = {
  id: string;
  name: string;
  method: string;
  url: string;
  description: string;
  params: ParamDef[];
};

const ENDPOINTS: EndpointDef[] = [
  {
    id: 'current',
    name: 'Current Weather',
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/weather',
    description: 'Returns current weather data for a city.',
    params: [
      { name: 'q', label: 'City name', type: 'text', placeholder: 'e.g. Tokyo', required: true },
      {
        name: 'units',
        label: 'Units',
        type: 'select',
        options: [
          { value: 'metric', label: 'metric — °C, m/s' },
          { value: 'imperial', label: 'imperial — °F, mph' },
          { value: 'standard', label: 'standard — K' },
        ],
      },
      { name: 'lang', label: 'Language', type: 'text', placeholder: 'en, pt, es, fr…' },
    ],
  },
  {
    id: 'forecast',
    name: '5-Day Forecast',
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/forecast',
    description: 'Returns a 5-day forecast in 3-hour intervals (up to 40 entries).',
    params: [
      { name: 'q', label: 'City name', type: 'text', placeholder: 'e.g. London', required: true },
      {
        name: 'units',
        label: 'Units',
        type: 'select',
        options: [
          { value: 'metric', label: 'metric — °C, m/s' },
          { value: 'imperial', label: 'imperial — °F, mph' },
          { value: 'standard', label: 'standard — K' },
        ],
      },
      { name: 'cnt', label: 'Count (1–40)', type: 'number', placeholder: '8' },
    ],
  },
  {
    id: 'geocoding',
    name: 'Geocoding',
    method: 'GET',
    url: 'https://api.openweathermap.org/geo/1.0/direct',
    description: 'Converts city names to geographic coordinates (lat/lon).',
    params: [
      { name: 'q', label: 'City name', type: 'text', placeholder: 'e.g. Paris', required: true },
      { name: 'limit', label: 'Limit (1–5)', type: 'number', placeholder: '5' },
    ],
  },
];

function buildUrl(endpoint: EndpointDef, params: Record<string, string>, apiKey: string): string {
  const url = new URL(endpoint.url);
  url.searchParams.set('appid', apiKey.trim() || 'YOUR_API_KEY');
  for (const [key, value] of Object.entries(params)) {
    if (value.trim()) url.searchParams.set(key, value.trim());
  }
  return decodeURIComponent(url.toString());
}

function statusColor(status: number): string {
  if (status >= 200 && status < 300) return 'var(--term-color-string, #1A6B2A)';
  if (status >= 400) return 'var(--term-color-key, #B91C1C)';
  return 'var(--ifm-font-color-secondary)';
}

export default function Playground() {
  const [activeTab, setActiveTab] = useState(0);
  const [apiKey, setApiKey] = useState('');
  const [keySaved, setKeySaved] = useState(false);
  const [params, setParams] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<{ status: number; data: unknown; ms: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const endpoint = ENDPOINTS[activeTab];

  useEffect(() => {
    const saved = localStorage.getItem('owm_api_key');
    if (saved) {
      setApiKey(saved);
      setKeySaved(true);
    }
  }, []);

  useEffect(() => {
    setParams({});
    setResponse(null);
    setError('');
  }, [activeTab]);

  function setParam(name: string, value: string) {
    setParams(prev => ({ ...prev, [name]: value }));
  }

  function saveKey() {
    if (!apiKey.trim()) return;
    localStorage.setItem('owm_api_key', apiKey.trim());
    setKeySaved(true);
  }

  function clearKey() {
    localStorage.removeItem('owm_api_key');
    setApiKey('');
    setKeySaved(false);
  }

  async function sendRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('API key is required');
      return;
    }

    setLoading(true);
    setError('');
    setResponse(null);

    const url = buildUrl(endpoint, params, apiKey);
    const start = performance.now();

    try {
      const res = await fetch(url);
      const ms = Math.round(performance.now() - start);
      const data = await res.json();
      setResponse({ status: res.status, data, ms });
    } catch {
      setError('Network error — check your internet connection');
    } finally {
      setLoading(false);
    }
  }

  const previewUrl = buildUrl(endpoint, params, apiKey);

  return (
    <Layout
      title="API Playground"
      description="Interactively test the OpenWeatherMap API endpoints"
    >
      <main className={styles.page}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1>API Playground</h1>
            <p>Test OpenWeatherMap endpoints in real time. Your API key is saved in your browser only.</p>
          </div>

          {/* API Key Bar */}
          <div className={styles.keyBar}>
            <label className={styles.keyLabel}>API key</label>
            <div className={styles.keyRow}>
              <input
                type="password"
                placeholder="Paste your OpenWeatherMap API key here"
                value={apiKey}
                onChange={e => { setApiKey(e.target.value); setKeySaved(false); }}
                className={styles.keyInput}
                autoComplete="off"
              />
              {keySaved ? (
                <button type="button" onClick={clearKey} className={clsx(styles.keyBtn, styles.keyBtnClear)}>
                  Saved ✓ — Clear
                </button>
              ) : (
                <button type="button" onClick={saveKey} className={styles.keyBtn} disabled={!apiKey.trim()}>
                  Save key
                </button>
              )}
            </div>
            <span className={styles.keyHint}>
              Don't have a key?{' '}
              <Link to="/docs/getting-started/get-api-key">Get one free →</Link>
            </span>
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            {ENDPOINTS.map((ep, i) => (
              <button
                key={ep.id}
                onClick={() => setActiveTab(i)}
                className={clsx(styles.tab, i === activeTab && styles.tabActive)}
              >
                <span className={styles.method}>GET</span>
                {ep.name}
              </button>
            ))}
          </div>

          {/* Main Layout */}
          <div className={styles.layout}>
            {/* Left: Params */}
            <div className={styles.panelLeft}>
              <div className={styles.panelTitle}>Parameters</div>
              <p className={styles.endpointDesc}>{endpoint.description}</p>
              <form onSubmit={sendRequest} className={styles.paramsForm}>
                {endpoint.params.map(p => (
                  <div key={p.name} className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>
                      {p.label}
                      {p.required && <span className={styles.required}> *</span>}
                    </label>
                    {p.type === 'select' ? (
                      <select
                        className={styles.select}
                        value={params[p.name] ?? 'metric'}
                        onChange={e => setParam(p.name, e.target.value)}
                      >
                        {p.options!.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={p.type}
                        placeholder={p.placeholder}
                        value={params[p.name] ?? ''}
                        onChange={e => setParam(p.name, e.target.value)}
                        className={styles.input}
                        required={p.required}
                        min={p.type === 'number' ? 1 : undefined}
                      />
                    )}
                  </div>
                ))}
                <button type="submit" className={styles.sendBtn} disabled={loading || !apiKey.trim()}>
                  {loading ? 'Sending…' : 'Send request →'}
                </button>
              </form>
            </div>

            {/* Right: URL + Response */}
            <div className={styles.panelRight}>
              {/* URL Preview */}
              <div className={styles.urlBox}>
                <div className={styles.urlLabel}>Request URL</div>
                <div className={styles.urlValue}>
                  <span className={styles.urlMethod}>GET</span>
                  <span className={styles.urlText}>{previewUrl.replace(/appid=[^&]+/, 'appid=••••••••')}</span>
                </div>
              </div>

              {/* Response */}
              <div className={styles.responseBox} aria-live="polite" aria-busy={loading}>
                <div className={styles.responseHeader}>
                  <span className={styles.panelTitle}>Response</span>
                  {response && (
                    <div className={styles.responseMeta}>
                      <span style={{ color: statusColor(response.status), fontWeight: 700 }}>
                        {response.status}
                      </span>
                      <span className={styles.responseMs}>{response.ms} ms</span>
                    </div>
                  )}
                </div>

                {error && (
                  <div className={styles.errorBox}>⚠ {error}</div>
                )}

                {!response && !loading && !error && (
                  <div className={styles.emptyState}>
                    Send a request to see the response here.
                  </div>
                )}

                {loading && (
                  <div className={styles.emptyState}>Waiting for response…</div>
                )}

                {response && (
                  <pre className={styles.responseJson}>
                    {JSON.stringify(response.data, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
