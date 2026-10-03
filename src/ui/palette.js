import { projects, profile } from '../data.js';
import { $, toast, copyText, escapeHtml } from './dom.js';

import sectionSvg from '@phosphor-icons/core/assets/regular/hash.svg?raw';
import projectSvg from '@phosphor-icons/core/assets/regular/folder-simple.svg?raw';
import linkSvg from '@phosphor-icons/core/assets/regular/arrow-up-right.svg?raw';
import actionSvg from '@phosphor-icons/core/assets/regular/lightning.svg?raw';

const ICONS = { section: sectionSvg, project: projectSvg, link: linkSvg, action: actionSvg };
const icon = (k) => ICONS[k].replace('<svg ', '<svg class="icon" aria-hidden="true" ');

export function initPalette(actions) {
  const root = $('#palette');
  const input = $('#palette-input');
  const list = $('#palette-list');
  let items = [];
  let filtered = [];
  let index = 0;
  let lastFocus = null;

  const sections = [
    ['About', '#about'],
    ['Technology stack', '#stack'],
    ['SOC lab console', '#soc'],
    ['Selected work', '#work'],
    ['Experience and community', '#experience'],
    ['Awards and certifications', '#awards'],
    ['Terminal', '#terminal'],
    ['Contact', '#contact'],
  ];

  const build = () => [
    ...sections.map(([label, href]) => ({ group: 'Go to', label, kind: 'section', run: () => actions.scrollTo(href) })),
    ...projects.map((p) => ({ group: 'Projects', label: p.name, hint: p.context, kind: 'project', run: () => actions.openProject(p.id) })),
    { group: 'Actions', label: 'Open recruiter view', kind: 'action', run: actions.openRecruiter },
    { group: 'Actions', label: 'Open the terminal', kind: 'action', run: actions.focusTerminal },
    {
      group: 'Actions',
      label: 'Copy email address',
      hint: profile.email,
      kind: 'action',
      run: async () => toast((await copyText(profile.email)) ? 'Email copied to clipboard' : profile.email),
    },
    { group: 'Links', label: 'LinkedIn', hint: 'in/zakaria-ali-955810282', kind: 'link', run: () => window.open(profile.linkedin, '_blank', 'noopener') },
    { group: 'Links', label: 'GitHub', hint: 'github.com/NanoFGX', kind: 'link', run: () => window.open(profile.github, '_blank', 'noopener') },
    { group: 'Links', label: 'Send an email', hint: profile.email, kind: 'link', run: () => (window.location.href = `mailto:${profile.email}`) },
  ];

  const render = () => {
    const q = input.value.trim().toLowerCase();
    filtered = items.filter((it) => !q || `${it.label} ${it.hint || ''} ${it.group}`.toLowerCase().includes(q));
    index = Math.min(index, Math.max(0, filtered.length - 1));
    if (!filtered.length) {
      list.innerHTML = `<li class="palette__empty">No match for “${escapeHtml(input.value)}”. Try a project name or “contact”.</li>`;
      input.removeAttribute('aria-activedescendant');
      return;
    }
    let html = '';
    let group = '';
    filtered.forEach((it, i) => {
      if (it.group !== group) {
        group = it.group;
        html += `<li class="palette__group" role="presentation">${group}</li>`;
      }
      html += `<li class="palette__item" role="option" id="pal-${i}" data-i="${i}" aria-selected="${i === index}">
        ${icon(it.kind)}<span>${escapeHtml(it.label)}</span>${it.hint ? `<small>${escapeHtml(it.hint)}</small>` : ''}</li>`;
    });
    list.innerHTML = html;
    input.setAttribute('aria-activedescendant', `pal-${index}`);
  };

  const highlight = (i) => {
    index = (i + filtered.length) % filtered.length;
    list.querySelectorAll('.palette__item').forEach((el) => el.setAttribute('aria-selected', String(Number(el.dataset.i) === index)));
    input.setAttribute('aria-activedescendant', `pal-${index}`);
    document.getElementById(`pal-${index}`)?.scrollIntoView({ block: 'nearest' });
  };

  // No open/close animation: this is a keyboard tool used repeatedly.
  const open = () => {
    if (!root.hidden) return;
    lastFocus = document.activeElement;
    items = build();
    input.value = '';
    index = 0;
    root.hidden = false;
    render();
    input.focus();
  };
  const close = (restore = true) => {
    if (root.hidden) return;
    root.hidden = true;
    if (restore) lastFocus?.focus?.();
  };
  const run = (i) => {
    const it = filtered[i];
    if (!it) return;
    close(false);
    it.run();
  };

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      root.hidden ? open() : close();
    }
  });
  document.querySelectorAll('[data-open-palette]').forEach((b) => b.addEventListener('click', open));
  root.querySelectorAll('[data-close-palette]').forEach((b) => b.addEventListener('click', () => close()));

  input.addEventListener('input', () => {
    index = 0;
    render();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlight(index + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlight(index - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(index);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'Tab') {
      e.preventDefault();
    }
  });
  list.addEventListener('pointermove', (e) => {
    const li = e.target.closest('.palette__item');
    if (li && Number(li.dataset.i) !== index) highlight(Number(li.dataset.i));
  });
  list.addEventListener('click', (e) => {
    const li = e.target.closest('.palette__item');
    if (li) run(Number(li.dataset.i));
  });
}
