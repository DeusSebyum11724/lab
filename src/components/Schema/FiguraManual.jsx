import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './figuraManual.module.css';

/**
 * O FIGURĂ DECUPATĂ DIN MANUAL, CU ETICHETELE TRADUSE PESTE EA.
 *
 * ══ DE CE DECUPAJ, NU DESEN ═══════════════════════════════════════════════
 *
 * Figurile au fost întâi redesenate în SVG. Redesenarea păstrează topologia,
 * valorile și sensul săgeților, dar NU unghiurile, proporțiile și așezarea
 * exactă. Autorul a cerut altceva: „graficele trebuie făcute întocmai cu ce e
 * în carte; dacă nu, poți cropa imaginea direct". Decupajul e singurul care
 * garantează „întocmai” — geometria rămâne pixel cu pixel cea din manual.
 *
 * ══ DE CE NU SE SCRIE PESTE, ÎN IMAGINE ═══════════════════════════════════
 *
 * Cuvintele din figuri sunt franțuzești: „Rayon incident”, „Milieu 1”,
 * „dioptre”. Într-o lecție românească n-au ce căuta. S-ar fi putut acoperi
 * direct în PNG, cu vopsea și text desenat — dar atunci textul ar fi devenit
 * pixeli: neclar la zoom, imposibil de selectat, invizibil pentru un cititor de
 * ecran, și legat pe veci de o singură mărime.
 *
 * Aici eticheta stă DEASUPRA imaginii, ca text adevărat, poziționată în
 * procente din lățimea figurii. Deci se scalează odată cu ea, rămâne clară la
 * orice zoom, se poate selecta și se poate citi cu voce. Sub ea, o pată de
 * fundal acoperă cuvântul francez.
 *
 * ══ REZOLUȚIA ═════════════════════════════════════════════════════════════
 *
 * Scanul manualului e la 174 dpi și nu se câștigă nimic randându-l mai sus —
 * s-ar interpola. De aceea figura se afișează la JUMĂTATE din lățimea ei în
 * pixeli: fiecare pixel CSS primește doi pixeli de imagine, deci figura e
 * clară și pe un ecran retina. `latime` acceptă și o valoare proprie, când
 * figura are nevoie de mai mult sau de mai puțin loc.
 */
export function FiguraManual({ src, lat, inalt, latime, legenda, eticheta, children }) {
  const url = useBaseUrl(`/img/manual/${src}`);
  const afisata = latime || Math.round(lat / 2);
  return (
    <figure className={styles.figura}>
      <div className={styles.cadru} style={{ width: afisata, maxWidth: '100%' }}>
        <div className={styles.strat} style={{ aspectRatio: `${lat} / ${inalt}` }}>
          <img src={url} alt={eticheta || legenda || ''} className={styles.imagine} loading="lazy" />
          {React.Children.map(children, (c) =>
            React.isValidElement(c) ? React.cloneElement(c, { _lat: lat, _inalt: inalt }) : c
          )}
        </div>
      </div>
      {legenda && <figcaption className={styles.legenda}>{legenda}</figcaption>}
    </figure>
  );
}

/**
 * O etichetă românească pusă peste cuvântul francez pe care îl înlocuiește.
 *
 * `x`, `y`, `w`, `h` sunt coordonatele cuvântului ORIGINAL, în pixelii
 * decupajului — exact ce raportează detectorul de cuvinte. Componenta le
 * transformă singură în procente, deci figura se poate afișa la orice mărime.
 *
 * `corp` e înălțimea literei mici din original; din ea iese mărimea textului
 * românesc, ca să nu iasă mai mare sau mai mic decât restul figurii.
 *
 * `culoare` e culoarea cuvântului din manual. NU e decor: „Rayon incident” e
 * roșu, „Rayon réfléchi” e verde, „Rayon réfracté” e albastru, iar culorile
 * astea leagă eticheta de raza ei. Se păstrează.
 *
 * `fond` e culoarea petei care acoperă cuvântul francez — alb, în afară de
 * figurile așezate pe hârtia colorată a manualului.
 *
 * `alinia` spune de unde se măsoară: 'stanga' (implicit), 'centru' sau
 * 'dreapta'. Un cuvânt românesc mai lung decât cel francez crește într-acolo.
 *
 * `raza` rotunjește colțurile petei. E nevoie de ea la figurile în care cuvântul
 * stă într-o casetă colorată și o umple: acolo pata nu poate fi mai mică decât
 * caseta, așa că acoperă caseta toată și trebuie să-i ia și forma. Caseta iese
 * plată în loc de umbrită, dar restul figurii rămâne neatins.
 */
export function Et({
  x, y, w, h, corp, culoare = '#1c1a16', fond = '#ffffff',
  alinia = 'stanga', cursiv, raza, children, _lat, _inalt,
}) {
  const pc = (v, total) => `${(v / total) * 100}%`;
  const inaltimeLitera = corp || h * 0.72;
  // Pata acoperă cuvântul cu puțin peste, ca să prindă și coada lui „y” sau „p”.
  const marja = Math.max(2, inaltimeLitera * 0.22);
  return (
    <span
      className={styles.eticheta}
      style={{
        left: pc(x - marja, _lat),
        top: pc(y - marja, _inalt),
        minWidth: pc(w + marja * 2, _lat),
        height: pc(h + marja * 2, _inalt),
        background: fond,
        color: culoare,
        // `cqw` = 1% din lățimea cadrului. Așa corpul literei rămâne o
        // fracțiune fixă din figură, indiferent la ce mărime e afișată —
        // exact ca literele din imaginea de dedesubt, care se scalează cu ea.
        fontSize: `${((inaltimeLitera * 1.38) / _lat) * 100}cqw`,
        fontStyle: cursiv ? 'italic' : 'normal',
        // `raza` e pentru cuvintele scrise în casete colorate: acolo pata nu poate
        // fi mai mică decât caseta (cuvântul o umple), deci acoperă caseta întreagă
        // și îi împrumută forma. Se dă în pixelii decupajului, ca x și y.
        borderRadius: raza ? `${(raza / _lat) * 100}cqw` : undefined,
        justifyContent:
          alinia === 'centru' ? 'center' : alinia === 'dreapta' ? 'flex-end' : 'flex-start',
      }}
    >
      <span className={styles.text}>{children}</span>
    </span>
  );
}
