import React from 'react';
import Layout from '@theme/Layout';
import Hero from '@site/src/components/Hero/Hero';

/**
 * Pagina de start — croiala lui edumat58: `<Layout>` și, în el, `<Hero />`.
 * Atât. Acolo heroul e singurul lucru de deasupra pliului, iar sub el vine
 * `HomepageFeatures`, o componentă care descrie funcții pe care Edulab58 nu le
 * are (EduPAȘI, vocea, calendarul). N-am portat-o: o listă care promite ce nu
 * există e mai rea decât o pagină care se oprește.
 *
 * Ce era aici înainte — heroul meu cu degrade static și cele trei domenii
 * (Mecanică / Optică / Electricitate) — a fost aruncat. Nu era al lor.
 */
export default function Home() {
  return (
    <Layout title="Edulab58" description="Fizică pentru clasele VI–VIII">
      <Hero />
    </Layout>
  );
}
