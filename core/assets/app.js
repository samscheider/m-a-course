/* App: glossary popups + module read-marking + general chrome */
(function () {
  // Glossary popup wiring
  function initGlossaryPopups() {
    const terms = document.querySelectorAll('span.term[data-term]');
    let openPopup = null;

    function closeOpen() {
      if (openPopup) { openPopup.remove(); openPopup = null; }
    }

    document.addEventListener('click', (e) => {
      if (openPopup && !e.target.closest('.term-popup') && !e.target.closest('span.term[data-term]')) {
        closeOpen();
      }
    });

    terms.forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const key = el.getAttribute('data-term');
        if (!key) return;
        closeOpen();
        const entry = (window.GLOSSARY && window.GLOSSARY[key]) || null;
        const popup = document.createElement('span');
        popup.className = 'term-popup';
        if (!entry) {
          popup.innerHTML = '<strong>' + escapeHtml(el.textContent) + '</strong>Glossary entry not yet available for <code>' + escapeHtml(key) + '</code>.';
        } else {
          popup.innerHTML =
            '<strong>' + escapeHtml(entry.name) + '</strong>' +
            escapeHtml(entry.short) +
            '<a class="more" href="../reference/glossary.html#' + encodeURIComponent(key) + '">Open full entry →</a>';
        }
        el.appendChild(popup);
        openPopup = popup;
        const rect = popup.getBoundingClientRect();
        const overflow = rect.right - window.innerWidth + 16;
        if (overflow > 0) popup.style.right = '0';
        if (rect.bottom > window.innerHeight - 16) {
          popup.style.bottom = '100%';
          popup.style.top = 'auto';
        } else {
          popup.style.top = '100%';
        }
      });
    });
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }

  // Module read-marking
  function markModuleRead() {
    const meta = document.querySelector('meta[name="module-id"]');
    if (!meta) return;
    const id = meta.getAttribute('content');
    if (!id) return;
    if (window.MAProgress) window.MAProgress.markRead(id);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initGlossaryPopups();
    // Mark read after the user has scrolled near the bottom (lightweight signal)
    let marked = false;
    window.addEventListener('scroll', () => {
      if (marked) return;
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.body.scrollHeight;
      if (scrolled >= total - 200) {
        marked = true;
        markModuleRead();
      }
    });
  });

  window.MAEscape = escapeHtml;
})();
