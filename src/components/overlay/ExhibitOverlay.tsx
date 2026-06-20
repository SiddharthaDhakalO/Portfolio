'use client';

import Image from 'next/image';
import { PROJECTS } from '@/lib/projects';
import { useMuseumStore } from '@/lib/useMuseumStore';
import OverlayPanel from './OverlayPanel';

export default function ExhibitOverlay() {
  const isOpen = useMuseumStore((s) => s.activeOverlay === 'exhibit');
  const slug = useMuseumStore((s) => s.selectedSlug);
  const close = useMuseumStore((s) => s.closeOverlay);

  const project = slug ? PROJECTS.find((p) => p.slug === slug) : null;
  const open = isOpen && !!project;

  return (
    <OverlayPanel isOpen={open} onClose={close} ariaLabelledBy="exhibit-title">
      {project && (
        <>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '8 / 5' }}>
            <Image
              src={project.hero}
              alt={`${project.title} hero`}
              fill
              sizes="(max-width: 560px) 100vw, 560px"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>

          <div style={{ padding: '32px 40px 48px' }}>
            <Plaque project={project} />
            <Section label="Challenge" body={project.challenge} />
            <SectionList label="Process" items={project.process} ordered />
            <SectionList label="Artifacts" items={project.artifacts} />
            <Section label="Impact" body={project.impact} />
            {project.link && (
              <a
                href={project.link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  marginTop: 12,
                  padding: '11px 18px',
                  border: '1px solid #C9A961',
                  color: '#C9A961',
                  textDecoration: 'none',
                  fontSize: 12,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                }}
              >
                {project.link.label} <span aria-hidden>↗</span>
              </a>
            )}
          </div>
        </>
      )}
    </OverlayPanel>
  );
}

function Plaque({ project }: { project: (typeof PROJECTS)[number] }) {
  return (
    <header
      style={{
        marginBottom: 32,
        paddingBottom: 24,
        borderBottom: '1px solid rgba(201, 169, 97, 0.25)',
      }}
    >
      <div
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 11,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#C9A961',
          marginBottom: 14,
        }}
      >
        Exhibit · {project.year}
      </div>
      <h2
        id="exhibit-title"
        style={{
          fontFamily: 'var(--font-cormorant), Georgia, serif',
          fontWeight: 500,
          fontSize: 40,
          lineHeight: 1.1,
          margin: 0,
          color: '#E8E4DC',
        }}
      >
        {project.title}
      </h2>
      <p
        style={{
          marginTop: 14,
          fontFamily: 'var(--font-cormorant), Georgia, serif',
          fontStyle: 'italic',
          fontSize: 18,
          lineHeight: 1.5,
          color: 'rgba(232, 228, 220, 0.8)',
        }}
      >
        {project.blurb}
      </p>

      <dl
        style={{
          display: 'grid',
          gridTemplateColumns: '70px 1fr',
          gap: '6px 14px',
          marginTop: 22,
          fontSize: 13,
          lineHeight: 1.5,
        }}
      >
        <PlaqueRow label="Medium" value={project.medium} />
        <PlaqueRow label="Role" value={project.role} />
      </dl>

      <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {project.tools.map((t) => (
          <span
            key={t}
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontSize: 11,
              padding: '3px 8px',
              border: '1px solid rgba(201, 169, 97, 0.3)',
              color: 'rgba(232, 228, 220, 0.85)',
              background: 'rgba(201, 169, 97, 0.04)',
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </header>
  );
}

function PlaqueRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 10,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#C9A961',
          paddingTop: 2,
        }}
      >
        {label}
      </dt>
      <dd style={{ margin: 0, color: 'rgba(232, 228, 220, 0.9)' }}>{value}</dd>
    </>
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

function Section({ label, body }: { label: string; body: string }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <SectionLabel>{label}</SectionLabel>
      <p
        style={{
          margin: 0,
          fontSize: 15,
          lineHeight: 1.7,
          color: 'rgba(232, 228, 220, 0.92)',
        }}
      >
        {body}
      </p>
    </section>
  );
}

function SectionList({
  label,
  items,
  ordered = false,
}: {
  label: string;
  items: string[];
  ordered?: boolean;
}) {
  return (
    <section style={{ marginBottom: 28 }}>
      <SectionLabel>{label}</SectionLabel>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {items.map((item, i) => (
          <li
            key={`${label}-${i}`}
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: 'rgba(232, 228, 220, 0.92)',
              paddingLeft: 28,
              position: 'relative',
              marginBottom: 6,
            }}
          >
            <span
              aria-hidden
              style={{
                position: 'absolute',
                left: 0,
                top: '0.45em',
                fontFamily: ordered
                  ? 'ui-monospace, SFMono-Regular, Menlo, monospace'
                  : 'inherit',
                fontSize: ordered ? 11 : 13,
                color: '#C9A961',
                width: 22,
              }}
            >
              {ordered ? String(i + 1).padStart(2, '0') : '—'}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
