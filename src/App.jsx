import { SITE } from './data/site.js';

/**
 * App shell.
 *
 * Phase 1 renders a foundation placeholder so we can confirm the toolchain,
 * aliases and design tokens are wired up. Sections (Hero, About, Projects,
 * Experience, Contact) and the WebGL canvas are layered in from Phase 4 onward.
 */
export default function App() {
  return (
    <main className="app-shell">
      <section className="boot">
        <p className="boot__eyebrow">Phase 1 · Foundation online</p>
        <h1 className="boot__title">{SITE.name}</h1>
        <p className="boot__role">{SITE.role}</p>
        <p className="boot__tagline">{SITE.tagline}</p>

        <ul className="boot__stack" aria-label="Tech stack">
          {SITE.stack.map((tech) => (
            <li key={tech} className="boot__chip">
              {tech}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
