'use client';

import Image from 'next/image';
import { PROJECTS } from '@/lib/projects';
import { useMuseumStore } from '@/lib/useMuseumStore';

export default function ClassicMuseum() {
  const openExhibit = useMuseumStore((s) => s.openExhibit);
  const openStudio = useMuseumStore((s) => s.openStudio);
  const openArchive = useMuseumStore((s) => s.openArchive);
  const openGiftshop = useMuseumStore((s) => s.openGiftshop);

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#0E0E0E',
        color: '#E8E4DC',
        fontFamily: 'var(--font-inter), system-ui, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '72px 24px 96px',
        }}
      >
        <header style={{ textAlign: 'center', marginBottom: 80 }}>
          <Eyebrow>The Museum of</Eyebrow>
          <h1
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontWeight: 500,
              fontSize: 'clamp(40px, 7vw, 72px)',
              lineHeight: 1.05,
              margin: '20px 0 12px',
            }}
          >
            Siddhartha Dhakal
          </h1>
          <p
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontSize: 12,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(232, 228, 220, 0.6)',
              margin: 0,
            }}
          >
            Frontend Web Developer · Kathmandu
          </p>
          <p
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(16px, 1.7vw, 19px)',
              lineHeight: 1.55,
              margin: '24px auto 0',
              color: 'rgba(232, 228, 220, 0.78)',
              maxWidth: 540,
            }}
          >
            A small, growing collection of interfaces, experiments, and things
            made while learning to build well.
          </p>
        </header>

        <section style={{ marginBottom: 72 }}>
          <SectionHeader label="The Gallery" title="Selected work" />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 20,
            }}
          >
            {PROJECTS.map((p) => (
              <ProjectCard key={p.slug} project={p} onOpen={() => openExhibit(p.slug)} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader label="The Rest of the Museum" />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 20,
            }}
          >
            <RoomCard
              label="The Studio"
              title="Curator's Statement"
              body="The bio, the tools used daily, and the provenance behind the work."
              onClick={openStudio}
            />
            <RoomCard
              label="The Archive"
              title="Experiments & early pieces"
              body="Smaller works, sketches, and the experiments this museum was itself made from."
              onClick={openArchive}
            />
            <RoomCard
              label="The Gift Shop"
              title="Contact"
              body="The catalogue (résumé), links to find me, and the visitor's book."
              onClick={openGiftshop}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function Eyebrow({ children }: { children: string }) {
  return (
    <div
      style={{
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 11,
        letterSpacing: '0.32em',
        textTransform: 'uppercase',
        color: '#C9A961',
      }}
    >
      {children}
    </div>
  );
}

function SectionHeader({ label, title }: { label: string; title?: string }) {
  return (
    <div style={{ marginBottom: 28, borderBottom: '1px solid rgba(201, 169, 97, 0.2)', paddingBottom: 14 }}>
      <Eyebrow>{label}</Eyebrow>
      {title && (
        <h2
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontWeight: 500,
            fontSize: 28,
            margin: '4px 0 0',
            color: '#E8E4DC',
          }}
        >
          {title}
        </h2>
      )}
    </div>
  );
}

function ProjectCard({
  project,
  onOpen,
}: {
  project: (typeof PROJECTS)[number];
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      style={{
        textAlign: 'left',
        background: '#141414',
        border: '1px solid rgba(201, 169, 97, 0.22)',
        color: 'inherit',
        padding: 0,
        cursor: 'pointer',
        fontFamily: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.25s ease, transform 0.25s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#C9A961';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(201, 169, 97, 0.22)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '8 / 5' }}>
        <Image
          src={project.hero}
          alt={project.title}
          fill
          sizes="(max-width: 700px) 100vw, 320px"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div style={{ padding: 16 }}>
        <div
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: 10,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#C9A961',
            marginBottom: 6,
          }}
        >
          {project.year} · {project.medium.split(' · ')[0]}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 22,
            fontWeight: 500,
            color: '#E8E4DC',
            lineHeight: 1.2,
          }}
        >
          {project.title}
        </div>
      </div>
    </button>
  );
}

function RoomCard({
  label,
  title,
  body,
  onClick,
}: {
  label: string;
  title: string;
  body: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        textAlign: 'left',
        background: '#141414',
        border: '1px solid rgba(201, 169, 97, 0.22)',
        color: 'inherit',
        padding: '24px 22px',
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'border-color 0.25s ease, transform 0.25s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#C9A961';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(201, 169, 97, 0.22)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 10,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#C9A961',
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-cormorant), Georgia, serif',
          fontSize: 26,
          fontWeight: 500,
          color: '#E8E4DC',
          marginBottom: 10,
        }}
      >
        {title}
      </div>
      <p
        style={{
          margin: 0,
          fontSize: 14,
          lineHeight: 1.6,
          color: 'rgba(232, 228, 220, 0.75)',
        }}
      >
        {body}
      </p>
    </button>
  );
}
