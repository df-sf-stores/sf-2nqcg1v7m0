'use client'

import { useRef, useState, type PointerEvent } from 'react'
import { Image, useStorefront, Video, type Photo, type VideoFile } from '@dripfunnel/storefront-core/theme'
import styles from '../../styles/product.module.css'

/**
 * The chosen picture large, the rest as thumbnails (a rail beside it on wide screens), and the product's video last.
 * A pointer over the picture magnifies it around the pointer; the position goes straight to the element's style,
 * so moving the mouse never re-renders the page.
 */
export const Gallery = ({ photos, video, name }: { photos: readonly Photo[]; video: VideoFile | null; name: string }) => {
  const { t } = useStorefront()
  const [shown, setShown] = useState(0)
  const stage = useRef<HTMLDivElement>(null)
  const first = photos[0]
  // Core's <Video> needs a poster (storefront ARCHITECTURE §2.1), so a product with no photo shows no video either.
  if (!first) return <div className={styles.noPicture} />
  const playing = video !== null && shown === photos.length
  const photo = photos[Math.min(shown, photos.length - 1)] ?? first
  const hasThumbs = photos.length > 1 || video !== null
  const follow = (e: PointerEvent<HTMLDivElement>) => {
    const el = stage.current
    if (!el || playing) return
    const box = el.getBoundingClientRect()
    el.style.setProperty('--zoom-x', `${((e.clientX - box.left) / box.width) * 100}%`)
    el.style.setProperty('--zoom-y', `${((e.clientY - box.top) / box.height) * 100}%`)
  }
  return (
    <div className={hasThumbs ? styles.galleryRail : styles.gallery}>
      <div ref={stage} className={playing ? styles.stage : styles.stageZoom} onPointerMove={follow}>
        {playing && video ? (
          <Video video={video} poster={first} label={name} ratio={0.8} className={styles.media} />
        ) : (
          <Image image={photo} alt={photo.alt ?? name} ratio={0.8} sizes="(min-width: 1200px) 680px, (min-width: 900px) 55vw, 100vw" className={styles.media} />
        )}
      </div>
      {hasThumbs ? (
        <div className={styles.thumbs}>
          {photos.map((p, i) => (
            <button key={p.url} type="button" className={i === shown ? styles.thumbOn : styles.thumb} aria-label={p.alt ?? name} aria-pressed={i === shown} onClick={() => setShown(i)}>
              <Image image={p} alt="" ratio={1} sizes="80px" className={styles.thumbImage} />
            </button>
          ))}
          {video ? (
            <button type="button" className={playing ? styles.thumbOn : styles.thumb} aria-label={t('shop.product.video')} aria-pressed={playing} onClick={() => setShown(photos.length)}>
              <svg className={styles.play} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M9 7l8 5-8 5z" />
              </svg>
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
