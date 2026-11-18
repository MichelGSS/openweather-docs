import React, {useState, useEffect, useMemo} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './playground.module.css';

type EndpointId = 'current' | 'forecast' | 'direct' | 'reverse';
type LookupMode = 'coords' | 'city';
type UnitsMode = 'metric' | 'imperial' | 'standard';
type SampleScenario = 200 | 401 | 404 | 429;
type CodeLang = 'curl' | 'node' | 'python';

type CityPreset = {
  label: string;
  q: string;
  city: string;
  country: string;
  state: string;
  lat: string;
  lon: string;
  tempC: number;
  feelsC: number;
  humidity: number;
  pressure: number;
  windMs: number;
  desc: string;
  main: string;
  icon: string;
  weatherId: number;
  tz: number;
  cityId: number;
};

const PRESETS: CityPreset[] = [
  {
    label: 'Tokyo',
    q: 'Tokyo,JP',
    city: 'Tokyo',
    country: 'JP',
    state: 'Tokyo',
    lat: '35.6895',
    lon: '139.6917',
    tempC: 22.1,
    feelsC: 21.8,
    humidity: 58,
    pressure: 1014,
    windMs: 4.1,
    desc: 'scattered clouds',
    main: 'Clouds',
    icon: '03d',
    weatherId: 802,
    tz: 32400,
    cityId: 1850147,
  },
  {
    label: 'London',
    q: 'London,GB',
    city: 'London',
    country: 'GB',
    state: 'England',
    lat: '51.5074',
    lon: '-0.1278',
    tempC: 15.4,
    feelsC: 14.9,
    humidity: 72,
    pressure: 1018,
    windMs: 5.2,
    desc: 'broken clouds',
    main: 'Clouds',
    icon: '04d',
    weatherId: 803,
    tz: 3600,
    cityId: 2643743,
  },
  {
    label: 'São Paulo',
    q: 'Sao Paulo,BR',
    city: 'São Paulo',
    country: 'BR',
    state: 'São Paulo',
    lat: '-23.5505',
    lon: '-46.6333',
    tempC: 25.6,
    feelsC: 25.9,
    humidity: 64,
    pressure: 1016,
    windMs: 3.6,
    desc: 'few clouds',
    main: 'Clouds',
    icon: '02d',
    weatherId: 801,
    tz: -10800,
    cityId: 3448439,
  },
  {
    label: 'New York',
    q: 'New York,US',
    city: 'New York',
    country: 'US',
    state: 'New York',
    lat: '40.7128',
    lon: '-74.0060',
    tempC: 19.3,
    feelsC: 18.7,
    humidity: 54,
    pressure: 1020,
    windMs: 4.8,
    desc: 'clear sky',
    main: 'Clear',
    icon: '01d',
    weatherId: 800,
    tz: -14400,
    cityId: 5128581,
  },
];

type EndpointConfig = {
  id: EndpointId;
  name: string;
  path: string;
  url: string;
  docPath: string;
  description: string;
  supportsLookupToggle: boolean;
  supportsUnits: boolean;
  supportsLang: boolean;
  supportsCnt: boolean;
  supportsLimit: boolean;
};

const ENDPOINTS: EndpointConfig[] = [
  {
    id: 'current',
    name: 'Current weather',
    path: '/data/2.5/weather',
    url: 'https://api.openweathermap.org/data/2.5/weather',
    docPath: '/docs/reference/current-weather',
    description:
      'Returns real-time weather observations for geographic coordinates or a city query.',
    supportsLookupToggle: true,
    supportsUnits: true,
    supportsLang: true,
    supportsCnt: false,
    supportsLimit: false,
  },
  {
    id: 'forecast',
    name: '5-day forecast',
    path: '/data/2.5/forecast',
    url: 'https://api.openweathermap.org/data/2.5/forecast',
    docPath: '/docs/reference/forecast',
    description:
      'Returns a 5-day forecast in 3-hour intervals (up to 40 timestamps).',
    supportsLookupToggle: true,
    supportsUnits: true,
    supportsLang: true,
    supportsCnt: true,
    supportsLimit: false,
  },
  {
    id: 'direct',
    name: 'Direct geocoding',
    path: '/geo/1.0/direct',
    url: 'https://api.openweathermap.org/geo/1.0/direct',
    docPath: '/docs/reference/geocoding',
    description:
      'Resolves a city, state, and country query into exact geographic coordinates.',
    supportsLookupToggle: false,
    supportsUnits: false,
    supportsLang: false,
    supportsCnt: false,
    supportsLimit: true,
  },
  {
    id: 'reverse',
    name: 'Reverse geocoding',
    path: '/geo/1.0/reverse',
    url: 'https://api.openweathermap.org/geo/1.0/reverse',
    docPath: '/docs/reference/geocoding',
    description:
      'Resolves latitude and longitude coordinates into named administrative locations.',
    supportsLookupToggle: false,
    supportsUnits: false,
    supportsLang: false,
    supportsCnt: false,
    supportsLimit: true,
  },
];

function convertTemp(tempC: number, units: UnitsMode): number {
  if (units === 'imperial') {
    return Math.round(((tempC * 9) / 5 + 32) * 100) / 100;
  }
  if (units === 'standard') {
    return Math.round((tempC + 273.15) * 100) / 100;
  }
  return Math.round(tempC * 100) / 100;
}

function convertWind(windMs: number, units: UnitsMode): number {
  if (units === 'imperial') {
    return Math.round(windMs * 2.23694 * 100) / 100;
  }
  return windMs;
}

function findMatchingPreset(
  q: string,
  lat: string,
  lon: string,
  useCoords: boolean
): CityPreset {
  if (useCoords) {
    const byCoords = PRESETS.find(
      (p) =>
        Math.abs(Number(p.lat) - Number(lat)) < 0.5 &&
        Math.abs(Number(p.lon) - Number(lon)) < 0.5
    );
    if (byCoords) return byCoords;
  } else {
    const normalized = q.trim().toLowerCase();
    const byCity = PRESETS.find(
      (p) =>
        normalized.includes(p.city.toLowerCase()) ||
        normalized.includes(p.q.split(',')[0].toLowerCase())
    );
    if (byCity) return byCity;
  }
  return PRESETS[0];
}

function buildSamplePayload(
  endpointId: EndpointId,
  scenario: SampleScenario,
  options: {
    lookupMode: LookupMode;
    q: string;
    lat: string;
    lon: string;
    units: UnitsMode;
    cnt: string;
    limit: string;
  }
): unknown {
  if (scenario === 401) {
    return {
      cod: 401,
      message:
        'Invalid API key. Please see https://openweathermap.org/faq#error401 for more info.',
    };
  }
  if (scenario === 404) {
    return {
      cod: '404',
      message: 'city not found',
    };
  }
  if (scenario === 429) {
    return {
      cod: 429,
      message:
        'Your account is temporary blocked due to exceeding of requests limitation of your subscription type. Please choose the proper subscription https://openweathermap.org/price',
    };
  }

  const useCoords =
    endpointId === 'reverse' ||
    ((endpointId === 'current' || endpointId === 'forecast') &&
      options.lookupMode === 'coords');

  const preset = findMatchingPreset(
    options.q,
    options.lat,
    options.lon,
    useCoords
  );

  const parsedLat = Number(options.lat) || Number(preset.lat);
  const parsedLon = Number(options.lon) || Number(preset.lon);
  const displayCity =
    !useCoords && options.q.trim()
      ? options.q.split(',')[0].trim()
      : preset.city;

  if (endpointId === 'current') {
    const temp = convertTemp(preset.tempC, options.units);
    const feels = convertTemp(preset.feelsC, options.units);
    const wind = convertWind(preset.windMs, options.units);
    return {
      coord: {
        lon: useCoords ? parsedLon : Number(preset.lon),
        lat: useCoords ? parsedLat : Number(preset.lat),
      },
      weather: [
        {
          id: preset.weatherId,
          main: preset.main,
          description: preset.desc,
          icon: preset.icon,
        },
      ],
      base: 'stations',
      main: {
        temp,
        feels_like: feels,
        temp_min: convertTemp(preset.tempC - 1.2, options.units),
        temp_max: convertTemp(preset.tempC + 1.4, options.units),
        pressure: preset.pressure,
        humidity: preset.humidity,
        sea_level: preset.pressure,
        grnd_level: preset.pressure - 4,
      },
      visibility: 10000,
      wind: {
        speed: wind,
        deg: 140,
      },
      clouds: {
        all: preset.main === 'Clear' ? 5 : 40,
      },
      dt: 1731924000,
      sys: {
        type: 2,
        id: 268395,
        country: preset.country,
        sunrise: 1731878120,
        sunset: 1731915240,
      },
      timezone: preset.tz,
      id: preset.cityId,
      name: displayCity,
      cod: 200,
    };
  }

  if (endpointId === 'forecast') {
    const requestedCnt = Math.min(
      Math.max(parseInt(options.cnt || '3', 10) || 3, 1),
      40
    );
    const baseUnix = 1731924000;
    const list = Array.from({length: requestedCnt}, (_, idx) => {
      const deltaC = Math.round(Math.sin((idx / 8) * Math.PI * 2) * 24) / 10;
      const itemDt = baseUnix + idx * 10800;
      const iso = new Date(itemDt * 1000)
        .toISOString()
        .replace('T', ' ')
        .slice(0, 19);
      return {
        dt: itemDt,
        main: {
          temp: convertTemp(preset.tempC + deltaC, options.units),
          feels_like: convertTemp(preset.feelsC + deltaC, options.units),
          pressure: preset.pressure,
          humidity: Math.min(95, Math.max(35, Math.round(preset.humidity - deltaC * 2))),
        },
        weather: [
          {
            id: preset.weatherId,
            main: preset.main,
            description: preset.desc,
            icon: preset.icon,
          },
        ],
        clouds: {all: 38},
        wind: {
          speed: convertWind(preset.windMs, options.units),
          deg: 145,
        },
        visibility: 10000,
        pop: 0.15,
        sys: {pod: idx % 2 === 0 ? 'd' : 'n'},
        dt_txt: iso,
      };
    });

    return {
      cod: '200',
      message: 0,
      cnt: list.length,
      list,
      city: {
        id: preset.cityId,
        name: displayCity,
        coord: {
          lat: useCoords ? parsedLat : Number(preset.lat),
          lon: useCoords ? parsedLon : Number(preset.lon),
        },
        country: preset.country,
        population: 8396000,
        timezone: preset.tz,
        sunrise: 1731878120,
        sunset: 1731915240,
      },
    };
  }

  // Direct or reverse geocoding
  const maxItems = Math.min(
    Math.max(parseInt(options.limit || '1', 10) || 1, 1),
    2
  );
  const primaryMatch = {
    name: displayCity,
    local_names: {
      en: displayCity,
    },
    lat: endpointId === 'reverse' ? parsedLat : Number(preset.lat),
    lon: endpointId === 'reverse' ? parsedLon : Number(preset.lon),
    country: preset.country,
    state: preset.state,
  };

  if (maxItems === 1) {
    return [primaryMatch];
  }

  return [
    primaryMatch,
    {
      name: `${displayCity} Metropolitan Area`,
      lat: Number((primaryMatch.lat + 0.042).toFixed(4)),
      lon: Number((primaryMatch.lon - 0.031).toFixed(4)),
      country: preset.country,
      state: preset.state,
    },
  ];
}

function buildOrderedParams(
  endpoint: EndpointConfig,
  state: {
    lookupMode: LookupMode;
    q: string;
    lat: string;
    lon: string;
    units: UnitsMode;
    cnt: string;
    limit: string;
    lang: string;
  }
): Array<[string, string]> {
  const entries: Array<[string, string]> = [];

  if (endpoint.id === 'current' || endpoint.id === 'forecast') {
    if (state.lookupMode === 'coords') {
      entries.push(['lat', state.lat.trim() || '35.6895']);
      entries.push(['lon', state.lon.trim() || '139.6917']);
    } else {
      entries.push(['q', state.q.trim() || 'Tokyo,JP']);
    }
    entries.push(['units', state.units]);
    if (endpoint.supportsCnt && state.cnt.trim()) {
      entries.push(['cnt', state.cnt.trim()]);
    }
    if (endpoint.supportsLang && state.lang.trim()) {
      entries.push(['lang', state.lang.trim()]);
    }
  } else if (endpoint.id === 'direct') {
    entries.push(['q', state.q.trim() || 'Tokyo,JP']);
    if (state.limit.trim()) {
      entries.push(['limit', state.limit.trim()]);
    }
  } else {
    entries.push(['lat', state.lat.trim() || '35.6895']);
    entries.push(['lon', state.lon.trim() || '139.6917']);
    if (state.limit.trim()) {
      entries.push(['limit', state.limit.trim()]);
    }
  }

  return entries;
}

function buildRequestUrl(
  endpointUrl: string,
  entries: Array<[string, string]>,
  appidValue: string
): string {
  const url = new URL(endpointUrl);
  for (const [k, v] of entries) {
    url.searchParams.set(k, v);
  }
  url.searchParams.set('appid', appidValue);
  return url.toString();
}

function buildCodeSnippet(
  lang: CodeLang,
  endpointUrl: string,
  entries: Array<[string, string]>
): string {
  if (lang === 'curl') {
    const query = entries
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');
    return `curl -sS "${endpointUrl}?${query}&appid=$OPENWEATHER_API_KEY"`;
  }

  if (lang === 'node') {
    const lines = entries
      .map(([k, v]) => `  ${k}: '${v.replace(/'/g, "\\'")}',`)
      .join('\n');
    return `const params = new URLSearchParams({
${lines}
  appid: process.env.OPENWEATHER_API_KEY,
});

const response = await fetch(\`${endpointUrl}?\${params}\`);
if (!response.ok) {
  throw new Error(\`HTTP \${response.status}\`);
}
const data = await response.json();
console.log(data);`;
  }

  const pyLines = entries
    .map(([k, v]) => `        "${k}": "${v.replace(/"/g, '\\"')}",`)
    .join('\n');
  return `import os
import requests

response = requests.get(
    "${endpointUrl}",
    params={
${pyLines}
        "appid": os.environ["OPENWEATHER_API_KEY"],
    },
    timeout=10,
)
response.raise_for_status()
print(response.json())`;
}

function statusBadgeMeta(status: number): {label: string; className: string} {
  if (status >= 200 && status < 300) {
    return {label: `${status} OK`, className: styles.badgeOk};
  }
  if (status === 429) {
    return {label: '429 Too Many Requests', className: styles.badgeWarn};
  }
  if (status === 401) {
    return {label: '401 Unauthorized', className: styles.badgeErr};
  }
  if (status === 404) {
    return {label: '404 Not Found', className: styles.badgeErr};
  }
  return {label: `HTTP ${status}`, className: styles.badgeErr};
}

const SAMPLE_SCENARIOS: Array<{code: SampleScenario; label: string}> = [
  {code: 200, label: '200 OK'},
  {code: 401, label: '401 Unauthorized'},
  {code: 404, label: '404 Not Found'},
  {code: 429, label: '429 Rate limit'},
];

export default function Playground(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState(0);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [keySaved, setKeySaved] = useState(false);

  // Query parameter state
  const [lookupMode, setLookupMode] = useState<LookupMode>('coords');
  const [q, setQ] = useState('Tokyo,JP');
  const [lat, setLat] = useState('35.6895');
  const [lon, setLon] = useState('139.6917');
  const [units, setUnits] = useState<UnitsMode>('metric');
  const [cnt, setCnt] = useState('3');
  const [limit, setLimit] = useState('3');
  const [lang, setLang] = useState('');

  // Code snippet & copy state
  const [codeLang, setCodeLang] = useState<CodeLang>('curl');
  const [copiedTarget, setCopiedTarget] = useState<
    'url' | 'code' | 'json' | null
  >(null);

  // Response state ('sample' or 'live')
  const [responseMode, setResponseMode] = useState<'sample' | 'live'>('sample');
  const [sampleScenario, setSampleScenario] = useState<SampleScenario>(200);
  const [liveResponse, setLiveResponse] = useState<{
    status: number;
    data: unknown;
    ms: number;
  } | null>(null);
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

  function handleSelectEndpoint(idx: number) {
    setActiveTab(idx);
    setError('');
    setLiveResponse(null);
    setResponseMode('sample');
    setSampleScenario(200);
  }

  function applyPreset(preset: CityPreset) {
    setQ(preset.q);
    setLat(preset.lat);
    setLon(preset.lon);
    setError('');
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

  const orderedParams = useMemo(
    () =>
      buildOrderedParams(endpoint, {
        lookupMode,
        q,
        lat,
        lon,
        units,
        cnt,
        limit,
        lang,
      }),
    [endpoint, lookupMode, q, lat, lon, units, cnt, limit, lang]
  );

  const maskedPreviewUrl = useMemo(() => {
    const raw = buildRequestUrl(endpoint.url, orderedParams, 'REDACTED_KEY');
    return decodeURIComponent(raw).replace(
      'appid=REDACTED_KEY',
      apiKey.trim() ? 'appid=••••••••' : 'appid=$OPENWEATHER_API_KEY'
    );
  }, [endpoint.url, orderedParams, apiKey]);

  const copyableUrl = useMemo(() => {
    const trimmedKey = apiKey.trim();
    if (trimmedKey) {
      return buildRequestUrl(endpoint.url, orderedParams, trimmedKey);
    }
    return buildRequestUrl(
      endpoint.url,
      orderedParams,
      '__OWM_KEY_PLACEHOLDER__'
    ).replace('appid=__OWM_KEY_PLACEHOLDER__', 'appid=$OPENWEATHER_API_KEY');
  }, [endpoint.url, orderedParams, apiKey]);

  const codeSnippet = useMemo(
    () => buildCodeSnippet(codeLang, endpoint.url, orderedParams),
    [codeLang, endpoint.url, orderedParams]
  );

  const activeSampleData = useMemo(
    () =>
      buildSamplePayload(endpoint.id, sampleScenario, {
        lookupMode,
        q,
        lat,
        lon,
        units,
        cnt,
        limit,
      }),
    [endpoint.id, sampleScenario, lookupMode, q, lat, lon, units, cnt, limit]
  );

  const displayedStatus =
    responseMode === 'live' && liveResponse
      ? liveResponse.status
      : sampleScenario;

  const displayedData =
    responseMode === 'live' && liveResponse
      ? liveResponse.data
      : activeSampleData;

  const formattedJson = useMemo(
    () => JSON.stringify(displayedData, null, 2),
    [displayedData]
  );

  async function copyText(text: string, target: 'url' | 'code' | 'json') {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTarget(target);
      window.setTimeout(() => {
        setCopiedTarget((prev) => (prev === target ? null : prev));
      }, 1800);
    } catch {
      setCopiedTarget(null);
    }
  }

  async function sendLiveRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError(
        'Enter an active OpenWeatherMap API key above to send a live request, or select Preview sample response below.'
      );
      return;
    }

    setLoading(true);
    setError('');

    const liveUrl = buildRequestUrl(endpoint.url, orderedParams, apiKey.trim());
    const start = performance.now();

    try {
      const res = await fetch(liveUrl);
      const ms = Math.round(performance.now() - start);
      const data = await res.json();
      setLiveResponse({status: res.status, data, ms});
      setResponseMode('live');
    } catch {
      setError(
        'Network request failed. Verify your internet connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  function handlePreviewSample(scenario: SampleScenario = 200) {
    setError('');
    setSampleScenario(scenario);
    setResponseMode('sample');
  }

  const badge = statusBadgeMeta(displayedStatus);

  return (
    <Layout
      title="API playground"
      description="Test live OpenWeatherMap REST API endpoints, preview sample HTTP responses without an API key, and generate curl, Node.js, and Python snippets.">
      <main className={styles.page}>
        <div className="container">
          <header className={styles.pageHeader}>
            <span className={styles.eyebrow}>Interactive API explorer</span>
            <h1>API playground</h1>
            <p>
              Send live requests to <code>api.openweathermap.org</code> with
              your own key, or preview schema-accurate sample responses across
              status codes with zero setup.
            </p>
          </header>

          {/* API Key Bar */}
          <section className={styles.keyBar} aria-label="API key configuration">
            <div className={styles.keyHeaderRow}>
              <label htmlFor="playground-api-key" className={styles.keyLabel}>
                OpenWeatherMap API key (optional for sample mode)
              </label>
              <span className={styles.keyHint}>
                Need a key?{' '}
                <Link to="/docs/getting-started/get-api-key">
                  Get a free key →
                </Link>
              </span>
            </div>
            <div className={styles.keyRow}>
              <input
                id="playground-api-key"
                type={showKey ? 'text' : 'password'}
                placeholder="Paste your 32-character API key for live requests"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setKeySaved(false);
                }}
                className={styles.keyInput}
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setShowKey((s) => !s)}
                className={styles.keySecondaryBtn}
                disabled={!apiKey}
                aria-label={showKey ? 'Hide API key' : 'Show API key'}>
                {showKey ? 'Hide' : 'Show'}
              </button>
              {keySaved ? (
                <button
                  type="button"
                  onClick={clearKey}
                  className={clsx(styles.keyBtn, styles.keyBtnClear)}
                  aria-label="Clear saved API key">
                  Saved ✓ · Clear
                </button>
              ) : (
                <button
                  type="button"
                  onClick={saveKey}
                  className={styles.keyBtn}
                  disabled={!apiKey.trim()}>
                  Save in browser
                </button>
              )}
            </div>
          </section>

          {/* Endpoint Tabs */}
          <div
            className={styles.tabs}
            role="tablist"
            aria-label="OpenWeatherMap endpoints">
            {ENDPOINTS.map((ep, idx) => (
              <button
                key={ep.id}
                type="button"
                role="tab"
                aria-selected={idx === activeTab}
                onClick={() => handleSelectEndpoint(idx)}
                className={clsx(
                  styles.tab,
                  idx === activeTab && styles.tabActive
                )}>
                <span className={styles.method}>GET</span>
                <span className={styles.tabName}>{ep.name}</span>
                <span className={styles.tabPath}>{ep.path}</span>
              </button>
            ))}
          </div>

          {/* Main Workspace Grid */}
          <div className={styles.layout}>
            {/* Left Column: Parameters Form */}
            <aside className={styles.panelLeft}>
              <div className={styles.panelTopRow}>
                <span className={styles.panelTitle}>Query parameters</span>
                <Link to={endpoint.docPath} className={styles.refLink}>
                  View endpoint reference →
                </Link>
              </div>
              <p className={styles.endpointDesc}>{endpoint.description}</p>

              {/* Quick Location Presets */}
              <div className={styles.presetsBlock}>
                <span className={styles.presetsHeading}>Location presets</span>
                <div
                  className={styles.presetPills}
                  role="group"
                  aria-label="Location presets">
                  {PRESETS.map((preset) => {
                    const isSelected =
                      endpoint.id === 'direct' ||
                      (endpoint.supportsLookupToggle && lookupMode === 'city')
                        ? q === preset.q
                        : lat === preset.lat && lon === preset.lon;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => applyPreset(preset)}
                        className={clsx(
                          styles.presetPill,
                          isSelected && styles.presetPillActive
                        )}>
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={sendLiveRequest} className={styles.paramsForm}>
                {endpoint.supportsLookupToggle && (
                  <div className={styles.fieldGroup}>
                    <span className={styles.fieldLabel} id="lookup-mode-label">
                      Location lookup method
                    </span>
                    <div
                      className={styles.segmentedControl}
                      role="group"
                      aria-labelledby="lookup-mode-label">
                      <button
                        type="button"
                        aria-pressed={lookupMode === 'coords'}
                        onClick={() => setLookupMode('coords')}
                        className={clsx(
                          styles.segmentBtn,
                          lookupMode === 'coords' && styles.segmentBtnActive
                        )}>
                        Coordinates (lat, lon)
                      </button>
                      <button
                        type="button"
                        aria-pressed={lookupMode === 'city'}
                        onClick={() => setLookupMode('city')}
                        className={clsx(
                          styles.segmentBtn,
                          lookupMode === 'city' && styles.segmentBtnActive
                        )}>
                        City name (q)
                      </button>
                    </div>
                  </div>
                )}

                {/* Coordinate Inputs */}
                {(endpoint.id === 'reverse' ||
                  (endpoint.supportsLookupToggle &&
                    lookupMode === 'coords')) && (
                  <div className={styles.coordGrid}>
                    <div className={styles.fieldGroup}>
                      <label htmlFor="param-lat" className={styles.fieldLabel}>
                        Latitude (<code>lat</code>)
                        <span className={styles.required}> *</span>
                      </label>
                      <input
                        id="param-lat"
                        type="text"
                        inputMode="decimal"
                        placeholder="35.6895"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        className={styles.input}
                        required
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label htmlFor="param-lon" className={styles.fieldLabel}>
                        Longitude (<code>lon</code>)
                        <span className={styles.required}> *</span>
                      </label>
                      <input
                        id="param-lon"
                        type="text"
                        inputMode="decimal"
                        placeholder="139.6917"
                        value={lon}
                        onChange={(e) => setLon(e.target.value)}
                        className={styles.input}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* City Query Input */}
                {(endpoint.id === 'direct' ||
                  (endpoint.supportsLookupToggle && lookupMode === 'city')) && (
                  <div className={styles.fieldGroup}>
                    <label htmlFor="param-q" className={styles.fieldLabel}>
                      City, state, and country (<code>q</code>)
                      <span className={styles.required}> *</span>
                    </label>
                    <input
                      id="param-q"
                      type="text"
                      placeholder="Tokyo,JP"
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      className={styles.input}
                      required
                    />
                  </div>
                )}

                {/* Units Select */}
                {endpoint.supportsUnits && (
                  <div className={styles.fieldGroup}>
                    <label htmlFor="param-units" className={styles.fieldLabel}>
                      Units (<code>units</code>)
                    </label>
                    <select
                      id="param-units"
                      className={styles.select}
                      value={units}
                      onChange={(e) => setUnits(e.target.value as UnitsMode)}>
                      <option value="metric">metric — Celsius (°C), m/s</option>
                      <option value="imperial">
                        imperial — Fahrenheit (°F), mph
                      </option>
                      <option value="standard">
                        standard — Kelvin (K), m/s
                      </option>
                    </select>
                  </div>
                )}

                {/* Forecast Count */}
                {endpoint.supportsCnt && (
                  <div className={styles.fieldGroup}>
                    <label htmlFor="param-cnt" className={styles.fieldLabel}>
                      Timestamp count, 1–40 (<code>cnt</code>)
                    </label>
                    <input
                      id="param-cnt"
                      type="number"
                      min={1}
                      max={40}
                      placeholder="8"
                      value={cnt}
                      onChange={(e) => setCnt(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                )}

                {/* Geocoding Limit */}
                {endpoint.supportsLimit && (
                  <div className={styles.fieldGroup}>
                    <label htmlFor="param-limit" className={styles.fieldLabel}>
                      Result limit, 1–5 (<code>limit</code>)
                    </label>
                    <input
                      id="param-limit"
                      type="number"
                      min={1}
                      max={5}
                      placeholder="3"
                      value={limit}
                      onChange={(e) => setLimit(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                )}

                {/* Language */}
                {endpoint.supportsLang && (
                  <div className={styles.fieldGroup}>
                    <label htmlFor="param-lang" className={styles.fieldLabel}>
                      Language code (<code>lang</code>)
                    </label>
                    <input
                      id="param-lang"
                      type="text"
                      placeholder="en, pt_br, es, or ja"
                      value={lang}
                      onChange={(e) => setLang(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                )}

                <div className={styles.actionButtons}>
                  <button
                    type="submit"
                    className={styles.sendBtn}
                    disabled={loading}>
                    {loading ? 'Sending live request…' : 'Send live request →'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePreviewSample(200)}
                    className={styles.sampleBtn}>
                    Preview sample response
                  </button>
                </div>
              </form>
            </aside>

            {/* Right Column: URL + Live Code Snippet + Response */}
            <div className={styles.panelRight}>
              {/* 1. Request URL Card */}
              <section className={styles.urlBox} aria-label="Request URL">
                <div className={styles.cardHeaderRow}>
                  <span className={styles.panelTitle}>Request URL</span>
                  <button
                    type="button"
                    onClick={() => copyText(copyableUrl, 'url')}
                    className={styles.copyActionBtn}>
                    {copiedTarget === 'url' ? 'Copied ✓' : 'Copy URL'}
                  </button>
                </div>
                <div className={styles.urlValue}>
                  <span className={styles.urlMethod}>GET</span>
                  <code className={styles.urlText}>{maskedPreviewUrl}</code>
                </div>
              </section>

              {/* 2. Auto-Updating Code Generator Card */}
              <section className={styles.codeBox} aria-label="Generated code snippet">
                <div className={styles.codeBoxHeader}>
                  <div className={styles.codeHeaderLeft}>
                    <span className={styles.panelTitle}>Code snippet</span>
                    <div
                      className={styles.codeLangTabs}
                      role="tablist"
                      aria-label="Snippet language">
                      {(
                        [
                          {id: 'curl', label: 'curl'},
                          {id: 'node', label: 'Node.js'},
                          {id: 'python', label: 'Python'},
                        ] as const
                      ).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          role="tab"
                          aria-selected={codeLang === item.id}
                          onClick={() => setCodeLang(item.id)}
                          className={clsx(
                            styles.codeLangTab,
                            codeLang === item.id && styles.codeLangTabActive
                          )}>
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText(codeSnippet, 'code')}
                    className={styles.copyActionBtn}>
                    {copiedTarget === 'code' ? 'Copied ✓' : 'Copy snippet'}
                  </button>
                </div>
                <pre className={styles.codePre}>
                  <code>{codeSnippet}</code>
                </pre>
              </section>

              {/* 3. Response Viewer Card */}
              <section
                className={styles.responseBox}
                aria-live="polite"
                aria-busy={loading}>
                <div className={styles.responseHeader}>
                  <div className={styles.responseTitleGroup}>
                    <span className={styles.panelTitle}>Response</span>
                    {responseMode === 'live' && liveResponse ? (
                      <span className={styles.modePillLive}>
                        Live API · {liveResponse.ms} ms
                      </span>
                    ) : (
                      <span className={styles.modePillSample}>
                        Sample preview · No key required
                      </span>
                    )}
                    <span className={clsx(styles.statusBadge, badge.className)}>
                      {badge.label}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyText(formattedJson, 'json')}
                    className={styles.copyActionBtn}>
                    {copiedTarget === 'json' ? 'Copied ✓' : 'Copy JSON'}
                  </button>
                </div>

                {/* Sample Scenario Switcher */}
                <div className={styles.scenarioBar}>
                  <span className={styles.scenarioLabel}>
                    Inspect sample status payloads:
                  </span>
                  <div
                    className={styles.scenarioPills}
                    role="group"
                    aria-label="Sample HTTP status scenarios">
                    {SAMPLE_SCENARIOS.map((sc) => {
                      const active =
                        responseMode === 'sample' && sampleScenario === sc.code;
                      return (
                        <button
                          key={sc.code}
                          type="button"
                          aria-pressed={active}
                          onClick={() => handlePreviewSample(sc.code)}
                          className={clsx(
                            styles.scenarioPill,
                            active && styles.scenarioPillActive
                          )}>
                          {sc.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {error && (
                  <div className={styles.errorBox} role="alert">
                    {error}
                  </div>
                )}

                {loading ? (
                  <div className={styles.emptyState}>
                    Waiting for live response from api.openweathermap.org…
                  </div>
                ) : (
                  <pre className={styles.responseJson}>
                    <code>{formattedJson}</code>
                  </pre>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
