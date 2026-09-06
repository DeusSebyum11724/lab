import React from 'react';
import {
  Schema,
  Fir,
  Rezistor,
  Bec,
  Pila,
  Text,
  Simbol,
  CULORI,
} from './index';

/**
 * FIGURA CARE A RĂMAS DESENATĂ DIN LECȚIILE DESPRE TENSIUNE ȘI LEGEA OCHIURILOR.
 *
 * Restul figurilor capitolului sunt acum DECUPAJE din manual (vezi
 * `FiguraManual` și `static/img/manual/c02-*.png`): geometria manualului se
 * păstrează astfel pixel cu pixel, iar etichetele figurilor sunt oricum numai
 * simboluri (u₁, U_AB, A, B, V, COM), deci nu era nimic de tradus peste ele.
 *
 * Circuitul serie de mai jos NU există în manual: e construit pentru proba de
 * laborator din LP5, unde elevul măsoară pe rând U₁, U₂, U₃ și U. N-are ce
 * decupa, deci rămâne desenat.
 */

const GROSIME = 1.6;

/**
 * Săgeata de tensiune, cu eticheta ei.
 *
 * Se dă de la coadă `(x1, y1)` la vârf `(x2, y2)`: prima literă a tensiunii
 * stă la VÂRF. `decalaj` mută eticheta față de mijlocul săgeții.
 */
function Tensiune({ x1, y1, x2, y2, eticheta, culoare = CULORI.fir, decalaj = [0, -8], marime = 14 }) {
  const id = `ten-${Math.round(x1)}-${Math.round(y1)}-${Math.round(x2)}-${Math.round(y2)}-${culoare.replace(/[^a-z0-9]/gi, '')}`;
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
        strokeWidth={GROSIME}
        markerEnd={`url(#${id})`}
        fill="none"
      />
      {eticheta && (
        <Simbol
          x={(x1 + x2) / 2 + decalaj[0]}
          y={(y1 + y2) / 2 + decalaj[1]}
          culoare={culoare}
          marime={marime}
        >
          {eticheta}
        </Simbol>
      )}
    </g>
  );
}

/** Circuitul serie al lucrării practice: pilă, bec și două rezistoare. */
export function FigSerieTreiConsumatoare() {
  const SUS = 80, JOS = 205, ST = 55, DR = 380;
  return (
    <Schema
      vb="0 0 420 240"
      latime={420}
      eticheta="Circuit serie: o pilă și trei consumatoare între punctele A, B, C și D"
      legenda="Circuit serie cu trei consumatoare. Se măsoară pe rând U₁, U₂, U₃ și U."
    >
      <Fir d={`M ${ST} ${SUS} L ${DR} ${SUS}`} />
      <Fir d={`M ${ST} ${JOS} L ${DR} ${JOS}`} />
      <Fir d={`M ${ST} ${SUS} L ${ST} ${JOS}`} />
      <Fir d={`M ${DR} ${SUS} L ${DR} ${JOS}`} />

      <Pila x={ST} y={142} vertical />
      <Bec x={140} y={SUS} />
      <Rezistor x={240} y={SUS} />
      <Rezistor x={330} y={SUS} />

      <Text x={95} y={SUS - 16} ancora="middle">A</Text>
      <Text x={190} y={SUS - 16} ancora="middle">B</Text>
      <Text x={290} y={SUS - 16} ancora="middle">C</Text>
      <Text x={DR + 10} y={SUS - 16} ancora="start">D</Text>

      <Tensiune x1={190} y1={42} x2={95} y2={42} eticheta="U_1" decalaj={[0, -8]} />
      <Tensiune x1={290} y1={42} x2={190} y2={42} eticheta="U_2" decalaj={[0, -8]} />
      <Tensiune x1={378} y1={42} x2={290} y2={42} eticheta="U_3" decalaj={[0, -8]} />
      <Tensiune x1={26} y1={186} x2={26} y2={98} eticheta="U" decalaj={[-13, 4]} />
    </Schema>
  );
}
