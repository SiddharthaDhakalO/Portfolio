---
name: verify
description: Build, launch, and visually drive the 3D museum portfolio to verify changes end-to-end (dev server + headless Edge screenshots).
---

# Verifying changes in the 3D museum

The runtime surface is the WebGL canvas at `http://localhost:3000/museum`
(3D mode is desktop-only; phones get ClassicMuseum).

## Launch

```bash
npm run dev   # ready in ~3s on http://localhost:3000
```

## Drive (no Playwright browsers needed)

Install `playwright-core` in a scratch dir and launch the system Edge:

```js
const { chromium } = require('playwright-core');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 810 } });
await page.goto('http://localhost:3000/museum');
await page.waitForSelector('canvas', { timeout: 120000 });
// Loader: wait for [role="status"] detached, then ≥5s more or its
// fade-out ghost bleeds into the first screenshot.
```

## Gotchas that produced false FAILs before

- **Wheel walking**: move the mouse to canvas centre first
  (`page.mouse.move(720, 405)`), then `page.mouse.wheel(0, 120)` per notch.
  One notch (deltaY 120) ≈ 2.7 m of walk; the camera speed cap is 10 m/s,
  so wait ~1s per 2–3 notches. If the cursor is over the Map HUD
  (bottom-left), wheel events never reach the canvas.
- **Map jumps**: click the visible SVG chips —
  `page.locator('svg g:has(title:has-text("Atrium")))').click()`.
  Do NOT click the visually-hidden accessibility buttons with
  `{ force: true }`; the click lands on the HUD panel instead.
  Long jumps (studio → plaza) take 10–13 s of walk time.
- **Room assertion**: read the HUD label —
  the span right after the span with text `Floor plan`.
- Capture `pageerror` and console errors; the scene should produce none.

## What to check after scene changes

Screenshot at least: plaza start (pavilion + stele), the door approach
(sliding doors open within ~8 m), inside the lobby (sun striping through
the glass), atrium, and one map jump that crosses the entrance doors.
