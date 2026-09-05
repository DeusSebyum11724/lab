import React from 'react';

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

/** Linia de brand Kulturosfera - cele patru culori oficiale. Portata neschimbata. */
export function KulturosferaLine({ width = 64 }) {
  return (
    <svg viewBox="0 0 177 17" width={width} aria-hidden="true">
      <rect x="0" y="6" width="43" height="5" fill="#003058" />
      <rect x="43" y="6" width="44" height="5" fill="#d23d2d" />
      <rect x="87" y="6" width="44" height="5" fill="#0197b0" />
      <rect x="131" y="6" width="46" height="5" fill="#545454" />
      {[
        { x: 0, c: '#003058' },
        { x: 43, c: '#d23d2d' },
        { x: 87, c: '#0197b0' },
        { x: 131, c: '#545454' },
      ].map((s) => (
        <rect key={s.x} x={s.x} y="0" width="17" height="17" rx="2.5" fill={s.c} />
      ))}
      <rect x="172" y="0" width="5" height="17" rx="1.5" fill="#545454" />
    </svg>
  );
}
