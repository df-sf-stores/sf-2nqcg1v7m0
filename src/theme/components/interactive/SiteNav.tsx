'use client'

import { useState, type KeyboardEvent } from 'react'
import { Link, ThemeImage, useStorefront, type CollectionCard } from '@dripfunnel/storefront-core/theme'
import { CollectionPicture } from '../CollectionPicture'
import { cx } from '../cx'
import { tidyName } from '../tidyName'
import styles from '../../styles/menu.module.css'

export type NavLink = { id: string; label: string; href: string }
export type NavEntry = NavLink & { children: NavLink[] }

const allCollections = 'all-collections'

const Arrow = () => (
  <svg className={styles.arrow} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

const Chevron = ({ open }: { open: boolean }) => (
  <svg className={cx(styles.chevron, open && styles.chevronOpen)} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M6 9l6 6 6-6" />
  </svg>
)

/**
 * The header's navigation: on wide screens a centred row whose items each open a mega panel of the store's collections,
 * on narrow ones a menu button and a drawer. Items are the merchant's menu, or the store's collections when it has none.
 */
export const SiteNav = ({ items, collections }: { items: NavEntry[]; collections: readonly CollectionCard[] }) => {
  const { store, t } = useStorefront()
  const [open, setOpen] = useState<string | null>(null)
  const [drawer, setDrawer] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const entries: NavEntry[] = [...items, { id: allCollections, label: t('common.nav.collections'), href: '/collections/all/', children: [] }]
  const current = entries.find((e) => e.id === open) ?? null
  const feature = current ? collections.find((c) => c.href === current.href) : undefined
  const escape = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Escape') return
    setOpen(null)
    setDrawer(false)
  }
  return (
    <div className={styles.nav} onKeyDown={escape} onPointerLeave={() => setOpen(null)}>
      <button type="button" className={styles.burger} aria-expanded={drawer} aria-controls="site-drawer" onClick={() => setDrawer(!drawer)}>
        <svg className={styles.burgerIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d={drawer ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h10'} />
        </svg>
        <span className={styles.hidden}>{t('common.nav.menu')}</span>
      </button>

      <nav className={styles.row} aria-label={t('common.nav.label')}>
        <ul className={styles.rowList}>
          {entries.map((entry) => (
            <li key={entry.id} className={styles.rowItem} onPointerEnter={() => setOpen(entry.id)}>
              <Link href={entry.href} className={cx(styles.rowLink, open === entry.id && styles.rowLinkOn)}>
                {entry.label}
              </Link>
              <button type="button" className={styles.rowToggle} aria-expanded={open === entry.id} aria-label={t('common.nav.submenu', { item: entry.label })} onClick={() => setOpen(open === entry.id ? null : entry.id)}>
                <Chevron open={open === entry.id} />
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {current ? (
        <div className={styles.mega}>
          <div className={styles.megaHead}>
            <div>
              <p className={styles.eyebrow}>{t('common.mega.eyebrow', { store: store.name })}</p>
              <p className={styles.megaTitle}>{t('common.mega.title')}</p>
              <p className={styles.megaLead}>{t('common.mega.lead', { store: store.name })}</p>
            </div>
            <Link href="/collections/all/" className={styles.megaAll}>
              {t('common.nav.shopAll')}
              <Arrow />
            </Link>
          </div>
          {collections.length ? (
            <ul className={styles.tiles}>
              {collections.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <Link href={c.href} className={styles.tile}>
                    <CollectionPicture collection={c} ratio={1.6} width={220} className={styles.tileImage} />
                    <span className={styles.tileShade} />
                    <span className={styles.tileName}>{tidyName(c.name)}</span>
                    <Arrow />
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          <div className={styles.megaBody}>
            <div className={styles.megaLinks}>
              <div className={styles.megaLinksHead}>
                <p className={styles.megaSub}>{current.id === allCollections ? t('common.mega.browse') : current.label}</p>
                {current.id === allCollections ? null : (
                  <Link href={current.href} className={styles.megaMore}>
                    {t('common.mega.viewAll')}
                    <Arrow />
                  </Link>
                )}
              </div>
              <ul className={styles.megaList}>
                {(current.id === allCollections ? collections.map((c) => ({ id: c.id, label: tidyName(c.name), href: c.href })) : current.children.length ? current.children : entries.filter((e) => e.id !== allCollections && e.id !== current.id)).map((link) => (
                  <li key={link.id}>
                    <Link href={link.href} className={styles.megaLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Link href={current.href} className={styles.feature}>
              {feature ? <CollectionPicture collection={feature} ratio={2.4} width={420} className={styles.featureImage} /> : <ThemeImage src="hero.webp" alt="" ratio={2.4} sizes="420px" className={styles.featureImage} />}
              <span className={styles.featureShade} />
              <span className={styles.featureCopy}>
                <span className={styles.featureEyebrow}>{t('common.mega.featureEyebrow')}</span>
                <span className={styles.featureTitle}>{feature ? tidyName(feature.name) : t('common.mega.featureTitle')}</span>
                <span className={styles.featureCta}>
                  {feature ? t('common.mega.shop', { name: tidyName(feature.name) }) : t('common.mega.featureCta', { store: store.name })}
                  <Arrow />
                </span>
              </span>
            </Link>
          </div>
        </div>
      ) : null}

      <div id="site-drawer" className={cx(styles.drawer, drawer && styles.drawerOpen)} hidden={!drawer}>
        <nav aria-label={t('common.nav.menu')}>
          <ul className={styles.drawerList}>
            <li>
              <Link href="/" className={styles.drawerLink}>
                {t('common.nav.home')}
              </Link>
            </li>
            {entries.map((entry) => {
              const links = entry.id === allCollections ? collections.map((c) => ({ id: c.id, label: tidyName(c.name), href: c.href })) : entry.children
              return (
                <li key={entry.id}>
                  <div className={styles.drawerRow}>
                    <Link href={entry.href} className={styles.drawerLink}>
                      {entry.label}
                    </Link>
                    {links.length ? (
                      <button type="button" className={styles.drawerToggle} aria-expanded={expanded === entry.id} aria-label={t('common.nav.submenu', { item: entry.label })} onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}>
                        <Chevron open={expanded === entry.id} />
                      </button>
                    ) : null}
                  </div>
                  {links.length && expanded === entry.id ? (
                    <ul className={styles.drawerSub}>
                      {links.map((link) => (
                        <li key={link.id}>
                          <Link href={link.href} className={styles.drawerSubLink}>
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              )
            })}
          </ul>
          <ul className={styles.drawerTools}>
            <li>
              <Link href="/account/" className={styles.drawerTool}>
                {t('common.tools.account')}
              </Link>
            </li>
            <li>
              <Link href="/account/wishlist/" className={styles.drawerTool}>
                {t('common.tools.wishlist')}
              </Link>
            </li>
            <li>
              <Link href="/cart/" className={styles.drawerTool}>
                {t('common.tools.cart')}
              </Link>
            </li>
            <li>
              <Link href="/contact/" className={styles.drawerTool}>
                {t('common.nav.contact')}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
