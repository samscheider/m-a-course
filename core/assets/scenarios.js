/* Scenarios practice mode */
(function () {
  if (!Array.isArray(window.SCENARIOS)) return;
  const all = window.SCENARIOS;
  const moduleSelect = document.getElementById('moduleSelect');
  const container = document.getElementById('scenariosContainer');
  if (!container) return;

  const modulesPresent = Array.from(new Set(all.map(s => s.module))).sort();
  modulesPresent.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = 'Module ' + m;
    moduleSelect.appendChild(opt);
  });

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  function render() {
    container.innerHTML = '';
    const mod = moduleSelect.value;
    const list = mod === 'all' ? all : all.filter(s => s.module === mod);
    if (list.length === 0) {
      container.innerHTML = '<p style="text-align:center; color:#888;">No scenarios in this module yet.</p>';
      return;
    }
    list.forEach((s, idx) => {
      const div = document.createElement('div');
      div.className = 'scenario';
      div.innerHTML =
        '<div style="font-family:var(--sans); font-size:0.78rem; font-weight:700; color:#888; letter-spacing:0.06em;">SCENARIO ' + (idx + 1) + ' · MODULE ' + s.module + (s.type === 'clause' ? ' · CLAUSE-SPOTTING' : ' · FACT PATTERN') + '</div>' +
        (s.title ? '<h3 style="margin: 6px 0 12px;">' + escapeHtml(s.title) + '</h3>' : '') +
        '<div class="setup">' + s.setup + '</div>' +
        '<div class="prompt">' + escapeHtml(s.prompt) + '</div>' +
        '<button class="reveal-button" style="padding: 10px 20px; background: var(--accent); color: #fff; border: none; border-radius: 4px; font-family: var(--sans); font-size: 0.92rem; cursor: pointer;">Show model answer</button>' +
        '<div class="reveal"><strong>Model answer:</strong> ' + s.modelAnswer + '</div>';
      container.appendChild(div);
      div.querySelector('.reveal-button').addEventListener('click', () => {
        div.classList.add('revealed');
        const st = (window.MAProgress && window.MAProgress.getScenarioState()) || {};
        st[s.id] = Date.now();
        if (window.MAProgress) window.MAProgress.setScenarioState(st);
      });
    });
  }

  moduleSelect.addEventListener('change', render);
  render();
})();
