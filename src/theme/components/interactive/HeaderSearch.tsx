'use client'

import { useState, type KeyboardEvent } from 'react'
import { navigate, SearchField, useStorefront } from '@dripfunnel/storefront-core/theme'
import { cx } from '../cx'
import styles from '../../styles/menu.module.css'

// The theme rules allow no URL encoding, so the characters that would break the query are dropped instead.
const searchFor = (words: string) => navigate(`/search/?q=${words.replace(/[&+%#]/g, ' ').trim()}`)

/** The header's magnifier: opens a full-width search bar under the header, with product suggestions as the shopper types. */
export const HeaderSearch = ({ className }: { className?: string | undefined }) => {
  const { t } = useStorefront()
  const [open, setOpen] = useState(false)
  const escape = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') setOpen(false)
  }
  return (
    <div className={styles.search} onKeyDown={escape}>
      <button type="button" className={className} aria-expanded={open} aria-controls="site-search" onClick={() => setOpen(!open)}>
        <svg className={styles.searchIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15zM16 16l5 5" />}
        </svg>
        <span className={styles.hidden}>{t('common.tools.search')}</span>
      </button>
      <div id="site-search" className={cx(styles.searchPanel, open && styles.searchPanelOpen)} hidden={!open}>
        <div className={styles.searchInner}>
          {open ? <SearchField label={t('common.tools.search')} placeholder={t('common.tools.searchPrompt')} button={t('common.tools.search')} value="" onSearch={searchFor} suggest={4} className={styles.searchField} /> : null}
        </div>
      </div>
    </div>
  )
}
