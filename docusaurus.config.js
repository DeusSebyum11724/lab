// @ts-check
/**
 * Edulab58 — platforma de Fizică. Mai târziu și Chimie.
 *
 * ÎN STILUL edumat58, DAR MAI SIMPLĂ. Ce nu are, deliberat:
 *   - EduPAȘI (lecțiile adaptate și navigatorul lor)
 *   - serviciul de voce și playerul pe secțiuni
 *   - orice componentă de AI
 *   - backendul, calendarul, panoul de administrare
 * Ce PĂSTREAZĂ: opțiunile de accesibilitate (rigla de citire și comenzile de
 * secțiune), fiindcă acelea nu depind nici de voce, nici de AI.
 *
 * MATEMATICA SE SCRIE ALTFEL DECÂT PE edumat58. Acolo formulele trec prin
 * componenta `<Katex>` cu `String.raw`, o convenție născută din nevoia de a
 * colora bucăți din formulă. Aici se folosesc `remark-math` + `rehype-katex`,
 * adică `$…$` în rând și `$$…$$` pe bloc — calea nativă Docusaurus. E mai
 * puțin cod, iar la fizică formula colorată e excepția, nu regula.
 */

import { themes as prismThemes } from 'prism-react-renderer';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Edulab58',
  tagline: 'Fizica, pas cu pas',
  favicon: 'img/favicon.ico',

  url: 'https://edulab58.github.io',
  baseUrl: '/lab/',
  organizationName: 'edulab58',
  projectName: 'lab',

  onBrokenLinks: 'throw',
  // Mutată din `onBrokenMarkdownLinks`, depreciat și scos în Docusaurus v4.
  markdown: { hooks: { onBrokenMarkdownLinks: 'warn' } },

  i18n: { defaultLocale: 'ro', locales: ['ro'] },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        // Fără blog: edumat58 are unul și aproape nu-l folosește, iar o rubrică
        // goală arată mai rău decât una care lipsește.
        blog: false,
        theme: { customCss: './src/css/custom.css' },
      }),
    ],
  ],

  // KaTeX are nevoie de foaia lui de stil. Legată de la CDN ca pe edumat58;
  // dacă platforma ajunge să fie împachetată pentru aplicație, se localizează
  // — vezi ce s-a făcut la lecțiile edumat58.
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css',
      type: 'text/css',
      crossorigin: 'anonymous',
    },
  ],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      { hashed: true, language: ['ro', 'en'], indexBlog: false },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/edulab58-social.jpg',
      colorMode: { defaultMode: 'light', respectPrefersColorScheme: true },
      navbar: {
        title: 'Edulab58',
        logo: { alt: 'Edulab58', src: 'img/logo.svg' },
        items: [
          { type: 'docSidebar', sidebarId: 'fizicaSidebar', position: 'left', label: 'Fizică' },
          { to: '/docs/despre', label: 'Despre', position: 'left' },
          { href: 'https://www.kulturosfera.com', label: 'Kulturosfera', position: 'right' },
        ],
      },
      footer: {
        style: 'light',
        links: [
          // Clasele NU sunt listate aici cât timp n-au lecții: o legătură către
          // o categorie goală nu duce nicăieri, iar Docusaurus o raportează ca
          // legătură ruptă. Se adaugă pe măsură ce fiecare clasă primește
          // conținut; până atunci bara laterală e singura cale, și e corectă.
          {
            title: 'Curs',
            items: [{ label: 'Despre', to: '/docs/despre' }],
          },
          {
            title: 'Platformă',
            items: [
              { label: 'Kulturosfera', href: 'https://www.kulturosfera.com' },
              { label: 'edumat58', href: 'https://edumat58.github.io/curs/' },
            ],
          },
        ],
        copyright: `Edulab58 · Kulturosfera · ${new Date().getFullYear()}`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
