import type { ReactNode } from 'react'
import { StoreLogo, useStorefront } from '@dripfunnel/storefront-core/theme'
import styles from '../styles/account.module.css'

/** Sign-in, create-account and password pages: the store's night panel and what an account is for, beside the form. */
export const AuthFrame = ({ children }: { children: ReactNode }) => {
  const { store, t } = useStorefront()
  return (
    <div className={styles.frame}>
      <aside className={styles.panel}>
        <div className={styles.panelInner}>
          <StoreLogo className={styles.panelLogo} />
          <p className={styles.panelLead}>{t('pages.auth.lead', { store: store.name })}</p>
          <ul className={styles.perks}>
            <li className={styles.perk}>
              <span className={styles.perkTitle}>{t('pages.auth.orders')}</span>
              <span className={styles.perkBody}>{t('pages.auth.ordersBody')}</span>
            </li>
            <li className={styles.perk}>
              <span className={styles.perkTitle}>{t('pages.auth.wishlist')}</span>
              <span className={styles.perkBody}>{t('pages.auth.wishlistBody')}</span>
            </li>
            <li className={styles.perk}>
              <span className={styles.perkTitle}>{t('pages.auth.checkout')}</span>
              <span className={styles.perkBody}>{t('pages.auth.checkoutBody')}</span>
            </li>
          </ul>
        </div>
      </aside>
      <div className={styles.formSide}>{children}</div>
    </div>
  )
}
