import type { Listing } from '@dripfunnel/storefront-core/theme'
import { ListingView } from './interactive/Filters'

/** A collection's, a search's or the whole shop's products: one shared view for every listing page. */
export const ListingResults = ({ listing }: { listing: Listing }) => <ListingView listing={listing} />
