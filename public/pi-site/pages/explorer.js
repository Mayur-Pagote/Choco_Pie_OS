/* ============================================================
   PAGES/EXPLORER.JS — Pi Explorer: Search Inside π
   ============================================================ */

let explorerMode = 'search'; // 'search' | 'indexed'
let explorerInitialized = false;

function renderExplorer() {
  const section = document.getElementById('page-explorer');
  // Pi Symphony panel (shown at top of explorer page as per screenshots)
  section.innerHTML = `

  <div class="content-wrap">
    <div class="page-header">
      <span class="pill pill-orange">Explorer</span>
      <h1 class="page-title">Search Inside π</h1>
      <p class="page-subtitle">Find sequences of digits within the expansion of π, or jump directly to any position.</p>
      <div class="divider-line"><span></span><span></span></div>
    </div>

    <!-- Tabs -->
    <div class="tabs-row">
      <button class="tab-btn active" id="tab-search" onclick="switchExplorerTab('search')">Search Mode</button>
      <button class="tab-btn" id="tab-indexed" onclick="switchExplorerTab('indexed')">Indexed Mode</button>
    </div>

    <div class="two-col" style="align-items:start;margin-bottom:0;">

      <!-- Left Panel -->
      <div id="explorer-left-panel">
        <!-- Search Mode -->
        <div id="search-mode-panel" class="card" style="padding:24px;">
          <div class="section-heading" style="font-size:15px;margin-bottom:14px;">Search Mode</div>
          <div class="search-input-row">
            <input type="text" class="input-field" id="pi-search-input" placeholder="Enter digit sequence (e.g. 314)" maxlength="20" />
            <button class="btn btn-primary" id="pi-search-btn" style="white-space:nowrap;">Search</button>
          </div>
          <p class="hint-text">Search within the first 1,001 digits of π.</p>

          <div class="jump-section">
            <div class="jump-label">Jump to Position</div>
            <div class="jump-row">
              <input type="number" class="input-field" id="pi-position-input" placeholder="Digit position (e.g. 100)" min="1" max="1001" />
              <button class="btn btn-secondary" id="pi-go-btn">Go</button>
            </div>
          </div>

          <div class="results-panel">
            <div class="results-title">
              <span>Results</span>
              <span id="results-count-label" style="color:var(--text-mid);font-size:13px;font-weight:400;">No search yet</span>
            </div>
            <div class="results-content" id="results-content">
              <span style="color:#bbb;">Enter a digit sequence above and click Search.</span>
            </div>
          </div>
        </div>

        <!-- Indexed Mode (hidden by default) -->
        <div id="indexed-mode-panel" class="card" style="padding:24px;display:none;">
          <div class="section-heading" style="font-size:15px;margin-bottom:14px;">Indexed Mode</div>
          <p style="font-size:14px;color:var(--text-mid);margin-bottom:14px;">Enter a position (1–1001) to see the digit of π at that position.</p>
          <div class="jump-row">
            <input type="number" class="input-field" id="indexed-pos-input" placeholder="Position (e.g. 1, 10, 42)" min="1" max="1001" />
            <button class="btn btn-primary" id="indexed-go-btn">Look up</button>
          </div>
          <div class="indexed-box" style="margin-top:16px;">
            <div style="font-size:13px;color:var(--text-mid);text-align:center;margin-bottom:4px;">Digit at position</div>
            <div class="digit-at-position" id="indexed-digit">—</div>
            <div id="indexed-context" style="font-size:12px;color:var(--text-mid);text-align:center;font-family:'Courier New',monospace;padding:0 16px 10px;line-height:1.8;word-break:break-all;"></div>
          </div>
        </div>
      </div>

      <!-- Right: Digit Stream -->
      <div class="card" style="padding:20px;">
        <div class="digit-stream-header">
          <div class="digit-stream-title">π Digit Stream</div>
          <div class="digit-stream-count">First 300 digits</div>
        </div>
        <div class="digit-stream-box" id="pi-digit-stream"></div>
        <div class="stream-legend">
          <div class="legend-item">
            <div class="legend-dot legend-dot-orange"></div>
            <span>Search match</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot legend-dot-dark"></div>
            <span>Other digits</span>
          </div>
        </div>
      </div>
    </div>

  </div>
  ${getFooterHTML()}`;
}

function initExplorer() {
  if (explorerInitialized) return;
  explorerInitialized = true;

  renderDigitStream('');

  const searchBtn = document.getElementById('pi-search-btn');
  const searchInput = document.getElementById('pi-search-input');
  const goBtn = document.getElementById('pi-go-btn');
  const posInput = document.getElementById('pi-position-input');
  const indexedGoBtn = document.getElementById('indexed-go-btn');
  const indexedPosInput = document.getElementById('indexed-pos-input');

  if (searchBtn) {
    searchBtn.addEventListener('click', () => doSearch(searchInput?.value));
    searchInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(searchInput.value); });
  }
  if (goBtn) {
    goBtn.addEventListener('click', () => jumpToPosition(parseInt(posInput?.value)));
    posInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') jumpToPosition(parseInt(posInput.value)); });
  }
  if (indexedGoBtn) {
    indexedGoBtn.addEventListener('click', () => lookupIndexed(parseInt(indexedPosInput?.value)));
    indexedPosInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') lookupIndexed(parseInt(indexedPosInput.value)); });
  }
}

function switchExplorerTab(mode) {
  explorerMode = mode;
  document.getElementById('tab-search').classList.toggle('active', mode === 'search');
  document.getElementById('tab-indexed').classList.toggle('active', mode === 'indexed');
  document.getElementById('search-mode-panel').style.display = mode === 'search' ? '' : 'none';
  document.getElementById('indexed-mode-panel').style.display = mode === 'indexed' ? '' : 'none';
}

function renderDigitStream(query) {
  const streamEl = document.getElementById('pi-digit-stream');
  if (!streamEl) return;
  const digits = PI_DIGITS.slice(0, 300);
  if (!query) {
    streamEl.textContent = digits;
    return;
  }
  // Highlight matches
  let html = '';
  let i = 0;
  while (i < digits.length) {
    if (digits.slice(i, i + query.length) === query) {
      html += `<span class="digit-match">${digits.slice(i, i + query.length)}</span>`;
      i += query.length;
    } else {
      html += digits[i];
      i++;
    }
  }
  streamEl.innerHTML = html;
  // Scroll to first match
  const firstMatch = streamEl.querySelector('.digit-match');
  if (firstMatch) firstMatch.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function doSearch(query) {
  if (!query) return;
  query = query.replace(/\D/g, ''); // digits only
  if (!query) return;

  const allDigits = PI_DIGITS;
  const positions = [];
  let idx = 0;
  while (idx < allDigits.length) {
    const found = allDigits.indexOf(query, idx);
    if (found === -1) break;
    positions.push(found + 1); // 1-indexed
    idx = found + 1;
    if (positions.length >= 20) break;
  }

  renderDigitStream(query);

  const countLabel = document.getElementById('results-count-label');
  const resultsContent = document.getElementById('results-content');

  if (positions.length === 0) {
    countLabel.textContent = 'Not found';
    resultsContent.innerHTML = `<span style="color:#e55;">The sequence <strong>"${query}"</strong> was not found in the first 1,001 digits of π.</span>`;
  } else {
    countLabel.textContent = `${positions.length} match${positions.length > 1 ? 'es' : ''}`;
    resultsContent.innerHTML = `
      <div class="results-found">
        <strong>"${query}"</strong> first appears at position <strong style="color:var(--orange);">${positions[0]}</strong>.
        ${positions.length > 1 ? `<br>Also found at: ${positions.slice(1).join(', ')}` : ''}
      </div>`;
  }
}

function jumpToPosition(pos) {
  if (!pos || pos < 1 || pos > 1001) return;
  const streamEl = document.getElementById('pi-digit-stream');
  if (!streamEl) return;
  const digits = PI_DIGITS.slice(0, 300);
  let html = '';
  for (let i = 0; i < digits.length; i++) {
    if (i === pos - 1) {
      html += `<span class="digit-match" id="jump-target">${digits[i]}</span>`;
    } else {
      html += digits[i];
    }
  }
  streamEl.innerHTML = html;
  const target = document.getElementById('jump-target');
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function lookupIndexed(pos) {
  if (!pos || pos < 1 || pos > PI_DIGITS.length) return;
  const digit = PI_DIGITS[pos - 1];
  document.getElementById('indexed-digit').textContent = digit;
  // Show context around the position
  const start = Math.max(0, pos - 6);
  const end = Math.min(PI_DIGITS.length, pos + 5);
  const context = PI_DIGITS.slice(start, end);
  const highlighted = context.slice(0, pos - 1 - start) +
    `<span style="color:var(--orange);font-weight:700;font-size:16px;">[${digit}]</span>` +
    context.slice(pos - start);
  document.getElementById('indexed-context').innerHTML = `…${highlighted}…`;
}

