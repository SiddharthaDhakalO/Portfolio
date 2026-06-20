// Archive items — experiments, early pieces, and works-in-acquisition.
// Add new entries here as you spin up small repos / studies.
export type ArchiveItem = {
  slug: string;
  title: string;
  medium: string;
  note: string;
  link?: { label: string; url: string };
};

export const ARCHIVE: ArchiveItem[] = [
  {
    slug: 'theme-flutter',
    title: 'theme_Flutter',
    medium: 'Flutter · Dart',
    note:
      'A Flutter theming experiment — exploring how a single app can switch its whole look and feel.',
    link: {
      label: 'View on GitHub',
      url: 'https://github.com/SiddharthaDhakalO/theme_Flutter',
    },
  },
  {
    slug: 'setstate-blockc',
    title: 'SetState-BlockC',
    medium: 'C++',
    note: 'An early programming piece from the foundations — kept here as part of the provenance.',
    link: {
      label: 'View on GitHub',
      url: 'https://github.com/SiddharthaDhakalO/SetState-BlockC',
    },
  },
  {
    slug: 'this-museum',
    title: 'This Museum',
    medium: 'React Three Fiber · Next.js · Drei',
    note:
      'The room you are standing in. A 3D portfolio built from primitives, vibe-coded with AI agents — the newest experiment in the collection.',
  },
];

export const ARCHIVE_PLACARD =
  "The collection is still growing. New work is acquired here as it's made.";
