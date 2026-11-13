import { useListing, useSearch, useStorefront } from '@dripfunnel/storefront-core/theme'
import { Layout } from '../components/Layout'
import { ListingResults } from '../components/ListingResults'
import { PageHero } from '../components/PageHero'
import styles from '../styles/shop.module.css'

/** Search, as the reference's: with words, the products that match them; without, every product in the shop. */
export const SearchPage = () => {
  const { t } = useStorefront()
  const search = useSearch()
  const browsing = !search.query
  const all = useListing({ collection: null }, browsing)
  return (
    <Layout>
      <PageHero title={t('shop.search.title')} lead={search.query ? t('shop.search.results', { query: search.query }) : t('shop.search.lead')} crumbs={[{ label: t('shop.search.crumb'), href: '/search/' }]} ghost={t('shop.search.crumb')} />
      <div className={styles.band}>
        <section className={styles.page}>
          <ListingResults listing={browsing ? all : search} />
        </section>
      </div>
    </Layout>
  )
}
