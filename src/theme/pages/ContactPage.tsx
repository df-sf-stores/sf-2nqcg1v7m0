import { Breadcrumbs, Link, useStorefront } from '@dripfunnel/storefront-core/theme'
import { Layout } from '../components/Layout'
import { ContactForm } from '../components/interactive/ContactForm'
import { storeName } from '../components/storeName'
import styles from '../styles/contact.module.css'

/**
 * Contact: an ivory page with the ways to reach the store on the left and the message form on the right.
 * The store's Site settings lead; the company's registered details in content fill in what they leave blank.
 */
export const ContactPage = () => {
  const { store, t } = useStorefront()
  const name = storeName(store.name)
  // The contact email only from Site settings: written in content it would repeat the shop name, which the build refuses.
  const email = store.contactEmail ?? null
  const place = [store.address?.street, store.address?.city, store.address?.region, store.address?.postal].filter(Boolean).join(', ') || t('company.place')
  return (
    <Layout>
      <div className={styles.page}>
        <header className={styles.hero}>
          <Breadcrumbs crumbs={[{ label: t('shop.crumbs.home'), href: '/' }, { label: t('common.nav.contact'), href: '/contact/' }]} t={t} className={styles.crumbs} />
          <p className={styles.eyebrow}>{t('pages.contact.eyebrow')}</p>
          <h1 className={styles.title}>{t('pages.contact.heading', { store: name })}</h1>
          <p className={styles.lead}>{t('pages.contact.intro')}</p>
        </header>
        <div className={styles.grid}>
          <section className={styles.info} aria-labelledby="contact-info">
            <p className={styles.eyebrow}>{t('pages.contact.infoEyebrow')}</p>
            <h2 id="contact-info" className={styles.heading}>
              {t('pages.contact.infoTitle')}
            </h2>
            <p className={styles.body}>{t('pages.contact.infoLead')}</p>
            <dl className={styles.details}>
              {email ? (
                <div className={styles.detail}>
                  <dt className={styles.term}>{t('pages.contact.email')}</dt>
                  <dd className={styles.email}>{email}</dd>
                </div>
              ) : null}
              {store.contactPhone ? (
                <div className={styles.detail}>
                  <dt className={styles.term}>{t('pages.contact.phone')}</dt>
                  <dd className={styles.email}>{store.contactPhone}</dd>
                </div>
              ) : null}
              <div className={styles.detail}>
                <dt className={styles.term}>{t('pages.contact.office')}</dt>
                <dd className={styles.company}>{t('company.name')}</dd>
                <dd className={styles.body}>{place}</dd>
              </div>
            </dl>
            <p className={styles.note}>
              {t('pages.contact.orderNote')}{' '}
              <Link href="/account/orders/" className={styles.noteLink}>
                {t('pages.contact.orderLink')}
              </Link>
              .
            </p>
          </section>
          <section className={styles.formSide} aria-labelledby="contact-form">
            <h2 id="contact-form" className={styles.eyebrow}>
              {t('pages.contact.form.eyebrow')}
            </h2>
            <ContactForm email={email} />
          </section>
        </div>
      </div>
    </Layout>
  )
}
