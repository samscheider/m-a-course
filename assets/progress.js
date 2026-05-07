/* Progress tracking via localStorage */
(function () {
  const KEY_READ = 'macourse:read';
  const KEY_FLASH = 'macourse:flashcards';
  const KEY_QUIZ = 'macourse:quiz';
  const KEY_SCEN = 'macourse:scenarios';

  function getRead() {
    try { return JSON.parse(localStorage.getItem(KEY_READ) || '{}'); } catch (e) { return {}; }
  }
  function setRead(map) { localStorage.setItem(KEY_READ, JSON.stringify(map)); }

  function markRead(moduleId) {
    const m = getRead(); m[moduleId] = Date.now(); setRead(m);
  }
  function isRead(moduleId) { return Boolean(getRead()[moduleId]); }

  function getFlashState() {
    try { return JSON.parse(localStorage.getItem(KEY_FLASH) || '{}'); } catch (e) { return {}; }
  }
  function setFlashState(s) { localStorage.setItem(KEY_FLASH, JSON.stringify(s)); }

  function getQuizState() {
    try { return JSON.parse(localStorage.getItem(KEY_QUIZ) || '{}'); } catch (e) { return {}; }
  }
  function setQuizState(s) { localStorage.setItem(KEY_QUIZ, JSON.stringify(s)); }

  function getScenarioState() {
    try { return JSON.parse(localStorage.getItem(KEY_SCEN) || '{}'); } catch (e) { return {}; }
  }
  function setScenarioState(s) { localStorage.setItem(KEY_SCEN, JSON.stringify(s)); }

  window.MAProgress = {
    getRead, markRead, isRead,
    getFlashState, setFlashState,
    getQuizState, setQuizState,
    getScenarioState, setScenarioState,
  };
})();
