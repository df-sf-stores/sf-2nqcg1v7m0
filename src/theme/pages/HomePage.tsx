import { Link, ThemeImage, useCollections, useListing, useProducts, useStorefront, type CollectionCard } from '@dripfunnel/storefront-core/theme'
import { CollectionPicture } from '../components/CollectionPicture'
import { Layout } from '../components/Layout'
import { ProductCarousel } from '../components/interactive/ProductCarousel'
import { Newsletter } from '../components/interactive/Newsletter'
import { cx } from '../components/cx'
import { slugOf } from '../components/slugOf'
import { tidyName } from '../components/tidyName'
import shop from '../styles/shop.module.css'
import styles from '../styles/home.module.css'

const Arrow = () => (
  <svg className={styles.arrowIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

const number = (index: number) => String(index + 1).padStart(2, '0')

/** The store's scent collection, by its address, for the fragrance edit; a store without one leaves the section out. */
const isScent = (c: CollectionCard) => /fragran|perfum|parfum|scent|attar|cologne/i.test(slugOf(c))

/** Cinematic opening: the season's photograph, the headline, two collections to shop and the season index. */
const Hero = ({ collections }: { collections: readonly CollectionCard[] }) => {
  const { store, t } = useStorefront()
  const [first, second] = collections
  return (
    <section className={styles.hero}>
      <div className={styles.heroPicture}>
        <ThemeImage src="hero.webp" alt="" ratio={2400 / 1623} sizes="(min-width: 900px) 70vw, 100vw" className={styles.cover} />
      </div>
      <span className={styles.heroShade} aria-hidden="true" />
      <p className={styles.heroSide} aria-hidden="true">
        <span>{t('home.hero.side', { store: store.name })}</span>
        <span className={styles.heroSideRule} />
        <span>{t('home.hero.since')}</span>
      </p>
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <p className={styles.lineEyebrow}>{t('home.hero.eyebrow')}</p>
          <h1 className={styles.heroTitle}>
            {t('home.hero.title')} <em className={styles.heroAccent}>{t('home.hero.accent')}</em>
          </h1>
          <p className={styles.heroLead}>
            {t('home.hero.lead')}
            <br />
            {t('home.hero.leadMore')}
          </p>
          <div className={styles.heroActions}>
            <Link href={first?.href ?? '/collections/all/'} className={styles.solidButton}>
              {first ? t('home.hero.shop', { name: tidyName(first.name) }) : t('home.hero.shopAll')}
              <Arrow />
            </Link>
            {second ? (
              <Link href={second.href} className={styles.ghostButton}>
                {t('home.hero.shop', { name: tidyName(second.name) })}
                <Arrow />
              </Link>
            ) : null}
          </div>
        </div>
        {collections.length ? (
          <nav className={styles.index} aria-label={t('home.hero.index')}>
            <p className={styles.indexTitle}>{t('home.hero.index')}</p>
            <ol className={styles.indexList}>
              {collections.slice(0, 5).map((c, i) => (
                <li key={c.id}>
                  <Link href={c.href} className={styles.indexLink}>
                    <span className={styles.indexNumber}>{number(i)}</span>
                    <span className={styles.indexName}>{tidyName(c.name)}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
      </div>
      <p className={styles.scroll} aria-hidden="true">
        {t('home.hero.scroll')}
        <span className={styles.scrollLine} />
      </p>
    </section>
  )
}

/** The store's collections as a staggered mosaic of tall pictures; an odd one out closes the mosaic as a wide band. */
const Categories = ({ collections, busy }: { collections: readonly CollectionCard[]; busy: boolean }) => {
  const { store, t } = useStorefront()
  if (!busy && !collections.length) return null
  const band = collections.length % 2 === 1 && collections.length > 1 ? collections.length - 1 : -1
  return (
    <section className={styles.categories}>
      <div className={styles.container}>
        <div className={styles.splitHead}>
          <div>
            <p className={styles.lineEyebrow}>{t('home.categories.eyebrow', { store: store.name })}</p>
            <h2 className={styles.displayTitle}>
              {t('home.categories.title')}
              <br />
              {t('home.categories.titleMore')}
            </h2>
          </div>
          <p className={styles.splitLead}>{t('home.categories.lead', { store: store.name })}</p>
        </div>
        <ul className={styles.mosaic} aria-busy={busy}>
          {busy
            ? [0, 1, 2, 3].map((i) => (
                <li key={i} className={cx(styles.mosaicItem, i % 2 === 1 && styles.mosaicLow)}>
                  <span className={cx(styles.mosaicCard, i % 4 === 0 || i % 4 === 3 ? styles.mosaicTall : styles.mosaicShort)} />
                </li>
              ))
            : collections.map((c, i) => (
                <li key={c.id} className={cx(styles.mosaicItem, i === band ? styles.mosaicBand : i % 2 === 1 && styles.mosaicLow)}>
                  <Link href={c.href} className={cx(styles.mosaicCard, i === band ? styles.mosaicWide : i % 4 === 0 || i % 4 === 3 ? styles.mosaicTall : styles.mosaicShort)}>
                    <CollectionPicture collection={c} named ratio={i === band ? 2.6 : 0.8} width={i === band ? 1120 : 560} className={styles.cover} />
                    <span className={styles.mosaicShade} />
                    <span className={styles.mosaicCopy}>
                      <span className={styles.mosaicName}>{tidyName(c.name)}</span>
                      {c.description ? <span className={styles.mosaicLead}>{c.description}</span> : null}
                      <span className={styles.mosaicMore}>
                        {t('home.categories.explore')}
                        <Arrow />
                      </span>
                    </span>
                    <span className={styles.mosaicNumber}>{number(i)}</span>
                  </Link>
                </li>
              ))}
        </ul>
      </div>
    </section>
  )
}

/** One collection, half photograph and half ivory page, with a few of its products named under it. */
const Featured = ({ collection }: { collection: CollectionCard | undefined }) => {
  const { t } = useStorefront()
  const { items } = useListing({ collection: collection ? slugOf(collection) : null }, collection !== undefined)
  if (!collection) return null
  return (
    <section className={styles.featured}>
      <div className={styles.featuredPicture}>
        <ThemeImage src="featured.webp" alt="" ratio={0.8} sizes="(min-width: 900px) 50vw, 100vw" className={styles.cover} />
        <p className={styles.featuredCaption}>{t('home.featured.caption', { name: collection.name })}</p>
      </div>
      <div className={styles.featuredCopy}>
        <p className={styles.lineEyebrow}>{t('home.featured.eyebrow')}</p>
        <h2 className={styles.featuredTitle}>{collection.name}</h2>
        <p className={styles.featuredLead}>{collection.description || t('home.featured.lead')}</p>
        <Link href={collection.href} className={styles.navyButton}>
          {t('home.featured.cta')}
          <Arrow />
        </Link>
        {items.length > 1 ? (
          <div className={styles.also}>
            <p className={styles.alsoTitle}>{t('home.featured.also', { name: collection.name })}</p>
            <ul className={styles.alsoList}>
              {items.slice(0, 3).map((p) => (
                <li key={p.id}>
                  <Link href={p.href} className={styles.alsoLink}>
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  )
}

const Arrivals = () => {
  const { store, t } = useStorefront()
  const newest = useProducts({ sort: 'newest', first: 12 })
  const none = newest.status !== 'loading' && !newest.products.length
  return (
    <section className={styles.arrivals}>
      <div className={styles.container}>
        <div className={styles.arrivalsHead}>
          <div>
            <p className={styles.lineEyebrow}>{t('home.arrivals.eyebrow', { store: store.name })}</p>
            <h2 className={styles.sectionTitle}>{t('home.arrivals.title')}</h2>
            <p className={styles.sectionLead}>{t('home.arrivals.lead')}</p>
          </div>
        </div>
        {newest.status === 'loading' ? (
          <ul className={styles.carouselList} aria-busy="true" aria-label={t('shop.listing.loading')}>
            {[0, 1, 2, 3].map((i) => (
              <li key={i} className={styles.carouselItem}>
                <div className={cx(shop.skeletonPicture, styles.darkSkeleton)} />
              </li>
            ))}
          </ul>
        ) : none ? (
          <p className={styles.arrivalsEmpty}>{t('home.arrivals.empty')}</p>
        ) : (
          <ProductCarousel
            products={newest.products}
            action={
              <Link href="/collections/all/" className={styles.lightLink}>
                {t('home.arrivals.viewAll')}
                <Arrow />
              </Link>
            }
          />
        )}
      </div>
    </section>
  )
}

const Campaign = () => {
  const { store, t } = useStorefront()
  return (
    <section className={styles.campaign}>
      <div className={styles.campaignPicture}>
        <ThemeImage src="campaign.webp" alt="" ratio={16 / 9} sizes="100vw" className={styles.cover} />
      </div>
      <span className={styles.campaignShade} aria-hidden="true" />
      <div className={styles.campaignCopy}>
        <p className={styles.campaignEyebrow}>
          {t('home.campaign.eyebrow', { store: store.name })}
          <span className={styles.slash} aria-hidden="true" />
          {t('home.campaign.season')}
        </p>
        <h2 className={styles.campaignTitle}>
          {t('home.campaign.title')}
          <em className={styles.campaignAccent}>{t('home.campaign.accent')}</em>
        </h2>
        <Link href="/collections/all/" className={styles.ghostButton}>
          {t('home.campaign.cta')}
          <Arrow />
        </Link>
      </div>
    </section>
  )
}

/** The fragrance edit: the store's name set large, the scent collection's products as a numbered list, and a still life. */
const Scents = ({ collection }: { collection: CollectionCard | undefined }) => {
  const { store, t } = useStorefront()
  const { items } = useListing({ collection: collection ? slugOf(collection) : null }, collection !== undefined)
  if (!collection) return null
  return (
    <section className={styles.scents}>
      <div className={cx(styles.container, styles.scentsInner)}>
        <div className={styles.scentsCopy}>
          <p className={styles.lineEyebrow}>{t('home.scents.eyebrow', { name: collection.name })}</p>
          <h2 className={styles.scentsTitle}>{store.name}</h2>
          <p className={styles.scentsLead}>
            {t('home.scents.lead')}
            <br />
            {t('home.scents.leadMore')}
          </p>
          {items.length ? (
            <ol className={styles.scentList}>
              {items.slice(0, 5).map((p, i) => (
                <li key={p.id}>
                  <Link href={p.href} className={styles.scentLink}>
                    <span className={styles.scentNumber}>{number(i)}</span>
                    <span className={styles.scentName}>{p.name}</span>
                    <Arrow />
                  </Link>
                </li>
              ))}
            </ol>
          ) : null}
          <Link href={collection.href} className={styles.goldButton}>
            {t('home.scents.cta', { name: collection.name })}
            <Arrow />
          </Link>
        </div>
        <div className={styles.scentsPicture}>
          <ThemeImage src="fragrance-feature.webp" alt={collection.name} ratio={0.82} sizes="(min-width: 900px) 560px, 100vw" className={styles.cover} />
          <p className={styles.scentsWord} aria-hidden="true">
            {t('home.scents.word')}
          </p>
        </div>
      </div>
    </section>
  )
}

const Detail = () => {
  const { store, t } = useStorefront()
  return (
    <section className={styles.detail}>
      <div className={cx(styles.container, styles.detailInner)}>
        <h2 className={styles.detailTitle}>
          <span className={styles.detailFirst}>{t('home.detail.first')}</span>
          <em className={styles.detailBy}>{t('home.detail.by')}</em>
          <span className={styles.detailLast}>{t('home.detail.last')}</span>
        </h2>
        <div className={styles.detailCopy}>
          <p className={styles.detailBody}>
            {t('home.detail.body')}
            <br />
            {t('home.detail.bodyMore')}
            <br />
            {t('home.detail.bodyLast', { store: store.name })}
          </p>
          <Link href="/about/" className={styles.inkLink}>
            {t('home.detail.more', { store: store.name })}
            <Arrow />
          </Link>
        </div>
      </div>
    </section>
  )
}

export const HomePage = () => {
  const { store, t } = useStorefront()
  // `first: 20` matches the header's request, so both share one answer.
  const { collections, status } = useCollections({ first: 20 })
  const scent = collections.find(isScent)
  const featured = collections.find((c) => c !== scent)
  return (
    <Layout>
      <Hero collections={collections} />
      <section className={styles.edit}>
        <div className={cx(styles.container, styles.editInner)}>
          <div className={styles.editAside}>
            <p className={styles.lineEyebrow}>{t('home.edit.eyebrow', { store: store.name })}</p>
            <svg className={styles.quoteMark} viewBox="0 0 48 40" aria-hidden="true" focusable="false">
              <path d="M20 4C10 8 4 16 4 26c0 6 4 10 9 10s8-4 8-8-3-8-8-8c-1 0-2 0-2 .2C12 14 16 9 22 6zM44 4c-10 4-16 12-16 22 0 6 4 10 9 10s8-4 8-8-3-8-8-8c-1 0-2 0-2 .2C36 14 40 9 46 6z" />
            </svg>
          </div>
          <div className={styles.editMain}>
            <h2 className={styles.editTitle}>
              {t('home.edit.title')}
              <em className={styles.editAccent}>{t('home.edit.accent')}</em>
            </h2>
            <div className={styles.editFoot}>
              <p className={styles.editBody}>{t('home.edit.body', { store: store.name })}</p>
              <Link href="/about/" className={styles.inkLink}>
                {t('home.edit.more', { store: store.name })}
                <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Categories collections={collections} busy={status === 'loading'} />
      <Featured collection={featured} />
      <Arrivals />
      <Campaign />
      <Scents collection={scent} />
      <Detail />
      <Newsletter />
    </Layout>
  )
}
