/* ============================================================
   QUIZ.JS — Pi Quiz Page (75 questions, 10 per run)
   ============================================================ */

// ---- Question Bank (75 questions) ----
const QUIZ_QUESTION_BANK = [
  // --- BASICS ---
  {
    id: 1,
    category: 'Basics',
    q: 'What is the value of π to 5 decimal places?',
    options: ['3.14159', '3.14156', '3.14169', '3.14195'],
    answer: 0
  },
  {
    id: 2,
    category: 'Basics',
    q: 'Pi (π) is defined as the ratio of a circle\'s circumference to its:',
    options: ['Radius', 'Area', 'Diameter', 'Chord'],
    answer: 2
  },
  {
    id: 3,
    category: 'Basics',
    q: 'π is classified as which type of number?',
    options: ['Rational', 'Integer', 'Imaginary', 'Irrational and Transcendental'],
    answer: 3
  },
  {
    id: 4,
    category: 'Basics',
    q: 'What is the formula for the area of a circle?',
    options: ['2πr', 'πr²', 'πd', '2πr²'],
    answer: 1
  },
  {
    id: 5,
    category: 'Basics',
    q: 'What is the formula for the circumference of a circle?',
    options: ['πr²', 'πd', '2πr', 'Both B and C'],
    answer: 3
  },
  {
    id: 6,
    category: 'Basics',
    q: 'What is the approximate decimal value of π?',
    options: ['3.14159', '3.14258', '3.14102', '3.14241'],
    answer: 0
  },
  {
    id: 7,
    category: 'Basics',
    q: 'Which fraction is a common approximation for π?',
    options: ['22/7', '355/11', '333/106', '22/9'],
    answer: 0
  },
  {
    id: 8,
    category: 'Basics',
    q: 'Which Greek letter represents pi?',
    options: ['α (alpha)', 'β (beta)', 'π (pi)', 'μ (mu)'],
    answer: 2
  },
  {
    id: 9,
    category: 'Basics',
    q: 'The decimal expansion of π:',
    options: ['Repeats after 355 digits', 'Never repeats or terminates', 'Terminates at 10 digits', 'Follows a known pattern'],
    answer: 1
  },
  {
    id: 10,
    category: 'Basics',
    q: 'Which mathematician proved π is irrational?',
    options: ['Archimedes', 'Euler', 'Johann Heinrich Lambert', 'Carl Friedrich Gauss'],
    answer: 2
  },

  // --- HISTORY ---
  {
    id: 11,
    category: 'History',
    q: 'Who first used the symbol π to represent the ratio of circumference to diameter?',
    options: ['Isaac Newton', 'William Jones', 'Leonhard Euler', 'Archimedes'],
    answer: 1
  },
  {
    id: 12,
    category: 'History',
    q: 'Which ancient civilization approximated π as 3.125?',
    options: ['Greeks', 'Babylonians', 'Egyptians', 'Romans'],
    answer: 1
  },
  {
    id: 13,
    category: 'History',
    q: 'Archimedes bounded π between which two fractions?',
    options: ['223/71 and 22/7', '22/7 and 355/113', '3 and 4', '3.14 and 3.15'],
    answer: 0
  },
  {
    id: 14,
    category: 'History',
    q: 'In what year was Pi Day (March 14) first officially recognized by the US Congress?',
    options: ['2005', '2009', '2015', '2000'],
    answer: 1
  },
  {
    id: 15,
    category: 'History',
    q: 'Who popularized the symbol π in mathematical notation in 1748?',
    options: ['William Jones', 'Leonhard Euler', 'Gauss', 'Newton'],
    answer: 1
  },
  {
    id: 16,
    category: 'History',
    q: 'The Rhind Papyrus (ancient Egypt) approximated π as:',
    options: ['3.14159', '3.1605', '3.125', '3.0'],
    answer: 1
  },
  {
    id: 17,
    category: 'History',
    q: 'What was Zu Chongzhi\'s approximation 355/113 accurate to?',
    options: ['3 decimal places', '5 decimal places', '6 decimal places', '7 decimal places'],
    answer: 2
  },
  {
    id: 18,
    category: 'History',
    q: 'Which book title references Pi Day (March 14)?',
    options: ['Life of Pi', 'The Pi Man', 'Pi: A Biography of the World\'s Most Mysterious Number', 'The Joy of Pi'],
    answer: 2
  },
  {
    id: 19,
    category: 'History',
    q: 'Who was the first to calculate π using an infinite series?',
    options: ['Newton', 'Leibniz', 'Madhava of Sangamagrama', 'Euler'],
    answer: 2
  },
  {
    id: 20,
    category: 'History',
    q: 'What is Pi Day celebrated as in addition to being a math holiday?',
    options: ['Albert Einstein\'s birthday', 'Stephen Hawking\'s birthday', 'Srinivasa Ramanujan\'s birthday', 'Archimedes\' birthday'],
    answer: 0
  },

  // --- RECORD & COMPUTATION ---
  {
    id: 21,
    category: 'Records',
    q: 'As of recent records, π has been calculated to how many digits?',
    options: ['31 trillion', '62 trillion', '100 trillion+', '10 trillion'],
    answer: 2
  },
  {
    id: 22,
    category: 'Records',
    q: 'The Chudnovsky algorithm is known for:',
    options: ['Being the slowest π algorithm', 'Rapidly converging to π', 'Proving π is irrational', 'Computing e'],
    answer: 1
  },
  {
    id: 23,
    category: 'Records',
    q: 'Which algorithm uses Monte Carlo simulation to estimate π?',
    options: ['Buffon\'s Needle', 'Newton-Raphson', 'Gauss-Legendre', 'Bailey–Borwein–Plouffe'],
    answer: 0
  },
  {
    id: 24,
    category: 'Records',
    q: 'The BBP formula for π is notable because it can:',
    options: ['Compute any digit of π without computing previous digits (in base 16)', 'Prove π is rational', 'Calculate π faster than any other formula', 'Compute π in Roman numerals'],
    answer: 0
  },
  {
    id: 25,
    category: 'Records',
    q: 'What is the current world record holder for memorizing the most digits of π?',
    options: ['Akira Haraguchi', 'Rajveer Meena', 'Marc Umile', 'Suresh Kumar Sharma'],
    answer: 0
  },
  {
    id: 26,
    category: 'Records',
    q: 'Rajveer Meena recited π to how many decimal places?',
    options: ['50,000', '70,000', '100,000', '31,415'],
    answer: 1
  },
  {
    id: 27,
    category: 'Records',
    q: 'Which method involves dropping needles on parallel lines to estimate π?',
    options: ['Archimedes\' Method', 'Buffon\'s Needle', 'Monte Carlo', 'Euler\'s Product'],
    answer: 1
  },
  {
    id: 28,
    category: 'Records',
    q: 'How many digits of π are sufficient for all known engineering applications?',
    options: ['10', '15', '39', '1000'],
    answer: 2
  },

  // --- MATHEMATICS ---
  {
    id: 29,
    category: 'Mathematics',
    q: 'Euler\'s identity e^(iπ) + 1 = 0 beautifully connects π with which other constants?',
    options: ['e and i only', 'e, i, 0, and 1', 'e and 1 only', 'i and infinity'],
    answer: 1
  },
  {
    id: 30,
    category: 'Mathematics',
    q: 'What is the volume of a sphere with radius r?',
    options: ['4πr²', '(4/3)πr³', '2πr³', 'πr³'],
    answer: 1
  },
  {
    id: 31,
    category: 'Mathematics',
    q: 'In trigonometry, π radians equals how many degrees?',
    options: ['90°', '270°', '360°', '180°'],
    answer: 3
  },
  {
    id: 32,
    category: 'Mathematics',
    q: 'What is 2π radians equal to in degrees?',
    options: ['180°', '270°', '360°', '90°'],
    answer: 2
  },
  {
    id: 33,
    category: 'Mathematics',
    q: 'The Basel problem, solved by Euler, showed that π²/6 equals:',
    options: ['1 + 1/4 + 1/9 + 1/16 + …', '1 + 1/2 + 1/3 + 1/4 + …', '1 - 1/3 + 1/5 - 1/7 + …', '1/1! + 1/2! + 1/3! + …'],
    answer: 0
  },
  {
    id: 34,
    category: 'Mathematics',
    q: 'The Leibniz formula for π/4 is:',
    options: ['1 + 1/3 + 1/5 + 1/7 + …', '1 - 1/3 + 1/5 - 1/7 + …', '1/1 + 1/4 + 1/9 + …', '1 × 3 × 5 × 7 × …'],
    answer: 1
  },
  {
    id: 35,
    category: 'Mathematics',
    q: 'π appears in the normal distribution formula. Which field relies heavily on this?',
    options: ['Chemistry', 'Statistics and Probability', 'History', 'Linguistics'],
    answer: 1
  },
  {
    id: 36,
    category: 'Mathematics',
    q: 'What is the surface area of a sphere with radius r?',
    options: ['2πr²', 'πr²', '4πr²', '(4/3)πr²'],
    answer: 2
  },
  {
    id: 37,
    category: 'Mathematics',
    q: 'In which number system does the BBP formula compute individual digits of π?',
    options: ['Binary (base 2)', 'Decimal (base 10)', 'Hexadecimal (base 16)', 'Octal (base 8)'],
    answer: 2
  },
  {
    id: 38,
    category: 'Mathematics',
    q: 'The Wallis product gives π/2 as an infinite product of:',
    options: ['Even/odd fractions', 'Prime numbers', 'Powers of 2', 'Fibonacci numbers'],
    answer: 0
  },
  {
    id: 39,
    category: 'Mathematics',
    q: 'Which period does sin(x) complete one full cycle at?',
    options: ['π', '2π', 'π/2', '4π'],
    answer: 1
  },
  {
    id: 40,
    category: 'Mathematics',
    q: 'What is π multiplied by the diameter of a circle equal to?',
    options: ['The area', 'The circumference', 'The radius squared', 'The volume'],
    answer: 1
  },

  // --- SCIENCE & ENGINEERING ---
  {
    id: 41,
    category: 'Science',
    q: 'The Heisenberg Uncertainty Principle uses π in its formulation through:',
    options: ['ħ = h/2π', 'ħ = h×π', 'ħ = 2h/π', 'ħ = hπ²'],
    answer: 0
  },
  {
    id: 42,
    category: 'Science',
    q: 'π appears in Einstein\'s field equations describing:',
    options: ['Quantum mechanics', 'General relativity', 'Thermodynamics', 'Electrostatics'],
    answer: 1
  },
  {
    id: 43,
    category: 'Science',
    q: 'In signal processing, π/2 radians represents:',
    options: ['A quarter cycle phase shift', 'A half cycle phase shift', 'A full cycle', 'No phase shift'],
    answer: 0
  },
  {
    id: 44,
    category: 'Science',
    q: 'Coulomb\'s law and other electromagnetic formulas often have 4π in their denominators because:',
    options: ['It simplifies integration over spherical surfaces', 'It was chosen arbitrarily', 'It cancels with 2π elsewhere', 'Coulomb liked the number'],
    answer: 0
  },
  {
    id: 45,
    category: 'Science',
    q: 'NASA uses π for spacecraft navigation. Approximately how many digits of π do they typically use?',
    options: ['5', '10', '15', '50'],
    answer: 2
  },
  {
    id: 46,
    category: 'Science',
    q: 'The period of a pendulum T = 2π√(L/g) uses π because:',
    options: ['It involves circular motion principles', 'Pendulums are always circular', '2π is just a constant', 'Gravity is circular'],
    answer: 0
  },
  {
    id: 47,
    category: 'Science',
    q: 'In which formula does π appear in the calculation of a cylinder\'s volume?',
    options: ['V = πr²h', 'V = 2πr', 'V = πrh', 'V = r²h'],
    answer: 0
  },
  {
    id: 48,
    category: 'Science',
    q: 'The Fourier transform uses e^(2πi) because:',
    options: ['It represents one full rotation in the complex plane', 'It was Fourier\'s favourite constant', 'It simplifies convolution', 'It has no physical meaning'],
    answer: 0
  },

  // --- CULTURE & FUN ---
  {
    id: 49,
    category: 'Culture',
    q: 'What date is celebrated as Pi Day?',
    options: ['January 4', 'March 14', 'July 22', 'September 3'],
    answer: 1
  },
  {
    id: 50,
    category: 'Culture',
    q: 'Pi Approximation Day is observed on:',
    options: ['March 14', 'July 22', 'June 28 (Tau Day)', 'December 31'],
    answer: 1
  },
  {
    id: 51,
    category: 'Culture',
    q: '"The Joy of Pi" is a popular science book written by:',
    options: ['Carl Sagan', 'David Blatner', 'Eli Maor', 'Alfred Posamentier'],
    answer: 1
  },
  {
    id: 52,
    category: 'Culture',
    q: 'In the movie "Pi" (1998) directed by Darren Aronofsky, the protagonist searches for:',
    options: ['The last digit of π', 'A pattern in stock market data via π', 'A way to construct a perfect circle', 'The formula for Euler\'s identity'],
    answer: 1
  },
  {
    id: 53,
    category: 'Culture',
    q: 'The practice of writing text using words whose letter counts match the digits of π is called:',
    options: ['Piems', 'Pilish', 'Pi-prose', 'Circulary'],
    answer: 1
  },
  {
    id: 54,
    category: 'Culture',
    q: 'What is the traditional food associated with Pi Day celebrations?',
    options: ['Cake', 'Pi (pie)', 'Pizza', 'All of the above'],
    answer: 3
  },
  {
    id: 55,
    category: 'Culture',
    q: 'The "Super Pi Day" occurred on March 14, 2015 at 9:26:53 AM because:',
    options: ['It was Einstein\'s birthday', 'The date and time spelled out 3.14159265358...', 'NASA launched a mission', 'It was a solar eclipse day'],
    answer: 1
  },
  {
    id: 56,
    category: 'Culture',
    q: 'In Carl Sagan\'s novel "Contact", a hidden message is found in:',
    options: ['The digits of e', 'The digits of π', 'Binary code from space', 'Fibonacci numbers'],
    answer: 1
  },

  // --- RASPBERRY PI ---
  {
    id: 57,
    category: 'Raspberry Pi',
    q: 'The Raspberry Pi was originally created to help:',
    options: ['Professional engineers', 'Promote computer science education in schools', 'Game developers', 'Weather forecasters'],
    answer: 1
  },
  {
    id: 58,
    category: 'Raspberry Pi',
    q: 'The Raspberry Pi Foundation is based in which country?',
    options: ['USA', 'Germany', 'UK', 'Japan'],
    answer: 2
  },
  {
    id: 59,
    category: 'Raspberry Pi',
    q: 'What processor architecture does the Raspberry Pi primarily use?',
    options: ['x86', 'ARM', 'MIPS', 'RISC-V'],
    answer: 1
  },
  {
    id: 60,
    category: 'Raspberry Pi',
    q: 'The official OS for Raspberry Pi is called:',
    options: ['Ubuntu Pi', 'Raspbian/Raspberry Pi OS', 'PiLinux', 'ARM OS'],
    answer: 1
  },
  {
    id: 61,
    category: 'Raspberry Pi',
    q: 'Which programming language is most commonly introduced with Raspberry Pi for beginners?',
    options: ['C++', 'Java', 'Python', 'Assembly'],
    answer: 2
  },
  {
    id: 62,
    category: 'Raspberry Pi',
    q: 'Why is the Raspberry Pi named after π?',
    options: ['Its shape is a circle', 'The founder loves mathematics', 'The original concept was to make a simple computing device, and the "Pi" stood for Python', 'Its board is exactly π cm wide'],
    answer: 2
  },
  {
    id: 63,
    category: 'Raspberry Pi',
    q: 'The Raspberry Pi Pico uses which microcontroller chip?',
    options: ['RP2040', 'BCM2711', 'ARM Cortex-M7', 'ESP32'],
    answer: 0
  },

  // --- ADVANCED ---
  {
    id: 64,
    category: 'Advanced',
    q: 'Which of the following is TRUE about π?',
    options: ['π can be expressed as a fraction', 'π is a normal number (all digits equally distributed)', 'π being normal is proven', 'π is thought to be normal but not yet proven'],
    answer: 3
  },
  {
    id: 65,
    category: 'Advanced',
    q: 'Tau (τ) = 2π is promoted by some mathematicians because:',
    options: ['It eliminates the need for fractions like π/2 in circle formulas', 'It is easier to remember', 'It is a smaller number', 'τ is a prime number'],
    answer: 0
  },
  {
    id: 66,
    category: 'Advanced',
    q: 'In which base does π start with 3? (same as base 10)',
    options: ['All integer bases', 'Only base 10', 'Only base 10 and base 16', 'Base 10 and base 8 only'],
    answer: 0
  },
  {
    id: 67,
    category: 'Advanced',
    q: 'The Gauss-Legendre algorithm computes π with what convergence rate?',
    options: ['Linear convergence', 'Quadratic convergence (doubles digits each step)', 'Logarithmic convergence', 'Cubic convergence'],
    answer: 1
  },
  {
    id: 68,
    category: 'Advanced',
    q: 'The first 144 digits of π sum to:',
    options: ['666', '360', '314', '628'],
    answer: 0
  },
  {
    id: 69,
    category: 'Advanced',
    q: 'π^π is approximately equal to:',
    options: ['31.00', '36.46', '9.87', '99.71'],
    answer: 1
  },
  {
    id: 70,
    category: 'Advanced',
    q: 'Which of these number sequences first appears at position 762 in π? (Feynman Point)',
    options: ['123456', '999999', '314159', '271828'],
    answer: 1
  },
  {
    id: 71,
    category: 'Advanced',
    q: 'Machin\'s formula π/4 = 4·arctan(1/5) − arctan(1/239) was notable because:',
    options: ['It was the first formula found', 'It converged quickly enough to hand-compute 100 digits', 'It only uses addition', 'It involves complex numbers'],
    answer: 1
  },
  {
    id: 72,
    category: 'Advanced',
    q: 'What is Ramanujan\'s famous rapid-convergence formula used for computing π notable for?',
    options: ['Computing 8 decimal digits per extra term', 'It works only in hexadecimal', 'It requires 1000 iterations per digit', 'It uses only integers'],
    answer: 0
  },

  // --- DIGITS & SEQUENCES ---
  {
    id: 73,
    category: 'Digits',
    q: 'What are the first 5 digits of π after the decimal point?',
    options: ['14159', '14162', '14196', '14152'],
    answer: 0
  },
  {
    id: 74,
    category: 'Digits',
    q: 'What is the 10th decimal digit of π? (π = 3.1415926535…)',
    options: ['3', '5', '9', '2'],
    answer: 1
  },
  {
    id: 75,
    category: 'Digits',
    q: 'What digit appears most in the first 1 million decimal places of π?',
    options: ['1', '3', 'All digits appear roughly equally', '7'],
    answer: 2
  }
];

// ---- State ----
let quizState = {
  phase: 'intro',       // 'intro' | 'question' | 'result'
  questions: [],        // selected 10 questions for this run
  current: 0,
  score: 0,
  answers: [],          // {questionId, chosen, correct}
  startTime: null,
  endTime: null,
  questionStartTime: null,
  timePerQuestion: [],  // ms taken per question
  recentIds: JSON.parse(localStorage.getItem('quiz-recent-ids') || '[]'),
  timerInterval: null
};

// ---- Weighted Randomization ----
function selectQuestions(n = 10) {
  const recent = quizState.recentIds;
  // Weight: recently seen questions get weight 0.1, unseen get 1.0
  const weighted = QUIZ_QUESTION_BANK.map(q => ({
    q,
    w: recent.includes(q.id) ? 0.1 : 1.0
  }));

  const selected = [];
  const pool = [...weighted];

  for (let i = 0; i < n && pool.length > 0; i++) {
    const totalWeight = pool.reduce((s, x) => s + x.w, 0);
    let rand = Math.random() * totalWeight;
    let idx = 0;
    for (let j = 0; j < pool.length; j++) {
      rand -= pool[j].w;
      if (rand <= 0) { idx = j; break; }
    }
    selected.push(pool[idx].q);
    pool.splice(idx, 1);
  }

  return selected;
}

function saveRecentIds(ids) {
  // Keep last 30 ids to allow gradual re-introduction
  const combined = [...ids, ...quizState.recentIds];
  const unique = [...new Set(combined)].slice(0, 30);
  localStorage.setItem('quiz-recent-ids', JSON.stringify(unique));
  quizState.recentIds = unique;
}

// ---- Timing Helpers ----
function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return m > 0 ? `${m}m ${rem}s` : `${s}s`;
}

function formatElapsed(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return m > 0
    ? `${String(m).padStart(2,'0')}:${String(rem).padStart(2,'0')}`
    : `0:${String(s).padStart(2,'0')}`;
}

// ---- Render Functions ----
function renderQuiz() {
  const section = document.getElementById('page-quiz');
  if (!section) return;

  section.innerHTML = `
  <div class="content-wrap">
    <div class="page-header">
      <span class="pill pill-orange">π Quiz</span>
      <h1 class="page-title">Pi Knowledge Quiz</h1>
      <p class="page-subtitle">Test your knowledge about π — from basics to advanced mathematics. 10 questions per round drawn from a bank of ${QUIZ_QUESTION_BANK.length} questions.</p>
      <div class="divider-line"><span></span><span></span></div>
    </div>

    <div id="quiz-container">
      <!-- Dynamically rendered phases -->
    </div>
  </div>
  ${getFooterHTML()}`;

  renderQuizPhase();
}

function renderQuizPhase() {
  const container = document.getElementById('quiz-container');
  if (!container) return;

  if (quizState.phase === 'intro') renderIntro(container);
  else if (quizState.phase === 'question') renderQuestion(container);
  else if (quizState.phase === 'result') renderResult(container);
}

// ---- INTRO SCREEN ----
function renderIntro(container) {
  container.innerHTML = `
  <div class="quiz-intro-grid">
    <div class="quiz-intro-card card">
      <div class="quiz-intro-icon">π</div>
      <h2 class="quiz-intro-title">Ready to Test Your Pi Knowledge?</h2>
      <p class="quiz-intro-desc">You'll get <strong>10 random questions</strong> from our bank of <strong>${QUIZ_QUESTION_BANK.length} questions</strong> covering basics, history, mathematics, science, culture, and more. Each run uses weighted randomization to minimize repeated questions.</p>

      <div class="quiz-rules-grid">
        <div class="quiz-rule-item">
          <i class="fa-solid fa-circle-question"></i>
          <div>
            <div class="quiz-rule-title">10 Questions</div>
            <div class="quiz-rule-sub">MCQ with 4 options each</div>
          </div>
        </div>
        <div class="quiz-rule-item">
          <i class="fa-solid fa-stopwatch"></i>
          <div>
            <div class="quiz-rule-title">Timed</div>
            <div class="quiz-rule-sub">Time tracked per question</div>
          </div>
        </div>
        <div class="quiz-rule-item">
          <i class="fa-solid fa-star"></i>
          <div>
            <div class="quiz-rule-title">Scoring</div>
            <div class="quiz-rule-sub">+10 pts per correct answer</div>
          </div>
        </div>
        <div class="quiz-rule-item">
          <i class="fa-solid fa-shuffle"></i>
          <div>
            <div class="quiz-rule-title">Smart Shuffle</div>
            <div class="quiz-rule-sub">Fewer repeats each run</div>
          </div>
        </div>
      </div>

      <div class="quiz-category-tags">
        ${['Basics','History','Mathematics','Science','Records','Culture','Raspberry Pi','Advanced','Digits'].map(c =>
          `<span class="quiz-cat-tag">${c}</span>`
        ).join('')}
      </div>

      <button class="btn btn-primary btn-start-quiz" id="quiz-start-btn">
        <i class="fa-solid fa-play"></i> Start Quiz
      </button>
    </div>

    <div class="quiz-stats-panel">
      <div class="card quiz-stat-card">
        <div class="quiz-stat-num">${QUIZ_QUESTION_BANK.length}</div>
        <div class="quiz-stat-label">Questions in Bank</div>
      </div>
      <div class="card quiz-stat-card">
        <div class="quiz-stat-num">9</div>
        <div class="quiz-stat-label">Categories</div>
      </div>
      <div class="card quiz-stat-card">
        <div class="quiz-stat-num" id="quiz-best-score-display">${localStorage.getItem('quiz-best-score') || '—'}</div>
        <div class="quiz-stat-label">Best Score</div>
      </div>
      <div class="card quiz-stat-card">
        <div class="quiz-stat-num" id="quiz-runs-display">${localStorage.getItem('quiz-runs') || '0'}</div>
        <div class="quiz-stat-label">Runs Taken</div>
      </div>
    </div>
  </div>`;

  document.getElementById('quiz-start-btn').addEventListener('click', startQuiz);
}

// ---- START QUIZ ----
function startQuiz() {
  const questions = selectQuestions(10);
  quizState.questions = questions;
  quizState.current = 0;
  quizState.score = 0;
  quizState.answers = [];
  quizState.timePerQuestion = [];
  quizState.startTime = Date.now();
  quizState.phase = 'question';
  renderQuizPhase();
}

// ---- QUESTION SCREEN ----
function renderQuestion(container) {
  const idx = quizState.current;
  const q = quizState.questions[idx];
  const total = quizState.questions.length;
  const progress = ((idx) / total) * 100;

  quizState.questionStartTime = Date.now();

  // Start live timer display
  if (quizState.timerInterval) clearInterval(quizState.timerInterval);

  container.innerHTML = `
  <div class="quiz-question-layout">
    <!-- Progress Header -->
    <div class="quiz-progress-bar-wrap">
      <div class="quiz-progress-info">
        <span class="quiz-q-counter">Question <strong>${idx + 1}</strong> of <strong>${total}</strong></span>
        <span class="quiz-category-badge">${q.category}</span>
        <span class="quiz-live-timer" id="quiz-live-timer"><i class="fa-regular fa-clock"></i> 0:00</span>
      </div>
      <div class="quiz-progress-track">
        <div class="quiz-progress-fill" style="width:${progress}%"></div>
      </div>
      <div class="quiz-score-live">
        Score: <strong id="quiz-score-live">${quizState.score}</strong> / ${idx * 10}
      </div>
    </div>

    <!-- Question Card -->
    <div class="card quiz-question-card" id="quiz-q-card">
      <div class="quiz-q-number">Q${idx + 1}</div>
      <div class="quiz-q-text">${q.q}</div>
      <div class="quiz-options" id="quiz-options">
        ${q.options.map((opt, i) => `
          <button class="quiz-option-btn" data-idx="${i}" id="quiz-opt-${i}">
            <span class="quiz-opt-letter">${String.fromCharCode(65 + i)}</span>
            <span class="quiz-opt-text">${opt}</span>
          </button>
        `).join('')}
      </div>
      <div class="quiz-next-area" id="quiz-next-area" style="display:none">
        <div class="quiz-feedback" id="quiz-feedback"></div>
        <button class="btn btn-primary" id="quiz-next-btn">
          ${idx + 1 < total ? 'Next Question <i class="fa-solid fa-arrow-right"></i>' : 'See Results <i class="fa-solid fa-flag-checkered"></i>'}
        </button>
      </div>
    </div>
  </div>`;

  // Live timer
  quizState.timerInterval = setInterval(() => {
    const el = document.getElementById('quiz-live-timer');
    if (el) {
      const elapsed = Date.now() - quizState.questionStartTime;
      el.innerHTML = `<i class="fa-regular fa-clock"></i> ${formatElapsed(elapsed)}`;
    }
  }, 500);

  // Option clicks
  container.querySelectorAll('.quiz-option-btn').forEach(btn => {
    btn.addEventListener('click', () => handleAnswer(parseInt(btn.dataset.idx)));
  });
}

function handleAnswer(chosen) {
  // Stop timer
  if (quizState.timerInterval) clearInterval(quizState.timerInterval);

  const q = quizState.questions[quizState.current];
  const timeTaken = Date.now() - quizState.questionStartTime;
  quizState.timePerQuestion.push(timeTaken);

  const correct = chosen === q.answer;
  if (correct) quizState.score += 10;

  quizState.answers.push({ questionId: q.id, chosen, correct, timeTaken });

  // Visual feedback
  const opts = document.querySelectorAll('.quiz-option-btn');
  opts.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.answer) {
      btn.classList.add('quiz-opt-correct');
    } else if (i === chosen && !correct) {
      btn.classList.add('quiz-opt-wrong');
    } else {
      btn.classList.add('quiz-opt-dim');
    }
  });

  // Feedback message
  const feedbackEl = document.getElementById('quiz-feedback');
  const nextArea = document.getElementById('quiz-next-area');
  if (feedbackEl && nextArea) {
    feedbackEl.innerHTML = correct
      ? `<span class="quiz-fb-correct"><i class="fa-solid fa-circle-check"></i> Correct! +10 points</span>`
      : `<span class="quiz-fb-wrong"><i class="fa-solid fa-circle-xmark"></i> Incorrect. The correct answer is: <strong>${q.options[q.answer]}</strong></span>`;
    nextArea.style.display = 'flex';
  }

  // Update score display
  const scoreLive = document.getElementById('quiz-score-live');
  if (scoreLive) scoreLive.textContent = quizState.score;

  // Next button
  document.getElementById('quiz-next-btn').addEventListener('click', () => {
    quizState.current++;
    if (quizState.current < quizState.questions.length) {
      renderQuizPhase();
    } else {
      finishQuiz();
    }
  });
}

// ---- FINISH ----
function finishQuiz() {
  quizState.endTime = Date.now();
  quizState.phase = 'result';

  // Save stats
  const runs = parseInt(localStorage.getItem('quiz-runs') || '0') + 1;
  localStorage.setItem('quiz-runs', runs);

  const best = parseInt(localStorage.getItem('quiz-best-score') || '0');
  if (quizState.score > best) localStorage.setItem('quiz-best-score', quizState.score);

  // Save recent IDs
  saveRecentIds(quizState.questions.map(q => q.id));

  renderQuizPhase();
}

// ---- RESULT SCREEN ----
function renderResult(container) {
  const total = quizState.questions.length;
  const correct = quizState.answers.filter(a => a.correct).length;
  const totalMs = quizState.endTime - quizState.startTime;
  const avgMs = quizState.timePerQuestion.reduce((s, t) => s + t, 0) / quizState.timePerQuestion.length;
  const pct = Math.round((correct / total) * 100);

  const grade = pct >= 90 ? { label: 'Pi Master!', icon: 'fa-trophy', cls: 'grade-gold' }
    : pct >= 70 ? { label: 'Pi Scholar', icon: 'fa-medal', cls: 'grade-silver' }
    : pct >= 50 ? { label: 'Pi Apprentice', icon: 'fa-star', cls: 'grade-bronze' }
    : { label: 'Pi Novice', icon: 'fa-circle', cls: 'grade-none' };

  container.innerHTML = `
  <div class="quiz-result-layout">
    <!-- Score Hero -->
    <div class="card quiz-result-hero">
      <div class="quiz-result-grade ${grade.cls}">
        <i class="fa-solid ${grade.icon}"></i>
        <span>${grade.label}</span>
      </div>
      <div class="quiz-result-score-ring">
        <svg viewBox="0 0 120 120" class="quiz-ring-svg">
          <circle cx="60" cy="60" r="50" class="quiz-ring-track"/>
          <circle cx="60" cy="60" r="50" class="quiz-ring-fill" 
            stroke-dasharray="${2 * Math.PI * 50}" 
            stroke-dashoffset="${2 * Math.PI * 50 * (1 - pct / 100)}"
            style="transition: stroke-dashoffset 1s ease"/>
        </svg>
        <div class="quiz-ring-inner">
          <div class="quiz-ring-pct">${pct}%</div>
          <div class="quiz-ring-label">${correct}/${total}</div>
        </div>
      </div>
      <div class="quiz-result-points">${quizState.score} points</div>
    </div>

    <!-- Stats Row -->
    <div class="quiz-stats-row">
      <div class="card quiz-result-stat">
        <i class="fa-solid fa-stopwatch"></i>
        <div class="quiz-result-stat-val">${formatDuration(totalMs)}</div>
        <div class="quiz-result-stat-key">Total Time</div>
      </div>
      <div class="card quiz-result-stat">
        <i class="fa-solid fa-gauge-high"></i>
        <div class="quiz-result-stat-val">${formatDuration(Math.round(avgMs))}</div>
        <div class="quiz-result-stat-key">Avg per Question</div>
      </div>
      <div class="card quiz-result-stat">
        <i class="fa-solid fa-circle-check"></i>
        <div class="quiz-result-stat-val">${correct}</div>
        <div class="quiz-result-stat-key">Correct</div>
      </div>
      <div class="card quiz-result-stat">
        <i class="fa-solid fa-circle-xmark"></i>
        <div class="quiz-result-stat-val">${total - correct}</div>
        <div class="quiz-result-stat-key">Incorrect</div>
      </div>
    </div>

    <!-- Review -->
    <div class="card quiz-review-card">
      <h3 class="quiz-review-title"><i class="fa-solid fa-list-check"></i> Question Review</h3>
      <div class="quiz-review-list">
        ${quizState.questions.map((q, i) => {
          const ans = quizState.answers[i];
          const ok = ans.correct;
          return `
          <div class="quiz-review-item ${ok ? 'review-correct' : 'review-wrong'}">
            <div class="quiz-review-meta">
              <span class="quiz-review-num">Q${i + 1}</span>
              <span class="quiz-review-cat">${q.category}</span>
              <span class="quiz-review-time"><i class="fa-regular fa-clock"></i> ${formatDuration(ans.timeTaken)}</span>
              <span class="quiz-review-badge ${ok ? 'badge-correct' : 'badge-wrong'}">
                ${ok ? '<i class="fa-solid fa-check"></i> Correct' : '<i class="fa-solid fa-xmark"></i> Wrong'}
              </span>
            </div>
            <div class="quiz-review-q">${q.q}</div>
            ${!ok ? `<div class="quiz-review-answer">Your answer: <em>${q.options[ans.chosen]}</em> &nbsp;|&nbsp; Correct: <strong>${q.options[q.answer]}</strong></div>` : ''}
          </div>`;
        }).join('')}
      </div>
    </div>

    <!-- Actions -->
    <div class="quiz-result-actions">
      <button class="btn btn-primary" id="quiz-retake-btn">
        <i class="fa-solid fa-rotate-right"></i> Retake Quiz
      </button>
      <button class="btn btn-secondary" id="quiz-back-intro-btn">
        <i class="fa-solid fa-house"></i> Back to Intro
      </button>
    </div>
  </div>`;

  document.getElementById('quiz-retake-btn').addEventListener('click', startQuiz);
  document.getElementById('quiz-back-intro-btn').addEventListener('click', () => {
    quizState.phase = 'intro';
    renderQuizPhase();
  });
}

function initQuiz() {
  // No canvas/resize needed — pure DOM
}
