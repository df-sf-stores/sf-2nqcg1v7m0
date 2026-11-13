import { Link, useCollection, useStorefront } from '@dripfunnel/storefront-core/theme'
import { Layout } from '../components/Layout'
import { ListingResults } from '../components/ListingResults'
import { Notice } from '../components/Notice'
import { PageHero } from '../components/PageHero'
import { Retry } from '../components/interactive/Retry'
import { tidyName } from '../components/tidyName'
import styles from '../styles/shop.module.css'

export const CollectionPage = () => {
  const { t } = useStorefront()
  const page = useCollection()
  const name = page.collection ? tidyName(page.collection.name) : (page.all ? t('shop.collection.all') : null)
  const lead = page.collection ? page.collection.description : page.all ? t('shop.collection.allLead') : null
  const found = page.found !== 'missing' && page.found !== 'error'
  return (
    <Layout>
      {found ? <PageHero title={name ?? t('shop.collection.loading')} lead={lead} crumbs={name ? [{ label: name, href: page.collection?.href ?? '/collections/all/' }] : []} /> : null}
      <div className={styles.band}>
      <section className={styles.page}>
        {page.found === 'missing' ? (
          <Notice main title={t('shop.collection.missing')} lead={t('shop.collection.missingLead')}>
            <Link href="/collections/all/" className={styles.primary}>
              {t('shop.collection.browse')}
            </Link>
          </Notice>
        ) : page.found === 'error' ? (
          <Notice main title={t('shop.listing.failed')} lead={t('shop.listing.failedLead')}>
            <Retry label={t('shop.listing.retry')} onRetry={page.retry} />
          </Notice>
        ) : (
          <ListingResults listing={page} />
        )}
      </section>
      </div>
    </Layout>
  )
}
