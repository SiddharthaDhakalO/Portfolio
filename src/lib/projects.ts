// Edit this list to add / rename / re-order projects. Each entry produces one
// framed Exhibit in the gallery (capped at the number of slots in exhibitSlots).
// Hero images live in /public/exhibits/<slug>.jpg.
export type Project = {
  slug: string;
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
];
