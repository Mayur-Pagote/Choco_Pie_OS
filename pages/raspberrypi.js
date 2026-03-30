/* ============================================================
   PAGES/RASPBERRYPI.JS — Raspberry Pi Section
   ============================================================ */

function renderRaspberryPi() {
  const section = document.getElementById('page-raspberrypi');
  section.innerHTML = `
  <div class="content-wrap">

    <div class="page-header">
      <span class="pill pill-orange">Hardware</span>
      <h1 class="page-title">Raspberry Pi Computers</h1>
      <p class="page-subtitle">Affordable, credit-card-sized single-board computers that have revolutionized education and hobbyist computing worldwide.</p>
      <div class="divider-line"><span></span><span></span></div>
    </div>

    <div class="card rpi-intro-card">
      <div class="section-heading" style="margin-bottom:10px;"><i class="fa-solid fa-circle-info" style="color:var(--orange);margin-right:8px;"></i>What is Raspberry Pi?</div>
      <p class="card-text">
        Raspberry Pi is a family of low-cost computers created by the Raspberry Pi Foundation, established in 2008 by
        Alan Mycroft, David Braben, Eben Upton, Jack Lang, Pete Lomas, and Rob Mullins. Their goal was to build an affordable,
        programmable computer — priced like a textbook — to remove cost barriers and inspire more young people to learn computing.
      </p>
    </div>

    <!-- Horizontal Timeline -->
    <div class="card" style="margin-bottom:24px;overflow:visible;">
      <div class="section-heading"><i class="fa-solid fa-timeline" style="color:var(--orange);margin-right:8px;"></i>Development Timeline</div>
      <div class="h-timeline">
        <div class="h-timeline-line"></div>
        <div class="h-timeline-item">
          <div class="h-timeline-icon"><i class="fa-solid fa-landmark"></i></div>
          <div class="h-timeline-year">2008</div>
          <div class="h-timeline-desc">Raspberry Pi Foundation established in Cambridge, UK</div>
        </div>
        <div class="h-timeline-item">
          <div class="h-timeline-icon"><i class="fa-solid fa-microchip"></i></div>
          <div class="h-timeline-year">2012</div>
          <div class="h-timeline-desc">First Raspberry Pi released — sold out within hours</div>
        </div>
        <div class="h-timeline-item">
          <div class="h-timeline-icon"><i class="fa-solid fa-bolt"></i></div>
          <div class="h-timeline-year">2019</div>
          <div class="h-timeline-desc">Raspberry Pi 4 — 4K output, USB 3.0, up to 8GB RAM</div>
        </div>
        <div class="h-timeline-item">
          <div class="h-timeline-icon"><i class="fa-solid fa-rocket"></i></div>
          <div class="h-timeline-year">2023</div>
          <div class="h-timeline-desc">Raspberry Pi 5 — 2–3× faster than Pi 4, PCIe support</div>
        </div>
      </div>
    </div>

    <!-- Two Columns: Models + Uses -->
    <div class="two-col">
      <div>
        <div class="section-heading" style="margin-bottom:16px;"><i class="fa-solid fa-server" style="color:var(--orange);margin-right:8px;"></i>Popular Models</div>

        <div class="model-card">
          <div class="model-chip-icon"><i class="fa-solid fa-microchip"></i></div>
          <div class="model-info">
            <div class="model-name">Raspberry Pi 5</div>
            <div class="model-spec">2.4GHz Arm Cortex-A76 · 4/8GB LPDDR4X · PCIe 2.0</div>
          </div>
          <span class="model-pill pill-latest">Latest</span>
        </div>

        <div class="model-card">
          <div class="model-chip-icon"><i class="fa-solid fa-microchip"></i></div>
          <div class="model-info">
            <div class="model-name">Raspberry Pi 4 Model B</div>
            <div class="model-spec">1.8GHz Cortex-A72 · up to 8GB RAM · Dual 4K HDMI</div>
          </div>
          <span class="model-pill pill-popular">Popular</span>
        </div>

        <div class="model-card">
          <div class="model-chip-icon"><i class="fa-solid fa-microchip"></i></div>
          <div class="model-info">
            <div class="model-name">Raspberry Pi Zero 2W</div>
            <div class="model-spec">1GHz Cortex-A53 quad-core · 512MB RAM · WiFi/BT</div>
          </div>
          <span class="model-pill pill-compact">Compact</span>
        </div>

        <div class="model-card">
          <div class="model-chip-icon"><i class="fa-solid fa-microchip"></i></div>
          <div class="model-info">
            <div class="model-name">Raspberry Pi Pico 2</div>
            <div class="model-spec">RP2350 · 520KB SRAM · Dual Cortex-M33 · MicroPython</div>
          </div>
          <span class="model-pill pill-micro">Micro</span>
        </div>

        <div style="margin-top:16px;" class="card" style="background:var(--orange-light);">
          <div class="card-title" style="color:var(--orange);font-size:13px;">💡 Did you know?</div>
          <div class="card-text">Over <strong>50 million</strong> Raspberry Pi boards have been sold since 2012, making it the bestselling British computer of all time.</div>
        </div>
      </div>

      <div>
        <div class="section-heading" style="margin-bottom:16px;"><i class="fa-solid fa-list-check" style="color:var(--orange);margin-right:8px;"></i>Common Uses</div>

        <div class="use-pill"><div class="use-dot"></div> Home media server (Plex, Kodi)</div>
        <div class="use-pill"><div class="use-dot"></div> Retro gaming console (RetroPie)</div>
        <div class="use-pill"><div class="use-dot"></div> Weather station with sensors</div>
        <div class="use-pill"><div class="use-dot"></div> Network-wide ad blocker (Pi-hole)</div>
        <div class="use-pill"><div class="use-dot"></div> Home automation and IoT hub</div>
        <div class="use-pill"><div class="use-dot"></div> VPN server &amp; network router</div>
        <div class="use-pill"><div class="use-dot"></div> Web server / self-hosted apps</div>
        <div class="use-pill"><div class="use-dot"></div> Robotics and drone control</div>
        <div class="use-pill"><div class="use-dot"></div> Desktop computer (Pi 4/5)</div>
        <div class="use-pill"><div class="use-dot"></div> Educational programming (Scratch, Python)</div>
      </div>
    </div>

    <!-- Specs comparison table -->
    <div class="card" style="margin-top:24px;margin-bottom:0;">
      <div class="section-heading"><i class="fa-solid fa-table-cells" style="color:var(--orange);margin-right:8px;"></i>Quick Specs Comparison</div>
      <div style="overflow-x:auto;">
        <table class="rpi-compare-table">
          <thead>
            <tr>
              <th>Model</th>
              <th>Series</th>
              <th>Type</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr class="rpi-group-row"><td colspan="4">Flagship SBCs</td></tr>
            <tr><td>Raspberry Pi Model B</td><td>Flagship</td><td>Single-board computer</td><td>Model B (Ethernet)</td></tr>
            <tr><td>Raspberry Pi Model A</td><td>Flagship</td><td>Single-board computer</td><td>Model A (no Ethernet)</td></tr>
            <tr><td>Raspberry Pi Model B+</td><td>Flagship</td><td>Single-board computer</td><td>Model B (Ethernet)</td></tr>
            <tr><td>Raspberry Pi Model A+</td><td>Flagship</td><td>Single-board computer</td><td>Model A (no Ethernet)</td></tr>
            <tr><td>Raspberry Pi 2 Model B</td><td>Flagship</td><td>Single-board computer</td><td>Model B (Ethernet)</td></tr>
            <tr><td>Raspberry Pi 3 Model B</td><td>Flagship</td><td>Single-board computer</td><td>Model B (Ethernet)</td></tr>
            <tr><td>Raspberry Pi 3 Model B+</td><td>Flagship</td><td>Single-board computer</td><td>Model B (Ethernet)</td></tr>
            <tr><td>Raspberry Pi 3 Model A+</td><td>Flagship</td><td>Single-board computer</td><td>Model A (no Ethernet)</td></tr>
            <tr><td>Raspberry Pi 4 Model B</td><td>Flagship</td><td>Single-board computer</td><td>Model B (Ethernet)</td></tr>
            <tr><td>Raspberry Pi 400</td><td>Keyboard</td><td>Keyboard computer</td><td>All-in-one</td></tr>
            <tr><td>Raspberry Pi 500</td><td>Keyboard</td><td>Keyboard computer</td><td>All-in-one</td></tr>
            <tr><td>Raspberry Pi 500+</td><td>Keyboard</td><td>Keyboard computer</td><td>All-in-one</td></tr>
            <tr><td>Raspberry Pi 5</td><td>Flagship</td><td>Single-board computer</td><td>Model B (Ethernet)</td></tr>

            <tr class="rpi-group-row"><td colspan="4">Zero Series</td></tr>
            <tr><td>Raspberry Pi Zero</td><td>Zero</td><td>Compact SBC</td><td>Base model</td></tr>
            <tr><td>Raspberry Pi Zero W</td><td>Zero</td><td>Compact SBC</td><td>Wireless</td></tr>
            <tr><td>Raspberry Pi Zero WH</td><td>Zero</td><td>Compact SBC</td><td>Wireless + headers</td></tr>
            <tr><td>Raspberry Pi Zero 2 W</td><td>Zero</td><td>Compact SBC</td><td>Wireless</td></tr>

            <tr class="rpi-group-row"><td colspan="4">Compute Module Series</td></tr>
            <tr><td>Raspberry Pi Compute Module 1</td><td>Compute Module</td><td>Embedded module</td><td>Baseboard required</td></tr>
            <tr><td>Raspberry Pi Compute Module 3</td><td>Compute Module</td><td>Embedded module</td><td>Baseboard required</td></tr>
            <tr><td>Raspberry Pi Compute Module 3+</td><td>Compute Module</td><td>Embedded module</td><td>Baseboard required</td></tr>
            <tr><td>Raspberry Pi Compute Module 4S</td><td>Compute Module</td><td>Embedded module</td><td>SO-DIMM form factor</td></tr>
            <tr><td>Raspberry Pi Compute Module 4</td><td>Compute Module</td><td>Embedded module</td><td>Optional wireless</td></tr>
            <tr><td>Raspberry Pi Compute Module 5</td><td>Compute Module</td><td>Embedded module</td><td>Latest generation</td></tr>
            <tr><td>Raspberry Pi Compute Module Zero</td><td>Compute Module</td><td>Embedded module</td><td>Zero 2 W core</td></tr>

            <tr class="rpi-group-row"><td colspan="4">Pico Microcontrollers</td></tr>
            <tr><td>Raspberry Pi Pico</td><td>Pico</td><td>Microcontroller</td><td>No Linux</td></tr>
            <tr><td>Raspberry Pi Pico H</td><td>Pico</td><td>Microcontroller</td><td>Presoldered headers</td></tr>
            <tr><td>Raspberry Pi Pico W</td><td>Pico</td><td>Microcontroller</td><td>Wireless</td></tr>
            <tr><td>Raspberry Pi Pico WH</td><td>Pico</td><td>Microcontroller</td><td>Wireless + headers</td></tr>
            <tr><td>Raspberry Pi Pico 2</td><td>Pico 2</td><td>Microcontroller</td><td>No wireless</td></tr>
            <tr><td>Raspberry Pi Pico 2 with headers</td><td>Pico 2</td><td>Microcontroller</td><td>Presoldered headers</td></tr>
            <tr><td>Raspberry Pi Pico 2 W</td><td>Pico 2</td><td>Microcontroller</td><td>Wireless</td></tr>
            <tr><td>Raspberry Pi Pico 2 W with headers</td><td>Pico 2</td><td>Microcontroller</td><td>Wireless + headers</td></tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
  ${getFooterHTML()}`;
}
