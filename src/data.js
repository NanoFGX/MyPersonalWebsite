// Every fact here comes from Zakaria's CV or a linked repository.

export const profile = {
  name: 'Zakaria Bin Ali',
  short: 'Zakaria',
  role: 'Computer Science, Universiti Putra Malaysia',
  targets: ['DevOps', 'Cybersecurity (SOC)', 'Software Development'],
  availability: 'Open to a 6-month internship from March 2027',
  availabilityShort: 'Internship · Mar 2027',
  location: 'Seri Kembangan, Selangor',
  email: 'zakariaali0408@gmail.com',
  linkedin: 'https://www.linkedin.com/in/zakaria-ali-955810282/',
  github: 'https://github.com/NanoFGX',
  cv: 'cv/Zakaria_Bin_Ali_CV.pdf',
  summary:
    'Final-year Computer Science student at Universiti Putra Malaysia and PNB Merdeka Scholar. I have built and contributed to 10+ web, mobile and AI projects, led a three-developer team to launch a live event platform used by 311 participants, and completed BlackBerry SOC Analyst labs detecting simulated attacks in Wazuh.',
};

export const telemetry = [
  { key: 'cgpa', value: '3.84 / 4.00', note: 'BSc Computer Science (Hons), UPM' },
  { key: 'scholarship', value: 'PNB Merdeka Scholar', note: '2023 to 2027' },
  { key: 'live_users', value: '311', note: 'registered on a platform I led' },
  { key: 'projects', value: '10+', note: 'web, mobile and AI builds' },
  { key: 'placings', value: '5', note: 'awards and competition rankings' },
  { key: 'certs', value: '10', note: 'plus AWS SAA in progress' },
];

export const education = [
  {
    school: 'Universiti Putra Malaysia',
    detail: 'Bachelor of Computer Science with Honours',
    score: 'CGPA 3.84',
    years: '2023 - 2027',
  },
  {
    school: 'Kolej Matrikulasi Kejuruteraan Pahang',
    detail: 'Engineering Matriculation Programme',
    score: 'CGPA 3.96',
    years: '2022 - 2023',
  },
  {
    school: 'SMK Seri Serdang',
    detail: 'SPM, Pure Science stream',
    score: '4A+ 5A 1A-',
    years: '2017 - 2021',
  },
];

export const languages = [
  { name: 'Malay', level: 'Proficient' },
  { name: 'English', level: 'Proficient, MUET Band 4.5' },
  { name: 'Tamil', level: 'Basic' },
  { name: 'French', level: 'DELF A1' },
  { name: 'Japanese', level: 'Basic' },
];

// icon: simple-icons export name, or `ph:<phosphor-name>` when no brand mark exists.
export const stack = [
  {
    id: 'languages',
    label: 'Languages',
    items: [
      { name: 'Java', icon: 'siOpenjdk' },
      { name: 'Python', icon: 'siPython' },
      { name: 'JavaScript', icon: 'siJavascript' },
      { name: 'TypeScript', icon: 'siTypescript' },
      { name: 'SQL', icon: 'ph:database' },
      { name: 'HTML', icon: 'siHtml5' },
      { name: 'CSS', icon: 'siCss' },
    ],
  },
  {
    id: 'frameworks',
    label: 'Frameworks',
    items: [
      { name: 'Spring Boot', icon: 'siSpringboot' },
      { name: 'FastAPI', icon: 'siFastapi' },
      { name: 'Next.js', icon: 'siNextdotjs' },
      { name: 'React', icon: 'siReact' },
      { name: 'React Native', icon: 'siReact' },
      { name: 'Flutter', icon: 'siFlutter' },
      { name: 'Tailwind CSS', icon: 'siTailwindcss' },
      { name: 'Streamlit', icon: 'siStreamlit' },
    ],
  },
  {
    id: 'devops',
    label: 'Cloud & DevOps',
    items: [
      { name: 'Git', icon: 'siGit' },
      { name: 'GitHub', icon: 'siGithub' },
      { name: 'GitHub Actions', icon: 'siGithubactions' },
      { name: 'Vercel', icon: 'siVercel' },
      { name: 'Firebase', icon: 'siFirebase' },
      { name: 'Supabase', icon: 'siSupabase' },
      { name: 'Linux', icon: 'siLinux' },
      { name: 'AWS (in progress)', icon: 'ph:cloud' },
    ],
  },
  {
    id: 'security',
    label: 'Security',
    items: [
      { name: 'Wazuh SIEM', icon: 'ph:shield-check' },
      { name: 'MITRE ATT&CK', icon: 'ph:crosshair' },
      { name: 'Atomic Red Team', icon: 'ph:flask' },
      { name: 'Wireshark', icon: 'siWireshark' },
      { name: 'Kali Linux', icon: 'siKalilinux' },
      { name: 'Metasploit', icon: 'siMetasploit' },
      { name: 'Nmap', icon: 'ph:target' },
      { name: 'VirusTotal', icon: 'siVirustotal' },
      { name: 'TryHackMe', icon: 'siTryhackme' },
      { name: 'Hack The Box', icon: 'siHackthebox' },
    ],
  },
  {
    id: 'ai',
    label: 'AI & Data',
    items: [
      { name: 'Claude API', icon: 'siClaude' },
      { name: 'Gemini API', icon: 'siGooglegemini' },
      { name: 'scikit-learn', icon: 'siScikitlearn' },
      { name: 'XGBoost / LightGBM', icon: 'ph:tree-structure' },
      { name: 'SHAP', icon: 'ph:chart-bar-horizontal' },
      { name: 'pandas', icon: 'siPandas' },
      { name: 'OpenCV', icon: 'siOpencv' },
      { name: 'BigQuery', icon: 'siGooglebigquery' },
    ],
  },
  {
    id: 'data',
    label: 'Databases',
    items: [
      { name: 'PostgreSQL', icon: 'siPostgresql' },
      { name: 'Firestore', icon: 'siFirebase' },
      { name: 'MongoDB Atlas', icon: 'siMongodb' },
      { name: 'Oracle SQL', icon: 'ph:database' },
      { name: 'Apache Derby', icon: 'ph:hard-drives' },
    ],
  },
];

export const socLab = {
  title: 'SOC Analyst Labs',
  program: 'BlackBerry SOC Analyst and Security Manager programme, MCMC & BlackBerry Cybersecurity Centre of Excellence',
  date: 'Aug 2026',
  points: [
    'Ran MITRE ATT&CK techniques with Atomic Red Team, such as a hidden admin account, and traced them in Wazuh.',
    'On a cyber range, exploited a vulnerable WordPress server as the attacker, then reviewed the logs as the defender.',
    'Analysed suspicious emails, network captures and files to pull out indicators of compromise.',
  ],
  tools: ['Wazuh', 'Atomic Red Team', 'Kali Linux', 'Nmap', 'Metasploit', 'Wireshark', 'VirusTotal'],
  techniques: [
    { id: 'T1136.001', name: 'Create Account: Local Account' },
    { id: 'T1564.002', name: 'Hide Artifacts: Hidden Users' },
    { id: 'T1190', name: 'Exploit Public-Facing Application' },
    { id: 'T1046', name: 'Network Service Discovery' },
    { id: 'T1566.001', name: 'Phishing: Spearphishing Attachment' },
  ],
};

// Simulated alerts, modelled on the lab scenarios above. Not real telemetry.
export const alertScript = [
  { level: 12, rule: '60109', agent: 'win10-lab', mitre: 'T1136.001', text: 'User account created: svc_backup$ added to Administrators' },
  { level: 10, rule: '60154', agent: 'win10-lab', mitre: 'T1564.002', text: 'Registry: SpecialAccounts\\UserList value set, account hidden from logon' },
  { level: 6, rule: '31101', agent: 'wp-srv01', mitre: 'T1046', text: 'Web server 400 error codes from 10.10.4.23 (wpscan enumeration)' },
  { level: 13, rule: '31106', agent: 'wp-srv01', mitre: 'T1190', text: 'Web attack returned 200: vulnerable plugin endpoint hit' },
  { level: 7, rule: '554', agent: 'wp-srv01', mitre: 'T1505.003', text: 'File added to /wp-content/uploads: shell.php' },
  { level: 5, rule: '5710', agent: 'kali-range', mitre: 'T1110', text: 'sshd: attempt to login using a non-existent user' },
  { level: 9, rule: '87105', agent: 'mail-gw', mitre: 'T1566.001', text: 'VirusTotal: attachment invoice_0812.docm flagged by 31 engines' },
  { level: 3, rule: '5501', agent: 'win10-lab', mitre: '', text: 'Login session opened for analyst (triage started)' },
];

export const filters = [
  { id: 'all', label: 'All' },
  { id: 'devops', label: 'DevOps & Cloud' },
  { id: 'software', label: 'Software' },
  { id: 'security', label: 'Security' },
  { id: 'ai', label: 'AI & Data' },
];

export const projects = [
  {
    id: 'gog',
    name: 'Game of Geeks Platform',
    context: 'Freelance Project Manager · FSKTM UPM',
    date: 'May - Jun 2026',
    tags: ['devops', 'software'],
    metric: { value: '311', label: 'participants registered' },
    blurb: 'Registration and tournament system for a faculty event across eight sports, kept running through two weeks of live use.',
    points: [
      'Led three developers: gathered requirements, assigned tasks and tested email sign-up, team rosters and brackets.',
      'Bracket engine for four tournament formats, backed by 14 Supabase tables with Row Level Security.',
      'Match-day tools for attendance, substitutions and an audit log of every admin action.',
    ],
    stack: ['siNextdotjs', 'siTypescript', 'siSupabase', 'siPostgresql', 'siVercel'],
    stackNames: 'Next.js, TypeScript, Supabase (PostgreSQL, Auth), Vercel, SMTP',
    links: [{ label: 'Repository', href: 'https://github.com/Multilord/gog2026', icon: 'github' }],
  },
  {
    id: 'fraudshield',
    name: 'FraudShield',
    context: 'VHack 2026',
    date: 'Apr 2026',
    tags: ['security', 'ai', 'software'],
    metric: { value: '<50ms', label: 'per payment score' },
    blurb: 'Real-time fraud detection for digital wallets. Analysts see why each payment was scored and approve, flag or block it live.',
    points: [
      'Built the FastAPI scoring backend and the XGBoost and LightGBM fraud models, trained on about 590,000 real transactions.',
      'Ensemble adds Isolation Forest and LOF anomaly detection plus each user’s usual spending pattern.',
      'SHAP explanations and a WebSocket-driven dashboard with a triage queue for flagged cases.',
    ],
    stack: ['siPython', 'siFastapi', 'siScikitlearn', 'siNextdotjs', 'siSocketdotio'],
    stackNames: 'Python, FastAPI, XGBoost, LightGBM, SHAP, Next.js, WebSockets',
    links: [
      { label: 'Team repository', href: 'https://github.com/Multilord/FraudSheildV2', icon: 'github' },
      { label: 'My repository', href: 'https://github.com/NanoFGX/FraudSheild', icon: 'github' },
    ],
  },
  {
    id: 'soc',
    name: 'SOC Analyst Labs',
    context: 'BlackBerry SOC Analyst programme',
    date: 'Aug 2026',
    tags: ['security'],
    metric: { value: 'Red + Blue', label: 'attacked it, then defended it' },
    blurb: 'Attacked and defended on a cyber range: emulated techniques with Atomic Red Team and hunted them down in Wazuh.',
    points: [
      'Hidden admin account emulation traced end to end in Wazuh alerts.',
      'Exploited a vulnerable WordPress server, then reviewed the same attack from the logs.',
      'Email, PCAP and file analysis to extract indicators of compromise.',
    ],
    stack: ['siKalilinux', 'siWireshark', 'siMetasploit', 'siVirustotal', 'siLinux'],
    stackNames: 'Wazuh, Atomic Red Team, Kali Linux, Nmap, Metasploit, Wireshark, VirusTotal',
    links: [{ label: 'See the lab console', href: '#soc', icon: 'arrow' }],
  },
  {
    id: 'nextinsurance',
    name: 'NextInsurance',
    context: 'Digital Entrepreneurship (SSE3200)',
    date: 'Jul 2026',
    tags: ['software', 'ai', 'devops'],
    metric: { value: '2×', label: 'Silver awards' },
    blurb: 'First-time insurance buyers answer six questions and get a ranked shortlist of plans in about two minutes.',
    points: [
      'Each plan carries a 100-point match score that opens up to explain its ranking.',
      'An AI advisor explains terms such as co-payment in plain words.',
      'Built under the guidance of a Senior Developer from Zurich Shared Services. Deployed on Vercel.',
    ],
    stack: ['siNextdotjs', 'siTypescript', 'siTailwindcss', 'siClaude', 'siVercel'],
    stackNames: 'Next.js, TypeScript, Tailwind CSS, Claude AI, Vercel',
    links: [{ label: 'Repository', href: 'https://github.com/NanoFGX/nextinsurance', icon: 'github' }],
  },
  {
    id: 'chainly',
    name: 'Chainly',
    context: 'Lovable Vibeathon KL · AWS Malaysia office',
    date: 'May 2026',
    tags: ['software', 'ai'],
    metric: { value: '1 day', label: 'build at AWS Malaysia' },
    blurb: 'AI agents that follow a patient’s insurance claim from admission to submission and flag problems early.',
    points: [
      'Developed the FastAPI backend and the Claude-powered claim agents.',
      'Checks coverage over WhatsApp before the visit and flags wrong diagnosis codes.',
      'Scores how ready each claim is before it is submitted.',
    ],
    stack: ['siPython', 'siFastapi', 'siSupabase', 'siClaude', 'siWhatsapp'],
    stackNames: 'Python, FastAPI, Supabase, Claude AI, WhatsApp, Lovable',
    links: [{ label: 'Team repository', href: 'https://github.com/yang25-cell/chainly', icon: 'github' }],
  },
  {
    id: 'drivelens',
    name: 'DriveLens',
    context: 'Etiqa Insurance & Takaful AI Talent Bootcamp',
    date: 'Sep 2026',
    tags: ['ai'],
    metric: { value: '1st RU', label: 'RM2,000 team prize' },
    blurb: 'An Etiqa+ feature that scores each trip with phone sensors and gives safe young drivers monthly cashback.',
    points: [
      'Researched why young drivers overpay, such as pricing by car model and slow no-claim discounts.',
      'Designed the mock UI that aligned the team on the product.',
      'Answered the judges’ questions in the final pitch.',
    ],
    stack: [],
    stackNames: 'Product research, UI design, pitching',
    links: [],
  },
  {
    id: 'mycredentials',
    name: 'MyCredentials',
    context: 'GODAMLah Hackathon',
    date: 'Mar 2026',
    tags: ['software', 'security', 'ai'],
    metric: { value: 'eKYC', label: 'IC photo to live selfie match' },
    blurb: 'A mobile vault for ICs, certificates and insurance papers that sorts them automatically using OCR.',
    points: [
      'Developed the React Native app and the FastAPI backend for OCR and face matching.',
      'Mock eKYC sign-in matches the IC photo against a live selfie.',
      'Firestore and Storage rules keep each user’s documents private.',
    ],
    stack: ['siReact', 'siExpo', 'siFirebase', 'siFastapi', 'siOpencv'],
    stackNames: 'React Native, Firebase, FastAPI, Tesseract OCR, OpenCV',
    links: [{ label: 'Repository', href: 'https://github.com/NanoFGX/MyCredentials_System', icon: 'github' }],
  },
];

export const moreProjects = [
  {
    name: 'Competency Gap Tracker',
    context: 'SWE3307 UI/UX',
    date: 'Jun 2026',
    tags: ['software'],
    text: 'Students log skill evidence, mentors score it, recruiters see a readiness score per role.',
    stack: 'React, TypeScript, Spring Boot',
    links: [{ label: 'Repo', href: 'https://github.com/NanoFGX/competency-gap-tracker' }],
  },
  {
    name: 'DriveWise AI',
    context: 'BorNEO HackWknd 2026',
    date: 'May 2026',
    tags: ['software', 'ai'],
    text: 'The full cost of owning a car, with a financial health score and a five-year comparison.',
    stack: 'React, Vite, Tailwind, Google Maps',
    links: [
      { label: 'Live', href: 'https://ai-smart-car-advisor-master.vercel.app/' },
      { label: 'Repo', href: 'https://github.com/NanoFGX/Ai_Car_Advisor' },
    ],
  },
  {
    name: 'HomeGrow AI',
    context: 'PutraHack 2026',
    date: 'Apr 2026',
    tags: ['software', 'ai'],
    text: 'Plant recommendations and photo disease diagnosis, with unsure cases routed to an agronomist.',
    stack: 'React, FastAPI, MongoDB Atlas, Gemini',
    links: [],
  },
  {
    name: 'MakanManoi',
    context: 'KitaHack 2026',
    date: 'Feb 2026',
    tags: ['software', 'ai'],
    text: 'TikTok food reviews turned into a summary with a "Hype vs Reality" trust score.',
    stack: 'Flutter, Firebase, Gemini API',
    links: [{ label: 'Repo', href: 'https://github.com/NanoFGX/MakanManoi' }],
  },
  {
    name: 'GEOFOODSEC',
    context: 'Data analytics',
    date: 'Feb 2026',
    tags: ['ai'],
    text: 'Climate and emissions vs food production. Best of 24 models explained about 98% of the change.',
    stack: 'Python, scikit-learn, SHAP, Streamlit',
    links: [
      { label: 'Live', href: 'https://climate-emissions-crop-yield-ideynb6gsjxyvmieizojus.streamlit.app/' },
      { label: 'Repo', href: 'https://github.com/NanoFGX/GEOFOODSEC' },
    ],
  },
  {
    name: 'Golden Meal',
    context: 'SWE3001 Software Engineering',
    date: 'Jan 2026',
    tags: ['software', 'ai'],
    text: 'Meal suggestions, reminders, safe exercises and a health chatbot for elderly users.',
    stack: 'Flutter, Firebase, Gemini API',
    links: [{ label: 'Repo', href: 'https://github.com/NanoFGX/Golden_Meal' }],
  },
  {
    name: 'CafeForGeeks',
    context: 'Advanced Programming',
    date: 'May 2025',
    tags: ['software'],
    text: 'Order and pay ahead at campus cafes. Led the team and co-built the backend and database.',
    stack: 'Java, JavaFX, Apache Derby',
    links: [{ label: 'Repo', href: 'https://github.com/NanoFGX/Cafe-For-Geeks' }],
  },
];

export const experience = {
  work: [
    {
      title: 'Project Manager (Freelance)',
      org: 'Sports Event Management System, Game of Geeks: Quest to Glory 2026',
      date: 'May - Jun 2026',
      points: [
        'Led three developers to build the registration and management system for a faculty event covering eight sports.',
        'Gathered requirements, assigned tasks and tested features such as email sign-up, team rosters and brackets.',
        'Kept the system running through two weeks of live use with 311 registered participants.',
      ],
      tools: 'Next.js, TypeScript, Supabase (PostgreSQL, Auth), Vercel, SMTP',
    },
  ],
  leadership: [
    { title: 'Sports & Recreation Exco', org: 'Faculty Representative Council (ComCil), FSKTM UPM', date: '2025/2026' },
    { title: 'Program Director', org: 'Game of Geeks 2026, faculty sports competition', date: '2026' },
    { title: 'Head of Logistics', org: 'QKS2106 Kejohanan Hoki Terbuka UPM x BJ 5’s', date: '' },
    { title: 'Head of Technical', org: 'Mascot Master & Show Off Your Tee', date: '' },
    { title: 'Floor Manager', org: 'Majlis Anugerah Kecemerlangan FSKTM 2025', date: '2025' },
    { title: 'Member', org: 'Google Developer Group (GDG) UPM, UPM Scuba Club, REKS KTDI', date: '' },
  ],
  volunteering: [
    { title: 'Project SULAM', org: 'Taught elderly residents AI basics and helped build a garden attendance chatbot', date: '' },
    { title: 'Program Pantai Lestari', org: 'Beach clean-up at Tanjung Harapan, Pelabuhan Klang', date: '' },
    { title: 'National Cybersecurity Summit 2026', org: 'Security community event', date: '2026' },
    { title: 'Positive Hack Talks Kuala Lumpur 2026', org: 'Security community event', date: '2026' },
  ],
};

export const awards = [
  { rank: '1st Runner-Up', event: 'Etiqa Insurance & Takaful AI Talent Bootcamp 2026', note: 'RM2,000 team prize for DriveLens', size: 'xl' },
  { rank: 'Silver', event: 'I-PICTL 2026', note: 'International Putra InnoCreative Carnival in Teaching and Learning, NextInsurance', size: 'md' },
  { rank: 'Silver', event: 'PEDi Colloquium 2026', note: 'Product Prototype Exhibition & Pitching, FSKTM UPM, NextInsurance', size: 'md' },
  { rank: 'Top 10', event: 'Top Coders Malaysia 2026', note: 'National-level coding challenge', size: 'sm' },
  { rank: 'Top 5', event: 'HackTheBox Mini CTF Workshop', note: 'Capture the flag', size: 'sm' },
];

export const alsoCompeted = 'Also competed in National Programming League 2025, UM Datathon 2025 and UM Capture-the-Flag 2025.';

export const certifications = [
  {
    group: 'Security',
    items: [
      { name: 'BlackBerry SOC Analyst and Security Manager', issuer: 'MCMC & BlackBerry CCoE', date: 'Aug 2026', icon: 'siBlackberry' },
      { name: 'Google Cybersecurity Professional Certificate', issuer: 'Google, Coursera', date: 'Aug 2026', icon: 'siGoogle' },
      { name: 'Security Operations Fundamentals', issuer: 'Palo Alto Networks', date: 'Aug 2026', icon: 'siPaloaltonetworks' },
      { name: 'Cyber Security 101', issuer: 'TryHackMe', date: 'Sep 2026', icon: 'siTryhackme' },
      { name: 'Certified Blue Teamer (CBT)', issuer: 'The SecOps Group', date: 'Jan 2026', icon: 'ph:shield-check' },
    ],
  },
  {
    group: 'Cloud',
    items: [
      { name: 'AWS Certified Solutions Architect, Associate', issuer: 'Amazon Web Services', date: 'In progress', icon: 'ph:cloud', progress: true },
      { name: 'Cloud Security Fundamentals', issuer: 'Palo Alto Networks', date: 'Aug 2026', icon: 'siPaloaltonetworks' },
    ],
  },
  {
    group: 'Data & AI',
    items: [
      { name: 'Google Advanced Data Analytics', issuer: 'Google, Coursera', date: 'Aug 2026', icon: 'siGoogle' },
      { name: 'Google Business Intelligence', issuer: 'Google, Coursera', date: 'Aug 2026', icon: 'siGoogle' },
      { name: 'Google AI Essentials', issuer: 'Google, Coursera', date: 'Aug 2026', icon: 'siGoogle' },
      { name: 'Mobile Application Development (Flutter)', issuer: 'iTrain Malaysia', date: 'Dec 2023', icon: 'siFlutter' },
    ],
  },
];
