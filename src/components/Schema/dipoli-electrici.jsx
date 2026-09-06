import React from 'react';
import {
  Schema, Fir, Nod, Rezistor, Pila, Ampermetru, Text, Simbol, CULORI,
} from './index';

/**
 * CE A MAI RĂMAS DESENAT DIN CAPITOLUL DIPOLILOR ELECTRICI (C7–C9, LP7–LP9).
 *
 * Figurile capitolului au fost la început redesenate în SVG. Redesenarea
 * păstrează topologia și valorile, dar nu unghiurile și proporțiile, iar
 * autorul a cerut fidelitate: „graficele trebuie făcute întocmai cu ce e în
 * carte; dacă nu, poți cropa imaginea direct". Așa că aproape toate au fost
 * înlocuite cu DECUPAJE din manual, afișate cu `<FiguraManual>` și cu
 * etichetele franțuzești acoperite de etichete românești.
 *
 * Aici au rămas trei figuri, fiindcă decupajul nu avea ce să decupeze:
 *
 * 1. `FigDreaptaPrinOrigine` — manualul enunță definiția conductorului ohmic
 *    („caracteristica lui este o dreaptă care trece prin origine”) fără să o
 *    și deseneze. Figura e făcută pentru lecție, nu copiată din carte.
 *
 * 2. `FigCaracteristicaExercitiuTip` — manualul PUNE o figură în rezolvarea
 *    exercițiului-tip, dar e greșită: arată punctul (62,5 mA ; 3,0 V) al
 *    probei 4, deși exercițiul-tip cere punctul M (20,0 mA ; 4,00 V), iar
 *    calculul de dedesubt dă 200 Ω, nu 48 Ω. Decupajul ar fi adus greșeala în
 *    lecție, așa că graficul rămâne desenat, cu punctul corect.
 *
 * 3. `FigStudiulCircuitului` — figura din manual arată un singur ochi: R în
 *    stânga, apoi R₂ și ampermetrul înseriate pe ramura de jos. Dar rezolvarea
 *    aceleiași probe scrie legea nodurilor, `i = i₁ + i₂`, și citește pe
 *    ampermetru `i₁ = 100 mA` — ceea ce cere DOUĂ ramuri în derivație, nu una.
 *    Figura tipărită se contrazice cu propria ei rezolvare, deci circuitul
 *    rămâne desenat, cu ramura care lipsește din carte.
 *
 * Uneltele de mai jos (axe, caroiaj, linii de citire) sunt cele de care au
 * nevoie figurile rămase; restul au plecat odată cu figurile lor.
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

/** Linie de construcție întreruptă (citirea unui punct pe grafic). */
function Punctata({ x1, y1, x2, y2 }) {
  return (
    <path
      d={`M ${x1} ${y1} L ${x2} ${y2}`}
      stroke={CULORI.slab}
      strokeWidth={1.1}
      strokeDasharray="5 4"
      fill="none"
    />
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

/* ══════════════════════════════════════════════════════════════════════════
   C8 — LEGEA LUI OHM
   ══════════════════════════════════════════════════════════════════════════ */

/** Caracteristica din exercițiul-tip: dreaptă prin origine și prin M(20,0 mA ; 4,00 V). */
export function FigCaracteristicaExercitiuTip() {
  const OX = 80;
  const OY = 160;
  return (
    <Schema
      vb="0 0 340 215"
      latime={340}
      eticheta="Dreaptă prin origine care trece prin punctul de coordonate 20 mA și 4 V"
      legenda="Caracteristica dipolului din exercițiul-tip: o dreaptă prin origine, prin punctul M."
    >
      <Axe ox={OX} oy={OY} st={30} dr={240} sus={120} jos={30} />
      <path d="M 58 175 L 290 20" fill="none" stroke={VIN} strokeWidth={2.2} strokeLinecap="round" />
      <Punctata x1={OX} y1={60} x2={230} y2={60} />
      <Punctata x1={230} y1={60} x2={230} y2={OY} />
      <circle cx={230} cy={60} r={3.6} fill={VIN} />
      <Text x={244} y={54} ancora="start" marime={13}>M</Text>
      <Text x={OX - 8} y={64} ancora="end" marime={12}>4,00</Text>
      <Text x={230} y={180} ancora="middle" marime={12}>20,0</Text>
      <Text x={OX - 8} y={176} ancora="end" marime={12}>0</Text>
      <Simbol x={OX + 12} y={48} ancora="start" dupa={" (V)"}>U</Simbol>
      <Simbol x={318} y={182} ancora="end" dupa={" (mA)"}>I</Simbol>
    </Schema>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LP8 — LEGEA LUI OHM ÎN CIRCUIT
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Circuitul probei 4: o ramură cu R, apoi două ramuri în derivație.
 *
 * Manualul desenează aici un singur ochi — R₂ și ampermetrul unul după altul
 * pe ramura de jos — dar rezolvarea lui cere un nod din care pleacă doi
 * curenți, i₁ prin ampermetru și i₂ prin R₂. Figura de mai jos e cea care se
 * potrivește cu rezolvarea.
 */
export function FigStudiulCircuitului() {
  return (
    <Schema
      vb="0 0 430 250"
      latime={430}
      eticheta="Generator, un conductor ohmic R pe ramura din stânga, apoi două ramuri în derivație, una cu R1 și ampermetru, alta cu R2"
      legenda="Se dau R₂ = 100 Ω, R = 50 Ω, U₂ = 4,0 V, iar ampermetrul arată 100 mA."
    >
      <Fir d="M 60 40 L 380 40" />
      <Pila x={220} y={40} />
      <Sageata x1={318} y1={62} x2={262} y2={62} />
      <Simbol x={290} y={55}>U_0</Simbol>

      <Fir d="M 60 40 L 60 195" />
      <Rezistor x={60} y={85} vertical />
      <Simbol x={38} y={89}>R</Simbol>
      <Sageata x1={60} y1={44} x2={60} y2={60} />
      <Simbol x={47} y={56}>I</Simbol>
      <Sageata x1={95} y1={110} x2={95} y2={62} />
      <Simbol x={108} y={89}>U</Simbol>

      <Fir d="M 60 120 L 380 120" />
      <Rezistor x={160} y={120} />
      <Simbol x={160} y={106}>R_1</Simbol>
      <Ampermetru x={285} y={120} r={16} borne="A-COM" />
      <Sageata x1={95} y1={120} x2={117} y2={120} />
      <Simbol x={106} y={110}>I_1</Simbol>
      <Sageata x1={188} y1={146} x2={132} y2={146} />
      <Simbol x={160} y={162}>U_1</Simbol>

      <Fir d="M 60 195 L 380 195" />
      <Rezistor x={160} y={195} />
      <Simbol x={160} y={181}>R_2</Simbol>
      <Sageata x1={95} y1={195} x2={117} y2={195} />
      <Simbol x={106} y={185}>I_2</Simbol>
      <Sageata x1={188} y1={221} x2={132} y2={221} />
      <Simbol x={160} y={237}>U_2</Simbol>

      <Fir d="M 380 40 L 380 195" />
      <Nod x={60} y={120} />
      <Nod x={380} y={120} />
    </Schema>
  );
}
