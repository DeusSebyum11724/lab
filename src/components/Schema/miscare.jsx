import React from 'react';
import { Schema, Text, Simbol, CULORI } from './index';

/**
 * FIGURILE CAPITOLULUI „DESCRIEREA MIȘCĂRII”.
 *
 * Manualul-sursă e un PDF scanat, deci figurile se REDESENEAZĂ în cod. Aici nu
 * sunt scheme de circuit, ci corabii, trenuri, roți și înregistrări
 * punct-cu-punct — de aceea primitivele din `index.jsx` (fir, nod, rezistor…)
 * nu ajung, iar simbolurile noi se definesc mai jos, în fișierul capitolului.
 *
 * ROȘUL NU E DECOR. Manualul colorează în roșu exact două lucruri: traiectoria
 * unui punct și săgeata-viteză. Le păstrăm roșii, fiindcă acolo culoarea
 * deosebește ce se studiază de restul desenului.
 *
 * ÎNREGISTRĂRILE PUNCT CU PUNCT (cronofotografiile) au coordonate CALCULATE, nu
 * ghicite: cicloida roții de bicicletă e trasată din ecuațiile ei, iar mobilul
 * pe pernă de aer are un arc de cerc urmat de o dreaptă tangentă, cu aceeași
 * distanță între două poziții vecine — altfel elevul care măsoară pe figură ar
 * obține alte viteze decât cele din rezolvare.
 */

const CONTUR = 'var(--kl-ink)';
const SLAB = 'var(--kl-ink3)';
const UMPLUT = '#f6d9c6';
const TRAI = CULORI.iese;
const GROS = 1.6;

/* ---------------------------------------------------------------- primitive */

/** Linie simplă; `punctat` o face întreruptă. */
function Linie({ d, culoare = CONTUR, grosime = GROS, punctat, umplere = 'none' }) {
  return (
    <path
      d={d}
      fill={umplere}
      stroke={culoare}
      strokeWidth={grosime}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={punctat ? '5 4' : undefined}
    />
  );
}

/**
 * Săgeata, de la (x1,y1) la (x2,y2).
 *
 * Identificatorul vârfului se construiește din culoare și din capete, ca două
 * săgeți diferite din aceeași pagină să nu-și fure vârful una alteia.
 */
function Sageata({ x1, y1, x2, y2, culoare = CONTUR, grosime = GROS, punctat, dubla }) {
  const id = `sg-${culoare.replace(/[^a-z0-9]/gi, '')}-${Math.round(x1)}-${Math.round(y1)}-${Math.round(x2)}-${Math.round(y2)}`;
  return (
    <g>
      <defs>
        <marker
          id={id}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={culoare} />
        </marker>
      </defs>
      <path
        d={`M ${x1} ${y1} L ${x2} ${y2}`}
        fill="none"
        stroke={culoare}
        strokeWidth={grosime}
        strokeLinecap="round"
        strokeDasharray={punctat ? '5 4' : undefined}
        markerEnd={`url(#${id})`}
        markerStart={dubla ? `url(#${id})` : undefined}
      />
    </g>
  );
}

/** Cotă orizontală cu săgeți la ambele capete și eticheta deasupra. */
function Cota({ x1, x2, y, eticheta, culoare = CONTUR, dedesubt, marime = 12 }) {
  return (
    <g>
      <Sageata x1={x1} y1={y} x2={x2} y2={y} culoare={culoare} grosime={1.3} dubla />
      <Text
        x={(x1 + x2) / 2}
        y={dedesubt ? y + marime + 4 : y - 6}
        ancora="middle"
        marime={marime}
        culoare={culoare}
      >
        {eticheta}
      </Text>
    </g>
  );
}

/** Punctul plin al unei înregistrări. */
function Punct({ x, y, r = 3, culoare = CONTUR }) {
  return <circle cx={x} cy={y} r={r} fill={culoare} />;
}

/** Crucea cu care manualul marchează pozițiile succesive ale unui punct. */
function Cruce({ x, y, r = 4.5, culoare = CONTUR, grosime = 1.3 }) {
  return (
    <path
      d={`M ${x - r} ${y} L ${x + r} ${y} M ${x} ${y - r} L ${x} ${y + r}`}
      stroke={culoare}
      strokeWidth={grosime}
      fill="none"
    />
  );
}

/** Chenarul unei înregistrări (manualul pune fiecare referențial în caseta lui). */
function Cadru({ x, y, l, h }) {
  return <rect x={x} y={y} width={l} height={h} fill="none" stroke={SLAB} strokeWidth={1.2} />;
}

/* ------------------------------------------------------------ glife simple */

/** Corabie cu catarg și două vele. Coordonatele se dau după linia de plutire. */
function Corabie({ x, y, scara = 1, opacitate = 1 }) {
  const s = scara;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} opacity={opacitate}>
      {/* coca */}
      <path
        d="M -56 0 L 56 0 L 42 20 L -42 20 Z"
        fill={SLAB}
        stroke={CONTUR}
        strokeWidth={GROS}
        strokeLinejoin="round"
      />
      {/* catargul */}
      <path d="M 0 0 L 0 -108" stroke={CONTUR} strokeWidth={2.4} strokeLinecap="round" />
      {/* vela din față */}
      <path
        d="M -2 -104 L -2 -12 L -46 -12 Q -30 -66 -2 -104 Z"
        fill={UMPLUT}
        stroke={CONTUR}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
      {/* vela mare */}
      <path
        d="M 2 -100 L 2 -12 L 50 -12 Q 34 -62 2 -100 Z"
        fill={UMPLUT}
        stroke={CONTUR}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
      {/* hublouri */}
      <circle cx={-18} cy={10} r={3} fill="none" stroke={CONTUR} strokeWidth={1} />
      <circle cx={-6} cy={10} r={3} fill="none" stroke={CONTUR} strokeWidth={1} />
      <circle cx={6} cy={10} r={3} fill="none" stroke={CONTUR} strokeWidth={1} />
    </g>
  );
}

/** Siluetă de om, văzută din profil. `x, y` = tălpile. */
function Om({ x, y, inaltime = 62, culoare = SLAB }) {
  const k = inaltime / 62;
  return (
    <g transform={`translate(${x},${y}) scale(${k})`}>
      <circle cx={0} cy={-54} r={7} fill={culoare} />
      <path d="M 0 -47 L 0 -22" stroke={culoare} strokeWidth={10} strokeLinecap="round" fill="none" />
      <path
        d="M 0 -40 L 10 -30 M 0 -40 L -9 -31"
        stroke={culoare}
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 0 -22 L -6 0 M 0 -22 L 7 0"
        stroke={culoare}
        strokeWidth={6}
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

/** Vagon de tren: cutie rotunjită, ferestre, roți. `x, y` = colțul de sus-stânga. */
function Vagon({ x, y, l = 200, h = 62 }) {
  const nf = 3;
  const lf = 34;
  const pas = l / (nf + 1);
  const ferestre = [];
  for (let i = 1; i <= nf; i += 1) {
    ferestre.push(
      <rect
        key={i}
        x={x + i * pas - lf / 2}
        y={y + 12}
        width={lf}
        height={22}
        rx={3}
        fill="none"
        stroke={CONTUR}
        strokeWidth={1.2}
      />
    );
  }
  return (
    <g>
      <rect x={x} y={y} width={l} height={h} rx={12} fill={UMPLUT} stroke={CONTUR} strokeWidth={GROS} />
      {ferestre}
      <circle cx={x + 30} cy={y + h + 7} r={7} fill="none" stroke={CONTUR} strokeWidth={1.4} />
      <circle cx={x + 58} cy={y + h + 7} r={7} fill="none" stroke={CONTUR} strokeWidth={1.4} />
      <circle cx={x + l - 58} cy={y + h + 7} r={7} fill="none" stroke={CONTUR} strokeWidth={1.4} />
      <circle cx={x + l - 30} cy={y + h + 7} r={7} fill="none" stroke={CONTUR} strokeWidth={1.4} />
    </g>
  );
}

/** Avion văzut de sus, cu două elice pe aripi. `x, y` = centrul fuzelajului. */
function AvionDeSus({ x, y, scara = 1 }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scara})`}>
      {/* aripile */}
      <path
        d="M -170 -12 L 170 -12 L 170 14 L -170 14 Z"
        fill={UMPLUT}
        stroke={CONTUR}
        strokeWidth={GROS}
        strokeLinejoin="round"
      />
      {/* fuzelajul */}
      <ellipse cx={0} cy={4} rx={22} ry={74} fill={SLAB} stroke={CONTUR} strokeWidth={GROS} />
      {/* ampenajul */}
      <path
        d="M -52 62 L 52 62 L 52 80 L -52 80 Z"
        fill={UMPLUT}
        stroke={CONTUR}
        strokeWidth={GROS}
        strokeLinejoin="round"
      />
      {/* elicea din stânga */}
      <ellipse cx={-96} cy={1} rx={9} ry={40} fill={UMPLUT} stroke={CONTUR} strokeWidth={1.3} />
      <circle cx={-96} cy={1} r={9} fill={SLAB} stroke={CONTUR} strokeWidth={1.3} />
      {/* elicea din dreapta */}
      <ellipse cx={96} cy={1} rx={9} ry={40} fill={UMPLUT} stroke={CONTUR} strokeWidth={1.3} />
      <circle cx={96} cy={1} r={9} fill={SLAB} stroke={CONTUR} strokeWidth={1.3} />
    </g>
  );
}

/** Tren mic, pentru schemele în care contează numai poziția. `x, y` = centrul. */
function TrenMic({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <path
        d="M -44 8 L -44 -10 L 22 -10 Q 44 -10 46 4 L 46 8 Z"
        fill={UMPLUT}
        stroke={CONTUR}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
      <rect x={-38} y={-6} width={12} height={8} fill="none" stroke={CONTUR} strokeWidth={0.9} />
      <rect x={-20} y={-6} width={12} height={8} fill="none" stroke={CONTUR} strokeWidth={0.9} />
      <rect x={-2} y={-6} width={12} height={8} fill="none" stroke={CONTUR} strokeWidth={0.9} />
      <circle cx={-30} cy={12} r={4} fill="none" stroke={CONTUR} strokeWidth={1.1} />
      <circle cx={30} cy={12} r={4} fill="none" stroke={CONTUR} strokeWidth={1.1} />
    </g>
  );
}

/** Căsuță, pentru capetele unui traseu. */
function Casa({ x, y, scara = 1 }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scara})`}>
      <path d="M -16 0 L -16 -18 L 16 -18 L 16 0 Z" fill={UMPLUT} stroke={CONTUR} strokeWidth={1.4} />
      <path d="M -20 -18 L 0 -32 L 20 -18 Z" fill={SLAB} stroke={CONTUR} strokeWidth={1.4} strokeLinejoin="round" />
      <rect x={-5} y={-11} width={10} height={11} fill="none" stroke={CONTUR} strokeWidth={1.1} />
    </g>
  );
}

/** Diligență: cutie pe două roți, trasă de un cal. `sens` = 1 spre dreapta. */
function Diligenta({ x, y, sens = 1 }) {
  return (
    <g transform={`translate(${x},${y}) scale(${sens},1)`}>
      {/* cutia */}
      <rect x={-52} y={-54} width={60} height={36} rx={5} fill={UMPLUT} stroke={CONTUR} strokeWidth={GROS} />
      <rect x={-42} y={-47} width={17} height={15} fill="none" stroke={CONTUR} strokeWidth={1.1} />
      <circle cx={-38} cy={-9} r={9} fill="none" stroke={CONTUR} strokeWidth={1.5} />
      <circle cx={-4} cy={-9} r={9} fill="none" stroke={CONTUR} strokeWidth={1.5} />
      <path d="M -52 -18 L 8 -18" stroke={CONTUR} strokeWidth={1.3} />
      {/* oiștea */}
      <path d="M 8 -32 L 30 -36" stroke={CONTUR} strokeWidth={1.4} />
      {/* calul */}
      <ellipse cx={50} cy={-38} rx={21} ry={12} fill={SLAB} stroke={CONTUR} strokeWidth={1.4} />
      <path d="M 64 -42 L 70 -52" stroke={SLAB} strokeWidth={9} strokeLinecap="round" />
      <ellipse cx={75} cy={-55} rx={10} ry={6} fill={SLAB} stroke={CONTUR} strokeWidth={1.3} />
      <path d="M 70 -60 L 68 -65 M 80 -59 L 82 -64" stroke={CONTUR} strokeWidth={1.5} strokeLinecap="round" />
      <path
        d="M 36 -28 L 33 -1 M 44 -27 L 46 -1 M 58 -27 L 56 -1 M 64 -28 L 67 -1"
        stroke={CONTUR}
        strokeWidth={2.2}
        strokeLinecap="round"
      />
      <path d="M 30 -42 L 20 -52" stroke={CONTUR} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
}

/** Vaca de pe marginea căii ferate. */
function Vaca({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <ellipse cx={0} cy={-30} rx={26} ry={13} fill={UMPLUT} stroke={CONTUR} strokeWidth={1.4} />
      <ellipse cx={-8} cy={-34} rx={7} ry={4} fill={SLAB} />
      <ellipse cx={7} cy={-26} rx={5} ry={3} fill={SLAB} />
      <path d="M 20 -36 L 28 -45" stroke={UMPLUT} strokeWidth={13} strokeLinecap="round" />
      <ellipse cx={33} cy={-48} rx={10} ry={6.5} fill={UMPLUT} stroke={CONTUR} strokeWidth={1.3} />
      <path d="M 28 -54 L 26 -59 M 39 -53 L 41 -58" stroke={CONTUR} strokeWidth={1.6} strokeLinecap="round" />
      <path
        d="M -16 -19 L -17 -1 M -6 -18 L -5 -1 M 8 -18 L 9 -1 M 17 -19 L 18 -1"
        stroke={CONTUR}
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <path d="M -26 -36 Q -37 -32 -35 -14" stroke={CONTUR} strokeWidth={1.6} fill="none" />
    </g>
  );
}

/* ============================================================ C1 — traiectoria */

/**
 * Mărul lăsat să cadă din vârful catargului, văzut de doi observatori.
 *
 * Stânga: observatorul A e pe punte, corabia stă pe loc față de el, iar mărul
 * cade pe o dreaptă. Dreapta: observatorul B stă într-o barcă, corabia trece
 * prin fața lui, iar mărul descrie o parabolă. Corăbiile palide din dreapta
 * sunt pozițiile mai vechi ale aceleiași corăbii.
 */
export function FigTraiectoriiMar() {
  const parabola = [
    [516, 120],
    [484, 138],
    [456, 164],
    [424, 204],
  ];
  return (
    <Schema
      vb="0 0 580 260"
      latime={580}
      eticheta="Mărul care cade din vârful catargului: pentru observatorul de pe punte traiectoria e o dreaptă, pentru observatorul din barcă e o parabolă."
      legenda="După observator, traiectoria e ori o dreaptă, ori o parabolă. Corabia din stânga stă pe loc în referențialul observatorului, cea din dreapta se îndreaptă spre stânga în referențialul lui."
    >
      {/* ---- panoul din stânga ---- */}
      <Text x={150} y={26} ancora="middle" marime={12}>
        traiectoria văzută de A
      </Text>
      <Corabie x={150} y={210} scara={0.86} />
      <Linie d="M 154 118 L 154 206" culoare={TRAI} grosime={1.4} punctat />
      <Punct x={154} y={120} r={5} culoare={TRAI} />
      <Punct x={154} y={148} r={5} culoare={TRAI} />
      <Punct x={154} y={176} r={5} culoare={TRAI} />
      <Punct x={154} y={204} r={5} culoare={TRAI} />
      <Text x={20} y={132} marime={12}>
        dreaptă
      </Text>
      <Linie d="M 72 128 L 148 152" culoare={SLAB} grosime={1.1} />

      {/* ---- panoul din dreapta ---- */}
      <Text x={430} y={26} ancora="middle" marime={12}>
        traiectoria văzută de B
      </Text>
      <Corabie x={516} y={210} scara={0.86} opacitate={0.22} />
      <Corabie x={470} y={210} scara={0.86} opacitate={0.42} />
      <Corabie x={424} y={210} scara={0.86} />
      <Linie d="M 516 120 Q 470 138 424 204" culoare={TRAI} grosime={1.4} punctat />
      {parabola.map(([px, py]) => (
        <Punct key={`${px}`} x={px} y={py} r={5} culoare={TRAI} />
      ))}
      <Text x={296} y={112} marime={12}>
        parabolă
      </Text>
      <Linie d="M 356 108 L 452 142" culoare={SLAB} grosime={1.1} />
    </Schema>
  );
}

/** Traiectoria vârfului palei în referențialul avionului: un cerc. */
export function FigEliceAvion() {
  return (
    <Schema
      vb="0 0 480 250"
      latime={470}
      eticheta="Avion cu două elice; în referențialul avionului, vârful unei pale descrie un cerc."
      legenda="Traiectoria vârfului palei în referențialul legat de avion."
    >
      <AvionDeSus x={230} y={118} scara={0.82} />
      <circle cx={309} cy={119} r={40} fill="none" stroke={TRAI} strokeWidth={1.5} strokeDasharray="5 4" />
      <Sageata x1={340} y1={100} x2={347} y2={116} culoare={TRAI} grosime={1.5} />
      <Text x={26} y={218} marime={11.5}>
        traiectoria vârfului palei
      </Text>
      <Text x={26} y={234} marime={11.5}>
        în referențialul avionului
      </Text>
      <Linie d="M 300 212 L 336 164" culoare={SLAB} grosime={1.1} />
    </Schema>
  );
}

/** Traiectoria vârfului palei în referențialul propriei elice: un punct. */
export function FigElicePunct() {
  return (
    <Schema
      vb="0 0 420 130"
      latime={400}
      eticheta="Elice cu două pale; în referențialul elicei, vârful palei stă pe loc și traiectoria lui e un punct."
      legenda="Traiectoria vârfului palei în propriul ei referențial este un punct."
    >
      <ellipse cx={210} cy={65} rx={168} ry={13} fill={UMPLUT} stroke={CONTUR} strokeWidth={1.4} />
      <circle cx={210} cy={65} r={17} fill={SLAB} stroke={CONTUR} strokeWidth={1.5} />
      <Punct x={374} y={64} r={5} culoare={TRAI} />
      <Text x={388} y={54} marime={13} culoare={TRAI}>
        P
      </Text>
    </Schema>
  );
}

/* ============================================================== C2 — distanța */

/** Corpul care se deplasează rectiliniu între momentele t₁ și t₂. */
export function FigDistantaParcursa() {
  return (
    <Schema
      vb="0 0 460 150"
      latime={440}
      eticheta="Un corp se deplasează în linie dreaptă; între momentele t1 și t2 parcurge distanța d."
      legenda="Între momentul t₁ și momentul t₂, corpul parcurge distanța d."
    >
      <Linie d="M 30 78 L 430 78" culoare={SLAB} grosime={1.2} />
      <rect x={48} y={62} width={40} height={26} rx={5} fill={UMPLUT} stroke={CONTUR} strokeWidth={GROS} />
      <rect x={332} y={62} width={40} height={26} rx={5} fill={UMPLUT} stroke={CONTUR} strokeWidth={GROS} />
      <Sageata x1={100} y1={75} x2={140} y2={75} culoare={CONTUR} grosime={1.4} />
      <Simbol x={68} y={44} marime={14}>
        t_1
      </Simbol>
      <Simbol x={352} y={44} marime={14}>
        t_2
      </Simbol>
      <Sageata x1={68} y1={118} x2={352} y2={118} culoare={CONTUR} grosime={1.3} dubla />
      <Simbol x={210} y={110} marime={15}>
        d
      </Simbol>
      <Linie d="M 68 92 L 68 114" culoare={SLAB} grosime={1} punctat />
      <Linie d="M 352 92 L 352 114" culoare={SLAB} grosime={1} punctat />
    </Schema>
  );
}

/* =========================================================== C3 — trenul */

/** Pasagerul care merge prin tren: viteza lui depinde de referențial. */
export function FigTrenPasager() {
  return (
    <Schema
      vb="0 0 540 230"
      latime={540}
      eticheta="Un tren merge cu 160 km pe oră față de sol, iar un pasager merge prin tren cu 2 km pe oră față de tren."
      legenda="Viteza unui corp depinde de referențialul în care se studiază mișcarea."
    >
      <Text x={150} y={24} marime={12}>
        160 km/h
      </Text>
      <Text x={150} y={40} marime={12}>
        față de sol
      </Text>
      <Sageata x1={150} y1={56} x2={470} y2={56} culoare={CONTUR} grosime={1.8} />

      <Vagon x={40} y={82} l={200} h={62} />
      <Vagon x={296} y={82} l={200} h={62} />
      <Linie d="M 240 132 L 296 132" culoare={CONTUR} grosime={2} />

      <Om x={268} y={144} inaltime={54} />
      <Sageata x1={286} y1={118} x2={338} y2={118} culoare={TRAI} grosime={1.5} />
      <Text x={278} y={186} marime={12} culoare={TRAI}>
        2 km/h
      </Text>
      <Text x={278} y={202} marime={12} culoare={TRAI}>
        față de tren
      </Text>

      <Linie d="M 10 160 L 530 160" culoare={SLAB} grosime={1.4} />
    </Schema>
  );
}

/* ====================================================== C4 — săgeata vitezei */

/** Săgeata vitezei: pornește din poziția corpului și e tangentă la traiectorie. */
export function FigSageataVitezei() {
  return (
    <Schema
      vb="0 0 440 160"
      latime={420}
      eticheta="Pe o traiectorie curbă, punctele M și M prim sunt apropiate, iar săgeata vitezei pornește din M de-a lungul traiectoriei."
      legenda="Când M′ e foarte aproape de M, săgeata vitezei se așază de-a lungul traiectoriei."
    >
      <Linie d="M 24 128 Q 108 44 202 92 T 412 66" culoare={CONTUR} grosime={1.5} />
      <Cruce x={231} y={104} r={5} culoare={CONTUR} />
      <Cruce x={250} y={108} r={5} culoare={CONTUR} />
      <Simbol x={224} y={90} marime={14}>
        M
      </Simbol>
      <Simbol x={262} y={94} marime={14}>
        M′
      </Simbol>
      <Sageata x1={231} y1={104} x2={336} y2={136} culoare={TRAI} grosime={1.7} />
      <Simbol x={350} y={130} marime={15} culoare={TRAI}>
        v
      </Simbol>
    </Schema>
  );
}

/* ======================================================= LP1 — roata de bicicletă */

const R_CICLOIDA = 55;
const X0_CICLOIDA = 50;
const SOL_CICLOIDA = 170;
const FAZE = [];
for (let k = 0; k <= 12; k += 1) FAZE.push(Math.PI / 2 + (k * Math.PI) / 6);

const A_R1 = FAZE.map((f) => [
  X0_CICLOIDA + R_CICLOIDA * (f - Math.sin(f)),
  SOL_CICLOIDA - R_CICLOIDA + R_CICLOIDA * Math.cos(f),
]);
const C_R1 = FAZE.map((f) => [X0_CICLOIDA + R_CICLOIDA * f, SOL_CICLOIDA - R_CICLOIDA]);

const CX_R2 = 275;
const CY_R2 = 340;
const R_R2 = 90;
const A_R2 = FAZE.slice(0, 12).map((f) => [
  CX_R2 - R_R2 * Math.sin(f),
  CY_R2 + R_R2 * Math.cos(f),
]);

/**
 * Înregistrarea pozițiilor a două puncte ale roții de bicicletă, în două
 * referențiale: R₁ (legat de șosea) și R₂ (legat de bicicletă).
 *
 * A e un punct de pe anvelopă, C e centrul roții. Pozițiile lui A din R₁ sunt
 * calculate din ecuațiile cicloidei, ca vârful (locul în care A atinge șoseaua)
 * să cadă exact pe linia pe care merge centrul roții — acolo se vede că viteza
 * lui A e nulă.
 */
export function FigRoataDeBicicleta({ rezolvare }) {
  const dCicloida = A_R1.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  return (
    <Schema
      vb="0 0 550 480"
      latime={550}
      eticheta="Două înregistrări ale pozițiilor punctelor A și C ale unei roți de bicicletă, în referențialul șoselei și în referențialul bicicletei."
      legenda={
        rezolvare
          ? 'Traiectoriile punctelor A și C în cele două referențiale.'
          : 'Pozițiile succesive ale punctelor A și C, înregistrate la intervale de timp egale.'
      }
    >
      {/* ---------- R1 ---------- */}
      <Cadru x={20} y={30} l={510} h={180} />
      {rezolvare && <Linie d={dCicloida} culoare={TRAI} grosime={1.4} />}
      {rezolvare && (
        <Linie
          d={`M ${C_R1[0][0].toFixed(1)} ${C_R1[0][1]} L ${C_R1[12][0].toFixed(1)} ${C_R1[12][1]}`}
          culoare={TRAI}
          grosime={1.4}
        />
      )}
      {C_R1.map(([x, y], i) => (
        <Cruce key={`c1-${i}`} x={x} y={y} culoare={SLAB} />
      ))}
      {A_R1.map(([x, y], i) => (
        <Cruce key={`a1-${i}`} x={x} y={y} culoare={CONTUR} />
      ))}
      <Text x={A_R1[0][0] - 22} y={A_R1[0][1] + 4} marime={13}>
        A
      </Text>
      <Text x={C_R1[0][0] - 4} y={C_R1[0][1] + 20} marime={13}>
        C
      </Text>
      <Text x={38} y={198} marime={11.5} culoare={SLAB}>
        Referențialul de studiu: R₁
      </Text>

      {/* ---------- R2 ---------- */}
      <Cadru x={20} y={228} l={510} h={230} />
      {rezolvare && (
        <circle cx={CX_R2} cy={CY_R2} r={R_R2} fill="none" stroke={TRAI} strokeWidth={1.4} />
      )}
      {A_R2.map(([x, y], i) => (
        <Cruce key={`a2-${i}`} x={x} y={y} culoare={CONTUR} />
      ))}
      <Cruce x={CX_R2} y={CY_R2} culoare={SLAB} />
      <Text x={A_R2[0][0] - 22} y={A_R2[0][1] + 4} marime={13}>
        A
      </Text>
      <Text x={CX_R2 + 10} y={CY_R2 + 5} marime={13}>
        C
      </Text>
      <Text x={38} y={446} marime={11.5} culoare={SLAB}>
        Referențialul de studiu: R₂
      </Text>
    </Schema>
  );
}

/* ============================================== LP2 — traseul pe autostradă */

/** Traseul dintre două orașe: 20 km liberi, apoi 20 km în lucru. */
export function FigTraseuAutostrada() {
  return (
    <Schema
      vb="0 0 560 210"
      latime={560}
      eticheta="Traseu de 40 km între orașul A și orașul B: primii 20 km liberi, ultimii 20 km în lucru."
      legenda="Schema traseului mașinii."
    >
      <Text x={60} y={26} ancora="middle" marime={12}>
        orașul A
      </Text>
      <Text x={506} y={26} ancora="middle" marime={12}>
        orașul B
      </Text>
      <Casa x={60} y={122} scara={1.1} />
      <Casa x={506} y={122} scara={1.1} />

      <rect x={96} y={94} width={188} height={28} fill="none" stroke={CONTUR} strokeWidth={1.4} />
      <rect x={284} y={94} width={188} height={28} fill={SLAB} opacity={0.35} stroke={CONTUR} strokeWidth={1.4} />
      <Linie d="M 96 108 L 284 108" culoare={SLAB} grosime={1} punctat />

      <rect x={140} y={100} width={26} height={12} rx={3} fill={UMPLUT} stroke={CONTUR} strokeWidth={1.2} />
      <Sageata x1={174} y1={106} x2={202} y2={106} culoare={CONTUR} grosime={1.3} />

      <Text x={190} y={80} ancora="middle" marime={12}>
        porțiune liberă, 20 km
      </Text>
      <Text x={378} y={80} ancora="middle" marime={12}>
        20 km în lucru
      </Text>
      <Text x={190} y={140} ancora="middle" marime={11.5} culoare={SLAB}>
        autostradă
      </Text>

      <Cota x1={96} x2={472} y={172} eticheta="40 km" />
    </Schema>
  );
}

/* ================================================= LP3 — musca și diligența */

/** Cele două diligențe care pornesc una spre alta, cu musca între ele. */
export function FigMuscaSiDiligenta() {
  return (
    <Schema
      vb="0 0 560 220"
      latime={560}
      eticheta="Două diligențe pornesc una spre cealaltă, de la 75 km distanță, fiecare cu 25 km pe oră; o muscă zboară între ele."
      legenda="Musca zboară cu viteză constantă între cele două diligențe."
    >
      <Text x={54} y={26} ancora="middle" marime={12}>
        orașul A
      </Text>
      <Text x={510} y={26} ancora="middle" marime={12}>
        orașul B
      </Text>
      <Casa x={54} y={148} scara={1} />
      <Casa x={510} y={148} scara={1} />

      <Linie d="M 20 148 L 540 148" culoare={CONTUR} grosime={1.6} />

      <Diligenta x={140} y={148} sens={1} />
      <Diligenta x={420} y={148} sens={-1} />

      <Text x={140} y={50} ancora="middle" marime={12}>
        25 km/h
      </Text>
      <Sageata x1={110} y1={64} x2={176} y2={64} culoare={CONTUR} grosime={1.5} />
      <Text x={420} y={50} ancora="middle" marime={12}>
        25 km/h
      </Text>
      <Sageata x1={450} y1={64} x2={384} y2={64} culoare={CONTUR} grosime={1.5} />

      <Punct x={282} y={110} r={3.4} culoare={TRAI} />
      <Linie d="M 276 104 L 268 98 M 288 104 L 296 98" culoare={TRAI} grosime={1.1} />
      <Text x={282} y={92} ancora="middle" marime={10.5} culoare={TRAI}>
        bzzz
      </Text>

      <Sageata x1={92} y1={186} x2={470} y2={186} culoare={CONTUR} grosime={1.3} dubla />
      <Simbol x={281} y={178} marime={14} dupa={" = 75 km"}>
        d
      </Simbol>
    </Schema>
  );
}

/* ================================================ LP3 — compunerea mișcărilor */

/** Cele două trenuri, cu călătorii și barmanii lor, privite de vaca de pe câmp. */
export function FigCompunereaMiscarilor() {
  return (
    <Schema
      vb="0 0 580 360"
      latime={580}
      eticheta="Două trenuri paralele; în fiecare, un călător așezat și un barman care împinge un cărucior, iar pe marginea căii o vacă."
      legenda="Sistemele desenate sunt în mișcare de translație unele față de altele."
    >
      {/* ---- trenul T1 ---- */}
      <Text x={112} y={26} marime={11.5} culoare={SLAB}>
        călătorul V₁, așezat
      </Text>
      <Text x={268} y={26} marime={11.5} culoare={SLAB}>
        trenul T₁
      </Text>
      <Text x={392} y={26} marime={11.5} culoare={SLAB}>
        barmanul B₁
      </Text>
      <Vagon x={26} y={40} l={192} h={58} />
      <Vagon x={240} y={40} l={192} h={58} />
      <Linie d="M 218 76 L 240 76" culoare={CONTUR} grosime={2} />
      <Om x={112} y={98} inaltime={44} />
      <rect x={104} y={82} width={26} height={16} fill={SLAB} stroke={CONTUR} strokeWidth={1.1} />
      <Om x={382} y={98} inaltime={46} />
      <rect x={318} y={80} width={30} height={18} fill={SLAB} stroke={CONTUR} strokeWidth={1.1} />
      <Sageata x1={352} y1={62} x2={310} y2={62} culoare={TRAI} grosime={1.4} />
      <Linie d="M 10 108 L 570 108" culoare={SLAB} grosime={1.4} />
      <Simbol x={444} y={54} marime={13} dupa={" = 160 km/h"} ancora="start">
        v_1
      </Simbol>
      <Sageata x1={444} y1={70} x2={520} y2={70} culoare={CONTUR} grosime={1.6} />

      {/* ---- vaca ---- */}
      <Vaca x={228} y={198} />
      <Text x={290} y={172} marime={11.5} culoare={SLAB}>
        vaca V privește
      </Text>
      <Text x={290} y={188} marime={11.5} culoare={SLAB}>
        trenurile trecând
      </Text>

      {/* ---- trenul T2 ---- */}
      <Text x={112} y={216} marime={11.5} culoare={SLAB}>
        călătorul V₂, așezat
      </Text>
      <Text x={268} y={216} marime={11.5} culoare={SLAB}>
        trenul T₂
      </Text>
      <Text x={392} y={216} marime={11.5} culoare={SLAB}>
        barmanul B₂
      </Text>
      <Vagon x={26} y={230} l={192} h={58} />
      <Vagon x={240} y={230} l={192} h={58} />
      <Linie d="M 218 266 L 240 266" culoare={CONTUR} grosime={2} />
      <Om x={112} y={288} inaltime={44} />
      <rect x={104} y={272} width={26} height={16} fill={SLAB} stroke={CONTUR} strokeWidth={1.1} />
      <Om x={330} y={288} inaltime={46} />
      <rect x={364} y={270} width={30} height={18} fill={SLAB} stroke={CONTUR} strokeWidth={1.1} />
      <Sageata x1={360} y1={252} x2={402} y2={252} culoare={TRAI} grosime={1.4} />
      <Linie d="M 10 298 L 570 298" culoare={SLAB} grosime={1.4} />
      <Simbol x={444} y={244} marime={13} dupa={" = 158 km/h"} ancora="start">
        v_2
      </Simbol>
      <Sageata x1={444} y1={260} x2={520} y2={260} culoare={CONTUR} grosime={1.6} />
    </Schema>
  );
}

/* ============================================================ LP3 — avionul și TGV-ul */

/** Pozițiile avionului și ale trenului la momentul de plecare și după un minut. */
export function FigAvionSiTGV() {
  const x0 = 92;
  const xT = 404;
  const xA = 489;
  return (
    <Schema
      vb="0 0 560 300"
      latime={560}
      eticheta="Pozițiile avionului și ale trenului la momentul zero și după un minut, cu distanțele parcurse."
      legenda="Pozițiile celor două vehicule la momentul de plecare și după un minut."
    >
      <Linie d={`M ${x0} 34 L ${x0} 244`} culoare={SLAB} grosime={1.1} punctat />
      <Linie d={`M ${xT} 34 L ${xT} 244`} culoare={SLAB} grosime={1.1} punctat />
      <Linie d={`M ${xA} 34 L ${xA} 214`} culoare={SLAB} grosime={1.1} punctat />
      <Text x={x0 + 6} y={28} marime={11.5} culoare={SLAB}>
        t = 0
      </Text>
      <Text x={xT + 6} y={28} marime={11.5} culoare={SLAB}>
        t = 1 min
      </Text>

      <Text x={16} y={72} marime={12}>
        Avion
      </Text>
      <AvionDeSus x={x0} y={92} scara={0.2} />
      <AvionDeSus x={xA} y={92} scara={0.2} />

      <Text x={16} y={176} marime={12}>
        TGV
      </Text>
      <TrenMic x={x0} y={174} />
      <TrenMic x={xT} y={174} />
      <Linie d="M 10 190 L 550 190" culoare={CONTUR} grosime={1.5} />

      <Sageata x1={xT} y1={122} x2={xA} y2={122} culoare={CONTUR} grosime={1.3} dubla />
      <Simbol x={(xT + xA) / 2} y={114} marime={14}>
        d′_A
      </Simbol>
      <Sageata x1={x0} y1={218} x2={xT} y2={218} culoare={CONTUR} grosime={1.3} dubla />
      <Simbol x={(x0 + xT) / 2} y={210} marime={14}>
        d_T
      </Simbol>
      <Sageata x1={x0} y1={252} x2={xA} y2={252} culoare={CONTUR} grosime={1.3} dubla />
      <Simbol x={(x0 + xA) / 2} y={244} marime={14}>
        d_A
      </Simbol>
    </Schema>
  );
}

/* ================================================== LP4 — cursa de alergare */

const A_ALERGATOR = [];
for (let k = 0; k <= 10; k += 1) A_ALERGATOR.push(40 + 32 * k);
const B_ALERGATOR = [40, 48, 64, 96, 160, 216, 240, 248, 264, 296, 360];

/**
 * Cronofotografia unui alergător: reperul A e pe gulerul lui, reperul B pe
 * pantoful drept.
 *
 * A înaintează cu pas constant, fiindcă trunchiul merge uniform. B se
 * îngrămădește la momentele în care pantoful atinge solul și se rărește când
 * piciorul e în aer — de aici se citește și când e talpa pe sol, și viteza cea
 * mai mare.
 */
export function FigCursaDeAlergare() {
  return (
    <Schema
      vb="0 0 430 300"
      latime={430}
      eticheta="Cronofotografia unui alergător: pozițiile unui reper de pe guler și ale unui reper de pe pantoful drept, la intervale de 50 de milisecunde."
      legenda="Pozițiile reperelor A (pe guler) și B (pe pantoful drept), înregistrate la fiecare 50 ms. Un milimetru pe figură corespunde la 30 mm pe alergător."
    >
      {/* silueta alergătorului */}
      <g opacity={0.5}>
        <circle cx={352} cy={55} r={14} fill={SLAB} />
        <Linie d="M 352 70 L 344 150" culoare={SLAB} grosime={26} />
        <Linie d="M 350 90 L 384 116" culoare={SLAB} grosime={12} />
        <Linie d="M 350 92 L 318 122" culoare={SLAB} grosime={12} />
        <Linie d="M 344 150 L 316 196 L 302 228" culoare={SLAB} grosime={14} />
        <Linie d="M 346 150 L 374 194 L 358 250" culoare={SLAB} grosime={14} />
      </g>

      {A_ALERGATOR.map((x, k) => (
        <g key={`a-${k}`}>
          <Punct x={x} y={95} r={2.8} />
          <Simbol x={x} y={82} marime={11}>
            {`t_${k + 1}`}
          </Simbol>
        </g>
      ))}
      <Text x={A_ALERGATOR[10] + 10} y={99} marime={13}>
        A
      </Text>

      {B_ALERGATOR.map((x, k) => (
        <g key={`b-${k}`}>
          <Punct x={x} y={258} r={2.8} />
          <Simbol x={x} y={k === 1 || k === 7 ? 233 : 246} marime={11}>
            {`t_${k + 1}`}
          </Simbol>
        </g>
      ))}
      <Text x={B_ALERGATOR[10] + 10} y={262} marime={13}>
        B
      </Text>
    </Schema>
  );
}

/* ============================================================= LP4 — bâlciul */

/** Cele două nacele ale caruselului, văzute de sus. */
export function FigBalci({ rezolvare }) {
  const cx = 200;
  const cy = 175;
  const Rv = 105;
  const Rf = 63;
  const pV = [cx, cy - Rv];
  const pVp = [cx - Rv, cy];
  const pF = [cx + Rf, cy];
  const pFp = [cx - Rf * 0.707, cy - Rf * 0.707];
  return (
    <Schema
      vb="0 0 400 360"
      latime={400}
      eticheta="Vedere de sus a caruselului: Valentina se rotește pe cercul mare, Florin pe cercul mic."
      legenda={
        rezolvare
          ? 'Săgețile-viteză ale celor doi copii în pozițiile date.'
          : 'Vedere de sus a traiectoriilor celor doi copii.'
      }
    >
      <circle cx={cx} cy={cy} r={Rv} fill="none" stroke={CONTUR} strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={Rf} fill="none" stroke={TRAI} strokeWidth={1.5} />
      <Cruce x={cx} y={cy} r={4} culoare={SLAB} />

      <Cruce x={pV[0]} y={pV[1]} r={5} />
      <Cruce x={pVp[0]} y={pVp[1]} r={5} />
      <Cruce x={pF[0]} y={pF[1]} r={5} culoare={TRAI} />
      <Cruce x={pFp[0]} y={pFp[1]} r={5} culoare={TRAI} />

      <Text x={pV[0]} y={pV[1] - 10} ancora="middle" marime={13}>
        V
      </Text>
      <Text x={pVp[0] - 10} y={pVp[1] + 5} ancora="end" marime={13}>
        V′
      </Text>
      <Text x={pF[0] + 10} y={pF[1] + 5} marime={13} culoare={TRAI}>
        F
      </Text>
      <Text x={pFp[0] - 6} y={pFp[1] - 10} ancora="end" marime={13} culoare={TRAI}>
        F′
      </Text>

      {/* sensul de rotație */}
      <path
        d={`M ${cx + Rv + 18} ${cy + 26} A ${Rv + 18} ${Rv + 18} 0 0 0 ${cx + Rv + 6} ${cy - 40}`}
        fill="none"
        stroke={CONTUR}
        strokeWidth={1.5}
      />
      <path d={`M ${cx + Rv + 1} ${cy - 34} L ${cx + Rv + 12} ${cy - 46} L ${cx + Rv + 14} ${cy - 30} Z`} fill={CONTUR} />

      {rezolvare && (
        <>
          <Sageata x1={pV[0]} y1={pV[1]} x2={pV[0] - 46} y2={pV[1]} culoare={CONTUR} grosime={1.6} />
          <Sageata x1={pVp[0]} y1={pVp[1]} x2={pVp[0]} y2={pVp[1] + 46} culoare={CONTUR} grosime={1.6} />
          <Sageata x1={pF[0]} y1={pF[1]} x2={pF[0]} y2={pF[1] - 28} culoare={TRAI} grosime={1.6} />
          <Sageata
            x1={pFp[0]}
            y1={pFp[1]}
            x2={pFp[0] - 20}
            y2={pFp[1] + 20}
            culoare={TRAI}
            grosime={1.6}
          />
        </>
      )}
    </Schema>
  );
}

/* ================================================ LP4 — mobil pe pernă de aer */

const OX_MOBIL = 235;
const OY_MOBIL = 215;
const R_MOBIL = 110;
const PAS_MOBIL = 17.5;
const M_MOBIL = [];
for (let i = 0; i < 9; i += 1) {
  const t = ((200 - PAS_MOBIL * i) * Math.PI) / 180;
  M_MOBIL.push([OX_MOBIL + R_MOBIL * Math.cos(t), OY_MOBIL - R_MOBIL * Math.sin(t)]);
}
const CORDA_MOBIL = 2 * R_MOBIL * Math.sin((PAS_MOBIL / 2 / 180) * Math.PI);
const DIR_MOBIL = [Math.sin((60 / 180) * Math.PI), Math.cos((60 / 180) * Math.PI)];
for (let k = 1; k <= 7; k += 1) {
  M_MOBIL.push([
    M_MOBIL[8][0] + k * CORDA_MOBIL * DIR_MOBIL[0],
    M_MOBIL[8][1] + k * CORDA_MOBIL * DIR_MOBIL[1],
  ]);
}

/**
 * Înregistrarea mobilului pe pernă de aer, legat cu un fir de punctul fix O.
 *
 * Cât timp firul e întins, mobilul merge pe un cerc cu centrul în O; când firul
 * se rupe, merge mai departe pe dreapta tangentă. Distanța dintre două poziții
 * vecine e aceeași peste tot — de aceea mișcarea e uniformă în amândouă părțile.
 */
export function FigMobilPernaAer({ rezolvare }) {
  const arc = M_MOBIL.slice(0, 9)
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(' ');
  const drept = `M ${M_MOBIL[8][0].toFixed(1)} ${M_MOBIL[8][1].toFixed(1)} L ${M_MOBIL[15][0].toFixed(1)} ${M_MOBIL[15][1].toFixed(1)}`;
  const v5 = [Math.sin((130 / 180) * Math.PI), Math.cos((130 / 180) * Math.PI)];
  return (
    <Schema
      vb="0 0 560 300"
      latime={560}
      eticheta="Înregistrarea a șaisprezece poziții succesive ale unui mobil pe pernă de aer, legat cu un fir de punctul fix O."
      legenda={
        rezolvare
          ? 'Traiectoria mobilului și săgețile-viteză în M₅ și în M₁₅.'
          : 'Pozițiile succesive ale punctului M, înregistrate la intervale de 10 ms.'
      }
    >
      {rezolvare && <Linie d={arc} culoare={TRAI} grosime={1.3} />}
      {rezolvare && <Linie d={drept} culoare={TRAI} grosime={1.3} />}

      <Cruce x={OX_MOBIL} y={OY_MOBIL} r={5} culoare={SLAB} />
      <Text x={OX_MOBIL - 6} y={OY_MOBIL + 20} ancora="end" marime={13}>
        O
      </Text>

      {M_MOBIL.map(([x, y], i) => {
        let ex;
        let ey;
        if (i < 9) {
          const ux = (x - OX_MOBIL) / R_MOBIL;
          const uy = (y - OY_MOBIL) / R_MOBIL;
          ex = x + 24 * ux;
          ey = y + 24 * uy + 4;
        } else {
          ex = x + 12;
          ey = y - 16;
        }
        return (
          <g key={`m-${i}`}>
            <Punct x={x} y={y} r={3} />
            <Simbol x={ex} y={ey} marime={12}>
              {`M_${i + 1}`}
            </Simbol>
          </g>
        );
      })}

      {rezolvare && (
        <>
          <Sageata
            x1={M_MOBIL[4][0]}
            y1={M_MOBIL[4][1]}
            x2={M_MOBIL[4][0] + 60 * v5[0]}
            y2={M_MOBIL[4][1] + 60 * v5[1]}
            culoare={TRAI}
            grosime={1.7}
          />
          <Simbol x={M_MOBIL[4][0] + 60 * v5[0] - 18} y={M_MOBIL[4][1] + 60 * v5[1] - 14} marime={14} culoare={TRAI}>
            v_5
          </Simbol>
          <Sageata
            x1={M_MOBIL[14][0]}
            y1={M_MOBIL[14][1]}
            x2={M_MOBIL[14][0] + 60 * DIR_MOBIL[0]}
            y2={M_MOBIL[14][1] + 60 * DIR_MOBIL[1]}
            culoare={TRAI}
            grosime={1.7}
          />
          <Simbol x={M_MOBIL[14][0] + 60 * DIR_MOBIL[0] - 6} y={M_MOBIL[14][1] + 60 * DIR_MOBIL[1] + 18} marime={14} culoare={TRAI}>
            v_15
          </Simbol>
        </>
      )}
    </Schema>
  );
}
