# rendered: the kb as the desk sees it

Output of `npm install && npm run build` (SvelteKit + mdsvex, `svelte.config.js`), copied from `build/`.

- The new page: [`kb/incidents/4471/problems.html`](kb/incidents/4471/problems.html), source `src/routes/kb/incidents/4471/problems/+page.svx`.
- Signed with the course's ticket for this Challenge (`signature:` in the frontmatter); its stamp reads **desk ref DR-RX4F-0YNE**.
- Its table is built from `src/lib/data/reports-4471.json` at render time, counted the way the desk's view counts: 412 reports merged into #4471, 3 problems: parser 379 (fixed), hint 33 (won't fix, booking-v3 retired), oneDay 5 (filed under parser, still open). Each links to its issue.

The "reviewed … days ago" line counts from the build date (2026-10-29).
