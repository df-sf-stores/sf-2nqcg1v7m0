'use client'

import { useState } from 'react'
import { Form, Link, SubmitButton, TextField, useStorefront } from '@dripfunnel/storefront-core/theme'
import styles from '../../styles/home.module.css'

const emailShape = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * The newsletter band. The store has no mailing list of its own to post to (core offers none), so a valid address
 * leads the shopper to create an account, which is how the store hears from them; nothing is sent from here.
 */
export const Newsletter = () => {
  const { store, t } = useStorefront()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const join = () => {
    if (!emailShape.test(email.trim())) {
      setError(t('home.newsletter.invalid'))
      return
    }
    setError(null)
    setDone(true)
  }
  return (
    <section className={styles.newsletter}>
      <div className={styles.newsletterInner}>
        <div className={styles.newsletterCopy}>
          <p className={styles.newsletterEyebrow}>{t('home.newsletter.eyebrow')}</p>
          <h2 className={styles.newsletterTitle}>{t('home.newsletter.title', { store: store.name })}</h2>
          <p className={styles.newsletterBody}>{t('home.newsletter.body', { store: store.name })}</p>
        </div>
        {done ? (
          <div className={styles.newsletterDone} role="status">
            <p className={styles.newsletterNote}>{t('home.newsletter.next', { store: store.name })}</p>
            <Link href="/register/" className={styles.newsletterCreate}>
              {t('home.newsletter.create')}
            </Link>
          </div>
        ) : (
          <Form onSubmit={join} label={t('home.newsletter.title', { store: store.name })} className={styles.newsletterForm}>
            <TextField
              label={t('home.newsletter.label')}
              value={email}
              onChange={(value) => {
                setEmail(value)
                if (error) setError(null)
              }}
              type="email"
              autoComplete="email"
              inputMode="email"
              maxLength={254}
              error={error}
              className={styles.newsletterField}
            />
            <SubmitButton className={styles.newsletterJoin}>{t('home.newsletter.join')}</SubmitButton>
          </Form>
        )}
      </div>
    </section>
  )
}
