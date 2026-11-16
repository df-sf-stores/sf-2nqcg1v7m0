import { Link, useStorefront } from '@dripfunnel/storefront-core/theme'
import { Layout } from '../components/Layout'
import { PageHero } from '../components/PageHero'
import styles from '../styles/about.module.css'

const Arrow = () => (
  <svg className={styles.arrow} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

type Detail = { key: string; term: string; value: string }

/** The store's own ways to reach it, from its settings; a way the store has not filled in is left out, never made up. */
export const ContactPage = () => {
  const { store, t } = useStorefront()
  const place = [store.address?.street, store.address?.city, store.address?.region, store.address?.postal].filter(Boolean).join(', ')
  const details = [
    store.contactEmail ? { key: 'email', term: t('pages.contact.email'), value: store.contactEmail } : null,
    store.contactPhone ? { key: 'phone', term: t('pages.contact.phone'), value: store.contactPhone } : null,
    place ? { key: 'visit', term: t('pages.contact.visit'), value: place } : null,
  ].filter((d): d is Detail => d !== null)
  return (
    <Layout>
      <PageHero title={t('pages.contact.title')} lead={t('pages.contact.lead')} crumbs={[{ label: t('common.nav.contact'), href: '/contact/' }]} ghost={t('common.nav.contact')} />
      <section className={styles.contactGrid}>
        <div className={styles.contactMain}>
          <p className={styles.eyebrow}>{t('pages.contact.reach', { store: store.name })}</p>
          {details.length ? (
            <dl className={styles.details}>
              {details.map((d) => (
                <div key={d.key} className={styles.detailRow}>
                  <dt className={styles.term}>{d.term}</dt>
                  <dd className={styles.value}>{d.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {store.social.length ? (
            <div className={styles.follow}>
              <p className={styles.term}>{t('pages.contact.follow')}</p>
              <ul className={styles.followList}>
                {store.social.map((s) => (
                  <li key={s.network}>
                    <Link href={s.url} className={styles.followLink}>
                      {s.network}
                      <Arrow />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <aside className={styles.helpCard}>
          <p className={styles.helpEyebrow}>{t('pages.contact.helpEyebrow')}</p>
          <h2 className={styles.helpTitle}>{t('pages.contact.helpTitle')}</h2>
          <ul className={styles.helpList}>
            <li>
              <Link href="/account/orders/" className={styles.helpLink}>
                {t('common.footer.orders')}
                <Arrow />
              </Link>
            </li>
            <li>
              <Link href="/help/" className={styles.helpLink}>
                {t('common.footer.faq')}
                <Arrow />
              </Link>
            </li>
            <li>
              <Link href="/policies/shipping/" className={styles.helpLink}>
                {t('common.footer.shipping')}
                <Arrow />
              </Link>
            </li>
            <li>
              <Link href="/policies/returns/" className={styles.helpLink}>
                {t('common.footer.returns')}
                <Arrow />
              </Link>
            </li>
          </ul>
        </aside>
      </section>
    </Layout>
  )
}
