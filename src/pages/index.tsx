import React, {useState} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';

import styles from './index.module.css';
import WeatherWidget from '../components/WeatherWidget';
import GeoWeather from '../components/GeoWeather';
import Reveal from '../components/Reveal';

function WeatherIllustration() {
  const rays = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <div className={styles.heroIllustration}>
      <svg
        viewBox="0 0 220 145"
        width="210"
        height="138"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true">
        <circle cx="80" cy="58" r="36" className={styles.sunGlow} />
        <circle cx="80" cy="58" r="24" className={styles.sunCore} />
        {rays.map((deg) => {
          const r = (deg * Math.PI) / 180;
          return (
            <line
              key={deg}
              x1={80 + 30 * Math.cos(r)}
              y1={58 + 30 * Math.sin(r)}
              x2={80 + 44 * Math.cos(r)}
              y2={58 + 44 * Math.sin(r)}
              className={styles.sunRay}
              strokeLinecap="round"
            />
          );
        })}
        <ellipse cx="148" cy="88" rx="50" ry="20" className={styles.cloud} />
        <ellipse cx="124" cy="75" rx="30" ry="26" className={styles.cloud} />
        <ellipse cx="152" cy="68" rx="26" ry="24" className={styles.cloud} />
        <ellipse cx="176" cy="80" rx="22" ry="20" className={styles.cloud} />
        <line
          x1="120"
          y1="112"
          x2="113"
          y2="130"
          className={styles.rain}
          strokeLinecap="round"
        />
        <line
          x1="142"
          y1="114"
          x2="135"
          y2="132"
          className={styles.rain}
          strokeLinecap="round"
        />
        <line
          x1="164"
          y1="112"
          x2="157"
          y2="130"
          className={styles.rain}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className={styles.sectionHeading}>
      <span className={styles.eyebrow}>{eyebrow}</span>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

function HomepageHeader() {
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className={styles.heroGrid} aria-hidden="true" />
      <div className={styles.heroGlow} aria-hidden="true" />
      <div className="container">
        <WeatherIllustration />
        <span className={styles.heroEyebrow}>
          Unofficial · Developer-focused API documentation
        </span>
        <h1 className="hero__title">Build with real weather data</h1>
        <p className="hero__subtitle">
          Structured documentation for the OpenWeatherMap REST API. Fetch live
          conditions, 5-day forecasts, and geocoding coordinates with
          production-ready patterns.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started/prerequisites">
            Get started in 5 minutes
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/playground">
            Try the API live →
          </Link>
        </div>
        <ul className={styles.trustRow} aria-label="Documentation highlights">
          <li>
            <span className={styles.trustDot} aria-hidden="true" />
            REST + JSON
          </li>
          <li>
            <span className={styles.trustDot} aria-hidden="true" />
            curl, Node.js, and Python
          </li>
          <li>
            <span className={styles.trustDot} aria-hidden="true" />
            Diátaxis architecture
          </li>
          <li>
            <span className={styles.trustDot} aria-hidden="true" />
            Interactive API explorer
          </li>
        </ul>
      </div>
    </header>
  );
}

const iconProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function CompassIcon() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" />
    </svg>
  );
}

function BookCodeIcon() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      <path d="m10 8-2 2 2 2" />
      <path d="m14 8 2 2-2 2" />
    </svg>
  );
}

function NetworkIcon() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <rect x="16" y="16" width="6" height="6" rx="1" />
      <rect x="2" y="16" width="6" height="6" rx="1" />
      <rect x="9" y="2" width="6" height="6" rx="1" />
      <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
      <path d="M12 12V8" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg {...iconProps} width={28} height={28} aria-hidden="true">
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg {...iconProps} width={28} height={28} aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function TerminalIcon() {
  return (
    <svg {...iconProps} width={28} height={28} aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m6 9 3 3-3 3" />
      <path d="M12 15h5" />
    </svg>
  );
}

type DiataxisQuadrant = {
  title: string;
  orientation: string;
  axis: string;
  to: string;
  Icon: React.ComponentType;
  description: string;
  links: Array<{label: string; to: string}>;
};

const DIATAXIS_QUADRANTS: DiataxisQuadrant[] = [
  {
    title: 'Tutorials',
    orientation: 'Learning-oriented',
    axis: 'Acquisition · Action',
    to: '/docs/tutorials/weather-dashboard',
    Icon: CompassIcon,
    description:
      'Follow guided, end-to-end lessons to build runnable multi-city dashboards and terminal tools from scratch.',
    links: [
      {label: 'Node.js weather dashboard', to: '/docs/tutorials/weather-dashboard'},
      {label: 'Python CLI weather tool', to: '/docs/tutorials/weather-cli'},
    ],
  },
  {
    title: 'How-to guides',
    orientation: 'Task-oriented',
    axis: 'Application · Action',
    to: '/docs/how-to/get-current-weather',
    Icon: WrenchIcon,
    description:
      'Solve specific integration problems with focused recipes for geocoding, forecasts, error recovery, and rate limits.',
    links: [
      {label: 'Current weather', to: '/docs/how-to/get-current-weather'},
      {label: '5-day forecast', to: '/docs/how-to/get-forecast'},
      {label: 'Coordinates and geocoding', to: '/docs/how-to/use-coordinates'},
      {label: 'Handle errors', to: '/docs/how-to/handle-errors'},
      {label: 'Rate limits', to: '/docs/how-to/rate-limiting'},
    ],
  },
  {
    title: 'API reference',
    orientation: 'Information-oriented',
    axis: 'Application · Cognition',
    to: '/docs/reference/current-weather',
    Icon: BookCodeIcon,
    description:
      'Look up exact HTTP endpoints, query parameters, authentication rules, status codes, and JSON response fields.',
    links: [
      {label: 'Authentication', to: '/docs/reference/authentication'},
      {label: 'Current weather', to: '/docs/reference/current-weather'},
      {label: '5-day forecast', to: '/docs/reference/forecast'},
      {label: 'Geocoding', to: '/docs/reference/geocoding'},
      {label: 'Error codes', to: '/docs/reference/error-codes'},
      {label: 'Rate limits', to: '/docs/reference/rate-limits'},
    ],
  },
  {
    title: 'Concepts',
    orientation: 'Understanding-oriented',
    axis: 'Acquisition · Cognition',
    to: '/docs/concepts/how-weather-data-works',
    Icon: NetworkIcon,
    description:
      'Understand observation pipelines, assimilation cycles, unit conversions, and how requests flow through the platform.',
    links: [
      {label: 'How weather data works', to: '/docs/concepts/how-weather-data-works'},
      {label: 'Units of measurement', to: '/docs/concepts/units'},
      {label: 'API architecture', to: '/docs/concepts/architecture'},
    ],
  },
];

function DiataxisSection() {
  return (
    <section className={styles.diataxisSection}>
      <div className="container">
        <SectionHeading
          eyebrow="Information architecture"
          title="Structured around how developers work"
          subtitle="Organized with the Diátaxis framework so step-by-step lessons, task recipes, endpoint specifications, and system concepts never blur together."
        />

        <div className={styles.diataxisGrid}>
          {DIATAXIS_QUADRANTS.map((q) => (
            <article key={q.title} className={styles.quadrantCard}>
              <div className={styles.quadrantTop}>
                <div className={styles.quadrantIcon}>
                  <q.Icon />
                </div>
                <div className={styles.quadrantBadges}>
                  <span className={styles.orientationBadge}>{q.orientation}</span>
                  <span className={styles.axisLabel}>{q.axis}</span>
                </div>
              </div>
              <h3 className={styles.quadrantTitle}>
                <Link to={q.to}>{q.title}</Link>
              </h3>
              <p className={styles.quadrantDesc}>{q.description}</p>
              <div className={styles.quadrantLinks}>
                {q.links.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={styles.quadrantChip}>
                    {item.label} →
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className={styles.companionBar} aria-label="Supporting documentation sections">
          <Link to="/docs/getting-started/prerequisites" className={styles.companionItem}>
            <span className={styles.companionTag}>Getting started</span>
            <span className={styles.companionText}>
              Prerequisites, API key setup, and your first request →
            </span>
          </Link>
          <Link to="/docs/troubleshooting/common-errors" className={styles.companionItem}>
            <span className={styles.companionTag}>Troubleshooting</span>
            <span className={styles.companionText}>
              Fixes for 401, 404, and 429 responses plus FAQ →
            </span>
          </Link>
          <Link to="/docs/intro" className={styles.companionItem}>
            <span className={styles.companionTag}>Overview</span>
            <span className={styles.companionText}>
              Full documentation map and editorial scope →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

type LangId = 'curl' | 'node' | 'python';

const TERMINAL_SNIPPETS: Record<
  LangId,
  {label: string; runtime: string; code: string}
> = {
  curl: {
    label: 'curl',
    runtime: 'Bash · curl',
    code: `curl -sS "https://api.openweathermap.org/data/2.5/weather?q=Tokyo,JP&units=metric&appid=$OPENWEATHER_API_KEY"`,
  },
  node: {
    label: 'Node.js',
    runtime: 'Node.js >= 18 · fetch',
    code: `const params = new URLSearchParams({
  q: 'Tokyo,JP',
  units: 'metric',
  appid: process.env.OPENWEATHER_API_KEY,
});

const res = await fetch(
  \`https://api.openweathermap.org/data/2.5/weather?\${params}\`
);
const data = await res.json();
console.log(\`\${data.name}: \${data.main.temp} °C\`);`,
  },
  python: {
    label: 'Python',
    runtime: 'Python 3 · requests',
    code: `import os
import requests

res = requests.get(
    "https://api.openweathermap.org/data/2.5/weather",
    params={
        "q": "Tokyo,JP",
        "units": "metric",
        "appid": os.environ["OPENWEATHER_API_KEY"],
    },
    timeout=10,
)
res.raise_for_status()
data = res.json()
print(f"{data['name']}: {data['main']['temp']} °C")`,
  },
};

const SAMPLE_RESPONSE_PREVIEW = `{
  "coord": { "lon": 139.6917, "lat": 35.6895 },
  "weather": [
    { "id": 802, "main": "Clouds", "description": "scattered clouds", "icon": "03d" }
  ],
  "main": { "temp": 22.1, "feels_like": 21.8, "humidity": 58, "pressure": 1014 },
  "wind": { "speed": 4.1, "deg": 140 },
  "sys": { "country": "JP" },
  "name": "Tokyo",
  "cod": 200
}`;

function CodeHighlightSection() {
  const [activeLang, setActiveLang] = useState<LangId>('curl');
  const [copied, setCopied] = useState(false);

  const activeSnippet = TERMINAL_SNIPPETS[activeLang];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(activeSnippet.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className={styles.codeSection}>
      <div className="container">
        <div className={clsx('row', styles.codeSectionRow)}>
          <div className={clsx('col col--5', styles.codeSectionText)}>
            <span className={styles.eyebrow}>Multi-language integration</span>
            <h2>One request away from live weather</h2>
            <p>
              The OpenWeatherMap API uses standard HTTPS query parameters and
              JSON payloads, working cleanly with your preferred runtime and
              HTTP client.
            </p>
            <ul className={styles.checklist}>
              <li>Environment-variable API key authentication</li>
              <li>Metric, imperial, and Kelvin unit systems</li>
              <li>Localized descriptions in more than 40 languages</li>
            </ul>
            <div className={styles.codeSectionActions}>
              <Link
                className="button button--secondary"
                to="/docs/getting-started/first-request">
                Send your first request →
              </Link>
              <Link
                className="button button--outline button--secondary"
                to="/playground">
                Open API playground
              </Link>
            </div>
          </div>

          <div className={clsx('col col--7', styles.codeSectionTerminal)}>
            <div className={styles.mockTerminal}>
              <div className={styles.terminalHeader}>
                <div className={styles.terminalDots} aria-hidden="true">
                  <span
                    className={styles.dot}
                    style={{backgroundColor: '#ff5f56'}}
                  />
                  <span
                    className={styles.dot}
                    style={{backgroundColor: '#ffbd2e'}}
                  />
                  <span
                    className={styles.dot}
                    style={{backgroundColor: '#27c93f'}}
                  />
                </div>

                <div
                  className={styles.terminalTabs}
                  role="tablist"
                  aria-label="Code sample language">
                  {(Object.keys(TERMINAL_SNIPPETS) as LangId[]).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      role="tab"
                      aria-selected={activeLang === lang}
                      onClick={() => {
                        setActiveLang(lang);
                        setCopied(false);
                      }}
                      className={clsx(
                        styles.terminalTab,
                        activeLang === lang && styles.terminalTabActive
                      )}>
                      {TERMINAL_SNIPPETS[lang].label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className={styles.copyBtn}
                  aria-label={`Copy ${activeSnippet.label} code sample`}>
                  {copied ? 'Copied ✓' : 'Copy'}
                </button>
              </div>

              <div className={styles.terminalMetaBar}>
                <span>{activeSnippet.runtime}</span>
                <span>GET /data/2.5/weather</span>
              </div>

              <pre className={styles.terminalBody}>
                <code>{activeSnippet.code}</code>
              </pre>

              <div className={styles.terminalResponseDivider}>
                <span className={styles.statusPillOk}>200 OK</span>
                <span>application/json · Metric (°C, m/s)</span>
              </div>

              <pre className={styles.terminalResponseBody}>
                <code>{SAMPLE_RESPONSE_PREVIEW}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type FeatureItem = {
  title: string;
  Icon: React.ComponentType;
  link: string;
  cta: string;
  description: string;
};

const FEATURE_LIST: FeatureItem[] = [
  {
    title: '5-minute onboarding',
    Icon: BoltIcon,
    link: '/docs/getting-started/prerequisites',
    cta: 'Start setup',
    description:
      'Store your API key in an environment variable, verify connectivity, and inspect your first 200 OK payload without setup friction.',
  },
  {
    title: 'Production-grade resilience',
    Icon: ShieldCheckIcon,
    link: '/docs/how-to/handle-errors',
    cta: 'Explore guides',
    description:
      'Adopt coordinate-first geocoding, timeout guards, HTTP status handling, and free-tier rate-limit caching from day one.',
  },
  {
    title: 'Zero-key sample explorer',
    Icon: TerminalIcon,
    link: '/playground',
    cta: 'Open playground',
    description:
      'Send live requests with your own key or preview schema-accurate 200, 401, 404, and 429 responses directly in your browser.',
  },
];

function Feature({title, description, Icon, link, cta}: FeatureItem) {
  return (
    <div className={clsx('col col--4', styles.featureCol)}>
      <Link to={link} className={styles.featureCard}>
        <div className={styles.featureIcon} aria-hidden="true">
          <Icon />
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
        <span className={styles.featureCta}>{cta} →</span>
      </Link>
    </div>
  );
}

function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <SectionHeading
          eyebrow="Developer experience"
          title="Documentation built for software engineers"
          subtitle="Every guide, reference table, and interactive tool prioritizes technical accuracy and runnable code."
        />
        <div className="row">
          {FEATURE_LIST.map((props) => (
            <Feature key={props.title} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): React.JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Unofficial developer documentation for the OpenWeatherMap REST API — a technical writing portfolio sample by Michel Silveira.">
      <HomepageHeader />
      <main>
        <Reveal>
          <DiataxisSection />
        </Reveal>
        <Reveal>
          <CodeHighlightSection />
        </Reveal>
        <Reveal>
          <HomepageFeatures />
        </Reveal>
        <BrowserOnly>
          {() => (
            <Reveal>
              <GeoWeather />
            </Reveal>
          )}
        </BrowserOnly>
        <BrowserOnly>
          {() => (
            <Reveal>
              <WeatherWidget />
            </Reveal>
          )}
        </BrowserOnly>
      </main>
    </Layout>
  );
}
