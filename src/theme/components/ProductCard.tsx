import { Image, Link, Price, useStorefront, type ProductCard as Card } from '@dripfunnel/storefront-core/theme'
import { WishlistHeart } from './interactive/WishlistHeart'
import { cx } from './cx'
import styles from '../styles/shop.module.css'

type ProductCardProps = {
  product: Card
  /** Set on a night section: ivory words and gold prices. */
  dark?: boolean
  /** A rounded white card, as the listing pages show them. */
  boxed?: boolean
  /** The list view's row: the picture beside the words. */
  row?: boolean
}

/** A product as a tall picture with its stock and wishlist heart, then its name and price. */
export const ProductCard = ({ product, dark = false, boxed = false, row = false }: ProductCardProps) => {
  const { store, locale, t } = useStorefront()
  return (
    <article className={cx(styles.card, dark && styles.cardDark, boxed && styles.cardBoxed, row && styles.cardRow)}>
      <div className={styles.cardPicture}>
        <Link href={product.href} className={styles.cardLink}>
          {product.photo ? (
            <Image image={product.photo} alt={product.photo.alt ?? product.name} ratio={0.8} sizes="(min-width: 1200px) 260px, (min-width: 900px) 30vw, 50vw" className={styles.cardImage} />
          ) : (
            <span className={styles.noPicture}>
              <span className={styles.noPictureMark} aria-hidden="true">
                {product.name.slice(0, 1)}
              </span>
              {t('shop.card.noPicture')}
            </span>
          )}
        </Link>
        <span className={styles.flags}>
          {product.stock.inStock ? null : <span className={styles.soldOut}>{t('shop.card.soldOut')}</span>}
          {product.badges[0] ? <span className={styles.badge}>{product.badges[0].label}</span> : null}
        </span>
        <WishlistHeart productId={product.id} name={product.name} versionId={null} className={styles.cardHeart} onClassName={styles.cardHeartOn} size={16} />
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardName}>
          <Link href={product.href} className={styles.cardNameLink}>
            {product.name}
          </Link>
        </h3>
        {product.price ? (
          <p className={styles.cardPrice}>
            {product.from ? <span className={styles.from}>{t('shop.card.from')}</span> : null}
            <Price money={product.price} compareAt={product.compareAt} includesTax={store.pricesIncludeTax} locale={locale} t={t} className={styles.price} />
          </p>
        ) : null}
        {row ? (
          <Link href={product.href} className={styles.textLink}>
            {t('shop.card.view')}
          </Link>
        ) : null}
      </div>
    </article>
  )
}

/** Products in the listing pages' boxed cards: four across on wide screens. */
export const ProductGrid = ({ products, wide = false }: { products: readonly Card[]; wide?: boolean }) => (
  <ul className={wide ? styles.gridWide : styles.listingGrid}>
    {products.map((p) => (
      <li key={p.id} className={styles.cell}>
        <ProductCard product={p} boxed />
      </li>
    ))}
  </ul>
)

/** The grid's shape while its products load, so nothing moves when they arrive. */
export const GridPlaceholder = ({ label, count }: { label: string; count: number }) => (
  <ul className={styles.listingGrid} aria-busy="true" aria-label={label}>
    {[...Array(count).keys()].map((i) => (
      <li key={i} className={cx(styles.cell, styles.skeletonCard)}>
        <div className={styles.skeletonPicture} />
        <div className={styles.skeletonLine} />
      </li>
    ))}
  </ul>
)
