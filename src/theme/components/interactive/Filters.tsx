'use client'

import { useState, type ReactNode } from 'react'
import { Checkbox, Link, PriceRange, Select, useLoadOnScroll, useStorefront, type Listing, type SortKey } from '@dripfunnel/storefront-core/theme'
import { Notice } from '../Notice'
import { GridPlaceholder, ProductCard } from '../ProductCard'
import { cx } from '../cx'
import { Retry } from './Retry'
import styles from '../../styles/shop.module.css'

/** The listing's own orders, plus Z to A, which core has no sort for: it reverses A to Z once every product has loaded. */
type Order = SortKey | 'name-desc'

const Chevron = () => (
  <svg className={styles.facetChevron} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M6 15l6-6 6 6" />
  </svg>
)

/** One collapsible group of the filter card, open to start with. */
const Group = ({ title, children }: { title: string; children: ReactNode }) => (
  <details className={styles.facet} open>
    <summary className={styles.facetName}>
      {title}
      <Chevron />
    </summary>
    <div className={styles.facetBody}>{children}</div>
  </details>
)

/** The filter card: price range, the listing's filters (only values that have products), and in stock only. */
const FilterPanel = ({ listing, inStock, onInStock }: { listing: Listing; inStock: boolean; onInStock: (on: boolean) => void }) => {
  const { t } = useStorefront()
  const [open, setOpen] = useState(false)
  const priced = listing.priceRange.min !== null || listing.priceRange.max !== null
  const chosen = listing.selected.length + Number(priced) + Number(inStock)
  return (
    <aside className={styles.filters}>
      <button type="button" className={styles.filterToggle} aria-expanded={open} aria-controls="listing-filters" onClick={() => setOpen(!open)}>
        <svg className={styles.toggleIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M4 7h10M18 7h2M4 17h4M12 17h8M14 4v6M8 14v6" />
        </svg>
        {open ? t('shop.listing.filtersShown') : t('shop.listing.filters')}
        {chosen ? <span className={styles.count}>{chosen}</span> : null}
      </button>
      <div id="listing-filters" className={cx(styles.filterCard, open && styles.filterCardOpen)}>
        <p className={styles.filterTitle}>{t('shop.listing.filters')}</p>
        {listing.priceBounds ? (
          <Group title={t('shop.listing.priceRange')}>
            <PriceRange
              bounds={listing.priceBounds}
              value={listing.priceRange}
              onChange={listing.setPriceRange}
              label={t('shop.listing.price')}
              className={styles.priceRange}
              parts={{ track: styles.priceTrack, rail: styles.priceRail, fill: styles.priceFill, tick: styles.priceTick, thumb: styles.priceThumb, ends: styles.priceEnds, select: styles.priceSelect, to: styles.priceTo }}
            />
          </Group>
        ) : null}
        {listing.facets.map((facet) => {
          const values = facet.values.filter((v) => v.count > 0 || v.selected)
          return values.length ? (
            <Group key={facet.id} title={facet.name}>
              {values.map((value) => (
                <Checkbox key={value.id} checked={value.selected} onChange={() => listing.toggle(value.id)} className={styles.check}>
                  <span className={styles.checkName}>{value.name}</span>
                  <span className={styles.checkCount}>{value.count}</span>
                </Checkbox>
              ))}
            </Group>
          ) : null
        })}
        <Group title={t('shop.listing.availability')}>
          <Checkbox checked={inStock} onChange={onInStock} className={styles.check}>
            <span className={styles.checkName}>{t('shop.listing.inStockOnly')}</span>
          </Checkbox>
        </Group>
        {chosen ? (
          <button
            type="button"
            className={styles.clearAll}
            onClick={() => {
              listing.clear()
              listing.setPriceRange({ min: null, max: null })
              onInStock(false)
            }}
          >
            {t('shop.listing.clear')}
          </button>
        ) : null}
      </div>
    </aside>
  )
}

/** Infinite scroll: the next page loads as the end of the grid nears the screen, and a page that didn't load offers a retry. */
export const MoreOnScroll = ({ listing }: { listing: Listing }) => {
  const { t } = useStorefront()
  const end = useLoadOnScroll(listing)
  return (
    <div ref={end} className={styles.more}>
      {listing.loadingMore ? (
        <p className={styles.muted} role="status">
          {t('shop.listing.loadingMore')}
        </p>
      ) : null}
      {listing.moreFailed ? (
        <>
          <p className={styles.muted} role="alert">
            {t('shop.listing.moreFailed')}
          </p>
          <button type="button" className={styles.secondary} onClick={listing.fetchMore}>
            {t('shop.listing.retry')}
          </button>
        </>
      ) : null}
    </div>
  )
}

/**
 * A collection's, a search's or the whole shop's products, as the reference's Search page: the filter card, the count, the
 * sort, grid or list, and the grid's loading, empty and error states. One component serves every listing page.
 */
export const ListingView = ({ listing }: { listing: Listing }) => {
  const { t } = useStorefront()
  const [list, setList] = useState(false)
  const [inStock, setInStock] = useState(false)
  const [descending, setDescending] = useState(false)
  const labels: Record<Order, string> = {
    featured: t('shop.listing.sorts.featured'),
    newest: t('shop.listing.sorts.newest'),
    'price-low': t('shop.listing.sorts.priceLow'),
    'price-high': t('shop.listing.sorts.priceHigh'),
    name: t('shop.listing.sorts.name'),
    'name-desc': t('shop.listing.sorts.nameDesc'),
  }
  // Z to A is only offered once the listing has no more pages, so reversing what loaded reverses the whole listing.
  const reversible = listing.sorts.includes('name') && !listing.hasMore
  const order: Order = descending && reversible && listing.sort === 'name' ? 'name-desc' : listing.sort
  const orders: Order[] = [...listing.sorts, ...(reversible ? (['name-desc'] as const) : [])]
  const sorted = order === 'name-desc' ? [...listing.items].reverse() : listing.items
  const items = inStock ? sorted.filter((p) => p.stock.inStock) : sorted
  const ready = listing.status === 'ready'
  return (
    <div className={styles.listingFiltered}>
      <FilterPanel listing={listing} inStock={inStock} onInStock={setInStock} />
      <div className={styles.results}>
        <h2 className={styles.hiddenHeading}>{t('shop.listing.heading')}</h2>
        <div className={styles.toolbar}>
          <p className={styles.resultCount} role="status">
            {ready ? (listing.hasMore ? t('shop.listing.showing', { count: items.length }) : t('shop.listing.total', { count: items.length })) : t('shop.listing.loading')}
          </p>
          <div className={styles.toolbarEnd}>
            <Select
              label={t('shop.listing.sort')}
              value={order}
              options={orders.map((o) => ({ value: o, label: labels[o] }))}
              onChange={(next) => {
                setDescending(next === 'name-desc')
                listing.setSort(next === 'name-desc' ? 'name' : next)
              }}
              className={styles.sort}
            />
            <div className={styles.views} role="group" aria-label={t('shop.listing.view')}>
              <button type="button" className={cx(styles.viewButton, !list && styles.viewOn)} aria-pressed={!list} onClick={() => setList(false)}>
                <svg className={styles.viewIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
                </svg>
                {t('shop.listing.grid')}
              </button>
              <button type="button" className={cx(styles.viewButton, list && styles.viewOn)} aria-pressed={list} onClick={() => setList(true)}>
                <svg className={styles.viewIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />
                </svg>
                {t('shop.listing.list')}
              </button>
            </div>
          </div>
        </div>
        {listing.selected.length ? (
          <div className={styles.chips}>
            {listing.selected.map((s) => (
              <button key={s.id} type="button" className={styles.chip} aria-label={t('shop.listing.remove', { name: s.name })} onClick={() => listing.toggle(s.id)}>
                {s.name}
                <svg className={styles.chipIcon} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            ))}
          </div>
        ) : null}
        {listing.status === 'loading' ? <GridPlaceholder label={t('shop.listing.loading')} count={8} /> : null}
        {listing.status === 'error' ? (
          <Notice title={t('shop.listing.failed')} lead={t('shop.listing.failedLead')}>
            <Retry label={t('shop.listing.retry')} onRetry={listing.retry} />
          </Notice>
        ) : null}
        {ready && items.length === 0 ? (
          listing.selected.length || inStock ? (
            <Notice title={t('shop.listing.empty')} lead={t('shop.listing.emptyLead')}>
              <button
                type="button"
                className={styles.secondary}
                onClick={() => {
                  listing.clear()
                  setInStock(false)
                }}
              >
                {t('shop.listing.clear')}
              </button>
            </Notice>
          ) : (
            <Notice title={t('shop.collection.empty')} lead={t('shop.collection.emptyLead')}>
              <Link href="/collections/all/" className={styles.secondary}>
                {t('shop.collection.browse')}
              </Link>
            </Notice>
          )
        ) : null}
        {ready && items.length ? (
          <ul className={list ? styles.rows : styles.listingGrid}>
            {items.map((p) => (
              <li key={p.id} className={styles.cell}>
                <ProductCard product={p} boxed row={list} />
              </li>
            ))}
          </ul>
        ) : null}
        <MoreOnScroll listing={listing} />
      </div>
    </div>
  )
}
