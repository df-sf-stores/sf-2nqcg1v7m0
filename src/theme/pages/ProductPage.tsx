import { Breadcrumbs, LegalNotices, Link, Price, ProductStory, RichText, SizeChart, useProduct, useProducts, useStorefront } from '@dripfunnel/storefront-core/theme'
import { BuyButtons } from '../components/interactive/BuyButtons'
import { Gallery } from '../components/interactive/Gallery'
import { Options } from '../components/interactive/Options'
import { Retry } from '../components/interactive/Retry'
import { Layout } from '../components/Layout'
import { Notice } from '../components/Notice'
import { ProductGrid } from '../components/ProductCard'
import shop from '../styles/shop.module.css'
import story from '../styles/aplus.module.css'
import styles from '../styles/product.module.css'

export const ProductPage = () => {
  const { store, locale, t } = useStorefront()
  const page = useProduct()
  const product = page.product
  // A product the merchant linked to none still shows others: the store's newest, this one left out.
  const newest = useProducts({ sort: 'newest', first: 9 })
  if (page.status === 'missing' || page.status === 'error' || !product) {
    return (
      <Layout>
        <section className={shop.page}>
          {page.status === 'missing' ? (
            <Notice main title={t('shop.product.missing')} lead={t('shop.product.missingLead')}>
              <Link href="/collections/all/" className={shop.primary}>
                {t('shop.collection.browse')}
              </Link>
            </Notice>
          ) : page.status === 'error' ? (
            <Notice main title={t('shop.product.failed')} lead={t('shop.listing.failedLead')}>
              <Retry label={t('shop.listing.retry')} onRetry={page.retry} />
            </Notice>
          ) : (
            <div className={styles.product} aria-busy="true">
              <div className={styles.noPicture} />
              <div className={styles.info}>
                <h1 className={styles.loadingTitle}>{t('shop.product.loading')}</h1>
              </div>
            </div>
          )}
        </section>
      </Layout>
    )
  }
  const firstMissing = page.missing[0]
  const related = (product.related.length ? product.related : newest.products.filter((p) => p.href !== product.href)).slice(0, 4)
  const specs = product.specs.filter((s) => s.versionId === null || s.versionId === page.version?.id)
  return (
    <Layout>
      <section className={shop.page}>
        <Breadcrumbs crumbs={[{ label: t('shop.crumbs.home'), href: '/' }, { label: product.name, href: product.href }]} t={t} className={shop.crumbs} />
        <div className={styles.product}>
          <Gallery photos={page.photos} video={product.video} name={product.name} />
          <div className={styles.info}>
            {product.badges[0] ? <span className={styles.badge}>{product.badges[0].label}</span> : null}
            <h1 className={styles.title}>{product.name}</h1>
            {page.price ? (
              <p className={styles.price}>
                {page.from ? <span className={styles.from}>{t('shop.card.from')}</span> : null}
                <Price money={page.price} compareAt={page.compareAt} includesTax={store.pricesIncludeTax} locale={locale} t={t} className={styles.priceTag} />
              </p>
            ) : null}
            <Options page={page} />
            <SizeChart chart={product.sizeChart} className={styles.sizeLink} />
            <p className={styles.stock} role="status">
              {firstMissing ? t('shop.product.choose', { option: firstMissing.name }) : page.stock?.inStock ? t('shop.product.inStock') : t('shop.product.outOfStock')}
            </p>
            <BuyButtons page={page} />
            {product.highlights.length ? (
              <ul className={styles.highlights}>
                {product.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            ) : null}
            <LegalNotices notices={product.legal} t={t} className={styles.legal} />
            <div className={styles.sections}>
              {product.description ? (
                <section className={styles.section} aria-labelledby="product-description">
                  <h2 id="product-description" className={styles.sectionTitle}>
                    {t('shop.product.description')}
                  </h2>
                  <RichText html={product.description} className={styles.description} />
                </section>
              ) : null}
              {specs.length ? (
                <details className={styles.section}>
                  <summary className={styles.summary}>{t('shop.product.specs')}</summary>
                  <dl className={styles.specs}>
                    {specs.map((s) => (
                      <div key={`${s.name}-${s.versionId ?? ''}`} className={styles.spec}>
                        <dt>{s.name}</dt>
                        <dd>{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </details>
              ) : null}
              {product.returns || product.warranty ? (
                <details className={styles.section}>
                  <summary className={styles.summary}>{t('shop.product.delivery')}</summary>
                  {product.returns ? <p className={styles.body}>{product.returns}</p> : null}
                  {product.warranty ? (
                    <p className={styles.body}>
                      <strong>{t('shop.product.warranty')}</strong> {product.warranty}
                    </p>
                  ) : null}
                </details>
              ) : null}
              {product.faqs.length ? (
                <details className={styles.section}>
                  <summary className={styles.summary}>{t('shop.product.questions')}</summary>
                  <dl className={styles.specs}>
                    {product.faqs.map((f) => (
                      <div key={f.question} className={styles.faq}>
                        <dt>{f.question}</dt>
                        <dd>{f.answer}</dd>
                      </div>
                    ))}
                  </dl>
                </details>
              ) : null}
            </div>
          </div>
        </div>
        <ul className={styles.service}>
          <li>
            <Link href="/policies/shipping/" className={styles.serviceLink}>
              <svg className={styles.serviceIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7M7.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              {t('shop.product.care.shipping')}
            </Link>
          </li>
          <li>
            <Link href="/policies/returns/" className={styles.serviceLink}>
              <svg className={styles.serviceIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4" />
              </svg>
              {t('shop.product.care.returns')}
            </Link>
          </li>
          <li>
            <Link href="/policies/privacy/" className={styles.serviceLink}>
              <svg className={styles.serviceIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 3l7 3v5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6zM9 12l2 2 4-4" />
              </svg>
              {t('shop.product.care.secure')}
            </Link>
          </li>
          <li>
            <Link href="/contact/" className={styles.serviceLink}>
              <svg className={styles.serviceIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M4 5h16v11H8l-4 4z" />
              </svg>
              {t('shop.product.care.help')}
            </Link>
          </li>
        </ul>
        <ProductStory product={product} versionId={page.version?.id ?? null} className={story.aplus} classes={story} />
        {related.length ? (
          <section className={styles.related}>
            <div className={styles.relatedHead}>
              <p className={shop.eyebrow}>{t('shop.product.relatedEyebrow')}</p>
              <h2 className={shop.heading}>{t('shop.product.related')}</h2>
            </div>
            <ProductGrid products={related} wide />
          </section>
        ) : null}
      </section>
    </Layout>
  )
}
