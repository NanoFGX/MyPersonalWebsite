# zakaria.sys

Portfolio of **Zakaria Bin Ali**, final-year Computer Science student at Universiti Putra Malaysia, seeking a DevOps, Cybersecurity (SOC) or Software Development internship from March 2027.

Live site (after the first deploy): https://nanofgx.github.io/MyPersonalWebsite/

## What is in it

- **Scroll-driven WebGL scene.** One Three.js particle system (14k points, 7k on phones) morphs between nine shapes as you scroll: globe, monogram, server racks, shield, helix, terrain, medal, lattice and portal. The morph runs in a custom shader with staggered per-particle timing.
- **SOC lab console.** A simulated Wazuh alert stream modelled on the BlackBerry SOC lab scenarios, with links to the matching MITRE ATT&CK techniques. It pauses when off-screen or when the tab is hidden.
- **Interactive terminal.** `help`, `whoami`, `projects`, `open <id>`, `nmap`, `sudo hire-me` and more, with tab completion and history.
- **Command palette.** Press `Ctrl K` (or `⌘ K`) to jump to any section or project, copy the email address or open links.
- **Recruiter view.** A 30-second summary drawer with a print-ready one-page layout.
- **Prerendered HTML.** Every section is rendered to static markup at build time from `src/data.js`, so the content is indexable and readable without JavaScript.
- Respects `prefers-reduced-motion`, works with keyboard only, and passes WCAG AA contrast.

## Stack

Vite, vanilla JavaScript, Three.js, GSAP ScrollTrigger, Lenis, Simple Icons, Phosphor Icons, Geist and JetBrains Mono (self-hosted). Deployed to GitHub Pages by GitHub Actions.

## Develop

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # outputs dist/
npm run preview
```

All content lives in `src/data.js`. Edit it and the page re-renders.

## Deploy

`.github/workflows/deploy.yml` builds on every push and pull request, and deploys the repository's default branch to GitHub Pages.

One-time setup in the repository: **Settings > Pages > Build and deployment > Source: GitHub Actions**.

The site is served under `/MyPersonalWebsite/`. For a custom domain, set `BASE_PATH=/` in the workflow's build step.

## Optional assets

- **CV download:** add `public/cv/Zakaria_Bin_Ali_CV.pdf`. The Download CV button only appears once the file is deployed.
- **Portrait:** `public/images/zakaria-portrait.webp` (with a JPEG fallback), cropped and graded from the owner's photo.
