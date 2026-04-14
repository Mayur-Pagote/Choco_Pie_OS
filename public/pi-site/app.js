/* ============================================================
   APP.JS — Navigation + Light Mode + Init
   ============================================================ */

// PI CONSTANT (1001 digits)
const PI_DIGITS = '31415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491';

// Page titles for dynamic render
const PAGE_MAP = {
  about: { render: renderAbout, init: initLivingUniverse, enter: startLivingUniverse, leave: stopLivingUniverse },
  piday: { render: renderPiDay },
  raspberrypi: { render: renderRaspberryPi },
  piart: { render: renderPiArt, init: initPiArt },
  symphony: { render: renderSymphony, init: initSymphony, leave: stopSymphony },
  explorer: { render: renderExplorer, init: initExplorer },
  simulation: { render: renderSimulation, init: initSimulation, leave: stopSimulation },
  games: { render: renderGames, init: initGames, leave: cleanupGames },
  quiz: { render: renderQuiz, init: initQuiz },
  mandala: { render: renderMandala, init: initMandala, enter: startMandala, leave: stopMandala },
  gallery: { render: renderGallery, init: initGallery, leave: closeLightbox }
};

const EMBED_MESSAGE_TYPE = 'pi-os-open-app';
const EMBED_THEME_MESSAGE_TYPE = 'pi-os-theme';

let activePage = null;
const renderedPages = new Set();
const initializedPages = new Set();

function isEmbedMode() {
  return new URLSearchParams(window.location.search).get('embed') === '1';
}

function getInitialPage() {
  const requestedPage = new URLSearchParams(window.location.search).get('page');
  return PAGE_MAP[requestedPage] ? requestedPage : 'about';
}

function requestParentAppOpen(page) {
  if (window.parent === window) return false;

  try {
    window.parent.postMessage({ type: EMBED_MESSAGE_TYPE, page }, window.location.origin);
    return true;
  } catch {
    return false;
  }
}

function navigateTo(page, options = {}) {
  if (!PAGE_MAP[page]) return;
  if (page === activePage && renderedPages.has(page)) {
    window.scrollTo(0, 0);
    return;
  }

  if (isEmbedMode() && !options.forceLocal && requestParentAppOpen(page)) {
    return;
  }

  const previousPage = activePage;
  if (previousPage && PAGE_MAP[previousPage]?.leave) {
    PAGE_MAP[previousPage].leave();
  }

  // Update sections
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  const section = document.getElementById(`page-${page}`);
  if (section) section.classList.add('active');

  // Update nav
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });

  // Render if not already rendered
  if (!renderedPages.has(page)) {
    PAGE_MAP[page].render();
    renderedPages.add(page);
  }

  activePage = page;

  if (!initializedPages.has(page) && PAGE_MAP[page].init) {
    PAGE_MAP[page].init();
    initializedPages.add(page);
  }

  if (PAGE_MAP[page].enter) {
    PAGE_MAP[page].enter();
  }

  window.scrollTo(0, 0);
}

// ---- Navigation clicks ----
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => navigateTo(item.dataset.page));
});

// ---- Theme Toggle ----
const THEME_STORAGE_KEY = 'pi-site-theme';
const themeToggle = document.getElementById('theme-toggle');
const themeToggleLabel = document.getElementById('theme-toggle-label');

function applyTheme(theme) {
  const isLightMode = theme === 'light';

  document.documentElement.setAttribute('data-theme', theme);
  document.body.classList.toggle('light-mode', isLightMode);

  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(isLightMode));
    themeToggle.setAttribute(
      'aria-label',
      isLightMode ? 'Switch to dark mode' : 'Switch to light mode'
    );
  }

  if (themeToggleLabel) {
    themeToggleLabel.innerHTML = isLightMode
      ? '<i class="fa-regular fa-moon"></i> Dark Mode'
      : '<i class="fa-regular fa-sun"></i> Light Mode';
  }
}

function getInitialTheme() {
  const requestedTheme = new URLSearchParams(window.location.search).get('theme');
  if (requestedTheme === 'light' || requestedTheme === 'dark') {
    return requestedTheme;
  }

  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
    applyTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  });
}

// ---- Footer nav clicks (delegate) ----
document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-nav]');
  if (link) navigateTo(link.dataset.nav);
});

document.addEventListener('visibilitychange', () => {
  if (!activePage) return;
  if (document.hidden) {
    PAGE_MAP[activePage]?.leave?.();
  } else {
    PAGE_MAP[activePage]?.enter?.();
  }
});

window.addEventListener('message', (event) => {
  if (event.origin !== window.location.origin) return;
  if (event.data?.type !== EMBED_THEME_MESSAGE_TYPE) return;

  const theme = event.data?.theme;
  if (theme !== 'light' && theme !== 'dark') return;

  applyTheme(theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
});


// ---- Footer HTML (shared) ----
function getFooterHTML() {
  if (isEmbedMode()) {
    return '';
  }

  return `
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="footer-logo">
          <div class="footer-logo-icon">π</div>
          <div class="footer-logo-text">The Pi Site</div>
        </div>
        <p class="footer-tagline">Explore the mathematical π, Raspberry Pi computers, and the wonderful world of pie.</p>
        <div class="footer-pi-digits">3.14159…</div>
      </div>
      <div class="footer-links">
        <div class="footer-links-col">
          <h4>SECTIONS</h4>
          <a data-nav="about">About Pi</a>
          <a data-nav="piday">Pi Day</a>
          <a data-nav="raspberrypi">Raspberry Pi</a>
          <a data-nav="piart">Pi Art</a>
        </div>
        <div class="footer-links-col">
          <h4>MORE</h4>
          <a data-nav="explorer">Pi Explorer</a>
          <a data-nav="simulation">Simulation</a>
          <a data-nav="games">Games</a>
          <a data-nav="quiz">Pi Quiz</a>
          <a data-nav="mandala">Infinite Zoom Pi Mandala</a>
          <a data-nav="gallery">Gallery</a>
        </div>
      </div>
    </div>

  </footer>`;
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.toggle('embed-mode', isEmbedMode());
  applyTheme(getInitialTheme());
  navigateTo(getInitialPage(), { forceLocal: true });
});
