import { profile, projects, moreProjects, stack, experience, awards, certifications, education } from '../data.js';
import { $, escapeHtml, copyText } from './dom.js';

const e = escapeHtml;
const link = (href, label = href) => `<a href="${e(href)}" target="_blank" rel="noopener">${e(label)}</a>`;
const pad = (s, n) => String(s).padEnd(n, ' ');

const FILES = {
  'about.txt': () => [profile.summary],
  'contact.txt': () => [`email     ${profile.email}`, `linkedin  ${profile.linkedin}`, `github    ${profile.github}`],
  'cv.pdf': () => ['<span class="dim">binary file. Run</span> <span class="acc">cv</span> <span class="dim">to open the recruiter summary.</span>'],
  '.secrets': () => ['<span class="err">cat: .secrets: Permission denied</span>', '<span class="dim">good. that is the correct answer from a SOC point of view.</span>'],
};

export function initTerminal(actions) {
  const screen = $('#term-screen');
  const form = $('#term-form');
  const input = $('#term-input');
  const history = [];
  let hIndex = 0;

  const print = (html, cls = '') => {
    const div = document.createElement('div');
    div.className = `line ${cls}`.trim();
    div.innerHTML = html;
    screen.appendChild(div);
  };
  const printLines = (lines, cls) => lines.forEach((l) => print(l, cls));
  const scrollDown = () => (screen.scrollTop = screen.scrollHeight);

  const commands = {
    help: {
      desc: 'list commands',
      run: () => {
        const rows = Object.entries(commands)
          .filter(([, c]) => !c.hidden)
          .map(([name, c]) => `  <span class="acc">${pad(name, 12)}</span>${e(c.desc)}`);
        printLines(['Available commands:', ...rows, '', '<span class="dim">Tab completes, arrow keys walk history.</span>']);
      },
    },
    whoami: {
      desc: 'who is behind this site',
      run: () =>
        printLines([
          `<span class="ok">${e(profile.name)}</span>`,
          e(profile.role),
          `Targets: ${e(profile.targets.join(', '))}`,
          e(profile.availability),
        ]),
    },
    about: { desc: 'short bio', run: () => print(e(profile.summary)) },
    education: {
      desc: 'schools and grades',
      run: () => printLines(education.map((x) => `${pad(x.years, 13)}<span class="ok">${e(x.school)}</span>  <span class="acc">${e(x.score)}</span>`)),
    },
    skills: {
      desc: 'technology by category',
      run: () =>
        printLines(stack.map((g) => `<span class="acc">${pad(g.label, 16)}</span>${e(g.items.map((i) => i.name).join(', '))}`)),
    },
    projects: {
      desc: 'featured projects (try: open fraudshield)',
      run: () => {
        printLines(projects.map((p) => `  <span class="acc">${pad(p.id, 15)}</span>${e(p.name)} <span class="dim">· ${e(p.date)}</span>`));
        print(`<span class="dim">+ ${moreProjects.length} more in the Work section. Use</span> open &lt;id&gt;`);
      },
    },
    open: {
      desc: 'open a project by id',
      run: (args) => {
        const id = (args[0] || '').toLowerCase();
        const p = projects.find((x) => x.id === id || x.name.toLowerCase() === id);
        if (!p) return print(`open: unknown project "${e(args[0] || '')}". Run <span class="acc">projects</span> for ids.`, 'err');
        printLines([`<span class="ok">${e(p.name)}</span> <span class="dim">· ${e(p.context)}</span>`, e(p.blurb)]);
        p.links.filter((l) => !l.href.startsWith('#')).forEach((l) => print(`  ${e(l.label)}: ${link(l.href)}`));
        print('<span class="dim">Expanding it in the Work section...</span>');
        setTimeout(() => actions.openProject(p.id), 500);
      },
    },
    experience: {
      desc: 'work, leadership and volunteering',
      run: () => {
        experience.work.forEach((w) => print(`<span class="ok">${e(w.title)}</span> <span class="dim">· ${e(w.date)}</span>\n  ${e(w.org)}`));
        print('');
        experience.leadership.forEach((l) => print(`  <span class="acc">${e(l.title)}</span>  ${e(l.org)}`));
      },
    },
    awards: {
      desc: 'awards and rankings',
      run: () => printLines(awards.map((a) => `<span class="acc">${pad(a.rank, 15)}</span>${e(a.event)}`)),
    },
    certs: {
      desc: 'certifications',
      run: () =>
        certifications.forEach((g) => {
          print(`<span class="ok">${e(g.group)}</span>`);
          g.items.forEach((c) => print(`  ${e(c.name)} <span class="dim">· ${e(c.issuer)} · ${e(c.date)}</span>`));
        }),
    },
    contact: {
      desc: 'how to reach me',
      run: () =>
        printLines([
          `email     <a href="mailto:${profile.email}">${profile.email}</a>`,
          `linkedin  ${link(profile.linkedin, 'linkedin.com/in/zakaria-ali-955810282')}`,
          `github    ${link(profile.github, 'github.com/NanoFGX')}`,
        ]),
    },
    email: {
      desc: 'copy my email address',
      run: async () => {
        const ok = await copyText(profile.email);
        print(ok ? `<span class="ok">copied</span> ${profile.email}` : profile.email);
      },
    },
    linkedin: { desc: 'open LinkedIn', run: () => (print('opening LinkedIn...'), window.open(profile.linkedin, '_blank', 'noopener')) },
    github: { desc: 'open GitHub', run: () => (print('opening GitHub...'), window.open(profile.github, '_blank', 'noopener')) },
    cv: { desc: 'open the recruiter summary', run: () => (print('opening recruiter view...'), actions.openRecruiter()) },
    goto: {
      desc: 'scroll to a section (goto work)',
      run: (args) => {
        const id = (args[0] || '').replace('#', '');
        const ok = ['top', 'about', 'stack', 'soc', 'work', 'experience', 'awards', 'contact'].includes(id);
        if (!ok) return print('goto: try about, stack, soc, work, experience, awards or contact', 'err');
        actions.scrollTo(`#${id}`);
      },
    },
    ls: { desc: 'list files', run: () => print(Object.keys(FILES).filter((f) => !f.startsWith('.')).join('   ')) },
    cat: {
      desc: 'print a file',
      run: (args) => {
        const f = FILES[args[0]];
        if (!f) return print(`cat: ${e(args[0] || '')}: No such file. Try <span class="acc">ls</span>.`, 'err');
        printLines(f());
      },
    },
    nmap: {
      desc: 'scan this host',
      run: () =>
        printLines([
          'Starting Nmap scan of zakaria.sys',
          'PORT      STATE  SERVICE',
          `22/tcp    open   linkedin    ${link(profile.linkedin, 'in/zakaria-ali-955810282')}`,
          `25/tcp    open   smtp        <a href="mailto:${profile.email}">${profile.email}</a>`,
          `443/tcp   open   github      ${link(profile.github, 'github.com/NanoFGX')}`,
          '8080/tcp  open   internship  available from March 2027',
          '<span class="dim">Nmap done: 1 host up. No vulnerabilities, only opportunities.</span>',
        ]),
    },
    sudo: {
      desc: 'try it',
      hidden: true,
      run: (args) => {
        if (args.join(' ') === 'hire-me') {
          printLines([
            '<span class="dim">[sudo] password for recruiter: ********</span>',
            '<span class="ok">Access granted.</span> Opening a secure channel...',
            `Reach Zakaria at <a href="mailto:${profile.email}">${profile.email}</a> or ${link(profile.linkedin, 'LinkedIn')}.`,
          ]);
          return;
        }
        print('guest is not in the sudoers file. This incident will be reported. <span class="dim">(try: sudo hire-me)</span>', 'err');
      },
    },
    history: { desc: 'previous commands', run: () => printLines(history.map((h, i) => `${pad(i + 1, 4)}${e(h)}`)) },
    date: { desc: 'current date and time', run: () => print(e(new Date().toString())) },
    echo: { desc: 'print text', run: (args) => print(e(args.join(' '))) },
    clear: { desc: 'clear the screen', run: () => (screen.innerHTML = '') },
    exit: { desc: 'leave the shell', hidden: true, run: () => (print('logout. Scroll on, the contact section is just below.'), input.blur()) },
  };

  const exec = async (raw) => {
    const line = raw.trim();
    print(`<span class="p">guest@zakaria.sys:~$</span> ${e(line)}`, 'cmd');
    if (!line) return scrollDown();
    history.push(line);
    hIndex = history.length;
    const [name, ...args] = line.split(/\s+/);
    const cmd = commands[name.toLowerCase()];
    if (!cmd) print(`${e(name)}: command not found. Type <span class="acc">help</span>.`, 'err');
    else await cmd.run(args);
    scrollDown();
  };

  printLines([
    '<span class="ok">zakaria.sys</span> <span class="dim">interactive shell</span>',
    'Type <span class="acc">help</span> to list commands, or <span class="acc">whoami</span> to start.',
    '',
  ]);

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const v = input.value;
    input.value = '';
    exec(v);
  });

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      if (!history.length) return;
      hIndex = Math.max(0, hIndex - 1);
      input.value = history[hIndex];
    } else if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      hIndex = Math.min(history.length, hIndex + 1);
      input.value = history[hIndex] ?? '';
    } else if (ev.key === 'Tab') {
      const v = input.value.trim().toLowerCase();
      if (!v) return; // let Tab move focus when the line is empty
      ev.preventDefault();
      const [cmd, arg] = v.split(/\s+/);
      if (arg !== undefined || v.endsWith(' ')) {
        const pool = cmd === 'open' ? projects.map((p) => p.id) : cmd === 'cat' ? Object.keys(FILES) : cmd === 'goto' ? ['about', 'stack', 'soc', 'work', 'experience', 'awards', 'contact'] : [];
        const hits = pool.filter((p) => p.startsWith(arg || ''));
        if (hits.length === 1) input.value = `${cmd} ${hits[0]}`;
        else if (hits.length > 1) print(hits.join('   '), 'dim');
      } else {
        const hits = Object.keys(commands).filter((c) => c.startsWith(cmd) && !commands[c].hidden);
        if (hits.length === 1) input.value = `${hits[0]} `;
        else if (hits.length > 1) print(hits.join('   '), 'dim');
      }
      scrollDown();
    } else if (ev.key === 'l' && ev.ctrlKey) {
      ev.preventDefault();
      screen.innerHTML = '';
    }
  });

  // Clicking anywhere in the window focuses the prompt, unless the user is selecting text or clicking a link.
  $('#term').addEventListener('click', (ev) => {
    if (ev.target.closest('a') || String(window.getSelection())) return;
    input.focus({ preventScroll: true });
  });
}
