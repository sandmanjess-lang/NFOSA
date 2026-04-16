/* =====================================================
   NFO SA – main.js
   Navigation, Accordion, Search, Accessibility
   ===================================================== */

(function () {
  'use strict';

  /* ── Nav hamburger ── */
  const toggle = document.querySelector('.nav-toggle');
  const primary = document.querySelector('.nav-primary');
  if (toggle && primary) {
    toggle.addEventListener('click', () => {
      const open = toggle.classList.toggle('open');
      primary.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-lower')) {
        toggle.classList.remove('open');
        primary.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        toggle.classList.remove('open');
        primary.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Active nav link ── */
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-primary a').forEach((a) => {
    const href = a.getAttribute('href')?.replace(/\/$/, '') || '';
    if (href && currentPath.endsWith(href)) {
      a.classList.add('active');
    }
  });

  /* ── Accordion / FAQ ── */
  document.querySelectorAll('.accordion__trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      // Close all in the same group
      const group = trigger.closest('.accordion-group');
      if (group) {
        group.querySelectorAll('.accordion__trigger').forEach((t) => {
          t.setAttribute('aria-expanded', 'false');
          const p = document.getElementById(t.getAttribute('aria-controls'));
          if (p) p.classList.remove('open');
        });
      }
      // Toggle this one
      if (!expanded) {
        trigger.setAttribute('aria-expanded', 'true');
        const panel = document.getElementById(trigger.getAttribute('aria-controls'));
        if (panel) panel.classList.add('open');
      }
    });
  });

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.focus?.();
      }
    });
  });

  /* ── Search form submit ── */
  document.querySelectorAll('.nav-search').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = form.querySelector('input')?.value?.trim();
      if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`;
    });
    // Allow pressing Enter in the input
    form.querySelector('input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') form.dispatchEvent(new Event('submit'));
    });
  });

  /* ── Complaint type selection (submit page) ── */
  const typeCards = document.querySelectorAll('.type-card');
  const typeInput = document.getElementById('complaint-type');
  typeCards.forEach((card) => {
    card.addEventListener('click', () => {
      typeCards.forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
      if (typeInput) typeInput.value = card.dataset.type || '';
      // Reveal next section
      const next = document.querySelector('.complaint-form-section');
      if (next) {
        next.hidden = false;
        next.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Step indicator (multi-step form) ── */
  const steps = document.querySelectorAll('.step-panel');
  const stepBtns = document.querySelectorAll('[data-step-next], [data-step-back]');
  let currentStep = 0;

  function showStep(idx) {
    steps.forEach((s, i) => {
      s.hidden = i !== idx;
      s.setAttribute('aria-hidden', i !== idx);
    });
    document.querySelectorAll('.step-indicator__item').forEach((el, i) => {
      el.classList.toggle('active', i === idx);
      el.classList.toggle('done', i < idx);
    });
    currentStep = idx;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  stepBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.hasAttribute('data-step-next')) showStep(currentStep + 1);
      if (btn.hasAttribute('data-step-back')) showStep(currentStep - 1);
    });
  });

  /* ── Form character counter ── */
  document.querySelectorAll('textarea[maxlength]').forEach((ta) => {
    const max = parseInt(ta.getAttribute('maxlength'), 10);
    const counter = document.createElement('span');
    counter.className = 'form-hint char-counter';
    counter.textContent = `0 / ${max} characters`;
    ta.parentNode.appendChild(counter);
    ta.addEventListener('input', () => {
      counter.textContent = `${ta.value.length} / ${max} characters`;
    });
  });

  /* ── Scroll-activated header shadow ── */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Announcement banner dismiss ── */
  const banner = document.querySelector('.site-banner');
  const bannerClose = banner?.querySelector('.site-banner__close');
  if (bannerClose) {
    bannerClose.addEventListener('click', () => {
      banner.remove();
      sessionStorage.setItem('banner-dismissed', '1');
    });
    if (sessionStorage.getItem('banner-dismissed')) banner.remove();
  }

  /* ── Print button ── */
  document.querySelectorAll('[data-print]').forEach((btn) => {
    btn.addEventListener('click', () => window.print());
  });

  /* ── Auto-apply reveal classes to key sections ── */
  document.querySelectorAll('.section-header').forEach((el) => {
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
  });
  document.querySelectorAll('.grid-2 > *, .grid-3 > *, .grid-4 > *').forEach((el, i) => {
    if (!el.closest('.hero') && !el.classList.contains('reveal')) {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i % 4 * 80}ms`;
    }
  });
  document.querySelectorAll('.process-step').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 100}ms`;
  });
  document.querySelectorAll('.accordion').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 60}ms`;
  });
  document.querySelectorAll('.participant-card').forEach((el, i) => {
    el.classList.add('reveal-scale');
    el.style.transitionDelay = `${i % 6 * 55}ms`;
  });

  /* ── Scroll Reveal ── */
  const revealEls = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children'
  );
  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('revealed'));
  }

  /* ── Button ripple effect ── */
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  /* ── Parallax hero ── */
  const hero = document.querySelector('.hero');
  if (hero && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        hero.style.backgroundPositionY = `${y * 0.3}px`;
      }
    }, { passive: true });
  }

  /* ── Sticky nav shrink on scroll ── */
  const navLower = document.querySelector('.nav-lower');
  if (navLower) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY > 60;
      navLower.style.paddingTop    = scrolled ? '.5rem' : '';
      navLower.style.paddingBottom = scrolled ? '.5rem' : '';
      navLower.style.transition = 'padding .25s ease';
    }, { passive: true });
  }

  /* ── Number counter animation ── */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target || el.textContent);
    if (isNaN(target)) return;
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    const isInt = Number.isInteger(target);
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = (isInt ? Math.floor(value) : value.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-number').forEach((el) => counterObs.observe(el));
  }

  /* ── Active in-page section highlighting ── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('nav[aria-label="Page sections"] a, nav[aria-label="FAQ categories"] a');
  if (sections.length && navAnchors.length) {
    const sectionObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navAnchors.forEach((a) => {
            const isActive = a.getAttribute('href') === `#${entry.target.id}`;
            a.style.background = isActive ? 'var(--blue)' : '';
            a.style.color = isActive ? 'var(--white)' : '';
            a.style.borderColor = isActive ? 'var(--blue)' : '';
          });
        }
      });
    }, { threshold: 0.35 });
    sections.forEach((s) => sectionObs.observe(s));
  }

  /* ── Type card keyboard accessibility ── */
  document.querySelectorAll('.type-card').forEach((card) => {
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
    });
  });

})();
