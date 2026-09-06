import React from 'react';
import { Schema, Text } from './index';

/**
 * FIGURILE CAPITOLULUI „MĂSURARE ȘI ERORI”.
 *
 * Manualul-sursă e un PDF scanat, deci figurile se REDESENEAZĂ. Aici nu sunt
 * scheme de circuit, ci histograme, axe de valori și rezistoare cu inele
 * colorate — de aceea primitivele din `index.jsx` (fir, nod, rezistor…) nu
 * ajung, iar simbolurile noi se definesc mai jos, în fișierul capitolului.
 *
 * Culorile inelelor unui rezistor NU sunt decor: ele SUNT codul. De aceea se
 * desenează cu culorile lor adevărate, nu cu paleta paginii.
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

/**
 * Corpul unei histograme, desenat într-un sistem local cu originea în colțul
 * de jos-stânga al axelor. E scos separat fiindcă lecția are nevoie și de
 * histograme mari, singure în pagină, și de patru histograme mici alăturate.
 */
function CorpHistograma({
  ox = 0,
  oy = 0,
  frecvente,
  marcaje,
  maxY,
  pasY = 1,
  unitate = 34,
  pas = 46,
  titlu,
  titluX,
  titluY = 'Numărul de măsurători',
  fontEt = 11,
  pasEticheta = 1,
}) {
  const nx = frecvente.length;
  const H = maxY * unitate;
  const L = nx * pas;
  const tickuri = [];
  for (let v = 0; v <= maxY + 1e-9; v += pasY) tickuri.push(Math.round(v * 100) / 100);
  return (
    <g transform={`translate(${ox},${oy})`}>
      {titlu && (
        <Text x={L / 2} y={-H - 38} ancora="middle" marime={13}>
          {titlu}
        </Text>
      )}
      {titluY && (
        <Text x={-44} y={-H - 18} ancora="start" marime={fontEt}>
          {titluY}
        </Text>
      )}
      {frecvente.map((f, i) =>
        f > 0 ? (
          <rect
            key={i}
            x={i * pas}
            y={-f * unitate}
            width={pas}
            height={f * unitate}
            fill={UMPLUT}
            stroke={CONTUR}
            strokeWidth={GROS}
          />
        ) : null,
      )}
      <Linie d={`M -12 0 L ${L + 22} 0`} />
      <VarfAxa x={L + 22} y={0} dir="dreapta" />
      <Linie d={`M 0 8 L 0 ${-H - 14}`} />
      <VarfAxa x={0} y={-H - 14} dir="sus" />
      {tickuri.map((v) => (
        <g key={v}>
          <Linie d={`M -4 ${-v * unitate} L 0 ${-v * unitate}`} />
          <Text x={-8} y={-v * unitate + 4} ancora="end" marime={fontEt}>
            {v}
          </Text>
        </g>
      ))}
      {marcaje.map((m, i) =>
        i % pasEticheta === 0 ? (
          <Text key={i} x={i * pas} y={18} ancora="middle" marime={fontEt}>
            {m}
          </Text>
        ) : null,
      )}
      {titluX && (
        <Text x={L / 2} y={42} ancora="middle" marime={fontEt}>
          {titluX}
        </Text>
      )}
    </g>
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

/* ══ 3. Histogramele vitezei sunetului ════════════════════════════════════ */

export function FigHistogramaSunet10() {
  return (
    <Schema
      vb="0 0 430 178"
      latime={430}
      eticheta="Histograma măsurătorilor vitezei sunetului, pe intervale de 10 m/s"
      legenda="Histograma celor opt măsurători, pe intervale de 10 m/s."
    >
      <CorpHistograma
        ox={66}
        oy={120}
        frecvente={[1, 1, 2, 2, 1, 0, 1]}
        marcaje={['320', '330', '340', '350', '360', '370', '380', '390']}
        maxY={2}
        pasY={1}
        unitate={40}
        pas={46}
        titluX="Viteza sunetului măsurată (m/s)"
      />
    </Schema>
  );
}

export function FigHistogramaSunet20() {
  return (
    <Schema
      vb="0 0 300 218"
      latime={300}
      eticheta="Histograma acelorași măsurători, pe intervale de 20 m/s"
      legenda="Aceleași opt măsurători, grupate acum pe intervale de 20 m/s."
    >
      <CorpHistograma
        ox={66}
        oy={158}
        frecvente={[2, 4, 2]}
        marcaje={['320', '340', '360', '380']}
        maxY={4}
        pasY={1}
        unitate={30}
        pas={60}
        titluX="Viteza sunetului măsurată (m/s)"
      />
    </Schema>
  );
}

/* ══ 4. Histograma celor zece măsurători de rezistență ════════════════════ */

export function FigHistogramaRezistenta() {
  return (
    <Schema
      vb="0 0 420 218"
      latime={420}
      eticheta="Histograma celor zece măsurători de rezistență, pe intervale de un kiloohm"
      legenda="Histograma celor zece măsurători ale rezistenței, pe intervale de 1 kΩ."
    >
      <CorpHistograma
        ox={66}
        oy={158}
        frecvente={[0, 1, 2, 4, 2, 1, 0]}
        marcaje={['152', '153', '154', '155', '156', '157', '158', '159']}
        maxY={4}
        pasY={1}
        unitate={30}
        pas={44}
        titluX="Rezistența măsurată (kΩ)"
      />
    </Schema>
  );
}

/* ══ 5. Rezistorul: corpul și inelele ═════════════════════════════════════ */

function CorpRezistor({ yFir = 60, inele, xCorp = 130 }) {
  return (
    <g>
      <path
        d={`M 30 ${yFir} L 400 ${yFir}`}
        stroke="#9aa0a6"
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
      />
      <rect
        x={xCorp}
        y={yFir - 26}
        width={170}
        height={52}
        rx={14}
        fill="#e6c6a4"
        stroke="#b08b62"
        strokeWidth={1.4}
      />
      {inele.map((in_, i) => (
        <rect
          key={i}
          x={in_.x}
          y={yFir - 26}
          width={14}
          height={52}
          fill={in_.c}
        />
      ))}
    </g>
  );
}

export function FigRezistorMasurat() {
  return (
    <Schema
      vb="0 0 430 105"
      latime={400}
      eticheta="Rezistorul măsurat de elevi, cu inelele maro, verde, galben și auriu"
      legenda="Rezistorul măsurat de elevi: inelele lui sunt, în ordine, maro, verde, galben și auriu."
    >
      <CorpRezistor
        inele={[
          { x: 148, c: '#7a4a24' },
          { x: 172, c: '#1c7c4a' },
          { x: 196, c: '#f1c40f' },
          { x: 272, c: '#c9a227' },
        ]}
      />
    </Schema>
  );
}

export function FigCodCulori() {
  const b = [175, 199, 223, 299];
  return (
    <Schema
      vb="0 0 460 180"
      latime={460}
      eticheta="Ce înseamnă fiecare inel colorat de pe un rezistor"
      legenda="Cele patru inele ale unui rezistor: primele două dau cifrele, al treilea multiplicatorul, iar ultimul precizia."
    >
      <g transform="translate(20,0)">
        <CorpRezistor
          yFir={55}
          xCorp={150}
          inele={[
            { x: 168, c: '#bdbdbd' },
            { x: 192, c: '#bdbdbd' },
            { x: 216, c: '#bdbdbd' },
            { x: 292, c: '#bdbdbd' },
          ]}
        />
        <Linie d={`M ${b[0]} 84 L ${b[0]} 114 L 140 114`} culoare={SLAB} grosime={1.2} />
        <Text x={136} y={118} ancora="end" marime={11}>
          prima cifră
        </Text>
        <Linie d={`M ${b[1]} 84 L ${b[1]} 136 L 140 136`} culoare={SLAB} grosime={1.2} />
        <Text x={136} y={140} ancora="end" marime={11}>
          a doua cifră
        </Text>
        <Linie d={`M ${b[2]} 84 L ${b[2]} 158 L 140 158`} culoare={SLAB} grosime={1.2} />
        <Text x={136} y={162} ancora="end" marime={11}>
          multiplicatorul
        </Text>
        <Linie d={`M ${b[3]} 84 L ${b[3]} 114 L 350 114`} culoare={SLAB} grosime={1.2} />
        <Text x={354} y={118} ancora="start" marime={11}>
          precizia
        </Text>
      </g>
    </Schema>
  );
}

/* ══ 6. Cele patru serii de măsurători ale frecvenței ═════════════════════ */

export function FigPatruSerii() {
  return (
    <Schema
      vb="0 0 520 400"
      latime={520}
      eticheta="Patru histograme ale unor serii de măsurători ale frecvenței unui sunet"
      legenda="Patru serii de măsurători ale frecvenței sunetului scos de un instrument muzical."
    >
      <CorpHistograma
        ox={58}
        oy={140}
        titlu="Seria 1"
        frecvente={[1, 14, 30, 36, 16, 3]}
        marcaje={['219,7', '219,8', '219,9', '220,0', '220,1', '220,2', '220,3']}
        maxY={40}
        pasY={10}
        unitate={2.2}
        pas={30}
        pasEticheta={2}
        fontEt={9}
        titluY="Nr. de măsurători"
        titluX="Frecvența măsurată (Hz)"
      />
      <CorpHistograma
        ox={300}
        oy={140}
        titlu="Seria 2"
        frecvente={[1, 1, 4, 2, 2]}
        marcaje={['348,4', '348,6', '348,8', '349,0', '349,2', '349,4']}
        maxY={4}
        pasY={1}
        unitate={22}
        pas={34}
        pasEticheta={2}
        fontEt={9}
        titluY="Nr. de măsurători"
        titluX="Frecvența măsurată (Hz)"
      />
      <CorpHistograma
        ox={58}
        oy={330}
        titlu="Seria 3"
        frecvente={[2, 22, 14, 7, 2]}
        marcaje={['439,8', '439,9', '440,0', '440,1', '440,2', '440,3']}
        maxY={25}
        pasY={5}
        unitate={3.4}
        pas={34}
        pasEticheta={2}
        fontEt={9}
        titluY="Nr. de măsurători"
        titluX="Frecvența măsurată (Hz)"
      />
      <CorpHistograma
        ox={300}
        oy={330}
        titlu="Seria 4"
        frecvente={[5, 22, 48, 81, 69, 45, 27, 6]}
        marcaje={['436', '437', '438', '439', '440', '441', '442', '443', '444']}
        maxY={80}
        pasY={20}
        unitate={1.05}
        pas={22}
        pasEticheta={2}
        fontEt={9}
        titluY="Nr. de măsurători"
        titluX="Frecvența măsurată (Hz)"
      />
    </Schema>
  );
}

/* ══ 7. Cei doi senzori GPS ═══════════════════════════════════════════════ */

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

/* ══ 8. Măsurătorile senzorului imobil, puse pe axă ═══════════════════════ */

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
