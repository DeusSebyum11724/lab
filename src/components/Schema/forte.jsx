import React from 'react';
import { Schema, Fir, Text, Simbol, CULORI } from './index';

/**
 * FIGURILE LECȚIILOR DESPRE FORȚE ȘI PRINCIPIUL INERȚIEI.
 *
 * Manualul-sursă e un PDF scanat: figurile lui nu se pot extrage, se
 * redesenează în cod. Se păstrează informația figurii — cine acționează asupra
 * cui, în ce sens arată fiecare săgeată, ce valori sunt date — și se schimbă
 * doar așezarea în pagină, ca desenul să încapă pe un ecran de telefon.
 *
 * CULOAREA POARTĂ INFORMAȚIE. Într-un bilanț de forțe, elevul trebuie să
 * deosebească dintr-o privire greutatea de reacțiunea suportului și de
 * tensiunea unui fir. De aceea fiecare familie de forțe are aici culoarea ei,
 * aceeași în toate figurile capitolului:
 *
 *   roșu    — greutatea și forțele îndreptate în jos ale corpului însuși;
 *   verde   — reacțiunile suporturilor (masa, solul, gheața, perna de aer);
 *   violet  — tensiunile firelor și ale corzilor;
 *   portocaliu — forțele aplicate din afară (mâna, aerul, magnetul).
 *
 * Viteza se desenează cu cerneala paginii, ca să nu fie luată drept forță.
 *
 * SISTEMUL DE COORDONATE. Fiecare figură își alege `viewBox`-ul ei. Corpurile
 * se așază după colțul sau după centrul lor, așa cum e comod pentru desen, iar
 * săgețile se dau prin cele două capete ale lor.
 */

const COL = {
  greutate: '#c0392b',
  reactiune: '#1c7c4a',
  tensiune: '#6b4fa8',
  aplicata: '#b0651a',
  lemn: '#c2a179',
  lemnUmbra: '#a5855f',
  gheata: '#cfe3ec',
  zid: '#f0c9c2',
  frunze: '#7fae6a',
  trunchi: '#9c7346',
  metal: '#b9c2c8',
  corp: '#a8d3de',
  piele: '#f0c3ab',
  minge: '#e07b39',
  carbune: '#40403f',
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

/** Arc de cerc desenat prin puncte, ca să nu depindem de steagurile lui `A`. */
function ArcCerc({ cx, cy, r, a1, a2, culoare = CULORI.slab, grosime = 1.2, pasi = 24 }) {
  const p = [];
  for (let i = 0; i <= pasi; i += 1) {
    const a = ((a1 + ((a2 - a1) * i) / pasi) * Math.PI) / 180;
    p.push(`${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return <path d={`M ${p.join(' L ')}`} fill="none" stroke={culoare} strokeWidth={grosime} strokeLinecap="round" />;
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

/** Crucea care marchează o poziție (un punct al traiectoriei). */
function Cruce({ x, y, d = 4.5, culoare = CULORI.fir }) {
  return (
    <path
      d={`M ${x - d} ${y - d} L ${x + d} ${y + d} M ${x + d} ${y - d} L ${x - d} ${y + d}`}
      stroke={culoare}
      strokeWidth={1.4}
    />
  );
}

/** Solul, orizontal. */
function Sol({ x0, x1, y, h = 12, culoare = COL.lemn }) {
  return <rect x={x0} y={y} width={x1 - x0} height={h} fill={culoare} />;
}

/** Zidul de care se sprijină ceva: linie groasă cu hașuri. */
function Fixare({ x, y0, y1, spre = 1 }) {
  const h = [];
  for (let y = y0; y <= y1 - 6; y += 9) {
    h.push(
      <path key={y} d={`M ${x} ${y + 8} L ${x - 9 * spre} ${y}`} stroke={CULORI.fir} strokeWidth={1.2} />,
    );
  }
  return (
    <g>
      <path d={`M ${x} ${y0} L ${x} ${y1}`} stroke={CULORI.fir} strokeWidth={2.4} />
      {h}
    </g>
  );
}

/** Silueta operatorului. `spre` = 1 privește spre dreapta, −1 spre stânga. */
function Operator({ x, sol, spre = 1 }) {
  const capY = sol - 74;
  return (
    <g stroke={COL.corp} strokeLinecap="round" fill="none">
      <circle cx={x} cy={capY} r={9} fill={COL.corp} stroke="none" />
      <path d={`M ${x} ${capY + 9} L ${x} ${sol - 28}`} strokeWidth={13} />
      <path d={`M ${x} ${sol - 28} L ${x - 10 * spre} ${sol}`} strokeWidth={6} />
      <path d={`M ${x} ${sol - 28} L ${x + 12 * spre} ${sol}`} strokeWidth={6} />
      <path d={`M ${x} ${capY + 15} L ${x + 30 * spre} ${sol - 44}`} strokeWidth={6} />
    </g>
  );
}

/** Căruciorul din exemplele manualului. `x` e colțul din stânga-sus al cuvei. */
function Carucior({ x, sol, plin }) {
  const y = sol - 52;
  return (
    <g>
      <path
        d={`M ${x} ${y} L ${x + 110} ${y} L ${x + 100} ${sol - 12} L ${x + 10} ${sol - 12} Z`}
        fill={CULORI.umplutura}
        stroke={CULORI.contur}
        strokeWidth={1.6}
      />
      {plin && (
        <path
          d={`M ${x + 5} ${y} Q ${x + 32} ${y - 15} ${x + 56} ${y - 7} Q ${x + 82} ${y - 17} ${x + 105} ${y} Z`}
          fill={COL.carbune}
        />
      )}
      <circle cx={x + 26} cy={sol - 6} r={7} fill={COL.greutate} />
      <circle cx={x + 84} cy={sol - 6} r={7} fill={COL.greutate} />
    </g>
  );
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
   C2 — EFECTUL UNEI FORȚE ASUPRA MIȘCĂRII
   ══════════════════════════════════════════════════════════════════════════ */

/** Forța paralelă cu mișcarea și de același sens: căruciorul accelerează. */
export function FigCaruciorAccelerat() {
  return (
    <Schema
      vb="0 0 420 210"
      latime={420}
      eticheta="Un operator împinge din spate un cărucior care merge spre dreapta"
      legenda="Forța operatorului este paralelă cu mișcarea și de același sens: căruciorul accelerează, iar traiectoria lui rămâne o dreaptă."
    >
      <Sol x0={20} x1={400} y={170} h={11} />
      <Operator x={152} sol={170} spre={1} />
      <Carucior x={188} sol={170} />
      <Punct x={188} y={126} />
      <Text x={180} y={122} ancora="end" marime={12}>A</Text>
      <Sageata x1={188} y1={126} x2={244} y2={126} culoare={COL.aplicata} />
      <Simbol x={218} y={116} culoare={COL.aplicata} marime={15}>F</Simbol>
      <Sageata x1={230} y1={76} x2={310} y2={76} />
      <Simbol x={268} y={66} marime={15}>v</Simbol>
    </Schema>
  );
}

/** Forța paralelă cu mișcarea și de sens opus: căruciorul frânează. */
export function FigCaruciorFranat() {
  return (
    <Schema
      vb="0 0 420 210"
      latime={420}
      eticheta="Un operator ține din față un cărucior care merge spre dreapta"
      legenda="Forța operatorului este paralelă cu mișcarea, dar de sens opus: căruciorul încetinește, iar traiectoria lui rămâne tot o dreaptă."
    >
      <Sol x0={20} x1={400} y={170} h={11} />
      <Carucior x={150} sol={170} />
      <Operator x={310} sol={170} spre={-1} />
      <Punct x={260} y={126} />
      <Text x={268} y={122} ancora="start" marime={12}>A</Text>
      <Sageata x1={260} y1={126} x2={204} y2={126} culoare={COL.aplicata} />
      <Simbol x={228} y={116} culoare={COL.aplicata} marime={15}>F</Simbol>
      <Sageata x1={150} y1={76} x2={230} y2={76} />
      <Simbol x={188} y={66} marime={15}>v</Simbol>
    </Schema>
  );
}

/** Forța perpendiculară pe mișcare: traiectoria se curbează, viteza nu se schimbă. */
export function FigMobilCircular() {
  return (
    <Schema
      vb="0 0 440 250"
      latime={440}
      eticheta="Un mobil legat cu un fir de punctul O descrie un arc de cerc"
      legenda="Firul trage mereu perpendicular pe viteză. Traiectoria se curbează — devine un arc de cerc — dar valoarea vitezei rămâne aceeași."
    >
      <Cruce x={90} y={130} />
      <Text x={76} y={126} ancora="end" marime={13}>O</Text>
      <Fir d="M 90 130 L 299 46" punctat culoare={CULORI.slab} grosime={1.1} />
      <Fir d="M 90 130 L 315 130" punctat culoare={CULORI.slab} grosime={1.1} />
      <Fir d="M 90 130 L 299 214" punctat culoare={CULORI.slab} grosime={1.1} />
      <ArcCerc cx={90} cy={130} r={225} a1={-22} a2={22} culoare={CULORI.fir} grosime={1.8} />
      <Sageata x1={299} y1={46} x2={248} y2={66} culoare={COL.tensiune} />
      <Sageata x1={299} y1={214} x2={248} y2={194} culoare={COL.tensiune} />
      <Simbol x={252} y={52} culoare={COL.tensiune} marime={15}>T</Simbol>
      <Simbol x={252} y={212} culoare={COL.tensiune} marime={15}>T</Simbol>
      <Cruce x={315} y={130} />
      <Text x={326} y={135} marime={13}>M</Text>
      <Text x={330} y={36} marime={11} culoare={CULORI.slab}>traiectoria</Text>
      <Text x={330} y={50} marime={11} culoare={CULORI.slab}>mobilului</Text>
      <Text x={150} y={236} ancora="middle" marime={11} culoare={CULORI.slab}>firul, la două momente diferite</Text>
    </Schema>
  );
}

/** Aceeași forță, două mase: cel gol capătă viteză mai repede. */
export function FigDouaCarucioare() {
  return (
    <Schema
      vb="0 0 460 210"
      latime={460}
      eticheta="Doi operatori împing cu aceeași forță un cărucior gol și unul plin cu cărbune"
      legenda="Aceeași forță, aplicată unui cărucior gol și unuia plin: viteza celui gol crește mult mai repede, fiindcă masa lui e mai mică."
    >
      <Sol x0={20} x1={440} y={168} h={11} />
      <Operator x={42} sol={168} spre={1} />
      <Carucior x={78} sol={168} />
      <Punct x={78} y={124} />
      <Text x={70} y={120} ancora="end" marime={12}>A</Text>
      <Sageata x1={78} y1={124} x2={124} y2={124} culoare={COL.aplicata} />
      <Simbol x={102} y={114} culoare={COL.aplicata}>F</Simbol>
      <Text x={133} y={196} ancora="middle" marime={11}>cărucior gol</Text>

      <Operator x={262} sol={168} spre={1} />
      <Carucior x={298} sol={168} plin />
      <Punct x={298} y={124} />
      <Text x={290} y={120} ancora="end" marime={12}>A</Text>
      <Sageata x1={298} y1={124} x2={344} y2={124} culoare={COL.aplicata} />
      <Simbol x={322} y={114} culoare={COL.aplicata}>F</Simbol>
      <Text x={353} y={196} ancora="middle" marime={11}>cărucior plin</Text>
    </Schema>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   C3 — PRINCIPIUL INERȚIEI
   ══════════════════════════════════════════════════════════════════════════ */

/** Obiectul așezat pe masă: greutatea și reacțiunea mesei se compensează. */
export function FigObiectPeMasa() {
  return (
    <Schema
      vb="0 0 420 240"
      latime={420}
      eticheta="Un obiect în repaus pe o masă, cu greutatea în jos și reacțiunea mesei în sus"
      legenda="Obiectul stă în repaus pe masă: greutatea P și reacțiunea R a mesei au aceeași valoare și sensuri opuse, deci se compensează."
    >
      <path d="M 60 130 L 300 130 L 360 100 L 120 100 Z" fill={COL.lemn} stroke={CULORI.contur} strokeWidth={1.4} />
      <rect x={60} y={130} width={240} height={8} fill={COL.lemnUmbra} />
      <Fir d="M 75 138 L 75 206" culoare={COL.lemnUmbra} grosime={5} />
      <Fir d="M 285 138 L 285 206" culoare={COL.lemnUmbra} grosime={5} />
      <Fir d="M 135 106 L 135 180" culoare={COL.lemnUmbra} grosime={5} />
      <Fir d="M 345 106 L 345 180" culoare={COL.lemnUmbra} grosime={5} />
      <rect x={186} y={88} width={44} height={30} fill={COL.corp} stroke={CULORI.contur} strokeWidth={1.4} />
      <Punct x={208} y={103} />
      <Text x={218} y={99} marime={12}>G</Text>
      <Sageata x1={208} y1={100} x2={208} y2={44} culoare={COL.reactiune} />
      <Simbol x={195} y={44} culoare={COL.reactiune} marime={15}>R</Simbol>
      <Sageata x1={208} y1={106} x2={208} y2={170} culoare={COL.greutate} />
      <Simbol x={195} y={166} culoare={COL.greutate} marime={15}>P</Simbol>
    </Schema>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   C4 — PRINCIPIUL ACȚIUNILOR RECIPROCE
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

/** Coarda întinsă între două puncte fixe: tensiunile de la capete. */
export function FigTensiuneCoarda() {
  return (
    <Schema
      vb="0 0 440 160"
      latime={440}
      eticheta="O coardă întinsă între două suporturi, cu tensiunile de la cele două capete"
      legenda="Coarda întinsă trage la fiecare capăt, paralel cu ea. Cele două tensiuni au aceeași valoare și aceeași direcție, dar sensuri opuse."
    >
      <rect x={38} y={44} width={20} height={72} fill={COL.corp} stroke={CULORI.contur} strokeWidth={1.4} />
      <rect x={382} y={44} width={20} height={72} fill={COL.corp} stroke={CULORI.contur} strokeWidth={1.4} />
      <rect x={58} y={72} width={324} height={14} fill={COL.lemn} stroke={CULORI.contur} strokeWidth={1.3} />
      <Sageata x1={116} y1={58} x2={64} y2={58} culoare={COL.tensiune} />
      <Sageata x1={324} y1={58} x2={376} y2={58} culoare={COL.tensiune} />
      <Simbol x={126} y={54} ancora="start" culoare={COL.tensiune} marime={15}>T_1</Simbol>
      <Simbol x={314} y={54} ancora="end" culoare={COL.tensiune} marime={15}>T_2</Simbol>
      <Text x={220} y={128} ancora="middle" marime={11} culoare={CULORI.slab}>coarda</Text>
    </Schema>
  );
}

/** Trasul de frânghie: tensiunea are aceeași valoare la cele două capete. */
export function FigTrasDeFranghie() {
  return (
    <Schema
      vb="0 0 460 210"
      latime={460}
      eticheta="Două echipe trag de aceeași frânghie, în sensuri opuse"
      legenda="Frânghia trage fiecare echipă spre mijloc. Tensiunea are aceeași valoare la cele două capete, oricâți oameni ar fi de o parte și de alta."
    >
      <Sol x0={20} x1={440} y={166} h={11} />
      <Operator x={70} sol={166} spre={1} />
      <Operator x={110} sol={166} spre={1} />
      <Operator x={150} sol={166} spre={1} />
      <Operator x={310} sol={166} spre={-1} />
      <Operator x={350} sol={166} spre={-1} />
      <Operator x={390} sol={166} spre={-1} />
      <Fir d="M 96 118 L 364 118" culoare={COL.lemn} grosime={5} />
      <Sageata x1={186} y1={100} x2={228} y2={100} culoare={COL.tensiune} />
      <Sageata x1={274} y1={100} x2={232} y2={100} culoare={COL.tensiune} />
      <Simbol x={180} y={94} ancora="end" culoare={COL.tensiune} marime={15}>T_1</Simbol>
      <Simbol x={280} y={94} ancora="start" culoare={COL.tensiune} marime={15}>T_2</Simbol>
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

/* ══════════════════════════════════════════════════════════════════════════
   LP1 — DINAMOMETRUL, BILA DE OȚEL, SCARA
   ══════════════════════════════════════════════════════════════════════════ */

/** Dinamometrul cu cadran din problemă: acul stă în dreptul lui 6. */
export function FigDinamometruCadran() {
  const cifre = [];
  for (let i = 0; i <= 10; i += 1) {
    const a = ((100 + i * 32) * Math.PI) / 180;
    cifre.push(
      <Text key={i} x={150 + 46 * Math.cos(a)} y={90 + 46 * Math.sin(a) + 4} ancora="middle" marime={12}>
        {String(i)}
      </Text>,
    );
  }
  const aAc = ((100 + 6 * 32) * Math.PI) / 180;
  return (
    <Schema
      vb="0 0 300 330"
      latime={260}
      eticheta="Dinamometru cu cadran, cu acul pe 6, de care atârnă o minge"
      legenda="Dinamometrul cu cadran de care e agățată mingea. Acul arată 6 N."
    >
      <circle cx={150} cy={90} r={62} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.8} />
      {cifre}
      <path
        d={`M 150 90 L ${150 + 34 * Math.cos(aAc)} ${90 + 34 * Math.sin(aAc)}`}
        stroke={COL.greutate}
        strokeWidth={3.4}
        strokeLinecap="round"
      />
      <circle cx={150} cy={90} r={9} fill="#2a5560" />
      <Fir d="M 150 152 L 150 226" />
      <circle cx={150} cy={262} r={34} fill={COL.minge} stroke={CULORI.contur} strokeWidth={1.6} />
      <ArcCerc cx={150} cy={262} r={34} a1={-70} a2={70} culoare={CULORI.contur} grosime={1.2} />
      <ArcCerc cx={150} cy={262} r={34} a1={110} a2={250} culoare={CULORI.contur} grosime={1.2} />
      <Text x={196} y={230} marime={12}>mingea</Text>
    </Schema>
  );
}

/** Bila de oțel atârnată de un fir și atrasă de un magnet. */
export function FigBilaMagnet({ forte }) {
  return (
    <Schema
      vb="0 0 420 290"
      latime={420}
      eticheta="O bilă de oțel atârnată de un fir înclinat, atrasă de un magnet așezat alături"
      legenda={
        forte
          ? 'Bila e în echilibru sub trei forțe: greutatea P, forța F a magnetului și tensiunea T a firului.'
          : 'Bila de oțel, agățată de un fir, e atrasă de magnet. Firul face unghiul α cu verticala.'
      }
    >
      <rect x={110} y={40} width={112} height={20} fill="#f2e2b0" stroke={CULORI.contur} strokeWidth={1.4} />
      <Fir d="M 165 60 L 165 236" punctat culoare={CULORI.slab} grosime={1.1} />
      <Fir d="M 165 60 L 250 190" grosime={1.8} />
      <ArcCerc cx={165} cy={60} r={62} a1={90} a2={57} culoare={CULORI.slab} />
      <Text x={186} y={140} marime={13} culoare={CULORI.slab}>α</Text>
      <circle cx={250} cy={190} r={12} fill={COL.metal} stroke={CULORI.contur} strokeWidth={1.6} />
      <rect x={330} y={177} width={30} height={26} fill="#e59a9a" stroke={CULORI.contur} strokeWidth={1.4} />
      <rect x={360} y={177} width={30} height={26} fill={COL.metal} stroke={CULORI.contur} strokeWidth={1.4} />
      <Text x={345} y={195} ancora="middle" marime={13}>N</Text>
      <Text x={375} y={195} ancora="middle" marime={13}>S</Text>
      <Text x={360} y={166} ancora="middle" marime={11}>magnet</Text>
      {forte && (
        <>
          <Sageata x1={250} y1={190} x2={196} y2={107} culoare={COL.tensiune} />
          <Simbol x={228} y={124} culoare={COL.tensiune} marime={15}>T</Simbol>
          <Sageata x1={250} y1={190} x2={312} y2={190} culoare={COL.aplicata} />
          <Simbol x={284} y={180} culoare={COL.aplicata} marime={15}>F</Simbol>
          <Sageata x1={250} y1={190} x2={250} y2={252} culoare={COL.greutate} />
          <Simbol x={264} y={240} culoare={COL.greutate} marime={15}>P</Simbol>
        </>
      )}
    </Schema>
  );
}

/** Scara sprijinită de un zid neted. */
export function FigScaraZid({ forte }) {
  return (
    <Schema
      vb="0 0 400 270"
      latime={400}
      eticheta="O scară sprijinită de un zid, cu capătul de jos pe sol"
      legenda={
        forte
          ? 'Scara e în echilibru sub trei forțe: greutatea P, reacțiunea zidului Rₘ (perpendiculară pe zid) și reacțiunea solului Rₛ.'
          : 'Scara se sprijină de un zid neted și stă pe un sol aspru, care o împiedică să alunece.'
      }
    >
      <Sol x0={60} x1={352} y={206} h={14} />
      <rect x={110} y={40} width={26} height={166} fill={COL.zid} stroke={CULORI.contur} strokeWidth={1.4} />
      <Fir d="M 136 55 L 330 206" culoare="#8a5a2b" grosime={6} />
      <Text x={100} y={130} ancora="end" marime={12}>zidul</Text>
      <Text x={296} y={112} marime={12}>scara</Text>
      <Text x={230} y={238} ancora="middle" marime={11}>solul</Text>
      {forte && (
        <>
          <Sageata x1={136} y1={55} x2={206} y2={55} culoare={COL.reactiune} />
          <Simbol x={172} y={44} ancora="middle" culoare={COL.reactiune} marime={15}>R_m</Simbol>
          <Sageata x1={233} y1={130} x2={233} y2={192} culoare={COL.greutate} />
          <Simbol x={246} y={176} culoare={COL.greutate} marime={15}>P</Simbol>
          <Sageata x1={330} y1={206} x2={274} y2={140} culoare={COL.tensiune} />
          <Simbol x={330} y={158} culoare={COL.tensiune} marime={15}>R_s</Simbol>
        </>
      )}
    </Schema>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LP2 — TRAIECTORII, PROIECȚII, CRONOFOTOGRAFII
   ══════════════════════════════════════════════════════════════════════════ */

const BALX = [108, 156, 204, 252, 300, 348, 396];
const BALY = [142, 97, 70, 61, 70, 97, 142];

/** Traiectoria unui corp aruncat oblic, înregistrată la intervale egale. */
export function FigTraiectorieBalistica({ forte }) {
  return (
    <Schema
      vb="0 0 470 270"
      latime={470}
      eticheta="Pozițiile succesive ale unui corp aruncat oblic, la intervale egale de timp"
      legenda={
        forte
          ? 'Singura forță este greutatea, verticală și îndreptată în jos. Proiecțiile pozițiilor pe orizontală sunt egal depărtate: pe orizontală mișcarea rămâne rectilinie uniformă.'
          : 'Corpul e aruncat din O cu viteza V, sub unghiul α față de orizontală. Pozițiile sunt înregistrate la intervale egale de timp.'
      }
    >
      <Sol x0={30} x1={452} y={205} h={16} />
      <Cruce x={60} y={205} />
      <Text x={50} y={224} ancora="end" marime={13}>O</Text>
      <Sageata x1={60} y1={205} x2={116} y2={148} />
      <Simbol x={100} y={136} marime={15}>V</Simbol>
      <ArcCerc cx={60} cy={205} r={40} a1={0} a2={-45} culoare={CULORI.slab} />
      <Text x={112} y={198} marime={12} culoare={CULORI.slab}>α</Text>
      {BALX.map((x, i) => (
        <Punct key={`p${x}`} x={x} y={BALY[i]} r={4} />
      ))}
      {forte && (
        <>
          {BALX.map((x, i) => (
            <g key={`f${x}`}>
              <Sageata x1={x} y1={BALY[i]} x2={x} y2={BALY[i] + 30} culoare={COL.greutate} grosime={1.7} />
              <Fir d={`M ${x} ${BALY[i]} L ${x} 205`} punctat culoare={CULORI.slab} grosime={1} />
              <Cruce x={x} y={205} d={4} />
            </g>
          ))}
          <Simbol x={266} y={86} culoare={COL.greutate} marime={15}>P</Simbol>
        </>
      )}
    </Schema>
  );
}

/** Bila aruncată drept în sus cu 10 m/s: urcă și cade după 2,0 s. */
export function FigBilaVerticala() {
  return (
    <Schema
      vb="0 0 300 260"
      latime={280}
      eticheta="O bilă aruncată vertical în sus urcă și apoi coboară pe aceeași verticală"
      legenda="Bila e aruncată drept în sus cu 10 m/s. Urcă, se oprește o clipă și cade înapoi: atinge solul după 2,0 s."
    >
      <Sol x0={40} x1={260} y={200} h={14} />
      <Sageata x1={130} y1={196} x2={130} y2={56} culoare={COL.greutate} />
      <Sageata x1={162} y1={56} x2={162} y2={196} culoare={COL.greutate} />
      <Text x={122} y={48} ancora="end" marime={12}>10 m/s</Text>
      <Text x={126} y={238} ancora="end" marime={12}>t = 0</Text>
      <Text x={168} y={238} marime={12}>t = 2,0 s</Text>
    </Schema>
  );
}

/** Viteza de aruncare, înclinată la 45°, și cele două părți ale ei. */
export function FigBila45() {
  return (
    <Schema
      vb="0 0 340 230"
      latime={340}
      eticheta="Viteza de aruncare, înclinată la 45 de grade, cu partea ei orizontală și cea verticală"
      legenda="De data aceasta bila e aruncată sub 45°: pe orizontală pleacă cu 10 m/s, iar pe verticală tot cu 10 m/s."
    >
      <Sol x0={40} x1={300} y={178} h={12} />
      <Sageata x1={80} y1={170} x2={140} y2={170} grosime={1.7} />
      <Sageata x1={80} y1={170} x2={80} y2={110} grosime={1.7} />
      <Simbol x={112} y={188} marime={13}>i</Simbol>
      <Simbol x={64} y={140} marime={13}>j</Simbol>
      <Sageata x1={80} y1={170} x2={200} y2={50} culoare={COL.greutate} grosime={2.4} />
      <Simbol x={152} y={82} culoare={COL.greutate} marime={15}>v</Simbol>
      <Fir d="M 200 50 L 200 170 M 200 50 L 80 50" punctat culoare={CULORI.slab} grosime={1.1} />
      <Text x={72} y={44} ancora="end" marime={12}>10 m/s</Text>
      <Text x={140} y={202} ancora="middle" marime={12}>10 m/s</Text>
      <ArcCerc cx={80} cy={170} r={40} a1={0} a2={-45} culoare={CULORI.slab} />
      <Text x={126} y={162} marime={11} culoare={CULORI.slab}>45°</Text>
    </Schema>
  );
}

/** Traiectoria bilei aruncate sub 45°. */
export function FigTraiectorieBila45() {
  return (
    <Schema
      vb="0 0 420 220"
      latime={420}
      eticheta="Traiectoria curbată a bilei aruncate sub 45 de grade"
      legenda="Traiectoria bilei aruncate sub 45°: urcă, se rotunjește la vârf și coboară."
    >
      <Sol x0={30} x1={390} y={175} h={14} />
      <path d="M 70 175 Q 220 15 370 175" fill="none" stroke={COL.greutate} strokeWidth={2} />
      <Sageata x1={70} y1={175} x2={130} y2={115} />
      <Simbol x={116} y={104} marime={15}>v</Simbol>
      <ArcCerc cx={70} cy={175} r={36} a1={0} a2={-45} culoare={CULORI.slab} />
      <Text x={112} y={168} marime={11} culoare={CULORI.slab}>45°</Text>
      <Text x={286} y={62} marime={11} culoare={CULORI.slab}>traiectoria bilei</Text>
    </Schema>
  );
}

const CRX = [84, 118, 152, 186, 220, 254, 288];
const CRY = [58, 58, 58, 71.5, 112, 179.5, 274];

/** Cronofotografia bilei care aleargă pe masă și apoi cade. */
export function FigCronofotoBila({ proiectii }) {
  return (
    <Schema
      vb="0 0 440 330"
      latime={440}
      eticheta="Cronofotografia unei bile care rulează pe o masă și apoi cade de pe marginea ei"
      legenda={
        proiectii
          ? 'Proiecțiile pe orizontală rămân egal depărtate — mișcarea pe Ox e uniformă; proiecțiile pe verticală se depărtează tot mai mult — mișcarea pe Oz e accelerată.'
          : 'Bila rulează pe masă (M₀ – M₂), apoi cade de pe marginea mesei (M₂ – M₆). Între două poziții trece mereu același timp.'
      }
    >
      <Grila x0={50} y0={50} x1={390} y1={288} pas={34} />
      <rect x={50} y={58} width={120} height={14} fill={COL.lemn} opacity={0.75} />
      <rect x={152} y={72} width={26} height={190} fill={COL.lemn} opacity={0.75} />
      <Sageata x1={50} y1={50} x2={420} y2={50} grosime={1.5} />
      <Sageata x1={50} y1={50} x2={50} y2={312} grosime={1.5} />
      <Text x={426} y={54} marime={13}>x</Text>
      <Text x={38} y={314} ancora="end" marime={13}>z</Text>
      <Text x={38} y={46} ancora="end" marime={13}>O</Text>
      {CRX.map((x, i) => (
        <g key={`m${x}`}>
          <Punct x={x} y={CRY[i]} r={3.4} />
          <Simbol x={x - 4} y={CRY[i] - 9} ancora="end" marime={12}>{`M_${i}`}</Simbol>
        </g>
      ))}
      {proiectii && (
        <>
          {[3, 4, 5, 6].map((i) => (
            <g key={`pr${i}`}>
              <Fir d={`M ${CRX[i]} ${CRY[i]} L ${CRX[i]} 50`} punctat culoare={CULORI.slab} grosime={1} />
              <Fir d={`M ${CRX[i]} ${CRY[i]} L 50 ${CRY[i]}`} punctat culoare={CULORI.slab} grosime={1} />
              <Punct x={CRX[i]} y={50} r={3} culoare={COL.reactiune} />
              <Punct x={50} y={CRY[i]} r={3} culoare={COL.tensiune} />
            </g>
          ))}
          <Text x={300} y={40} marime={11} culoare={COL.reactiune}>proiecțiile pe Ox</Text>
          <Text x={64} y={306} marime={11} culoare={COL.tensiune}>proiecțiile pe Oz</Text>
        </>
      )}
    </Schema>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LP3 — SCHIORUL, AUTOMOBILUL, PALETUL
   ══════════════════════════════════════════════════════════════════════════ */

/** Schiorul care coboară o pârtie cu pantă constantă, la viteză constantă. */
export function FigSchior({ forte }) {
  return (
    <Schema
      vb="0 0 440 260"
      latime={440}
      eticheta="Un schior coboară o pârtie înclinată, cu viteză constantă"
      legenda={
        forte
          ? 'Schiorul coboară cu viteză constantă pe o pârtie dreaptă: greutatea P și reacțiunea R a pârtiei se compensează. Reacțiunea are o parte perpendiculară pe pârtie (N) și una de frecare, paralelă cu pârtia (F).'
          : 'Schiorul coboară cu viteză constantă o pârtie înzăpezită, cu pantă constantă.'
      }
    >
      <path d="M 40 80 L 380 208 L 380 244 L 40 116 Z" fill={COL.gheata} stroke={CULORI.contur} strokeWidth={1.2} />
      <circle cx={190} cy={98} r={9} fill="#8fbf7f" stroke={CULORI.contur} strokeWidth={1.1} />
      <Fir d="M 190 107 L 198 132" grosime={11} culoare="#8fbf7f" />
      <Fir d="M 198 132 L 214 142" grosime={6} culoare="#8fbf7f" />
      <Fir d="M 193 112 L 214 108" grosime={5} culoare="#8fbf7f" />
      <Fir d="M 176 138 L 236 160" grosime={3.4} />
      <Text x={314} y={190} marime={12}>pârtia</Text>
      {forte && (
        <>
          <Sageata x1={200} y1={140} x2={200} y2={218} culoare={COL.greutate} />
          <Simbol x={213} y={206} culoare={COL.greutate} marime={15}>P</Simbol>
          <Sageata x1={200} y1={140} x2={226} y2={70} culoare={COL.tensiune} />
          <Simbol x={238} y={66} culoare={COL.tensiune} marime={15}>N</Simbol>
          <Sageata x1={200} y1={140} x2={174} y2={130} culoare={COL.aplicata} />
          <Simbol x={162} y={122} ancora="end" culoare={COL.aplicata} marime={15}>F</Simbol>
          <Sageata x1={200} y1={140} x2={200} y2={62} culoare={COL.reactiune} />
          <Simbol x={187} y={58} ancora="end" culoare={COL.reactiune} marime={15}>R</Simbol>
          <Fir d="M 226 70 L 200 62 M 174 130 L 200 62" punctat culoare={CULORI.slab} grosime={1} />
        </>
      )}
    </Schema>
  );
}

/** Viteza automobilului în funcție de timp: accelerare, palier, frânare. */
export function FigGraficVitezaMasina() {
  return (
    <Schema
      vb="0 0 420 270"
      latime={420}
      eticheta="Graficul vitezei automobilului în funcție de timp"
      legenda="Viteza automobilului în funcție de timp: crește 9 s, rămâne constantă 12 s, apoi scade până la oprire, în 5 s."
    >
      <Sageata x1={70} y1={200} x2={392} y2={200} grosime={1.5} />
      <Sageata x1={70} y1={200} x2={70} y2={44} grosime={1.5} />
      <Text x={70} y={34} ancora="middle" marime={11}>viteza (km/h)</Text>
      <Text x={392} y={246} ancora="end" marime={11}>timpul (s)</Text>
      <Fir d="M 169 70 L 169 200 M 301 70 L 301 200 M 70 70 L 169 70" punctat culoare={CULORI.slab} grosime={1} />
      <path d="M 70 200 L 169 70 L 301 70 L 356 200" fill="none" stroke={COL.greutate} strokeWidth={2.2} />
      <Text x={62} y={205} ancora="end" marime={11}>0</Text>
      <Text x={62} y={75} ancora="end" marime={11}>80</Text>
      <Text x={169} y={218} ancora="middle" marime={11}>9</Text>
      <Text x={301} y={218} ancora="middle" marime={11}>21</Text>
      <Text x={356} y={218} ancora="middle" marime={11}>26</Text>
    </Schema>
  );
}

/** Paletul de hochei pe gheață. Cu `frecare`, gheața nu mai e perfect alunecoasă. */
export function FigPalet({ frecare }) {
  return (
    <Schema
      vb="0 0 440 250"
      latime={440}
      eticheta="Un palet de hochei pe gheață, cu forțele care se exercită asupra lui"
      legenda={
        frecare
          ? 'Când frecările nu mai sunt neglijabile, reacțiunea gheții se înclină: are și o parte orizontală, care se opune mișcării. Greutatea și reacțiunea nu se mai compensează, iar paletul încetinește.'
          : 'Paletul stă nemișcat pe gheață: greutatea P și reacțiunea R a gheții se compensează.'
      }
    >
      <path
        d="M 60 168 C 38 138 92 108 152 110 C 212 94 302 98 352 118 C 402 138 392 190 332 196 C 250 210 108 204 60 168 Z"
        fill={COL.gheata}
        stroke={CULORI.contur}
        strokeWidth={1.2}
      />
      <rect x={170} y={132} width={90} height={26} fill={COL.metal} stroke={CULORI.contur} strokeWidth={1.4} />
      <ellipse cx={215} cy={158} rx={45} ry={13} fill={COL.metal} stroke={CULORI.contur} strokeWidth={1.4} />
      <ellipse cx={215} cy={132} rx={45} ry={13} fill="#d3dade" stroke={CULORI.contur} strokeWidth={1.4} />
      <Punct x={215} y={140} />
      <Text x={200} y={136} ancora="end" marime={12}>G</Text>
      <Text x={78} y={196} marime={11}>gheața</Text>
      <Text x={286} y={104} marime={11}>paletul</Text>
      <Sageata x1={215} y1={140} x2={215} y2={214} culoare={COL.greutate} />
      <Simbol x={228} y={206} culoare={COL.greutate} marime={15}>P</Simbol>
      {frecare ? (
        <>
          <Sageata x1={215} y1={140} x2={252} y2={68} culoare={COL.reactiune} />
          <Simbol x={264} y={66} culoare={COL.reactiune} marime={15}>R</Simbol>
          <Sageata x1={168} y1={126} x2={106} y2={112} culoare={COL.tensiune} />
          <Simbol x={128} y={98} culoare={COL.tensiune} marime={15}>v</Simbol>
          <Sageata x1={215} y1={146} x2={286} y2={146} culoare={COL.aplicata} />
          <Text x={294} y={150} marime={12} culoare={COL.aplicata}>P + R</Text>
        </>
      ) : (
        <>
          <Sageata x1={215} y1={140} x2={215} y2={62} culoare={COL.reactiune} />
          <Simbol x={228} y={62} culoare={COL.reactiune} marime={15}>R</Simbol>
        </>
      )}
    </Schema>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LP4 — MAȘINA, MAIMUȚA, MOBILUL PE PERNĂ DE AER
   ══════════════════════════════════════════════════════════════════════════ */

/** Automobilul care rulează cu viteză constantă pe o șosea dreaptă. */
export function FigMasina({ forte }) {
  return (
    <Schema
      vb="0 0 460 250"
      latime={460}
      eticheta="Un automobil care rulează cu viteză constantă pe o șosea orizontală"
      legenda={
        forte
          ? 'Bilanțul forțelor: greutatea P, forța F a aerului (îndreptată spre spate) și reacțiunea șoselei, aplicată jumătate pe puntea din față (R₁) și jumătate pe cea din spate (R₂).'
          : 'Automobilul rulează cu viteză constantă pe o șosea dreaptă și orizontală.'
      }
    >
      <Sol x0={30} x1={430} y={182} h={14} />
      <path
        d="M 110 164 L 110 134 Q 111 121 128 121 L 180 121 L 212 94 L 300 94 L 330 121 L 358 123 Q 372 127 372 141 L 372 164 Z"
        fill={COL.corp}
        stroke={CULORI.contur}
        strokeWidth={1.6}
      />
      <path d="M 218 100 L 254 100 L 254 120 L 200 120 Z" fill="#e6f2f5" stroke={CULORI.contur} strokeWidth={1.1} />
      <path d="M 262 100 L 296 100 L 322 120 L 262 120 Z" fill="#e6f2f5" stroke={CULORI.contur} strokeWidth={1.1} />
      <circle cx={160} cy={166} r={17} fill="#4a4a4a" />
      <circle cx={160} cy={166} r={7} fill={COL.metal} />
      <circle cx={322} cy={166} r={17} fill="#4a4a4a" />
      <circle cx={322} cy={166} r={7} fill={COL.metal} />
      {forte && (
        <>
          <Sageata x1={210} y1={80} x2={146} y2={80} culoare={COL.aplicata} />
          <Simbol x={172} y={70} culoare={COL.aplicata} marime={15}>F</Simbol>
          <Sageata x1={240} y1={128} x2={240} y2={180} culoare={COL.greutate} />
          <Simbol x={254} y={180} culoare={COL.greutate} marime={15}>P</Simbol>
          <Sageata x1={322} y1={150} x2={344} y2={100} culoare={COL.reactiune} />
          <Simbol x={358} y={98} culoare={COL.reactiune} marime={15}>R_1</Simbol>
          <Sageata x1={160} y1={150} x2={182} y2={100} culoare={COL.reactiune} />
          <Simbol x={196} y={98} culoare={COL.reactiune} marime={15}>R_2</Simbol>
        </>
      )}
      <Text x={230} y={222} ancora="middle" marime={11} culoare={CULORI.slab}>sensul de mers: spre dreapta</Text>
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

/** Maimuța agățată de o liană prinsă de două ramuri. */
export function FigMaimutaLiana({ etapa = 0 }) {
  return (
    <Schema
      vb="0 0 460 290"
      latime={460}
      eticheta="O maimuță agățată de mijlocul unei liane prinse de două ramuri"
      legenda={
        etapa === 2
          ? 'Liana trage de fiecare ramură, în A și în B, cu o forță îndreptată de-a lungul ei. Cele trei forțe care se exercită asupra lianei se compensează.'
          : etapa === 1
            ? 'Maimuța e în echilibru: greutatea P și reacțiunea R a lianei au aceeași valoare și sensuri opuse.'
            : 'Maimuța e agățată de mijlocul unei liane, prinsă de două ramuri, în A și în B.'
      }
    >
      <rect x={70} y={150} width={26} height={112} fill={COL.trunchi} />
      <rect x={364} y={150} width={26} height={112} fill={COL.trunchi} />
      <circle cx={83} cy={118} r={46} fill={COL.frunze} />
      <circle cx={52} cy={140} r={28} fill={COL.frunze} />
      <circle cx={116} cy={138} r={28} fill={COL.frunze} />
      <circle cx={377} cy={118} r={46} fill={COL.frunze} />
      <circle cx={346} cy={138} r={28} fill={COL.frunze} />
      <circle cx={408} cy={140} r={28} fill={COL.frunze} />
      <Fir d="M 128 140 L 230 178 L 330 140" culoare="#7a5230" grosime={2.4} />
      <Punct x={128} y={140} />
      <Punct x={330} y={140} />
      <Text x={124} y={130} ancora="end" marime={13}>A</Text>
      <Text x={334} y={130} marime={13}>B</Text>
      <circle cx={230} cy={198} r={11} fill="#6b4a2f" />
      <ellipse cx={230} cy={220} rx={13} ry={19} fill="#6b4a2f" />
      <Fir d="M 222 190 L 230 178 L 238 190" culoare="#6b4a2f" grosime={4} />
      <Fir d="M 224 238 L 220 254 M 236 238 L 240 254" culoare="#6b4a2f" grosime={4} />
      {etapa >= 1 && (
        <>
          <Sageata x1={230} y1={192} x2={230} y2={126} culoare={COL.reactiune} />
          <Simbol x={243} y={128} culoare={COL.reactiune} marime={15}>R</Simbol>
          <Sageata x1={230} y1={200} x2={230} y2={266} culoare={COL.greutate} />
          <Simbol x={243} y={258} culoare={COL.greutate} marime={15}>P</Simbol>
        </>
      )}
      {etapa === 2 && (
        <>
          <Sageata x1={128} y1={140} x2={186} y2={162} culoare={COL.tensiune} />
          <Sageata x1={330} y1={140} x2={272} y2={162} culoare={COL.tensiune} />
          <Simbol x={172} y={182} ancora="middle" culoare={COL.tensiune} marime={15}>F_A</Simbol>
          <Simbol x={288} y={182} ancora="middle" culoare={COL.tensiune} marime={15}>F_B</Simbol>
        </>
      )}
    </Schema>
  );
}

/** Mobilul pe pernă de aer, ținut între un resort și o coardă. */
export function FigMobilArc({ forte }) {
  const zig = [];
  for (let i = 0; i <= 8; i += 1) {
    const x = 68 + i * 10;
    zig.push(`${x} ${i % 2 === 0 ? 90 : 110}`);
  }
  return (
    <Schema
      vb="0 0 460 220"
      latime={460}
      eticheta="Un mobil pe pernă de aer, legat în stânga de un resort și în dreapta de o coardă ținută de un operator"
      legenda={
        forte
          ? 'Mobilul stă pe loc: forțele orizontale se anulează două câte două (T₁ și T₂), iar forțele verticale la fel (P și R).'
          : 'Mobilul pe pernă de aer e legat în stânga de un resort prins de un punct fix, iar în dreapta de o coardă pe care o poate întinde un operator.'
      }
    >
      <Fixare x={60} y0={60} y1={140} spre={1} />
      <Text x={54} y={52} ancora="end" marime={11}>punct fix</Text>
      <Fir d={`M 60 100 L 68 100 L ${zig.join(' L ')} L 148 100 L 166 100`} grosime={1.6} />
      <Text x={106} y={72} ancora="middle" marime={11}>resortul</Text>
      <rect x={166} y={86} width={68} height={34} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.5} />
      <ellipse cx={200} cy={120} rx={34} ry={11} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.5} />
      <ellipse cx={200} cy={86} rx={34} ry={11} fill="#fbeade" stroke={CULORI.contur} strokeWidth={1.5} />
      <Punct x={166} y={103} />
      <Text x={158} y={99} ancora="end" marime={12}>A</Text>
      <Text x={296} y={58} ancora="middle" marime={11}>mobil pe pernă de aer</Text>
      <Fir d="M 234 103 L 330 103" grosime={1.6} />
      <ellipse cx={356} cy={103} rx={26} ry={15} fill={COL.piele} stroke={CULORI.contur} strokeWidth={1.3} />
      <Text x={300} y={128} ancora="middle" marime={11}>coarda</Text>
      {forte && (
        <>
          <Sageata x1={200} y1={103} x2={138} y2={103} culoare={COL.tensiune} />
          <Simbol x={146} y={84} ancora="end" culoare={COL.tensiune} marime={15}>T_1</Simbol>
          <Sageata x1={200} y1={103} x2={274} y2={103} culoare={COL.tensiune} />
          <Simbol x={256} y={92} ancora="middle" culoare={COL.tensiune} marime={15}>T_2</Simbol>
          <Sageata x1={200} y1={103} x2={200} y2={44} culoare={COL.reactiune} />
          <Simbol x={214} y={44} culoare={COL.reactiune} marime={15}>R</Simbol>
          <Sageata x1={200} y1={103} x2={200} y2={172} culoare={COL.greutate} />
          <Simbol x={214} y={166} culoare={COL.greutate} marime={15}>P</Simbol>
        </>
      )}
    </Schema>
  );
}

const IMX = [70, 102.5, 135, 167.5, 200, 232.5, 265, 297.5, 330];
const IMY = [200, 190, 180, 170, 160, 150, 140, 130, 120];
const IMX2 = [302, 274, 246, 220, 197, 177, 160, 146, 135];
const IMY2 = [106, 92, 78, 68, 62, 58, 55, 53, 52];

/** Înregistrarea traiectoriei unui mobil pe pernă de aer, cu punctele B și C. */
export function FigInregistrareMobil({ analiza }) {
  return (
    <Schema
      vb="0 0 400 250"
      latime={400}
      eticheta="Înregistrarea pozițiilor succesive ale unui mobil pe pernă de aer"
      legenda={
        analiza
          ? 'Până în B punctele sunt aliniate și egal depărtate: mișcarea e rectilinie și uniformă. După C ele se apropie tot mai mult: mișcarea încetinește.'
          : 'Înregistrarea pozițiilor mobilului, luate la intervale egale de timp. B și C sunt două puncte în care se întâmplă ceva.'
      }
    >
      <rect x={40} y={30} width={330} height={196} fill="none" stroke={CULORI.slab} strokeWidth={1.2} />
      {analiza && (
        <>
          <Fir d="M 70 200 L 330 120" culoare={COL.reactiune} grosime={1.4} />
          <Sageata x1={70} y1={200} x2={108} y2={188} culoare={COL.reactiune} grosime={1.8} />
          <Text x={250} y={182} ancora="middle" marime={10} culoare={COL.reactiune}>puncte aliniate și egal depărtate</Text>
        </>
      )}
      {IMX.map((x, i) => (
        <Punct key={`a${i}`} x={x} y={IMY[i]} r={3.4} culoare={COL.greutate} />
      ))}
      {IMX2.map((x, i) => (
        <Punct key={`b${i}`} x={x} y={IMY2[i]} r={3.4} culoare={COL.greutate} />
      ))}
      <Text x={340} y={124} marime={13}>B</Text>
      <Text x={128} y={42} ancora="end" marime={13}>C</Text>
    </Schema>
  );
}

const BGX = [40, 100, 154, 202, 244, 280, 310, 334, 352, 364];

/** Înregistrarea unui mobil ale cărui poziții se apropie tot mai mult. */
export function FigInregistrareBergson() {
  return (
    <Schema
      vb="0 0 420 130"
      latime={420}
      eticheta="Un șir de puncte aliniate, cu distanțe care scad de la stânga la dreapta"
      legenda="Pozițiile mobilului, marcate la fiecare 50 ms. Punctele sunt aliniate, dar distanțele dintre ele scad."
    >
      {BGX.map((x, i) => (
        <Punct key={x} x={x} y={78} r={4} culoare={COL.greutate} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <Simbol key={`t${i}`} x={BGX[i]} y={54} ancora="middle" marime={13}>{`t_${i + 1}`}</Simbol>
      ))}
      <Text x={244} y={54} ancora="middle" marime={13}>…</Text>
    </Schema>
  );
}

const BGT = [75, 125, 175, 225, 275, 325, 375, 425, 475];
const BGV = [0.4, 0.36, 0.32, 0.28, 0.24, 0.2, 0.16, 0.12, 0.08];

/** Graficul vitezei mobilului în funcție de timp: o dreaptă care coboară. */
export function FigGraficBergson() {
  const px = (t) => 70 + t * 0.5;
  const py = (v) => 240 - v * 360;
  return (
    <Schema
      vb="0 0 440 300"
      latime={440}
      eticheta="Graficul vitezei mobilului în funcție de timp, format din puncte așezate pe o dreaptă"
      legenda="Punctele se așază pe o dreaptă care coboară: viteza mobilului scade regulat în timp."
    >
      <Grila x0={70} y0={60} x1={370} y1={240} pas={18} />
      <Sageata x1={70} y1={240} x2={400} y2={240} grosime={1.5} />
      <Sageata x1={70} y1={240} x2={70} y2={44} grosime={1.5} />
      <Text x={70} y={34} ancora="middle" marime={11}>v (m/s)</Text>
      <Text x={400} y={284} ancora="end" marime={11}>t (ms)</Text>
      <Fir d={`M ${px(0)} ${py(0.46)} L ${px(575)} ${py(0)}`} culoare={COL.greutate} grosime={1.8} />
      {BGT.map((t, i) => (
        <Cruce key={t} x={px(t)} y={py(BGV[i])} d={4} />
      ))}
      {[0.1, 0.2, 0.3, 0.4, 0.5].map((v) => (
        <Text key={v} x={62} y={py(v) + 4} ancora="end" marime={10}>{`0,${Math.round(v * 10)}`}</Text>
      ))}
      {[0, 100, 200, 300, 400, 500, 600].map((t) => (
        <Text key={t} x={px(t)} y={256} ancora="middle" marime={10}>{String(t)}</Text>
      ))}
    </Schema>
  );
}
