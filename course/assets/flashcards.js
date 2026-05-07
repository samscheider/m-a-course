/* Flashcards practice mode logic — SRS-lite */
(function () {
  if (!Array.isArray(window.FLASHCARDS)) return;

  const cards = window.FLASHCARDS;
  const state = (window.MAProgress && window.MAProgress.getFlashState()) || {};
  // state[id] = { interval: days, due: timestamp_ms, reps: n, lastGrade: 'good' }

  const moduleSelect = document.getElementById('moduleSelect');
  const cardEl = document.getElementById('card');
  const frontEl = document.getElementById('cardFront');
  const backEl = document.getElementById('cardBack');
  const metaEl = document.getElementById('cardMeta');
  const revealBtn = document.getElementById('revealBtn');
  const gradeBtns = document.getElementById('gradeButtons');
  const counterEl = document.getElementById('counter');
  const filterToggle = document.getElementById('filterToggle');

  if (!cardEl) return;

  // Build module options
  const modulesPresent = Array.from(new Set(cards.map(c => c.module))).sort();
  modulesPresent.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = 'Module ' + m;
    moduleSelect.appendChild(opt);
  });

  let queue = [];
  let currentIdx = 0;
  let onlyDue = false;

  function rebuildQueue() {
    const mod = moduleSelect.value;
    const now = Date.now();
    let pool = cards.slice();
    if (mod !== 'all') pool = pool.filter(c => c.module === mod);
    if (onlyDue) {
      pool = pool.filter(c => {
        const s = state[c.id];
        return !s || (s.due || 0) <= now;
      });
    }
    // Sort: never-seen first, then due cards by due time
    pool.sort((a, b) => {
      const sa = state[a.id], sb = state[b.id];
      if (!sa && sb) return -1;
      if (sa && !sb) return 1;
      if (!sa && !sb) return 0;
      return (sa.due || 0) - (sb.due || 0);
    });
    queue = pool;
    currentIdx = 0;
    showCard();
  }

  function showCard() {
    if (queue.length === 0) {
      cardEl.innerHTML = '<div style="text-align:center; color:#888;">No cards in queue. Try changing the filter.</div>';
      gradeBtns.style.display = 'none';
      revealBtn.style.display = 'none';
      counterEl.textContent = '';
      return;
    }
    if (currentIdx >= queue.length) currentIdx = 0;
    const c = queue[currentIdx];
    cardEl.classList.remove('revealed');
    frontEl.innerHTML = '<div class="question">' + c.front + '</div>';
    backEl.innerHTML = '<div class="answer">' + c.back + '</div><div class="meta">Module ' + c.module + (c.juris ? ' · ' + c.juris.join(', ').toUpperCase() : '') + '</div>';
    metaEl.textContent = '';
    gradeBtns.style.display = 'none';
    revealBtn.style.display = 'inline-block';
    counterEl.textContent = (currentIdx + 1) + ' / ' + queue.length;
  }

  function reveal() {
    cardEl.classList.add('revealed');
    revealBtn.style.display = 'none';
    gradeBtns.style.display = 'flex';
  }

  // SRS-lite intervals: again=now+10min, hard=1d, good=3d→7d→14d→30d, easy=jump 2x
  function grade(g) {
    const c = queue[currentIdx];
    const s = state[c.id] || { interval: 0, reps: 0, due: 0 };
    const now = Date.now();
    const day = 86400000;
    if (g === 'again') {
      s.interval = 0;
      s.due = now + 10 * 60 * 1000;
      s.reps = 0;
    } else if (g === 'hard') {
      s.interval = Math.max(1, Math.round((s.interval || 1) * 1.2));
      s.due = now + s.interval * day;
      s.reps = (s.reps || 0) + 1;
    } else if (g === 'good') {
      s.interval = s.interval ? Math.round(s.interval * 2.5) : 3;
      if (s.interval > 365) s.interval = 365;
      s.due = now + s.interval * day;
      s.reps = (s.reps || 0) + 1;
    } else if (g === 'easy') {
      s.interval = s.interval ? Math.round(s.interval * 4) : 7;
      if (s.interval > 365) s.interval = 365;
      s.due = now + s.interval * day;
      s.reps = (s.reps || 0) + 1;
    }
    s.lastGrade = g;
    state[c.id] = s;
    if (window.MAProgress) window.MAProgress.setFlashState(state);
    currentIdx++;
    showCard();
  }

  revealBtn.addEventListener('click', reveal);
  document.querySelectorAll('#gradeButtons button').forEach(b => {
    b.addEventListener('click', () => grade(b.getAttribute('data-grade')));
  });
  moduleSelect.addEventListener('change', rebuildQueue);
  filterToggle.addEventListener('change', () => { onlyDue = filterToggle.checked; rebuildQueue(); });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!cardEl.classList.contains('revealed')) reveal();
    } else if (cardEl.classList.contains('revealed')) {
      if (e.key === '1') grade('again');
      else if (e.key === '2') grade('hard');
      else if (e.key === '3') grade('good');
      else if (e.key === '4') grade('easy');
    }
  });

  rebuildQueue();
})();
