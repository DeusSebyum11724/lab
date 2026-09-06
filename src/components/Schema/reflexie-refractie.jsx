import React from 'react';
import { Schema, Text, Simbol, Nod, CULORI } from './index';

/**
 * FIGURILE CAPITOLULUI „REFLEXIA ȘI REFRACȚIA LUMINII”.
 *
 * Manualul-sursă e un PDF scanat, deci figurile nu se pot extrage: se refac în
 * cod. Simbolurile de circuit din `index.jsx` nu ajută la optică, așa că
 * primitivele proprii ale opticii (raza cu vârf de săgeată, arcul de unghi,
 * blocul de mediu transparent, discul gradat, semidiscul, prisma) sunt definite
 * aici și exportate de aici. `index.jsx` rămâne neatins.
 *
 * CULORILE POARTĂ INFORMAȚIE, ca și verdele/roșul din schemele de circuit:
 * raza incidentă e roșie, cea reflectată verde, cea refractată albastră —
 * exact convenția manualului. Ele nu se schimbă „ca să se potrivească”.
 *
 * UNGHIURILE se dau în grade, în convenția SVG: 0° = spre dreapta, 90° = în
 * jos, −90° = în sus. Toate figurile se construiesc în jurul punctului de
 * incidență, ca la tablă.
 */

export const COL = {
  incid: '#c0392b',
  reflect: '#1c7c4a',
  refract: '#2f5da8',
  alba: '#b08a00',
  rosu: '#c0392b',
  violet: '#7b3fa0',
  normala: 'var(--kl-ink3)',
  apa: '#d3e9f6',
  sticla: '#e2eef8',
  fund: '#efe0cb',
};

const GR = Math.PI / 180;

/** Punctul aflat la distanța `l` de (x, y), pe direcția `a` (grade). */
export function P(x, y, l, a) {
  return [x + l * Math.cos(a * GR), y + l * Math.sin(a * GR)];
}

/** Vârful de săgeată: triunghi plin cu vârful în (x, y), orientat pe `unghi`. */
function Varf({ x, y, unghi, culoare, marime = 7 }) {
  const [ax, ay] = P(x, y, marime, unghi + 150);
  const [bx, by] = P(x, y, marime, unghi - 150);
  return <path d={`M ${x} ${y} L ${ax} ${ay} L ${bx} ${by} Z`} fill={culoare} stroke="none" />;
}

/**
 * Raza de lumină: un segment cu săgeata pe mijloc.
 *
 * Săgeata stă pe mijloc, nu la capăt, fiindcă în optică un capăt de rază e
 * adesea chiar punctul de incidență — un vârf de săgeată acolo ar acoperi
 * tocmai locul unde se citește unghiul.
 */
export function Raza({ x1, y1, x2, y2, culoare = COL.incid, punctat, sageata = 'mijloc', grosime = 1.9 }) {
  const u = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  const sx = sageata === 'capat' ? x2 : (x1 + x2) / 2;
  const sy = sageata === 'capat' ? y2 : (y1 + y2) / 2;
  return (
    <g>
      <path
        d={`M ${x1} ${y1} L ${x2} ${y2}`}
        stroke={culoare}
        strokeWidth={grosime}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={punctat ? '6 4' : undefined}
      />
      {sageata !== 'fara' && <Varf x={sx} y={sy} unghi={u} culoare={culoare} />}
    </g>
  );
}

/** Linie punctată subțire: normala, prelungirile, axele. */
export function Punctata({ x1, y1, x2, y2, culoare = COL.normala }) {
  return (
    <path d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke={culoare} strokeWidth={1.2} fill="none" strokeDasharray="5 4" />
  );
}

/** Arcul care marchează un unghi, cu eticheta lui. */
export function Unghi({ x, y, r = 30, de, la, culoare = CULORI.text, eticheta, simbol, rEt = 15 }) {
  const [x1, y1] = P(x, y, r, de);
  const [x2, y2] = P(x, y, r, la);
  const mare = Math.abs(la - de) > 180 ? 1 : 0;
  const sens = la > de ? 1 : 0;
  const [ex, ey] = P(x, y, r + rEt, (de + la) / 2);
  return (
    <g>
      <path
        d={`M ${x1} ${y1} A ${r} ${r} 0 ${mare} ${sens} ${x2} ${y2}`}
        fill="none"
        stroke={culoare}
        strokeWidth={1.2}
      />
      {simbol && (
        <Simbol x={ex} y={ey + 4} culoare={culoare} marime={14}>
          {simbol}
        </Simbol>
      )}
      {eticheta && (
        <Text x={ex} y={ey + 4} ancora="middle" marime={12.5} culoare={culoare}>
          {eticheta}
        </Text>
      )}
    </g>
  );
}

/** Colțul mic care arată un unghi drept (incidența normală). */
export function UnghiDrept({ x, y, u1, u2, l = 9, culoare = CULORI.slab }) {
  const [ax, ay] = P(x, y, l, u1);
  const [bx, by] = P(x, y, l, u2);
  return (
    <path
      d={`M ${ax} ${ay} L ${ax + bx - x} ${ay + by - y} L ${bx} ${by}`}
      fill="none"
      stroke={culoare}
      strokeWidth={1.1}
    />
  );
}

/** Hașura de sub o suprafață opacă: oglinda, fundul bazinului. */
export function Hasura({ x1, y1, x2, y2, n = 18, l = 9, culoare = CULORI.slab }) {
  const dx = (x2 - x1) / n;
  const dy = (y2 - y1) / n;
  const linii = [];
  for (let k = 0; k < n; k += 1) {
    const a = x1 + dx * k;
    const b = y1 + dy * k;
    linii.push(<path key={k} d={`M ${a} ${b} L ${a - l * 0.55} ${b + l}`} stroke={culoare} strokeWidth={1} />);
  }
  return <g>{linii}</g>;
}

/** Discul gradat de pe masa de optică: raportorul pe care se citesc unghiurile. */
export function Gradatii({ x, y, r, de = 180, la = 360, pas = 10, culoare = CULORI.slab }) {
  const t = [];
  for (let a = de; a <= la + 0.001; a += pas) {
    const lung = Math.round(a) % 30 === 0 ? 11 : 6;
    const [x1, y1] = P(x, y, r, a);
    const [x2, y2] = P(x, y, r - lung, a);
    t.push(<path key={a} d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke={culoare} strokeWidth={1} />);
  }
  return <g>{t}</g>;
}

/** Bloc de mediu transparent. */
export function Mediu({ x, y, w, h, umplutura = COL.apa }) {
  return <rect x={x} y={y} width={w} height={h} fill={umplutura} stroke="none" />;
}

/* ------------------------------------------------------------------ */
/* C1 — propagarea rectilinie, raza, normala, reflexia                 */
/* ------------------------------------------------------------------ */

/** Fasciculul îngustat de două diafragme până devine, practic, o rază. */
export function FigFascicul() {
  const sx = 42;
  const sy = 95;
  const pe = (x, yRef, xRef) => sy + ((yRef - sy) * (x - sx)) / (xRef - sx);
  return (
    <Schema
      vb="0 0 470 200"
      latime={470}
      eticheta="Sursă de lumină, două diafragme și fasciculul îngust care rezultă"
      legenda="Cu diafragme destul de mici se obține un fascicul aproape asimilabil unui segment de dreaptă: raza de lumină."
    >
      <path
        d={`M ${sx} ${sy} L 135 40 L 135 150 Z`}
        fill="#f7e7b9"
        opacity="0.55"
        stroke="none"
      />
      <path
        d={`M 135 82 L 245 ${pe(245, 82, 135)} L 440 ${pe(440, 94, 135)} L 245 ${pe(245, 94, 135)} L 135 94 Z`}
        fill="#f7e7b9"
        opacity="0.75"
        stroke="none"
      />
      <circle cx={sx} cy={sy} r={13} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.6} />
      <path d="M 135 18 L 135 82 M 135 94 L 135 172" stroke={CULORI.contur} strokeWidth={4} strokeLinecap="round" />
      <path d="M 245 18 L 245 86 M 245 94 L 245 172" stroke={CULORI.contur} strokeWidth={4} strokeLinecap="round" />
      <Raza x1={250} y1={90} x2={438} y2={90} culoare={COL.incid} />
      <Text x={42} y={130} ancora="middle" marime={12}>sursă</Text>
      <Text x={135} y={188} ancora="middle" marime={12}>diafragmă</Text>
      <Text x={245} y={188} ancora="middle" marime={12}>diafragmă</Text>
      <Text x={378} y={72} ancora="middle" marime={12} culoare={COL.incid}>rază de lumină</Text>
    </Schema>
  );
}

/** Normala la o suprafață și unghiul de incidență măsurat față de ea. */
export function FigNormala() {
  const O = [215, 130];
  const [ax, ay] = P(O[0], O[1], 120, -130);
  return (
    <Schema
      vb="0 0 430 205"
      latime={430}
      eticheta="Normala la o suprafață și unghiul de incidență"
      legenda="Unghiul de incidență se măsoară întotdeauna față de normală, nu față de suprafață. Planul de incidență este planul figurii."
    >
      <path d="M 40 130 L 390 130" stroke={CULORI.contur} strokeWidth={2.4} />
      <Hasura x1={40} y1={130} x2={390} y2={130} n={24} />
      <Punctata x1={O[0]} y1={26} x2={O[0]} y2={176} />
      <Raza x1={ax} y1={ay} x2={O[0]} y2={O[1]} culoare={COL.incid} />
      <Unghi x={O[0]} y={O[1]} r={38} de={-130} la={-90} simbol="i_1" rEt={13} />
      <Nod x={O[0]} y={O[1]} />
      <Text x={O[0] + 10} y={O[1] + 18} marime={13}>I</Text>
      <Text x={O[0] + 8} y={34} marime={12} culoare={CULORI.ink2 || CULORI.text}>normala</Text>
      <Text x={122} y={44} ancora="end" marime={12} culoare={COL.incid}>rază incidentă</Text>
      <Text x={385} y={122} ancora="end" marime={12}>suprafață</Text>
      <UnghiDrept x={O[0]} y={O[1]} u1={0} u2={-90} />
    </Schema>
  );
}

/** Reflexia pe oglinda plană: unghiul de incidență egal cu unghiul de reflexie. */
export function FigReflexie() {
  const O = [215, 140];
  const [ax, ay] = P(O[0], O[1], 122, -130);
  const [bx, by] = P(O[0], O[1], 122, -50);
  return (
    <Schema
      vb="0 0 430 210"
      latime={430}
      eticheta="Rază incidentă și rază reflectată pe o oglindă plană"
      legenda="Raza incidentă și raza reflectată sunt în planul de incidență, iar unghiul de incidență este egal cu unghiul de reflexie."
    >
      <path d="M 40 140 L 390 140" stroke={CULORI.contur} strokeWidth={3} />
      <Hasura x1={40} y1={140} x2={390} y2={140} n={24} />
      <Punctata x1={O[0]} y1={28} x2={O[0]} y2={186} />
      <Raza x1={ax} y1={ay} x2={O[0]} y2={O[1]} culoare={COL.incid} />
      <Raza x1={O[0]} y1={O[1]} x2={bx} y2={by} culoare={COL.reflect} />
      <Unghi x={O[0]} y={O[1]} r={40} de={-130} la={-90} simbol="i_1" rEt={13} culoare={COL.incid} />
      <Unghi x={O[0]} y={O[1]} r={40} de={-90} la={-50} simbol="r" rEt={13} culoare={COL.reflect} />
      <Nod x={O[0]} y={O[1]} />
      <Text x={O[0] + 8} y={36} marime={12}>normala</Text>
      <Text x={126} y={44} ancora="end" marime={12} culoare={COL.incid}>rază incidentă</Text>
      <Text x={306} y={44} marime={12} culoare={COL.reflect}>rază reflectată</Text>
      <Text x={62} y={162} marime={12}>oglindă</Text>
    </Schema>
  );
}

/* ------------------------------------------------------------------ */
/* LP1 — montajul de verificare și oglinda la 45°                      */
/* ------------------------------------------------------------------ */

/** Montajul de laborator: oglindă plană pe diametrul unui disc gradat. */
export function FigMontajReflexie() {
  const O = [215, 165];
  const [ax, ay] = P(O[0], O[1], 118, -145);
  const [bx, by] = P(O[0], O[1], 118, -35);
  return (
    <Schema
      vb="0 0 430 215"
      latime={430}
      eticheta="Oglindă plană așezată pe diametrul unui disc gradat"
      legenda="Oglinda se așază pe diametrul discului gradat, iar raza se trimite spre centrul discului. Cele două unghiuri se citesc pe gradații, de o parte și de alta a normalei."
    >
      <path d={`M ${O[0] - 122} ${O[1]} A 122 122 0 0 1 ${O[0] + 122} ${O[1]}`} fill="none" stroke={CULORI.slab} strokeWidth={1.3} />
      <Gradatii x={O[0]} y={O[1]} r={122} de={180} la={360} pas={10} />
      <path d={`M ${O[0] - 128} ${O[1]} L ${O[0] + 128} ${O[1]}`} stroke={CULORI.contur} strokeWidth={3} />
      <Hasura x1={O[0] - 128} y1={O[1]} x2={O[0] + 128} y2={O[1]} n={20} />
      <Punctata x1={O[0]} y1={O[1] - 140} x2={O[0]} y2={O[1] + 22} />
      <Raza x1={ax} y1={ay} x2={O[0]} y2={O[1]} culoare={COL.incid} />
      <Raza x1={O[0]} y1={O[1]} x2={bx} y2={by} culoare={COL.reflect} />
      <Unghi x={O[0]} y={O[1]} r={44} de={-145} la={-90} simbol="i_1" rEt={13} culoare={COL.incid} />
      <Unghi x={O[0]} y={O[1]} r={44} de={-90} la={-35} simbol="r" rEt={13} culoare={COL.reflect} />
      <Nod x={O[0]} y={O[1]} />
      <Text x={O[0] + 8} y={34} marime={12}>normala</Text>
      <Text x={64} y={186} marime={12}>oglindă plană</Text>
      <Text x={366} y={186} ancora="end" marime={12}>disc gradat</Text>
    </Schema>
  );
}

/** Oglinda înclinată la 45° față de o rază orizontală. */
export function FigOglinda45({ curezolvare }) {
  const O = [230, 118];
  const [m1x, m1y] = P(O[0], O[1], 108, -45);
  const [m2x, m2y] = P(O[0], O[1], 78, 135);
  const [n1x, n1y] = P(O[0], O[1], 86, -135);
  const [n2x, n2y] = P(O[0], O[1], 62, 45);
  return (
    <Schema
      vb="0 0 430 205"
      latime={430}
      eticheta="Rază orizontală care cade pe o oglindă înclinată la 45 de grade"
      legenda={
        curezolvare
          ? 'Raza reflectată pleacă vertical: ea face un unghi drept cu raza incidentă.'
          : 'Raza incidentă este orizontală, iar oglinda face cu ea un unghi de 45°.'
      }
    >
      <path d={`M ${m2x} ${m2y} L ${m1x} ${m1y}`} stroke={CULORI.contur} strokeWidth={5} strokeLinecap="round" />
      <path d={`M ${m2x} ${m2y} L ${m1x} ${m1y}`} stroke={COL.sticla} strokeWidth={2} strokeLinecap="round" />
      <Punctata x1={n1x} y1={n1y} x2={n2x} y2={n2y} />
      <Raza x1={72} y1={O[1]} x2={O[0]} y2={O[1]} culoare={COL.incid} />
      <Unghi x={O[0]} y={O[1]} r={36} de={135} la={180} eticheta="45°" rEt={14} />
      {curezolvare && (
        <>
          <Raza x1={O[0]} y1={O[1]} x2={O[0]} y2={22} culoare={COL.reflect} />
          <Unghi x={O[0]} y={O[1]} r={54} de={180} la={270} eticheta="90°" rEt={16} culoare={COL.reflect} />
          <Text x={O[0] + 12} y={34} marime={12} culoare={COL.reflect}>rază reflectată</Text>
        </>
      )}
      <Nod x={O[0]} y={O[1]} />
      <Text x={96} y={O[1] - 12} marime={12} culoare={COL.incid}>rază incidentă</Text>
      <Text x={m1x + 6} y={m1y + 4} marime={12}>oglindă</Text>
      <Text x={n1x - 4} y={n1y - 4} ancora="end" marime={12}>normala</Text>
    </Schema>
  );
}

/* ------------------------------------------------------------------ */
/* LP2 — semidiscul                                                    */
/* ------------------------------------------------------------------ */

/** Semidiscul de plexiglas pe discul gradat: raza intră prin fața plană. */
export function FigSemidisc() {
  const O = [220, 140];
  const [ax, ay] = P(O[0], O[1], 132, 220);
  const [bx, by] = P(O[0], O[1], 105, 25);
  const [cx, cy] = P(O[0], O[1], 168, 25);
  return (
    <Schema
      vb="0 0 440 260"
      latime={440}
      eticheta="Semidisc de plexiglas așezat pe un disc gradat"
      legenda="Raza intră prin fața plană, exact în centrul discului. La ieșirea prin fața curbă ea are incidență normală, deci nu mai este deviată a doua oară."
    >
      <path d={`M ${O[0] - 118} ${O[1]} A 118 118 0 1 0 ${O[0] + 118} ${O[1]}`} fill="none" stroke={CULORI.slab} strokeWidth={1.2} />
      <path d={`M ${O[0] + 118} ${O[1]} A 118 118 0 1 0 ${O[0] - 118} ${O[1]}`} fill="none" stroke={CULORI.slab} strokeWidth={1.2} />
      <Gradatii x={O[0]} y={O[1]} r={118} de={0} la={350} pas={10} />
      <path
        d={`M ${O[0]} ${O[1] - 105} A 105 105 0 0 1 ${O[0]} ${O[1] + 105} Z`}
        fill={COL.sticla}
        stroke={CULORI.contur}
        strokeWidth={1.6}
      />
      <Punctata x1={O[0] - 112} y1={O[1]} x2={O[0] + 175} y2={O[1]} />
      <Raza x1={ax} y1={ay} x2={O[0]} y2={O[1]} culoare={COL.incid} />
      <Raza x1={O[0]} y1={O[1]} x2={bx} y2={by} culoare={COL.refract} />
      <Raza x1={bx} y1={by} x2={cx} y2={cy} culoare={COL.refract} sageata="capat" />
      <Unghi x={O[0]} y={O[1]} r={44} de={180} la={220} simbol="i_1" rEt={13} culoare={COL.incid} />
      <Unghi x={O[0]} y={O[1]} r={44} de={0} la={25} simbol="i_2" rEt={13} culoare={COL.refract} />
      <Nod x={O[0]} y={O[1]} />
      <Text x={112} y={46} ancora="middle" marime={12}>aer</Text>
      <Text x={264} y={O[1] - 66} ancora="middle" marime={12}>plexiglas</Text>
      <Text x={O[0] - 116} y={O[1] - 8} ancora="start" marime={12}>normala</Text>
    </Schema>
  );
}

/** Semidiscul folosit invers: lumina intră prin fața curbă și cade pe fața plană. */
export function FigSemidiscInvers({ total }) {
  const O = [250, 140];
  const unghiIn = total ? 55 : 30;
  const [ax, ay] = P(O[0], O[1], 132, 180 - unghiIn);
  const [rx, ry] = P(O[0], O[1], 132, unghiIn);
  const iesire = total ? 0 : 49;
  const [bx, by] = P(O[0], O[1], 140, -iesire);
  return (
    <Schema
      vb="0 0 440 265"
      latime={440}
      eticheta="Semidisc folosit invers: lumina cade pe fața plană dinspre interiorul plexiglasului"
      legenda={
        total
          ? 'Peste unghiul limită raza refractată dispare cu totul: rămâne numai raza reflectată, care devine strălucitoare.'
          : 'Sub unghiul limită, o parte din lumină iese în aer, depărtându-se de normală, iar o parte se întoarce în plexiglas.'
      }
    >
      <path
        d={`M ${O[0]} ${O[1] - 105} A 105 105 0 0 0 ${O[0]} ${O[1] + 105} Z`}
        fill={COL.sticla}
        stroke={CULORI.contur}
        strokeWidth={1.6}
      />
      <path d={`M ${O[0]} ${O[1] - 112} L ${O[0]} ${O[1] + 112}`} stroke={CULORI.contur} strokeWidth={2.2} />
      <Punctata x1={O[0] - 120} y1={O[1]} x2={O[0] + 150} y2={O[1]} />
      <Raza x1={ax} y1={ay} x2={O[0]} y2={O[1]} culoare={COL.incid} />
      <Raza x1={O[0]} y1={O[1]} x2={rx} y2={ry} culoare={COL.reflect} grosime={total ? 2.6 : 1.4} />
      {!total && <Raza x1={O[0]} y1={O[1]} x2={bx} y2={by} culoare={COL.refract} />}
      {total && <Text x={O[0] + 30} y={O[1] - 26} marime={12} culoare={COL.refract}>nicio rază refractată</Text>}
      <Unghi x={O[0]} y={O[1]} r={44} de={180 - unghiIn} la={180} simbol="i_1" rEt={13} culoare={COL.incid} />
      {!total && <Unghi x={O[0]} y={O[1]} r={44} de={-iesire} la={0} simbol="i_2" rEt={13} culoare={COL.refract} />}
      <Nod x={O[0]} y={O[1]} />
      <Text x={150} y={70} ancora="middle" marime={12}>plexiglas</Text>
      <Text x={352} y={70} ancora="middle" marime={12}>aer</Text>
    </Schema>
  );
}

/** Acvariul: sursă la fund, raza iese la suprafață. */
export function FigAcvariu({ curezolvare }) {
  const O = [255, 120];
  const [bx, by] = P(O[0], O[1], 118, -49);
  return (
    <Schema
      vb="0 0 430 285"
      latime={430}
      eticheta="Sursă luminoasă la fundul unui acvariu; raza iese prin suprafața apei"
      legenda="Sursa etanșă de la fundul acvariului trimite o rază spre suprafață, cu unghiul de incidență de 30°."
    >
      <Mediu x={62} y={120} w={296} h={135} umplutura={COL.apa} />
      <path d="M 62 62 L 62 255 L 358 255 L 358 62" fill="none" stroke={CULORI.contur} strokeWidth={2.2} />
      <path d="M 62 120 L 358 120" stroke={CULORI.contur} strokeWidth={2.2} />
      <Punctata x1={O[0]} y1={38} x2={O[0]} y2={196} />
      <Raza x1={185} y1={240} x2={O[0]} y2={O[1]} culoare={COL.incid} />
      {curezolvare && <Raza x1={O[0]} y1={O[1]} x2={bx} y2={by} culoare={COL.refract} />}
      <Unghi x={O[0]} y={O[1]} r={44} de={90} la={120} eticheta="30°" rEt={15} culoare={COL.incid} />
      {curezolvare && <Unghi x={O[0]} y={O[1]} r={44} de={-49} la={0} eticheta="41°" rEt={15} culoare={COL.refract} />}
      {curezolvare && <Unghi x={O[0]} y={O[1]} r={44} de={-90} la={-49} eticheta="" rEt={0} culoare={COL.refract} />}
      <ellipse cx={185} cy={243} rx={13} ry={7} fill="#e8c34a" stroke={CULORI.contur} strokeWidth={1.3} />
      <Nod x={O[0]} y={O[1]} />
      <Text x={185} y={272} ancora="middle" marime={12}>sursă luminoasă</Text>
      <Text x={92} y={100} marime={12}>aer</Text>
      <Text x={92} y={148} marime={12}>apă</Text>
    </Schema>
  );
}

/* ------------------------------------------------------------------ */
/* C3 — regula devierii                                                */
/* ------------------------------------------------------------------ */

/** Regula devierii: spre mediu mai dens, raza se apropie de normală. */
export function FigApropiereDeNormala() {
  const panou = (ox, jos, i1, i2, et) => {
    const O = [ox, 112];
    const [ax, ay] = P(O[0], O[1], 88, -90 - i1);
    const [bx, by] = P(O[0], O[1], 88, 90 - i2);
    return (
      <g>
        <Mediu x={ox - 100} y={jos ? 112 : 26} w={200} h={86} umplutura={COL.sticla} />
        <path d={`M ${ox - 100} 112 L ${ox + 100} 112`} stroke={CULORI.contur} strokeWidth={2} />
        <Punctata x1={O[0]} y1={26} x2={O[0]} y2={198} />
        <Raza x1={ax} y1={ay} x2={O[0]} y2={O[1]} culoare={COL.incid} />
        <Raza x1={O[0]} y1={O[1]} x2={bx} y2={by} culoare={COL.refract} />
        <Unghi x={O[0]} y={O[1]} r={30} de={-90 - i1} la={-90} simbol="i_1" rEt={12} culoare={COL.incid} />
        <Unghi x={O[0]} y={O[1]} r={30} de={90 - i2} la={90} simbol="i_2" rEt={12} culoare={COL.refract} />
        <Nod x={O[0]} y={O[1]} />
        <Text x={ox} y={222} ancora="middle" marime={12}>{et}</Text>
      </g>
    );
  };
  return (
    <Schema
      vb="0 0 470 235"
      latime={470}
      eticheta="Devierea razei la trecerea într-un mediu mai dens și într-unul mai puțin dens"
      legenda="Spre un mediu cu indice mai mare raza se apropie de normală; spre unul cu indice mai mic se depărtează de ea."
    >
      {panou(120, true, 50, 30, 'se apropie de normală')}
      {panou(350, false, 30, 50, 'se depărtează de normală')}
    </Schema>
  );
}

/* ------------------------------------------------------------------ */
/* LP3 — proiectorul din bazin                                         */
/* ------------------------------------------------------------------ */

/** Proiectorul de pe fundul bazinului: trei raze cu incidențe diferite. */
export function FigProiector({ curezolvare }) {
  const S = [170, 235];
  const sus = 110;
  const raza = (iApa, iAer, culoare) => {
    const dx = (S[1] - sus) * Math.tan(iApa * GR);
    const Ox = S[0] + dx;
    const [ex, ey] = P(Ox, sus, 100, -90 + iAer);
    return (
      <g>
        <Raza x1={S[0]} y1={S[1]} x2={Ox} y2={sus} culoare={culoare} />
        <Punctata x1={Ox} y1={sus - 76} x2={Ox} y2={sus + 46} />
        <Raza x1={Ox} y1={sus} x2={ex} y2={ey} culoare={culoare} />
        {iApa > 0 && (
          <Unghi x={Ox} y={sus} r={34} de={90} la={90 + iApa} eticheta={`${iApa}°`} rEt={14} culoare={culoare} />
        )}
        {iAer > 0 && (
          <Unghi x={Ox} y={sus} r={34} de={-90} la={-90 + iAer} eticheta={`${iAer}°`} rEt={14} culoare={culoare} />
        )}
      </g>
    );
  };
  return (
    <Schema
      vb="0 0 450 275"
      latime={450}
      eticheta="Proiector pe fundul unui bazin, cu raze care ies prin suprafața apei"
      legenda={
        curezolvare
          ? 'Razele de incidență 0, 20 și 40 de grade ies în aer cu 0, 27 și 59 de grade.'
          : 'Proiectorul de pe fundul bazinului trimite lumina spre suprafața apei, aflată la 0,80 m deasupra lui.'
      }
    >
      <Mediu x={62} y={sus} w={330} h={125} umplutura={COL.apa} />
      <path d="M 62 110 L 392 110" stroke={CULORI.contur} strokeWidth={2.4} />
      <path d="M 62 235 L 392 235" stroke={CULORI.contur} strokeWidth={2.4} />
      <Hasura x1={62} y1={235} x2={392} y2={235} n={22} />
      {curezolvare && raza(0, 0, COL.incid)}
      {curezolvare && raza(20, 27, COL.reflect)}
      {curezolvare && raza(40, 59, COL.violet)}
      <circle cx={S[0]} cy={S[1] - 5} r={7} fill="#e8c34a" stroke={CULORI.contur} strokeWidth={1.3} />
      <Simbol x={S[0] - 14} y={S[1] + 18} marime={14}>P</Simbol>
      <Punctata x1={86} y1={110} x2={86} y2={235} culoare={CULORI.slab} />
      <path d="M 86 114 L 86 231" stroke={CULORI.text} strokeWidth={1.2} />
      <Varf x={86} y={112} unghi={-90} culoare={CULORI.text} marime={5.5} />
      <Varf x={86} y={233} unghi={90} culoare={CULORI.text} marime={5.5} />
      <Simbol x={70} y={178} ancora="end" marime={13} dupa={' = 0,80 m'}>h</Simbol>
      <Text x={404} y={92} ancora="end" marime={12}>aer</Text>
      <Text x={404} y={132} ancora="end" marime={12}>apă</Text>
    </Schema>
  );
}

/* ------------------------------------------------------------------ */
/* C4 — reflexia totală, dispersia                                     */
/* ------------------------------------------------------------------ */

/** Trei incidențe crescătoare la dioptrul sticlă/aer: refracție, unghi limită, reflexie totală. */
export function FigReflexieTotala() {
  const y0 = 155;
  const grup = (ox, iIn, iOut, et, gros) => {
    const [ax, ay] = P(ox, y0, 82, 90 + iIn);
    const [rx, ry] = P(ox, y0, 74, 90 - iIn);
    const [bx, by] = iOut === null ? [null, null] : P(ox, y0, 92, -90 + iOut);
    return (
      <g>
        <Punctata x1={ox} y1={y0 - 96} x2={ox} y2={y0 + 62} />
        <Raza x1={ax} y1={ay} x2={ox} y2={y0} culoare={COL.incid} />
        <Raza x1={ox} y1={y0} x2={rx} y2={ry} culoare={COL.reflect} grosime={gros} />
        {iOut !== null && <Raza x1={ox} y1={y0} x2={bx} y2={by} culoare={COL.refract} />}
        <Unghi x={ox} y={y0} r={32} de={90} la={90 + iIn} eticheta={`${iIn}°`} rEt={14} culoare={COL.incid} />
        <Nod x={ox} y={y0} />
        <Text x={ox} y={248} ancora="middle" marime={12}>{et}</Text>
      </g>
    );
  };
  return (
    <Schema
      vb="0 0 470 262"
      latime={470}
      eticheta="Trei raze cu incidențe crescătoare pe dioptrul sticlă/aer"
      legenda="Pe măsură ce unghiul de incidență crește, raza refractată se apropie de suprafață și se stinge; peste unghiul limită rămâne numai raza reflectată."
    >
      <Mediu x={30} y={155} w={415} h={68} umplutura={COL.sticla} />
      <path d="M 30 155 L 445 155" stroke={CULORI.contur} strokeWidth={2.4} />
      {grup(105, 25, 40, 'raza se refractă', 1.2)}
      {grup(240, 42, 88, 'unghiul limită', 1.8)}
      {grup(370, 55, null, 'reflexie totală', 2.8)}
      <Text x={38} y={140} marime={12}>aer</Text>
      <Text x={38} y={178} marime={12}>sticlă</Text>
    </Schema>
  );
}

/** Prisma de sticlă descompune lumina albă în spectrul ei. */
export function FigDispersiePrisma() {
  const culori = ['#c0392b', '#d97b1d', '#c9a90f', '#2f9e4f', '#2f5da8', '#7b3fa0'];
  const iesire = [260, 118];
  const benzi = culori.map((c, k) => {
    const a = 8 + k * 4;
    const [ex, ey] = P(iesire[0], iesire[1], (392 - iesire[0]) / Math.cos(a * GR), a);
    return (
      <g key={c}>
        <Raza x1={iesire[0]} y1={iesire[1]} x2={ex} y2={ey} culoare={c} sageata="fara" grosime={1.7} />
        <rect x={394} y={ey - 6} width={26} height={12} fill={c} stroke="none" />
      </g>
    );
  });
  return (
    <Schema
      vb="0 0 460 240"
      latime={460}
      eticheta="Prismă de sticlă care descompune lumina albă într-un spectru colorat"
      legenda="Sticla e un mediu dispersiv: indicele ei nu e același pentru toate culorile, așa că prisma le desparte."
    >
      <path d="M 230 42 L 292 182 L 168 182 Z" fill={COL.sticla} stroke={CULORI.contur} strokeWidth={1.8} />
      <Raza x1={70} y1={112} x2={200} y2={112} culoare={CULORI.text} />
      <Raza x1={200} y1={112} x2={iesire[0]} y2={iesire[1]} culoare={CULORI.text} sageata="fara" />
      {benzi}
      <path d="M 394 118 L 394 196" stroke={CULORI.contur} strokeWidth={1.4} />
      <Text x={86} y={100} marime={12}>lumină albă</Text>
      <Text x={230} y={200} ancora="middle" marime={12}>prismă de sticlă</Text>
      <Text x={420} y={112} ancora="middle" marime={12}>spectru</Text>
    </Schema>
  );
}

const CURENT_OCHI = 'var(--kl-ink)';
