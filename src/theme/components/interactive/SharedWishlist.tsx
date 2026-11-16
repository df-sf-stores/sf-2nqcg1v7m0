'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { WishlistPage } from '@dripfunnel/storefront-core/theme'

/**
 * The page's one wishlist. Each `useWishlist()` asks the Shop API for the list on its own, so a page of product cards
 * asked once per heart; Layout reads it once and every heart shares that answer, its state and its changes.
 */
const SharedWishlistContext = createContext<WishlistPage | null>(null)

export const WishlistProvider = ({ value, children }: { value: WishlistPage; children: ReactNode }) => (
  <SharedWishlistContext.Provider value={value}>{children}</SharedWishlistContext.Provider>
)

/** The wishlist Layout shares, or null outside it (checkout), where a heart reads its own. */
export const useSharedWishlist = () => useContext(SharedWishlistContext)
