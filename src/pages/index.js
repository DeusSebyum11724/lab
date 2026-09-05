import { useEffect, useRef, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { EdulabWordmark, KulturosferaLine } from '@site/src/components/Brand';
import styles from './index.module.css';

/**
 * Pagina de start — croiala lui edumat58, măsurată în pagina care rulează, nu
 * presupusă. Trei lucruri au fost greșite în versiunile mele anterioare:
 *
 *  1. Pusesem hârtie crem pe toată pagina. Pe edumat58 `body` e ALB curat;
 *     culoarea tare stă doar în blocul de hero. Culoarea peste tot face pagina
 *     ieftină — autorul a numit-o „Temu".
 *  2. Scrisesem „edulab58" ca text cu Space Grotesk. La ei wordmarkul e un SVG
 *     cu litere DESENATE, generat de un script. Acum e generat cu același
 *     generator, cu `l` și `b` adăugate.
 *  3. Făcusem carduri cu chenar într-o grilă `auto-fit`, care la lățime mare
 *     lăsa o celulă goală, randată ca bloc gri. La ei domeniile nu sunt carduri
 *     deloc: fundal transparent, fără chenar, titlu în accentul cel mai închis.
 */

const DOMENII = [
  {
    titlu: 'Mecanică',
    text: 'Mișcare, forțe, echilibru. De ce pornește un corp, ce îl oprește și cât de repede ajunge.',
  },
  {
    titlu: 'Optică',
    text: 'Lumina, reflexia și refracția. Cum vedem, de ce se frânge un băț scufundat și unde se formează imaginea.',
  },
  {
    titlu: 'Electricitate',
    text: 'Curentul, circuitul, rezistența. Ce se întâmplă între întrerupător și bec, și de ce contează drumul.',
  },
];

/**
 * Dezvăluire la derulare.
 *
 * `IntersectionObserver`, nu ascultător de scroll: ăsta din urmă rulează la
 * fiecare pixel și încarcă firul principal degeaba. Se declanșează O SINGURĂ
 * dată — un element care reapare de fiecare dată când treci pe lângă el devine
 * enervant la a doua citire a paginii.
 */
function useDezvaluire() {
  const ref = useRef(null);
  // `armat` = JS a pornit ȘI poate observa; abia atunci elementul are voie să
  // fie ascuns. `vazut` = a intrat în ecran.
  const [armat, setArmat] = useState(false);
  const [vazut, setVazut] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // CONȚINUTUL NU DEPINDE DE JS CA SĂ FIE VIZIBIL. Fără
    // `IntersectionObserver`, sau cu mișcarea redusă din sistem, nu se ascunde
    // nimic — nu se armează deloc. Prima versiune pornea de la `opacity: 0` în
    // CSS și, dacă observatorul nu se declanșa (pagină nerandată, extensie,
    // eroare de script), cele trei domenii rămâneau invizibile pentru
    // totdeauna. O animație n-are voie să fie singurul lucru care aduce textul
    // pe ecran.
    const reduce =
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typeof IntersectionObserver === 'undefined' || reduce) return;

    setArmat(true);
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVazut(true); o.disconnect(); } },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    o.observe(el);

    // Plasă de siguranță: dacă în două secunde observatorul n-a spus nimic —
    // pagină în fundal, fereastră neredată, orice — se dezvăluie oricum.
    const t = setTimeout(() => setVazut(true), 2000);
    return () => { o.disconnect(); clearTimeout(t); };
  }, []);

  return [ref, armat, vazut];
}

function Domeniu({ d, i }) {
  const [ref, armat, vazut] = useDezvaluire();
  return (
    <article
      ref={ref}
      className={[styles.domeniu, armat && !vazut ? styles.ascuns : ''].filter(Boolean).join(' ')}
      style={{ transitionDelay: `${i * 90}ms` }}
    >
      <span className={styles.numar} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
      <div>
        <h3 className={styles.domeniuTitlu}>{d.titlu}</h3>
        <p className={styles.domeniuText}>{d.text}</p>
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <Layout title="Edulab58" description="Fizica, pas cu pas">
      <header className={styles.hero}>
        <div className={styles.grila} aria-hidden="true" />
        <div className={styles.heroIn}>
          <div className={`${styles.semnatura} ${styles.intra1}`}>
            <KulturosferaLine width={64} />
          </div>

          {/* Wordmarkul desenat, nu scris. Vine peste linia de brand, ca la edumat58. */}
          <div className={`${styles.wordmark} ${styles.intra2}`}>
            <EdulabWordmark width="min(420px, 86vw)" />
          </div>

          <p className={`${styles.tagline} ${styles.intra3}`}>Fizica, pas cu pas</p>

          <div className={`${styles.butoane} ${styles.intra4}`}>
            <Link className={styles.pastilaPlina} to="/docs/despre">Descoperă Edulab</Link>
            <Link className={styles.pastilaGoala} href="https://www.kulturosfera.com">
              Descoperă Kulturosfera
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.pagina}>
        <p className={styles.supratitlu}>Cursul</p>
        <h2 className={styles.titluSectiune}>Trei domenii</h2>
        <div className={styles.domenii}>
          {DOMENII.map((d, i) => <Domeniu key={d.titlu} d={d} i={i} />)}
        </div>
      </main>
    </Layout>
  );
}
