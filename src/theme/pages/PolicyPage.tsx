import type { ReactNode } from 'react'
import { Breadcrumbs, Link, useLocation, useStorefront } from '@dripfunnel/storefront-core/theme'
import { Layout } from '../components/Layout'
import { storeName } from '../components/storeName'
import styles from '../styles/policy.module.css'

const kinds = ['terms', 'privacy', 'shipping', 'returns', 'legal'] as const
type Kind = (typeof kinds)[number]

const numbered = /^\d+\.\s/
// '**words**' set in bold, '[words](/path/)' a link to a page of the store.
const inline = /\*\*([^*]+)\*\*|\[([^\]]+)\]\((\/[^)\s]*)\)/g

/** A line of a policy, its bold lead-ins and its links to the store's own pages kept. */
const Inline = ({ text }: { text: string }) => {
  const parts: ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(inline)) {
    const at = m.index
    if (at > last) parts.push(text.slice(last, at))
    if (m[1] !== undefined) parts.push(<strong key={at}>{m[1]}</strong>)
    else if (m[2] !== undefined && m[3] !== undefined)
      parts.push(
        <Link key={at} href={m[3]} className={styles.link}>
          {m[2]}
        </Link>,
      )
    last = at + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return <>{parts}</>
}

/** One block of a policy: '## ' a heading, lines after '- ' or 'n. ' a list, anything else a paragraph. */
const Block = ({ block }: { block: string }) => {
  const lines = block.split('\n')
  if (block.startsWith('## ')) return <h2 className={styles.heading}>{block.slice(3)}</h2>
  if (lines.every((l) => l.startsWith('- ')))
    return (
      <ul className={styles.list}>
        {lines.map((l, j) => (
          <li key={j}>
            <Inline text={l.slice(2)} />
          </li>
        ))}
      </ul>
    )
  if (lines.every((l) => numbered.test(l)))
    return (
      <ol className={styles.list}>
        {lines.map((l, j) => (
          <li key={j}>
            <Inline text={l.replace(numbered, '')} />
          </li>
        ))}
      </ol>
    )
  return (
    <p className={styles.paragraph}>
      <Inline text={block} />
    </p>
  )
}

/** A policy's text from content, split by a blank line into blocks, each '## ' heading opening a section. */
const Sections = ({ text }: { text: string }) => {
  const sections: string[][] = []
  for (const block of text.split('\n\n')) {
    if (block.startsWith('## ') || sections.length === 0) sections.push([block])
    else sections[sections.length - 1]?.push(block)
  }
  return (
    <>
      {sections.map((blocks, i) => (
        <section key={i} className={styles.section}>
          {blocks.map((block, j) => (
            <Block key={j} block={block} />
          ))}
        </section>
      ))}
    </>
  )
}

export const PolicyPage = () => {
  const { store, t } = useStorefront()
  const { path } = useLocation()
  const kind = kinds.find((k) => path === `/policies/${k}/` || path === `/policies/${k}`)
  const name = { store: storeName(store.name) }
  const pages: Record<Kind, { title: string; body: string; updated: string | null }> = {
    terms: { title: t('policies.terms.title'), body: t('policies.terms.body', name), updated: t('policies.terms.updated') },
    privacy: { title: t('policies.privacy.title'), body: t('policies.privacy.body', name), updated: t('policies.privacy.updated') },
    shipping: { title: t('policies.shipping.title'), body: t('policies.shipping.body'), updated: null },
    returns: { title: t('policies.returns.title'), body: t('policies.returns.body'), updated: null },
    legal: { title: t('pages.policy.legal'), body: '', updated: null },
  }
  const page = kind ? pages[kind] : null
  const title = page ? page.title : t('pages.policy.title')
  return (
    <Layout>
      <div className={styles.page}>
        <header className={styles.band}>
          <div className={styles.bandInner}>
            <Breadcrumbs crumbs={[{ label: t('shop.crumbs.home'), href: '/' }, { label: title, href: path }]} t={t} className={styles.crumbs} />
            <h1 className={styles.title}>{title}</h1>
            {page?.updated ? (
              <p className={styles.updated}>
                {t('pages.policy.updated')} <span className={styles.date}>{page.updated}</span>
              </p>
            ) : null}
          </div>
        </header>
        <div className={styles.body}>
          <article className={styles.article}>
            {page?.body ? (
              <Sections text={page.body} />
            ) : (
              <section className={styles.section}>
                <p className={styles.paragraph}>{kind ? t('pages.policy.ask') : t('pages.policy.lead')}</p>
                <Link href="/contact/" className={styles.contact}>
                  {t('pages.contact.title')}
                </Link>
              </section>
            )}
          </article>
        </div>
      </div>
    </Layout>
  )
}
