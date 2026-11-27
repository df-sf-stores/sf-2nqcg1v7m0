'use client'

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { Link, ThemeImage, useStorefront, type CollectionCard } from '@dripfunnel/storefront-core/theme'
import { CollectionPicture } from '../CollectionPicture'
import { cx } from '../cx'
import { tidyName } from '../tidyName'
import styles from '../../styles/menu.module.css'

export type NavLink = { id: string; label: string; href: string }
export type NavEntry = NavLink & { children: NavLink[] }

const allCollections = 'all-collections'
const home = 'home'
/** How long the Collections panel waits before closing once the pointer leaves, so crossing a small gap doesn't flicker it shut. */
const closeDelay = 200
/** After Home and Collections, these collections lead in this order; any other menu item follows in the admin's order. */
const leading = ['/collections/fragrance/', '/collections/t-shirts/']
const rank = (href: string) => {
  const at = leading.indexOf(href)
  return at === -1 ? leading.length : at
}

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
 * The header's navigation: on wide screens a centred row where Collections opens one mega panel of the store's collections
 * (the same panel from every page; the other items are plain links), on narrow ones a menu button and a drawer.
 * Items are the merchant's menu, or the store's collections when it has none.
 */
export const SiteNav = ({ items, collections }: { items: NavEntry[]; collections: readonly CollectionCard[] }) => {
  const { store, t } = useStorefront()
  // Whether the Collections panel is open. Only Collections opens it, so its content never depends on another item.
  const [open, setOpen] = useState(false)
  const closing = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hold = () => {
    if (closing.current) clearTimeout(closing.current)
    closing.current = null
  }
  const show = () => {
    hold()
    setOpen(true)
  }
  const hide = () => {
    hold()
    setOpen(false)
  }
  const hideSoon = () => {
    hold()
    closing.current = setTimeout(() => setOpen(false), closeDelay)
  }
  useEffect(() => hold, [])
  // Hover is a mouse's: a touch on a wide screen follows the link it taps, as the drawer's links do.
  const onlyMouse = (then: () => void) => (event: PointerEvent) => {
    if (event.pointerType === 'mouse') then()
  }
  const [drawer, setDrawer] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  // A menu item for the home page or Shop All is left out: Home leads already, and Shop All stays reachable from Collections.
  const ordered = items.filter((item) => item.href !== '/' && item.href !== '/collections/all/').toSorted((a, b) => rank(a.href) - rank(b.href))
  const entries: NavEntry[] = [
    { id: home, label: t('common.nav.home'), href: '/', children: [] },
    { id: allCollections, label: t('common.nav.collections'), href: '/collections/all/', children: [] },
    ...ordered,
  ]
  // Following any drawer link closes the drawer, so it doesn't stay open over the page it leads to.
  const closeDrawer = () => {
    setDrawer(false)
    setExpanded(null)
  }
  const escape = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Escape') return
    hide()
    setDrawer(false)
  }
  return (
    <div className={styles.nav} onKeyDown={escape} onPointerEnter={onlyMouse(hold)} onPointerLeave={onlyMouse(hideSoon)}>
      <button type="button" className={styles.burger} aria-expanded={drawer} aria-controls="site-drawer" onClick={() => setDrawer(!drawer)}>
        <svg className={styles.burgerIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d={drawer ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h10'} />
        </svg>
        <span className={styles.hidden}>{t('common.nav.menu')}</span>
      </button>

      <nav className={styles.row} aria-label={t('common.nav.label')}>
        <ul className={styles.rowList}>
          {entries.map((entry) =>
            entry.id === allCollections ? (
              <li key={entry.id} className={styles.rowItem} onPointerEnter={onlyMouse(show)}>
                <Link href={entry.href} className={cx(styles.rowLink, open && styles.rowLinkOn)}>
                  {entry.label}
                </Link>
                <button type="button" className={styles.rowToggle} aria-expanded={open} aria-controls="collections-panel" aria-label={t('common.nav.submenu', { item: entry.label })} onClick={() => (open ? hide() : show())}>
                  <Chevron open={open} />
                </button>
              </li>
            ) : (
              <li key={entry.id} className={styles.rowItem} onPointerEnter={onlyMouse(hide)} onClick={hide}>
                <Link href={entry.href} className={styles.rowLink}>
                  {entry.label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </nav>

      {open ? (
        <div id="collections-panel" className={styles.mega} onClick={hide}>
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
                <p className={styles.megaSub}>{t('common.mega.browse')}</p>
              </div>
              <ul className={styles.megaList}>
                {collections.map((c) => (
                  <li key={c.id}>
                    <Link href={c.href} className={styles.megaLink}>
                      {tidyName(c.name)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/collections/all/" className={styles.feature}>
              <ThemeImage src="hero.webp" alt="" ratio={2.4} sizes="420px" className={styles.featureImage} />
              <span className={styles.featureShade} />
              <span className={styles.featureCopy}>
                <span className={styles.featureEyebrow}>{t('common.mega.featureEyebrow')}</span>
                <span className={styles.featureTitle}>{t('common.mega.featureTitle')}</span>
                <span className={styles.featureCta}>
                  {t('common.mega.featureCta', { store: store.name })}
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
            {entries.map((entry) => {
              const links = entry.id === allCollections ? collections.map((c) => ({ id: c.id, label: tidyName(c.name), href: c.href })) : entry.children
              return (
                <li key={entry.id}>
                  <div className={styles.drawerRow} onClick={closeDrawer}>
                    <Link href={entry.href} className={styles.drawerLink}>
                      {entry.label}
                    </Link>
                    {links.length ? (
                      <button type="button" className={styles.drawerToggle} aria-expanded={expanded === entry.id} aria-label={t('common.nav.submenu', { item: entry.label })} onClick={(event) => {
                          // The chevron only opens the list; it doesn't count as following the link beside it.
                          event.stopPropagation()
                          setExpanded(expanded === entry.id ? null : entry.id)
                        }}>
                        <Chevron open={expanded === entry.id} />
                      </button>
                    ) : null}
                  </div>
                  {links.length && expanded === entry.id ? (
                    <ul className={styles.drawerSub}>
                      {links.map((link) => (
                        <li key={link.id} onClick={closeDrawer}>
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
          <ul className={styles.drawerTools} onClick={closeDrawer}>
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
