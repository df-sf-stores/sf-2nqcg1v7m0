'use client'

import { useEffect } from 'react'
import { cx } from '../cx'
import { useStorefront, useWishlist, type WishlistPage } from '@dripfunnel/storefront-core/theme'
import { useSharedWishlist } from './SharedWishlist'
import styles from '../../styles/product.module.css'

const heart = 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'

type HeartProps = { productId: string; name: string; versionId: string | null; className?: string | undefined; onClassName?: string | undefined; size?: number }

/** The button itself, for whichever wishlist it is handed. */
const HeartButton = ({ wishlist, productId, name, versionId, className, onClassName, size = 22 }: HeartProps & { wishlist: WishlistPage }) => {
  const { t } = useStorefront()
  const on = wishlist.has(productId)
  const { chose } = wishlist
  useEffect(() => {
    if (on && versionId) chose(productId, versionId)
  }, [on, chose, productId, versionId])
  return (
    <>
      <button type="button" className={cx(className ?? styles.heart, on && (onClassName ?? styles.heartOn))} aria-pressed={on} aria-label={t('shop.wishlist.heart', { name })} disabled={wishlist.busy || wishlist.status === 'loading'} onClick={() => void wishlist.toggle(productId, versionId)}>
        <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
          <path d={heart} fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </button>
      {wishlist.error && !className ? (
        <p className={styles.added} role="status">
          {wishlist.error === 'LIMIT' ? t('shop.wishlist.full') : t('shop.wishlist.failed')}
        </p>
      ) : null}
    </>
  )
}

/** Outside Layout (checkout), with no shared wishlist, a heart reads its own. */
const OwnHeart = (props: HeartProps) => <HeartButton {...props} wishlist={useWishlist()} />

/** The heart beside Add to cart and on each card: pressed when the product is on the shopper's wishlist; signed out, it asks them to sign in first. */
export const WishlistHeart = (props: HeartProps) => {
  const shared = useSharedWishlist()
  return shared ? <HeartButton {...props} wishlist={shared} /> : <OwnHeart {...props} />
}
