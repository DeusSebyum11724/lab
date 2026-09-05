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

  // Portat din edumat58 (`src/clientModules/uiFixes.js`), fără nicio bucată
  // legată de voce sau EduPAȘI — fișierul de acolo nu conținea așa ceva.
  // Calea e un simplu șir, nu `require.resolve` ca pe edumat58: fișierul de
  // configurare de aici e ESM (`import`/`export default`), iar `require` nu
  // există în el. Docusaurus rezolvă șirul relativ la rădăcina sitului.
  clientModules: ['./src/clientModules/uiFixes.js'],

  headTags: [
    {
      // Modul proiecție se citește ÎNAINTE de prima pictare. Altfel bara de sus
      // apare o clipă la fiecare încărcare, apoi dispare când pornește JS-ul.
      tagName: 'script',
      attributes: {},
      innerHTML:
        "try{if(localStorage.getItem('hideUI')==='true'){document.documentElement.setAttribute('data-ui-ascuns','')}}catch(e){}",
    },
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          // Data ultimei actualizări A LECȚIEI, citită din istoricul git al
          // fișierului. Autorul lipsește dinadins: `showLastUpdateAuthor` ar
          // scrie sub fiecare lecție numele de cont din git („DeusSebyum11724"),
          // nu numele profesorului. Se activează când depozitul are commit-uri
          // semnate cu numele real.
          showLastUpdateTime: true,
          showLastUpdateAuthor: false,
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
      // `respectPrefersColorScheme` era `true` și asta rupea prima impresie:
      // un vizitator cu sistemul pe întuneric primea un Edulab58 negru, o
      // înfățișare pe care edumat58 n-o are niciodată (acolo:
      // `disableSwitch: true`, `respectPrefersColorScheme: false`). Situl se
      // deschide acum întotdeauna pe crem, ca fratele lui. Comutatorul rămâne
      // — n-am scos nimic —, doar că modul întunecat e o alegere a omului, nu
      // starea implicită.
      colorMode: {
        defaultMode: 'light',
        respectPrefersColorScheme: false,
        disableSwitch: false,
      },
      navbar: {
        title: 'Edulab58',
        logo: { alt: 'Edulab58', src: 'img/logo.svg' },
        // ORDINEA E CEA DE PE edumat58, nu una nouă. Acolo, în stânga, vin
        // întâi rubricile generale (Meniu, EduPAȘI, Ghidul părintelui,
        // Automatisme) și abia apoi clasele: „Curs V", „Curs VI", „Curs VII",
        // „Curs VIII". Aici rubricile generale sunt două — bara laterală și
        // pagina „Despre" — iar clasele sunt trei, fiindcă la fizică gimnaziul
        // începe în clasa a VI-a.
        //
        // Rutele sunt cele de pe edumat58: `/docs/category/curs-vi`, pagina de
        // categorie generată din `docs/f6/_category_.json`. Docusaurus o
        // generează însă DOAR dacă în categoria aceea există cel puțin un
        // document — cu clasele goale, cele trei rubrici dădeau 404 și build-ul
        // pica (`onBrokenLinks: 'throw'`). De aceea fiecare clasă are o pagină
        // de deschidere, `docs/f6/index.mdx`, care listează capitolele programei
        // și rămâne folositoare și după ce apar lecțiile.
        //
        // Rubrica „Fizică" (`type: 'docSidebar'`) a fost scoasă: deschidea
        // bara laterală la primul ei document, care e chiar „Despre" — două
        // rubrici alăturate care duceau la aceeași pagină. Bara laterală se
        // deschide oricum din orice pagină de curs.
        items: [
          { to: '/docs/despre', label: 'Despre', position: 'left' },
          { position: 'left', label: 'Curs VI', to: '/docs/category/curs-vi' },
          { position: 'left', label: 'Curs VII', to: '/docs/category/curs-vii' },
          { position: 'left', label: 'Curs VIII', to: '/docs/category/curs-viii' },

          // Butonul-ochi (mod proiecție), copiat din navbarul edumat58. Stilul
          // lui e deja în custom.css (`.ui-eye-btn`), iar comportamentul în
          // `src/clientModules/uiFixes.js`. Fallback-ul din `onclick` există
          // pentru cazul în care modulul nu s-a încărcat încă.
          {
            type: 'html',
            position: 'right',
            value: `
            <button id="ui-toggle-btn" class="ui-eye-btn" title="Mod proiecție: ascunde bara de navigație" aria-label="Mod proiecție: ascunde bara de navigație"
              onclick="if (window.toggleUIHiding) { window.toggleUIHiding(); } else { const hideUI = localStorage.getItem('hideUI') === 'true'; localStorage.setItem('hideUI', !hideUI); window.dispatchEvent(new CustomEvent('uiToggle')); } this.dataset.hidden = String(localStorage.getItem('hideUI') === 'true');">
              <svg class="ui-eye-on" viewBox="0 0 24 24" width="19" height="19" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M2.06 12.35a1 1 0 0 1 0-.7C3.42 8.1 7.22 5 12 5s8.58 3.1 9.94 6.65a1 1 0 0 1 0 .7C20.58 15.9 16.78 19 12 19s-8.58-3.1-9.94-6.65z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <svg class="ui-eye-off" viewBox="0 0 24 24" width="19" height="19" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M10.73 5.08A10.4 10.4 0 0 1 12 5c4.78 0 8.58 3.1 9.94 6.65a1 1 0 0 1 0 .7 13.2 13.2 0 0 1-1.67 2.68"></path>
                <path d="M6.61 6.61A13.5 13.5 0 0 0 2.06 11.65a1 1 0 0 0 0 .7C3.42 15.9 7.22 19 12 19c1.34 0 2.6-.24 3.77-.66"></path>
                <path d="M10 10a3 3 0 0 0 4.13 4.13"></path>
                <line x1="3" y1="3" x2="21" y2="21"></line>
              </svg>
            </button>
          `,
          },

          { href: 'https://www.kulturosfera.com', label: 'Kulturosfera', position: 'right' },

          // Data ultimei publicări a SITE-ului. Pe edumat58 e tot un item de
          // tip `html` în navbar, iar data din el e rescrisă la fiecare
          // publicare de `update-deploy-date.js` (rulat de `predeploy`).
          // Data ultimei actualizări a FIECĂREI LECȚII e altceva și vine din
          // git, prin `showLastUpdateTime` de mai sus.
          {
            type: 'html',
            position: 'right',
            value: `
            <span class="nav-update" title="Ultima actualizare">
              <svg viewBox="0 0 24 24" width="13" height="13" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9"></circle>
                <polyline points="12 7 12 12 15.5 14"></polyline>
              </svg>
              <span class="nav-update-date">06.09.2026, 01:20</span>
            </span>
          `,
          },
        ],
      },
      footer: {
        style: 'light',
        // Grupurile lui edumat58: „Cursuri" cu clasele, „Platformă" cu paginile
        // generale. Acolo clasele se scriu „Clasa a V-a", deși în navbar sunt
        // „Curs V" — aceeași diferență se păstrează și aici.
        links: [
          {
            title: 'Cursuri',
            items: [
              { label: 'Clasa a VI-a', to: '/docs/category/curs-vi' },
              { label: 'Clasa a VII-a', to: '/docs/category/curs-vii' },
              { label: 'Clasa a VIII-a', to: '/docs/category/curs-viii' },
            ],
          },
          {
            title: 'Platformă',
            items: [
              { label: 'Acasă', to: '/' },
              { label: 'Despre', to: '/docs/despre' },
              { label: 'Kulturosfera', href: 'https://www.kulturosfera.com' },
              { label: 'edumat58', href: 'https://edumat58.github.io/curs/' },
            ],
          },
          {
            // Al treilea grup al lui edumat58. Adresele nu sunt inventate: ies
            // din `organizationName` + `projectName` declarate mai sus, aceleași
            // pe care le folosește și fluxul de publicare din
            // `.github/workflows/deploy-docusaurus.yml`.
            title: 'Comunitate',
            items: [
              { label: 'GitHub', href: 'https://github.com/edulab58/lab' },
              {
                label: 'Raportează o problemă',
                href: 'https://github.com/edulab58/lab/issues',
              },
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
