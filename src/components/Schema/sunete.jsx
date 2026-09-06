import React from 'react';
import { Schema, Fir, Text, Simbol, CULORI } from './index';

/**
 * FIGURILE CAPITOLULUI „SEMNALE PERIODICE ȘI SUNETE”.
 *
 * Manualul-sursă e un PDF scanat, deci figurile lui nu se pot extrage ca
 * obiecte — se redesenează în cod. Aici sunt refăcute ecranele de osciloscop,
 * graficele de semnal, montajele și scara nivelului sonor din capitol.
 *
 * CE E PĂSTRAT EXACT: numărul de diviziuni pe perioadă, numărul de diviziuni
 * de deviație, perioadele semnalelor (în milisecunde), domeniile axelor și
 * pozițiile vârfurilor pe care le citește elevul — fiindcă tocmai ele sunt
 * exercițiul. Ce s-a schimbat e doar așezarea în pagină, ca figura să încapă
 * pe un ecran de telefon, și culoarea traseului, care ia cerneala platformei.
 *
 * Formele de undă complicate (înregistrările de chitară, bas și vioară) nu se
 * pot copia punct cu punct dintr-un scan; sunt reconstruite ca sume de
 * armonice, cu PERIOADA, DOMENIUL DE VALORI și POZIȚIA VÂRFULUI impuse — adică
 * exact mărimile pe care le cere enunțul.
 */

/* Culorile figurilor din capitol. Ecranul de osciloscop păstrează piersica
   manualului, grila e albă peste ea, iar traseul ia vișiniul platformei în
   locul roșului tipografic. */
const TRASEU = 'var(--kl-vin)';
const GRILA = '#ffffff';
const GRILA_GRAFIC = 'var(--kl-line)';

/* ══════════════════════════════════════════════════════════════════════════
   PRIMITIVE PROPRII CAPITOLULUI
   ══════════════════════════════════════════════════════════════════════════ */

/** Vârf de săgeată, ca `path`, orientat după versorul (ux, uy). */
function varf(x, y, ux, uy, m) {
  const px = -uy;
  const py = ux;
  return (
    `M ${x} ${y} ` +
    `L ${x - ux * 2 * m + px * m} ${y - uy * 2 * m + py * m} ` +
    `L ${x - ux * 2 * m - px * m} ${y - uy * 2 * m - py * m} Z`
  );
}

/**
 * Săgeată dreaptă, cu vârfurile desenate ca triunghiuri.
 *
 * Nu folosește `marker`, fiindcă marcatorii SVG cer identificatori unici pe
 * toată pagina, iar o lecție pune uneori aceeași figură de două ori.
 */
export function Sageata({ x1, y1, x2, y2, dubla, culoare = CULORI.fir, grosime = 1.4, m = 4.5 }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const L = Math.hypot(dx, dy) || 1;
  const ux = dx / L;
  const uy = dy / L;
  return (
    <g>
      <path
        d={`M ${x1} ${y1} L ${x2} ${y2}`}
        stroke={culoare}
        strokeWidth={grosime}
        fill="none"
        strokeLinecap="round"
      />
      <path d={varf(x2, y2, ux, uy, m)} fill={culoare} />
      {dubla && <path d={varf(x1, y1, -ux, -uy, m)} fill={culoare} />}
    </g>
  );
}

/**
 * Ecranul osciloscopului: 10 diviziuni pe lățime, 8 pe înălțime.
 *
 * Numărul de diviziuni nu e decorativ — el E unitatea de citire a perioadei
 * și a amplitudinii, deci rămâne cel din manual.
 */
export function Ecran({ x, y, div = 30, nx = 10, ny = 8, axe = true }) {
  const w = nx * div;
  const h = ny * div;
  const linii = [];
  for (let i = 1; i < nx; i++) {
    linii.push(
      <line key={`v${i}`} x1={x + i * div} y1={y} x2={x + i * div} y2={y + h} stroke={GRILA} strokeWidth={1.1} />,
    );
  }
  for (let j = 1; j < ny; j++) {
    linii.push(
      <line key={`h${j}`} x1={x} y1={y + j * div} x2={x + w} y2={y + j * div} stroke={GRILA} strokeWidth={1.1} />,
    );
  }
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={9}
        fill={CULORI.umplutura}
        stroke={TRASEU}
        strokeWidth={1.8}
      />
      {linii}
      {axe && (
        <g>
          <line
            x1={x + w / 2}
            y1={y}
            x2={x + w / 2}
            y2={y + h}
            stroke={GRILA}
            strokeWidth={1.8}
            strokeDasharray="3 3"
          />
          <line
            x1={x}
            y1={y + h / 2}
            x2={x + w}
            y2={y + h / 2}
            stroke={GRILA}
            strokeWidth={1.8}
            strokeDasharray="3 3"
          />
        </g>
      )}
    </g>
  );
}

/** Traseul luminos de pe ecran. */
function Traseu({ d, culoare = TRASEU, grosime = 2 }) {
  return <path d={d} fill="none" stroke={culoare} strokeWidth={grosime} strokeLinejoin="round" strokeLinecap="round" />;
}

/** Construiește un `path` dintr-o funcție x → y, eșantionată des. */
function cale(f, x0, x1, n = 500) {
  let d = '';
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    d += (i ? ' L ' : 'M ') + x.toFixed(2) + ' ' + f(x).toFixed(2);
  }
  return d;
}

/**
 * Formă de undă periodică reconstruită din armonice.
 *
 * `armonice` sunt perechile [amplitudine, fază] pentru armonicele 1, 2, 3…
 * Funcția întoarsă are exact perioada `T`, ia valori exact între `vMin` și
 * `vMax`, iar reperul ei (vârful sau golul, după `tip`) cade exact la `tReper`.
 * Astfel citirile cerute în enunț — perioada și poziția vârfurilor — sunt cele
 * din manual, chiar dacă zbârciturile fine ale scanului nu se pot copia.
 */
function formaPeriodica(armonice, T, vMin, vMax, tReper, tip = 'max') {
  const g = (p) => armonice.reduce((s, [a, f], i) => s + a * Math.sin(2 * Math.PI * (i + 1) * p + f), 0);
  const N = 720;
  let mn = Infinity;
  let mx = -Infinity;
  let pMn = 0;
  let pMx = 0;
  for (let i = 0; i < N; i++) {
    const p = i / N;
    const v = g(p);
    if (v < mn) {
      mn = v;
      pMn = p;
    }
    if (v > mx) {
      mx = v;
      pMx = p;
    }
  }
  const pRef = tip === 'min' ? pMn : pMx;
  return (t) => {
    let p = ((t - tReper) / T + pRef) % 1;
    if (p < 0) p += 1;
    return vMin + ((g(p) - mn) * (vMax - vMin)) / (mx - mn);
  };
}

/** Grilă de grafic (linii subțiri), pentru figurile care nu sunt ecrane. */
function Grila({ x, y, w, h, nx, ny }) {
  const linii = [];
  for (let i = 0; i <= nx; i++) {
    linii.push(
      <line
        key={`gv${i}`}
        x1={x + (i * w) / nx}
        y1={y}
        x2={x + (i * w) / nx}
        y2={y + h}
        stroke={GRILA_GRAFIC}
        strokeWidth={1}
      />,
    );
  }
  for (let j = 0; j <= ny; j++) {
    linii.push(
      <line
        key={`gh${j}`}
        x1={x}
        y1={y + (j * h) / ny}
        x2={x + w}
        y2={y + (j * h) / ny}
        stroke={GRILA_GRAFIC}
        strokeWidth={1}
      />,
    );
  }
  return <g>{linii}</g>;
}

/* ══════════════════════════════════════════════════════════════════════════
   C1 — FENOMENE PERIODICE, PERIOADA ȘI FRECVENȚA
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Ecranul osciloscopului, adnotat: perioada, tensiunea maximă și cea minimă,
 * diviziunea pe orizontală și diviziunea pe verticală.
 */
export function FigOscilograma() {
  const X = 95;
  const Y = 55;
  const DIV = 30;
  const W = 10 * DIV;
  const H = 8 * DIV;
  const cx = X + W / 2;
  const cy = Y + H / 2;
  const P = 3.1 * DIV;
  const A = 2 * DIV;
  const u = (x) => cy - A * Math.sin((2 * Math.PI * (x - X)) / P);
  const varf1 = X + P / 4;
  const varf2 = varf1 + P;
  const gol1 = varf1 + P / 2;
  return (
    <Schema
      vb="0 0 540 340"
      latime={540}
      eticheta="Ecran de osciloscop cu un semnal sinusoidal; sunt marcate perioada T, tensiunea maximă, tensiunea minimă și cele două diviziuni ale grilei"
      legenda="Traseul osciloscopului dă reprezentarea tensiunii în funcție de timp."
    >
      <Ecran x={X} y={Y} div={DIV} axe={false} />

      {/* liniile punctate ale valorilor extreme */}
      <line x1={X} y1={cy - A} x2={X + W} y2={cy - A} stroke={CULORI.slab} strokeWidth={1.2} strokeDasharray="5 4" />
      <line x1={X} y1={cy + A} x2={X + W} y2={cy + A} stroke={CULORI.slab} strokeWidth={1.2} strokeDasharray="5 4" />

      {/* axele */}
      <Sageata x1={cx} y1={Y + H + 14} x2={cx} y2={Y - 16} grosime={1.6} />
      <Sageata x1={X - 14} y1={cy} x2={X + W + 30} y2={cy} grosime={1.6} />
      <Text x={cx + 8} y={Y - 20} marime={12}>
        tensiunea U(t)
      </Text>
      <Text x={X + W + 36} y={cy + 4} marime={12}>
        timpul t
      </Text>

      <Traseu d={cale(u, X + 1, X + W - 1)} />

      {/* perioada */}
      <Sageata x1={varf1} y1={Y + 16} x2={varf2} y2={Y + 16} dubla grosime={1.3} m={4} />
      <Text x={(varf1 + varf2) / 2} y={Y + 10} ancora="middle" marime={12}>
        perioada T
      </Text>

      {/* valorile extreme */}
      <Simbol x={varf1 + 34} y={cy - A - 6} ancora="start" marime={13}>
        U_max
      </Simbol>
      <Fir d={`M ${varf1 + 32} ${cy - A - 10} L ${varf1 + 6} ${cy - A - 2}`} grosime={1} culoare={CULORI.slab} />
      <Simbol x={gol1 + 30} y={cy + A + 18} ancora="start" marime={13}>
        U_min
      </Simbol>
      <Fir d={`M ${gol1 + 28} ${cy + A + 14} L ${gol1 + 6} ${cy + A + 3}`} grosime={1} culoare={CULORI.slab} />

      {/* diviziunile */}
      <Sageata x1={X} y1={Y + H + 24} x2={X + DIV} y2={Y + H + 24} dubla grosime={1.2} m={3.6} />
      <Text x={X + DIV + 8} y={Y + H + 28} marime={11}>
        diviziune pe orizontală
      </Text>
      <Sageata x1={X + W + 12} y1={Y + H - DIV} x2={X + W + 12} y2={Y + H} dubla grosime={1.2} m={3.6} />
      <Text x={X + W + 20} y={Y + H - DIV / 2 + 4} marime={11}>
        diviziune
      </Text>
      <Text x={X + W + 20} y={Y + H - DIV / 2 + 18} marime={11}>
        pe verticală
      </Text>
    </Schema>
  );
}

/** Alura cerută la punctul 4 al exercițiului-tip: 4 diviziuni pe perioadă, 2 diviziuni amplitudine. */
export function FigAluraExercitiuTip() {
  const X = 40;
  const Y = 30;
  const DIV = 32;
  const W = 10 * DIV;
  const cy = Y + 4 * DIV;
  const u = (x) => cy - 2 * DIV * Math.sin((2 * Math.PI * (x - X)) / (4 * DIV));
  return (
    <Schema
      vb="0 0 400 340"
      latime={400}
      eticheta="Ecran de osciloscop cu o sinusoidă de patru diviziuni pe perioadă și două diviziuni amplitudine"
      legenda="Alura tensiunii pe ecran: o perioadă ocupă 4 diviziuni, iar spotul urcă și coboară câte 2 diviziuni."
    >
      <Ecran x={X} y={Y} div={DIV} />
      <Traseu d={cale(u, X + 1, X + W - 1)} />
    </Schema>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   C2 — SUNETUL CA UNDĂ
   ══════════════════════════════════════════════════════════════════════════ */

/** Straturile de aer comprimate și destinse prin care trece unda sonoră. */
export function FigTranseAer() {
  const linii = [];
  for (let k = 0; k <= 26; k++) {
    const baza = 60 + 13 * k;
    const x = baza + 11 * Math.sin((2 * Math.PI * (baza - 60)) / 120);
    linii.push(<line key={k} x1={x} y1={72} x2={x} y2={152} stroke={CULORI.fir} strokeWidth={1.5} />);
  }
  const acolada = (x1, x2, y, sus) => {
    const s = sus ? -1 : 1;
    return `M ${x1} ${y + 7 * s} L ${x1} ${y} L ${x2} ${y} L ${x2} ${y + 7 * s}`;
  };
  return (
    <Schema
      vb="0 0 460 226"
      latime={460}
      eticheta="Straturi de aer desenate ca linii verticale, dese în zonele comprimate și rare în zonele destinse"
      legenda="Unda sonoră e o succesiune de comprimări și destinderi ale straturilor de aer, care se transmit din aproape în aproape."
    >
      {linii}

      {/* zonele destinse, cu acolade deasupra */}
      <Fir d={acolada(152, 208, 62, true)} grosime={1.2} culoare={CULORI.slab} />
      <Fir d={acolada(272, 328, 62, true)} grosime={1.2} culoare={CULORI.slab} />
      <Fir d="M 180 62 L 180 42 M 300 62 L 300 42 M 180 42 L 300 42 M 240 42 L 240 34" grosime={1.2} culoare={CULORI.slab} />
      <Text x={240} y={26} ancora="middle" marime={12}>
        straturi de aer destinse
      </Text>

      {/* zonele comprimate, cu acolade dedesubt */}
      <Fir d={acolada(100, 144, 162, false)} grosime={1.2} culoare={CULORI.slab} />
      <Fir d={acolada(220, 264, 162, false)} grosime={1.2} culoare={CULORI.slab} />
      <Fir d="M 122 162 L 122 182 M 242 162 L 242 182 M 122 182 L 242 182 M 182 182 L 182 190" grosime={1.2} culoare={CULORI.slab} />
      <Text x={182} y={204} ancora="middle" marime={12}>
        straturi de aer comprimate
      </Text>

      {/* mișcarea locală, dus-întors */}
      <Sageata x1={62} y1={112} x2={92} y2={112} dubla culoare={TRASEU} grosime={1.3} m={3.6} />
      <Sageata x1={182} y1={112} x2={212} y2={112} dubla culoare={TRASEU} grosime={1.3} m={3.6} />
      <Sageata x1={302} y1={112} x2={332} y2={112} dubla culoare={TRASEU} grosime={1.3} m={3.6} />
    </Schema>
  );
}

/** Microfonul legat la osciloscop: sunetul devine tensiune variabilă. */
export function FigMicrofonOsciloscop() {
  const semnal = (x) =>
    128 +
    16 * Math.sin(x / 7.3) +
    11 * Math.sin(x / 3.1 + 1.2) +
    7 * Math.sin(x / 1.7 + 2.4) +
    5 * Math.sin(x / 1.1 + 0.6);
  const arce = [26, 40, 54, 68].map((r) => {
    const a = (52 * Math.PI) / 180;
    const x1 = 44 + r * Math.cos(-a);
    const y1 = 120 + r * Math.sin(-a);
    const x2 = 44 + r * Math.cos(a);
    const y2 = 120 + r * Math.sin(a);
    return <path key={r} d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`} fill="none" stroke={CULORI.slab} strokeWidth={1.6} />;
  });
  return (
    <Schema
      vb="0 0 500 258"
      latime={500}
      eticheta="Sursă de sunet, microfon și osciloscop legate în lanț; pe ecranul osciloscopului apare un traseu neregulat"
      legenda="Microfonul transformă sunetul într-o tensiune variabilă, pe care osciloscopul o arată în funcție de timp."
    >
      <circle cx={44} cy={120} r={4} fill={CULORI.fir} />
      {arce}
      <Text x={44} y={196} ancora="middle" marime={12}>
        sursa de sunet
      </Text>

      {/* microfonul */}
      <path d="M 158 100 L 142 90 L 142 150 L 158 140 Z" fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.6} />
      <circle cx={172} cy={120} r={15} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.6} />
      <Text x={158} y={196} ancora="middle" marime={12}>
        microfonul
      </Text>

      {/* firele spre osciloscop */}
      <Fir d="M 187 112 L 250 112" grosime={1.5} />
      <Fir d="M 187 130 L 214 130 L 214 168 L 250 168" grosime={1.5} />

      {/* osciloscopul */}
      <rect x={222} y={44} width={258} height={172} rx={12} fill="none" stroke={CULORI.contur} strokeWidth={1.6} />
      <Text x={232} y={62} marime={12}>
        Osciloscop
      </Text>
      <circle cx={254} cy={112} r={5} fill={CULORI.fir} />
      <Text x={254} y={104} ancora="middle" marime={12}>
        Y
      </Text>
      <circle cx={254} cy={168} r={5} fill={CULORI.fir} />
      <Fir d="M 246 178 L 262 178" grosime={2.4} />

      <Ecran x={290} y={72} div={17} nx={10} ny={7} axe={false} />
      <Text x={375} y={66} ancora="middle" marime={11}>
        calea Y
      </Text>
      <Traseu d={cale(semnal, 292, 458, 300)} grosime={1.7} />
      <Text x={466} y={126} marime={12}>
        t
      </Text>
    </Schema>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   C3 — VITEZA SUNETULUI ȘI ECOUL
   ══════════════════════════════════════════════════════════════════════════ */

/** Drumul dus-întors al undei până la obstacol și înapoi. */
export function FigEcou() {
  const hasuri = [];
  for (let i = 0; i < 9; i++) {
    hasuri.push(<line key={i} x1={392} y1={44 + i * 13} x2={406} y2={32 + i * 13} stroke={CULORI.slab} strokeWidth={1.2} />);
  }
  return (
    <Schema
      vb="0 0 460 210"
      latime={460}
      eticheta="Sursă de sunet în stânga, obstacol în dreapta; o săgeată merge spre obstacol, alta se întoarce"
      legenda="Între emisie și recepție, unda parcurge distanța de două ori: o dată dusul, o dată întorsul."
    >
      <rect x={40} y={92} width={34} height={40} rx={5} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.6} />
      <path d="M 74 100 L 96 84 L 96 140 L 74 124 Z" fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.6} />
      <Text x={57} y={158} ancora="middle" marime={12}>
        sursa
      </Text>

      <Fir d="M 390 34 L 390 168" grosime={2.2} />
      {hasuri}
      <Text x={388} y={186} ancora="end" marime={12}>
        obstacolul
      </Text>

      <Sageata x1={104} y1={70} x2={384} y2={70} culoare={TRASEU} grosime={1.6} />
      <Text x={244} y={62} ancora="middle" marime={12} culoare={TRASEU}>
        dusul
      </Text>
      <Sageata x1={384} y1={150} x2={104} y2={150} culoare={TRASEU} grosime={1.6} />
      <Text x={244} y={166} ancora="middle" marime={12} culoare={TRASEU}>
        întorsul
      </Text>

      <Sageata x1={57} y1={196} x2={390} y2={196} dubla grosime={1.2} m={4} />
      <Simbol x={223} y={192} marime={14}>
        d
      </Simbol>
    </Schema>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   C4 — ÎNĂLȚIMEA ȘI TIMBRUL
   ══════════════════════════════════════════════════════════════════════════ */

/** Un sunet jos (250 Hz) și un sunet înalt (2900 Hz), amândouă pe 10 ms. */
export function FigSunetJosInalt() {
  const X0 = 60;
  const X1 = 420;
  const panou = (titlu, frecventa, cy) => {
    const per = ((X1 - X0) * 1) / (frecventa * 0.01);
    const u = (x) => cy - 34 * Math.sin((2 * Math.PI * (x - X0)) / per);
    return (
      <g>
        <Text x={240} y={cy - 58} ancora="middle" marime={13}>
          {titlu}
        </Text>
        <Sageata x1={X0} y1={cy + 46} x2={X0} y2={cy - 48} grosime={1.5} m={4} />
        <Sageata x1={X0 - 10} y1={cy} x2={X1 + 16} y2={cy} grosime={1.5} m={4} />
        <Traseu d={cale(u, X0, X1, 900)} grosime={1.7} />
        <Text x={X0} y={cy + 62} ancora="middle" marime={12}>
          0
        </Text>
        <Text x={X1} y={cy + 62} ancora="middle" marime={12}>
          10 ms
        </Text>
        <Text x={240} y={cy + 62} ancora="middle" marime={12}>
          Timpul (ms)
        </Text>
      </g>
    );
  };
  return (
    <Schema
      vb="0 0 460 330"
      latime={460}
      eticheta="Două grafice pe același interval de 10 milisecunde: sunetul de 250 Hz face două perioade și jumătate, cel de 2900 Hz face aproape treizeci"
      legenda="Pe același interval de timp, sunetul înalt încape de mult mai multe ori decât cel jos."
    >
      {panou('Sunet jos (frecvența de 250 Hz)', 250, 84)}
      {panou('Sunet înalt (frecvența de 2900 Hz)', 2900, 244)}
    </Schema>
  );
}

/** Aceeași notă, trei instrumente: aceeași perioadă, alură diferită. */
export function FigTimbre() {
  const X0 = 58;
  const X1 = 424;
  const T = 4; /* ms — 25 ms de ecran înseamnă puțin peste 6 perioade */
  const scaraT = (X1 - X0) / 25;
  const panou = (titlu, armonice, cy) => {
    const f = formaPeriodica(armonice, T, -1, 1, 1.2);
    const u = (x) => cy - 34 * f((x - X0) / scaraT);
    const ticks = [0, 5, 10, 15, 20, 25].map((t) => (
      <g key={t}>
        <line x1={X0 + t * scaraT} y1={cy} x2={X0 + t * scaraT} y2={cy + 5} stroke={CULORI.fir} strokeWidth={1.2} />
        <Text x={X0 + t * scaraT} y={cy + 20} ancora="middle" marime={11}>
          {t}
        </Text>
      </g>
    ));
    return (
      <g>
        <Text x={X1} y={cy - 46} ancora="end" marime={13}>
          {titlu}
        </Text>
        <Sageata x1={X0} y1={cy + 44} x2={X0} y2={cy - 44} grosime={1.5} m={4} />
        <Sageata x1={X0 - 10} y1={cy} x2={X1 + 14} y2={cy} grosime={1.5} m={4} />
        <Traseu d={cale(u, X0, X1, 700)} grosime={1.7} />
        {ticks}
        <Text x={240} y={cy + 36} ancora="middle" marime={11}>
          Timpul (ms)
        </Text>
      </g>
    );
  };
  return (
    <Schema
      vb="0 0 460 430"
      latime={460}
      eticheta="Trei grafice ale tensiunii în funcție de timp, pentru flaut, pian și trompetă, cu aceeași perioadă dar cu forme diferite"
      legenda="Flautul, pianul și trompeta cântă aceeași notă: perioada e aceeași, dar alura curbei pe o perioadă e alta — asta e timbrul."
    >
      {panou('Flaut', [[1, 0], [0.14, 0.5]], 76)}
      {panou('Pian', [[0.62, 0], [0.5, 1.2], [0.34, 2.4], [0.18, 0.6]], 216)}
      {panou('Trompetă', [[1, 0], [0.52, 0], [0.35, 0], [0.26, 0], [0.2, 0], [0.16, 0], [0.13, 0]], 356)}
    </Schema>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   C5 — NIVELUL SONOR
   ══════════════════════════════════════════════════════════════════════════ */

/** Scara nivelului sonor, de la pragul de audibilitate la pragul de durere. */
export function FigScaraNivelSonor() {
  const x = (db) => 60 + db * 2.9;
  const ticks = [0, 20, 40, 60, 80, 100, 120].map((db) => (
    <g key={db}>
      <line x1={x(db)} y1={126} x2={x(db)} y2={136} stroke={CULORI.fir} strokeWidth={1.4} />
      <Text x={x(db)} y={152} ancora="middle" marime={12}>
        {db}
      </Text>
    </g>
  ));
  return (
    <Schema
      vb="0 0 480 200"
      latime={480}
      eticheta="Bandă gradată de la 0 la 120 de decibeli, cu pragul de risc marcat la 80 dB și pragul de durere la 120 dB"
      legenda="Nivelul sonor se măsoară în decibeli. Peste 80 dB, o expunere lungă pune auzul în pericol."
    >
      <defs>
        <linearGradient id="edulab-scara-sonor" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={CULORI.umplutura} />
          <stop offset="1" stopColor={TRASEU} />
        </linearGradient>
      </defs>
      <rect x={x(0)} y={96} width={x(120) - x(0)} height={30} rx={4} fill="url(#edulab-scara-sonor)" stroke={CULORI.contur} strokeWidth={1.2} />
      <path d={`M ${x(120)} 88 L ${x(120) + 44} 111 L ${x(120)} 134 Z`} fill={TRASEU} />
      {ticks}
      <Text x={x(120) + 52} y={174} ancora="end" marime={12}>
        Nivelul sonor (dB)
      </Text>

      <line x1={x(80)} y1={60} x2={x(80)} y2={96} stroke={CULORI.fir} strokeWidth={1.2} strokeDasharray="4 3" />
      <Text x={x(80)} y={52} ancora="middle" marime={12}>
        risc pentru auz
      </Text>
      <line x1={x(120)} y1={36} x2={x(120)} y2={88} stroke={CULORI.fir} strokeWidth={1.2} strokeDasharray="4 3" />
      <Text x={x(120)} y={28} ancora="middle" marime={12}>
        pragul de durere
      </Text>
      <Text x={x(0)} y={174} ancora="middle" marime={12}>
        pragul de audibilitate
      </Text>
    </Schema>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LP1 — CITIREA OSCILOGRAMELOR
   ══════════════════════════════════════════════════════════════════════════ */

/** Cele patru oscilograme comparate: aceeași bază de timp, aceeași sensibilitate. */
export function FigPatruSemnale() {
  const DIV = 20;
  const ecran = (x, y, titlu, d) => (
    <g>
      <Text x={x} y={y - 8} marime={13}>
        {titlu}
      </Text>
      <Ecran x={x} y={y} div={DIV} />
      <Traseu d={d} grosime={1.8} />
    </g>
  );

  /* 1 — sinusoidă, 5 diviziuni pe perioadă, 3 diviziuni deviație */
  const s1 = cale((x) => 120 - 3 * DIV * Math.sin((2 * Math.PI * (x - 20)) / (5 * DIV)), 21, 219, 400);

  /* 2 — impulsuri rotunjite, 2,5 diviziuni pe perioadă, 3 diviziuni deviație,
        cu minimul pe linia de zero */
  const s2 = cale(
    (x) => {
      const p = (((x - 240) % (2.5 * DIV)) + 2.5 * DIV) % (2.5 * DIV) / (2.5 * DIV);
      const v = p < 0.62 ? Math.sin((Math.PI * p) / 0.62) : 0;
      return 120 - 3 * DIV * v;
    },
    241,
    439,
    600,
  );

  /* 3 — dinți de fierăstrău, 2 diviziuni pe perioadă, 2 diviziuni deviație */
  let s3 = 'M 21 320';
  for (let k = 0; k < 5; k++) {
    const x0 = 20 + k * 2 * DIV;
    s3 += ` L ${x0} 320 L ${x0 + 2 * DIV} ${320 - 2 * DIV} L ${x0 + 2 * DIV} 320`;
  }
  s3 += ' L 219 320';

  /* 4 — impulsuri rotunjite, 1,25 diviziuni pe perioadă */
  const s4 = cale(
    (x) => {
      const p = (((x - 240) % (1.25 * DIV)) + 1.25 * DIV) % (1.25 * DIV) / (1.25 * DIV);
      return 320 - 2.5 * DIV * Math.sin(Math.PI * p);
    },
    241,
    439,
    800,
  );

  return (
    <Schema
      vb="0 0 460 420"
      latime={460}
      eticheta="Patru oscilograme: o sinusoidă, un șir de impulsuri rotunjite, un semnal în dinți de fierăstrău și un șir de impulsuri dese"
      legenda="Baza de timp, sensibilitatea și reglajul zeroului sunt aceleași pentru toate patru."
    >
      {ecran(20, 40, 'Semnalul 1', s1)}
      {ecran(240, 40, 'Semnalul 2', s2)}
      {ecran(20, 240, 'Semnalul 3', s3)}
      {ecran(240, 240, 'Semnalul 4', s4)}
    </Schema>
  );
}

/** Oscilograma oscilatorului din ceasul electronic. */
export function FigOscilatorCeas() {
  const X = 40;
  const Y = 30;
  const DIV = 32;
  const cy = Y + 4 * DIV;
  const u = (x) => cy - 2 * DIV * Math.sin((2 * Math.PI * (x - X)) / (6 * DIV));
  return (
    <Schema
      vb="0 0 400 330"
      latime={400}
      eticheta="Ecran de osciloscop cu o sinusoidă care se repetă la fiecare șase diviziuni"
      legenda="Oscilograma oscilatorului dintr-un ceas electronic."
    >
      <Ecran x={X} y={Y} div={DIV} />
      <Traseu d={cale(u, X + 1, X + 10 * DIV - 1)} />
    </Schema>
  );
}

/** Oscilograma tensiunii dreptunghiulare. */
export function FigTensiuneDreptunghiulara() {
  const X = 40;
  const Y = 30;
  const DIV = 32;
  const cy = Y + 4 * DIV;
  const sus = cy - 2.5 * DIV;
  const jos = cy + 2.5 * DIV;
  const T = 4.5 * DIV;
  let d = `M ${X + 1} ${jos}`;
  for (let k = 0; k < 3; k++) {
    const x0 = X + 14 + k * T;
    d += ` L ${x0} ${jos} L ${x0} ${sus} L ${Math.min(x0 + T / 2, X + 10 * DIV - 1)} ${sus}`;
    if (x0 + T / 2 < X + 10 * DIV - 1) d += ` L ${x0 + T / 2} ${jos}`;
  }
  d += ` L ${X + 10 * DIV - 1} ${jos}`;
  return (
    <Schema
      vb="0 0 400 330"
      latime={400}
      eticheta="Ecran de osciloscop cu o tensiune dreptunghiulară, care sare între două valori simetrice față de axa timpului"
      legenda="Osciloscopul fusese reglat dinainte astfel încât traseul să cadă pe axa de la mijlocul ecranului."
    >
      <Ecran x={X} y={Y} div={DIV} />
      <Traseu d={d} />
    </Schema>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LP2 — SUNETUL ARE NEVOIE DE MATERIE
   ══════════════════════════════════════════════════════════════════════════ */

/** Soneria sub clopotul de sticlă din care se scoate aerul. */
export function FigClopotVidat() {
  return (
    <Schema
      vb="0 0 420 280"
      latime={420}
      eticheta="O sonerie electrică așezată sub un clopot de sticlă, legat printr-un tub la o pompă de vid"
      legenda="Soneria sună mai încet pe măsură ce pompa scoate aerul, iar când clopotul e aproape gol nu se mai aude nimic."
    >
      {/* clopotul */}
      <path
        d="M 110 206 L 110 100 Q 110 58 210 58 Q 310 58 310 100 L 310 206"
        fill="none"
        stroke={CULORI.contur}
        strokeWidth={1.8}
      />
      <Text x={318} y={86} marime={12}>
        clopot
      </Text>
      <Text x={318} y={102} marime={12}>
        de sticlă
      </Text>

      {/* soneria */}
      <path d="M 178 168 A 32 34 0 0 1 242 168 Z" fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.6} />
      <Fir d="M 172 168 L 248 168" grosime={1.6} />
      <Fir d="M 210 168 L 210 182" grosime={1.4} />
      <circle cx={210} cy={186} r={4} fill={CULORI.fir} />
      <Text x={210} y={152} ancora="middle" marime={12}>
        sonerie
      </Text>

      {/* placa și legăturile */}
      <rect x={92} y={206} width={236} height={14} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.6} />
      <Fir d="M 196 190 L 196 206 M 224 190 L 224 206" grosime={1.4} />
      <Fir d="M 150 220 L 150 250 L 96 250" grosime={1.5} />
      <Text x={92} y={254} ancora="end" marime={12}>
        spre pilă
      </Text>

      {/* tubul spre pompă */}
      <Fir d="M 328 213 L 358 213" grosime={1.6} />
      <rect x={358} y={196} width={54} height={34} rx={5} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.6} />
      <Text x={385} y={216} ancora="middle" marime={11}>
        pompă
      </Text>
      <Text x={385} y={248} ancora="middle" marime={11}>
        de vid
      </Text>

      {/* sunetul care iese, tot mai slab */}
      <path d="M 96 120 A 34 34 0 0 0 96 152" fill="none" stroke={CULORI.slab} strokeWidth={1.5} />
      <path d="M 82 112 A 48 48 0 0 0 82 160" fill="none" stroke={CULORI.slab} strokeWidth={1.5} />
    </Schema>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LP3 — VITEZA SUNETULUI
   ══════════════════════════════════════════════════════════════════════════ */

/** Montajul cu două microfoane, riglă gradată și ciocan. */
export function FigMontajVitezaSunet() {
  const gradatii = [];
  for (let i = 0; i <= 28; i++) {
    const x = 168 + i * 9.5;
    gradatii.push(<line key={i} x1={x} y1={196} x2={x} y2={i % 5 === 0 ? 186 : 190} stroke={CULORI.fir} strokeWidth={1} />);
  }
  return (
    <Schema
      vb="0 0 480 250"
      latime={480}
      eticheta="Osciloscop legat la două microfoane așezate pe o riglă gradată; în dreapta, un ciocan lovește"
      legenda="Cele două microfoane primesc sunetul la momente diferite, fiindcă nu sunt la aceeași depărtare de locul loviturii."
    >
      {/* osciloscopul */}
      <rect x={26} y={56} width={140} height={140} rx={10} fill="none" stroke={CULORI.contur} strokeWidth={1.7} />
      <Ecran x={40} y={70} div={11} nx={10} ny={7} axe={false} />
      <circle cx={60} cy={178} r={4} fill={CULORI.fir} />
      <circle cx={82} cy={178} r={4} fill={CULORI.fir} />
      <Text x={96} y={44} ancora="middle" marime={12}>
        osciloscop cu memorie
      </Text>

      {/* rigla */}
      <rect x={166} y={196} width={274} height={13} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.4} />
      {gradatii}
      <Text x={303} y={226} ancora="middle" marime={12}>
        riglă gradată
      </Text>

      {/* microfoanele */}
      <circle cx={214} cy={176} r={10} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.5} />
      <Fir d="M 214 186 L 214 196" grosime={1.4} />
      <Text x={214} y={158} ancora="middle" marime={12}>
        micro 1
      </Text>
      <circle cx={306} cy={176} r={10} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.5} />
      <Fir d="M 306 186 L 306 196" grosime={1.4} />
      <Text x={306} y={158} ancora="middle" marime={12}>
        micro 2
      </Text>

      {/* firele spre osciloscop */}
      <Fir d="M 204 176 L 60 176 L 60 178" grosime={1.4} />
      <Fir d="M 296 176 L 258 176 L 258 168 L 82 168 L 82 178" grosime={1.4} />

      {/* ciocanul */}
      <Fir d="M 386 158 L 420 128" grosime={2.4} />
      <rect x={412} y={104} width={34} height={18} rx={3} transform="rotate(-40 429 113)" fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.5} />
      <Text x={412} y={176} marime={12}>
        ciocan
      </Text>
      <path d="M 372 176 A 18 18 0 0 0 372 196" fill="none" stroke={CULORI.slab} strokeWidth={1.4} />
    </Schema>
  );
}

/** Cele două trasee păstrate pe ecranul osciloscopului cu memorie. */
export function FigTraseeVitezaSunet() {
  const X = 40;
  const Y = 30;
  const DIV = 32;
  const DR = X + 10 * DIV;
  const t1 = X + 1.8 * DIV;
  const t2 = t1 + 4.5 * DIV;
  return (
    <Schema
      vb="0 0 400 330"
      latime={400}
      eticheta="Două trasee pe același ecran: fiecare stă jos și apoi urcă brusc, al doilea mai la dreapta decât primul"
      legenda="Fiecare traseu urcă în clipa în care microfonul lui primește sunetul."
    >
      <Ecran x={X} y={Y} div={DIV} />
      <Traseu d={`M ${X + 1} 170 L ${t1} 170 L ${t1} 66 L ${DR - 1} 66`} />
      <Traseu d={`M ${X + 1} 178 L ${t2} 178 L ${t2} 74 L ${DR - 1} 74`} />
    </Schema>
  );
}

/** Conducta de fontă plină cu apă, lovită la distanța d de senzor. */
export function FigConductaFonta() {
  const valuri = [];
  for (let i = 0; i < 12; i++) {
    const x = 78 + i * 26;
    valuri.push(
      <path
        key={i}
        d={`M ${x} 104 q 6 -6 12 0 q 6 6 12 0`}
        fill="none"
        stroke={CULORI.slab}
        strokeWidth={1.2}
      />,
    );
  }
  return (
    <Schema
      vb="0 0 460 190"
      latime={460}
      eticheta="Conductă orizontală de fontă plină cu apă; în stânga un ciocan lovește conducta, în dreapta un senzor de presiune"
      legenda="Lovitura pleacă spre senzor pe două drumuri deodată: prin fontă și prin apă."
    >
      <rect x={50} y={80} width={356} height={44} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.7} />
      <Fir d="M 50 90 L 406 90 M 50 114 L 406 114" grosime={1.2} culoare={CULORI.slab} />
      {valuri}
      <Text x={62} y={72} marime={12}>
        fontă
      </Text>
      <Text x={200} y={144} ancora="middle" marime={12}>
        apă
      </Text>

      <Fir d="M 76 46 L 100 62" grosime={2.2} />
      <rect x={62} y={30} width={26} height={14} rx={3} transform="rotate(-30 75 37)" fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.4} />
      <Sageata x1={104} y1={64} x2={112} y2={76} grosime={1.4} m={3.6} />
      <Text x={54} y={24} marime={12}>
        lovitura de ciocan
      </Text>

      <rect x={382} y={54} width={44} height={24} rx={4} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.5} />
      <Fir d="M 404 78 L 404 88" grosime={1.4} />
      <Text x={404} y={46} ancora="middle" marime={11}>
        senzor
      </Text>

      <Sageata x1={112} y1={164} x2={404} y2={164} dubla grosime={1.2} m={4} />
      <Simbol x={258} y={160} marime={14}>
        d
      </Simbol>
    </Schema>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LP4 — ÎNĂLȚIME, TIMBRU, ÎNREGISTRĂRI
   ══════════════════════════════════════════════════════════════════════════ */

/** Discul sirenei, cu 20 de găuri și jetul de aer. */
export function FigSirena() {
  const gauri = [];
  for (let k = 0; k < 20; k++) {
    const a = (2 * Math.PI * k) / 20 - Math.PI / 2;
    gauri.push(<circle key={k} cx={160 + 78 * Math.cos(a)} cy={158 + 78 * Math.sin(a)} r={7.5} fill="#ffffff" stroke={CULORI.contur} strokeWidth={1.1} />);
  }
  return (
    <Schema
      vb="0 0 380 300"
      latime={380}
      eticheta="Disc care se rotește, cu douăzeci de găuri așezate la fel de des pe margine, și un jet de aer îndreptat spre ele"
      legenda="La fiecare rotație a discului, jetul de aer trece prin 20 de găuri: aerul e întrerupt de 20 de ori."
    >
      <circle cx={160} cy={158} r={96} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={1.6} />
      {gauri}

      <path d="M 92 66 A 96 96 0 0 1 234 74" fill="none" stroke={CULORI.fir} strokeWidth={1.6} />
      <path d={varf(234, 74, 0.72, 0.69, 5)} fill={CULORI.fir} />

      <Fir d="M 300 96 L 268 118" grosime={2} />
      <Sageata x1={266} y1={120} x2={246} y2={134} culoare={TRASEU} grosime={1.6} m={4} />
      <Text x={306} y={92} marime={12}>
        jet de aer
      </Text>

      <Fir d="M 160 258 L 160 278 L 196 278" grosime={1.2} culoare={CULORI.slab} />
      <Text x={202} y={282} marime={12}>
        20 de găuri
      </Text>
    </Schema>
  );
}

/**
 * Înregistrarea numerică a unui sunet: U_AM în milivolți, timpul în milisecunde.
 *
 * `perioada`, `tReper` și domeniul de valori sunt cele din manual, fiindcă pe
 * ele se sprijină întrebările.
 */
function FigInregistrare({ armonice, perioada, tReper, tip, vMin, vMax, titlu, eticheta }) {
  const X0 = 74;
  const X1 = 434;
  const Y0 = 40;
  const Y1 = 210;
  const scaraT = (X1 - X0) / 9;
  const y = (v) => Y0 + ((75 - v) * (Y1 - Y0)) / 160;
  const f = formaPeriodica(armonice, perioada, vMin, vMax, tReper, tip);
  const u = (x) => y(f((x - X0) / scaraT));
  const marci = [60, 40, 20, 0, -20, -40, -60, -80];
  return (
    <Schema vb="0 0 460 260" latime={460} eticheta={eticheta} legenda={titlu}>
      <Grila x={X0} y={Y0} w={X1 - X0} h={Y1 - Y0} nx={9} ny={8} />
      {marci.map((v) => (
        <Text key={v} x={X0 - 8} y={y(v) + 4} ancora="end" marime={11}>
          {v === 0 ? '0' : String(v).replace('-', '−')}
        </Text>
      ))}
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((t) => (
        <Text key={t} x={X0 + t * scaraT} y={Y1 + 20} ancora="middle" marime={11}>
          {t}
        </Text>
      ))}
      <Sageata x1={X0} y1={Y1 + 6} x2={X0} y2={Y0 - 14} grosime={1.6} m={4} />
      <Sageata x1={X0 - 10} y1={y(0)} x2={X1 + 16} y2={y(0)} grosime={2} m={4.5} />
      <Simbol x={X0 + 4} y={Y0 - 20} ancora="start" marime={13} dupa={" (mV)"}>
        U
      </Simbol>
      <Simbol x={X1 + 22} y={Y1 + 20} ancora="start" marime={13} dupa={" (ms)"}>
        t
      </Simbol>
      <Traseu d={cale(u, X0 + 1, X1 - 1, 700)} grosime={1.8} />
    </Schema>
  );
}

/** Documentul 1: un sunet al chitarei. */
export function FigInregistrareChitara() {
  return (
    <FigInregistrare
      armonice={[[0.55, 0.4], [0.8, 1.1], [0.45, 2.2], [0.3, 0.7], [0.18, 2.9]]}
      perioada={5}
      tReper={4}
      tip="max"
      vMin={-85}
      vMax={70}
      titlu="Documentul 1 — înregistrarea numerică a unui sunet al chitarei."
      eticheta="Grafic al tensiunii în funcție de timp, cu un tipar care se repetă la fiecare cinci milisecunde; vârful cel mai înalt cade la 4 ms și se repetă la 9 ms"
    />
  );
}

/** Documentul 2: un sunet al basului. */
export function FigInregistrareBas() {
  return (
    <FigInregistrare
      armonice={[[0.7, 0], [0.45, 2.6], [0.5, 0.9], [0.22, 1.8], [0.26, 3.6], [0.14, 0.3]]}
      perioada={5}
      tReper={0.5}
      tip="max"
      vMin={-85}
      vMax={70}
      titlu="Documentul 2 — înregistrarea numerică a unui sunet al basului."
      eticheta="Grafic al tensiunii în funcție de timp, cu același interval de repetare de cinci milisecunde, dar cu altă formă a curbei"
    />
  );
}

/** Documentul 3: un sunet al viorii. */
export function FigInregistrareVioara() {
  return (
    <FigInregistrare
      armonice={[[0.8, 1.4], [0.5, 0.2], [0.36, 2.1], [0.2, 1.0]]}
      perioada={2.4}
      tReper={2.3}
      tip="min"
      vMin={-85}
      vMax={45}
      titlu="Documentul 3 — înregistrarea numerică a unui sunet al viorii."
      eticheta="Grafic al tensiunii în funcție de timp, cu un tipar care se repetă mult mai des decât la chitară"
    />
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LP5 — NIVELUL SONOR
   ══════════════════════════════════════════════════════════════════════════ */

/** Semnalul sonor produs de o coardă de chitară ciupită. */
export function FigSemnalChitara() {
  const X0 = 76;
  const X1 = 430;
  const Y0 = 46;
  const Y1 = 216;
  const scaraT = (X1 - X0) / 0.2;
  const y = (v) => Y0 + ((1.55 - v) * (Y1 - Y0)) / 2.85;
  const f = formaPeriodica([[0.35, 0], [1, 0]], 0.02, -1.2, 1.35, 0.0015, 'max');
  const u = (x) => y(f((x - X0) / scaraT));
  const marci = [1.5, 1.0, 0.5, 0.0, -0.5, -1.0];
  const eticheteT = [0, 0.025, 0.05, 0.075, 0.1, 0.125, 0.15, 0.175, 0.2];
  return (
    <Schema
      vb="0 0 470 270"
      latime={470}
      eticheta="Grafic al amplitudinii semnalului în funcție de timp, între 0 și 0,200 secunde; tiparul se repetă de zece ori"
      legenda="Semnalul sonor produs de coarda ciupită a unei chitare."
    >
      {marci.map((v) => (
        <g key={v}>
          <line x1={X0 - 5} y1={y(v)} x2={X0} y2={y(v)} stroke={CULORI.fir} strokeWidth={1.2} />
          <Text x={X0 - 10} y={y(v) + 4} ancora="end" marime={11}>
            {v.toFixed(1).replace('.', ',').replace('-', '−')}
          </Text>
        </g>
      ))}
      {eticheteT.map((t) => (
        <g key={t}>
          <line x1={X0 + t * scaraT} y1={Y1} x2={X0 + t * scaraT} y2={Y1 + 5} stroke={CULORI.fir} strokeWidth={1.2} />
          <Text x={X0 + t * scaraT} y={Y1 + 20} ancora="middle" marime={10}>
            {t.toFixed(3).replace('.', ',')}
          </Text>
        </g>
      ))}
      <Sageata x1={X0} y1={Y1 + 8} x2={X0} y2={Y0 - 14} grosime={1.6} m={4} />
      <Sageata x1={X0 - 10} y1={y(0)} x2={X1 + 14} y2={y(0)} grosime={1.6} m={4} />
      <Text x={X0 + 6} y={Y0 - 22} marime={12}>
        Amplitudinea semnalului
      </Text>
      <Text x={X1 + 20} y={Y1 + 40} ancora="end" marime={12}>
        Timpul (s)
      </Text>
      <Traseu d={cale(u, X0 + 1, X1 - 1, 900)} grosime={1.6} />
    </Schema>
  );
}
