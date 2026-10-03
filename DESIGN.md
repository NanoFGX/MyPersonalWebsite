---
name: zakaria.sys
description: SOC Command Center portfolio. An operations console watching itself, with one live particle system at its core.
colors:
  ground: "#0b0d10"
  ground-2: "#0f1216"
  panel: "rgba(19, 23, 29, 0.82)"
  panel-solid: "#13171d"
  raise: "#181d24"
  line: "rgba(214, 226, 240, 0.08)"
  line-2: "rgba(214, 226, 240, 0.15)"
  line-3: "rgba(214, 226, 240, 0.26)"
  ink: "#e7ebf0"
  ink-2: "#a6afbb"
  ink-3: "#8b94a1"
  particle: "#b9c4d2"
  signal: "#f5b03c"
  signal-ink: "#15110a"
  signal-soft: "rgba(245, 176, 60, 0.12)"
  signal-line: "rgba(245, 176, 60, 0.42)"
  critical: "#ff7a66"
typography:
  display:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 1.6rem + 5vw, 6rem)"
    fontWeight: 650
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.2rem + 2.6vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1rem + 1vw, 1.9rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  telemetry:
    fontFamily: "JetBrains Mono Variable, ui-monospace, Menlo, monospace"
    fontSize: "0.76rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  instrument: "2px"
spacing:
  gutter: "clamp(16px, 4vw, 48px)"
  section: "clamp(96px, 12vw, 168px)"
  nav: "64px"
  maxw: "1320px"
components:
  button-primary:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.signal-ink}"
    rounded: "{rounded.instrument}"
    height: "48px"
    padding: "0 20px"
  button-ghost:
    backgroundColor: "rgba(19, 23, 29, 0.6)"
    textColor: "{colors.ink}"
    rounded: "{rounded.instrument}"
    height: "48px"
    padding: "0 20px"
  tab-selected:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.signal-ink}"
    rounded: "{rounded.instrument}"
    height: "40px"
  chip-pressed:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    rounded: "{rounded.instrument}"
    height: "36px"
  panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.instrument}"
  console:
    backgroundColor: "rgba(10, 12, 15, 0.9)"
    textColor: "{colors.ink}"
    typography: "{typography.telemetry}"
    rounded: "{rounded.instrument}"
---

## Overview

A dark operations console for a candidate who builds, ships and defends software. The page is an instrument rather than a brochure. One fixed WebGL particle system (14,000 points, 7,000 on phones) re-forms into the subject of each section as you scroll: globe, monogram, server racks, shield, helix, terrain, medal, lattice, portal. Real numbers, logs and a working shell surround it. Every fact maps to the CV or a repository.

Dark is chosen by scene, not by category: recruiters and engineers reading a SOC-and-DevOps story at a desk, the same light their own monitoring tools live in.

## Colors

- **Ground** `#0b0d10` is a blue-black and never pure black. Panels sit at 82 to 90 percent opacity over the scene so the particles glow through softly.
- **Ink** runs in three steps (`#e7ebf0`, `#a6afbb`, `#8b94a1`). All three pass AA on the ground.
- **Signal amber** `#f5b03c` is the only accent. It is reserved for live state (the availability dot, the HUD shape name), the primary action, the selected tab, metric values and technique IDs. Never add a second accent.
- **Critical** `#ff7a66` appears only on simulated alerts at level 12 and above.
- Brand logos render monochrome in `ink-2` and take their own brand colour only on hover. Near-black brands fall back to ink.

## Typography

Geist for display, headings and body. JetBrains Mono strictly for data: telemetry keys, dates, IDs, metric values, the console, the shell and kbd hints. Mono is never decoration.
Display tracking bottoms out at -0.04em. Headings use `text-wrap: balance`. Body measure stays at 60 to 76ch.

## Layout

12-column grid inside a 1320px wrap with a fluid gutter. The scene owns one side of each section and the copy owns the other: hero copy left with the scene right; About copy right with the monogram left; and so on. Every section uses a different layout family: split hero, text + readout panel, tabbed logo grid, two-column lab console, accordion case list + compact grid, sticky intro + tabbed timeline, asymmetric awards bento + grouped cert lists, terminal, manifesto close. Below 960px everything collapses to one column. On phones the scene moves above or behind the copy and dims.

## Elevation & Depth

Depth comes from the particle scene and from translucency, not shadows. Panels use a 1px `line-2` border plus a 10px backdrop blur. Only floating tools (console, terminal, palette, drawer) carry a soft offset shadow (`0 30px 80px -30px rgba(0,0,0,.7)`). The fixed nav gains a blurred backdrop after 40px of scroll.

## Shapes

Every corner is `2px`: buttons, tabs, chips, panels, the console, kbd and the HUD. The only round shapes are status dots and the terminal's window dots. Rules are 1px hairlines in `line` or `line-2`, used once per group (top border for a list, bottom border per row), never both on every row.

## Components

- **Buttons:** primary amber with dark ink, ghost translucent with a hairline. 48px, or 36px for `--sm`. Press feedback is `scale(0.97)` over 160ms.
- **Tabs and chips:** a selected tab fills amber, a pressed filter chip fills ink. Tabs support arrow, Home and End keys.
- **Case file (project row):** a full-width accordion row with name, context, an amber mono metric, a date and a caret. The body expands with GSAP (420ms expo.out in, 260ms out) to points, stack logos and repository links.
- **Console:** a mono alert table streaming simulated Wazuh events every 2.3 to 3.7s, honestly labelled. It pauses off-screen, on a hidden tab or by user toggle.
- **Terminal:** opens with `whoami` and `nmap` already run. Has tab completion and history.
- **Command palette (Ctrl/Cmd K):** no open or close animation, because it is a keyboard tool.
- **Recruiter drawer:** slides from the right (420ms drawer curve in, 240ms out). Doubles as the print layout.
- **HUD:** a solid mono status pill showing the live point count, shape and section, visible only over the hero.

## Do's and Don'ts

- Do keep one amber accent and 2px corners everywhere.
- Do label anything simulated as simulated. Do not invent metrics, testimonials or links.
- Do give every new section a scene shape and a pose (`data-shape`, `data-pose`, `data-pose-mobile`) rather than a static illustration.
- Don't add eyebrows or section numbers above headings, gradient text, glows or a second accent colour.
- Don't animate keyboard-driven UI. Keep UI motion under 300ms and use ease-out curves (`cubic-bezier(0.23, 1, 0.32, 1)`).
- Don't gate controls behind scroll reveals. Reveals rest at a faint visible state, never at zero.
