// Edit this list to add / rename / re-order projects. Every entry opens the
// same 2D case-study overlay; the `wing` decides its 3D placement — 'gallery'
// entries hang as framed Exhibits inside (capped at the number of slots in
// exhibitSlots, hero images in /public/exhibits/<slug>.jpg), 'archive'
// entries stand as sculptures in the plaza garden (hero '' — no image).
export type Wing = 'gallery' | 'archive';

export type Project = {
  slug: string;
  wing: Wing;
  title: string;
  year: string;
  medium: string;
  role: string;
  tools: string[];
  hero: string;
  blurb: string;
  challenge: string;
  process: string[];
  artifacts: string[];
  impact: string;
  link?: { label: string; url: string };
};

export const PROJECTS: Project[] = [
  {
    slug: 'pos-system',
    wing: 'gallery',
    title: 'Point of Sale (POS) System',
    year: '2024',
    medium: 'Blazor (.NET) · PostgreSQL · Minimal API',
    role: 'Frontend Web Developer — The High Innovations',
    tools: [
      'Blazor',
      '.NET',
      'HTML',
      'CSS3',
      'JavaScript',
      'Figma',
      'PostgreSQL',
      '.NET Minimal API',
    ],
    hero: '/exhibits/pos-system.jpg',
    blurb:
      'A point-of-sale system for everyday retail and hospitality, where I built the front end — the screens staff actually touch to take payments, track stock, and read reports.',
    challenge:
      'A POS lives or dies on its front end. The interface has to stay fast, legible and forgiving under the pressure of a live counter.',
    process: [
      'Built the UI in Blazor with a focus on performance and a clear, calm user experience.',
      'Assembled responsive UI components and integrated them with the backend APIs for seamless operation.',
      'Worked with PostgreSQL for data and .NET Minimal APIs for the business logic.',
      'Streamlined the billing, inventory-tracking and reporting workflows.',
    ],
    artifacts: [
      'Responsive Blazor POS interface',
      'Reusable UI component set',
      'Integrated billing / inventory / reporting screens',
    ],
    impact:
      'Brought billing, inventory and reporting into one coherent interface for counter staff.',
  },
  {
    slug: 'kanban',
    wing: 'gallery',
    title: 'Kanban — a Jira / Trello-style board',
    year: '2023',
    medium: 'ReactJS · JavaScript · CSS3',
    role: 'Designer & Developer (personal project)',
    tools: ['ReactJS', 'JavaScript', 'CSS3', 'Figma'],
    hero: '/exhibits/kanban.jpg',
    blurb:
      'A task-management board inspired by Jira and Trello — create tasks, assign them, move them across columns, and watch the work flow.',
    challenge:
      'Recreate the heart of a tool like Jira — stateful, draggable, intuitive — from scratch in React.',
    process: [
      'Designed the flow and screens in Figma first.',
      'Built a component-based UI in ReactJS.',
      'Implemented task creation, assignment, status tracking and a kanban board.',
      'Kept the code modular and maintainable throughout.',
    ],
    artifacts: ['React kanban application', 'Figma wireframes'],
    impact:
      'A working clone that demonstrates component architecture and state handling — built to learn, in public.',
    link: {
      label: 'View on GitHub',
      url: 'https://github.com/SiddharthaDhakalO/Kanban-the-father-of-Trello',
    },
  },
  {
    slug: 'flutter-weather',
    wing: 'gallery',
    title: 'Flutter Weather',
    year: '2023',
    medium: 'Flutter · Dart',
    role: 'Developer (personal project)',
    tools: ['Flutter', 'Dart'],
    hero: '/exhibits/flutter-weather.jpg',
    blurb:
      'A cross-platform weather app — a deliberate step out of the browser and into mobile, built to learn Flutter by shipping something real.',
    challenge:
      'Pick up a new framework end-to-end: fetch live weather data and present it cleanly across screen sizes.',
    process: [
      'Built the app in Flutter / Dart.',
      'Designed the weather views and handled layout, state and theming.',
    ],
    artifacts: ['Cross-platform Flutter weather application'],
    impact:
      'Demonstrates range beyond the web into cross-platform mobile development.',
    link: {
      label: 'View on GitHub',
      url: 'https://github.com/SiddharthaDhakalO/Flutter-Weather',
    },
  },
  {
    slug: 'thi-website',
    wing: 'gallery',
    title: 'The High Innovations — Company Website',
    year: '2024',
    medium: 'HTML5 · CSS3 · JavaScript',
    role: 'Frontend Web Developer — The High Innovations',
    tools: ['HTML5', 'CSS3', 'JavaScript', 'Git'],
    hero: '/exhibits/thi-website.jpg',
    blurb:
      "The public website for The High Innovations — my first professional build: a responsive company portfolio presenting the studio's capabilities and services.",
    challenge:
      'Represent a company cleanly and quickly on the web, consistent across every browser and device.',
    process: [
      'Designed and developed a responsive site in modern HTML5, CSS3 and JavaScript.',
      'Wrote clean, modular, maintainable code for cross-browser compatibility.',
      'Tested thoroughly across browsers and devices, and managed changes with Git in a team.',
    ],
    artifacts: ['Responsive company website', 'Cross-browser tested'],
    impact:
      "Established The High Innovations' first public web presence — the front door customers see and partners cite.",
  },

  // --- The Archive wing: experiments and early pieces, shown as sculptures
  // --- in the plaza garden rather than framed on a wall.
  {
    slug: 'theme-flutter',
    wing: 'archive',
    title: 'theme_Flutter',
    year: '2023',
    medium: 'Flutter · Dart',
    role: 'Developer (experiment)',
    tools: ['Flutter', 'Dart'],
    hero: '',
    blurb:
      'A Flutter theming experiment — exploring how a single app can switch its whole look and feel.',
    challenge:
      'Make theming a first-class concern: one codebase, many skins, switched live without restarting the app.',
    process: [
      'Modelled light / dark / custom themes as data.',
      'Wired theme switching through the widget tree with Flutter theming primitives.',
    ],
    artifacts: ['Flutter theming playground'],
    impact:
      'The groundwork for how later app work handled theming and visual consistency.',
    link: {
      label: 'View on GitHub',
      url: 'https://github.com/SiddharthaDhakalO/theme_Flutter',
    },
  },
  {
    slug: 'setstate-blockc',
    wing: 'archive',
    title: 'SetState-BlockC',
    year: '2022',
    medium: 'C++',
    role: 'Student (foundations)',
    tools: ['C++'],
    hero: '',
    blurb:
      'An early programming piece from the foundations — kept here as part of the provenance.',
    challenge:
      'Learn how state and control flow actually work, close to the metal, before any framework hides them.',
    process: [
      'Wrote and rewrote small C++ programs until the mental model stuck.',
    ],
    artifacts: ['C++ exercises repository'],
    impact:
      'The foundation everything later — web, mobile, 3D — was built on.',
    link: {
      label: 'View on GitHub',
      url: 'https://github.com/SiddharthaDhakalO/SetState-BlockC',
    },
  },
  {
    slug: 'this-museum',
    wing: 'archive',
    title: 'This Museum',
    year: '2026',
    medium: 'React Three Fiber · Next.js · Drei',
    role: 'Designer & Developer',
    tools: ['React Three Fiber', 'Next.js', 'Drei', 'Three.js', 'TypeScript'],
    hero: '',
    blurb:
      'The building around you. A 3D portfolio built from primitives, vibe-coded with AI agents — the newest experiment in the collection.',
    challenge:
      'Present a portfolio as a place: a modernist pavilion you walk through, not a page you scroll past.',
    process: [
      'Built the free-plan hall, plaza and rail walk procedurally — no downloaded models.',
      'Drove the whole layout from data files so the architecture can be tuned by numbers.',
    ],
    artifacts: ['This building', 'The walk you are on right now'],
    impact:
      'The portfolio itself became the proof of work.',
  },
];

export function getProjectsByWing(wing: Wing): Project[] {
  return PROJECTS.filter((p) => p.wing === wing);
}
