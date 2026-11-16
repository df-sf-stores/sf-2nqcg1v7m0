'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { AddToCart, BuyNow, Link, TextField, useCart, useStorefront, type GiftRecipient, type ProductPage } from '@dripfunnel/storefront-core/theme'
import shop from '../../styles/shop.module.css'
import styles from '../../styles/product.module.css'
import { cx } from '../cx'
import { WishlistHeart } from './WishlistHeart'

const emailLike = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Add to cart and Buy now for the chosen version; both wait until every option is chosen and the version is in stock.
 * A gift card asks for its recipient first, as D1's gift card page does; a download or a service says what the shopper gets.
 */
export const BuyButtons = ({ page }: { page: ProductPage }) => {
  const { t } = useStorefront()
  const cart = useCart()
  const [addedId, setAddedId] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  // Core keeps the button disabled until the engine answers; this only names that wait on the button.
  const [adding, setAdding] = useState(false)
  const [gift, setGift] = useState<GiftRecipient>({ recipientName: '', recipientEmail: '', sendOn: '', message: '' })
  const [wanted, setWanted] = useState(1)
  const version = page.version
  const kind = page.product?.kind
  const isGift = kind?.kind === 'gift_card'
  // How many to buy, never more than the chosen version has; a gift card goes one recipient at a time.
  const most = Math.max(1, Math.min(99, version?.stock.available ?? 99))
  const chosen = Math.min(wanted, most)
  const quantity = isGift ? 1 : chosen
  const giftReady = gift.recipientName.trim() !== '' && emailLike.test(gift.recipientEmail.trim())
  const buyable = version !== null && version.stock.inStock && (!isGift || giftReady)
  // A product with questions opens core's form first, which may be closed without adding, so it shows no wait.
  const asks = (page.product?.questions.length ?? 0) > 0
  const set = (patch: Partial<GiftRecipient>) => setGift({ ...gift, ...patch })
  const why = useId()
  const waitsForRecipient = isGift && !giftReady
  const added = version !== null && addedId === version.id
  // A failed answer can still mean the engine added it (a slow answer the browser stopped waiting for), so the cart is
  // read again once: the header count then shows what is really in it, and the shopper is sent to look before retrying.
  const settle = (worked: boolean) => {
    setAdding(false)
    setFailed(!worked)
    if (!worked) cart.retry()
    return worked
  }
  // A gift card keeps Add to cart, so a second one can go to someone else.
  const inCart = added && !isGift
  // Go to cart replaces the button just pressed, so focus moves to it rather than dropping to the page (WCAG 2.4.3).
  const goToCart = useRef<HTMLAnchorElement>(null)
  const justAdded = useRef(false)
  useEffect(() => {
    if (inCart && justAdded.current) goToCart.current?.focus()
    justAdded.current = false
  }, [inCart])
  return (
    <div className={styles.buy}>
      {kind?.kind === 'digital' ? (
        <p className={styles.kindNote}>{kind.downloadLimit !== null && kind.downloadDays !== null ? t('shop.product.download', { times: kind.downloadLimit, days: kind.downloadDays }) : t('shop.product.downloadPlain')}</p>
      ) : null}
      {kind?.kind === 'service' ? <p className={styles.kindNote}>{[kind.duration, kind.location].filter(Boolean).join(' · ') || t('shop.product.service')}</p> : null}
      {kind?.kind === 'gift_card' ? (
        <div className={styles.gift}>
          <TextField label={t('shop.product.gift.name')} autoComplete="off" value={gift.recipientName} onChange={(recipientName) => set({ recipientName })} className={styles.field} />
          <TextField label={t('shop.product.gift.email')} type="email" autoComplete="off" value={gift.recipientEmail} onChange={(recipientEmail) => set({ recipientEmail })} className={styles.field} />
          <TextField label={t('shop.product.gift.message')} note={t('shop.product.gift.optional')} maxLength={200} value={gift.message ?? ''} onChange={(message) => set({ message })} className={styles.field} />
          <TextField
            label={t('shop.product.gift.sendOn')}
            type="date"
            value={gift.sendOn ?? ''}
            onChange={(sendOn) => set({ sendOn })}
            hint={kind.expiryMonths !== null ? t('shop.product.gift.sendHintExpiry', { months: kind.expiryMonths }) : t('shop.product.gift.sendHint')}
            className={styles.field}
          />
        </div>
      ) : null}
      {waitsForRecipient ? (
        <p id={why} className={styles.kindNote}>
          {t('shop.product.gift.needed')}
        </p>
      ) : null}
      {isGift ? null : (
        <div className={styles.quantity} role="group" aria-label={t('shop.product.quantity')}>
          <span className={styles.quantityLabel} aria-hidden="true">
            {t('shop.product.quantity')}
          </span>
          <button type="button" className={styles.step} aria-label={t('shop.cart.less')} disabled={quantity <= 1} onClick={() => setWanted(quantity - 1)}>
            <svg className={styles.stepIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M5 12h14" />
            </svg>
          </button>
          <span className={styles.count} aria-live="polite">
            {chosen}
          </span>
          <button type="button" className={styles.step} aria-label={t('shop.cart.more')} disabled={quantity >= most} onClick={() => setWanted(quantity + 1)}>
            <svg className={styles.stepIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M5 12h14M12 5v14" />
            </svg>
          </button>
        </div>
      )}
      <div className={styles.actions}>
      {inCart ? (
        <Link href="/cart/" className={cx(shop.primary, styles.addButton)} ref={goToCart}>
          {t('shop.product.goToCart')}
        </Link>
      ) : (
        <span className={styles.addWrap} onClick={() => setAdding(buyable && !asks)}>
        <AddToCart
          versionId={version?.id ?? null}
          quantity={quantity}
          disabled={!buyable}
          gift={isGift ? gift : null}
          describedBy={waitsForRecipient ? why : undefined}
          className={cx(shop.primary, styles.addButton)}
          onDone={(worked) => {
            if (!settle(worked)) return
            justAdded.current = true
            setAddedId(version?.id ?? null)
          }}
        >
          {adding ? t('shop.product.adding') : isGift ? t('shop.product.gift.add') : t('shop.product.add')}
        </AddToCart>
        </span>
      )}
      {isGift ? null : (
        <BuyNow versionId={version?.id ?? null} quantity={quantity} disabled={!buyable} className={cx(shop.secondary, styles.buyNow)} onDone={(bought) => void settle(bought)}>
          {t('shop.product.buyNow')}
        </BuyNow>
      )}
      {page.product ? <WishlistHeart productId={page.product.id} name={page.product.name} versionId={version?.id ?? null} /> : null}
      </div>
      {failed ? (
        <p className={styles.failed} role="alert">
          {t('shop.product.addFailed')}{' '}
          <Link href="/cart/" className={styles.failedLink}>
            {t('shop.product.viewCart')}
          </Link>
        </p>
      ) : added ? (
        <p className={styles.added} role="status">
          {t('shop.product.added')}
        </p>
      ) : null}
    </div>
  )
}
