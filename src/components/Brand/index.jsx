import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * Wordmark-ul Edulab58.
 *
 * NU E TEXT CU UN FONT. Sunt litere desenate, generate de
 * `scripts/edulab-wordmark-gen.mjs` - copia generatorului lui edumat58, cu `l`
 * si `b` adaugate in aceeasi constructie. Prima mea versiune scria "edulab58"
 * cu Space Grotesk si autorul a spus imediat ca "nu are acelasi font ca in
 * edumat": pe edumat58 wordmarkul nu are font deloc.
 *
 * Steluțele Kulturosfera stau in bolul lui "a", ca la edumat58.
 * Mosteneste culoarea prin currentColor.
 */
export function EdulabWordmark({ width = 160, style }) {
  return (
    <span
      style={{ display: 'inline-flex', width, maxWidth: '100%', aspectRatio: '565 / 108', flexShrink: 0, ...style }}
      dangerouslySetInnerHTML={{ __html: '<svg viewBox="0 0 565 108" xmlns="http://www.w3.org/2000/svg" fill="currentColor" role="img" aria-label="edulab58">\n<g transform="translate(12 0)"><path fill-rule="nonzero" d="M 56.55 92.58 A 35 35 0 1 1 68.96 73.47 L 63.29 70.81 A 24 24 0 1 0 54.78 83.91 Z M 6 54 L 68 54 L 68 65 L 6 65 Z"/></g>\n<g transform="translate(96 0)"><path fill-rule="nonzero" d="M 0 65 A 35 35 0 1 1 70 65 A 35 35 0 1 1 0 65 Z M 16 65 A 24 24 0 1 0 64 65 A 24 24 0 1 0 16 65 Z M 57 6 L 70 6 L 70 100 L 57 100 Z"/></g>\n<g transform="translate(180 0)"><path fill-rule="nonzero" d="M 0 30 L 0 65 A 35 35 0 0 0 70 65 L 70 30 L 64 30 L 64 65 A 25.5 25.5 0 0 1 13 65 L 13 30 Z"/></g>\n<g transform="translate(264 0)"><path fill-rule="nonzero" d="M 0 6 L 13 6 L 13 100 L 0 100 Z"/></g>\n<g transform="translate(291 0)"><path fill-rule="nonzero" d="M 0 65 A 35 35 0 1 1 70 65 A 35 35 0 1 1 0 65 Z M 16 65 A 24 24 0 1 0 64 65 A 24 24 0 1 0 16 65 Z M 57 30 L 70 30 L 70 100 L 57 100 Z M 40 52 Q 40 67 43.18 63.82 L 55 67 Q 40 67 43.18 70.18 L 40 82 Q 40 67 36.82 70.18 L 25 67 Q 40 67 36.82 63.82 Z M 51 47 Q 51 53 52.27 51.73 L 57 53 Q 51 53 52.27 54.27 L 51 59 Q 51 53 49.73 54.27 L 45 53 Q 51 53 49.73 51.73 Z"/></g>\n<g transform="translate(375 0)"><path fill-rule="nonzero" d="M 0 65 A 35 35 0 1 1 70 65 A 35 35 0 1 1 0 65 Z M 6 65 A 24 24 0 1 0 54 65 A 24 24 0 1 0 6 65 Z M 0 6 L 13 6 L 13 100 L 0 100 Z"/></g>\n<g transform="translate(459 0)"><path fill-rule="nonzero" d="M 0 30 L 40 30 L 40 41 L 0 41 Z M 0 30 L 12 30 L 12 62 L 0 62 Z M 20 54.09 A 23 23 0 1 1 0.39 84.87 L 12.78 81.45 A 13 13 0 1 0 23.87 64.05 Z"/></g>\n<g transform="translate(517 0)"><path fill-rule="nonzero" d="M 4 47 A 17 17 0 1 1 38 47 A 17 17 0 1 1 4 47 Z M 15 47 A 9 9 0 1 0 33 47 A 9 9 0 1 0 15 47 Z M 0 80 A 21 21 0 1 1 42 80 A 21 21 0 1 1 0 80 Z M 13 80 A 12 12 0 1 0 37 80 A 12 12 0 1 0 13 80 Z"/></g>\n</svg>' }}
    />
  );
}

/**
 * Linia de brand Kulturosfera — patru pătrate colorate legate prin bare.
 *
 * RAPORTURILE SUNT CELE ALE ORIGINALULUI, extrase din `viewBox="0 0 177 17"`
 * al lui `KulturosferaLine` din edumat58, nu reconstruite din cap:
 *
 *   pătrat       latura 17/17 = 1.000 din înălțime,  colț rotunjit 2.5/17 = 0.147
 *   bara         grosime  5/17 = 0.294,  centrată pe verticală (y = 6/17)
 *   capăt drept  lățime   5/17 = 0.294,  ÎNĂLȚIME PLINĂ 17/17 = 1.000, rx 1.5/17
 *   poziții      0%, 24.29%, 49.15%, 74.01%, capătul la 97.18%
 *
 * Două greșeli ale versiunii mele anterioare, corectate aici: capătul din
 * dreapta era scund (0.56 din înălțime) în loc de plin, iar pătratele erau
 * așezate uniform la 0/25/50/75% în loc de pasul real, care NU e uniform —
 * primul interval e 43, următoarele două 44, ultimul 46.
 *
 * DE CE NU UN `viewBox` FIX. La lățimea cuvântului „KULTUROSFERA" raportul
 * 10.41:1 ar impune pătrate de două ori cât litera. Aici pătratele păstrează
 * mărimea și proporțiile originalului, iar barele dintre ele se lungesc.
 *
 * PRIMUL PĂTRAT E VERDE `#005340`. `Brand/index.jsx` din edumat58 are acolo
 * `#003058`, dar e depășit: sursa autoritară e `theme/index.ts` din edulink112
 * (`brand.green`, `brand.red`, `brand.turquoise`, `brand.gray`), confirmată de
 * `components/preloader/preloader.tsx`. În marcă NU există pătrat albastru.
 */
const MARCA = [
  { c: '#005340', x: 0 / 177 },
  { c: '#d23d2d', x: 43 / 177 },
  { c: '#0197b0', x: 87 / 177 },
  { c: '#545454', x: 131 / 177 },
];
const CAPAT = 172 / 177;

export function KulturosferaLine({ latime = '100%', marime = 11, style }) {
  const H = marime;
  return (
    <span
      style={{
        position: 'relative',
        display: 'block',
        width: latime,
        height: H,
        ...style,
      }}
    >
      {/* barele: pornesc din centrul pătratului și merg până la următorul */}
      {MARCA.map((s, i) => {
        const pana = i < MARCA.length - 1 ? MARCA[i + 1].x : CAPAT;
        return (
          <span
            key={`b-${s.c}`}
            style={{
              position: 'absolute',
              left: `${s.x * 100}%`,
              width: `${(pana - s.x) * 100}%`,
              top: (H - H * 0.294) / 2,
              height: H * 0.294,
              background: s.c,
            }}
          />
        );
      })}

      {/* pătratele, de mărime fixă — rămân pătrate la orice lățime */}
      {MARCA.map((s) => (
        <span
          key={s.c}
          style={{
            position: 'absolute',
            left: `${s.x * 100}%`,
            top: 0,
            width: H,
            height: H,
            background: s.c,
            borderRadius: H * 0.147,
          }}
        />
      ))}

      {/* capătul din dreapta: îngust, dar de înălțime PLINĂ */}
      <span
        style={{
          position: 'absolute',
          left: `${CAPAT * 100}%`,
          top: 0,
          width: H * 0.294,
          height: H,
          background: MARCA[3].c,
          borderRadius: H * 0.088,
        }}
      />
    </span>
  );
}

/**
 * Semnătura Kulturosfera — sfera ornamentală, numele și linia celor patru
 * culori, în lockup-ul orizontal al casei.
 *
 * PROPORȚIILE SUNT MĂSURATE, NU ALESE. Sursa e componenta reală care desenează
 * lockup-ul ăsta pe ecran: `components/community/arena-online/ArenaFx.tsx`
 * (edulink112), unde stă scris în clase Tailwind:
 *
 *   sfera          h-10        =  40px
 *   spațiu         gap-2.5     =  10px   → 0.25 din sferă
 *   numele         text-base   =  16px   → 0.40 din sferă, Inter 800, 0.2em
 *   linia sub nume mt-1.5      =   6px   → 0.15 din sferă
 *   linia, lățime  w-28        = 112px   → 2.80 din sferă
 *
 * DE CE NU E LINIA CÂT CUVÂNTUL. Asta a fost greșeala versiunii anterioare:
 * întinsesem linia pe toată lățimea numelui, cu `width: 100%`. În lockup-ul
 * adevărat linia e SCURTĂ — 112px sub un cuvânt de vreo 160px, adică vreo două
 * treimi din el. Nu e un accident de font, e desenul mărcii.
 *
 * Înălțimea liniei iese din raportul ei propriu, 177/17 = 10.41 (vezi
 * `KulturosferaLine`), nu dintr-un al doilea număr ales de mână.
 */
export function KulturosferaSignature({ culoare = '#ffffff', inaltime = 40, style }) {
  const S = inaltime;
  const latimeLinie = S * 2.8;

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: S * 0.25, ...style }}>
      <img
        src={useBaseUrl('/img/kulturosfera_logo_white.png')}
        alt=""
        aria-hidden="true"
        style={{ height: S, width: S, display: 'block', userSelect: 'none', flexShrink: 0 }}
      />

      <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <span
          style={{
            color: culoare,
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 800,
            fontSize: S * 0.4,
            letterSpacing: '0.2em',
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          KULTUROSFERA
        </span>
        <KulturosferaLine
          latime={latimeLinie}
          marime={latimeLinie / 10.41}
          style={{ marginTop: S * 0.15 }}
        />
      </span>
    </span>
  );
}
