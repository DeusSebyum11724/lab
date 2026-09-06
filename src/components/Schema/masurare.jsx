import React from 'react';
import { Schema, Text } from './index';

/**
 * FIGURILE CAPITOLULUI „MĂSURARE ȘI ERORI”.
 *
 * Aici au mai rămas doar figurile care NU au corespondent în manual: seria de
 * măsurători pusă pe o axă, amplitudinea ei și cei doi senzori GPS. Manualul
 * dă senzorii numai printr-un tabel de cifre, iar seria de măsurători nici
 * măcar atât — figurile astea au fost gândite pentru lecția românească, deci
 * n-au ce decupa și rămân desenate.
 *
 * Histogramele și rezistoarele, care în manual sunt desenate, au trecut la
 * decupaj din carte cu etichete românești puse peste (`FiguraManual`): acolo
 * geometria trebuia să fie întocmai cea din carte.
 */

const UMPLUT = '#f6d9c6';
const CONTUR = 'var(--kl-ink)';
const SLAB = 'var(--kl-ink3)';
const GROS = 1.5;

/** Vârful unei axe. `dir` ia 'dreapta' sau 'sus'. */
function VarfAxa({ x, y, dir }) {
  const d =
    dir === 'sus'
      ? `M ${x} ${y - 10} L ${x - 4.5} ${y + 2} L ${x + 4.5} ${y + 2} Z`
      : `M ${x + 10} ${y} L ${x - 2} ${y - 4.5} L ${x - 2} ${y + 4.5} Z`;
  return <path d={d} fill={CONTUR} />;
}

/** Linie simplă; `punctat` o face întreruptă. */
function Linie({ d, culoare = CONTUR, grosime = GROS, punctat }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={culoare}
      strokeWidth={grosime}
      strokeLinecap="round"
      strokeDasharray={punctat ? '4 4' : undefined}
    />
  );
}

/* ── Axa de valori pe care se pun punctele unei serii de măsurători ────────── */

function AxaValori({ y, x0, x1, ticks, pozitie, eticheta }) {
  return (
    <g>
      <Linie d={`M ${x0} ${y} L ${x1} ${y}`} />
      <VarfAxa x={x1} y={y} dir="dreapta" />
      {ticks.map((t) => (
        <g key={t}>
          <Linie d={`M ${pozitie(t)} ${y} L ${pozitie(t)} ${y + 5}`} />
          <Text x={pozitie(t)} y={y + 20} ancora="middle" marime={11}>
            {String(t).replace('.', ',')}
          </Text>
        </g>
      ))}
      {eticheta && (
        <Text x={(x0 + x1) / 2} y={y + 40} ancora="middle" marime={11}>
          {eticheta}
        </Text>
      )}
    </g>
  );
}

/* ══ 1. Seria de măsurători ale vitezei sunetului, pusă pe o axă ═══════════ */

const pozSunet = (v) => 50 + (v - 315) * 4.6;

export function FigSerieSunet() {
  const puncte = [
    [320, 0],
    [330, 0],
    [340, 0],
    [340, 1],
    [350, 0],
    [350, 1],
    [360, 0],
    [380, 0],
  ];
  return (
    <Schema
      vb="0 0 430 145"
      latime={430}
      eticheta="Cele opt măsurători ale vitezei sunetului, așezate pe o axă, cu media marcată"
      legenda="Cele opt măsurători ale vitezei sunetului. Linia întreruptă arată media lor."
    >
      <Linie d={`M ${pozSunet(346.25)} 26 L ${pozSunet(346.25)} 84`} punctat culoare={SLAB} />
      <Text x={pozSunet(346.25)} y={20} ancora="middle" marime={11}>
        media
      </Text>
      {puncte.map(([v, k], i) => (
        <circle key={i} cx={pozSunet(v)} cy={64 - k * 15} r={4.5} fill={CONTUR} />
      ))}
      <AxaValori
        y={84}
        x0={40}
        x1={405}
        ticks={[320, 330, 340, 350, 360, 370, 380, 390]}
        pozitie={pozSunet}
        eticheta="Viteza sunetului măsurată (m/s)"
      />
    </Schema>
  );
}

/* ══ 2. Amplitudinea și semi-amplitudinea aceleiași serii ══════════════════ */

export function FigAmplitudine() {
  const a = pozSunet(320);
  const b = pozSunet(380);
  const m = pozSunet(350);
  const puncte = [
    [320, 0],
    [330, 0],
    [340, 0],
    [340, 1],
    [350, 0],
    [350, 1],
    [360, 0],
    [380, 0],
  ];
  return (
    <Schema
      vb="0 0 430 165"
      latime={430}
      eticheta="Amplitudinea seriei de măsurători, de la cea mai mică la cea mai mare valoare"
      legenda="Amplitudinea este lungimea intervalului în care cad toate măsurătorile; semi-amplitudinea e jumătatea ei."
    >
      <Linie d={`M ${a} 30 L ${b} 30`} />
      <Linie d={`M ${a} 25 L ${a} 35`} />
      <Linie d={`M ${b} 25 L ${b} 35`} />
      <Text x={(a + b) / 2} y={20} ancora="middle" marime={12}>
        A = 380 − 320 = 60 m/s
      </Text>
      <Linie d={`M ${a} 56 L ${m} 56`} culoare={SLAB} />
      <Linie d={`M ${a} 51 L ${a} 61`} culoare={SLAB} />
      <Linie d={`M ${m} 51 L ${m} 61`} culoare={SLAB} />
      <Text x={(a + m) / 2} y={48} ancora="middle" marime={11} culoare={SLAB}>
        A / 2 = 30 m/s
      </Text>
      {puncte.map(([v, k], i) => (
        <circle key={i} cx={pozSunet(v)} cy={88 - k * 14} r={4.5} fill={CONTUR} />
      ))}
      <AxaValori
        y={104}
        x0={40}
        x1={405}
        ticks={[320, 330, 340, 350, 360, 370, 380, 390]}
        pozitie={pozSunet}
        eticheta="Viteza sunetului măsurată (m/s)"
      />
    </Schema>
  );
}

/* ══ 3. Cei doi senzori GPS ═══════════════════════════════════════════════ */

export function FigSenzoriGPS() {
  return (
    <Schema
      vb="0 0 430 120"
      latime={430}
      eticheta="Doi senzori GPS pe aceeași axă: unul imobil, celălalt în mișcare"
      legenda="Senzorul A stă pe loc, iar senzorul B se deplasează de-a lungul axei cu viteza de 10 m/s."
    >
      <rect x={90} y={44} width={26} height={26} rx={4} fill={UMPLUT} stroke={CONTUR} strokeWidth={GROS} />
      <Text x={103} y={62} ancora="middle" marime={14}>
        B
      </Text>
      <Linie d="M 124 57 L 168 57" />
      <VarfAxa x={168} y={57} dir="dreapta" />
      <Text x={150} y={38} ancora="middle" marime={11}>
        v = 10 m/s
      </Text>
      <rect x={270} y={44} width={26} height={26} rx={4} fill={UMPLUT} stroke={CONTUR} strokeWidth={GROS} />
      <Text x={283} y={62} ancora="middle" marime={14}>
        A
      </Text>
      <Text x={283} y={36} ancora="middle" marime={11}>
        imobil
      </Text>
      <Linie d="M 40 88 L 390 88" />
      <VarfAxa x={390} y={88} dir="dreapta" />
      <Text x={396} y={104} ancora="start" marime={12}>
        x (m)
      </Text>
      <Linie d="M 103 70 L 103 88" culoare={SLAB} grosime={1.1} punctat />
      <Linie d="M 283 70 L 283 88" culoare={SLAB} grosime={1.1} punctat />
    </Schema>
  );
}

/* ══ 4. Măsurătorile senzorului imobil, puse pe axă ═══════════════════════ */

const pozGPS = (v) => 45 + v * 8.5;

export function FigMasuratoriSenzorA() {
  const valori = [9.1, 30.0, 22.8, 4.9, 14.2, 36.5];
  return (
    <Schema
      vb="0 0 420 140"
      latime={420}
      eticheta="Cele șase poziții măsurate de senzorul imobil, așezate pe o axă"
      legenda="Cele șase poziții măsurate de senzorul A, care stă pe loc. Linia întreruptă arată media lor."
    >
      <Linie d={`M ${pozGPS(19.58)} 26 L ${pozGPS(19.58)} 80`} punctat culoare={SLAB} />
      <Text x={pozGPS(19.58)} y={20} ancora="middle" marime={11}>
        media
      </Text>
      {valori.map((v, i) => (
        <circle key={i} cx={pozGPS(v)} cy={60} r={4.5} fill={CONTUR} />
      ))}
      <AxaValori
        y={80}
        x0={38}
        x1={392}
        ticks={[0, 10, 20, 30, 40]}
        pozitie={pozGPS}
        eticheta="Poziția măsurată x (m)"
      />
    </Schema>
  );
}
