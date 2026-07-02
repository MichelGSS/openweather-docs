import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'OpenWeatherMap API Docs',
  tagline: 'Unofficial API documentation — a Technical Writing portfolio sample by Michel Silveira',
  url: 'https://michelgss.github.io',
  baseUrl: '/openweather-docs/',
  organizationName: 'michelgss',
  projectName: 'openweather-docs',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.svg',

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
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    announcementBar: {
      id: 'portfolio_sample',
      content: '📝 This is a <a href="https://michelgss.github.io/portfolio/">Technical Writing portfolio sample</a> by Michel Silveira. Not affiliated with OpenWeatherMap.',
      backgroundColor: '#1A1A1A',
      textColor: '#A0A0A0',
      isCloseable: false,
    },
    navbar: {
      title: 'OpenWeatherMap API Docs',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          type: 'dropdown',
          label: 'API Reference',
          position: 'left',
          items: [
            { label: 'Authentication', to: '/docs/reference/authentication' },
            { label: 'Current weather', to: '/docs/reference/current-weather' },
            { label: '5-day forecast', to: '/docs/reference/forecast' },
            { label: 'Geocoding', to: '/docs/reference/geocoding' },
          ],
        },
        { to: '/playground', label: 'Try it Live', position: 'right' },
        { href: 'https://michelgss.github.io/portfolio/', label: 'Portfolio', position: 'right' },
        { href: 'https://github.com/michelgss', label: 'GitHub', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `© ${new Date().getFullYear()} <a href="https://michelgss.github.io/portfolio/" target="_blank" rel="noopener noreferrer">Michel Silveira</a> · Technical Writer · <a href="https://github.com/michelgss" target="_blank" rel="noopener noreferrer">GitHub</a>`,
    },
    prism: {
      theme: prismThemes.vsDark,
      additionalLanguages: ['bash', 'python', 'json'],
    },
    mermaid: {
      options: {
        fontSize: 26,
      },
    },
  } satisfies Preset.ThemeConfig,

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
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
