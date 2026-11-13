'use client'

import { useState, type ReactNode } from 'react'
import { useMediaQuery, useStorefront, type ProductCard as Card } from '@dripfunnel/storefront-core/theme'
import { ProductCard } from '../ProductCard'
import { cx } from '../cx'
import styles from '../../styles/home.module.css'

/**
 * A row of product cards paged by arrows: four at a time on wide screens, two on narrow ones, with one bar per page
 * under it. `action` (the "view all" link) sits beside the arrows.
 */
export const ProductCarousel = ({ products, action }: { products: readonly Card[]; action: ReactNode }) => {
  const { t } = useStorefront()
  const wide = useMediaQuery('(min-width: 900px)')
  const perPage = wide ? 4 : 2
  const pages = Math.max(1, Math.ceil(products.length / perPage))
  const [page, setPage] = useState(0)
  const at = Math.min(page, pages - 1)
  const shown = products.slice(at * perPage, at * perPage + perPage)
  return (
    <div className={styles.carousel}>
      <div className={styles.carouselTools}>
        {action}
        {pages > 1 ? (
          <span className={styles.arrows}>
            <button type="button" className={styles.arrowButton} aria-label={t('home.arrivals.previous')} disabled={at === 0} onClick={() => setPage(at - 1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button type="button" className={styles.arrowButton} aria-label={t('home.arrivals.next')} disabled={at >= pages - 1} onClick={() => setPage(at + 1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </span>
        ) : null}
      </div>
      <ul className={styles.carouselList} aria-live="polite">
        {shown.map((product) => (
          <li key={product.id} className={styles.carouselItem}>
            <ProductCard product={product} dark />
          </li>
        ))}
      </ul>
      <div className={styles.progress} aria-hidden="true">
        {[...Array(pages).keys()].map((i) => (
          <span key={i} className={cx(styles.progressBar, i === at && styles.progressOn)} />
        ))}
      </div>
    </div>
  )
}
