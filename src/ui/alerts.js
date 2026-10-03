import { alertScript } from '../data.js';
import { $, escapeHtml } from './dom.js';

const MAX_ROWS = 9;

function stamp(date) {
  return date.toTimeString().slice(0, 8);
}

function row(alert, date) {
  const li = document.createElement('li');
  li.className = 'alert is-new';
  const lvlClass = alert.level >= 12 ? 'alert__lvl--crit' : alert.level >= 9 ? 'alert__lvl--high' : '';
  const mitre = alert.mitre
    ? `<a class="alert__mitre" href="https://attack.mitre.org/techniques/${alert.mitre.replace('.', '/')}/" target="_blank" rel="noopener">${alert.mitre}</a>`
    : '';
  li.innerHTML = `
    <span class="alert__time">${stamp(date)}</span>
    <span class="alert__lvl ${lvlClass}">${alert.level}</span>
    <span class="alert__rule">${alert.rule}</span>
    <span class="alert__agent">${escapeHtml(alert.agent)}</span>
    <span class="alert__text">${escapeHtml(alert.text)}${mitre}</span>`;
  setTimeout(() => li.classList.remove('is-new'), 1400);
  return li;
}

export function initAlertFeed(list, { reduced }) {
  const toggle = $('#feed-toggle');
  const state = $('#feed-state');
  let i = 0;
  let timer = 0;
  let userPaused = false;
  let visible = false;

  const push = () => {
    const alert = alertScript[i % alertScript.length];
    i++;
    list.prepend(row(alert, new Date()));
    while (list.children.length > MAX_ROWS) list.lastElementChild.remove();
  };

  // Seed the console so it never renders empty.
  const now = Date.now();
  for (let k = 8; k >= 1; k--) {
    const li = row(alertScript[(alertScript.length - k) % alertScript.length], new Date(now - k * 7000));
    li.classList.remove('is-new');
    list.prepend(li);
  }

  const schedule = () => {
    clearTimeout(timer);
    if (userPaused || !visible || document.hidden) return;
    timer = setTimeout(() => {
      push();
      schedule();
    }, reduced ? 4200 : 2300 + Math.random() * 1400);
  };

  const setPaused = (p) => {
    userPaused = p;
    toggle.setAttribute('aria-pressed', String(p));
    toggle.setAttribute('aria-label', p ? 'Resume alert feed' : 'Pause alert feed');
    state.classList.toggle('is-paused', p);
    state.lastChild.textContent = p ? 'Feed paused' : 'Simulated live feed';
    schedule();
  };

  toggle.addEventListener('click', () => setPaused(!userPaused));
  document.addEventListener('visibilitychange', schedule);
  new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    },
    { threshold: 0.15 }
  ).observe(list);
}
