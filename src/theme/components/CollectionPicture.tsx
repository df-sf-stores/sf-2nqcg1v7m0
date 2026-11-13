import { Image, useListing, type CollectionCard } from '@dripfunnel/storefront-core/theme'
import { slugOf } from './slugOf'

type CollectionPictureProps = {
  collection: CollectionCard
  /** Whether the picture is named for screen readers by the collection's name; otherwise it is decoration. */
  named?: boolean
  ratio: number
  /** How wide it shows on a wide screen, in pixels; it fills the screen's width below 900px. */
  width: number
  className?: string | undefined
}

/** The collection's own picture; a collection without one shows the photo of its first product that has one. */
export const CollectionPicture = ({ collection, named = false, ratio, width, className }: CollectionPictureProps) => {
  const { items } = useListing({ collection: slugOf(collection) }, collection.image === null)
  const photo = collection.image ?? items.find((p) => p.photo)?.photo ?? null
  return photo ? <Image image={photo} alt={named ? collection.name : ''} ratio={ratio} sizes={`(min-width: 900px) ${width}px, 100vw`} className={className} /> : null
}
