/* ============================================================
   ECO3311 · Field Guide — interactions
   ============================================================ */

(() => {
  'use strict';

  /* ---------- Scroll spy ---------- */

  const nav = document.getElementById('chapterNav');
  const navLinks = Array.from(nav.querySelectorAll('a[data-nav]'));
  const sections = navLinks
    .map(a => document.getElementById(a.getAttribute('data-nav')))
    .filter(Boolean);

  const setActive = (id) => {
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('data-nav') === id));
  };

  const observer = new IntersectionObserver((entries) => {
    // Choose the entry closest to the top that is intersecting
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (visible) setActive(visible.target.id);
  }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));

  /* ---------- Quiz reveal ---------- */

  document.querySelectorAll('.qa .reveal').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.qa').classList.add('open');
    });
  });

  /* ---------- Copy formulas ---------- */

  const toast = document.getElementById('toast');
  let toastTimer = null;
  const showToast = (msg = 'Copied') => {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1400);
  };

  document.querySelectorAll('.formula').forEach(el => {
    el.addEventListener('click', async () => {
      const text = el.getAttribute('data-copy') || el.querySelector('.expr')?.textContent || '';
      try {
        await navigator.clipboard.writeText(text);
        el.classList.add('copied');
        setTimeout(() => el.classList.remove('copied'), 1200);
        showToast('Formula copied');
      } catch {
        showToast('Copy failed');
      }
    });
  });

  /* ---------- Search ---------- */

  const scrim = document.getElementById('searchScrim');
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  const searchBtn = document.getElementById('searchBtn');

  // Build search index from headings
  const index = [];
  document.querySelectorAll('.chapter').forEach(ch => {
    const id = ch.id;
    const chTitle = ch.querySelector('.chapter-title')?.textContent.trim() || '';
    const chNum = ch.querySelector('.chapter-num')?.textContent.trim() || '';
    // Chapter entry
    index.push({
      id, title: chTitle, ch: `Chapter ${chNum}`, hay: (chTitle + ' ' + chNum).toLowerCase()
    });
    // Concept entries
    ch.querySelectorAll('.concept').forEach(c => {
      const title = c.querySelector('.concept-title')?.textContent.trim();
      const label = c.querySelector('.concept-label')?.textContent.trim();
      const body = c.querySelector('.concept-body')?.textContent.replace(/\s+/g, ' ').trim() || '';
      if (title) index.push({
        id, title, ch: `${chTitle} · ${label || ''}`,
        hay: (title + ' ' + body).toLowerCase()
      });
    });
  });

  let focused = 0;
  const renderResults = (q) => {
    const query = q.trim().toLowerCase();
    if (!query) {
      results.innerHTML = index.slice(0, 8).map((h, i) =>
        `<a class="hit${i === 0 ? ' focused' : ''}" href="#${h.id}"><div class="hit-ch">${h.ch}</div><div class="hit-title">${h.title}</div></a>`
      ).join('');
      focused = 0;
      return;
    }
    const hits = index.filter(h => h.hay.includes(query)).slice(0, 12);
    if (!hits.length) {
      results.innerHTML = '<div class="empty">No matches. Try another term.</div>';
      return;
    }
    results.innerHTML = hits.map((h, i) =>
      `<a class="hit${i === 0 ? ' focused' : ''}" href="#${h.id}"><div class="hit-ch">${h.ch}</div><div class="hit-title">${h.title}</div></a>`
    ).join('');
    focused = 0;
    // Wire hover-focus for keyboard navigation coherence
    results.querySelectorAll('.hit').forEach((el, i) => {
      el.addEventListener('mouseenter', () => {
        results.querySelectorAll('.hit').forEach(x => x.classList.remove('focused'));
        el.classList.add('focused');
        focused = i;
      });
      el.addEventListener('click', closeSearch);
    });
  };

  const openSearch = () => {
    scrim.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => input.focus(), 30);
    renderResults('');
  };
  const closeSearch = () => {
    scrim.classList.remove('open');
    document.body.style.overflow = '';
    input.value = '';
  };

  searchBtn.addEventListener('click', openSearch);
  scrim.addEventListener('click', (e) => { if (e.target === scrim) closeSearch(); });

  input.addEventListener('input', (e) => renderResults(e.target.value));

  window.addEventListener('keydown', (e) => {
    const isMac = navigator.platform.toLowerCase().includes('mac');
    const cmd = isMac ? e.metaKey : e.ctrlKey;
    if (cmd && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (scrim.classList.contains('open')) closeSearch();
      else openSearch();
    }
    if (e.key === 'Escape' && scrim.classList.contains('open')) closeSearch();

    if (scrim.classList.contains('open')) {
      const hits = Array.from(results.querySelectorAll('.hit'));
      if (!hits.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        hits.forEach(h => h.classList.remove('focused'));
        focused = (focused + 1) % hits.length;
        hits[focused].classList.add('focused');
        hits[focused].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        hits.forEach(h => h.classList.remove('focused'));
        focused = (focused - 1 + hits.length) % hits.length;
        hits[focused].classList.add('focused');
        hits[focused].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const target = hits[focused];
        if (target) {
          window.location.hash = target.getAttribute('href');
          closeSearch();
        }
      }
    }
  });

  /* ---------- Set initial active nav ---------- */

  const initialHash = window.location.hash.replace('#', '');
  if (initialHash && document.getElementById(initialHash)) {
    setActive(initialHash);
  } else {
    setActive('overview');
  }

})();
