/* Quiz practice mode logic */
(function () {
  if (!Array.isArray(window.QUIZ)) return;

  const questions = window.QUIZ;
  const moduleSelect = document.getElementById('moduleSelect');
  const container = document.getElementById('quizContainer');
  const newRoundBtn = document.getElementById('newRoundBtn');
  const scoreEl = document.getElementById('score');
  if (!container) return;

  // Build module options
  const modulesPresent = Array.from(new Set(questions.map(q => q.module))).sort();
  modulesPresent.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = 'Module ' + m;
    moduleSelect.appendChild(opt);
  });

  let pool = [];
  let totalAnswered = 0;
  let totalCorrect = 0;

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  function rebuildPool() {
    const mod = moduleSelect.value;
    pool = mod === 'all' ? questions.slice() : questions.filter(q => q.module === mod);
    // Shuffle
    pool.sort(() => Math.random() - 0.5);
    pool = pool.slice(0, 20); // 20-question round
    render();
  }

  function render() {
    container.innerHTML = '';
    if (pool.length === 0) {
      container.innerHTML = '<p style="text-align:center; color:#888;">No questions in this module yet.</p>';
      return;
    }
    pool.forEach((q, qIdx) => {
      const div = document.createElement('div');
      div.className = 'quiz-q';
      div.setAttribute('data-id', q.id);
      const optsHtml = q.options.map((o, i) => {
        return '<label><input type="radio" name="q' + qIdx + '" value="' + o.label + '"> <strong>' + o.label + '.</strong> ' + escapeHtml(o.text) + '</label>';
      }).join('');
      div.innerHTML =
        '<div class="q-text"><span style="color:#888; font-family:var(--sans); font-size:0.78rem; font-weight:700; letter-spacing:0.06em;">Q' + (qIdx + 1) + ' · MODULE ' + q.module + '</span><br>' + escapeHtml(q.q) + '</div>' +
        '<div class="quiz-options">' + optsHtml + '</div>' +
        '<div class="quiz-explanation"><strong>Answer: ' + q.correct + '.</strong> ' + escapeHtml(q.explanation) + '</div>';
      container.appendChild(div);
      div.querySelectorAll('input[type=radio]').forEach(input => {
        input.addEventListener('change', () => answer(div, q, input.value));
      });
    });
    scoreEl.textContent = '0 / ' + pool.length + ' answered';
  }

  function answer(div, q, picked) {
    if (div.classList.contains('answered')) return;
    div.classList.add('answered');
    div.querySelectorAll('input').forEach(i => i.disabled = true);
    div.querySelectorAll('label').forEach(l => {
      const input = l.querySelector('input');
      if (input.value === q.correct) l.classList.add('correct');
      else if (input.value === picked && picked !== q.correct) l.classList.add('incorrect');
    });
    totalAnswered++;
    if (picked === q.correct) totalCorrect++;
    scoreEl.textContent = totalCorrect + ' / ' + totalAnswered + ' correct';
    // Save running stats
    const s = (window.MAProgress && window.MAProgress.getQuizState()) || {};
    s.totalAnswered = (s.totalAnswered || 0) + 1;
    s.totalCorrect = (s.totalCorrect || 0) + (picked === q.correct ? 1 : 0);
    s.byQ = s.byQ || {};
    s.byQ[q.id] = { last: Date.now(), correct: picked === q.correct };
    if (window.MAProgress) window.MAProgress.setQuizState(s);
  }

  moduleSelect.addEventListener('change', () => { totalAnswered = 0; totalCorrect = 0; rebuildPool(); });
  newRoundBtn.addEventListener('click', () => { totalAnswered = 0; totalCorrect = 0; rebuildPool(); });

  rebuildPool();
})();
