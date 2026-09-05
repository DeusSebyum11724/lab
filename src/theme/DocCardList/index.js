import React from 'react';
import clsx from 'clsx';
import {
  useCurrentSidebarCategory,
  filterDocCardListItems,
} from '@docusaurus/plugin-content-docs/client';
import DocCard from '@theme/DocCard';
import styles from './styles.module.css';

function DocCardListForCurrentSidebarCategory({ className }) {
  const category = useCurrentSidebarCategory();
  return <DocCardList items={category.items} className={className} />;
}

/**
 * COPIAT din edumat58 (`src/theme/DocCardList/index.js`). S-a taiat tabelul
 * care strecura, in capul fiecarei liste de clasa, un card catre lectiile
 * adaptate. Restul - grila compacta pe doua coloane - e neatins.
 */
export default function DocCardList(props) {
  const { items, className } = props;

  if (!items) {
    return <DocCardListForCurrentSidebarCategory {...props} />;
  }

  const filteredItems = filterDocCardListItems(items);

  return (
    <section className={clsx(styles.compactList, className)}>
      {filteredItems.map((item, index) => (
        <article key={index} className={styles.compactItem}>
          <DocCard item={item} />
        </article>
      ))}
    </section>
  );
}
