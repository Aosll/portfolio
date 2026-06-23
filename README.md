# Ömer Efe Dikici — Cinematic Portfolio

A next-generation, WebGL-driven portfolio for **Ömer Efe Dikici, Computer Engineer**.

> Built with **Three.js · GSAP · Lenis · WebGL · React**, bundled by **Vite**.

## Getting started

```bash
npm install
npm run dev      # start the dev server at http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Project structure

```
src/
├── main.jsx            # React entry
├── App.jsx             # App shell / section composition
├── styles/             # Design system (variables + global)
├── components/         # Reusable UI (layout/, ui/)
├── sections/           # Page sections (Hero, About, Projects, Experience, Contact)
├── three/             # WebGL scene engine (renderer, camera, particles, manager)
├── animations/         # Lenis + GSAP setup and primitives
├── hooks/              # Custom React hooks
├── data/               # Site + project content (single source of truth)
└── utils/              # Helpers
```

Path aliases (`@`, `@styles`, `@components`, `@sections`, `@three`,
`@animations`, `@hooks`, `@data`, `@utils`) are configured in `vite.config.js`.

## Build phases

1. **Foundation & tech stack** ✅ — repo, Vite, structure, design tokens
2. Global design system & glass UI
3. Lenis smooth scroll + GSAP core
4. Three.js WebGL scene engine
5. Hero — cinematic entry
6. About & skills — interactive stack
7. Projects — immersive 3D showcases
8. Experience, certs & education
9. Contact, polish & deployment

## Featured projects

- **ILTER-AKKE Smart Glove** — gesture-driven command & control wearable
- **FakeIoT Honeypot** — IoT deception & threat-intelligence honeypot
- **CampusQuest** — iOS exploration game
