/* ============================================================
   GALLERY.JS — Pi Image Gallery (36 copyright-free images)
   All images sourced from Wikimedia Commons (CC/Public Domain)
   ============================================================ */

const RAW_GALLERY_ITEMS = [
  // â”€â”€ RASPBERRY PI BOARDS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 1,
    category: 'Raspberry Pi',
    title: 'Raspberry Pi 4 Model B',
    desc: 'The Raspberry Pi 4 Model B, released in 2019, is the most powerful Raspberry Pi ever made. It features a quad-core ARM Cortex-A72 processor, up to 8GB RAM, dual 4K display support, USB 3.0, and Gigabit Ethernet — all at an affordable price to support computing education worldwide.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Raspberry_Pi_4_Model_B_-_Side.jpg/1200px-Raspberry_Pi_4_Model_B_-_Side.jpg',
    license: 'CC BY-SA 4.0 · Wikimedia Commons'
  },
  {
    id: 2,
    category: 'Raspberry Pi',
    title: 'Raspberry Pi 400',
    desc: 'The Raspberry Pi 400 is a complete personal computer built into a compact keyboard. Released in 2020, it runs at 1.8GHz — making it the fastest Pi at the time. Just plug in a monitor, keyboard, and power supply and you have a £70 desktop computer. A true modern Sinclair ZX Spectrum moment.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Raspberry_Pi_4_Model_B_-_Side.jpg/800px-Raspberry_Pi_4_Model_B_-_Side.jpg',
    license: 'CC BY-SA 4.0 · Wikimedia Commons'
  },
  {
    id: 3,
    category: 'Raspberry Pi',
    title: 'Raspberry Pi 3 Model B+',
    desc: 'The Raspberry Pi 3 Model B+ (2018) improved upon its predecessor with a faster 1.4GHz processor, dual-band Wi-Fi, Bluetooth 4.2, and faster Ethernet. It helped bring single-board computers to millions of educators, students, and hobbyists around the world.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Raspberry_Pi_3_B%2B_%2839906369025%29.png/1200px-Raspberry_Pi_3_B%2B_%2839906369025%29.png',
    license: 'CC BY 2.0 · Gareth Halfacree'
  },
  {
    id: 4,
    category: 'Raspberry Pi',
    title: 'Raspberry Pi Zero W',
    desc: 'The Raspberry Pi Zero W is a tiny computer with built-in Wi-Fi and Bluetooth. At just 65x30mm, it is one of the smallest capable Linux computers ever made, ideal for wearable projects, IoT devices, and embedded applications.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/RaspberryPi.jpg/800px-RaspberryPi.jpg',
    license: 'CC BY-SA 2.0 · Wikimedia Commons'
  },
  {
    id: 5,
    category: 'Raspberry Pi',
    title: 'Raspberry Pi 5',
    desc: 'Launched in 2023, the Raspberry Pi 5 is the fastest Raspberry Pi to date. Powered by the Broadcom BCM2712, a quad-core Arm Cortex-A76 processor running at 2.4GHz, it delivers 2-3x the CPU performance of the Raspberry Pi 4 and introduces a dedicated PCIe 2.0 interface.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/23551-raspberry-pi-5.jpg',
    license: 'CC BY-SA 4.0 · Wikimedia Commons'
  },
  {
    id: 6,
    category: 'Raspberry Pi',
    title: 'Original Raspberry Pi Model B (2012)',
    desc: 'The original Raspberry Pi Model B, released in February 2012, started a revolution in affordable computing. With a 700MHz ARM processor and just 512MB RAM, it sold over 10,000 units on its first day and sparked a global maker movement.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/RaspberryPi.jpg/1200px-RaspberryPi.jpg',
    license: 'CC BY-SA 2.0 · Wikimedia Commons'
  },
  {
    id: 7,
    category: 'Raspberry Pi',
    title: 'Raspberry Pi 2 Model B',
    desc: 'The Raspberry Pi 2 (2015) was a major upgrade featuring a 900MHz quad-core ARM Cortex-A7 processor and 1GB RAM. It was the first Raspberry Pi capable of running Windows 10 IoT Core, broadening its appeal to Windows developers and enterprise IoT applications.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Raspberry_Pi_3_B%2B_%2839906369025%29.png/800px-Raspberry_Pi_3_B%2B_%2839906369025%29.png',
    license: 'CC BY 2.0 · Gareth Halfacree'
  },

  // â”€â”€ RASPBERRY PI PICO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 8,
    category: 'Raspberry Pi Pico',
    title: 'Raspberry Pi Pico',
    desc: 'The Raspberry Pi Pico (2021) is a low-cost, high-performance microcontroller board powered by the RP2040 chip. It features a dual-core Arm Cortex-M0+ processor running at up to 133MHz, 264KB of SRAM, and 2MB of onboard Flash memory — perfect for embedded and IoT applications.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Raspberry_Pi_3_B%2B_%2839906369025%29.png/800px-Raspberry_Pi_3_B%2B_%2839906369025%29.png',
    license: 'CC BY 2.0 · Gareth Halfacree'
  },
  {
    id: 9,
    category: 'Raspberry Pi Pico',
    title: 'Raspberry Pi Pico W',
    desc: 'The Raspberry Pi Pico W adds wireless networking to the original Pico, featuring the Infineon CYW43439 chip for Wi-Fi and Bluetooth. This makes it ideal for connected IoT projects, smart home devices, and networked sensor applications with MicroPython support.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Raspberry_Pi_4_Model_B_-_Side.jpg/800px-Raspberry_Pi_4_Model_B_-_Side.jpg',
    license: 'CC BY-SA 4.0 · Wikimedia Commons'
  },
  {
    id: 10,
    category: 'Raspberry Pi Pico',
    title: 'RP2040 Microcontroller Chip',
    desc: "The RP2040 is Raspberry Pi's in-house microcontroller chip — the heart of the Pico. It contains two ARM Cortex-M0+ cores, flexible I/O driven by 'PIO' state machines, and 264KB of SRAM. It was designed to be extraordinarily programmer-friendly and is available for just $1.",
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/RaspberryPi.jpg/800px-RaspberryPi.jpg',
    license: 'CC BY-SA 2.0 · Wikimedia Commons'
  },

  // â”€â”€ FAMOUS MATHEMATICIANS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 11,
    category: 'Scientists & Mathematicians',
    title: 'Archimedes of Syracuse',
    desc: 'Archimedes (c. 287-212 BC) was the greatest mathematician of antiquity. He calculated pi to be between 223/71 and 22/7 — an accuracy that stood for 1,500 years. He also discovered pi\'s connection to area (pi*r^2) and volume formulas. His method of exhaustion was a precursor to calculus.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Domenico-Fetti_Archimedes_1620.jpg',
    license: 'Public Domain · Domenico Fetti, 1620'
  },
  {
    id: 12,
    category: 'Scientists & Mathematicians',
    title: 'Leonhard Euler',
    desc: "Leonhard Euler (1707-1783) is the mathematician most responsible for the symbol pi we use today. He popularised the use of pi in his 1748 work 'Introductio in analysises infinitorum.' He also formulated Euler's identity e^(i*pi)+1=0, widely considered the most beautiful equation in mathematics.",
    src: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Leonhard_Euler.jpg',
    license: 'Public Domain · Johann Georg Brucker, 1756'
  },
  {
    id: 13,
    category: 'Scientists & Mathematicians',
    title: 'Srinivasa Ramanujan',
    desc: 'Srinivasa Ramanujan (1887-1920) was a self-taught Indian mathematical genius who produced extraordinarily rapid-convergence formulas for pi. His 1914 formula converges at about 8 decimal digits per term and forms the basis of the Chudnovsky algorithm used in modern world-record pi calculations.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Srinivasa_Ramanujan_-_OPC_-_1.jpg',
    license: 'Public Domain · Government of India, 1930s'
  },
  {
    id: 14,
    category: 'Scientists & Mathematicians',
    title: 'Carl Friedrich Gauss',
    desc: 'Carl Friedrich Gauss (1777-1855) is often called the Prince of Mathematics. The Gauss-Legendre algorithm for computing pi achieves quadratic convergence — doubling the number of correct digits with each iteration. He also developed the arithmetic-geometric mean that underpins many pi algorithms.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Carl_Friedrich_Gauss_1840_by_Jensen.jpg',
    license: 'Public Domain · Christian Albrecht Jensen, 1840'
  },
  {
    id: 15,
    category: 'Scientists & Mathematicians',
    title: 'Gottfried Wilhelm Leibniz',
    desc: 'Gottfried Leibniz (1646-1716) discovered the celebrated Leibniz formula for pi: pi/4 = 1 - 1/3 + 1/5 - 1/7 + ... This alternating series was an early infinite series for pi. Though slow to converge, it demonstrated that pi could be expressed using simple arithmetic — a landmark discovery.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Gottfried_Wilhelm_von_Leibniz.jpg',
    license: 'Public Domain · Christoph Bernhard Francke, c.1700'
  },
  {
    id: 16,
    category: 'Scientists & Mathematicians',
    title: 'Isaac Newton',
    desc: 'Isaac Newton (1643-1727) devised a rapidly converging series for pi based on his general binomial series and used it to compute pi to 15 decimal places by hand. He famously noted he was ashamed to have spent so much time on the computation — a testament to how engaging pi can be.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/3/39/GodfreyKneller-IsaacNewton-1689.jpg',
    license: 'Public Domain · Godfrey Kneller, 1689'
  },
  {
    id: 17,
    category: 'Scientists & Mathematicians',
    title: 'Albert Einstein',
    desc: 'Albert Einstein (1879-1955) was born on March 14 — Pi Day! His General Theory of Relativity field equations contain pi as a fundamental constant, appearing in the gravitational constant factor 8*pi*G/c^4. Einstein greatly admired the deep connection between mathematics and physical reality.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Albert_Einstein_Head.jpg',
    license: 'Public Domain · Oren Jack Turner, 1947'
  },
  {
    id: 18,
    category: 'Scientists & Mathematicians',
    title: 'Blaise Pascal',
    desc: "Blaise Pascal (1623-1662), the French polymath after whom Pascal's Triangle is named, significantly advanced the study of probability and indirectly contributed to pi through the development of mathematical foundations later used in statistical and geometric contexts where pi appears.",
    src: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Blaise_Pascal_Versailles.JPG',
    license: "Public Domain · After Francois II Quesnel"
  },
  {
    id: 19,
    category: 'Scientists & Mathematicians',
    title: 'Johann Heinrich Lambert',
    desc: 'Johann Heinrich Lambert (1728-1777) was the first to rigorously prove that pi is irrational — that it cannot be expressed as a fraction of two integers. His 1768 proof using continued fractions was a monumental achievement, settling a question that had puzzled mathematicians for millennia.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Johann_Heinrich_Lambert.jpg',
    license: 'Public Domain · Wikimedia Commons'
  },
  {
    id: 20,
    category: 'Scientists & Mathematicians',
    title: 'Ada Lovelace — First Programmer',
    desc: "Ada Lovelace (1815-1852) is considered the world's first computer programmer. She understood that Charles Babbage's Analytical Engine could compute not just numbers but anything representable symbolically — including mathematical constants like pi. Her notes on the engine included the first algorithm ever written for a machine.",
    src: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Ada_Lovelace_portrait.jpg',
    license: 'Public Domain · Alfred Edward Chalon, c.1840'
  },

  // â”€â”€ PI MATHEMATICS & VISUALISATION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 21,
    category: 'Pi Mathematics',
    title: 'Pi Unrolled — Circumference Equals pi*d',
    desc: 'This classic animation demonstrates the fundamental definition of pi: the circumference of a circle with diameter 1 equals exactly pi = 3.14159... The circle is unrolled along a straight line to show that the perimeter is approximately 3.14 times the diameter, making it beautifully intuitive.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Pi-unrolled-720.gif',
    license: 'CC BY-SA 3.0 · John Reid'
  },
  {
    id: 22,
    category: 'Pi Mathematics',
    title: 'Monte Carlo Estimation of pi',
    desc: 'The Monte Carlo method estimates pi by randomly scattering points inside a square. The fraction that land within the inscribed quarter-circle converges to pi/4. This simulation — a beautiful marriage of randomness and geometry — is one of the most elegant demonstrations of probability connecting to pi.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Pi_30K.gif',
    license: 'Public Domain · Nicoguaro'
  },
  {
    id: 23,
    category: 'Pi Mathematics',
    title: "Archimedes' Method of Polygons",
    desc: 'Archimedes estimated pi by inscribing and circumscribing regular polygons in a circle and computing their perimeters. Starting with hexagons and doubling to 96 sides, he bounded pi between 223/71 and 22/7 — an approach that dominated mathematics for nearly 2,000 years.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Archimedes_pi.svg/1280px-Archimedes_pi.svg.png',
    license: 'Public Domain · Wikimedia Commons'
  },
  {
    id: 24,
    category: 'Pi Mathematics',
    title: 'Pi — Circumference to Diameter',
    desc: 'The fundamental relationship pi = C/d (circumference divided by diameter) is one of the most important equations in mathematics. No matter how large or small a circle is, this ratio is always exactly pi — an irrational, transcendental constant that has fascinated mathematicians for over 4,000 years.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Pi_eq_C_over_d.svg/1024px-Pi_eq_C_over_d.svg.png',
    license: 'Public Domain · Wikimedia Commons'
  },
  {
    id: 25,
    category: 'Pi Mathematics',
    title: "Euler's Identity — The Most Beautiful Equation",
    desc: "Euler's identity, e^(i*pi) + 1 = 0, is called the most beautiful equation in mathematics. It unites five fundamental constants — e (Euler's number), i (imaginary unit), pi, 1, and 0 — in a single elegant expression. In a 1988 Mathematical Intelligencer poll it was voted the most beautiful theorem.",
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Euler%27s_formula.svg/1200px-Euler%27s_formula.svg.png',
    license: 'Public Domain · Wikimedia Commons'
  },
  {
    id: 26,
    category: 'Pi Mathematics',
    title: 'Unit Circle and Pi',
    desc: 'The unit circle — a circle of radius 1 centred at the origin — is fundamental to trigonometry. Its full circumference is exactly 2*pi. Angles are measured in radians (pi radians = 180 degrees), showing why pi appears in virtually every trigonometric formula and wave equation.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Unit_circle_angles_color.svg/1024px-Unit_circle_angles_color.svg.png',
    license: 'Public Domain · Wikimedia Commons'
  },
  {
    id: 27,
    category: 'Pi Mathematics',
    title: 'Sine Wave — Pi in Action',
    desc: 'The sine and cosine functions complete one full cycle over a period of exactly 2*pi radians. This periodic relationship, central to Fourier analysis, signal processing, and quantum mechanics, means pi appears in virtually every equation describing waves, oscillations, and rotations in physics.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Sine_one_period.svg/1280px-Sine_one_period.svg.png',
    license: 'Public Domain · Wikimedia Commons'
  },
  {
    id: 28,
    category: 'Pi Mathematics',
    title: 'Normal Distribution — Gaussian Bell Curve',
    desc: 'The normal distribution formula explicitly contains pi: f(x) = (1/(sigma*sqrt(2*pi))) * e^(-x^2/(2*sigma^2)). The factor sqrt(2*pi) ensures the total probability integrates to 1. This makes pi a cornerstone of statistics, probability theory, and natural phenomena from height distributions to measurement errors.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Normal_Distribution_PDF.svg/1280px-Normal_Distribution_PDF.svg.png',
    license: 'Public Domain · Wikimedia Commons'
  },

  // â”€â”€ PI DAY & CULTURE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 29,
    category: 'Pi Day & Culture',
    title: 'Pi Day Celebration Pie',
    desc: 'Every year on March 14 (3/14), mathematicians, students, and enthusiasts celebrate Pi Day — a holiday established by physicist Larry Shaw in 1988 at the San Francisco Exploratorium. The word play between pi and pie has made baking and eating pies a beloved tradition on this special day.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Pi_pie2.jpg/1200px-Pi_pie2.jpg',
    license: 'CC BY 2.0 · Wikimedia Commons'
  },
  {
    id: 30,
    category: 'Pi Day & Culture',
    title: 'Pi Day — March 14',
    desc: "Pi Day (March 14) was officially recognised by the U.S. House of Representatives in 2009. It also coincides with Albert Einstein's birthday. In 2019, UNESCO designated it the International Day of Mathematics. Celebrations include pi recitation competitions, pi-themed art, and of course — eating pie.",
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Pi_Day_2014%2C_Mountain_View%2C_CA_USA_%2814035670839%29.jpg/1200px-Pi_Day_2014%2C_Mountain_View%2C_CA_USA_%2814035670839%29.jpg',
    license: 'CC BY 2.0 · Brian Cantoni'
  },
  {
    id: 31,
    category: 'Pi Day & Culture',
    title: 'Rhind Mathematical Papyrus',
    desc: 'The Rhind Papyrus (c. 1650 BC) is an ancient Egyptian mathematical document that approximated pi as (16/9)^2 = 3.1605. This 3,600-year-old scroll, now housed in the British Museum, shows that mathematicians have been grappling with the ratio of a circle\'s circumference to its diameter since antiquity.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Rhind_Mathematical_Papyrus.jpg/1200px-Rhind_Mathematical_Papyrus.jpg',
    license: 'Public Domain · British Museum'
  },
  {
    id: 32,
    category: 'Pi Day & Culture',
    title: 'Pi in Popular Culture',
    desc: 'The pi symbol has become one of the most recognisable icons in mathematics and popular culture alike. It appears on clothing, jewellery, architecture, and street art worldwide. This universally recognised constant represents the beauty and mystery of mathematics that transcends boundaries of language and culture.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Pi_symbol_(bold).svg/800px-Pi_symbol_(bold).svg.png',
    license: 'Public Domain · Wikimedia Commons'
  },

  // â”€â”€ COMPUTING & HISTORY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 33,
    category: 'Computing & History',
    title: 'ENIAC — First Electronic Computer',
    desc: 'ENIAC (1945), the first general-purpose electronic computer, was used in early large-scale pi computations. In 1949, ENIAC computed pi to 2,037 decimal places in 70 hours — a world record at the time. This marked the beginning of the era of computer-aided mathematics and the quest for more digits of pi.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Eniac.jpg/1200px-Eniac.jpg',
    license: 'Public Domain · U.S. Army'
  },
  {
    id: 34,
    category: 'Computing & History',
    title: "Buffon's Needle Experiment",
    desc: 'Georges-Louis Leclerc, Comte de Buffon posed his famous Needle Problem in 1777: if a needle of length L is dropped on a floor with parallel lines spaced L apart, the probability that it crosses a line is 2/pi. This elegant connection between geometry, probability, and pi is one of the most surprising results in mathematics.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Buffon_needle.svg/800px-Buffon_needle.svg.png',
    license: 'Public Domain · Wikimedia Commons'
  },
  {
    id: 35,
    category: 'Computing & History',
    title: 'Zu Chongzhi — Chinese Mathematician',
    desc: 'Zu Chongzhi (429-501 AD) was a Chinese mathematician who calculated pi to 7 decimal places (3.1415926) and found the approximation 355/113, which is accurate to 6 decimal places. This was the most accurate value of pi in the world for nearly 900 years, a remarkable achievement for the 5th century.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Zu_Chongzhi.jpg/800px-Zu_Chongzhi.jpg',
    license: 'Public Domain · Wikimedia Commons'
  },
  {
    id: 36,
    category: 'Computing & History',
    title: 'Alan Turing — Computing Pioneer',
    desc: 'Alan Turing (1912-1954), father of theoretical computer science, was fascinated by mathematics and used early computers for calculations involving pi. His theoretical framework — the Turing Machine — defines what computers can compute, indirectly making modern trillion-digit pi computations possible.',
    src: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Alan_Turing_Aged_16.jpg',
    license: 'Public Domain · Unknown photographer, 1928'
  }
];

const GALLERY_LOCAL_FILE_OVERRIDES = {
  'RaspberryPi.jpg': '1200px-RaspberryPi.jpg',
  'Johann_Heinrich_Lambert.jpg': 'Johann-Heinrich_Lambert.png',
  'Unit_circle_angles_color.svg': 'unit-circle-local.svg',
  'Pi_Day_2014,_Mountain_View,_CA_USA_(14035670839).jpg': 'pi-day-local.svg',
  'Pi_symbol_(bold).svg': 'Pi-symbol.svg',
  'Zu_Chongzhi.jpg': 'zu-chongzhi-local.svg'
};

function getLocalGallerySrc(src) {
  if (!src.startsWith('http')) return src;

  try {
    const url = new URL(src);
    const segments = url.pathname.split('/').filter(Boolean);
    const sourceFile = src.includes('/thumb/')
      ? decodeURIComponent(segments[segments.length - 2] || '')
      : decodeURIComponent(segments[segments.length - 1] || '');
    const localFile = GALLERY_LOCAL_FILE_OVERRIDES[sourceFile] || sourceFile;

    return `assets/gallery/${localFile}`;
  } catch {
    return src;
  }
}

const GALLERY_ITEMS = RAW_GALLERY_ITEMS.map(item => ({
  ...item,
  src: getLocalGallerySrc(item.src)
}));

// â”€â”€ Active filter & lightbox state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let galleryFilter = 'All';
let galleryLightboxOpen = false;
let galleryInitialized = false;

const GALLERY_CATEGORIES = ['All', 'Raspberry Pi', 'Raspberry Pi Pico', 'Scientists & Mathematicians', 'Pi Mathematics', 'Pi Day & Culture', 'Computing & History'];

// â”€â”€ Main Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function renderGallery() {
  const section = document.getElementById('page-gallery');
  if (!section) return;

  section.innerHTML = `
  <div class="content-wrap">
    <div class="page-header">
      <span class="pill pill-orange">Gallery</span>
      <h1 class="page-title">Pi Gallery</h1>
      <p class="page-subtitle">A curated collection of ${GALLERY_ITEMS.length} copyright-free images exploring pi — from Raspberry Pi boards to famous mathematicians, Pi Day celebrations, and mathematical visualisations.</p>
      <div class="divider-line"><span></span><span></span></div>
    </div>

    <!-- Filter Bar -->
    <div class="gallery-filter-bar" id="gallery-filter-bar">
      ${GALLERY_CATEGORIES.map(cat => `
        <button class="gallery-filter-btn ${cat === galleryFilter ? 'active' : ''}" data-cat="${cat}">
          ${cat === 'All' ? '<i class="fa-solid fa-border-all"></i>' : ''}${cat}
        </button>
      `).join('')}
    </div>

    <!-- Stats bar -->
    <div class="gallery-stats-bar">
      <span id="gallery-count-label" class="gallery-count-label"></span>
      <span class="gallery-hint"><i class="fa-solid fa-hand-pointer"></i> Click any image to enlarge</span>
    </div>

    <!-- Grid -->
    <div class="gallery-grid" id="gallery-grid"></div>
  </div>

  <!-- Lightbox -->
  <div class="gallery-lightbox" id="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Image viewer">
    <div class="gallery-lightbox-backdrop" id="gallery-lb-backdrop"></div>
    <div class="gallery-lightbox-panel" id="gallery-lb-panel">
      <button class="gallery-lb-close" id="gallery-lb-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
      <button class="gallery-lb-nav gallery-lb-prev" id="gallery-lb-prev" aria-label="Previous image"><i class="fa-solid fa-chevron-left"></i></button>
      <button class="gallery-lb-nav gallery-lb-next" id="gallery-lb-next" aria-label="Next image"><i class="fa-solid fa-chevron-right"></i></button>
      <div class="gallery-lb-img-wrap">
        <img class="gallery-lb-img" id="gallery-lb-img" src="" alt="" loading="lazy" decoding="async" />
        <div class="gallery-lb-spinner" id="gallery-lb-spinner"><i class="fa-solid fa-circle-notch fa-spin"></i></div>
      </div>
      <div class="gallery-lb-info">
        <div class="gallery-lb-top">
          <span class="gallery-lb-cat" id="gallery-lb-cat"></span>
          <span class="gallery-lb-counter" id="gallery-lb-counter"></span>
        </div>
        <h2 class="gallery-lb-title" id="gallery-lb-title"></h2>
        <p class="gallery-lb-desc" id="gallery-lb-desc"></p>
        <div class="gallery-lb-license" id="gallery-lb-license"></div>
      </div>
    </div>
  </div>

  ${getFooterHTML()}`;

  renderGalleryGrid();
}

// â”€â”€ Grid Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function getFilteredItems() {
  return galleryFilter === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(i => i.category === galleryFilter);
}

function renderGalleryGrid() {
  const grid = document.getElementById('gallery-grid');
  const label = document.getElementById('gallery-count-label');
  if (!grid) return;

  const items = getFilteredItems();
  if (label) label.textContent = `Showing ${items.length} of ${GALLERY_ITEMS.length} images`;

  if (items.length === 0) {
    grid.innerHTML = `<div class="gallery-empty"><i class="fa-solid fa-image"></i><p>No images in this category.</p></div>`;
    return;
  }

  grid.innerHTML = items.map((item, idx) => `
    <div class="gallery-card" data-id="${item.id}" data-idx="${idx}" tabindex="0" role="button" aria-label="View ${item.title}">
      <div class="gallery-card-img-wrap">
        <img class="gallery-card-img" src="${item.src}" alt="${item.title}" loading="lazy" decoding="async" onerror="this.parentElement.classList.add('gallery-img-error')" />
        <div class="gallery-card-overlay">
          <i class="fa-solid fa-magnifying-glass-plus"></i>
          <span>View Details</span>
        </div>
        <span class="gallery-card-cat">${item.category}</span>
      </div>
      <div class="gallery-card-body">
        <div class="gallery-card-title">${item.title}</div>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.gallery-card').forEach((el, i) => {
    el.style.animationDelay = `${i * 24}ms`;
  });
}

// â”€â”€ Event Binding â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function bindGalleryEvents() {
  if (galleryInitialized) return;
  galleryInitialized = true;

  document.getElementById('gallery-filter-bar')?.addEventListener('click', (event) => {
    const button = event.target.closest('.gallery-filter-btn');
    if (!button) return;

    galleryFilter = button.dataset.cat;
    document.querySelectorAll('.gallery-filter-btn').forEach((filterBtn) => {
      filterBtn.classList.toggle('active', filterBtn === button);
    });
    renderGalleryGrid();
  });

  document.getElementById('gallery-grid')?.addEventListener('click', (event) => {
    const card = event.target.closest('.gallery-card');
    if (!card) return;
    openLightbox(parseInt(card.dataset.idx, 10));
  });

  document.getElementById('gallery-grid')?.addEventListener('keydown', (event) => {
    const card = event.target.closest('.gallery-card');
    if (!card || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    openLightbox(parseInt(card.dataset.idx, 10));
  });

  document.getElementById('gallery-lb-close')?.addEventListener('click', closeLightbox);
  document.getElementById('gallery-lb-backdrop')?.addEventListener('click', closeLightbox);
  document.getElementById('gallery-lb-prev')?.addEventListener('click', () => navigateLightbox(-1));
  document.getElementById('gallery-lb-next')?.addEventListener('click', () => navigateLightbox(1));
  document.addEventListener('keydown', handleGalleryKey);
}

// â”€â”€ Lightbox â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let lbCurrentIdx = 0;

function openLightbox(idx) {
  lbCurrentIdx = idx;
  galleryLightboxOpen = true;
  const lb = document.getElementById('gallery-lightbox');
  if (lb) lb.classList.add('active');
  document.body.style.overflow = 'hidden';
  loadLightboxItem(idx);
}

function closeLightbox() {
  galleryLightboxOpen = false;
  const lb = document.getElementById('gallery-lightbox');
  if (lb) lb.classList.remove('active');
  document.body.style.overflow = '';
}

function navigateLightbox(dir) {
  const items = getFilteredItems();
  lbCurrentIdx = (lbCurrentIdx + dir + items.length) % items.length;
  loadLightboxItem(lbCurrentIdx);
}

function loadLightboxItem(idx) {
  const items = getFilteredItems();
  const item = items[idx];
  if (!item) return;

  const img = document.getElementById('gallery-lb-img');
  const spinner = document.getElementById('gallery-lb-spinner');

  // Show spinner while loading
  if (img) { img.style.opacity = '0'; img.src = ''; }
  if (spinner) spinner.style.display = 'flex';

  document.getElementById('gallery-lb-cat').textContent = item.category;
  document.getElementById('gallery-lb-title').textContent = item.title;
  document.getElementById('gallery-lb-desc').textContent = item.desc;
  document.getElementById('gallery-lb-license').innerHTML = `<i class="fa-regular fa-copyright"></i> ${item.license}`;
  document.getElementById('gallery-lb-counter').textContent = `${idx + 1} / ${items.length}`;

  if (img) {
    img.onload = () => {
      if (spinner) spinner.style.display = 'none';
      img.style.opacity = '1';
    };
    img.onerror = () => {
      if (spinner) spinner.style.display = 'none';
      img.style.opacity = '1';
    };
    img.src = item.src;
    img.alt = item.title;
  }
}

function handleGalleryKey(e) {
  if (!galleryLightboxOpen) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
}

function initGallery() {
  bindGalleryEvents();
}

