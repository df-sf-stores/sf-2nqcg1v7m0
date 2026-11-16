'use client'

import { useState } from 'react'
import { Form, SubmitButton, TextField, useStorefront } from '@dripfunnel/storefront-core/theme'
import styles from '../../styles/contact.module.css'

const emailShape = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const phoneShape = /^\+?[\d\s().-]{7,20}$/

type Field = 'name' | 'email' | 'phone' | 'subject' | 'message'
type Problems = Partial<Record<Field, string>>

/**
 * The contact form. Core's Shop API takes no message yet, so nothing is posted from here: a complete form is checked,
 * then the shopper is told plainly to send it by email to the address given, with what they wrote kept in the fields.
 */
export const ContactForm = ({ email }: { email: string }) => {
  const { t } = useStorefront()
  const [values, setValues] = useState<Record<Field, string>>({ name: '', email: '', phone: '', subject: '', message: '' })
  const [problems, setProblems] = useState<Problems>({})
  const [ready, setReady] = useState(false)

  const change = (field: Field) => (value: string) => {
    setValues((v) => ({ ...v, [field]: value }))
    if (problems[field]) setProblems((p) => ({ ...p, [field]: undefined }))
    setReady(false)
  }

  const send = () => {
    const found: Problems = {}
    if (!values.name.trim()) found.name = t('pages.contact.form.nameMissing')
    if (!emailShape.test(values.email.trim())) found.email = t('pages.contact.form.emailInvalid')
    if (values.phone.trim() && !phoneShape.test(values.phone.trim())) found.phone = t('pages.contact.form.phoneInvalid')
    if (!values.subject.trim()) found.subject = t('pages.contact.form.subjectMissing')
    if (!values.message.trim()) found.message = t('pages.contact.form.messageMissing')
    setProblems(found)
    setReady(Object.keys(found).length === 0)
  }

  const required = t('pages.contact.form.required')
  return (
    <Form onSubmit={send} label={t('pages.contact.form.label')} className={styles.form}>
      <TextField label={t('pages.contact.form.name')} note={required} value={values.name} onChange={change('name')} autoComplete="name" maxLength={120} error={problems.name ?? null} className={styles.field} />
      <TextField label={t('pages.contact.form.email')} note={required} value={values.email} onChange={change('email')} type="email" inputMode="email" autoComplete="email" maxLength={254} error={problems.email ?? null} className={styles.field} />
      <TextField label={t('pages.contact.form.phone')} note={t('pages.contact.form.optional')} value={values.phone} onChange={change('phone')} type="tel" inputMode="tel" autoComplete="tel" maxLength={20} error={problems.phone ?? null} className={styles.fieldOptional} />
      <TextField label={t('pages.contact.form.subject')} note={required} value={values.subject} onChange={change('subject')} maxLength={160} error={problems.subject ?? null} className={styles.field} />
      <TextField label={t('pages.contact.form.message')} note={required} value={values.message} onChange={change('message')} maxLength={2000} error={problems.message ?? null} className={styles.fieldMessage} />
      {ready ? (
        <div className={styles.ready} role="status">
          <p className={styles.readyTitle}>{t('pages.contact.form.readyTitle', { name: values.name.trim() })}</p>
          <p className={styles.readyBody}>{t('pages.contact.form.readyBody', { email })}</p>
        </div>
      ) : null}
      <SubmitButton className={styles.send}>
        {t('pages.contact.form.send')}
        <svg className={styles.sendArrow} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </SubmitButton>
    </Form>
  )
}
