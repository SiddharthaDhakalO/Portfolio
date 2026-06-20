'use client';

import OverlayPanel from './OverlayPanel';
import { useMuseumStore } from '@/lib/useMuseumStore';
import { ARCHIVE, ARCHIVE_PLACARD } from '@/lib/archive';

export default function ArchiveOverlay() {
  const isOpen = useMuseumStore((s) => s.activeOverlay === 'archive');
  const close = useMuseumStore((s) => s.closeOverlay);

  return (
    <OverlayPanel isOpen={isOpen} onClose={close} ariaLabelledBy="archive-title">
      <div style={{ padding: '64px 40px 56px' }}>
        <header
          style={{
            marginBottom: 32,
            paddingBottom: 24,
            borderBottom: '1px solid rgba(201, 169, 97, 0.25)',
          }}
        >
          <SectionLabel>The Archive</SectionLabel>
          <h2
            id="archive-title"
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontWeight: 500,
              fontSize: 44,
              lineHeight: 1.1,
              margin: 0,
              color: '#E8E4DC',
            }}
          >
            Experiments &amp; early pieces
          </h2>
          <p
            style={{
              marginTop: 14,
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontStyle: 'italic',
              fontSize: 17,
              lineHeight: 1.55,
              color: 'rgba(232, 228, 220, 0.78)',
            }}
          >
            Lighter cards than the Gallery — the learning pieces, the
            sketches, and the work this museum was itself made from.
          </p>
        </header>

        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 14 }}>
          {ARCHIVE.map((item) => (
            <li
              key={item.slug}
              style={{
                padding: '14px 16px',
                border: '1px solid rgba(201, 169, 97, 0.22)',
                background: 'rgba(201, 169, 97, 0.03)',
              }}
            >
              <div
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#C9A961',
                  marginBottom: 6,
                }}
              >
                {item.medium}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontSize: 22,
                  fontWeight: 500,
                  color: '#E8E4DC',
                  marginBottom: 6,
                }}
              >
                {item.title}
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: 'rgba(232, 228, 220, 0.82)',
                }}
              >
                {item.note}
              </p>
              {item.link && (
                <a
                  href={item.link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    marginTop: 10,
                    fontFamily:
                      'ui-monospace, SFMono-Regular, Menlo, monospace',
                    fontSize: 11,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#C9A961',
                    textDecoration: 'none',
                    borderBottom: '1px solid rgba(201, 169, 97, 0.4)',
                    paddingBottom: 2,
                  }}
                >
                  {item.link.label} ↗
                </a>
              )}
            </li>
          ))}
        </ul>

        <div
          style={{
            marginTop: 28,
            padding: '18px 20px',
            border: '1px dashed rgba(201, 169, 97, 0.35)',
            color: 'rgba(232, 228, 220, 0.7)',
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontStyle: 'italic',
            fontSize: 15,
            lineHeight: 1.55,
            textAlign: 'center',
          }}
        >
          {ARCHIVE_PLACARD}
        </div>
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
