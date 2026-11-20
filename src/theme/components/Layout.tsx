import type { ReactNode } from 'react'
import { ConsentBanner, Link, PoweredBy, PreviewBanner, StoreLogo, ThemeImage, useCart, useCollections, useMenu, useStorefront, useWishlist } from '@dripfunnel/storefront-core/theme'
import { HeaderSearch } from './interactive/HeaderSearch'
import { SiteNav, type NavEntry } from './interactive/SiteNav'
import { WishlistProvider } from './interactive/SharedWishlist'
import { cx } from './cx'
import { storeName } from './storeName'
import { tidyName } from './tidyName'
import styles from '../styles/layout.module.css'

type FooterLink = { href: string; label: string }

/** The DripFunnel logo is 845 × 143 px. */
const poweredRatio = 845 / 143

/** A social network's outline icon; any other network shows its name. */
const SocialIcon = ({ network }: { network: string }) => {
  if (network === 'instagram')
    return (
      <svg className={styles.socialIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.6" />
      </svg>
    )
  if (network === 'facebook')
    return (
      <svg className={styles.socialIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M14 8h3V4.5h-3c-2.2 0-3.8 1.7-3.8 3.9V11H8v3.5h2.2V21h3.5v-6.5h2.8L17 11h-3.3V8.6c0-.4.3-.6.6-.6z" />
      </svg>
    )
  if (network === 'youtube')
    return (
      <svg className={styles.socialIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
        <path d="M10 9.2v5.6l4.8-2.8z" />
      </svg>
    )
  if (network === 'x')
    return (
      <svg className={styles.socialIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 4l16 16M20 4L4 20" />
      </svg>
    )
  return <span className={styles.socialWord}>{network.slice(0, 2)}</span>
}

export const Layout = ({ children }: { children: ReactNode }) => {
  const { store, t, mode, poweredBy } = useStorefront()
  const menu = useMenu()
  // `first: 20` matches the home page's request, so both share one answer.
  const { collections: fetched, status } = useCollections({ first: 20 })
  const collections = status === 'ready' ? fetched : []
  const { count } = useCart()
  // One wishlist for the page: the header count here, and every heart below through WishlistProvider.
  const wishlist = useWishlist()
  const wished = wishlist.count
  const whatsapp = store.social.find((s) => s.network === 'whatsapp')
  const social = store.social.filter((s) => s.network !== 'whatsapp')
  // The merchant's menu leads the header; a store without one shows its collections.
  const entries: NavEntry[] = menu.items.length
    ? menu.items.map((item) => ({ id: item.id, label: item.label, href: item.href, children: item.children.map((c) => ({ id: c.id, label: c.label, href: c.href })) }))
    : collections.map((c) => ({ id: c.id, label: tidyName(c.name), href: c.href, children: [] }))
  // The footer's shop links: every collection the admin shows on the store (core leaves hidden ones out), then Shop All.
  // A collection of the store's own at /collections/all/ is left to the Shop All link, so no address is listed twice.
  const shopLinks: FooterLink[] = [
    ...collections.filter((c) => c.href !== '/collections/all/').map((c) => ({ href: c.href, label: tidyName(c.name) })),
    { href: '/collections/all/', label: t('common.footer.all') },
  ]
  const infoLinks: FooterLink[] = [
    { href: '/contact/', label: t('common.nav.contact') },
    { href: '/policies/privacy/', label: t('common.footer.privacy') },
    { href: '/policies/terms/', label: t('common.footer.terms') },
  ]
  // The store's Site settings lead; the company's registered details fill in what they leave blank.
  const place = [store.address?.city, store.address?.region].filter((part): part is string => Boolean(part)).join(', ') || t('company.place')
  // The contact email only from Site settings: written in content it would repeat the shop name, which the build refuses.
  const email = store.contactEmail ?? null
  const name = storeName(store.name)
  const contactPhone = t('company.contact.phone')
  return (
    <WishlistProvider value={wishlist}>
    <div className={styles.shell}>
      {mode === 'live' ? null : <PreviewBanner t={t} className={styles.preview} />}
      <header className={styles.header}>
        <div className={styles.bar}>
          <Link href="/" className={styles.brand}>
            <StoreLogo className={styles.logo} />
          </Link>
          <SiteNav items={entries} collections={collections} />
          <div className={styles.tools}>
            <HeaderSearch className={styles.tool} />
            <span className={styles.language}>
              <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="12" cy="12" r="8.5" />
                <path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.2 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.2-3.6-8.5s1.2-6.2 3.6-8.5z" />
              </svg>
              {t('common.tools.language')}
            </span>
            <Link href="/account/" className={styles.tool}>
              <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="12" cy="8" r="3.6" />
                <path d="M5 20c1.1-3.5 3.8-5.3 7-5.3s5.9 1.8 7 5.3" />
              </svg>
              <span className={styles.hidden}>{t('common.tools.account')}</span>
            </Link>
            <Link href="/account/wishlist/" className={styles.tool}>
              <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7.3a4.3 4.3 0 017.5 2.5C19.5 15.4 12 20 12 20z" />
              </svg>
              <span className={styles.hidden}>{wished > 0 ? t('common.tools.wishlistCount', { count: wished }) : t('common.tools.wishlist')}</span>
              {wished > 0 ? (
                <span className={styles.count} aria-hidden="true">
                  {wished}
                </span>
              ) : null}
            </Link>
            <Link href="/cart/" className={styles.tool}>
              <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M5.5 8h13l-1 12h-11z" />
                <path d="M9 10V6.5a3 3 0 016 0V10" />
              </svg>
              <span className={styles.hidden}>{count > 0 ? t('common.tools.cartCount', { count }) : t('common.tools.cart')}</span>
              {count > 0 ? (
                <span className={styles.count} aria-hidden="true">
                  {count}
                </span>
              ) : null}
            </Link>
          </div>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <p className={styles.watermark} aria-hidden="true">
          {store.name}
        </p>
        <div className={styles.footerInner}>
          <div className={styles.columns}>
            <div className={styles.about}>
              <Link href="/" className={styles.footerBrand}>
                <StoreLogo className={styles.footerLogo} />
              </Link>
              <span className={styles.footerRule} aria-hidden="true" />
              <p className={styles.note}>{store.tagline || store.description || t('common.footer.note')}</p>
              {social.length ? (
                <div className={styles.social}>
                  {social.map((s) => (
                    <Link key={s.network} href={s.url} className={styles.socialLink}>
                      <SocialIcon network={s.network} />
                      <span className={styles.hidden}>{t('common.footer.follow', { network: s.network })}</span>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            <nav className={styles.links} aria-label={t('common.footer.shop')}>
              <h2 className={styles.heading}>{t('common.footer.shop')}</h2>
              {/* A long list of collections runs in two columns rather than one tall one. */}
              <ul className={cx(styles.linkList, shopLinks.length > 7 && styles.linkListSplit)}>
                {shopLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.footerLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav className={styles.links} aria-label={t('common.footer.information')}>
              <h2 className={styles.heading}>{t('common.footer.information')}</h2>
              <ul className={styles.linkList}>
                {infoLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.footerLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav className={styles.links} aria-label={t('common.footer.contactUs')}>
              <h2 className={styles.heading}>{t('common.footer.contactUs')}</h2>
              <ul className={styles.linkList}>
                <li>
                  <Link href={t('company.contact.tel')} className={styles.footerLink}>
                    {t('common.footer.contactLine', { name, phone: contactPhone })}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <ul className={styles.company}>
            <li className={cx(styles.companyItem, styles.companyName)}>{t('company.name')}</li>
            <li className={styles.companyItem}>{place}</li>
            {email ? <li className={styles.companyItem}>{email}</li> : null}
            {store.contactPhone ? <li className={styles.companyItem}>{store.contactPhone}</li> : null}
          </ul>
        </div>
        <div className={styles.base}>
          <div className={styles.baseInner}>
            <p className={styles.copyright}>{t('common.footer.rights', { store: name })}</p>
            {/* Core's sealed "Powered by" line stands in for the words whenever the platform names its brand. */}
            <div className={styles.poweredRow}>
              {poweredBy ? <PoweredBy brand={poweredBy} t={t} className={styles.powered} /> : <span className={styles.poweredWords}>{t('common.footer.powered')}</span>}
              <Link href={t('common.footer.poweredHref')} className={styles.poweredLink}>
                <ThemeImage src="Dripfunnel-logo.png" alt={t('common.footer.poweredLogo')} ratio={poweredRatio} sizes="124px" className={styles.poweredLogo} />
              </Link>
            </div>
          </div>
        </div>
      </footer>
      {whatsapp ? (
        <Link href={whatsapp.url} className={styles.whatsapp}>
          <svg className={styles.whatsappIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M12 3a9 9 0 00-7.8 13.5L3 21l4.6-1.2A9 9 0 1012 3zm4.4 12.4c-.2.5-1.1 1-1.6 1-.4.1-.9.1-1.5-.1a13 13 0 01-1.4-.5 10.6 10.6 0 01-4-3.6 4.6 4.6 0 01-1-2.4c0-1.2.6-1.7.8-2 .2-.2.5-.3.6-.3h.5c.1 0 .4 0 .6.4l.8 1.9c.1.1.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 1.9 1 .9 1.9 1.2 2.2 1.3.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.2.1.7-.1 1.3z" />
          </svg>
          <span className={styles.hidden}>{t('common.footer.whatsapp')}</span>
        </Link>
      ) : null}
      <ConsentBanner t={t} className={styles.consent} />
    </div>
    </WishlistProvider>
  )
}
