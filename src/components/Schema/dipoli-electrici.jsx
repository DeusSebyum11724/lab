import React from 'react';
import { Schema, Text, Simbol, CULORI } from './index';

/**
 * CE A MAI RĂMAS DESENAT DIN CAPITOLUL DIPOLILOR ELECTRICI (C7–C9, LP7–LP9).
 *
 * Figurile capitolului au fost la început redesenate în SVG. Redesenarea
 * păstrează topologia și valorile, dar nu unghiurile și proporțiile, iar
 * autorul a cerut fidelitate: „graficele trebuie făcute întocmai cu ce e în
 * carte; dacă nu, poți cropa imaginea direct". Așa că toate figurile care au
 * un corespondent tipărit au fost înlocuite cu DECUPAJE din manual, afișate cu
 * `<FiguraManual>`.
 *
 * A rămas o singură figură desenată, fiindcă decupajul nu avea ce să decupeze:
 *
 * `FigDreaptaPrinOrigine` — paragraful 4 al cursului, „Le conducteur ohmique",
 * începe în josul paginii 30 a manualului și cuprinde numai Définition 2:
 * „Un conducteur ohmique est un dipôle dont la caractéristique est une droite
 * passant par l'origine." Pagina 31 continuă direct cu propoziția „La tension
 * U aux bornes de la résistance est donc proportionnelle à l'intensité I" și
 * cu caseta À RETENIR a legii lui Ohm; singurele desene de pe pagina 31 sunt
 * cele două convenții de orientare (receptor și generator), deja folosite ca
 * `c03-conventie.png`. Manualul enunță deci definiția fără să o și deseneze,
 * iar graficul de mai jos e făcut pentru lecție.
 *
 * Uneltele de mai jos (axe, caroiaj) sunt cele de care are nevoie figura
 * rămasă; restul au plecat odată cu figurile lor.
 */

const VIN = 'var(--kl-vin)';
const LINIE = 'var(--kl-line)';

/* ══════════════════════════════════════════════════════════════════════════
   UNELTE PROPRII
   ══════════════════════════════════════════════════════════════════════════ */

/** Vârf de săgeată plin, cu ascuțișul în (x, y), orientat după unghi (grade). */
function Varf({ x, y, unghi, culoare = CULORI.fir, marime = 8 }) {
  const r = (unghi * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  const p = (dx, dy) => `${x + dx * c - dy * s} ${y + dx * s + dy * c}`;
  return (
    <path
      d={`M ${p(0, 0)} L ${p(-marime, -marime * 0.42)} L ${p(-marime, marime * 0.42)} Z`}
      fill={culoare}
    />
  );
}

/** Segment cu vârf de săgeată la capătul al doilea. */
function Sageata({ x1, y1, x2, y2, culoare = CULORI.fir, grosime = 1.5, punctat }) {
  const unghi = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return (
    <g>
      <path
        d={`M ${x1} ${y1} L ${x2} ${y2}`}
        stroke={culoare}
        strokeWidth={grosime}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={punctat ? '5 4' : undefined}
      />
      <Varf x={x2} y={y2} unghi={unghi} culoare={culoare} />
    </g>
  );
}

/** Caroiajul hârtiei milimetrice, între două colțuri date. */
function GrilaXY({ st, sus, dr, jos, pasX = 20, pasY = 20 }) {
  const l = [];
  for (let x = st; x <= dr + 0.01; x += pasX) {
    l.push(<path key={`v${Math.round(x * 10)}`} d={`M ${x} ${sus} L ${x} ${jos}`} stroke={LINIE} strokeWidth={0.7} />);
  }
  for (let y = sus; y <= jos + 0.01; y += pasY) {
    l.push(<path key={`h${Math.round(y * 10)}`} d={`M ${st} ${y} L ${dr} ${y}`} stroke={LINIE} strokeWidth={0.7} />);
  }
  return <g>{l}</g>;
}

/** Cele două axe, cu originea în (ox, oy). */
function Axe({ ox, oy, st = 0, dr = 200, sus = 150, jos = 0 }) {
  return (
    <g>
      <Sageata x1={ox - st} y1={oy} x2={ox + dr} y2={oy} grosime={1.4} />
      <Sageata x1={ox} y1={oy + jos} x2={ox} y2={oy - sus} grosime={1.4} />
    </g>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   C7 — DIPOLUL ELECTRIC
   ══════════════════════════════════════════════════════════════════════════ */

/** Caracteristica unui conductor ohmic: dreaptă care trece prin origine. */
export function FigDreaptaPrinOrigine() {
  const OX = 110;
  const OY = 145;
  return (
    <Schema
      vb="0 0 300 195"
      latime={300}
      eticheta="O dreaptă care trece prin originea axelor, caracteristica unui conductor ohmic"
      legenda="Caracteristica unui conductor ohmic este o dreaptă care trece prin origine."
    >
      <GrilaXY st={62} sus={38} dr={272} jos={178} pasX={13} pasY={13} />
      <Axe ox={OX} oy={OY} st={48} dr={165} sus={110} jos={35} />
      <path d="M 72 173 L 258 33" fill="none" stroke={VIN} strokeWidth={2.2} strokeLinecap="round" />
      <Text x={OX - 8} y={160} ancora="end" marime={12}>0</Text>
      <Simbol x={OX + 12} y={44} ancora="start" dupa={" (V)"}>U</Simbol>
      <Simbol x={272} y={164} ancora="end" dupa={" (A)"}>I</Simbol>
    </Schema>
  );
}
