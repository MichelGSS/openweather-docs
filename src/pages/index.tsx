import React from 'react';
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
        width="220"
        height="145"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Sun glow */}
        <circle cx="80" cy="58" r="36" className={styles.sunGlow} />
        {/* Sun core */}
        <circle cx="80" cy="58" r="24" className={styles.sunCore} />
        {/* Sun rays */}
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
        {/* Cloud — overlapping ellipses */}
        <ellipse cx="148" cy="88" rx="50" ry="20" className={styles.cloud} />
        <ellipse cx="124" cy="75" rx="30" ry="26" className={styles.cloud} />
        <ellipse cx="152" cy="68" rx="26" ry="24" className={styles.cloud} />
        <ellipse cx="176" cy="80" rx="22" ry="20" className={styles.cloud} />
        {/* Rain drops */}
        <line x1="120" y1="112" x2="113" y2="130" className={styles.rain} strokeLinecap="round" />
        <line x1="142" y1="114" x2="135" y2="132" className={styles.rain} strokeLinecap="round" />
        <line x1="164" y1="112" x2="157" y2="130" className={styles.rain} strokeLinecap="round" />
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
      <div className={styles.heroGlow} aria-hidden="true" />
      <div className="container">
        <WeatherIllustration />
        <span className={styles.heroEyebrow}>Unofficial · Developer-focused documentation</span>
        <h1 className="hero__title">Build with Real Weather Data</h1>
        <p className="hero__subtitle">
          A clear, structured guide to the OpenWeatherMap REST API.{' '}
          Learn how to fetch live conditions, 5-day forecasts, and geocoding data.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started/prerequisites">
            Get Started — 5 min
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/playground">
            Try the API Live →
          </Link>
        </div>
        <ul className={styles.trustRow} aria-label="Highlights">
          <li><span className={styles.trustDot} aria-hidden="true" />REST + JSON</li>
          <li><span className={styles.trustDot} aria-hidden="true" />Node.js &amp; Python samples</li>
          <li><span className={styles.trustDot} aria-hidden="true" />Diátaxis-structured</li>
        </ul>
      </div>
    </header>
  );
}

type FeatureItem = {
  title: string;
  icon: string;
  link: string;
  cta: string;
  description: React.ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Use',
    icon: '⚡',
    link: '/docs/getting-started/prerequisites',
    cta: 'Get Started',
    description: (
      <>
        Start making API requests in minutes. Detailed quickstarts and code samples in Node.js and Python get you up and running without friction.
      </>
    ),
  },
  {
    title: 'Developer Focused',
    icon: '💻',
    link: '/docs/reference/authentication',
    cta: 'View API Reference',
    description: (
      <>
        Clear API references, error code handling, and rate limit explanations designed specifically for software engineers building production apps.
      </>
    ),
  },
  {
    title: 'Diátaxis Framework',
    icon: '📚',
    link: '/docs/intro',
    cta: 'Explore the Docs',
    description: (
      <>
        Structured for maximum cognitive ease. Find tutorials, how-to guides, reference material, and conceptual explanations cleanly separated.
      </>
    ),
  },
];

function Feature({title, description, icon, link, cta}: FeatureItem) {
  return (
    <div className={clsx('col col--4', styles.featureCol)}>
      <Link to={link} className={styles.featureCard}>
        <div className={styles.featureIcon} aria-hidden="true">{icon}</div>
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
          eyebrow="Why these docs"
          title="Documentation built for engineers"
          subtitle="Everything you need to integrate weather data — nothing you don't."
        />
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CodeHighlightSection() {
  return (
    <section className={styles.codeSection}>
      <div className="container">
        <div className={clsx('row', styles.codeSectionRow)}>
          <div className={clsx('col col--6', styles.codeSectionText)}>
            <span className={styles.eyebrow}>Integrate in seconds</span>
            <h2>One request away from live weather</h2>
            <p>
              The OpenWeatherMap API uses standard REST conventions and JSON responses, making it compatible with any modern tech stack.
            </p>
            <ul className={styles.checklist}>
              <li>Secure API-key authentication</li>
              <li>Metric &amp; imperial units</li>
              <li>Multilingual responses</li>
            </ul>
            <div className={styles.codeSectionActions}>
              <Link className="button button--secondary" to="/docs/getting-started/first-request">
                Make your first request →
              </Link>
            </div>
          </div>
          <div className={clsx('col col--6', styles.codeSectionTerminal)}>
            <div className={styles.mockTerminal}>
              <div className={styles.terminalHeader}>
                <span className={styles.dot} style={{backgroundColor: '#ff5f56'}}></span>
                <span className={styles.dot} style={{backgroundColor: '#ffbd2e'}}></span>
                <span className={styles.dot} style={{backgroundColor: '#27c93f'}}></span>
                <span className={styles.terminalTitle}>bash</span>
              </div>
              <pre className={styles.terminalBody}>
                <code>
<span style={{color: 'var(--term-color-command)'}}>curl </span><span style={{color: 'var(--term-color-string)'}}>"https://api.openweathermap.org/data/2.5/weather?q=Tokyo&appid=$API_KEY"</span>
<br/><br/>
<span style={{color: 'var(--term-color-comment)'}}># Output</span><br/>
<span style={{color: 'var(--term-color-brace)'}}>&#123;</span><br/>
  <span style={{color: 'var(--term-color-key)'}}>"weather"</span>: <span style={{color: 'var(--term-color-bracket)'}}>[</span><span style={{color: 'var(--term-color-brace)'}}>&#123;</span><br/>
    <span style={{color: 'var(--term-color-key)'}}>"main"</span>: <span style={{color: 'var(--term-color-string)'}}>"Clouds"</span>,<br/>
    <span style={{color: 'var(--term-color-key)'}}>"description"</span>: <span style={{color: 'var(--term-color-string)'}}>"scattered clouds"</span><br/>
  <span style={{color: 'var(--term-color-brace)'}}>&#125;</span><span style={{color: 'var(--term-color-bracket)'}}>]</span>,<br/>
  <span style={{color: 'var(--term-color-key)'}}>"main"</span>: <span style={{color: 'var(--term-color-brace)'}}>&#123;</span> <span style={{color: 'var(--term-color-key)'}}>"temp"</span>: <span style={{color: 'var(--term-color-number)'}}>22.1</span> <span style={{color: 'var(--term-color-brace)'}}>&#125;</span>,<br/>
  <span style={{color: 'var(--term-color-key)'}}>"name"</span>: <span style={{color: 'var(--term-color-string)'}}>"Tokyo"</span><br/>
<span style={{color: 'var(--term-color-brace)'}}>&#125;</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): React.JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Unofficial API documentation for OpenWeatherMap — a Technical Writing portfolio sample.">
      <HomepageHeader />
      <main>
        <Reveal><HomepageFeatures /></Reveal>
        <Reveal><BrowserOnly>{() => <GeoWeather />}</BrowserOnly></Reveal>
        <Reveal><BrowserOnly>{() => <WeatherWidget />}</BrowserOnly></Reveal>
        <Reveal><CodeHighlightSection /></Reveal>
      </main>
    </Layout>
  );
}
