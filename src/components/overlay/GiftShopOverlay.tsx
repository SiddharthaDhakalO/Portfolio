'use client';

import emailjs from '@emailjs/browser';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CONTACT, EMAILJS, isEmailJSConfigured } from '@/lib/contact';
import { useMuseumStore } from '@/lib/useMuseumStore';
import OverlayPanel from './OverlayPanel';

const schema = z.object({
  name: z.string().min(2, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email.'),
  message: z.string().min(10, 'A bit more context would help.'),
});

type FormValues = z.infer<typeof schema>;

export default function GiftShopOverlay() {
  const isOpen = useMuseumStore((s) => s.activeOverlay === 'giftshop');
  const close = useMuseumStore((s) => s.closeOverlay);

  return (
    <OverlayPanel isOpen={isOpen} onClose={close} ariaLabelledBy="giftshop-title">
      <div style={{ padding: '64px 40px 56px' }}>
        <header
          style={{
            marginBottom: 36,
            paddingBottom: 24,
            borderBottom: '1px solid rgba(201, 169, 97, 0.25)',
          }}
        >
          <SectionLabel>The Gift Shop</SectionLabel>
          <h2
            id="giftshop-title"
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontWeight: 500,
              fontSize: 44,
              lineHeight: 1.1,
              margin: 0,
              color: '#E8E4DC',
            }}
          >
            Contact
          </h2>
          <p
            style={{
              marginTop: 14,
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontStyle: 'italic',
              fontSize: 18,
              lineHeight: 1.5,
              color: 'rgba(232, 228, 220, 0.78)',
            }}
          >
            Thank you for visiting. If something here resonated, I’d be glad to
            hear from you.
          </p>
        </header>

        <section style={{ marginBottom: 36 }}>
          <SectionLabel>Take the Catalogue</SectionLabel>
          <a
            href={CONTACT.resumeUrl}
            download
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 18px',
              border: '1px solid #C9A961',
              color: '#C9A961',
              textDecoration: 'none',
              fontSize: 12,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            <span aria-hidden>↓</span> Download Résumé
          </a>
          <p
            style={{
              marginTop: 10,
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontStyle: 'italic',
              fontSize: 14,
              color: 'rgba(232, 228, 220, 0.65)',
            }}
          >
            The full catalogue, in PDF — experience, skills and projects on one
            page.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <SectionLabel>Find me</SectionLabel>
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: 'none',
              display: 'grid',
              gap: 8,
            }}
          >
            {CONTACT.socials.map((s) => (
              <li key={s.name}>
                <a
                  href={s.url}
                  target={
                    s.url.startsWith('mailto:') || s.url.startsWith('tel:')
                      ? undefined
                      : '_blank'
                  }
                  rel={
                    s.url.startsWith('mailto:') || s.url.startsWith('tel:')
                      ? undefined
                      : 'noopener noreferrer'
                  }
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    border: '1px solid rgba(201, 169, 97, 0.25)',
                    color: '#E8E4DC',
                    textDecoration: 'none',
                    fontSize: 14,
                  }}
                >
                  <span
                    style={{
                      color: '#C9A961',
                      fontFamily:
                        'ui-monospace, SFMono-Regular, Menlo, monospace',
                      fontSize: 11,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {s.name}
                  </span>
                  <span style={{ opacity: 0.85 }}>{s.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionLabel>Visitor’s Book</SectionLabel>
          <p
            style={{
              marginTop: 0,
              marginBottom: 16,
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontStyle: 'italic',
              fontSize: 15,
              lineHeight: 1.55,
              color: 'rgba(232, 228, 220, 0.75)',
            }}
          >
            Leave a note in the Visitor’s Book and it’ll reach me by email.
          </p>
          <VisitorsBookForm />
        </section>
      </div>
    </OverlayPanel>
  );
}

function VisitorsBookForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const onSubmit = async (values: FormValues) => {
    setStatus('idle');
    if (!isEmailJSConfigured) {
      setStatus('error');
      return;
    }
    try {
      await emailjs.send(
        EMAILJS.serviceId!,
        EMAILJS.templateId!,
        {
          from_name: values.name,
          reply_to: values.email,
          message: values.message,
        },
        { publicKey: EMAILJS.publicKey! },
      );
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  if (!isEmailJSConfigured) {
    return (
      <div
        style={{
          padding: '14px 16px',
          border: '1px solid rgba(201, 169, 97, 0.3)',
          background: 'rgba(201, 169, 97, 0.04)',
          fontSize: 13,
          lineHeight: 1.6,
          color: 'rgba(232, 228, 220, 0.85)',
        }}
      >
        EmailJS isn’t configured yet. Set <Code>NEXT_PUBLIC_EMAILJS_SERVICE_ID</Code>,{' '}
        <Code>NEXT_PUBLIC_EMAILJS_TEMPLATE_ID</Code>, and{' '}
        <Code>NEXT_PUBLIC_EMAILJS_PUBLIC_KEY</Code> in <Code>.env.local</Code> to
        enable the form. In the meantime, reach me at{' '}
        <a href={`mailto:${CONTACT.email}`} style={{ color: '#C9A961' }}>
          {CONTACT.email}
        </a>
        .
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        style={{
          padding: '14px 16px',
          border: '1px solid #C9A961',
          background: 'rgba(201, 169, 97, 0.06)',
          fontSize: 14,
          color: '#E8E4DC',
        }}
      >
        Your note has been left in the Visitor’s Book. Thank you — I’ll be in
        touch.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      style={{ display: 'grid', gap: 14 }}
    >
      <Field label="Name" error={errors.name?.message}>
        <input
          type="text"
          autoComplete="name"
          placeholder="Your name"
          {...register('name')}
          style={inputStyle}
        />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <input
          type="email"
          autoComplete="email"
          placeholder="Where can I reach you?"
          {...register('email')}
          style={inputStyle}
        />
      </Field>
      <Field label="Message" error={errors.message?.message}>
        <textarea
          rows={5}
          placeholder="Say hello, or tell me about a project"
          {...register('message')}
          style={{ ...inputStyle, resize: 'vertical', minHeight: 110 }}
        />
      </Field>
      {status === 'error' && (
        <p style={{ margin: 0, fontSize: 13, color: '#E07A5F' }}>
          Something went wrong leaving your note. Please try again, or email me
          directly at{' '}
          <a href={`mailto:${CONTACT.email}`} style={{ color: '#C9A961' }}>
            {CONTACT.email}
          </a>
          .
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          padding: '12px 18px',
          background: isSubmitting ? 'rgba(201, 169, 97, 0.4)' : '#C9A961',
          color: '#0E0E0E',
          border: 'none',
          fontSize: 12,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          cursor: isSubmitting ? 'wait' : 'pointer',
          fontWeight: 600,
          fontFamily: 'inherit',
        }}
      >
        {isSubmitting ? 'Sending…' : 'Sign the Visitor’s Book'}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: 'block' }}>
      <span
        style={{
          display: 'block',
          fontFamily: 'ui-monospace, Menlo, monospace',
          fontSize: 10,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#C9A961',
          marginBottom: 6,
        }}
      >
        {label}
      </span>
      {children}
      {error && (
        <span
          role="alert"
          style={{ display: 'block', marginTop: 4, fontSize: 12, color: '#E07A5F' }}
        >
          {error}
        </span>
      )}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  background: '#0E0E0E',
  border: '1px solid rgba(201, 169, 97, 0.3)',
  color: '#E8E4DC',
  fontSize: 14,
  fontFamily: 'inherit',
  outline: 'none',
  borderRadius: 0,
};

function SectionLabel({ children }: { children: string }) {
  return (
    <div
      style={{
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 10,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: '#C9A961',
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code
      style={{
        fontFamily: 'ui-monospace, Menlo, monospace',
        fontSize: 12,
        background: 'rgba(201, 169, 97, 0.08)',
        padding: '1px 6px',
        color: '#C9A961',
      }}
    >
      {children}
    </code>
  );
}
