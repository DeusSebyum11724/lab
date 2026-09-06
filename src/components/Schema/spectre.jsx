import React from 'react';
import { Schema, Fir, Text, CULORI } from './index';

/**
 * CELE DOUĂ FIGURI DESENATE ALE CAPITOLULUI „SPECTRE LUMINOASE”.
 *
 * Restul figurilor capitolului au fost înlocuite cu decupaje din manual
 * (`static/img/manual/c06-*.png`, puse în pagină cu `<FiguraManual>`), fiindcă
 * autorul a cerut ca graficele să fie întocmai cele din carte. Aici au rămas
 * numai cele două figuri care NU există în manual și deci n-aveau ce decupa:
 * banda vizibilului și rețeaua.
 *
 * Culoarea NU e decor în capitolul ăsta: ea e chiar mărimea citită de pe axă.
 * De aceea culoarea fiecărei radiații se calculează din lungimea ei de undă.
 *
 * SISTEMUL DE COORDONATE. Banda spectrală ocupă un dreptunghi de la `x0` la
 * `x0 + w`, iar o lungime de undă se așază liniar între `min` și `max`.
 * Gradațiile axei se desenează sub bandă, la valorile date în `ticks`.
 */

const NEGRU = '#161a22';
const MIN = 390;
const MAX = 710;

/* Culoarea percepută a unei radiații, calculată din lungimea ei de undă.
   `viu` ridică pragul de luminozitate: o linie de emisie desenată pe fond negru
   trebuie să se vadă și la 400 nm, unde ochiul aproape nu mai distinge nimic. */
export function culoareLambda(nm, viu = false) {
  let r = 0;
  let g = 0;
  let b = 0;
  if (nm >= 380 && nm < 440) {
    r = -(nm - 440) / 60;
    b = 1;
  } else if (nm < 490) {
    g = (nm - 440) / 50;
    b = 1;
  } else if (nm < 510) {
    g = 1;
    b = -(nm - 510) / 20;
  } else if (nm < 580) {
    r = (nm - 510) / 70;
    g = 1;
  } else if (nm < 645) {
    r = 1;
    g = -(nm - 645) / 65;
  } else if (nm <= 800) {
    r = 1;
  }
  let f = 1;
  if (nm >= 380 && nm < 420) f = 0.3 + (0.7 * (nm - 380)) / 40;
  else if (nm > 700 && nm <= 800) f = 0.3 + (0.7 * (800 - nm)) / 100;
  else if (nm < 380) f = 0;
  if (viu) f = Math.max(f, 0.8);
  const q = (v) => Math.round(255 * Math.pow(Math.max(v, 0) * f, 0.8));
  return `rgb(${q(r)}, ${q(g)}, ${q(b)})`;
}

const poz = (nm, x0, w, min, max) => x0 + ((nm - min) / (max - min)) * w;

/* Săgeata de la capătul axei lungimilor de undă. */
function VarfAxa({ x, y, id }) {
  return (
    <g>
      <defs>
        <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={CULORI.fir} />
        </marker>
      </defs>
      <path d={`M ${x - 30} ${y} L ${x} ${y}`} stroke={CULORI.fir} strokeWidth={1.4} markerEnd={`url(#${id})`} fill="none" />
    </g>
  );
}

/** Axa lungimilor de undă, cu gradații și eticheta λ (nm). */
function AxaLambda({ x0, w, y, min = MIN, max = MAX, ticks = [400, 500, 600, 700], id, unitate = 'λ (nm)' }) {
  return (
    <g>
      <path d={`M ${x0} ${y} L ${x0 + w + 14} ${y}`} stroke={CULORI.fir} strokeWidth={1.4} fill="none" />
      <VarfAxa x={x0 + w + 44} y={y} id={id} />
      {ticks.map((t) => (
        <g key={t}>
          <path d={`M ${poz(t, x0, w, min, max)} ${y} L ${poz(t, x0, w, min, max)} ${y + 4}`} stroke={CULORI.fir} strokeWidth={1.2} />
          <Text x={poz(t, x0, w, min, max)} y={y + 16} ancora="middle" marime={11}>
            {t}
          </Text>
        </g>
      ))}
      <Text x={x0 + w + 18} y={y - 7} marime={11}>
        {unitate}
      </Text>
    </g>
  );
}

/** Bandă cu spectru continuu (curcubeu), desenată cu un degrade. */
function BandaContinua({ x0, y, w, h, id, min = MIN, max = MAX, de = 400, la = 700 }) {
  const opriri = [];
  for (let nm = de; nm <= la; nm += 10) {
    opriri.push(nm);
  }
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          {opriri.map((nm) => (
            <stop key={nm} offset={`${((nm - min) / (max - min)) * 100}%`} stopColor={culoareLambda(nm)} />
          ))}
        </linearGradient>
      </defs>
      <rect x={x0} y={y} width={w} height={h} fill={NEGRU} />
      <rect
        x={poz(de, x0, w, min, max)}
        y={y}
        width={poz(la, x0, w, min, max) - poz(de, x0, w, min, max)}
        height={h}
        fill={`url(#${id})`}
      />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  C8 — lungimea de undă și descompunerea luminii                      */
/* ------------------------------------------------------------------ */

/** Banda vizibilului, de la violet la roșu, cu capetele scrise. */
export function FigSpectrulVizibil() {
  return (
    <Schema
      vb="0 0 480 120"
      latime={470}
      eticheta="Banda luminii vizibile, de la violetul de 390 nm la roșul de 780 nm"
      legenda="Lumina vizibilă se întinde de la 390 nm (violet) la 780 nm (roșu)."
    >
      <BandaContinua x0={50} y={22} w={340} h={44} id="vizibil-grad" min={390} max={780} de={390} la={780} />
      <AxaLambda
        x0={50}
        w={340}
        y={76}
        min={390}
        max={780}
        ticks={[400, 500, 600, 700, 780]}
        id="ax-vizibil"
      />
      <Text x={58} y={16} marime={11} culoare={CULORI.slab}>
        violet
      </Text>
      <Text x={382} y={16} ancora="end" marime={11} culoare={CULORI.slab}>
        roșu
      </Text>
    </Schema>
  );
}

/* Becul-sursă, desenat mic. */
function Bulb({ x, y }) {
  return (
    <g>
      <circle cx={x} cy={y} r={11} fill="#f7d47a" stroke={CULORI.contur} strokeWidth={1.3} />
      <path d={`M ${x - 5} ${y + 10} L ${x + 5} ${y + 10} M ${x - 4} ${y + 14} L ${x + 4} ${y + 14}`} stroke={CULORI.contur} strokeWidth={1.3} />
    </g>
  );
}

/** Rețeaua: fante paralele, foarte apropiate. */
export function FigRetea() {
  const fante = [];
  for (let i = 0; i < 26; i += 1) fante.push(150 + i * 3.4);
  return (
    <Schema
      vb="0 0 460 140"
      latime={460}
      eticheta="Rețeaua de difracție: fante paralele, egal depărtate, foarte apropiate între ele"
      legenda="Rețeaua e formată din fante paralele, egal depărtate și foarte apropiate: de obicei câteva sute de fante pe milimetru."
    >
      <Bulb x={44} y={64} />
      <Fir d="M 62 62 L 142 62" />
      <rect x={146} y={22} width={96} height={80} fill="#e9eef4" stroke={CULORI.contur} strokeWidth={1.3} />
      {fante.map((x) => (
        <path key={x} d={`M ${x} 22 L ${x} 102`} stroke={CULORI.contur} strokeWidth={1} />
      ))}
      <Fir d="M 242 62 L 320 62" />
      <BandaContinua x0={322} y={24} w={24} h={76} id="retea-cont" min={400} max={700} de={400} la={700} />
      <Text x={194} y={118} ancora="middle" marime={10}>
        rețea
      </Text>
      <Text x={44} y={94} ancora="middle" marime={10}>
        lumină albă
      </Text>
      <Text x={382} y={66} ancora="middle" marime={10}>
        spectru
      </Text>
    </Schema>
  );
}
