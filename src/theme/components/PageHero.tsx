import type { ReactNode } from 'react'
import { Breadcrumbs, useStorefront, type Crumb } from '@dripfunnel/storefront-core/theme'
import styles from '../styles/page.module.css'

type PageHeroProps = {
  title: string
  lead?: string | null | undefined
  /** The trail after Home; the page itself last. None leaves the breadcrumbs out. */
  crumbs?: Crumb[]
  /** The large faint word behind the title on wide screens; the title when left out. */
  ghost?: string | undefined
  children?: ReactNode
}

/** An inner page's opening: an ivory band with the breadcrumbs, an uppercase serif title and its lead. */
export const PageHero = ({ title, lead, crumbs, ghost, children }: PageHeroProps) => {
  const { t } = useStorefront()
  return (
    <header className={styles.hero}>
      <p className={styles.ghost} aria-hidden="true">
        {ghost ?? title}
      </p>
      <div className={styles.heroInner}>
        {crumbs?.length ? <Breadcrumbs crumbs={[{ label: t('shop.crumbs.home'), href: '/' }, ...crumbs]} t={t} className={styles.crumbs} /> : null}
        <h1 className={styles.heroTitle}>{title}</h1>
        {lead ? <p className={styles.heroLead}>{lead}</p> : null}
        {children}
      </div>
    </header>
  )
}
