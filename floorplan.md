[prepend the master context preamble]

Component: components/museum/MuseumShell.tsx

Task: Replace the cross/plus room layout with a MODERNIST FREE PLAN
(Mies — Barcelona Pavilion / Neue Nationalgalerie). No enclosed rooms,
no doorways.

Envelope:
- Floor plane 40 x 28 (x: -20..20, z: -14..14), colour #141414.
- Ceiling slab at y=6, colour #0E0E0E. Keep it a flat box.
- Perimeter: glass on the entry side (+z). Use a meshPhysicalMaterial
  with transmission ~0.9, thickness 0.5, roughness 0.05, ior 1.5, and
  slim #C9A961 mullion boxes every 4 units. Other three sides are solid
  wall boxes (#0E0E0E, thickness 0.2, height 6).

Floating partitions (this IS the plan):
- Free-standing wall boxes, thickness 0.2, height 4 ONLY — they stop 2
  units short of the 6-unit ceiling so light passes over them. This gap
  is the whole effect; do not make them full height.
- They must NEVER meet at corners to form a closed room. Every partition
  is an island with clear air at both ends.
- Drive from a data array so I can tune by numbers:
  partitions = [{ id, position:[x,z], size:[length], rotation:y }]
- Place roughly 7: two defining a gallery zone at -x, two for a studio
  zone at +x, one for an archive zone at -z, one screening a giftshop
  zone, one short blade near the entry. Vary the rotations — some at 90°,
  at least two at odd angles (e.g. 0.3 rad). Asymmetry is the point.
- Leave the centre (around [0,0]) open as the atrium.

Zones are defined by partition PROXIMITY, not walls. A visitor standing
in any zone must still glimpse at least two other zones past the edge of
a partition. Verify this before you finish.

Acceptance: an open, asymmetric, glass-fronted hall. No doorways exist.
Sightlines run through the whole space. Partitions float clear of the
ceiling and never touch each other.


Continuation 
TASK 1:
[prepend the master context preamble]

Component: components/museum/SculptureGarden.tsx (+ Plaza)

Task: Move the Archive out of the building and into the plaza as an
outdoor sculpture garden. Interior archive partitions can then be removed.

Data:
- Source from getProjectsByWing("archive") in lib/projects.ts. Do NOT
  hardcode. Each archive entry becomes one sculpture.

Each sculpture (build a <Sculpture> component):
- Pedestal: boxGeometry, ~0.6 x 1.0 x 0.6, colour #E8E4DC (pale concrete,
  reads against the plaza), roughness 0.9.
- Object on top: a low-poly primitive form — vary them per project
  (icosahedron, torus knot, stacked boxes), scale ~0.5, material #C9A961
  metalness 0.7 roughness 0.35. Leave the geometry choice as a prop so I
  can swap in a CC0 GLB later.
- Plaque: a small angled box on the pedestal face + Drei <Html> with the
  project title in 10px uppercase, letter-spacing 0.15em. distanceFactor
  set so it fades with distance; occlude enabled.
- onClick -> glide to that sculpture's waypoint, then open the SAME 2D
  overlay used by wall exhibits (reuse the store: selectedSlug +
  isOverlayOpen). One content path, two placements.
- Hover: object lifts ~0.05 and brightens, via useFrame lerp.

Placement — CRITICAL:
- Place them along ONE edge or axis of the plaza only. The plaza must
  stay mostly EMPTY — the void is what makes the building monumental.
  Do not scatter them across the whole forecourt.
- Space them ~4 units apart. Vary the object rotation per pedestal.

Lighting:
- Outdoors, so NO spotlights. They read from the existing sun/Environment.
  Ensure pedestals cast shadows onto the plaza — the long shadows are the
  entire effect.

Also add "acquisitions in progress": one empty pedestal at the end of the
line, no object, plaque reading "The collection is still growing."

Acceptance: sculptures line one axis, cast long shadows, the plaza still
reads mostly empty, and clicking one opens the same overlay as a wall
exhibit.



TASK 2:
[prepend the master context preamble]

Component: components/museum/PlazaApproach.tsx

Task: Give the plaza a procession. Right now the camera arrives at an
angle with no sense of approach.

Axis:
- Define a straight walking axis from a new "arrival" waypoint at the FAR
  end of the plaza, running to the entrance, with the reflecting pool
  alongside it (not across it).
- The camera must travel this axis on entry, so the building grows in
  frame while staying still. Add intermediate waypoints: arrival ->
  approach -> entrance -> atrium.

Banners:
- 4-6 vertical banners along the axis: thin boxGeometry (0.02 deep,
  ~0.8 x 3), hung from slim #C9A961 poles.
- Texture each with a project name / "THE MUSEUM OF SIDDHARTHA DHAKAL" in
  gold on #0E0E0E. Generate the textures with CanvasTexture in code — no
  image files.
- Give them a very subtle sway: useFrame, tiny rotation.z sine, amplitude
  ~0.01 rad, different phase offset per banner. Barely perceptible.

Ground text:
- One large planeGeometry laid flat on the plaza along the axis, with a
  CanvasTexture wordmark ("SIDDHARTHA DHAKAL"), very low contrast against
  the paving — just visibly inlaid, not painted on.
- Scale it so it only fully resolves from the high arrival waypoint.

Acceptance: entering from arrival walks the visitor down a real axis past
banners and the pool; the ground wordmark resolves from the arrival angle;
the plaza still feels restrained, not decorated.


TASK 3: FIX
[prepend the master context preamble]

Component: PlazaApproach.tsx + SculptureGarden.tsx — CORRECTIVE PASS

The plaza is cluttered and the banners dwarf the building. Fix by
REMOVING and RESCALING. Do not add anything new.

1. DELETE the ground text entirely. The monolith already states the name.
   One name statement only.

2. RESCALE the banners. Human eye height in this scene is 1.6 units — use
   it as the yardstick.
   - Pole: 4 units tall, 0.06 radius.
   - Fabric: 0.7 wide x 2.5 tall, hanging from 3.6 down to 1.1.
   - HARD RULE: no banner may exceed 4 units total, ever. Nothing in the
     plaza may be taller than the building.

3. REPOSITION the banners.
   - Reduce to 4.
   - Line them along ONE edge, parallel to the walking axis, offset ~6
     units to the SIDE of it. They flank the walk; they never stand in it
     or in front of the entrance.
   - Set the nearest one BACK at least 10 units from the façade. The zone
     directly in front of the building stays empty.
   - Even spacing, ~5 units apart, all identical scale. The current
     random scales/depths read as chaos.

4. Banner content: project names ONLY. Never the museum name — the
   monolith owns that.

5. RESCALE + RESPACE the sculptures. Pedestals are too small and bunched
   at the entrance. Pedestal 0.6 x 1.0 x 0.6 with the object ~0.5 on top
   (so the whole piece reads just below eye height). Line them along the
   OPPOSITE edge from the banners, ~5 units apart, also set back 10+
   units from the façade.

6. The centre of the plaza — the axis corridor and everything within 10
   units of the façade — stays EMPTY. Empty is the design. If in doubt,
   remove.

Acceptance: from the arrival waypoint the building is fully unobstructed
and is the tallest thing in frame. Banners read as human-scale markers
flanking the walk. The centre of the plaza is empty.
