import React from 'react';
import { Schema, Fir, Text, Simbol, CULORI } from './index';

/**
 * FIGURILE LECȚIILOR DESPRE INTERACȚIUNEA GRAVITAȚIONALĂ.
 *
 * Manualul-sursă e un PDF scanat, deci figurile lui nu se pot extrage — se
 * redesenează în cod. Ce se păstrează intact e informația figurii: cine atrage
 * pe cine, în ce sens arată fiecare săgeată, ce distanțe și ce valori sunt
 * date. Ce s-a schimbat e doar așezarea în pagină, ca figura să încapă pe un
 * ecran de telefon.
 *
 * Aici nu e vorba de scheme de circuit, ci de corpuri și de forțe, deci
 * primitivele din `index.jsx` nu ajung. Cele care lipsesc — săgeata de forță,
 * cota de distanță, discul unui astru, crucea unei mase punctiforme — sunt
 * definite mai jos, în fișierul acesta, cu același tipar ca ale circuitelor:
 * coordonatele se dau după CENTRUL simbolului.
 *
 * Roșul săgeților nu e decorativ: în manual toate forțele sunt desenate roșu,
 * ca să se deosebească de liniile de construcție (dreapta care unește corpurile
 * și cotele de distanță), care rămân negre.
 */

const FORTA = CULORI.iese;
const GROSIME = 1.6;

/** Săgeata unei forțe, de la (x1,y1) la (x2,y2). */
function Sageata({ x1, y1, x2, y2, culoare = FORTA, grosime = 1.9 }) {
  const id = `grv-sg-${Math.round(x1)}-${Math.round(y1)}-${Math.round(x2)}-${Math.round(y2)}-${culoare.replace(/[^a-z0-9]/gi, '')}`;
  return (
    <g>
      <defs>
        <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={culoare} />
        </marker>
      </defs>
      <path
        d={`M ${x1} ${y1} L ${x2} ${y2}`}
        stroke={culoare}
        strokeWidth={grosime}
        fill="none"
        strokeLinecap="round"
        markerEnd={`url(#${id})`}
      />
    </g>
  );
}

/** Cota unei distanțe: linie cu vârfuri la ambele capete și eticheta ei. */
function Cota({ x1, x2, y, simbol, dupa, sub }) {
  const id = `grv-ct-${Math.round(x1)}-${Math.round(x2)}-${Math.round(y)}`;
  return (
    <g>
      <defs>
        <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={CULORI.fir} />
        </marker>
      </defs>
      <path d={`M ${x1} ${y - 7} L ${x1} ${y + 7}`} stroke={CULORI.slab} strokeWidth={1.1} />
      <path d={`M ${x2} ${y - 7} L ${x2} ${y + 7}`} stroke={CULORI.slab} strokeWidth={1.1} />
      <path
        d={`M ${x1} ${y} L ${x2} ${y}`}
        stroke={CULORI.fir}
        strokeWidth={1.2}
        markerStart={`url(#${id})`}
        markerEnd={`url(#${id})`}
      />
      {simbol && (
        <Simbol x={(x1 + x2) / 2} y={sub ? y + 17 : y - 9} dupa={dupa}>
          {simbol}
        </Simbol>
      )}
    </g>
  );
}

/** Discul unui astru sau al unei bile. */
function Astru({ x, y, r, umplutura = CULORI.umplutura }) {
  return <circle cx={x} cy={y} r={r} fill={umplutura} stroke={CULORI.contur} strokeWidth={GROSIME} />;
}

/** Crucea care marchează o masă punctiformă. */
function Punct({ x, y, r = 5 }) {
  return (
    <path
      d={`M ${x - r} ${y - r} L ${x + r} ${y + r} M ${x + r} ${y - r} L ${x - r} ${y + r}`}
      stroke={CULORI.fir}
      strokeWidth={1.6}
    />
  );
}

/** Racheta din problema cu Marte: corp, vârf și două aripioare. */
function Racheta({ x, y }) {
  return (
    <g>
      <path
        d={`M ${x - 5} ${y - 4} L ${x - 5} ${y + 12} L ${x + 5} ${y + 12} L ${x + 5} ${y - 4} Z`}
        fill={CULORI.umplutura}
        stroke={CULORI.contur}
        strokeWidth={1.4}
      />
      <path
        d={`M ${x - 5} ${y - 4} L ${x} ${y - 15} L ${x + 5} ${y - 4} Z`}
        fill={CULORI.umplutura}
        stroke={CULORI.contur}
        strokeWidth={1.4}
      />
      <path
        d={`M ${x - 5} ${y + 5} L ${x - 10} ${y + 14} L ${x - 5} ${y + 12} M ${x + 5} ${y + 5} L ${x + 10} ${y + 14} L ${x + 5} ${y + 12}`}
        fill="none"
        stroke={CULORI.contur}
        strokeWidth={1.4}
      />
    </g>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   C5 — INTERACȚIUNEA GRAVITAȚIONALĂ
   ══════════════════════════════════════════════════════════════════════════ */

/** Forța cu care masa punctiformă A o atrage pe masa punctiformă B. */
export function FigMasePunctiforme() {
  const Y = 66;
  const A = 130;
  const B = 340;
  return (
    <Schema
      vb="0 0 460 140"
      latime={440}
      eticheta="Două mase punctiforme A și B, despărțite de distanța d; forța exercitată de A asupra lui B este îndreptată de la B spre A"
      legenda="Forța exercitată de masa punctiformă A asupra masei punctiforme B."
    >
      <Fir d={`M 20 ${Y} L 440 ${Y}`} punctat culoare={CULORI.slab} />
      <Punct x={A} y={Y} />
      <Punct x={B} y={Y} />
      <Text x={A} y={Y - 20} ancora="middle">A</Text>
      <Text x={B} y={Y - 20} ancora="middle">B</Text>
      <Simbol x={A} y={Y + 24}>m_A</Simbol>
      <Simbol x={B} y={Y + 24}>m_B</Simbol>

      <Sageata x1={B - 10} y1={Y - 30} x2={B - 60} y2={Y - 30} />
      <Simbol x={B - 35} y={Y - 38} culoare={FORTA}>F_A/B</Simbol>

      <Cota x1={A} x2={B} y={Y + 48} simbol="d" sub />
    </Schema>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   C6 — EFECTUL DISTANȚEI ȘI RECIPROCITATEA
   ══════════════════════════════════════════════════════════════════════════ */

/** Cele două forțe: valori egale, sensuri opuse. */
export function FigActiuneReactiune() {
  const Y = 66;
  const A = 130;
  const B = 340;
  return (
    <Schema
      vb="0 0 460 140"
      latime={440}
      eticheta="Masele A și B se atrag reciproc: forța asupra lui A e îndreptată spre B, forța asupra lui B e îndreptată spre A"
      legenda="Cele două forțe au valori egale și sensuri opuse."
    >
      <Fir d={`M 20 ${Y} L 440 ${Y}`} punctat culoare={CULORI.slab} />
      <Punct x={A} y={Y} />
      <Punct x={B} y={Y} />
      <Text x={A} y={Y - 20} ancora="middle">A</Text>
      <Text x={B} y={Y - 20} ancora="middle">B</Text>
      <Simbol x={A} y={Y + 24}>m_A</Simbol>
      <Simbol x={B} y={Y + 24}>m_B</Simbol>

      <Sageata x1={A + 10} y1={Y - 30} x2={A + 60} y2={Y - 30} />
      <Simbol x={A + 35} y={Y - 38} culoare={FORTA}>F_B/A</Simbol>

      <Sageata x1={B - 10} y1={Y - 30} x2={B - 60} y2={Y - 30} />
      <Simbol x={B - 35} y={Y - 38} culoare={FORTA}>F_A/B</Simbol>

      <Cota x1={A} x2={B} y={Y + 48} simbol="d" sub />
    </Schema>
  );
}

/** Aceleași două mase, la distanța d, 2d și 3d. */
export function FigEfectulDistantei() {
  const randuri = [
    { y: 36, k: 1, cota: 'd', text: 'forța are valoarea F' },
    { y: 106, k: 2, cota: '2d', text: 'forța e de 4 ori mai mică' },
    { y: 176, k: 3, cota: '3d', text: 'forța e de 9 ori mai mică' },
  ];
  const ST = 40;
  const PAS = 52;
  return (
    <Schema
      vb="0 0 470 220"
      latime={460}
      eticheta="Aceleași două mase așezate la distanța d, la 2d și la 3d; forța scade de 4 ori, apoi de 9 ori"
      legenda="Când distanța se dublează, forța scade de 4 ori; când se triplează, scade de 9 ori."
    >
      {randuri.map(({ y, k, cota, text }) => (
        <g key={k}>
          <Fir d={`M 24 ${y} L 216 ${y}`} punctat culoare={CULORI.slab} />
          <Punct x={ST} y={y} r={4.4} />
          <Punct x={ST + k * PAS} y={y} r={4.4} />
          <Cota x1={ST} x2={ST + k * PAS} y={y + 22} simbol={cota} sub />
          <Text x={244} y={y + 5}>{text}</Text>
        </g>
      ))}
    </Schema>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   C7 — GREUTATEA, MANIFESTARE A GRAVITAȚIEI
   ══════════════════════════════════════════════════════════════════════════ */

/** Bila lăsată să cadă: singura forță asupra ei e greutatea. */
export function FigBilaCade() {
  return (
    <Schema
      vb="0 0 300 200"
      latime={280}
      eticheta="O bilă lăsată să cadă; greutatea ei este verticală și îndreptată în jos"
      legenda="Bila lăsată fără viteză inițială cade: asupra ei se exercită o forță verticală, îndreptată în jos."
    >
      <Astru x={150} y={54} r={13} />
      <Fir d="M 150 70 L 150 160" punctat culoare={CULORI.slab} />
      <Sageata x1={150} y1={72} x2={150} y2={116} />
      <Simbol x={166} y={100} culoare={FORTA}>P</Simbol>
      <Fir d="M 40 168 L 260 168" />
      <path
        d="M 46 180 L 56 168 M 66 180 L 76 168 M 86 180 L 96 168 M 106 180 L 116 168 M 126 180 L 136 168 M 146 180 L 156 168 M 166 180 L 176 168 M 186 180 L 196 168 M 206 180 L 216 168 M 226 180 L 236 168"
        stroke={CULORI.slab}
        strokeWidth={1.2}
      />
    </Schema>
  );
}

/** Doi aștri sferici se atrag ca și cum masele lor ar fi în centre. */
export function FigAstriSferici() {
  return (
    <Schema
      vb="0 0 420 240"
      latime={420}
      eticheta="Sus: doi aștri sferici care se atrag. Jos: aceleași mase, punctiforme, așezate în centrele aștrilor"
      legenda="Interacțiunea gravitațională dintre doi aștri sferici e aceeași ca între două mase punctiforme aflate în centrele lor."
    >
      {/* aștrii sferici */}
      <Astru x={110} y={72} r={26} />
      <Astru x={300} y={72} r={42} />
      <Simbol x={110} y={34}>m_A</Simbol>
      <Simbol x={300} y={18}>m_B</Simbol>
      <Sageata x1={142} y1={66} x2={186} y2={66} />
      <Simbol x={164} y={54} culoare={FORTA} marime={12}>F_B/A</Simbol>
      <Sageata x1={252} y1={66} x2={208} y2={66} />
      <Simbol x={230} y={54} culoare={FORTA} marime={12}>F_A/B</Simbol>

      {/* legăturile spre masele punctiforme */}
      <Fir d="M 110 100 L 110 168" punctat culoare={CULORI.slab} />
      <Fir d="M 300 116 L 300 168" punctat culoare={CULORI.slab} />

      {/* masele punctiforme */}
      <Fir d="M 40 186 L 380 186" punctat culoare={CULORI.slab} />
      <Punct x={110} y={186} />
      <Punct x={300} y={186} />
      <Simbol x={110} y={210}>m_A</Simbol>
      <Simbol x={300} y={210}>m_B</Simbol>
      <Sageata x1={142} y1={180} x2={186} y2={180} />
      <Simbol x={164} y={168} culoare={FORTA} marime={12}>F_B/A</Simbol>
      <Sageata x1={252} y1={180} x2={208} y2={180} />
      <Simbol x={230} y={168} culoare={FORTA} marime={12}>F_A/B</Simbol>
    </Schema>
  );
}

/** Un corp de masă m la suprafața unui astru de masă M și rază R. */
export function FigCorpPeAstru() {
  const CX = 180;
  const CY = 132;
  const R = 74;
  return (
    <Schema
      vb="0 0 360 230"
      latime={330}
      eticheta="Un corp mic așezat la suprafața unui astru sferic; greutatea lui e îndreptată spre centrul astrului"
      legenda="Un corp de masă m aflat la suprafața unui astru sferic de masă M și rază R."
    >
      <Astru x={CX} y={CY} r={R} />
      <Punct x={CX} y={CY} r={4.4} />
      <Simbol x={CX + 18} y={CY + 6}>M</Simbol>
      <Fir d={`M ${CX} ${CY} L ${CX} ${CY - R}`} punctat culoare={CULORI.slab} />
      <Simbol x={CX - 16} y={CY - 34}>R</Simbol>

      <rect x={CX - 10} y={CY - R - 16} width={20} height={16} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={GROSIME} />
      <Simbol x={CX - 26} y={CY - R - 4}>m</Simbol>

      <Sageata x1={CX + 32} y1={CY - R - 8} x2={CX + 32} y2={CY - R + 36} />
      <Simbol x={CX + 48} y={CY - R + 16} culoare={FORTA}>P</Simbol>
    </Schema>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LP5 — CALCULUL FORȚEI GRAVITAȚIONALE
   ══════════════════════════════════════════════════════════════════════════ */

/** Doi elevi de câte 50 kg, la un metru unul de altul. */
export function FigDoiElevi() {
  const Y = 70;
  const A = 150;
  const B = 310;
  return (
    <Schema
      vb="0 0 460 150"
      latime={430}
      eticheta="Doi elevi de câte 50 kg aflați la un metru unul de altul, atrăgându-se reciproc"
      legenda="Doi elevi de câte 50 kg, așezați la un metru unul de altul."
    >
      <Fir d={`M 30 ${Y} L 430 ${Y}`} punctat culoare={CULORI.slab} />
      <Punct x={A} y={Y} />
      <Punct x={B} y={Y} />
      <Text x={A} y={Y - 34} ancora="middle" marime={12}>elevul A · 50 kg</Text>
      <Text x={B} y={Y - 34} ancora="middle" marime={12}>elevul B · 50 kg</Text>
      <Sageata x1={A + 10} y1={Y - 16} x2={A + 52} y2={Y - 16} />
      <Sageata x1={B - 10} y1={Y - 16} x2={B - 52} y2={Y - 16} />
      <Cota x1={A} x2={B} y={Y + 34} simbol="d" dupa={" = 1 m"} sub />
    </Schema>
  );
}

/** Stânca și drumețul, la 30 de metri unul de altul. */
export function FigStancaDrumet() {
  const Y = 78;
  const D = 110;
  const S = 330;
  return (
    <Schema
      vb="0 0 460 170"
      latime={440}
      eticheta="Un drumeț de 60 kg și o stâncă de 20 de tone, aflați la 30 de metri unul de altul, cu forțele cu care se atrag"
      legenda="Forța cu care stânca atrage drumețul are aceeași valoare ca forța cu care drumețul atrage stânca."
    >
      <Fir d={`M 24 ${Y} L 436 ${Y}`} punctat culoare={CULORI.slab} />
      <Punct x={D} y={Y} />
      <Astru x={S} y={Y} r={26} />
      <Text x={D} y={Y - 40} ancora="middle" marime={12}>drumețul · m = 60 kg</Text>
      <Text x={S} y={Y - 42} ancora="middle" marime={12}>stânca · M = 20 t</Text>

      <Sageata x1={D + 10} y1={Y - 20} x2={D + 56} y2={Y - 20} />
      <Simbol x={D + 33} y={Y - 28} culoare={FORTA} marime={12}>F_S/D</Simbol>
      <Sageata x1={S - 30} y1={Y - 20} x2={S - 76} y2={Y - 20} />
      <Simbol x={S - 53} y={Y - 28} culoare={FORTA} marime={12}>F_D/S</Simbol>

      <Cota x1={D} x2={S} y={Y + 44} simbol="d" dupa={" = 30 m"} sub />
    </Schema>
  );
}

/** Cele două stele ale unei stele duble. */
export function FigDouaStele() {
  const Y = 82;
  const A = 140;
  const B = 330;
  return (
    <Schema
      vb="0 0 460 170"
      latime={440}
      eticheta="Două stele de mase M₂ și M₁, despărțite de distanța d, atrăgându-se reciproc"
      legenda="Forțele pe care cele două stele le exercită una asupra celeilalte."
    >
      <Fir d={`M 24 ${Y} L 436 ${Y}`} punctat culoare={CULORI.slab} />
      <Astru x={A} y={Y} r={24} />
      <Astru x={B} y={Y} r={18} />
      <Simbol x={A} y={Y - 38}>M_2</Simbol>
      <Simbol x={B} y={Y - 32}>M_1</Simbol>

      <Sageata x1={A + 28} y1={Y} x2={A + 74} y2={Y} />
      <Simbol x={A + 51} y={Y - 10} culoare={FORTA} marime={12}>F_1→2</Simbol>
      <Sageata x1={B - 22} y1={Y} x2={B - 68} y2={Y} />
      <Simbol x={B - 45} y={Y - 10} culoare={FORTA} marime={12}>F_2→1</Simbol>

      <Cota x1={A} x2={B} y={Y + 42} simbol="d" sub />
    </Schema>
  );
}

/** Sistemul Soare–Pământ; cu `cuforte` apar și cele două forțe. */
export function FigSoareTerra({ cuforte }) {
  const Y = 84;
  const S = 110;
  const T = 370;
  return (
    <Schema
      vb="0 0 460 160"
      latime={440}
      eticheta="Soarele și Pământul, despărțiți de 1,50 × 10⁸ km"
      legenda={
        cuforte
          ? 'Forța exercitată de Soare asupra Pământului și forța exercitată de Pământ asupra Soarelui au aceeași valoare.'
          : 'Sistemul Soare–Pământ (scara nu este respectată).'
      }
    >
      <Fir d={`M 24 ${Y} L 436 ${Y}`} punctat culoare={CULORI.slab} />
      <Astru x={S} y={Y} r={24} />
      <Astru x={T} y={Y} r={13} />
      <Text x={S} y={Y + 46} ancora="middle" marime={12}>Soarele</Text>
      <Text x={T} y={Y + 46} ancora="middle" marime={12}>Pământul</Text>
      <Cota x1={S} x2={T} y={30} simbol="d" dupa={" = 1,50 × 10⁸ km"} />

      {cuforte && (
        <>
          <Sageata x1={S + 28} y1={Y} x2={S + 74} y2={Y} />
          <Simbol x={S + 51} y={Y - 10} culoare={FORTA}>F_2</Simbol>
          <Sageata x1={T - 17} y1={Y} x2={T - 63} y2={Y} />
          <Simbol x={T - 40} y={Y - 10} culoare={FORTA}>F_1</Simbol>
        </>
      )}
    </Schema>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LP6 — DISTANȚA ȘI RECIPROCITATEA
   ══════════════════════════════════════════════════════════════════════════ */

/** Racheta apropiindu-se de Marte: două poziții, două valori ale forței. */
export function FigRacheta() {
  const Y = 78;
  const M = 96;
  const P2 = 186;
  const P1 = 276;
  return (
    <Schema
      vb="0 0 400 200"
      latime={400}
      eticheta="O rachetă aflată succesiv la 20 000 km și la 10 000 km de centrul planetei Marte, cu forțele resimțite în cele două poziții"
      legenda="Racheta se apropie de Marte: la jumătate de distanță, forța resimțită e de patru ori mai mare."
    >
      <Fir d={`M 20 ${Y} L 380 ${Y}`} punctat culoare={CULORI.slab} />
      <Astru x={M} y={Y} r={26} />
      <Text x={M} y={Y + 4} ancora="middle" marime={12}>Marte</Text>
      <Racheta x={P2} y={Y} />
      <Racheta x={P1} y={Y} />

      <Sageata x1={P2 - 12} y1={Y - 34} x2={P2 - 52} y2={Y - 34} />
      <Simbol x={P2 - 26} y={Y - 44} culoare={FORTA} marime={12} dupa={" = 600 N"}>F_2</Simbol>
      <Sageata x1={P1 - 12} y1={Y - 12} x2={P1 - 42} y2={Y - 12} />
      <Simbol x={P1 + 6} y={Y - 20} culoare={FORTA} marime={12} dupa={" = 150 N"}>F_1</Simbol>

      <Cota x1={M} x2={P2} y={Y + 44} simbol="d_2" dupa={" = 10 000 km"} sub />
      <Cota x1={M} x2={P1} y={Y + 92} simbol="d_1" dupa={" = 20 000 km"} sub />
    </Schema>
  );
}

/** Cele două bile de petanque, așezate pe sol la 25 cm una de alta. */
export function FigBilePetanque() {
  const Y = 88;
  const A = 150;
  const B = 290;
  return (
    <Schema
      vb="0 0 420 175"
      latime={410}
      eticheta="Două bile de petanque de câte 715 g, așezate pe sol, cu centrele la 25 cm una de alta"
      legenda="Două bile de petanque de aceeași masă, așezate pe sol."
    >
      <Astru x={A} y={Y} r={22} />
      <Astru x={B} y={Y} r={22} />
      <Punct x={A} y={Y} r={3.6} />
      <Punct x={B} y={Y} r={3.6} />
      <Simbol x={A} y={Y - 34} dupa={" = 715 g"}>m</Simbol>
      <Simbol x={B} y={Y - 34} dupa={" = 715 g"}>m</Simbol>

      <Fir d="M 40 110 L 380 110" />
      <path
        d="M 46 122 L 56 110 M 66 122 L 76 110 M 86 122 L 96 110 M 106 122 L 116 110 M 126 122 L 136 110 M 146 122 L 156 110 M 166 122 L 176 110 M 186 122 L 196 110 M 206 122 L 216 110 M 226 122 L 236 110 M 246 122 L 256 110 M 266 122 L 276 110 M 286 122 L 296 110 M 306 122 L 316 110 M 326 122 L 336 110 M 346 122 L 356 110"
        stroke={CULORI.slab}
        strokeWidth={1.2}
      />

      <Cota x1={A} x2={B} y={140} simbol="d" dupa={" = 25 cm"} sub />
    </Schema>
  );
}

/** Satelitul pe orbită circulară, la altitudinea h deasupra Pământului. */
export function FigSatelit() {
  const CX = 170;
  const CY = 140;
  const R = 52;
  const ORB = 88;
  return (
    <Schema
      vb="0 0 400 265"
      latime={380}
      eticheta="Un satelit pe o orbită circulară în jurul Pământului, la altitudinea h deasupra suprafeței; raza orbitei este R plus h"
      legenda="Satelitul descrie un cerc de rază R + h în jurul centrului Pământului."
    >
      <circle
        cx={CX}
        cy={CY}
        r={ORB}
        fill="none"
        stroke={CULORI.slab}
        strokeWidth={1.3}
        strokeDasharray="5 4"
      />
      <Astru x={CX} y={CY} r={R} />
      <Punct x={CX} y={CY} r={4} />
      <Text x={CX} y={CY - 62} ancora="middle" marime={12}>Pământul</Text>

      <circle cx={CX + ORB} cy={CY} r={5.5} fill={CULORI.fir} />
      <Text x={CX + ORB + 12} y={CY - 8} ancora="start" marime={12}>satelitul</Text>

      <Fir d={`M ${CX} ${CY} L ${CX} ${CY + 66}`} punctat culoare={CULORI.slab} />
      <Fir d={`M ${CX + R} ${CY} L ${CX + R} ${CY + 66}`} punctat culoare={CULORI.slab} />
      <Fir d={`M ${CX + ORB} ${CY} L ${CX + ORB} ${CY + 96}`} punctat culoare={CULORI.slab} />

      <Cota x1={CX} x2={CX + R} y={CY + 60} simbol="R" sub />
      <Cota x1={CX + R} x2={CX + ORB} y={CY + 90} simbol="h" sub />
    </Schema>
  );
}
