import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Documentación SUMARC',
  tagline: 'Herramienta de gestión editorial de la UNLP',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://sumarcdocs.netlify.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Configuración para evitar problemas de rutas y 404 al cambiar de idioma
  trailingSlash: false,

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: '', // Título vacío porque el logo ya incluye el texto
      logo: {
        alt: 'SUMARC',
        src: 'img/sumarc-logo.png',
        // style: { height: '46px', marginLeft: '-10px' }, // Removed manual style to fix alignment
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentación',
        },
        { to: '/blog', label: 'Versiones', position: 'left' },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/sedici',
          label: 'GitHub SEDICI',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentación',
          items: [
            {
              label: 'Introducción',
              to: '/docs/intro',
            },
            {
              label: 'Flujo de Trabajo',
              to: '/docs/workflow',
            },
            {
              label: 'Plugins',
              to: '/docs/plugins',
            },
          ],
        },
        {
          title: 'SEDICI / UNLP',
          items: [
            {
              label: 'Repositorio SEDICI',
              href: 'http://sedici.unlp.edu.ar/',
            },
            {
              label: 'Portal UNLP',
              href: 'https://unlp.edu.ar/',
            },
            {
              label: 'Contacto',
              href: 'http://sedici.unlp.edu.ar/feedback',
            },
          ],
        },
        {
          title: 'Comunidad',
          items: [
            {
              label: 'Historial de Versiones',
              to: '/blog',
            },
            {
              label: 'Facebook',
              href: 'http://www.facebook.com/sedici.unlp',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/sedici_unlp',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} PREBI-SEDICI. Created with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
