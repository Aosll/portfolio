# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A cinematic, WebGL-driven portfolio site for **Ömer Efe Dikici (Computer Engineer)**. It is being built **phase-by-phase from a fixed 9-phase build guide** that the user pastes one sub-step at a time. Implement each pasted spec **exactly as written** (versions, file names, token values, store shape) — do not improvise stack choices or "upgrade" dependencies. After a phase: verify the build, verify in the browser, then commit that phase before moving on.

This project lives at its own repo root. The unrelated `~/Desktop/campusquest` repo is sometimes the terminal's working directory but must be left untouched — all portfolio files go here.

## Commands

```bash
npm run dev      # Vite dev server at http://localhost:5173 (host: true → exposed on LAN)
npm run build    # production build → dist/
npm run preview  # serve the production build at http://localhost:4173
```

There is **no test runner and no linter configured** — do not invent `npm test`/`npm run lint`. Verification is: `npm run build` passes + visual check in the browser.

## Intentional version pins (do not bump)

The stack is deliberately pinned and the spec depends on it:

- **React 18** (`^18.3.0`) — not React 19.
- **Vite 5** (`^5.4.0`, Rollup-based) — not Vite 6/7/8 (Rolldown). `build.target: 'esnext'`.
- **React Three Fiber 8 + drei 9** — R3F is used **declaratively** (JSX scene graph), not via vanilla Three.js imperative code.
- `@studio-freight/lenis` is deprecated upstream but spec-pinned; keep it.
- `@rollup/pluginutils` (dev) is present only to silence a `vite-plugin-glsl` warning on Vite <6.3. A remaining cosmetic "esbuild not found" GLSL warning is expected — leave it.

## Architecture

**Single sources of truth — keep these in sync:**

- `src/styles/variables.css` is the canonical design-token store (CSS custom properties: colors, fonts, fluid type scale, spacing, blur/glow, easings). `globals.css` `@import`s `variables.css` then `animations.css`.
- `src/utils/colors.js` is a **JS mirror** of the color tokens so the Three.js/GSAP layer shares one palette (`COLORS` strings + `COLORS_HEX` `0x…` numbers). When a color changes in `variables.css`, update `colors.js` too.
- `src/data/site.js` (`SITE`, `SOCIALS`) and `src/data/projects.js` (`PROJECTS`) are the content source of truth. Sections **read copy from these** rather than hardcoding it.

**Global state:** `src/store/useStore.js` — a single Zustand store holding cross-cutting UI/scroll state (`currentSection`, `scrollProgress`, `isMenuOpen`, `isLoading` (starts `true`), `loadingProgress`, `activeProject`, `isMobile`) plus their setters/toggles.

**Sections:** `src/sections/<Name>/<Name>Section.jsx`, composed in `App.jsx`. Each renders a `<section id="…">`. Currently Phase-1 stubs to be filled in later phases. The Hero folder additionally has `HeroScene.jsx` (the R3F `<Canvas>` for that section). `src/sections/Projects/<Project>/` subfolders (CampusQuest, FakeIoT, IlterAkke) are placeholders for the Phase 7 immersive 3D showcases.

**Shaders:** `src/shaders/*.vert` / `*.frag` are imported as strings via `vite-plugin-glsl` and fed to Three.js shader materials.

**Hooks:** `src/hooks/` — `useScrollProgress`, `useLenis`, `useThreeScene`, and `useGSAP` (re-exports `useGSAP` from `@gsap/react`).

## Path aliases (the real list — from `vite.config.js`, NOT the README)

`@` → `src/`, `@components`, `@sections`, `@utils`, `@hooks`, `@assets`, `@shaders`. The README's structure section lists extra aliases (`@styles`, `@three`, `@animations`, `@data`) and folders that **do not exist** — trust `vite.config.js`.

## Commit convention

Per the user's standing preference: short commit messages, **no `Co-Authored-By` / Claude trailer**. One commit per completed build phase.
