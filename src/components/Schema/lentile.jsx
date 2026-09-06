import React from 'react';
import { Schema, Fir, Text, CULORI } from './index';

/**
 * FIGURILE CAPITOLULUI „LENTILE SUBȚIRI CONVERGENTE”.
 *
 * Figurile care există în manual NU mai sunt aici: ele au fost decupate din
 * pagina scanată și se afișează cu `FiguraManual`, cu etichetele românești
 * puse peste cuvintele franțuzești. Așa geometria e întocmai cea din carte,
 * lucru pe care redesenarea nu-l putea garanta.
 *
 * Aici rămân doar figurile care NU au corespondent în manual: montajele de
 * laborator scrise pentru lecțiile de lucru practic (măsurarea distanței
 * focale, bancul optic cu ecran), șablonul de hârtie milimetrică și
 * ilustrația triunghiurilor asemenea din secțiunea despre mărire. Ele n-au
 * ce decupa, deci se desenează în cod.
 *
 * Simbolurile de circuit din `index.jsx` nu ajută la optică, așa că fișierul
 * își aduce propriile primitive — lentila (săgeata dublă), axa optică
 * punctată, focarul, raza cu vârf pe mijloc, hârtia milimetrică. Ele rămân
 * aici, nu în `index.jsx`, ca să nu încarce trusa comună cu piese folosite de
 * un singur capitol.
 *
 * CULORILE RAZELOR POARTĂ INFORMAȚIE, exact ca în manual, și de aceea nu se
 * schimbă: roșu = raza paralelă cu axa optică (iese prin focarul imagine),
 * albastru = raza prin centrul optic (nedeviată), verde = raza prin focarul
 * obiect (iese paralelă cu axa). Elevul le urmărește după culoare de la o
 * figură la alta.
 *
 * COORDONATELE. Fiecare figură își alege `viewBox`-ul ei. Acolo unde manualul
 * dă montajul „la scara 1:1”, desenul păstrează scara: 26 de unități = 1 cm,
 * iar hârtia milimetrică din spate are pătratul mare tot de 26. Așa, distanța
 * focală de 2 cm chiar măsoară două pătrate, iar elevul poate verifica pe
 * figură ce i se cere să măsoare.
 */

const R_ROSU = '#c0392b';
const R_ALBASTRU = '#1f6fb2';
const STICLA = CULORI.umplutura;

/** Un centimetru, în unitățile figurilor desenate la scară. */
const CM = 26;

/* ------------------------------------------------------------------ */
/*  PRIMITIVE                                                          */
/* ------------------------------------------------------------------ */

/**
 * Vârful de săgeată, desenat ca triunghi plin.
 *
 * E desenat, nu pus cu `marker`, fiindcă marker-ele cer identificatori unici
 * în tot documentul: două figuri pe aceeași pagină ar ajunge să folosească
 * același vârf, iar culoarea celei de-a doua ar sări la culoarea primei.
 */
function Varf({ x, y, unghi = 0, marime = 7.5, culoare = CULORI.fir }) {
  const r = (unghi * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  const p = (dx, dy) => `${x + dx * c - dy * s} ${y + dx * s + dy * c}`;
  return (
    <path
      d={`M ${p(0, 0)} L ${p(-marime, marime * 0.44)} L ${p(-marime, -marime * 0.44)} Z`}
      fill={culoare}
    />
  );
}

/** Segment de rază, cu vârf opțional pus la fracțiunea `varf` din lungime. */
function Segment({ x1, y1, x2, y2, culoare = CULORI.fir, varf, punctat, grosime = 1.5 }) {
  const unghi = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  const t = typeof varf === 'number' ? varf : 0.55;
  return (
    <g>
      <Fir d={`M ${x1} ${y1} L ${x2} ${y2}`} culoare={culoare} punctat={punctat} grosime={grosime} />
      {varf && (
        <Varf x={x1 + (x2 - x1) * t} y={y1 + (y2 - y1) * t} unghi={unghi} culoare={culoare} marime={7} />
      )}
    </g>
  );
}

/** Axa optică: linie-punct, ca în manual. */
function Axa({ x1, x2, y, culoare = CULORI.fir }) {
  return (
    <path
      d={`M ${x1} ${y} L ${x2} ${y}`}
      stroke={culoare}
      strokeWidth={1.4}
      fill="none"
      strokeDasharray="13 5 2 5"
    />
  );
}

/** Lentila subțire convergentă: săgeata dublă. */
function Lentila({ x, y1, y2, culoare = CULORI.fir }) {
  return (
    <g>
      <Fir d={`M ${x} ${y1} L ${x} ${y2}`} culoare={culoare} grosime={1.8} />
      <Varf x={x} y={y1} unghi={-90} culoare={culoare} marime={9} />
      <Varf x={x} y={y2} unghi={90} culoare={culoare} marime={9} />
    </g>
  );
}

/** Focarul: liniuță pe axă plus numele lui. */
function Focar({ x, y, eticheta, sus }) {
  return (
    <g>
      <Fir d={`M ${x} ${y - 7} L ${x} ${y + 7}`} grosime={2} />
      <Punct x={x} y={sus ? y - 13 : y + 21}>{eticheta}</Punct>
    </g>
  );
}

/** Numele unui punct geometric: drept, cu serife, ca în manual. */
function Punct({ x, y, children, ancora = 'middle', marime = 14, culoare = CULORI.text }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={ancora}
      fontSize={marime}
      fill={culoare}
      fontFamily="'Times New Roman', Times, serif"
    >
      {children}
    </text>
  );
}

/** Săgeata care reprezintă obiectul sau imaginea, ridicată de pe axă. */
function SageataObiect({ x, yAxa, yVarf, culoare = CULORI.fir }) {
  return (
    <g>
      <Fir d={`M ${x} ${yAxa} L ${x} ${yVarf}`} culoare={culoare} grosime={1.8} />
      <Varf x={x} y={yVarf} unghi={yVarf < yAxa ? -90 : 90} culoare={culoare} marime={8} />
    </g>
  );
}

/** Hârtia milimetrică din spatele figurilor desenate la scară. */
function Grila({ x, y, w, h, pas = CM, sub = 5 }) {
  const p = pas / sub;
  const nx = Math.round(w / p);
  const ny = Math.round(h / p);
  const linii = [];
  for (let i = 0; i <= nx; i++) {
    const mare = i % sub === 0;
    linii.push(
      <line
        key={`v${i}`}
        x1={x + i * p}
        y1={y}
        x2={x + i * p}
        y2={y + h}
        stroke={CULORI.slab}
        strokeWidth={mare ? 0.9 : 0.5}
        opacity={mare ? 0.45 : 0.2}
      />
    );
  }
  for (let j = 0; j <= ny; j++) {
    const mare = j % sub === 0;
    linii.push(
      <line
        key={`h${j}`}
        x1={x}
        y1={y + j * p}
        x2={x + w}
        y2={y + j * p}
        stroke={CULORI.slab}
        strokeWidth={mare ? 0.9 : 0.5}
        opacity={mare ? 0.45 : 0.2}
      />
    );
  }
  return <g>{linii}</g>;
}

/** Cotă cu două vârfuri, pentru distanțe măsurate pe figură. */
function Cota({ x1, x2, y, eticheta, culoare = CULORI.fir }) {
  return (
    <g>
      <Fir d={`M ${x1} ${y} L ${x2} ${y}`} culoare={culoare} grosime={1.2} />
      <Varf x={x1} y={y} unghi={180} culoare={culoare} marime={6} />
      <Varf x={x2} y={y} unghi={0} culoare={culoare} marime={6} />
      <Punct x={(x1 + x2) / 2} y={y - 7}>{eticheta}</Punct>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  GEOMETRIA COMUNĂ A CONSTRUCȚIILOR                                  */
/*  O = 250, axa la y = 140, f = 70, B = (60, 80),                      */
/*  imaginea iese exact în B′ = (361, 175).                             */
/* ------------------------------------------------------------------ */

const G = { O: 250, y: 140, F: 180, F2: 320, xB: 60, yB: 80, xB2: 361, yB2: 175, sus: 45, jos: 235 };

function CadruConstructie({ children }) {
  return (
    <>
      <Axa x1={20} x2={440} y={G.y} />
      {children}
      <Lentila x={G.O} y1={G.sus} y2={G.jos} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  C7 — MĂRIREA ȘI MODELUL OCHIULUI                                   */
/* ------------------------------------------------------------------ */

/** Triunghiurile asemenea din care iese mărirea. */
export function FigMarireThales() {
  return (
    <Schema
      vb="0 0 460 260"
      latime={460}
      eticheta="Triunghiurile OAB și OA prim B prim, hașurate, sunt asemenea"
      legenda="Figura 16 — Raza care trece prin O face din OAB și OA′B′ două triunghiuri asemenea."
    >
      <polygon
        points={`${G.xB},${G.y} ${G.xB},${G.yB} ${G.O},${G.y}`}
        fill={STICLA}
        opacity={0.55}
      />
      <polygon
        points={`${G.O},${G.y} ${G.xB2},${G.yB2} ${G.xB2},${G.y}`}
        fill={STICLA}
        opacity={0.55}
      />
      <CadruConstructie>
        <Segment x1={G.xB} y1={G.yB} x2={G.O} y2={G.y} culoare={R_ALBASTRU} varf={0.5} />
        <Segment x1={G.O} y1={G.y} x2={G.xB2} y2={G.yB2} culoare={R_ALBASTRU} varf={0.55} />
      </CadruConstructie>
      <SageataObiect x={G.xB} yAxa={G.y} yVarf={G.yB} />
      <SageataObiect x={G.xB2} yAxa={G.y} yVarf={G.yB2} />
      <Punct x={G.xB - 8} y={G.yB + 4} ancora="end">B</Punct>
      <Punct x={G.xB - 8} y={G.y + 20} ancora="end">A</Punct>
      <Punct x={G.xB2 + 4} y={G.y - 10} ancora="start">A′</Punct>
      <Punct x={G.xB2 + 9} y={G.yB2 + 14} ancora="start">B′</Punct>
      <Punct x={G.O - 6} y={G.y - 9} ancora="end">O</Punct>
    </Schema>
  );
}

/* ------------------------------------------------------------------ */
/*  LP5 — RECUNOAȘTEREA LENTILELOR ȘI DISTANȚA FOCALĂ                  */
/* ------------------------------------------------------------------ */

/** Montajul de măsurare a distanței focale cu o sursă îndepărtată. */
export function FigDistantaFocala() {
  const O = 200;
  const y = 110;
  const E = 330;
  const intrari = [60, 85, 135, 160];
  return (
    <Schema
      vb="0 0 460 215"
      latime={450}
      eticheta="Lumina unei surse foarte îndepărtate ajunge paralelă la lentilă și se strânge într-un punct pe un ecran"
      legenda="Lumina unei surse foarte îndepărtate ajunge la lentilă ca fascicul paralel și se strânge într-un punct aflat la distanța focală."
    >
      <Axa x1={20} x2={430} y={y} />
      {intrari.map((iy) => (
        <g key={iy}>
          <Segment x1={30} y1={iy} x2={O} y2={iy} culoare={R_ROSU} varf={0.6} />
          <Segment x1={O} y1={iy} x2={E} y2={y} culoare={R_ROSU} varf={0.7} />
        </g>
      ))}
      <Lentila x={O} y1={35} y2={185} />
      <Fir d={`M ${E} 45 L ${E} 175`} culoare={R_ALBASTRU} grosime={2.6} />
      <circle cx={E} cy={y} r={4.5} fill={R_ROSU} />
      <Text x={30} y={26} marime={11} culoare={CULORI.slab}>lumină de la o sursă foarte îndepărtată</Text>
      <Text x={E + 8} y={45} marime={11}>ecran</Text>
      <Cota x1={O} x2={E} y={202} eticheta="f" />
    </Schema>
  );
}

/* ------------------------------------------------------------------ */
/*  LP6 — CONSTRUCȚIA GRAFICĂ                                          */
/* ------------------------------------------------------------------ */

/** Șablonul gol pe care elevul își face construcțiile. */
export function FigSablonConstructie() {
  const y = 105;
  const O = 228;
  return (
    <Schema
      vb="0 0 410 215"
      latime={410}
      eticheta="Axă optică, lentilă și cele două focare, desenate pe hârtie milimetrică, fără obiect"
      legenda="Șablonul de lucru: pătratul mare al hârtiei are latura de 1 cm, iar focarele sunt la 2 cm de lentilă."
    >
      <Grila x={20} y={27} w={364} h={156} />
      <Axa x1={24} x2={390} y={y} />
      <Lentila x={O} y1={33} y2={177} />
      <Focar x={O - 52} y={y} eticheta="F" />
      <Focar x={O + 52} y={y} eticheta="F′" />
      <Punct x={O - 7} y={y - 8} ancora="end">O</Punct>
    </Schema>
  );
}

/* ------------------------------------------------------------------ */
/*  LP7 — MĂRIREA                                                      */
/* ------------------------------------------------------------------ */

/** Montajul de laborator: obiect luminos, lentilă, ecran. */
export function FigMontajEcran() {
  const y = 128;
  return (
    <Schema
      vb="0 0 470 220"
      latime={460}
      eticheta="Bancul optic: obiectul luminos, lentila pe suport și ecranul pe care se prinde imaginea răsturnată"
      legenda="Montajul de laborator: obiectul luminos, lentila și ecranul, așezate pe același banc optic."
    >
      <Fir d="M 30 200 L 440 200" grosime={2.4} />
      <Axa x1={40} x2={430} y={y} />
      <SageataObiect x={90} yAxa={y} yVarf={y - 46} />
      <Fir d="M 90 128 L 90 200" grosime={1.2} culoare={CULORI.slab} />
      <Lentila x={210} y1={y - 66} y2={y + 66} />
      <Fir d="M 210 194 L 210 200" grosime={1.2} culoare={CULORI.slab} />
      <Fir d="M 370 55 L 370 195" culoare={R_ALBASTRU} grosime={2.6} />
      <SageataObiect x={370} yAxa={y} yVarf={y + 30} culoare={R_ROSU} />
      <Segment x1={90} y1={y - 46} x2={210} y2={y - 46} culoare={R_ROSU} varf={0.6} />
      <Segment x1={210} y1={y - 46} x2={370} y2={y + 30} culoare={R_ROSU} varf={0.6} />
      <Segment x1={90} y1={y - 46} x2={210} y2={y} culoare={R_ALBASTRU} varf={0.55} />
      <Segment x1={210} y1={y} x2={370} y2={y + 30} culoare={R_ALBASTRU} varf={0.55} />
      <Punct x={82} y={y - 50} ancora="end">B</Punct>
      <Punct x={82} y={y + 16} ancora="end">A</Punct>
      <Punct x={204} y={y - 8} ancora="end">O</Punct>
      <Punct x={378} y={y - 6} ancora="start">A′</Punct>
      <Punct x={378} y={y + 40} ancora="start">B′</Punct>
      <Text x={90} y={30} ancora="middle" marime={11}>obiect luminos</Text>
      <Text x={210} y={30} ancora="middle" marime={11}>lentilă</Text>
      <Text x={370} y={40} ancora="middle" marime={11}>ecran</Text>
    </Schema>
  );
}
