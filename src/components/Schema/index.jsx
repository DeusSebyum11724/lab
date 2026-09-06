import React from 'react';
import styles from './styles.module.css';

/**
 * SIMBOLURILE DE CIRCUIT, DESENATE ÎN COD.
 *
 * Manualul-sursă e un PDF SCANAT: fiecare pagină e o singură imagine de
 * 1134×1658 la ~174 dpi, fără strat de text și fără obiecte grafice separate.
 * O figură nu se poate deci „extrage” — s-ar putea doar decupa din pagină, iar
 * un decupaj de 174 dpi arată prost pe un ecran retina, nu se poate colora
 * după paleta platformei și nu se poate citi de un cititor de ecran.
 *
 * De aceea schemele de circuit se REFAC ÎN COD. Ce rămâne de decupat sunt doar
 * fotografiile și desenele care nu-s scheme.
 *
 * Simbolurile respectă convenția IEC, aceeași în școala franceză și în cea
 * românească: rezistorul e dreptunghi (nu zigzag, care e convenția americană),
 * becul e cerc cu cruce, pila e o bară lungă și una scurtă, ampermetrul e cerc
 * cu litera A.
 *
 * SISTEMUL DE COORDONATE. Fiecare figură își alege `viewBox`-ul ei, în unități
 * care sunt aproximativ pixeli la mărimea de referință. Simbolurile se așază
 * după CENTRUL lor, nu după colț: `<Rezistor x={100} y={60} />` pune mijlocul
 * dreptunghiului exact în (100, 60), ca firele să intre în el fără calcule.
 */

/* Culorile figurilor. Nu sunt alese aici de la zero: firele și textul iau
   cerneala platformei, iar umplutura componentelor păstrează piersica
   manualului, mutată în familia caldă a paginii. Verdele și roșul apar doar
   unde manualul le folosește ca să deosebească curenții care intră într-un nod
   de cei care ies — acolo culoarea PURTĂ INFORMAȚIE, deci nu se schimbă. */
export const CULORI = {
  fir: 'var(--kl-ink)',
  text: 'var(--kl-ink)',
  umplutura: '#f6d9c6',
  contur: 'var(--kl-ink)',
  intra: '#1c7c4a',
  iese: '#c0392b',
  slab: 'var(--kl-ink3)',
};

const GROSIME = 1.6;

/** Cadrul figurii: `viewBox` + legendă opțională dedesubt. */
export function Schema({ vb, latime = 460, legenda, eticheta, children }) {
  return (
    <figure className={styles.figura}>
      <svg
        viewBox={vb}
        className={styles.desen}
        style={{ maxWidth: latime }}
        role="img"
        aria-label={eticheta || legenda || 'schemă de circuit'}
        xmlns="http://www.w3.org/2000/svg"
      >
        {children}
      </svg>
      {legenda && <figcaption className={styles.legenda}>{legenda}</figcaption>}
    </figure>
  );
}

/** Fir de legătură. `d` e un `path` obișnuit; colțurile se scriu cu L. */
export function Fir({ d, culoare = CULORI.fir, grosime = GROSIME, punctat }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={culoare}
      strokeWidth={grosime}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={punctat ? '5 4' : undefined}
    />
  );
}

/**
 * Nodul: punctul plin din care pleacă cel puțin trei conductoare.
 *
 * E desenat plin, nu gol, fiindcă în manual asta deosebește un nod adevărat de
 * o simplă încrucișare de fire — iar deosebirea aia e chiar obiectul lecției.
 */
export function Nod({ x, y, r = 3.4, culoare = CULORI.fir }) {
  return <circle cx={x} cy={y} r={r} fill={culoare} />;
}

/** Rezistorul: dreptunghi. Orizontal implicit; `vertical` îl întoarce. */
export function Rezistor({ x, y, vertical, lung = 46, lat = 20 }) {
  const w = vertical ? lat : lung;
  const h = vertical ? lung : lat;
  return (
    <rect
      x={x - w / 2}
      y={y - h / 2}
      width={w}
      height={h}
      fill={CULORI.umplutura}
      stroke={CULORI.contur}
      strokeWidth={GROSIME}
    />
  );
}

/** Becul: cerc cu cruce înscrisă. */
export function Bec({ x, y, r = 15 }) {
  const d = r * 0.707;
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={GROSIME} />
      <path
        d={`M ${x - d} ${y - d} L ${x + d} ${y + d} M ${x + d} ${y - d} L ${x - d} ${y + d}`}
        stroke={CULORI.contur}
        strokeWidth={GROSIME}
        fill="none"
      />
    </g>
  );
}

/**
 * Pila: bară lungă (+) și bară scurtă (−).
 *
 * Semnele se pun doar când figura are nevoie de ele. Manualul le arată în
 * lista de simboluri a exercițiului cu lanterna, dar le lasă deoparte în
 * schemele de circuit, unde nu ajută la nimic.
 */
export function Pila({ x, y, vertical, semne }) {
  const L = 22;
  const S = 11;
  const dist = 7;
  if (vertical) {
    return (
      <g>
        <path d={`M ${x - L / 2} ${y - dist / 2} L ${x + L / 2} ${y - dist / 2}`} stroke={CULORI.contur} strokeWidth={2.4} />
        <path d={`M ${x - S / 2} ${y + dist / 2} L ${x + S / 2} ${y + dist / 2}`} stroke={CULORI.contur} strokeWidth={2.4} />
        {semne && (
          <>
            <Text x={x + L / 2 + 9} y={y - dist / 2 + 4}>+</Text>
            <Text x={x + L / 2 + 9} y={y + dist / 2 + 5}>−</Text>
          </>
        )}
      </g>
    );
  }
  const d2 = semne ? 12 : dist;
  return (
    <g>
      <path d={`M ${x - d2 / 2} ${y - L / 2} L ${x - d2 / 2} ${y + L / 2}`} stroke={CULORI.contur} strokeWidth={2.4} />
      <path d={`M ${x + d2 / 2} ${y - S / 2} L ${x + d2 / 2} ${y + S / 2}`} stroke={CULORI.contur} strokeWidth={2.4} />
      {semne && (
        <>
          <Text x={x - d2 / 2} y={y - L / 2 - 8} ancora="middle" marime={15}>+</Text>
          <Text x={x + d2 / 2} y={y - L / 2 - 8} ancora="middle" marime={15}>−</Text>
        </>
      )}
    </g>
  );
}

/**
 * Ampermetrul: cerc cu litera A, plus etichetele bornelor.
 *
 * Bornele NU sunt decor. Lecția spune că borna COM se leagă spre polul negativ
 * al generatorului, iar borna A spre cel pozitiv, iar unul dintre exercițiile
 * de la sfârșit se rezolvă tocmai uitându-te de care parte e fiecare. `borne`
 * ia 'A-COM' (A în stânga) sau 'COM-A'; lipsa lui le ascunde.
 */
export function Ampermetru({ x, y, r = 15, borne, jos }) {
  const et = borne ? borne.split('-') : null;
  const yEt = jos ? y + r + 12 : y - r - 6;
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={CULORI.umplutura} stroke={CULORI.contur} strokeWidth={GROSIME} />
      <Text x={x} y={y + 5.5} ancora="middle" marime={15}>A</Text>
      {et && (
        <>
          <Text x={x - r - 4} y={yEt} ancora="end" marime={11}>{et[0]}</Text>
          <Text x={x + r + 4} y={yEt} ancora="start" marime={11}>{et[1]}</Text>
        </>
      )}
    </g>
  );
}

/** Dioda: triunghi plin plus bara care îl închide. */
export function Dioda({ x, y, spre = 'dreapta' }) {
  const s = spre === 'dreapta' ? 1 : -1;
  return (
    <g>
      <path
        d={`M ${x - 10 * s} ${y - 11} L ${x + 8 * s} ${y} L ${x - 10 * s} ${y + 11} Z`}
        fill="none"
        stroke={CULORI.contur}
        strokeWidth={GROSIME}
      />
      <path d={`M ${x + 8 * s} ${y - 11} L ${x + 8 * s} ${y + 11}`} stroke={CULORI.contur} strokeWidth={GROSIME} />
    </g>
  );
}

/** Întrerupătorul. Deschis implicit — așa apare în întrebarea despre curent nul. */
export function Intrerupator({ x, y, inchis }) {
  return (
    <g>
      <circle cx={x - 13} cy={y} r={2.6} fill={CULORI.contur} />
      <circle cx={x + 13} cy={y} r={2.6} fill={CULORI.contur} />
      <path
        d={inchis ? `M ${x - 13} ${y} L ${x + 13} ${y}` : `M ${x - 13} ${y} L ${x + 12} ${y - 12}`}
        stroke={CULORI.contur}
        strokeWidth={GROSIME}
        strokeLinecap="round"
      />
    </g>
  );
}

/**
 * Săgeata de curent, cu eticheta ei.
 *
 * În manual, sensul curentului se arată desenând o săgeată PE ramură, iar
 * simbolul intensității stă lângă ea. Unghiul se dă în grade: 0 = spre dreapta,
 * 90 = în jos, 180 = spre stânga, −90 = în sus.
 */
export function Curent({ x, y, unghi = 0, eticheta, lungime = 20, culoare = CULORI.fir, decalaj = [0, 0] }) {
  const rad = (unghi * Math.PI) / 180;
  const dx = Math.cos(rad) * lungime;
  const dy = Math.sin(rad) * lungime;
  const id = `v-${Math.round(x)}-${Math.round(y)}-${Math.round(unghi)}-${culoare.replace(/[^a-z0-9]/gi, '')}`;
  return (
    <g>
      <defs>
        <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={culoare} />
        </marker>
      </defs>
      <path
        d={`M ${x - dx / 2} ${y - dy / 2} L ${x + dx / 2} ${y + dy / 2}`}
        stroke={culoare}
        strokeWidth={GROSIME}
        markerEnd={`url(#${id})`}
        fill="none"
      />
      {eticheta && (
        <Simbol x={x + decalaj[0]} y={y + decalaj[1]} culoare={culoare}>
          {eticheta}
        </Simbol>
      )}
    </g>
  );
}

/** Text drept, pentru cuvinte și etichete de borne. */
export function Text({ x, y, children, ancora = 'start', marime = 13, culoare = CULORI.text }) {
  return (
    <text x={x} y={y} textAnchor={ancora} fontSize={marime} fill={culoare} fontFamily="Inter, system-ui, sans-serif">
      {children}
    </text>
  );
}

/**
 * Simbol de mărime fizică: cursiv cu serife, ca în formule.
 *
 * `I_2` se scrie `<Simbol>I<tsub>2</tsub></Simbol>` — dar fiindcă asta e
 * greoi de scris de zeci de ori, componenta acceptă și scrierea scurtă
 * „I_2” ca text, pe care o desface singură în indice.
 */
export function Simbol({ x, y, children, dupa, ancora = 'middle', marime = 14, culoare = CULORI.text }) {
  const brut = typeof children === 'string' ? children : null;
  let continut = children;
  if (brut && brut.includes('_')) {
    const [baza, ...rest] = brut.split('_');
    continut = (
      <>
        {baza}
        <tspan fontSize={marime * 0.72} dy={marime * 0.22}>
          {rest.join('_')}
        </tspan>
      </>
    );
  }
  return (
    <text
      x={x}
      y={y}
      textAnchor={ancora}
      fontSize={marime}
      fill={culoare}
      fontFamily="'Times New Roman', Times, serif"
      fontStyle="italic"
    >
      {continut}
      {dupa && (
        <tspan fontStyle="normal" fontFamily="Inter, system-ui, sans-serif" fontSize={marime * 0.92}>
          {dupa}
        </tspan>
      )}
    </text>
  );
}

/** Purtător de sarcină: cerc mic cu + sau −, pentru figura cu sensul curentului. */
export function Sarcina({ x, y, semn = '+' }) {
  return (
    <g>
      <circle cx={x} cy={y} r={7} fill="none" stroke={CULORI.contur} strokeWidth={1.3} />
      <Text x={x} y={y + 4} ancora="middle" marime={11}>
        {semn === '+' ? '+' : '−'}
      </Text>
    </g>
  );
}
