import React from 'react';
import { Schema, Fir, Text, Simbol, CULORI } from './index';

/**
 * FIGURILE CAPITOLULUI „TRANSFORMĂRILE FIZICE” (clasa a VIII-a, fenomene termice).
 *
 * Manualul-sursă e un PDF scanat, deci figurile se REFAC ÎN COD, ca și schemele
 * de circuit din `legea-nodurilor.jsx`. Simbolurile de care are nevoie capitolul
 * ăsta — vasul, particula, cutia de stare, axele unui grafic — nu există în
 * `index.jsx` și sunt definite aici, local, cu același tipar: coordonatele se
 * dau după CENTRUL desenului.
 *
 * CULOAREA. Verdele și roșul din paletă apar numai în figura schimbărilor de
 * stare, și numai în varianta „energetic”: acolo culoarea deosebește
 * transformările care PRIMESC energie de cele care CEDEAZĂ energie, adică
 * poartă informație. În rest, totul e cerneala paginii.
 */

/* ————————————————————————————————————————————————————————————————
   Primitive locale
   ———————————————————————————————————————————————————————————————— */

/** Setul de vârfuri de săgeată al unei figuri. `prefix` ține id-urile distincte. */
function Sageti({ prefix }) {
  const seturi = [
    ['ink', CULORI.fir],
    ['endo', CULORI.iese],
    ['exo', CULORI.intra],
  ];
  return (
    <defs>
      {seturi.map(([nume, culoare]) => (
        <marker
          key={nume}
          id={`${prefix}-${nume}`}
          viewBox="0 0 10 10"
          refX="8.5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={culoare} />
        </marker>
      ))}
    </defs>
  );
}

/** Săgeată cu vârf, pe un traseu oarecare. */
function Sageata({ d, culoare = CULORI.fir, marker, grosime = 2, punctat }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={culoare}
      strokeWidth={grosime}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={punctat ? '5 4' : undefined}
      markerEnd={marker ? `url(#${marker})` : undefined}
    />
  );
}

/** Text scris pe verticală, pentru etichetele de pe marginile figurilor. */
function TextV({ x, y, children, marime = 13, culoare = CULORI.text }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontSize={marime}
      fill={culoare}
      fontFamily="Inter, system-ui, sans-serif"
      transform={`rotate(-90 ${x} ${y})`}
    >
      {children}
    </text>
  );
}

/** Cutia unei stări de agregare. */
function Cutie({ x, y, w = 118, h = 36, text }) {
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx="4"
        fill={CULORI.umplutura}
        stroke={CULORI.contur}
        strokeWidth={1.6}
      />
      <Text x={x} y={y + 5.5} ancora="middle" marime={15}>
        {text}
      </Text>
    </g>
  );
}

/** Atom sau moleculă, la scară microscopică. */
function Particula({ x, y, r = 9 }) {
  return (
    <circle cx={x} cy={y} r={r} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.3} />
  );
}

/** Vas închis, cu capac: același vas pentru toate cele trei stări. */
function Vas({ x, y, w = 104, h = 108 }) {
  const st = x - w / 2;
  const dr = x + w / 2;
  const jos = y + h;
  return (
    <g>
      <path
        d={`M ${st} ${y} L ${st} ${jos} L ${dr} ${jos} L ${dr} ${y}`}
        fill="none"
        stroke={CULORI.contur}
        strokeWidth={1.8}
      />
      <path d={`M ${st - 9} ${y} L ${dr + 9} ${y}`} stroke={CULORI.contur} strokeWidth={2.4} />
    </g>
  );
}

/* ————————————————————————————————————————————————————————————————
   C1 — stările materiei
   ———————————————————————————————————————————————————————————————— */

const SOLID_GRID = [];
for (let i = 0; i < 4; i += 1) {
  for (let j = 0; j < 4; j += 1) {
    SOLID_GRID.push([32 + i * 30, 48 + j * 28]);
  }
}

const LICHID_PUNCTE = [
  [196, 48], [224, 42], [252, 50], [280, 45],
  [190, 72], [219, 78], [247, 70], [277, 76],
  [201, 100], [231, 96], [259, 104], [287, 99],
  [195, 127], [225, 125], [255, 130], [284, 122],
];

const GAZ_PUNCTE = [
  [362, 48, 30], [421, 40, -20], [389, 88, 150], [447, 100, 60], [356, 124, -60], [412, 132, 200],
];

/** Cele trei stări văzute la scară microscopică. */
export function FigStariMicroscopic() {
  return (
    <Schema
      vb="0 0 480 200"
      latime={480}
      eticheta="Cele trei stări ale materiei la scară microscopică: solid, lichid, gaz"
      legenda="Aceleași particule, în cele trei stări: fixate într-o rețea, alunecând una peste alta, împrăștiate în tot volumul."
    >
      <Sageti prefix="mic" />
      <rect x={14} y={26} width={132} height={118} rx="4" fill="none" stroke={CULORI.slab} strokeWidth={1.2} />
      <rect x={174} y={26} width={132} height={118} rx="4" fill="none" stroke={CULORI.slab} strokeWidth={1.2} />
      <rect x={334} y={26} width={132} height={118} rx="4" fill="none" stroke={CULORI.slab} strokeWidth={1.2} />

      {SOLID_GRID.map(([x, y]) => (
        <Particula key={`s${x}-${y}`} x={x} y={y} />
      ))}
      {LICHID_PUNCTE.map(([x, y]) => (
        <Particula key={`l${x}-${y}`} x={x} y={y} />
      ))}
      {GAZ_PUNCTE.map(([x, y, u]) => {
        const rad = (u * Math.PI) / 180;
        return (
          <g key={`g${x}-${y}`}>
            <Particula x={x} y={y} />
            <Sageata
              d={`M ${x + Math.cos(rad) * 12} ${y + Math.sin(rad) * 12} L ${x + Math.cos(rad) * 26} ${
                y + Math.sin(rad) * 26
              }`}
              marker="mic-ink"
              grosime={1.4}
            />
          </g>
        );
      })}

      <Text x={80} y={166} ancora="middle" marime={15}>solid</Text>
      <Text x={240} y={166} ancora="middle" marime={15}>lichid</Text>
      <Text x={400} y={166} ancora="middle" marime={15}>gaz</Text>
      <Text x={80} y={186} ancora="middle" marime={12} culoare={CULORI.slab}>poziții fixe</Text>
      <Text x={240} y={186} ancora="middle" marime={12} culoare={CULORI.slab}>apropiate, dar alunecă</Text>
      <Text x={400} y={186} ancora="middle" marime={12} culoare={CULORI.slab}>depărtate, în zbor</Text>
    </Schema>
  );
}

/** Același vas închis, cu aceeași substanță în cele trei stări. */
export function FigStariMacroscopic() {
  return (
    <Schema
      vb="0 0 480 210"
      latime={480}
      eticheta="Trei vase închise identice care conțin aceeași substanță în stări diferite"
      legenda="Trei vase închise identice, cu aceeași substanță înăuntru."
    >
      <Sageti prefix="vas" />

      <Vas x={80} y={38} />
      <rect x={52} y={106} width={56} height={38} rx="3" fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.6} />

      <Vas x={240} y={38} />
      <path d="M 188 98 L 292 98 L 292 146 L 188 146 Z" fill={CULORI.umplutura} stroke="none" />
      <path d="M 188 98 L 292 98" stroke={CULORI.contur} strokeWidth={1.8} fill="none" />

      <Vas x={400} y={38} />
      {[
        [366, 58], [418, 50], [440, 74], [380, 86], [412, 100], [356, 112],
        [436, 122], [392, 130], [370, 140], [424, 142],
      ].map(([x, y]) => (
        <circle key={`v${x}-${y}`} cx={x} cy={y} r={4.5} fill={CULORI.contur} />
      ))}

      <Text x={80} y={172} ancora="middle" marime={15}>a.</Text>
      <Text x={240} y={172} ancora="middle" marime={15}>b.</Text>
      <Text x={400} y={172} ancora="middle" marime={15}>c.</Text>
      <Text x={80} y={194} ancora="middle" marime={12} culoare={CULORI.slab}>își ține forma</Text>
      <Text x={240} y={194} ancora="middle" marime={12} culoare={CULORI.slab}>suprafață plană</Text>
      <Text x={400} y={194} ancora="middle" marime={12} culoare={CULORI.slab}>ocupă tot vasul</Text>
    </Schema>
  );
}

/* ————————————————————————————————————————————————————————————————
   C2 — schimbările de stare
   ———————————————————————————————————————————————————————————————— */

/**
 * Cele șase schimbări de stare.
 *
 * Cu `energetic`, săgețile care duc spre mai multă dezordine se colorează
 * altfel decât cele care duc spre mai multă ordine — culoarea spune atunci
 * cine primește și cine cedează energie.
 */
export function FigSchimbariDeStare({ energetic }) {
  const cEndo = energetic ? CULORI.iese : CULORI.fir;
  const cExo = energetic ? CULORI.intra : CULORI.fir;
  const mEndo = energetic ? 'sch-endo' : 'sch-ink';
  const mExo = energetic ? 'sch-exo' : 'sch-ink';
  return (
    <Schema
      vb="0 0 480 272"
      latime={470}
      eticheta="Diagrama celor șase schimbări de stare între solid, lichid și gaz"
      legenda={
        energetic
          ? 'Săgețile spre dezordine (roșu) cer energie; săgețile spre ordine (verde) eliberează energie.'
          : 'Cele șase schimbări de stare și numele lor.'
      }
    >
      <Sageti prefix="sch" />

      <Cutie x={240} y={40} text="gaz" />
      <Cutie x={240} y={136} text="lichid" />
      <Cutie x={240} y={232} text="solid" />

      {/* endoterme: în sus, pe stânga */}
      <Sageata d="M 168 212 L 168 158" culoare={cEndo} marker={mEndo} />
      <Sageata d="M 168 116 L 168 62" culoare={cEndo} marker={mEndo} />
      <Text x={158} y={189} ancora="end" marime={13} culoare={cEndo}>topire</Text>
      <Text x={158} y={93} ancora="end" marime={13} culoare={cEndo}>vaporizare</Text>

      {/* exoterme: în jos, pe dreapta */}
      <Sageata d="M 312 160 L 312 214" culoare={cExo} marker={mExo} />
      <Sageata d="M 312 64 L 312 118" culoare={cExo} marker={mExo} />
      <Text x={322} y={189} ancora="start" marime={13} culoare={cExo}>solidificare</Text>
      <Text x={322} y={93} ancora="start" marime={13} culoare={cExo}>condensare</Text>

      {/* solid → gaz și gaz → solid, pe ocolite */}
      <Sageata d="M 180 232 L 72 232 L 72 40 L 177 40" culoare={cEndo} marker={mEndo} />
      <Sageata d="M 300 40 L 408 40 L 408 232 L 303 232" culoare={cExo} marker={mExo} />
      <TextV x={54} y={136} culoare={cEndo}>sublimare</TextV>
      <TextV x={426} y={136} culoare={cExo}>desublimare</TextV>

      <Text x={240} y={90} ancora="middle" marime={12} culoare={CULORI.slab}>mai multă ordine ↓</Text>
      <Text x={240} y={188} ancora="middle" marime={12} culoare={CULORI.slab}>mai multă dezordine ↑</Text>
    </Schema>
  );
}

/** Topire și dizolvare: două fenomene care se confundă în vorbirea de zi cu zi. */
export function FigTopireDizolvare() {
  return (
    <Schema
      vb="0 0 460 200"
      latime={460}
      eticheta="Gheață care se topește într-un pahar, alături de zahăr care se dizolvă în cafea"
      legenda="La stânga, o singură substanță care își schimbă starea. La dreapta, două substanțe care se amestecă."
    >
      <Sageti prefix="td" />

      {/* paharul cu gheață */}
      <path d="M 60 40 L 72 150 L 148 150 L 160 40" fill="none" stroke={CULORI.contur} strokeWidth={1.8} />
      <path d="M 68 92 L 152 92 L 148 150 L 72 150 Z" fill={CULORI.umplutura} stroke="none" />
      <path d="M 68 92 L 152 92" stroke={CULORI.contur} strokeWidth={1.6} />
      <rect x={82} y={62} width={30} height={26} rx="3" fill="none" stroke={CULORI.contur} strokeWidth={1.6} />
      <rect x={116} y={68} width={26} height={22} rx="3" fill="none" stroke={CULORI.contur} strokeWidth={1.6} />
      <Text x={110} y={174} ancora="middle" marime={13}>topire</Text>
      <Text x={110} y={192} ancora="middle" marime={12} culoare={CULORI.slab}>apă și gheață — același corp</Text>

      {/* ceașca cu zahăr */}
      <path d="M 296 60 L 302 148 L 378 148 L 384 60 Z" fill="none" stroke={CULORI.contur} strokeWidth={1.8} />
      <path d="M 298 84 L 382 84 L 378 148 L 302 148 Z" fill={CULORI.umplutura} stroke="none" />
      <path d="M 298 84 L 382 84" stroke={CULORI.contur} strokeWidth={1.6} />
      <path d="M 384 76 C 412 76, 412 116, 384 116" fill="none" stroke={CULORI.contur} strokeWidth={1.8} />
      <rect x={322} y={54} width={24} height={20} rx="2" fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.6} />
      {[[318, 98], [340, 106], [356, 96], [330, 122], [352, 128], [366, 114]].map(([x, y]) => (
        <circle key={`z${x}-${y}`} cx={x} cy={y} r={3} fill={CULORI.contur} />
      ))}
      <Sageata d="M 334 78 L 334 94" marker="td-ink" grosime={1.4} />
      <Text x={340} y={174} ancora="middle" marime={13}>dizolvare</Text>
      <Text x={340} y={192} ancora="middle" marime={12} culoare={CULORI.slab}>zahăr și cafea — două corpuri</Text>
    </Schema>
  );
}

/** Montajul cu care se urmărește topirea gheții. */
export function FigMontajTopire() {
  return (
    <Schema
      vb="0 0 340 268"
      latime={330}
      eticheta="Pahar Berzelius cu gheață, termometru și sursă de încălzire pe trepied"
      legenda="Gheață mărunțită, termometrul cufundat în ea, și o încălzire slabă și constantă."
    >
      <Sageti prefix="mt" />

      {/* paharul */}
      <path d="M 104 84 L 104 178 L 236 178 L 236 84" fill="none" stroke={CULORI.contur} strokeWidth={2} />
      <path d="M 236 96 L 252 104" stroke={CULORI.contur} strokeWidth={2} fill="none" />

      {/* gheața */}
      {[[126, 156], [160, 150], [196, 158], [140, 128], [180, 124], [212, 140], [158, 172], [206, 172]].map(
        ([x, y]) => (
          <rect
            key={`gh${x}-${y}`}
            x={x - 13}
            y={y - 11}
            width={26}
            height={22}
            rx="3"
            fill={CULORI.umplutura}
            stroke={CULORI.contur}
            strokeWidth={1.3}
          />
        ),
      )}

      {/* termometrul */}
      <rect x={164} y={30} width={13} height={128} rx="6" fill="none" stroke={CULORI.contur} strokeWidth={1.6} />
      <circle cx={170.5} cy={162} r={9} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.6} />
      <Text x={190} y={44} ancora="start" marime={12}>termometru</Text>

      {/* trepiedul și flacăra */}
      <path d="M 88 190 L 252 190" stroke={CULORI.contur} strokeWidth={2.2} fill="none" />
      <path d="M 100 190 L 100 240 M 240 190 L 240 240" stroke={CULORI.contur} strokeWidth={2} fill="none" />
      <path
        d="M 170 236 C 150 224, 156 210, 170 200 C 184 210, 190 224, 170 236 Z"
        fill={CULORI.umplutura}
        stroke={CULORI.contur}
        strokeWidth={1.6}
      />
      <Text x={170} y={258} ancora="middle" marime={12} culoare={CULORI.slab}>încălzire slabă și constantă</Text>
    </Schema>
  );
}

/* ————————————————————————————————————————————————————————————————
   Graficul temperatură–timp
   ———————————————————————————————————————————————————————————————— */

const MASURATORI = [
  [0, -18], [1, -12], [2, -6], [3, -2], [4, 0], [5, 0], [6, 0], [7, 0],
  [8, 0], [9, 0], [10, 4], [11, 9], [12, 13], [13, 17], [14, 20],
];

const GX = (t) => 62 + (368 / 14) * t;
const GY = (temp) => 250 - 5.5 * (temp + 20);

/**
 * Curba temperatură–timp la încălzirea gheții.
 *
 * Cu `goala`, se desenează numai caroiajul și axele — foaia pe care elevul
 * își trece propriile măsurători înainte de a se uita la rezolvare.
 */
export function FigCurbaTopire({ goala }) {
  const puncte = MASURATORI.map(([t, temp]) => `${GX(t)},${GY(temp)}`).join(' ');
  return (
    <Schema
      vb="0 0 470 296"
      latime={470}
      eticheta={
        goala
          ? 'Caroiaj gol pentru graficul temperaturii în funcție de timp'
          : 'Graficul temperaturii gheții în funcție de timp, cu palierul la 0 grade Celsius'
      }
      legenda={
        goala
          ? 'Caroiajul pe care se trec măsurătorile.'
          : 'Temperatura urcă, se oprește pe loc cât ține topirea, apoi urcă din nou.'
      }
    >
      <Sageti prefix="gr" />

      {/* caroiajul */}
      {Array.from({ length: 15 }, (_, i) => i).map((t) => (
        <path
          key={`gv${t}`}
          d={`M ${GX(t)} 30 L ${GX(t)} 250`}
          stroke={CULORI.slab}
          strokeWidth={t % 2 === 0 ? 0.9 : 0.45}
          fill="none"
        />
      ))}
      {[-20, -15, -10, -5, 0, 5, 10, 15, 20].map((temp) => (
        <path
          key={`gh${temp}`}
          d={`M 62 ${GY(temp)} L 430 ${GY(temp)}`}
          stroke={CULORI.slab}
          strokeWidth={temp % 10 === 0 ? 0.9 : 0.45}
          fill="none"
        />
      ))}

      {/* axele */}
      <Sageata d="M 62 250 L 444 250" marker="gr-ink" grosime={1.6} />
      <Sageata d="M 62 250 L 62 22" marker="gr-ink" grosime={1.6} />
      {[0, 2, 4, 6, 8, 10, 12, 14].map((t) => (
        <Text key={`tx${t}`} x={GX(t)} y={268} ancora="middle" marime={12}>
          {t}
        </Text>
      ))}
      {[-20, -10, 0, 10, 20].map((temp) => (
        <Text key={`ty${temp}`} x={54} y={GY(temp) + 4} ancora="end" marime={12}>
          {temp}
        </Text>
      ))}
      <Text x={444} y={284} ancora="end" marime={12}>t (min)</Text>
      <Text x={62} y={16} ancora="middle" marime={12}>θ (°C)</Text>

      {!goala && (
        <>
          <path d={`M ${GX(0)} ${GY(0)} L ${GX(14)} ${GY(0)}`} stroke={CULORI.contur} strokeWidth={1.1} strokeDasharray="5 4" fill="none" />
          <polyline points={puncte} fill="none" stroke={CULORI.contur} strokeWidth={2.2} strokeLinejoin="round" />
          {MASURATORI.map(([t, temp]) => (
            <circle key={`p${t}`} cx={GX(t)} cy={GY(temp)} r={3.2} fill={CULORI.contur} />
          ))}
          <path
            d={`M ${GX(4)} ${GY(0) - 16} L ${GX(4)} ${GY(0) - 24} L ${GX(9)} ${GY(0) - 24} L ${GX(9)} ${GY(0) - 16}`}
            fill="none"
            stroke={CULORI.contur}
            strokeWidth={1.2}
          />
          <Text x={(GX(4) + GX(9)) / 2} y={GY(0) - 30} ancora="middle" marime={12}>
            palier — topirea
          </Text>
        </>
      )}
    </Schema>
  );
}

/* ————————————————————————————————————————————————————————————————
   C3 — transferurile de energie
   ———————————————————————————————————————————————————————————————— */

/** Transformare endotermică și transformare exotermică. */
export function FigEndoExo() {
  return (
    <Schema
      vb="0 0 470 190"
      latime={470}
      eticheta="Sistem care primește energie din exterior și sistem care cedează energie exteriorului"
      legenda="La stânga sistemul primește energie, la dreapta o cedează."
    >
      <Sageti prefix="ee" />

      <rect x={78} y={54} width={104} height={62} rx="5" fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.6} />
      <Text x={130} y={90} ancora="middle" marime={14}>sistemul</Text>
      <Sageata d="M 20 85 L 72 85" culoare={CULORI.iese} marker="ee-endo" grosime={2.2} />
      <Text x={130} y={38} ancora="middle" marime={13} culoare={CULORI.iese}>primește energie</Text>
      <Text x={130} y={144} ancora="middle" marime={14}>transformare</Text>
      <Text x={130} y={162} ancora="middle" marime={14}>endotermică</Text>

      <rect x={288} y={54} width={104} height={62} rx="5" fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.6} />
      <Text x={340} y={90} ancora="middle" marime={14}>sistemul</Text>
      <Sageata d="M 398 85 L 450 85" culoare={CULORI.intra} marker="ee-exo" grosime={2.2} />
      <Text x={340} y={38} ancora="middle" marime={13} culoare={CULORI.intra}>cedează energie</Text>
      <Text x={340} y={144} ancora="middle" marime={14}>transformare</Text>
      <Text x={340} y={162} ancora="middle" marime={14}>exotermică</Text>
    </Schema>
  );
}

/** Cometa care trece pe lângă Soare. */
export function FigCometa() {
  return (
    <Schema
      vb="0 0 470 210"
      latime={470}
      eticheta="Soarele la stânga, nucleul de gheață al unei comete la dreapta, cu coada îndreptată în partea opusă Soarelui"
      legenda="Gheața de la suprafață primește energie de la Soare și trece direct în stare gazoasă."
    >
      <Sageti prefix="cm" />

      <circle cx={56} cy={104} r={34} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.8} />
      {Array.from({ length: 12 }, (_, i) => i * 30).map((u) => {
        const rad = (u * Math.PI) / 180;
        return (
          <path
            key={`raza${u}`}
            d={`M ${56 + Math.cos(rad) * 40} ${104 + Math.sin(rad) * 40} L ${56 + Math.cos(rad) * 50} ${
              104 + Math.sin(rad) * 50
            }`}
            stroke={CULORI.contur}
            strokeWidth={1.4}
          />
        );
      })}
      <Text x={56} y={176} ancora="middle" marime={13}>Soarele</Text>

      <circle cx={276} cy={104} r={26} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.8} />
      <Text x={276} y={166} ancora="middle" marime={13}>nucleul de gheață</Text>
      <Simbol x={276} y={190} dupa={" = 1,2 km"}>r</Simbol>

      <Sageata d="M 122 104 L 240 104" marker="cm-ink" grosime={1.8} />
      <Text x={181} y={92} ancora="middle" marime={12} culoare={CULORI.slab}>energie primită</Text>

      {[
        [316, 76], [340, 66], [368, 60], [398, 54], [428, 48],
        [318, 104], [346, 102], [378, 100], [410, 98], [440, 96],
        [316, 132], [342, 140], [370, 146], [400, 152], [430, 158],
      ].map(([x, y]) => (
        <circle key={`coada${x}-${y}`} cx={x} cy={y} r={2.6} fill={CULORI.contur} />
      ))}
      <Text x={392} y={186} ancora="middle" marime={12} culoare={CULORI.slab}>vapori de apă eliberați</Text>
    </Schema>
  );
}
