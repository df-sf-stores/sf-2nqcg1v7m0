'use client'

import { createI18n, createShopClient, loadStore, storedShopState, StorefrontProvider, ThemeMediaProvider, type Catalogue, type ShopStoreSettings } from '@dripfunnel/storefront-core'
import { useEffect, useState, type ReactNode } from 'react'
import { storeConfig } from '../../store.config'

// Local `next dev` only (shipped builds bring the platform's own client). The Shop API's cart operations currently take
// 8–12 s, past core's 10 s default, so an add that succeeded on the server read as failed here; 30 s lets them answer.
const client = createShopClient({ endpoint: storeConfig.shopApi, state: storedShopState, timeoutMs: 30_000 })

export const Shell = ({ content, media, children }: { content: Record<string, Record<string, string>>; media: Record<string, string>; children: ReactNode }) => {
  const [store, setStore] = useState<ShopStoreSettings | null>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    loadStore(client).then(setStore, () => setFailed(true))
  }, [])
  if (failed) return <p role="alert">{createI18n('en').t('store.failed')}</p>
  if (!store) return null
  const { t } = createI18n(store.language, content as Record<string, Catalogue>)
  return (
    <StorefrontProvider value={{ client, store, locale: store.language, t, mode: 'live', poweredBy: null }}>
      <ThemeMediaProvider media={media}>{children}</ThemeMediaProvider>
    </StorefrontProvider>
  )
}
