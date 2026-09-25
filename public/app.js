import { initThemeSwitch } from './theme-switch.js?v=stable-7';
import { initLiquidTabs } from './liquid-tabs.js?v=stable-7';

const profile = window.PROFILE;
const byId = (id) => document.getElementById(id);
const setText = (id, value) => { byId(id).textContent = value; };
setText('profile-name', profile.name);
setText('copyright-name', profile.name);
function appendAffiliation(container, text) {
  const affiliations = [profile.department, profile.university, profile.lab, profile.advisor];
  let rest = text;
  while (rest) {
    const matches = affiliations.map(item => ({item, index: rest.indexOf(item.name)})).filter(match => match.index >= 0).sort((a,b) => a.index - b.index);
    if (!matches.length) { container.append(document.createTextNode(rest)); break; }
    const {item, index} = matches[0];
    container.append(document.createTextNode(rest.slice(0, index)));
    const link = document.createElement('a');
    link.textContent = item.name;
    link.href = safeUrl(item.url) || '#about';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    container.append(link);
    rest = rest.slice(index + item.name.length);
  }
}
byId('profile-intro').replaceChildren();
appendAffiliation(byId('profile-intro'), profile.intro);
setText('research-intro', profile.research);
setText('lab-link', profile.lab.name);
byId('lab-link').href = safeUrl(profile.lab.url) || '#about';
setText('advisor-link', profile.advisor.name);
byId('advisor-link').href = safeUrl(profile.advisor.url) || '#about';
byId('profile-photo').src = profile.photo;
byId('profile-photo').parentElement.style.setProperty('--portrait-image', `url(${JSON.stringify(profile.photo)})`);
byId('profile-photo').alt = profile.photoAlt;
byId('profile-about').replaceChildren();
setText('about-heading', profile.name);
appendAffiliation(byId('profile-about'), 'Master’s Student at Korea University');
(profile.education || []).forEach(entry => {
  const item = document.createElement('li');
  const period = document.createElement('p');
  period.className = 'education-period';
  period.textContent = entry.period;
  const degree = document.createElement('h4');
  const degreeLink = document.createElement('a');
  const subject = profile.department.name.replace(/^Department of /, '');
  const subjectStart = entry.degree.indexOf(subject);
  degreeLink.textContent = subject; 
  degreeLink.href = safeUrl(profile.department.url);
  degreeLink.target = '_blank';
  degreeLink.rel = 'noopener noreferrer';
  if (subjectStart >= 0) {
    degree.append(entry.degree.slice(0, subjectStart), degreeLink, entry.degree.slice(subjectStart + subject.length));
  } else {
    degree.textContent = entry.degree;
  }
  const school = document.createElement('p');
  appendAffiliation(school, profile.university.name);
  const details = document.createElement('div');
  details.append(school, degree);
  if (entry.advisor) {
    const advisor = document.createElement('p');
    advisor.className = 'education-advisor';
    advisor.textContent = `Advisor: ${entry.advisor}`;
    details.append(advisor);
  }
  item.append(details, period);
  byId('education-list').append(item);
});
setText('year', new Date().getFullYear());
byId('template-note').hidden = !profile.isTemplate;
document.title = profile.name;
document.querySelector('meta[name="description"]').content = `${profile.intro} ${profile.lab.name}, supervised by ${profile.advisor.name}. ${profile.research}`;
profile.interests.forEach((interest) => {
  const tag = document.createElement('span');
  tag.textContent = interest;
  byId('interests').append(tag);
});

function safeUrl(value) {
  try {
    const url = new URL(value);
    return ['https:', 'http:', 'mailto:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}
function makeLink(label, url, className = '') {
  const href = safeUrl(url);
  if (!href) return null;
  const a = document.createElement('a');
  a.href = href;
  a.textContent = `${label} ↗`;
  a.className = className;
  if (!href.startsWith('mailto:')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
  return a;
}
const links = [...profile.links];
if (profile.github) links.unshift({ label: 'GitHub', url: profile.github });
if (profile.email) links.push({ label: 'Email', url: `mailto:${profile.email}` });
const socialIcons = {
  GitHub: 'M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.68.08-.68 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.94.1-.73.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.1 1.15a10.8 10.8 0 0 1 5.63 0c2.15-1.46 3.1-1.15 3.1-1.15.61 1.55.23 2.7.11 2.98.72.79 1.16 1.79 1.16 3.02 0 4.32-2.63 5.28-5.14 5.56.4.35.76 1.03.76 2.08v3.08c0 .3.2.65.78.54A11.25 11.25 0 0 0 12 .75Z',
  LinkedIn: 'M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.75H4.96V9.2h2.97v9.55ZM6.45 7.9a1.72 1.72 0 1 1 0-3.44 1.72 1.72 0 0 1 0 3.44Zm12.3 10.85h-2.97V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.47V9.2h2.85v1.31h.04c.4-.76 1.37-1.56 2.82-1.56 3.02 0 3.57 1.99 3.57 4.57v5.23Z',
  'Google Scholar': 'M12 2 0 9.5l4.5 3.67V9.5L12 5l7.5 4.5v3.67L24 9.5 12 2Zm0 7a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Z',
  Email: 'M3 5h18v14H3z M3 6l9 7 9-7',
};
links.forEach(({ label, url }) => {
  const a = makeLink(label, url);
  if (!a) return;
  a.textContent = '';
  a.dataset.service = label.toLowerCase().replaceAll(' ', '-');
  if (socialIcons[label]) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    const path = document.createElementNS(svg.namespaceURI, 'path');
    path.setAttribute('d', socialIcons[label]);
    if (label === 'Email') {
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '1.6');
      svg.setAttribute('stroke-linejoin', 'round');
    } else svg.setAttribute('fill', 'currentColor');
    svg.append(path);
    a.append(svg);
  }
  a.append(document.createTextNode(label));
  byId('social-links').append(a);
  byId('home-social-links').append(a.cloneNode(true));
});
byId('contact-empty').hidden = byId('social-links').childElementCount > 0;

function renderExperience(entries, target) {
  entries.forEach(entry => {
    const row = document.createElement('article');
    row.className = 'cv-row';
    const period = document.createElement('p');
    period.className = 'cv-period';
    period.textContent = entry.period;
    const body = document.createElement('div');
    const title = document.createElement('h4');
    title.textContent = target === 'awards-list' ? entry.organization : entry.title;
    const organization = document.createElement('p');
    organization.className = 'cv-organization';
    if (entry.url) {
      const link = makeLink(entry.organization, entry.url);
      if (link) { link.textContent = entry.organization; organization.append(link); }
      else organization.textContent = entry.organization;
    } else organization.textContent = entry.organization;
    const detail = document.createElement('p');
    detail.className = 'cv-detail';
    detail.textContent = entry.detail;
    if (target === 'awards-list') { organization.textContent = entry.title; body.append(title, organization, detail); }
    else { body.append(organization, title, detail); }
    if (entry.advisor) {
      const advisor = document.createElement('p');
      advisor.className = 'cv-detail';
      advisor.textContent = `Advisor: ${entry.advisor}`;
      body.append(advisor);
    }
    row.append(body, period);
    byId(target).append(row);
  });
}
renderExperience(profile.researchExperience || [], 'research-list');
renderExperience(profile.awards || [], 'awards-list');

const dialog = byId('project-dialog');
dialog.setAttribute('aria-labelledby', 'dialog-title');
dialog.setAttribute('aria-describedby', 'dialog-description');
profile.projects.forEach((project) => {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'project-card';
  card.setAttribute('aria-label', `${project.title} — View details`);
  const number = document.createElement('span');
  number.className = 'visual-number';
  number.textContent = project.year;
  const info = document.createElement('div');
  info.className = 'project-info';
  const category = document.createElement('p');
  category.className = 'eyebrow';
  category.textContent = project.category;
  const title = document.createElement('h3');
  title.textContent = project.title;
  const summary = document.createElement('p');
  summary.textContent = project.summary;
  const arrow = document.createElement('span');
  arrow.className = 'project-arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '↗';
  info.append(category, title, summary, arrow);
  const preview = document.createElement('div');
  preview.className = 'project-preview';
  if (project.media?.type === 'image') {
    const thumbnail = document.createElement('img');
    thumbnail.src = project.media.url;
    thumbnail.alt = '';
    thumbnail.loading = 'lazy';
    preview.append(thumbnail);
  }
  info.prepend(number);
  card.append(preview, info);
  card.addEventListener('click', () => {
    dialog.classList.toggle('split-media', project.media?.layout === 'split');
    dialog.classList.toggle('portrait-media', !!project.media?.portrait);
    setText('dialog-label', project.category);
    setText('dialog-title', project.title);
    setText('dialog-description', project.description);
    byId('dialog-link').replaceChildren();
    (project.links || (project.url ? [{label:'Visit project', url:project.url}] : [])).forEach(({label,url}) => {
      const link = makeLink(label, url, 'button');
      if (link) byId('dialog-link').append(link);
    });
    const mediaHost = byId('dialog-media');
    mediaHost.replaceChildren();
    if (project.media) {
      const media = project.media;
      const player = document.createElement(media.type === 'youtube' ? 'iframe' : 'img');
      if (media.type === 'youtube') {
        player.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(media.id)}`;
        player.title = media.caption;
        player.allow = 'fullscreen; picture-in-picture; encrypted-media';
        player.allowFullscreen = true;
        player.referrerPolicy = 'strict-origin-when-cross-origin';
      } else { player.src = media.url; player.alt = media.caption; }
      const caption = document.createElement('p');
      caption.textContent = media.caption;
      const source = makeLink(media.linkLabel || (media.type === 'youtube' ? 'Watch on YouTube' : 'Open demonstration'), media.url);
      mediaHost.append(player, caption);
      if (source && media.showSourceLink !== false) mediaHost.append(source);
    }
    dialog.showModal();
  });
  byId('project-grid').append(card);
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => byId('dialog-media').replaceChildren());
dialog.addEventListener('click', (event) => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});

// Publications are real profile data only; an empty list shows a deliberate empty state.
(profile.publications || []).forEach((publication) => {
  const article = document.createElement('article');
  article.className = 'publication-card';
  const year = document.createElement('p');
  year.className = 'publication-year';
  year.textContent = publication.year;
  const body = document.createElement('div');
  const title = document.createElement('h3');
  title.textContent = publication.title;
  const authors = document.createElement('p');
  authors.className = 'publication-authors';
  publication.authors.split(profile.name).forEach((part, index) => {
    if (index > 0) {
      const name = document.createElement('strong');
      name.textContent = profile.name;
      authors.append(name);
    }
    authors.append(document.createTextNode(part));
  });
  const venue = document.createElement('p');
  venue.className = 'publication-venue';
  venue.textContent = publication.venue;
  const actions = document.createElement('div');
  actions.className = 'publication-links';
  (publication.links || []).forEach(({ label, url }) => {
    const link = makeLink(label, url, 'button glass');
    if (link) actions.append(link);
  });
  body.append(title, authors, venue, actions);
  article.append(year, body);
  byId('publication-list').append(article);
});
byId('publication-empty').hidden = byId('publication-list').childElementCount > 0;

// Keep the first five updates visible; older entries expand without leaving Home.
const news = profile.news || [];
news.forEach((entry, index) => {
  const item = document.createElement('li');
  const date = document.createElement('time');
  date.dateTime = entry.date;
  const parsed = new Date(`${entry.date.slice(0, 7)}-01T00:00:00Z`);
  date.textContent = Number.isNaN(parsed.valueOf()) ? entry.date : new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(parsed);
  const text = document.createElement('span');
  const link = entry.url && makeLink(entry.text, entry.url);
  if (link) text.append(link);
  else text.textContent = entry.text;
  item.append(date, text);
  byId(index < 5 ? 'news-recent' : 'news-older').append(item);
});
byId('news-empty').hidden = news.length > 0;
byId('news-archive').hidden = news.length <= 5;
setText('news-count', `(${Math.max(0, news.length - 5)})`);
byId('news-archive').addEventListener('toggle', () => {
  byId('news-archive').querySelector('summary').firstChild.textContent = byId('news-archive').open ? 'Show less ' : 'Show older news ';
});

initLiquidTabs();

initThemeSwitch();

// Keep visible focus for keyboard navigation, without rings during pointer gestures.
document.addEventListener('pointerdown', () => {
  delete document.documentElement.dataset.input;
}, true);
document.addEventListener('keydown', (event) => {
  if (['Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', ' ', 'Enter'].includes(event.key)) {
    document.documentElement.dataset.input = 'keyboard';
  }
}, true);

// Move only the surface highlight; text and hit targets stay still while hovering.
const quietMotion = matchMedia('(prefers-reduced-motion: reduce)');
const glassActionSelector = '.hero-actions .button:not(.primary), .publication-links .button, #dialog-link .button, .social-links a';
// Delegation also covers links created each time a project dialog opens.
document.addEventListener('pointermove', event => {
  const control = event.target.closest(glassActionSelector);
  if (!control || quietMotion.matches || event.pointerType !== 'mouse') return;
  const rect = control.getBoundingClientRect();
  control.style.setProperty('--light-x', `${(event.clientX - rect.left) / rect.width * 100}%`);
  control.style.setProperty('--light-y', `${(event.clientY - rect.top) / rect.height * 100}%`);
});
document.addEventListener('pointerout', event => {
  const control = event.target.closest(glassActionSelector);
  if (!control || (event.relatedTarget instanceof Node && control.contains(event.relatedTarget))) return;
  control.style.removeProperty('--light-x');
  control.style.removeProperty('--light-y');
});

