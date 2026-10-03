// Build-time HTML renderer. Runs inside Vite's Node process (see vite.config.js),
// so every section ships as static markup and JavaScript only adds behaviour.
import { readFileSync } from 'node:fs';
import * as si from 'simple-icons';
import {
  profile,
  telemetry,
  education,
  languages,
  stack,
  socLab,
  filters,
  projects,
  moreProjects,
  experience,
  awards,
  alsoCompeted,
  certifications,
} from '../data.js';

const phosphorDir = new URL('../../node_modules/@phosphor-icons/core/assets/regular/', import.meta.url);

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function ph(name, cls = 'icon') {
  const svg = readFileSync(new URL(`${name}.svg`, phosphorDir), 'utf8');
  return svg.replace('<svg ', `<svg class="${cls}" aria-hidden="true" focusable="false" `);
}

// Brand marks from Simple Icons. `--brand` drives the hover colour; near-black brands fall back to ink.
export function logo(key, cls = 'logo') {
  if (key.startsWith('ph:')) return ph(key.slice(3), `${cls} logo--glyph`);
  const icon = si[key];
  if (!icon) return ph('cube', cls);
  const lum = parseInt(icon.hex.slice(0, 2), 16) * 0.3 + parseInt(icon.hex.slice(2, 4), 16) * 0.59 + parseInt(icon.hex.slice(4, 6), 16) * 0.11;
  const brand = lum < 70 ? 'var(--fg)' : `#${icon.hex}`;
  return `<svg class="${cls}" style="--brand:${brand}" viewBox="0 0 24 24" role="img" aria-label="${esc(icon.title)}"><path fill="currentColor" d="${icon.path}"/></svg>`;
}

const linkIcon = (kind) => (kind === 'github' ? ph('github-logo') : kind === 'arrow' ? ph('arrow-down') : ph('arrow-up-right'));

function renderTelemetry() {
  const rows = telemetry
    .map(
      (t) => `<li class="readout__row" data-reveal-item>
        <span class="readout__key">${esc(t.key)}</span>
        <span class="readout__value">${esc(t.value)}</span>
        <span class="readout__note">${esc(t.note)}</span>
      </li>`
    )
    .join('');
  return `<ul class="readout" aria-label="Key facts">${rows}</ul>`;
}

function renderEducation() {
  return education
    .map(
      (e) => `<li class="edu__item" data-reveal-item>
        <div class="edu__head"><span class="edu__school">${esc(e.school)}</span><span class="edu__years mono">${esc(e.years)}</span></div>
        <div class="edu__detail">${esc(e.detail)} <span class="edu__score mono">${esc(e.score)}</span></div>
      </li>`
    )
    .join('');
}

function renderLanguages() {
  return languages
    .map((l) => `<li><span class="lang__name">${esc(l.name)}</span><span class="lang__level">${esc(l.level)}</span></li>`)
    .join('');
}

function renderStack() {
  const tabs = stack
    .map(
      (g, i) => `<button class="tabs__tab" role="tab" id="stack-tab-${g.id}" aria-controls="stack-panel-${g.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">
        ${esc(g.label)}<span class="tabs__count mono">${g.items.length}</span></button>`
    )
    .join('');
  const panels = stack
    .map(
      (g, i) => `<div class="stack__panel" role="tabpanel" id="stack-panel-${g.id}" aria-labelledby="stack-tab-${g.id}" tabindex="0" ${i === 0 ? '' : 'hidden'}>
        <ul class="stack__grid">${g.items
          .map((it) => `<li class="stack__item">${logo(it.icon, 'logo stack__logo')}<span>${esc(it.name)}</span></li>`)
          .join('')}</ul></div>`
    )
    .join('');
  return `<div class="tabs" data-tabs>
    <div class="tabs__list" role="tablist" aria-label="Technology categories">${tabs}</div>
    ${panels}
  </div>`;
}

function renderSoc() {
  const points = socLab.points.map((p) => `<li>${esc(p)}</li>`).join('');
  const techniques = socLab.techniques
    .map(
      (t) => `<li><a class="technique" href="https://attack.mitre.org/techniques/${t.id.replace('.', '/')}/" target="_blank" rel="noopener">
        <span class="technique__id mono">${esc(t.id)}</span><span class="technique__name">${esc(t.name)}</span>${ph('arrow-up-right', 'icon icon--sm')}</a></li>`
    )
    .join('');
  const tools = socLab.tools.map((t) => `<li>${esc(t)}</li>`).join('');
  return { points, techniques, tools };
}

function renderProjects() {
  const chips = filters
    .map(
      (f, i) => `<button class="chip" type="button" data-filter="${f.id}" aria-pressed="${i === 0}">${esc(f.label)}</button>`
    )
    .join('');

  const rows = projects
    .map((p) => {
      const stackIcons = p.stack.map((k) => logo(k, 'logo case__logo')).join('');
      const links = p.links
        .map(
          (l) =>
            `<a class="link-btn" href="${esc(l.href)}" ${l.href.startsWith('#') ? '' : 'target="_blank" rel="noopener"'}>${linkIcon(l.icon)}<span>${esc(l.label)}</span></a>`
        )
        .join('');
      return `<li class="case" data-tags="${p.tags.join(' ')}" id="project-${p.id}" data-reveal-item>
        <h3 class="case__heading">
          <button class="case__toggle" type="button" id="case-btn-${p.id}" aria-expanded="false" aria-controls="case-body-${p.id}">
            <span class="case__title">
              <span class="case__name">${esc(p.name)}</span>
              <span class="case__context">${esc(p.context)}</span>
            </span>
            <span class="case__metric"><span class="case__metric-value mono">${esc(p.metric.value)}</span><span class="case__metric-label">${esc(p.metric.label)}</span></span>
            <span class="case__date mono">${esc(p.date)}</span>
            <span class="case__caret">${ph('caret-down')}</span>
          </button>
        </h3>
        <div class="case__body" id="case-body-${p.id}" role="region" aria-labelledby="case-btn-${p.id}" hidden>
          <div class="case__inner">
            <p class="case__blurb">${esc(p.blurb)}</p>
            <ul class="case__points">${p.points.map((pt) => `<li>${esc(pt)}</li>`).join('')}</ul>
            <div class="case__foot">
              <div class="case__stack">${stackIcons}<span class="case__stack-names">${esc(p.stackNames)}</span></div>
              <div class="case__links">${links || '<span class="case__nolink">No public repository</span>'}</div>
            </div>
          </div>
        </div>
      </li>`;
    })
    .join('');

  const more = moreProjects
    .map(
      (p) => `<li class="mini" data-tags="${p.tags.join(' ')}">
        <div class="mini__head"><h4 class="mini__name">${esc(p.name)}</h4><span class="mini__date mono">${esc(p.date)}</span></div>
        <p class="mini__context">${esc(p.context)}</p>
        <p class="mini__text">${esc(p.text)}</p>
        <div class="mini__foot"><span class="mini__stack mono">${esc(p.stack)}</span>
          <span class="mini__links">${
            p.links.length
              ? p.links
                  .map((l) => `<a href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}${ph('arrow-up-right', 'icon icon--sm')}</a>`)
                  .join('')
              : '<span class="mini__private">Private repo</span>'
          }</span></div>
      </li>`
    )
    .join('');

  return { chips, rows, more };
}

function renderExperience() {
  const work = experience.work
    .map(
      (w) => `<li class="tl__item">
        <div class="tl__meta mono">${esc(w.date)}</div>
        <div class="tl__body">
          <h3 class="tl__title">${esc(w.title)}</h3>
          <p class="tl__org">${esc(w.org)}</p>
          <ul class="tl__points">${w.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
          <p class="tl__tools mono">${esc(w.tools)}</p>
        </div>
      </li>`
    )
    .join('');
  const simple = (list) =>
    list
      .map(
        (l) => `<li class="tl__item tl__item--simple">
        <div class="tl__meta mono">${esc(l.date)}</div>
        <div class="tl__body"><h3 class="tl__title">${esc(l.title)}</h3><p class="tl__org">${esc(l.org)}</p></div>
      </li>`
      )
      .join('');
  return { work, leadership: simple(experience.leadership), volunteering: simple(experience.volunteering) };
}

function renderAwards() {
  return awards
    .map(
      (a, i) => `<li class="award award--${a.size}" data-reveal-item>
        <span class="award__rank">${esc(a.rank)}</span>
        <span class="award__event">${esc(a.event)}</span>
        <span class="award__note">${esc(a.note)}</span>
        ${i === 0 ? ph('trophy', 'icon award__icon') : ''}
      </li>`
    )
    .join('');
}

function renderCerts() {
  return certifications
    .map(
      (g) => `<div class="certs__group">
        <h3 class="certs__title">${esc(g.group)}</h3>
        <ul class="certs__list">${g.items
          .map(
            (c) => `<li class="cert${c.progress ? ' cert--progress' : ''}">
              ${logo(c.icon, 'logo cert__logo')}
              <span class="cert__name">${esc(c.name)}</span>
              <span class="cert__issuer">${esc(c.issuer)}</span>
              <span class="cert__date mono">${esc(c.date)}</span>
            </li>`
          )
          .join('')}</ul>
      </div>`
    )
    .join('');
}

export function renderAll() {
  const soc = renderSoc();
  const work = renderProjects();
  const exp = renderExperience();
  return {
    'telemetry': renderTelemetry(),
    'education': renderEducation(),
    'languages': renderLanguages(),
    'stack': renderStack(),
    'soc-points': soc.points,
    'soc-techniques': soc.techniques,
    'soc-tools': soc.tools,
    'filters': work.chips,
    'projects': work.rows,
    'more-projects': work.more,
    'exp-work': exp.work,
    'exp-leadership': exp.leadership,
    'exp-volunteering': exp.volunteering,
    'awards': renderAwards(),
    'also-competed': esc(alsoCompeted),
    'certs': renderCerts(),
    'summary': esc(profile.summary),
  };
}

// `{{icon:name}}` in index.html becomes an inline Phosphor SVG.
export function renderTemplate(html) {
  const parts = renderAll();
  return html
    .replace(/<!--@([a-z-]+)-->/g, (m, key) => (key in parts ? parts[key] : m))
    .replace(/\{\{icon:([a-z-]+)(?:\|([a-z- ]+))?\}\}/g, (m, name, cls) => ph(name, cls ? `icon ${cls}` : 'icon'))
    .replace(/\{\{logo:([A-Za-z:-]+)\}\}/g, (m, key) => logo(key));
}
