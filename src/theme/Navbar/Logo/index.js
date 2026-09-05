import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { EdulabWordmark } from '@site/src/components/Brand';

/**
 * Navbar: emblema Edulab58 + wordmarkul DESENAT, în loc de titlul text.
 *
 * Portat din `curs/src/theme/Navbar/Logo/index.js`. Fără swizzle-ul ăsta,
 * Docusaurus scrie titlul din configurație cu fontul paginii — iar autorul a
 * observat imediat: „titlul edulab58 din navbar nu e scris cu fontul stilizat".
 * Nu e o chestiune de font: wordmarkul nu ARE font, sunt litere desenate.
 */
export default function NavbarLogo() {
  // Prin `useBaseUrl`, nu scris de mână: calea trebuie sa urmeze `baseUrl` din
  // configurație, altfel emblema dispare tăcut la orice schimbare de repo.
  const emblema = useBaseUrl('/img/logo.png');

  return (
    <Link
      to="/"
      className="navbar__brand"
      aria-label="Edulab58 — acasă"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: 'var(--kl-ink)', flexShrink: 0 }}
    >
      <img
        src={emblema}
        alt=""
        aria-hidden="true"
        style={{ height: '2.1rem', width: 'auto', display: 'block', flexShrink: 0 }}
      />
      <EdulabWordmark width={132} />
    </Link>
  );
}
