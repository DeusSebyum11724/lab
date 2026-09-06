import React from 'react';
import { Schema, Fir, Text, Simbol, CULORI } from './index';

/**
 * FIGURILE DESENATE ALE LECȚIILOR DESPRE FORȚE ȘI PRINCIPIUL INERȚIEI.
 *
 * Aproape toate figurile capitolului sunt acum decupaje din manual, cu
 * etichetele traduse peste ele (vezi `FiguraManual`). Aici au rămas doar
 * figurile care NU au corespondent în carte:
 *
 *   — cele trei figuri ale lecției C1 (elementele unei forțe, dinamometrul cu
 *     tub, acțiunea de contact față de acțiunea la distanță): manualul tratează
 *     partea asta numai în text, fără desen;
 *   — cele două construcții pe hârtie cu pătrățele (compunerea a două forțe
 *     perpendiculare și construcția reacțiunii șoselei): sunt desene de lucru
 *     făcute pentru lecție, nu figuri ale cărții;
 *   — schema celor două forțe ale unei interacțiuni (A și B): manualul enunță
 *     principiul acțiunilor reciproce fără figură.
 *
 * CULOAREA POARTĂ INFORMAȚIE. Într-un bilanț de forțe, elevul trebuie să
 * deosebească dintr-o privire greutatea de reacțiunea suportului și de
 * tensiunea unui fir. De aceea fiecare familie de forțe are aici culoarea ei:
 *
 *   roșu    — greutatea și forțele îndreptate în jos ale corpului însuși;
 *   verde   — reacțiunile suporturilor;
 *   violet  — tensiunile firelor și ale corzilor;
 *   portocaliu — forțele aplicate din afară (mâna, aerul, magnetul).
 *
 * SISTEMUL DE COORDONATE. Fiecare figură își alege `viewBox`-ul ei, iar
 * săgețile se dau prin cele două capete ale lor.
 */
const COL = {
  greutate: '#c0392b',
  reactiune: '#1c7c4a',
  tensiune: '#6b4fa8',
  aplicata: '#b0651a',
  lemn: '#c2a179',
  metal: '#b9c2c8',
  corp: '#a8d3de',
  piele: '#f0c3ab',
};

/** Săgeata unei forțe (sau a vitezei), dată prin cele două capete ale ei. */
function Sageata({ x1, y1, x2, y2, culoare = CULORI.fir, grosime = 2.1, punctat }) {
  const id = `frt-sg-${culoare.replace(/[^a-z0-9]/gi, '')}`;
  return (
    <g>
      <defs>
        <marker
          id={id}
          viewBox="0 0 10 10"
          refX="8.6"
          refY="5"
          markerWidth="5.6"
          markerHeight="5.6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={culoare} />
        </marker>
      </defs>
      <path
        d={`M ${x1} ${y1} L ${x2} ${y2}`}
        stroke={culoare}
        strokeWidth={grosime}
        strokeDasharray={punctat ? '5 4' : undefined}
        strokeLinecap="round"
        fill="none"
        markerEnd={`url(#${id})`}
      />
    </g>
  );
}

/** Hârtia cu pătrățele, pentru desenul forțelor la scară. */
function Grila({ x0, y0, x1, y1, pas }) {
  const l = [];
  for (let x = x0; x <= x1 + 0.01; x += pas) {
    l.push(<line key={`v${x}`} x1={x} y1={y0} x2={x} y2={y1} stroke={CULORI.slab} strokeWidth={0.5} opacity={0.5} />);
  }
  for (let y = y0; y <= y1 + 0.01; y += pas) {
    l.push(<line key={`h${y}`} x1={x0} y1={y} x2={x1} y2={y} stroke={CULORI.slab} strokeWidth={0.5} opacity={0.5} />);
  }
  return <g>{l}</g>;
}

/** Punctul de aplicație al unei forțe. */
function Punct({ x, y, r = 3.4, culoare = CULORI.fir }) {
  return <circle cx={x} cy={y} r={r} fill={culoare} />;
}

/** Solul, orizontal. */
function Sol({ x0, x1, y, h = 12, culoare = COL.lemn }) {
  return <rect x={x0} y={y} width={x1 - x0} height={h} fill={culoare} />;
}

/* ══════════════════════════════════════════════════════════════════════════
   C1 — FORȚA: CUM SE REPREZINTĂ ȘI CUM SE MĂSOARĂ
   ══════════════════════════════════════════════════════════════════════════ */

/** Cele patru lucruri care descriu o forță, arătate pe o singură săgeată. */
export function FigElementeleUneiForte() {
  return (
    <Schema
      vb="0 0 460 240"
      latime={460}
      eticheta="O ladă pe sol, cu forța desenată ca săgeată pornind din punctul de aplicație"
      legenda="Forța se desenează ca o săgeată: pleacă din punctul de aplicație, stă pe direcția ei, arată în sensul ei, iar lungimea săgeții dă valoarea forței, la scara aleasă."
    >
      <Sol x0={20} x1={440} y={192} h={10} />
      <rect x={70} y={132} width={70} height={60} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.6} />
      <Fir d="M 40 140 L 424 140" punctat culoare={CULORI.slab} grosime={1.1} />
      <Sageata x1={140} y1={140} x2={320} y2={140} culoare={COL.aplicata} grosime={2.6} />
      <Punct x={140} y={140} />
      <Simbol x={228} y={130} culoare={COL.aplicata} marime={15}>F</Simbol>
      <Fir d="M 140 136 L 140 104" culoare={CULORI.slab} grosime={1} />
      <Text x={140} y={96} ancora="middle" marime={11} culoare={CULORI.slab}>punctul de aplicație</Text>
      <Text x={424} y={132} ancora="end" marime={11} culoare={CULORI.slab}>direcția</Text>
      <Text x={326} y={156} ancora="start" marime={11} culoare={CULORI.slab}>sensul</Text>
      <Fir d="M 140 152 L 140 164 M 320 152 L 320 164 M 140 158 L 320 158" culoare={CULORI.slab} grosime={1} />
      <Text x={230} y={176} ancora="middle" marime={11} culoare={CULORI.slab}>lungimea = valoarea, la scară</Text>
    </Schema>
  );
}

/** Dinamometrul cu arc, cu acul oprit în dreptul lui 6 N. */
export function FigDinamometru() {
  const grad = [];
  for (let i = 0; i <= 10; i += 1) {
    const y = 56 + i * 16;
    grad.push(
      <path key={`g${i}`} d={`M 104 ${y} L ${i % 5 === 0 ? 130 : 119} ${y}`} stroke={CULORI.contur} strokeWidth={1} />,
    );
    if (i % 5 === 0) {
      grad.push(
        <Text key={`t${i}`} x={168} y={y + 3.5} marime={10} culoare={CULORI.slab}>{String(i)}</Text>,
      );
    }
  }
  return (
    <Schema
      vb="0 0 280 320"
      latime={230}
      eticheta="Dinamometru cu arc, cu un corp atârnat de cârlig"
      legenda="Dinamometrul: cu cât forța e mai mare, cu atât arcul se întinde mai mult. Gradațiile sunt în newtoni; aici dinamometrul arată 6 N."
    >
      <circle cx={130} cy={26} r={11} fill="none" stroke={CULORI.contur} strokeWidth={2} />
      <rect x={100} y={40} width={60} height={180} rx={7} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.6} />
      {grad}
      <path d="M 100 152 L 160 152" stroke={COL.greutate} strokeWidth={2.6} />
      <Text x={168} y={36} marime={11} culoare={CULORI.slab}>N</Text>
      <path d="M 130 220 L 130 250" stroke={CULORI.contur} strokeWidth={2} />
      <circle cx={130} cy={259} r={9} fill="none" stroke={CULORI.contur} strokeWidth={2} />
      <path d="M 130 268 L 130 276" stroke={CULORI.contur} strokeWidth={1.6} />
      <rect x={106} y={276} width={48} height={34} fill={COL.metal} stroke={CULORI.contur} strokeWidth={1.6} />
      <Text x={130} y={298} ancora="middle" marime={11}>corp</Text>
    </Schema>
  );
}

/** Acțiune de contact (mâna care împinge) și acțiune la distanță (magnetul). */
export function FigActiuni() {
  return (
    <Schema
      vb="0 0 460 220"
      latime={460}
      eticheta="În stânga, o mână împinge o ladă; în dreapta, un magnet atrage o bilă de fier fără s-o atingă"
      legenda="Forța de împingere se exercită numai prin atingere: e o acțiune de contact. Magnetul atrage bila de fier fără s-o atingă: e o acțiune la distanță."
    >
      <Sol x0={20} x1={220} y={172} h={10} />
      <rect x={92} y={112} width={70} height={60} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.6} />
      <ellipse cx={70} cy={142} rx={22} ry={14} fill={COL.piele} stroke={CULORI.contur} strokeWidth={1.3} />
      <Sageata x1={92} y1={142} x2={140} y2={142} culoare={COL.aplicata} />
      <Simbol x={118} y={132} culoare={COL.aplicata}>F</Simbol>
      <Text x={120} y={205} ancora="middle" marime={12}>acțiune de contact</Text>

      <rect x={352} y={44} width={64} height={11} fill={COL.lemn} />
      <Fir d="M 384 55 L 384 116" />
      <circle cx={384} cy={130} r={14} fill={COL.metal} stroke={CULORI.contur} strokeWidth={1.6} />
      <rect x={250} y={117} width={32} height={26} fill="#e59a9a" stroke={CULORI.contur} strokeWidth={1.4} />
      <rect x={282} y={117} width={32} height={26} fill={COL.metal} stroke={CULORI.contur} strokeWidth={1.4} />
      <Text x={266} y={135} ancora="middle" marime={13}>N</Text>
      <Text x={298} y={135} ancora="middle" marime={13}>S</Text>
      <Fir d="M 316 130 L 368 130" punctat culoare={CULORI.slab} grosime={1.1} />
      <Sageata x1={368} y1={130} x2={324} y2={130} culoare={COL.aplicata} />
      <Simbol x={346} y={120} culoare={COL.aplicata}>F</Simbol>
      <Text x={340} y={205} ancora="middle" marime={12}>acțiune la distanță</Text>
    </Schema>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   C4 ȘI LP4 — ACȚIUNI RECIPROCE, COMPUNEREA FORȚELOR PE HÂRTIE CU PĂTRĂȚELE
   ══════════════════════════════════════════════════════════════════════════ */

/** Cele două forțe ale unei interacțiuni, aplicate pe corpuri diferite. */
export function FigActiuniReciproce() {
  return (
    <Schema
      vb="0 0 420 180"
      latime={420}
      eticheta="Două corpuri A și B, fiecare cu forța pe care o primește de la celălalt"
      legenda="Forța cu care A acționează asupra lui B și forța cu care B acționează asupra lui A au aceeași valoare, aceeași direcție și sensuri opuse — dar sunt aplicate pe corpuri diferite."
    >
      <Fir d="M 20 92 L 400 92" punctat culoare={CULORI.slab} grosime={1.1} />
      <circle cx={130} cy={92} r={32} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.6} />
      <circle cx={290} cy={92} r={32} fill={COL.corp} stroke={CULORI.contur} strokeWidth={1.6} />
      <Text x={130} y={97} ancora="middle" marime={16}>A</Text>
      <Text x={290} y={97} ancora="middle" marime={16}>B</Text>
      <Sageata x1={322} y1={92} x2={386} y2={92} culoare={COL.aplicata} />
      <Sageata x1={98} y1={92} x2={34} y2={92} culoare={COL.tensiune} />
      <Simbol x={354} y={78} ancora="middle" culoare={COL.aplicata} marime={15}>F_A/B</Simbol>
      <Simbol x={66} y={78} ancora="middle" culoare={COL.tensiune} marime={15}>F_B/A</Simbol>
      <Text x={210} y={148} ancora="middle" marime={11} culoare={CULORI.slab}>aceeași direcție, aceeași valoare, sensuri opuse</Text>
    </Schema>
  );
}

/** Compunerea grafică a două forțe perpendiculare, pe hârtie cu pătrățele. */
export function FigCompunereForte() {
  return (
    <Schema
      vb="0 0 420 290"
      latime={420}
      eticheta="Două forțe perpendiculare desenate pe hârtie cu pătrățele și rezultanta lor"
      legenda="Două forțe perpendiculare, desenate la scară din același punct: forța care le înlocuiește pe amândouă este diagonala dreptunghiului construit pe ele."
    >
      <Grila x0={40} y0={40} x1={380} y1={260} pas={20} />
      <Fir d="M 200 240 L 200 120 M 120 120 L 200 120" punctat culoare={CULORI.slab} grosime={1.2} />
      <Sageata x1={120} y1={240} x2={120} y2={120} culoare={COL.reactiune} grosime={2.4} />
      <Sageata x1={120} y1={240} x2={200} y2={240} culoare={COL.aplicata} grosime={2.4} />
      <Sageata x1={120} y1={240} x2={200} y2={120} culoare={COL.tensiune} grosime={2.4} />
      <Punct x={120} y={240} />
      <Simbol x={106} y={180} ancora="end" culoare={COL.reactiune} marime={15}>F_1</Simbol>
      <Simbol x={162} y={262} ancora="middle" culoare={COL.aplicata} marime={15}>F_2</Simbol>
      <Simbol x={176} y={172} ancora="middle" culoare={COL.tensiune} marime={15}>F</Simbol>
      <Text x={300} y={272} ancora="middle" marime={11} culoare={CULORI.slab}>un pătrat ↔ 1 cm de desen</Text>
    </Schema>
  );
}

/** Construcția la scară a reacțiunii șoselei: 6 cm în sus și 2 cm înainte. */
export function FigCompunereMasina() {
  return (
    <Schema
      vb="0 0 380 310"
      latime={340}
      eticheta="Construcția la scară a reacțiunii șoselei, pe hârtie cu pătrățele"
      legenda="Construcția la scară: reacțiunea șoselei trebuie să aibă 6 cm în sus (6000 N) și 2 cm înainte (2000 N). Ea este diagonala dreptunghiului."
    >
      <Grila x0={40} y0={40} x1={340} y1={296} pas={16} />
      <Punct x={152} y={184} />
      <Sageata x1={152} y1={184} x2={152} y2={280} culoare={COL.greutate} grosime={2.4} />
      <Simbol x={138} y={240} ancora="end" culoare={COL.greutate} marime={15}>P</Simbol>
      <Text x={138} y={258} ancora="end" marime={10} culoare={COL.greutate}>6000 N</Text>
      <Sageata x1={152} y1={184} x2={120} y2={184} culoare={COL.aplicata} grosime={2.4} />
      <Simbol x={132} y={174} ancora="middle" culoare={COL.aplicata} marime={15}>F</Simbol>
      <Text x={120} y={162} ancora="middle" marime={10} culoare={COL.aplicata}>2000 N</Text>
      <Sageata x1={152} y1={184} x2={184} y2={88} culoare={COL.reactiune} grosime={2.4} />
      <Simbol x={198} y={112} culoare={COL.reactiune} marime={15}>R</Simbol>
      <Fir d="M 152 88 L 184 88 M 184 88 L 184 184" punctat culoare={CULORI.slab} grosime={1.1} />
      <Text x={240} y={288} ancora="middle" marime={11} culoare={CULORI.slab}>un pătrat ↔ 1000 N</Text>
    </Schema>
  );
}
