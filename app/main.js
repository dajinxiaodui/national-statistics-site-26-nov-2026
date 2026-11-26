// NationScope router. Hash routes keep the whole site in one static page:
//   #/                 overview: world strip, sortable table, chart
//   #/country/<CODE>   one country's profile
//   #/compare?c=A,B    side-by-side comparison (checkboxes also drive it)
//   #/rankings         leaderboards by indicator
//   #/about            methods and sources

import { renderAbout, renderCompare, renderCountry, renderHome, renderRankings } from './views.js';

const page = document.getElementById('app');
const navLinks = document.querySelectorAll('.site-nav a');

function markNav(routeName) {
  navLinks.forEach((a) => {
    a.classList.toggle('active', a.dataset.route === routeName);
  });
}

function route() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, query] = raw.split('?');
  const parts = path.split('/').filter(Boolean);
  window.scrollTo(0, 0);

  if (parts.length === 0) {
    markNav('home');
    renderHome(page);
  } else if (parts[0] === 'country' && parts[1]) {
    markNav('home');
    renderCountry(page, parts[1]);
  } else if (parts[0] === 'compare') {
    markNav('compare');
    const preset = new URLSearchParams(query || '').get('c') || '';
    renderCompare(page, preset);
  } else if (parts[0] === 'rankings') {
    markNav('rankings');
    renderRankings(page);
  } else if (parts[0] === 'about') {
    markNav('about');
    renderAbout(page);
  } else {
    markNav('home');
    renderHome(page);
  }
}

window.addEventListener('hashchange', route);
route();
