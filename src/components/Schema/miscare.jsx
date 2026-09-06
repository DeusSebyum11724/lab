import React from 'react';
import { Schema, Simbol } from './index';

/**
 * FIGURA DESENATĂ A CAPITOLULUI „DESCRIEREA MIȘCĂRII”.
 *
 * Restul figurilor capitolului sunt acum DECUPAJE din manualul scanat, cu
 * etichetele românești puse peste (vezi `FiguraManual`). Aici a rămas singura
 * figură care nu se putea decupa: manualul spune în text „Considérons un corps
 * animé d'un mouvement de translation rectiligne. Entre deux instants t1 et t2
 * il a parcouru une distance d”, dar nu însoțește fraza cu niciun desen. Figura
 * de mai jos e deci construită de noi pentru lecție, nu preluată din carte —
 * n-are ce decupa.
 */

const CONTUR = 'var(--kl-ink)';
const SLAB = 'var(--kl-ink3)';
const UMPLUT = '#f6d9c6';
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

