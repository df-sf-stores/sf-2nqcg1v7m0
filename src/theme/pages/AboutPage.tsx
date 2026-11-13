import { Link, ThemeImage, useStorefront } from '@dripfunnel/storefront-core/theme'
import { Layout } from '../components/Layout'
import { PageHero } from '../components/PageHero'
import styles from '../styles/about.module.css'

const Arrow = () => (
  <svg className={styles.arrow} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const AboutPage = () => {
  const { store, t } = useStorefront()
  const address = store.address ? [store.address.street, store.address.city, store.address.region, store.address.postal].filter(Boolean).join(', ') : ''
  const whatsapp = store.social.find((s) => s.network === 'whatsapp')
  const visit = address || store.contactPhone || store.contactEmail
  const values = [
    { key: 'designs', title: t('pages.about.promise.designs.title'), body: t('pages.about.promise.designs.body') },
    { key: 'quality', title: t('pages.about.promise.quality.title'), body: t('pages.about.promise.quality.body') },
    { key: 'service', title: t('pages.about.promise.service.title'), body: t('pages.about.promise.service.body') },
  ]
  return (
    <Layout>
      <PageHero title={t('pages.about.title', { store: store.name })} lead={t('pages.about.lead', { store: store.name })} crumbs={[{ label: t('common.nav.about'), href: '/about/' }]} ghost={t('pages.about.eyebrow')} />
      <section className={styles.story}>
        <div className={styles.storyPicture}>
          <ThemeImage src="featured.webp" alt="" ratio={0.8} sizes="(min-width: 900px) 520px, 100vw" className={styles.cover} />
        </div>
        <div className={styles.storyCopy}>
          <p className={styles.eyebrow}>{t('pages.about.story.eyebrow')}</p>
          <h2 className={styles.heading}>
            {t('pages.about.story.title')} <em className={styles.accent}>{t('pages.about.story.accent')}</em>
          </h2>
          <p className={styles.lead}>{t('pages.about.story.first', { store: store.name })}</p>
          <p className={styles.body}>{t('pages.about.story.second')}</p>
          <Link href="/collections/all/" className={styles.inkLink}>
            {t('pages.about.shop')}
            <Arrow />
          </Link>
        </div>
      </section>
      <section className={styles.promise}>
        <div className={styles.promiseInner}>
          <div className={styles.promiseHead}>
            <p className={styles.eyebrow}>{t('pages.about.promise.eyebrow')}</p>
            <h2 className={styles.promiseTitle}>{t('pages.about.promise.title')}</h2>
            <p className={styles.promiseBody}>{t('pages.about.promise.body')}</p>
          </div>
          <ol className={styles.values}>
            {values.map((v) => (
              <li key={v.key} className={styles.value}>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueBody}>{v.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      {visit ? (
        <section className={styles.visit}>
          <p className={styles.eyebrow}>{t('pages.about.visit.title')}</p>
          <p className={styles.visitName}>{store.name}</p>
          {address ? <p className={styles.visitLine}>{address}</p> : null}
          {store.contactPhone ? <p className={styles.visitLine}>{store.contactPhone}</p> : null}
          {store.contactEmail ? <p className={styles.visitLine}>{store.contactEmail}</p> : null}
          {whatsapp ? (
            <Link href={whatsapp.url} className={styles.inkLink}>
              {t('pages.about.visit.whatsapp')}
              <Arrow />
            </Link>
          ) : null}
        </section>
      ) : null}
      <section className={styles.closing}>
        <div className={styles.closingPicture}>
          <ThemeImage src="campaign.webp" alt="" ratio={16 / 9} sizes="100vw" className={styles.cover} />
        </div>
        <span className={styles.closingShade} aria-hidden="true" />
        <div className={styles.closingCopy}>
          <p className={styles.closingText}>{t('pages.about.closing', { store: store.name })}</p>
          <Link href="/collections/all/" className={styles.ghostButton}>
            {t('pages.about.discover')}
            <Arrow />
          </Link>
        </div>
      </section>
    </Layout>
  )
}
