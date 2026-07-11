# The Museum of Siddhartha Dhakal

An interactive 3D portfolio built as a museum you *walk through*. Scroll to move
along a fixed path, glance at the work on the walls, and click any piece to open
its case study. Everything is built from React Three Fiber primitives — no
Blender, no modelling, no physics engine.

**Stack:** Next.js 16 (App Router) · React 19 · React Three Fiber + Drei ·
Three.js · Zustand · Framer Motion · Tailwind CSS v4 · EmailJS · react-hook-form
+ Zod · TypeScript.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000  → redirects to /museum
```

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint
npx tsc --noEmit   # type-check
```

### Optional environment (contact form)

The gift-shop Visitor's Book sends mail via EmailJS. Without it the form shows a
graceful "not configured" state with a mailto fallback. To enable sending, copy
`.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=
```

Restart `npm run dev` after editing.

---

## The experience

The museum is a cruciform floor plan of five rooms, entered from the gift-shop
door:

```
                  ┌──────────────┐
                  │  Gift Shop   │  contact · resume · visitor sketch wall
                  └──────┬───────┘
   ┌──────────┐  ┌───────┴──────┐  ┌──────────┐
   │  Studio  ├──┤    Atrium    ├──┤ Archive  │
   │  about   │  │ arrival hall │  │ certs +  │
   │  + tools │  │ 2 flagships  │  │ upcoming │
   └──────────┘  └───────┬──────┘  └──────────┘
                  ┌──────┴───────┐
                  │   Gallery    │  the four selected projects
                  └──────────────┘
```

- **Atrium** — arrival hall with a circular skylight. Two flagship projects are
  featured large on the side walls.
- **Gallery** — the four selected projects as large framed exhibits, laid out
  for a U-shaped walk (down the east wall, across the back, up the west wall).
- **Studio** — the bio, tools, and exhibition history (opened from the plinth).
- **Archive** — certificates and reserved slots for upcoming work, on large
  elegant wall displays.
- **Gift Shop** — resume download, contact links, the Visitor's Book form, and
  the interactive **Visitor Wall** where anyone can leave a sketch.

### Navigation

- **Scroll / trackpad / arrow keys / W-S** walk you forward and back along a
  fixed rail path. You can't clip through walls — the path never does.
- **Mouse** adds a gentle look-around; the camera also auto-faces exhibits and
  plinths as you pass them.
- **Map HUD** (bottom-left) shows the current room and jumps you there.
- Clicking a gallery piece walks you to it, then opens its case study; clicking
  an atrium flagship opens it directly.
- A **Classic View** (2D) is served to phones and available via the toggle on
  desktop. `prefers-reduced-motion` replaces glides with instant cuts.

---

## Project structure

```
src/
  app/
    layout.tsx            Fonts (Cormorant Garamond + Inter), metadata, JSON-LD
    page.tsx              2D entrance hall -> fades into /museum
    museum/page.tsx       Mounts 3D or Classic view + all overlays
    globals.css           Design tokens + Tailwind
  components/
    ConcentricRings.tsx   Shared gold rings (entrance + loader)
    museum/
      Museum3D.tsx        Bundles the 3D-only stack (code-split)
      Scene.tsx           The <Canvas>: shell, lighting, exhibits, props
      MuseumShell.tsx     Rooms from primitives: walls, doorways, ceilings,
                          skylight, textured floors/walls, signage
      ScrollRig.tsx       Scroll/touch/key movement along the rail + gaze
      Lighting.tsx        Hemisphere fill, skylight, per-wing fills, accents
      Exhibit.tsx         Clickable framed project display (frame+mat+caption)
      WallDisplay.tsx     Non-interactive framed display (archive)
      SketchWall.tsx      Masonry grid of visitor sketches (gift shop)
      Plinth.tsx          Interactive pedestal (studio/archive/gift-shop)
      Props.tsx           Benches + archive display cases
      MapHUD.tsx          SVG floor-plan navigation
      MuseumLoader.tsx    Branded loading screen (drei useProgress)
      ClassicMuseum.tsx   2D fallback
      ViewToggle.tsx      3D <-> Classic switch (desktop)
      ScrollHint.tsx      One-time "scroll to walk" hint
    overlay/
      OverlayPanel.tsx    Shared slide-in panel shell (Framer Motion)
      ExhibitOverlay.tsx  Project case study
      StudioOverlay.tsx   About / bio / tools / timeline
      ArchiveOverlay.tsx  Archive index
      GiftShopOverlay.tsx Contact + resume + Visitor's Book form
      SketchOverlay.tsx   Drawing pad -> pins a sketch to the wall
  lib/
    projects.ts           The four gallery projects + case-study copy
    exhibitSlots.ts       Gallery slot + atrium flagship positions & sizes
    archiveDisplays.ts    Archive wall-display data
    archive.ts            Archive index items
    about.ts              Bio, tool tiers, timeline
    contact.ts            Contact details + EmailJS config
    railPath.ts           The walk path (Catmull-Rom) + POIs + room jumps
    cameraBus.ts          Named-destination -> rail position bridge
    useMuseumStore.ts     Zustand: current room + which overlay is open
    useSketchStore.ts     Visitor sketches (localStorage, backend-ready)
    useDeviceMode.ts      Mobile detection + 3D/2D preference
public/
  textures/               CC0 wood + plaster PBR maps (ambientCG)
  exhibits/               Project hero images (placeholders — swap for real)
  archive/                Certificate + upcoming-project placeholders
  resume.pdf              Placeholder resume — replace with the real PDF
```

---

## Editing content

Almost everything is data-driven — edit the `lib/` files, not the components.

| To change… | Edit |
| --- | --- |
| Projects (title, copy, tools, links) | `src/lib/projects.ts` |
| Which projects the atrium features | `ATRIUM_FEATURE_SLOTS` in `src/lib/exhibitSlots.ts` |
| Gallery / atrium display positions & sizes | `src/lib/exhibitSlots.ts` |
| Project hero images | drop into `public/exhibits/<slug>.jpg` |
| Bio, tools, timeline | `src/lib/about.ts` |
| Archive wall displays (certs, upcoming) | `src/lib/archiveDisplays.ts` + `public/archive/` |
| Archive index list | `src/lib/archive.ts` |
| Contact details / socials | `src/lib/contact.ts` |
| Resume | replace `public/resume.pdf` |
| The walk path | `STOPS` in `src/lib/railPath.ts` |
| Room layout / sizes | `ROOMS` in `src/components/museum/MuseumShell.tsx` |

The rail's per-exhibit stops and the camera's points-of-interest are derived
from the slot positions, so moving a display moves the walk and the gaze with it.

---

## Design tokens

- Background `#0E0E0E` · Charcoal `#141414` · Gold accent `#C9A961` · Off-white
  `#E8E4DC`
- Headings: Cormorant Garamond · Body: Inter · Labels: monospace, wide-tracked
- Gold is an accent only — frames, trim, signage, rules — never a fill.

---

## Notable implementation details

- **No physics.** Movement is a damped position along a Catmull-Rom curve; the
  camera gaze blends toward nearby points of interest with smoothstep weighting
  and temporal smoothing (no snapping between neighbouring exhibits).
- **Rooms are primitives.** Walls, lintels, doorways, crown moulding, baseboards
  and the skylit atrium ceiling are all `boxGeometry` / `ShapeGeometry`, driven
  by a small room-data array with per-side openings.
- **Textures** are CC0 PBR maps from [ambientCG](https://ambientcg.com) (wood
  floor, plaster walls), cloned per room so the tiling stays square.
- **Overlays are real DOM** (Framer Motion + HTML), so all project text is
  selectable, accessible, and crawlable.
- **The Visitor Wall** persists sketches in `localStorage` today; the store is
  shaped so swapping in an API (e.g. Vercel KV) makes the wall shared across
  visitors with a two-function change.
- **Code-split by device** — phones never download the 3D bundle.

---

## Credits

- Built with [React Three Fiber](https://r3f.docs.pmnd.rs) and
  [Drei](https://github.com/pmndrs/drei).
- Textures: [ambientCG](https://ambientcg.com) (CC0).
- Design & content: Siddhartha Dhakal — Frontend Web Developer, Kathmandu.

> Placeholder assets (exhibit images, certificates, resume) ship in `public/`
> and are meant to be replaced with real work.
