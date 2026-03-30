/* ============================================================
   APP.JS — Navigation + Light Mode + Init
   ============================================================ */

// PI CONSTANT (1001 digits)
const PI_DIGITS = '31415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491';

// Page titles for dynamic render
const PAGE_MAP = {
  about: { fn: renderAbout, init: initLivingUniverse },
  piday: { fn: renderPiDay, init: null },
  raspberrypi: { fn: renderRaspberryPi, init: null },
  piart: { fn: renderPiArt, init: initPiArt },
  symphony: { fn: renderSymphony, init: initSymphony },
  explorer: { fn: renderExplorer, init: initExplorer },
  simulation: { fn: renderSimulation, init: initSimulation },
  games: { fn: renderGames, init: initGames },
  quiz: { fn: renderQuiz, init: initQuiz },
  mandala: { fn: renderMandala, init: initMandala },
  gallery: { fn: renderGallery, init: initGallery }
};

let activePage = 'about';
const renderedPages = new Set();

function navigateTo(page) {
  if (!PAGE_MAP[page]) return;

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
    PAGE_MAP[page].fn();
    renderedPages.add(page);
  }

  // Init (resize canvas, etc.)
  if (PAGE_MAP[page].init) PAGE_MAP[page].init();

  activePage = page;
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


// ---- Footer HTML (shared) ----
function getFooterHTML() {
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
    </div>

  </footer>`;
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(getInitialTheme());
  navigateTo('about');
});
