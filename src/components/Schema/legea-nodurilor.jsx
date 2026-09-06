import React from 'react';
import { Schema, Fir, Nod, Rezistor, Bec, Pila, Text, Sarcina, CULORI } from './index';

/**
 * CELE DOUĂ FIGURI ALE LUCRĂRII PRACTICE „NODURI ȘI RAMURI” CARE NU EXISTĂ ÎN MANUAL.
 *
 * Restul figurilor capitolului au trecut de la desen la DECUPAJ din manualul-sursă
 * (Frédéric Masset, „Interros des lycées — Physique-Chimie 2de”, Nathan, 2023,
 * capitolul 1), cu etichetele românești puse peste — vezi `FiguraManual.jsx`.
 * Autorul a cerut fidelitate: „graficele trebuie făcute întocmai cu ce e în
 * carte; dacă nu, poți cropa imaginea direct”.
 *
 * Cele două de aici NU au ce decupa: sunt construite pentru probele lucrării
 * practice, care nu există ca atare în manual. Circuitul cu punctele A–F e o
 * schemă nouă, iar cele două conductoare cu purtători sunt aici împărțite pe
 * „a” și „b”, cu alt conținut decât figura de curs a manualului (acolo nu sunt
 * nici literele, nici ordinea asta). De aceea rămân desenate.
 */

/**
 * Circuitul pe care se numără nodurile și ramurile (LP1).
 *
 * Topologia e cea a circuitelor din manual: o pilă, o ramură de sus, una de
 * jos și trei ramuri verticale. Punctele sunt însemnate cu litere de la A la F,
 * dintre care numai patru sunt noduri — C și F sunt simple colțuri de fir, din
 * care pleacă doar două conductoare.
 */
export function FigNoduriRamuriLP() {
  const SUS = 44, JOS = 168, ST = 46;
  const A = 152, B = 250, DR = 340;
  return (
    <Schema
      vb="0 0 386 208"
      latime={420}
      eticheta="Circuit cu o pilă și trei ramuri verticale; punctele sunt însemnate cu literele A până la F"
      legenda="Punctele A, B, C, D, E și F ale circuitului."
    >
      <Fir d={`M ${ST} ${SUS} L ${DR} ${SUS}`} />
      <Fir d={`M ${ST} ${JOS} L ${DR} ${JOS}`} />
      <Fir d={`M ${ST} ${SUS} L ${ST} 98`} />
      <Fir d={`M ${ST} 114 L ${ST} ${JOS}`} />
      <Pila x={ST} y={106} vertical />

      <Fir d={`M ${A} ${SUS} L ${A} ${JOS}`} />
      <Fir d={`M ${B} ${SUS} L ${B} ${JOS}`} />
      <Fir d={`M ${DR} ${SUS} L ${DR} ${JOS}`} />

      <Bec x={A} y={106} r={15} />
      <Rezistor x={B} y={106} vertical />
      <Rezistor x={DR} y={106} vertical />

      <Nod x={A} y={SUS} />
      <Nod x={B} y={SUS} />
      <Nod x={A} y={JOS} />
      <Nod x={B} y={JOS} />

      <Text x={A} y={SUS - 10} ancora="middle" marime={12}>A</Text>
      <Text x={B} y={SUS - 10} ancora="middle" marime={12}>B</Text>
      <Text x={DR} y={SUS - 10} ancora="middle" marime={12}>C</Text>
      <Text x={A} y={JOS + 20} ancora="middle" marime={12}>D</Text>
      <Text x={B} y={JOS + 20} ancora="middle" marime={12}>E</Text>
      <Text x={DR} y={JOS + 20} ancora="middle" marime={12}>F</Text>
    </Schema>
  );
}

/**
 * Cele două conductoare din proba despre sensul curentului (LP1).
 *
 * În primul se mișcă numai electroni, toți spre dreapta; în al doilea se mișcă
 * ioni pozitivi spre dreapta și ioni negativi spre stânga. Elevul trebuie să
 * spună în ce sens circulă curentul în fiecare. Figura NU arată răspunsul —
 * de aceea nu are, ca cea din curs, săgeata „sensul curentului” dedesubt.
 */
export function FigPurtatoriLP() {
  const sageata = (x, y, spre) => (
    <path
      d={spre === 'dreapta' ? `M ${x} ${y} L ${x + 13} ${y}` : `M ${x} ${y} L ${x - 13} ${y}`}
      stroke={CULORI.contur}
      strokeWidth={1.1}
      markerEnd="url(#varf-lp)"
    />
  );
  return (
    <Schema
      vb="0 0 340 168"
      latime={400}
      eticheta="Două conductoare: în primul se mișcă numai electroni, în al doilea ioni pozitivi și ioni negativi"
      legenda="a — un fir de cupru; b — o soluție care conține ioni. Săgețile arată mișcarea purtătorilor de sarcină."
    >
      <defs>
        <marker id="varf-lp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={CULORI.contur} />
        </marker>
      </defs>

      <rect x={14} y={18} width={150} height={112} fill="none" stroke={CULORI.slab} strokeWidth={1.2} />
      <rect x={176} y={18} width={150} height={112} fill="none" stroke={CULORI.slab} strokeWidth={1.2} />
      <Text x={22} y={150} marime={12} culoare={CULORI.slab}>a</Text>
      <Text x={184} y={150} marime={12} culoare={CULORI.slab}>b</Text>

      {/* a — numai electroni, toți spre dreapta */}
      {[[42, 42], [104, 40], [58, 76], [122, 78], [40, 110], [100, 112]].map(([x, y], i) => (
        <g key={`a${i}`}>
          <Sarcina x={x} y={y} semn="−" />
          {sageata(x + 10, y + 11, 'dreapta')}
        </g>
      ))}

      {/* b — ioni pozitivi spre dreapta, ioni negativi spre stânga */}
      {[[204, 42, '+'], [266, 40, '−'], [220, 76, '+'], [284, 78, '−'], [202, 110, '−'], [262, 112, '+']].map(([x, y, s], i) => (
        <g key={`b${i}`}>
          <Sarcina x={x} y={y} semn={s} />
          {sageata(x + 10, y + 11, s === '+' ? 'dreapta' : 'stanga')}
        </g>
      ))}
    </Schema>
  );
}
