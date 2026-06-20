'use client';

import { useEffect, useState } from 'react';
import OverlayPanel from './OverlayPanel';
import { useMuseumStore } from '@/lib/useMuseumStore';
import { ABOUT } from '@/lib/about';

const TYPE_SPEED_MS = 22;

function Typewriter({ text, active }: { text: string; active: boolean }) {
  const [shown, setShown] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) {
      setShown('');
      setDone(false);
      return;
    }
    setShown('');
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      if (i >= text.length) {
        setShown(text);
        setDone(true);
        clearInterval(id);
      } else {
        setShown(text.slice(0, i));
      }
    }, TYPE_SPEED_MS);
    return () => clearInterval(id);
  }, [text, active]);

  return (
    <>
      {shown}
      {!done && (
        <span
          aria-hidden
          className="cursor-blink"
          style={{ marginLeft: 2, color: '#C9A961' }}
        >
          |
        </span>
      )}
    </>
  );
}

export default function StudioOverlay() {
  const isOpen = useMuseumStore((s) => s.activeOverlay === 'studio');
  const close = useMuseumStore((s) => s.closeOverlay);

  return (
    <OverlayPanel isOpen={isOpen} onClose={close} ariaLabelledBy="studio-title">
      <div style={{ padding: '64px 40px 56px' }}>
        <header
          style={{
            marginBottom: 36,
            paddingBottom: 24,
            borderBottom: '1px solid rgba(201, 169, 97, 0.25)',
          }}
        >
          <SectionLabel>The Studio</SectionLabel>
          <h2
            id="studio-title"
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontWeight: 500,
              fontSize: 44,
              lineHeight: 1.1,
              margin: 0,
              color: '#E8E4DC',
            }}
          >
            Curator’s Statement
          </h2>
        </header>

        <section style={{ marginBottom: 40 }}>
          <SectionLabel>Bio</SectionLabel>
          <p
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontStyle: 'italic',
              fontSize: 20,
              lineHeight: 1.5,
              margin: '0 0 18px',
              color: '#E8E4DC',
              minHeight: '3.2em',
            }}
          >
            <Typewriter text={ABOUT.bio.intro} active={isOpen} />
          </p>
          {ABOUT.bio.body.map((para, i) => (
            <p
              key={i}
              style={{
                margin: '0 0 14px',
                fontSize: 15,
                lineHeight: 1.7,
                color: 'rgba(232, 228, 220, 0.88)',
              }}
            >
              {para}
            </p>
          ))}
        </section>

        <section style={{ marginBottom: 40 }}>
          <SectionLabel>The Curator’s Tools</SectionLabel>
          <div style={{ display: 'grid', gap: 16 }}>
            {ABOUT.toolTiers.map((tier) => (
              <div key={tier.label}>
                <div
                  style={{
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                    fontStyle: 'italic',
                    fontSize: 14,
                    color: 'rgba(232, 228, 220, 0.7)',
                    marginBottom: 6,
                  }}
                >
                  {tier.label}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {tier.items.map((item) => (
                    <span
                      key={item}
                      style={{
                        fontFamily:
                          'ui-monospace, SFMono-Regular, Menlo, monospace',
                        fontSize: 11,
                        padding: '4px 9px',
                        border: '1px solid rgba(201, 169, 97, 0.28)',
                        color: 'rgba(232, 228, 220, 0.9)',
                        background: 'rgba(201, 169, 97, 0.04)',
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionLabel>Provenance / Exhibition History</SectionLabel>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {ABOUT.timeline.map((entry) => (
              <li
                key={entry.year + entry.title}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '128px 1fr',
                  gap: 16,
                  paddingBottom: 18,
                  marginBottom: 18,
                  borderBottom: '1px solid rgba(201, 169, 97, 0.12)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    fontSize: 12,
                    color: '#C9A961',
                    paddingTop: 2,
                  }}
                >
                  {entry.year}
                </span>
                <span>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: '#E8E4DC',
                      marginBottom: 2,
                    }}
                  >
                    {entry.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      lineHeight: 1.55,
                      color: 'rgba(232, 228, 220, 0.7)',
                    }}
                  >
                    {entry.detail}
                  </div>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </OverlayPanel>
  );
}

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
