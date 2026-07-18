/* SammieDigital: shared interactions */
document.addEventListener('DOMContentLoaded', () => {

  /* ---- Loading screen ---- */
  const loader = document.querySelector('.loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('hidden'), 500);
  });

  /* ---- Scroll progress bar ---- */
  const progress = document.querySelector('.scroll-progress');
  const backTop = document.querySelector('.fab-top');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    if (progress) progress.style.width = pct + '%';
    if (backTop) backTop.classList.toggle('visible', h.scrollTop > 600);

    const nav = document.querySelector('.nav');
    if (nav) nav.classList.toggle('scrolled', h.scrollTop > 40);
  }, { passive: true });

  backTop && backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---- Custom cursor ---- */
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (dot && ring && window.matchMedia('(hover:hover)').matches) {
    let rx = 0, ry = 0, mx = 0, my = 0;
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    });
    const tick = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(tick);
    };
    tick();
    document.querySelectorAll('a, button, .card, .port-slide').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });
  }

  /* ---- Theme toggle (mirrors the two logo variants) ---- */
  const root = document.documentElement;
  const themeBtn = document.querySelector('.theme-toggle');
  const saved = localStorage.getItem('sd-theme');
  if (saved) root.setAttribute('data-theme', saved);
  const syncIcon = () => {
    if (!themeBtn) return;
    const dark = root.getAttribute('data-theme') === 'dark';
    themeBtn.innerHTML = `<i class="fa-solid ${dark ? 'fa-sun' : 'fa-moon'}"></i>`;
  };
  syncIcon();
  themeBtn && themeBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('sd-theme', next);
    syncIcon();
  });

  /* ---- Mobile nav ---- */
  const navToggle = document.querySelector('.nav-toggle');
  const mobilePanel = document.querySelector('.mobile-panel');
  const overlay = document.querySelector('.mobile-overlay');
  const closeMobile = () => { mobilePanel && mobilePanel.classList.remove('open'); overlay && overlay.classList.remove('open'); };
  navToggle && navToggle.addEventListener('click', () => {
    mobilePanel.classList.toggle('open'); overlay.classList.toggle('open');
  });
  overlay && overlay.addEventListener('click', closeMobile);
  document.querySelectorAll('.mobile-panel a').forEach(a => a.addEventListener('click', closeMobile));

  /* ---- Scroll reveal ---- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => io.observe(el));

  /* ---- Animated counters ---- */
  const counters = document.querySelectorAll('[data-count]');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur = 1600;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(step); else el.textContent = target + suffix;
      };
      requestAnimationFrame(step);
      cio.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => cio.observe(el));

  /* ---- Portfolio slider controls ---- */
  const slider = document.querySelector('.port-slider');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  if (slider) {
    const scrollAmt = () => slider.querySelector('.port-slide')?.offsetWidth + 24 || 400;
    nextBtn && nextBtn.addEventListener('click', () => slider.scrollBy({ left: scrollAmt(), behavior: 'smooth' }));
    prevBtn && prevBtn.addEventListener('click', () => slider.scrollBy({ left: -scrollAmt(), behavior: 'smooth' }));
  }

  /* ---- Testimonials carousel ---- */
  const slides = document.querySelectorAll('.testi-slide');
  const dots = document.querySelectorAll('.testi-dot');
  let ti = 0;
  const showTesti = (i) => {
    slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
    ti = i;
  };
  dots.forEach((d, idx) => d.addEventListener('click', () => showTesti(idx)));
  if (slides.length) {
    setInterval(() => showTesti((ti + 1) % slides.length), 6000);
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => { o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight = null; });
      if (!isOpen) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  /* ---- Newsletter popup ---- */
  const popup = document.querySelector('.newsletter-popup');
  if (popup && !sessionStorage.getItem('sd-popup-shown')) {
    setTimeout(() => {
      popup.classList.add('open');
      sessionStorage.setItem('sd-popup-shown', '1');
    }, 20000);
  }
  document.querySelectorAll('[data-close-popup]').forEach(btn => btn.addEventListener('click', () => popup.classList.remove('open')));

  /* ---- Generic form submit intercept (demo) ---- */
  document.querySelectorAll('form[data-demo-form]').forEach(f => {
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = f.querySelector('button[type="submit"]');
      if (btn) { const orig = btn.innerHTML; btn.innerHTML = '<i class="fa-solid fa-check"></i> Sent'; setTimeout(() => btn.innerHTML = orig, 2500); }
      f.reset();
    });
  });

  /* ---- Portfolio: filtering ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const magItems = document.querySelectorAll('.mag-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      magItems.forEach(item => {
        const match = cat === 'all' || item.dataset.category === cat;
        item.classList.toggle('hide', !match);
      });
    });
  });

  /* ---- Portfolio: case study modal ---- */
  const csOverlay = document.querySelector('.cs-overlay');
  if (csOverlay && window.CASE_STUDIES) {
    const csHero = csOverlay.querySelector('.cs-hero');
    const fill = (id) => {
      const d = window.CASE_STUDIES[id];
      if (!d) return;
      csHero.style.background = d.color || '';
      csOverlay.querySelector('.cs-tag').textContent = d.tag;
      csOverlay.querySelector('.cs-title').textContent = d.title;
      csOverlay.querySelector('.cs-client').textContent = d.client;
      csOverlay.querySelector('.cs-industry').textContent = d.industry;
      csOverlay.querySelector('.cs-year').textContent = d.year;
      csOverlay.querySelector('.cs-goal').textContent = d.goal;
      csOverlay.querySelector('.cs-solution').textContent = d.solution;
      const tech = csOverlay.querySelector('.cs-tech');
      tech.innerHTML = d.tech.map(t => `<span>${t}</span>`).join('');
      const results = csOverlay.querySelector('.cs-results');
      results.innerHTML = d.results.map(r => `<div><div class="r-num">${r.num}</div><div class="r-label">${r.label}</div></div>`).join('');
      csOverlay.querySelector('.ba-before').textContent = d.before || 'Before';
      csOverlay.querySelector('.ba-after').textContent = d.after || 'After';
    };
    document.querySelectorAll('[data-case]').forEach(card => {
      card.addEventListener('click', () => {
        fill(card.dataset.case);
        csOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    const closeModal = () => { csOverlay.classList.remove('open'); document.body.style.overflow = ''; };
    csOverlay.querySelector('.cs-close').addEventListener('click', closeModal);
    csOverlay.addEventListener('click', (e) => { if (e.target === csOverlay) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    /* before/after range control */
    const baRange = csOverlay.querySelector('.ba-range');
    const baAfter = csOverlay.querySelector('.ba-after');
    const baHandle = csOverlay.querySelector('.ba-handle');
    if (baRange) {
      baRange.addEventListener('input', () => {
        baAfter.style.clipPath = `polygon(0 0, ${baRange.value}% 0, ${baRange.value}% 100%, 0 100%)`;
        baHandle.style.left = baRange.value + '%';
      });
    }
  }

  /* ---- Multi-step form ---- */
  const formWrap = document.querySelector('.form-wrap');
  if (formWrap) {
    const panels = formWrap.querySelectorAll('.form-panel');
    const dots = formWrap.querySelectorAll('.form-step-dot');
    const lines = formWrap.querySelectorAll('.form-step-line');
    const successPanel = formWrap.querySelector('.form-success');
    let step = 0;

    const render = () => {
      panels.forEach((p, i) => p.classList.toggle('active', i === step));
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === step);
        d.classList.toggle('done', i < step);
      });
      lines.forEach((l, i) => l.classList.toggle('done', i < step));
    };
    render();

    formWrap.querySelectorAll('[data-next]').forEach(btn => {
      btn.addEventListener('click', () => {
        const required = panels[step].querySelectorAll('[required]');
        for (const field of required) { if (!field.value) { field.focus(); return; } }
        if (step < panels.length - 1) { step++; render(); window.scrollTo({top: formWrap.offsetTop - 100, behavior:'smooth'}); }
      });
    });
    formWrap.querySelectorAll('[data-prev]').forEach(btn => {
      btn.addEventListener('click', () => { if (step > 0) { step--; render(); } });
    });
    formWrap.querySelectorAll('[data-submit-inquiry]').forEach(btn => {
      btn.addEventListener('click', () => {
        panels.forEach(p => p.classList.remove('active'));
        formWrap.querySelector('.form-steps').style.display = 'none';
        successPanel.classList.add('active');
      });
    });

    formWrap.querySelectorAll('.choice-card').forEach(card => {
      card.addEventListener('click', () => {
        const input = card.querySelector('input');
        if (input.type === 'radio') {
          card.parentElement.querySelectorAll('.choice-card').forEach(c => c.classList.remove('selected'));
        }
        card.classList.toggle('selected', input.type === 'checkbox' ? !input.checked : true);
        input.checked = input.type === 'checkbox' ? !input.checked : true;
      });
    });
  }

});

/* ---- Live grid: filter + load more (Portfolio page) ---- */
document.addEventListener('DOMContentLoaded', () => {
  const liveCards = document.querySelectorAll('.live-card[data-index]');
  const lfBtns = document.querySelectorAll('.lf-btn');
  const loadMoreBtn = document.querySelector('.load-more-btn');
  if (!liveCards.length) return;

  const INITIAL = 8;
  let currentFilter = 'all';
  let expanded = false;

  const renderLive = () => {
    liveCards.forEach(card => {
      const idx = parseInt(card.dataset.index, 10);
      const cat = card.dataset.category;
      const matchesFilter = currentFilter === 'all' || cat === currentFilter;
      const collapsedHide = (currentFilter === 'all' && !expanded && idx >= INITIAL);
      card.style.display = (matchesFilter && !collapsedHide) ? '' : 'none';
    });
    if (loadMoreBtn) {
      loadMoreBtn.parentElement.style.display = (currentFilter === 'all' && !expanded && liveCards.length > INITIAL) ? '' : 'none';
    }
  };
  renderLive();

  lfBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      lfBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.lfFilter;
      renderLive();
    });
  });
  loadMoreBtn && loadMoreBtn.addEventListener('click', () => { expanded = true; renderLive(); });
});

/* ---- Smooth scrolling (Lenis) ---- */
(function initLenis(){
  if (typeof Lenis === 'undefined') return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.2,
  });
  window.__lenis = lenis;

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Route in-page anchor links (nav, quick-nav, FAQ CTAs) through Lenis for a smooth jump
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -20, duration: 1.2 });
  });
})();

/* ---- Button ripple effect ---- */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  const ripple = document.createElement('span');
  const size = Math.max(rect.width, rect.height);
  ripple.className = 'btn-ripple';
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
  ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 650);
});

/* ---- Split-text word reveal for section headings ---- */
document.addEventListener('DOMContentLoaded', () => {
  const headings = document.querySelectorAll('.section-head h2');
  headings.forEach(h => {
    const words = h.textContent.trim().split(/\s+/);
    h.innerHTML = words.map(w =>
      `<span class="split-line"><span class="split-word">${w}</span></span>`
    ).join(' ');
    h.classList.add('split-ready');
    h.querySelectorAll('.split-word').forEach((w, i) => {
      w.style.transitionDelay = (i * 0.045) + 's';
    });
  });

  const splitIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('split-visible');
        splitIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  headings.forEach(h => splitIO.observe(h));
});

