import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'OpenWeatherMap API Docs',
  tagline:
    'Unofficial developer documentation for the OpenWeatherMap REST API — a technical writing portfolio sample by Michel Silveira',
  url: 'https://michelgss.github.io',
  baseUrl: '/openweather-docs/',
  organizationName: 'michelgss',
  projectName: 'openweather-docs',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.svg',

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap',
      },
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/docs',
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.svg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    announcementBar: {
      id: 'portfolio_sample',
      content:
        'Technical writing portfolio sample by <a href="https://michelgss.github.io/portfolio/" target="_blank" rel="noopener noreferrer">Michel Silveira</a> · Unofficial documentation, not affiliated with OpenWeatherMap.',
      backgroundColor: '#1A1A1A',
      textColor: '#A0A0A0',
      isCloseable: false,
    },
    navbar: {
      title: 'OpenWeatherMap API Docs',
      logo: {
        alt: 'OpenWeatherMap API Docs',
        src: 'img/logo.svg',
        width: 28,
        height: 28,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          type: 'dropdown',
          label: 'API reference',
          position: 'left',
          items: [
            {label: 'Authentication', to: '/docs/reference/authentication'},
            {label: 'Current weather', to: '/docs/reference/current-weather'},
            {label: '5-day forecast', to: '/docs/reference/forecast'},
            {label: 'Geocoding', to: '/docs/reference/geocoding'},
            {label: 'Error codes', to: '/docs/reference/error-codes'},
            {label: 'Rate limits', to: '/docs/reference/rate-limits'},
          ],
        },
        {to: '/playground', label: 'Try it live', position: 'right'},
        {
          href: 'https://michelgss.github.io/portfolio/',
          label: 'Portfolio',
          position: 'right',
        },
        {
          href: 'https://github.com/michelgss',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {label: 'Introduction', to: '/docs/intro'},
            {label: 'Getting started', to: '/docs/getting-started/prerequisites'},
            {label: 'Tutorials', to: '/docs/tutorials/weather-dashboard'},
            {label: 'How-to guides', to: '/docs/how-to/get-current-weather'},
            {label: 'Concepts', to: '/docs/concepts/how-weather-data-works'},
          ],
        },
        {
          title: 'API reference',
          items: [
            {label: 'Authentication', to: '/docs/reference/authentication'},
            {label: 'Current weather', to: '/docs/reference/current-weather'},
            {label: '5-day forecast', to: '/docs/reference/forecast'},
            {label: 'Geocoding', to: '/docs/reference/geocoding'},
            {label: 'Error codes', to: '/docs/reference/error-codes'},
            {label: 'Rate limits', to: '/docs/reference/rate-limits'},
          ],
        },
        {
          title: 'Tools and author',
          items: [
            {label: 'API playground', to: '/playground'},
            {label: 'Troubleshooting', to: '/docs/troubleshooting/common-errors'},
            {label: 'Portfolio', href: 'https://michelgss.github.io/portfolio/'},
            {label: 'GitHub', href: 'https://github.com/michelgss'},
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} <a href="https://michelgss.github.io/portfolio/" target="_blank" rel="noopener noreferrer">Michel Silveira</a> · Technical writer · Unofficial portfolio sample, not affiliated with OpenWeatherMap.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ['bash', 'python', 'json', 'powershell', 'http', 'typescript'],
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
      options: {
        fontSize: 16,
      },
    },
  } satisfies Preset.ThemeConfig,

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['en'],
        docsRouteBasePath: '/docs',
        indexBlog: false,
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],
};

export default config;
