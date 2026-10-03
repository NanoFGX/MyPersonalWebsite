import '@fontsource-variable/geist';
import '@fontsource-variable/jetbrains-mono';
import './styles/main.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { initAlertFeed } from './ui/alerts.js';
import { initTerminal } from './ui/terminal.js';
import { initPalette } from './ui/palette.js';
import { $, $$, toast, copyText } from './ui/dom.js';

gsap.registerPlugin(ScrollTrigger);
document.documentElement.classList.add('js');

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
if (isMac) $$('[data-mod-key]').forEach((k) => (k.textContent = '⌘ K'));
$('#year').textContent = String(new Date().getFullYear());

/* ---------------- Smooth scroll ---------------- */
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

export function scrollToTarget(target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  const offset = -(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 64) - 8;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.2 });
  else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
}

document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || a.getAttribute('href') === '#') return;
  const target = document.querySelector(a.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  closeMenu();
  scrollToTarget(target);
  history.replaceState(null, '', a.getAttribute('href'));
});

/* ---------------- Particle stage ---------------- */
const sections = $$('main > section[data-shape]');
const mobileQuery = window.matchMedia('(max-width: 767px)');
const parsePose = (s) => {
  const [x, y, s2, dim, rx] = s.split(',').map(Number);
  return { x, y, s: s2, dim, rx };
};
const poses = () =>
  sections.map((sec) => parsePose(mobileQuery.matches ? sec.dataset.poseMobile || sec.dataset.pose : sec.dataset.pose));
let sectionPoses = poses();
mobileQuery.addEventListener('change', () => {
  sectionPoses = poses();
  ScrollTrigger.refresh();
});

let stage = null;

async function initStage() {
  const names = sections.map((s) => s.dataset.shape);
  const { createParticleScene } = await import('./scene/particles.js');
  stage = createParticleScene($('#stage'), { shapes: names, reduced });
  if (!stage) {
    $('#stage').remove();
    return;
  }
  stage.morph(names[0], names[0], 0, sectionPoses[0], sectionPoses[0]);
  stage.start();

  // HUD reports the real state of the scene: point count, current shape and section.
  const hud = $('#hud');
  $('#hud-count').textContent = `${stage.count.toLocaleString('en-US')} pts`;
  let hudIndex = -1;
  const setHud = (i) => {
    if (i === hudIndex) return;
    hudIndex = i;
    $('#hud-shape').textContent = names[i];
    $('#hud-section').textContent = sections[i].id === 'top' ? 'hero' : sections[i].id;
  };
  setHud(0);
  // Only over the hero, where the right half is reserved for the scene; elsewhere it would sit on content.
  new IntersectionObserver(([e]) => hud.classList.toggle('is-on', e.intersectionRatio > 0.55), {
    threshold: [0, 0.55, 1],
  }).observe(sections[0]);

  // Each section morphs the cloud from the previous shape as it scrolls into view.
  sections.forEach((sec, i) => {
    if (i === 0) return;
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 92%',
      end: 'top 30%',
      scrub: reduced ? false : true,
      onUpdate: (self) => {
        const t = reduced ? (self.progress > 0.5 ? 1 : 0) : self.progress;
        stage.morph(names[i - 1], names[i], t, sectionPoses[i - 1], sectionPoses[i]);
        setHud(t >= 0.5 ? i : i - 1);
      },
      onLeaveBack: () => {
        stage.morph(names[i - 1], names[i], 0, sectionPoses[i - 1], sectionPoses[i]);
        setHud(i - 1);
      },
    });
  });
}

/* ---------------- Boot sequence ---------------- */
function runBoot() {
  const boot = $('#boot');
  let seen = false;
  try {
    seen = sessionStorage.getItem('zs-booted') === '1';
    sessionStorage.setItem('zs-booted', '1');
  } catch {
    /* storage blocked: show boot once per load */
  }
  if (reduced || seen) return Promise.resolve();

  const lines = [
    ['[ <span class="ok">ok</span> ] mounting /home/zakaria', 70],
    ['[ <span class="ok">ok</span> ] loading profile: cs @ upm, cgpa 3.84', 90],
    ['[ <span class="ok">ok</span> ] starting services: devops, soc, software', 110],
    ['[ <span class="ok">ok</span> ] wazuh-agent connected', 80],
    ['[ <span class="ok">ok</span> ] rendering 14,000 particles', 120],
    ['<span class="hi">zakaria.sys ready.</span>', 220],
  ];
  boot.classList.add('is-on');
  const log = $('#boot-log');
  return new Promise((resolve) => {
    let i = 0;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      boot.classList.add('is-done');
      window.removeEventListener('keydown', finish);
      boot.removeEventListener('click', finish);
      resolve();
      setTimeout(() => boot.remove(), 600);
    };
    window.addEventListener('keydown', finish);
    boot.addEventListener('click', finish);
    const step = () => {
      if (done) return;
      if (i >= lines.length) return setTimeout(finish, 180);
      log.insertAdjacentHTML('beforeend', `${lines[i][0]}\n`);
      setTimeout(step, lines[i++][1]);
    };
    step();
  });
}

/* ---------------- Reveals ---------------- */
function initReveals() {
  const hero = $$('[data-hero-line]');
  hero.forEach((el, i) => {
    el.style.setProperty('--d', `${120 + i * 90}ms`);
    requestAnimationFrame(() => el.classList.add('is-in'));
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    },
    { rootMargin: '0px', threshold: 0.01 }
  );
  $$('[data-reveal]').forEach((el) => {
    // Stagger siblings that reveal together.
    const siblings = $$(':scope > [data-reveal]', el.parentElement);
    el.style.setProperty('--d', `${Math.min(siblings.indexOf(el), 5) * 70}ms`);
    io.observe(el);
  });

  // Stagger indices for CSS-driven item entrances.
  $$('.stack__grid, .tl, .minis').forEach((list) =>
    [...list.children].forEach((li, i) => li.style.setProperty('--i', i))
  );
}

/* ---------------- Nav ---------------- */
const nav = $('#nav');
const menuBtn = $('#menu-btn');
const menu = $('#mobile-menu');

function closeMenu() {
  if (menu.hidden) return;
  menu.hidden = true;
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-label', 'Open menu');
}
menuBtn.addEventListener('click', () => {
  const open = menu.hidden;
  menu.hidden = !open;
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
document.addEventListener('keydown', (e) => e.key === 'Escape' && closeMenu());

ScrollTrigger.create({
  start: 40,
  end: 'max',
  onToggle: (self) => nav.classList.toggle('is-scrolled', self.isActive),
});

const navLinks = $$('.nav__links a');
$$('main > section[id]').forEach((sec) => {
  ScrollTrigger.create({
    trigger: sec,
    start: 'top 45%',
    end: 'bottom 45%',
    onToggle: (self) => {
      if (!self.isActive) return;
      navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${sec.id}`));
    },
  });
});

/* ---------------- Tabs ---------------- */
$$('[data-tabs]').forEach((root) => {
  const tabs = $$('[role="tab"]', root);
  const select = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      $(`#${t.getAttribute('aria-controls')}`).hidden = !on;
    });
    if (focus) tab.focus();
    ScrollTrigger.refresh();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      const map = { ArrowRight: 1, ArrowLeft: -1, Home: -i, End: tabs.length - 1 - i };
      if (!(e.key in map)) return;
      e.preventDefault();
      select(tabs[(i + map[e.key] + tabs.length) % tabs.length], true);
    });
  });
});

/* ---------------- Project accordion ---------------- */
function setCase(li, open) {
  const btn = $('.case__toggle', li);
  const body = $('.case__body', li);
  if (open === (btn.getAttribute('aria-expanded') === 'true')) return;
  btn.setAttribute('aria-expanded', String(open));
  li.classList.toggle('is-open', open);
  if (reduced) {
    body.hidden = !open;
    ScrollTrigger.refresh();
    return;
  }
  gsap.killTweensOf(body);
  if (open) {
    body.hidden = false;
    gsap.fromTo(
      body,
      { height: 0, opacity: 0 },
      { height: 'auto', opacity: 1, duration: 0.42, ease: 'expo.out', onComplete: () => ScrollTrigger.refresh() }
    );
  } else {
    gsap.to(body, {
      height: 0,
      opacity: 0,
      duration: 0.26,
      ease: 'power2.out',
      onComplete: () => {
        body.hidden = true;
        gsap.set(body, { clearProps: 'height,opacity' });
        ScrollTrigger.refresh();
      },
    });
  }
}
$$('.case').forEach((li) => $('.case__toggle', li).addEventListener('click', () => {
  setCase(li, $('.case__toggle', li).getAttribute('aria-expanded') !== 'true');
}));
const firstCase = $('.case');
if (firstCase) setCase(firstCase, true);

export function openProject(id) {
  const li = document.getElementById(`project-${id}`);
  if (!li) return;
  applyFilter('all');
  setCase(li, true);
  setTimeout(() => scrollToTarget(li), 60);
}

/* ---------------- Filters ---------------- */
const moreToggle = $('#more-toggle');
const morePanel = $('#more-panel');
const chips = $$('.chip');
const minis = $$('.mini');
const moreCount = $('#more-count');
function applyFilter(id) {
  chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === id)));
  let shown = 0;
  $$('.case').forEach((li) => {
    const match = id === 'all' || li.dataset.tags.split(' ').includes(id);
    li.hidden = !match;
    if (match) shown++;
  });
  let more = 0;
  minis.forEach((m) => {
    const match = id === 'all' || m.dataset.tags.split(' ').includes(id);
    m.hidden = !match;
    if (match) more++;
  });
  moreCount.textContent = String(more);
  moreToggle.disabled = more === 0;
  if (more === 0 && !morePanel.hidden) {
    morePanel.hidden = true;
    moreToggle.setAttribute('aria-expanded', 'false');
  }
  $('#cases-empty').hidden = shown > 0;
  ScrollTrigger.refresh();
}
chips.forEach((c) => c.addEventListener('click', () => applyFilter(c.dataset.filter)));
applyFilter('all');

moreToggle.addEventListener('click', () => {
  const open = morePanel.hidden;
  morePanel.hidden = !open;
  moreToggle.setAttribute('aria-expanded', String(open));
  ScrollTrigger.refresh();
});

/* ---------------- Recruiter drawer ---------------- */
const drawer = $('#recruiter');
let lastFocus = null;
export function openRecruiter() {
  if (!drawer.hidden) return;
  lastFocus = document.activeElement;
  closeMenu();
  drawer.classList.remove('is-closing');
  drawer.hidden = false;
  lenis?.stop();
  $('.drawer__panel', drawer).focus();
}
function closeRecruiter() {
  if (drawer.hidden || drawer.classList.contains('is-closing')) return;
  drawer.classList.add('is-closing');
  const done = () => {
    drawer.hidden = true;
    drawer.classList.remove('is-closing');
    lenis?.start();
    lastFocus?.focus?.();
  };
  reduced ? done() : setTimeout(done, 240);
}
$$('[data-open-recruiter]').forEach((b) => b.addEventListener('click', openRecruiter));
$$('[data-close-recruiter]').forEach((b) => b.addEventListener('click', closeRecruiter));
drawer.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeRecruiter();
  if (e.key !== 'Tab') return;
  const focusables = $$('a[href]:not([hidden]), button:not([hidden])', drawer).filter((el) => el.offsetParent);
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});
$$('[data-print]').forEach((b) => b.addEventListener('click', () => window.print()));

// Only offer the CV download when the file is actually deployed.
const cvLinks = $$('[data-cv-link]');
export let cvAvailable = false;
fetch(cvLinks[0]?.getAttribute('href') || '', { method: 'HEAD' })
  .then((r) => {
    const type = r.headers.get('content-type') || '';
    cvAvailable = r.ok && type.includes('pdf');
    cvLinks.forEach((a) => (a.hidden = !cvAvailable));
  })
  .catch(() => {});

/* ---------------- Copy ---------------- */
$$('[data-copy]').forEach((btn) =>
  btn.addEventListener('click', async () => {
    const ok = await copyText(btn.dataset.copy);
    toast(ok ? 'Email copied to clipboard' : 'Copy failed. The address is zakariaali0408@gmail.com');
    if (!ok) return;
    btn.classList.add('is-done');
    setTimeout(() => btn.classList.remove('is-done'), 1800);
  })
);

/* ---------------- Start ---------------- */
const actions = {
  scrollTo: scrollToTarget,
  openProject,
  openRecruiter,
  focusTerminal: () => {
    scrollToTarget('#terminal');
    setTimeout(() => $('#term-input').focus({ preventScroll: true }), reduced ? 0 : 900);
  },
};

initPalette(actions);
initTerminal(actions);
initAlertFeed($('#feed'), { reduced });

const fontsReady = document.fonts?.ready ?? Promise.resolve();
runBoot().then(() => {
  initReveals();
  // Wait for fonts so the monogram is sampled from Geist, not a fallback face.
  fontsReady.then(() => initStage()).then(() => ScrollTrigger.refresh());
});
