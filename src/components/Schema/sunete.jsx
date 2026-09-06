import React from 'react';
import { Schema, Fir, Text, Simbol, CULORI } from './index';

/**
 * FIGURILE DESENATE ALE CAPITOLULUI „SEMNALE PERIODICE ȘI SUNETE”.
 *
 * Restul figurilor capitolului sunt acum DECUPAJE din manual, cu etichetele
 * românești puse peste ele (`FiguraManual`) — decupajul păstrează geometria
 * pixel cu pixel, ceea ce o redesenare nu poate garanta.
 *
 * Aici au rămas doar cele trei figuri care NU au corespondent în manual:
 * ecoul (cartea explică tehnica fără nicio ilustrație), soneria de sub
 * clopotul vidat și conducta de fontă (probe de laborator ale căror enunțuri
 * din carte sunt doar text). N-are ce decupa pentru ele, deci rămân desenate.
 */

/* Cerneala traseelor și a săgeților care poartă sens în figurile rămase. */
const TRASEU = 'var(--kl-vin)';

/** Vârf de săgeată, ca `path`, orientat după versorul (ux, uy). */
function varf(x, y, ux, uy, m) {
  const px = -uy;
  const py = ux;
  return (
    `M ${x} ${y} ` +
    `L ${x - ux * 2 * m + px * m} ${y - uy * 2 * m + py * m} ` +
    `L ${x - ux * 2 * m - px * m} ${y - uy * 2 * m - py * m} Z`
  );
}

/**
 * Săgeată dreaptă, cu vârfurile desenate ca triunghiuri.
 *
 * Nu folosește `marker`, fiindcă marcatorii SVG cer identificatori unici pe
 * toată pagina, iar o lecție pune uneori aceeași figură de două ori.
 */
export function Sageata({ x1, y1, x2, y2, dubla, culoare = CULORI.fir, grosime = 1.4, m = 4.5 }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const L = Math.hypot(dx, dy) || 1;
  const ux = dx / L;
  const uy = dy / L;
  return (
    <g>
      <path
        d={`M ${x1} ${y1} L ${x2} ${y2}`}
        stroke={culoare}
        strokeWidth={grosime}
        fill="none"
        strokeLinecap="round"
      />
      <path d={varf(x2, y2, ux, uy, m)} fill={culoare} />
      {dubla && <path d={varf(x1, y1, -ux, -uy, m)} fill={culoare} />}
    </g>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   C3 — VITEZA SUNETULUI ȘI ECOUL
   ══════════════════════════════════════════════════════════════════════════ */

/** Drumul dus-întors al undei până la obstacol și înapoi. */
export function FigEcou() {
  const hasuri = [];
  for (let i = 0; i < 9; i++) {
    hasuri.push(<line key={i} x1={392} y1={44 + i * 13} x2={406} y2={32 + i * 13} stroke={CULORI.slab} strokeWidth={1.2} />);
  }
  return (
    <Schema
      vb="0 0 460 210"
      latime={460}
      eticheta="Sursă de sunet în stânga, obstacol în dreapta; o săgeată merge spre obstacol, alta se întoarce"
      legenda="Între emisie și recepție, unda parcurge distanța de două ori: o dată dusul, o dată întorsul."
    >
      <rect x={40} y={92} width={34} height={40} rx={5} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.6} />
      <path d="M 74 100 L 96 84 L 96 140 L 74 124 Z" fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.6} />
      <Text x={57} y={158} ancora="middle" marime={12}>
        sursa
      </Text>

      <Fir d="M 390 34 L 390 168" grosime={2.2} />
      {hasuri}
      <Text x={388} y={186} ancora="end" marime={12}>
        obstacolul
      </Text>

      <Sageata x1={104} y1={70} x2={384} y2={70} culoare={TRASEU} grosime={1.6} />
      <Text x={244} y={62} ancora="middle" marime={12} culoare={TRASEU}>
        dusul
      </Text>
      <Sageata x1={384} y1={150} x2={104} y2={150} culoare={TRASEU} grosime={1.6} />
      <Text x={244} y={166} ancora="middle" marime={12} culoare={TRASEU}>
        întorsul
      </Text>

      <Sageata x1={57} y1={196} x2={390} y2={196} dubla grosime={1.2} m={4} />
      <Simbol x={223} y={192} marime={14}>
        d
      </Simbol>
    </Schema>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LP2 — SUNETUL ARE NEVOIE DE MATERIE
   ══════════════════════════════════════════════════════════════════════════ */

/** Soneria sub clopotul de sticlă din care se scoate aerul. */
export function FigClopotVidat() {
  return (
    <Schema
      vb="0 0 420 280"
      latime={420}
      eticheta="O sonerie electrică așezată sub un clopot de sticlă, legat printr-un tub la o pompă de vid"
      legenda="Soneria sună mai încet pe măsură ce pompa scoate aerul, iar când clopotul e aproape gol nu se mai aude nimic."
    >
      {/* clopotul */}
      <path
        d="M 110 206 L 110 100 Q 110 58 210 58 Q 310 58 310 100 L 310 206"
        fill="none"
        stroke={CULORI.contur}
        strokeWidth={1.8}
      />
      <Text x={318} y={86} marime={12}>
        clopot
      </Text>
      <Text x={318} y={102} marime={12}>
        de sticlă
      </Text>

      {/* soneria */}
      <path d="M 178 168 A 32 34 0 0 1 242 168 Z" fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.6} />
      <Fir d="M 172 168 L 248 168" grosime={1.6} />
      <Fir d="M 210 168 L 210 182" grosime={1.4} />
      <circle cx={210} cy={186} r={4} fill={CULORI.fir} />
      <Text x={210} y={152} ancora="middle" marime={12}>
        sonerie
      </Text>

      {/* placa și legăturile */}
      <rect x={92} y={206} width={236} height={14} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.6} />
      <Fir d="M 196 190 L 196 206 M 224 190 L 224 206" grosime={1.4} />
      <Fir d="M 150 220 L 150 250 L 96 250" grosime={1.5} />
      <Text x={92} y={254} ancora="end" marime={12}>
        spre pilă
      </Text>

      {/* tubul spre pompă */}
      <Fir d="M 328 213 L 358 213" grosime={1.6} />
      <rect x={358} y={196} width={54} height={34} rx={5} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.6} />
      <Text x={385} y={216} ancora="middle" marime={11}>
        pompă
      </Text>
      <Text x={385} y={248} ancora="middle" marime={11}>
        de vid
      </Text>

      {/* sunetul care iese, tot mai slab */}
      <path d="M 96 120 A 34 34 0 0 0 96 152" fill="none" stroke={CULORI.slab} strokeWidth={1.5} />
      <path d="M 82 112 A 48 48 0 0 0 82 160" fill="none" stroke={CULORI.slab} strokeWidth={1.5} />
    </Schema>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LP3 — VITEZA SUNETULUI
   ══════════════════════════════════════════════════════════════════════════ */

/** Conducta de fontă plină cu apă, lovită la distanța d de senzor. */
export function FigConductaFonta() {
  const valuri = [];
  for (let i = 0; i < 12; i++) {
    const x = 78 + i * 26;
    valuri.push(
      <path
        key={i}
        d={`M ${x} 104 q 6 -6 12 0 q 6 6 12 0`}
        fill="none"
        stroke={CULORI.slab}
        strokeWidth={1.2}
      />,
    );
  }
  return (
    <Schema
      vb="0 0 460 190"
      latime={460}
      eticheta="Conductă orizontală de fontă plină cu apă; în stânga un ciocan lovește conducta, în dreapta un senzor de presiune"
      legenda="Lovitura pleacă spre senzor pe două drumuri deodată: prin fontă și prin apă."
    >
      <rect x={50} y={80} width={356} height={44} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.7} />
      <Fir d="M 50 90 L 406 90 M 50 114 L 406 114" grosime={1.2} culoare={CULORI.slab} />
      {valuri}
      <Text x={62} y={72} marime={12}>
        fontă
      </Text>
      <Text x={200} y={144} ancora="middle" marime={12}>
        apă
      </Text>

      <Fir d="M 76 46 L 100 62" grosime={2.2} />
      <rect x={62} y={30} width={26} height={14} rx={3} transform="rotate(-30 75 37)" fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.4} />
      <Sageata x1={104} y1={64} x2={112} y2={76} grosime={1.4} m={3.6} />
      <Text x={54} y={24} marime={12}>
        lovitura de ciocan
      </Text>

      <rect x={382} y={54} width={44} height={24} rx={4} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.5} />
      <Fir d="M 404 78 L 404 88" grosime={1.4} />
      <Text x={404} y={46} ancora="middle" marime={11}>
        senzor
      </Text>

      <Sageata x1={112} y1={164} x2={404} y2={164} dubla grosime={1.2} m={4} />
      <Simbol x={258} y={160} marime={14}>
        d
      </Simbol>
    </Schema>
  );
}
