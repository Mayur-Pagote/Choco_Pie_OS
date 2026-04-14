/* ============================================================
   PAGES/PIDAY.JS — Pi Day Section
   ============================================================ */

function renderPiDay() {
  const section = document.getElementById("page-piday");
  section.innerHTML = `
  <div class="content-wrap">

    <div class="page-header">
      <span class="pill pill-orange">March 14</span>
      <h1 class="page-title">Pi Day (3/14)</h1>
      <p class="page-subtitle">March 14th — written as 3/14 — commemorates the mathematical constant π = 3.14159…, celebrated worldwide with pie, puzzles, and mathematical fun.</p>
      <div class="divider-line"><span></span><span></span></div>
      <div class="page-header-actions">
        <button class="btn btn-primary" onclick="navigateTo('explorer')"><i class="fa-solid fa-magnifying-glass"></i> Explore More Facts</button>
        <button class="btn btn-secondary" onclick="navigateTo('games')"><i class="fa-solid fa-gamepad"></i> Play Pi Day Game!</button>
      </div>
    </div>

    <!-- Pi Fact + π Symbol — unified card style -->
    <div class="two-col" style="align-items:stretch;margin-bottom:24px;">

      <div class="card piday-feature-card">
        <div class="piday-card-bar">
          <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
          <span>Pi Fact of the Day</span>
        </div>
        <div class="piday-card-body">
          <strong>Wish someone a "Happy π Day!" at exactly 1:59 PM on March 14</strong> — that's 3/14 at 1:59, representing the first six digits of π: 3.14159. The most dedicated Pi enthusiasts celebrate at 1:59:26 AM or PM for seven digits!
        </div>
      </div>

      <div class="card piday-feature-card">
        <div class="piday-card-bar">
          <i class="fa-solid fa-infinity" aria-hidden="true"></i>
          <span>The π Symbol</span>
        </div>
        <div class="piday-symbol-body">
          <div class="piday-symbol-glyph" aria-hidden="true">π</div>
          <div class="piday-symbol-text">
            The Greek letter π was first used to represent this constant by
            <strong>William Jones in 1706</strong>, and popularized by Leonhard Euler in 1737.
          </div>
        </div>
      </div>

    </div>

    <!-- 3 Info Cards — unified icons -->
    <div class="three-col">
      <div class="card">
        <div class="card-title"><i class="fa-solid fa-flag"></i> Origin</div>
        <div class="card-text">
          Pi Day was first organized by physicist <strong>Larry Shaw</strong> on March 14, 1988 at the San Francisco Exploratorium.
          The US Congress officially recognized it as National Pi Day on March 12, 2009.
        </div>
      </div>
      <div class="card">
        <div class="card-title"><i class="fa-solid fa-champagne-glasses"></i> Celebrations</div>
        <div class="card-text">
          Pi Day festivities include <strong>pie-eating contests</strong>, math puzzles, recitation challenges, debates of π vs e, and educational events in schools worldwide.
          Princeton, NJ also celebrates Einstein's birthday (March 14) alongside Pi Day!
        </div>
      </div>
      <div class="card">
        <div class="card-title"><i class="fa-solid fa-trophy"></i> Fun Facts</div>
        <div class="card-text">
          The most π digits memorized is <strong>70,030 digits</strong> by Rajveer Meena (India, 2015).
          The world record for computing π was set in June 2022: <strong>100 trillion digits</strong> by Emma Haruka Iwao using Google Cloud.
        </div>
      </div>
    </div>

    <!-- Timeline -->
    <div class="card" style="margin-bottom:24px;">
      <div class="section-heading"><i class="fa-solid fa-clock-rotate-left" style="color:var(--orange);margin-right:8px;"></i>Pi Day Milestones</div>
      <div class="timeline">
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-year">1988 — The Birth of Pi Day</div>
          <div class="timeline-text">Larry Shaw organizes the first Pi Day celebration at the San Francisco Exploratorium on March 14. Staff and public march around a circular space and eat fruit pies.</div>
        </div>
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-year">2009 — US National Recognition</div>
          <div class="timeline-text">The US House of Representatives passes Resolution 224, officially designating March 14 as "National Pi Day" and encouraging schools to engage students in pi-related activities.</div>
        </div>
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-year">2015 — Ultimate Pi Day</div>
          <div class="timeline-text">March 14, 2015 was the "Pi Day of the Century" — the date 3/14/15 matched the first 5 digits of π (3.1415). At 9:26:53 AM, the full date/time matched 10 digits: 3.141592653.</div>
        </div>
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-year">2019 — Google Sets Record</div>
          <div class="timeline-text">Emma Haruka Iwao at Google computes π to 31.4 trillion decimal places on Pi Day 2019 — a new world record at the time, later surpassed in 2022 with 100 trillion digits.</div>
        </div>
      </div>
    </div>

    <!-- Pi Day Activity -->
    <div class="two-col">
      <div class="card">
        <div class="card-title"><i class="fa-solid fa-graduation-cap"></i> How to Celebrate</div>
        <ul class="pi-bullet-list">
          <li>Bake or buy a pie (any flavor!) and share it at 1:59 PM</li>
          <li>Challenge friends to memorize π digits</li>
          <li>Watch the film "Life of Pi" as a thematic treat</li>
          <li>Explore the digits of π using our Pi Explorer</li>
          <li>Play a Pi Day game or puzzle</li>
          <li>Discuss the beauty of irrational numbers with friends</li>
        </ul>
      </div>
      <div class="card">
        <div class="card-title"><i class="fa-solid fa-scroll"></i> π in Culture</div>
        <ul class="pi-bullet-list">
          <li>Darren Aronofsky's 1998 film "<em>π</em>" — a mathematical thriller</li>
          <li>The Indiana Pi Bill (1897) attempted to legislate π = 3.2</li>
          <li>Kate Bush's song "π" recites 78 digits (with one error!)</li>
          <li>Carl Sagan's novel "Contact" features a hidden message in π</li>
          <li>The Simpsons has referenced π multiple times</li>
        </ul>
      </div>
    </div>

  </div>
  ${getFooterHTML()}`;
}

