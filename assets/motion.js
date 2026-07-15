(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('motion-ready');

  const revealTargets = document.querySelectorAll(
    '.section-heading, .project-grid, .experience, .experience-lead, .timeline li, footer'
  );

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach((element) => {
      element.classList.add('is-visible');
      if (element.classList.contains('project-grid')) {
        element.querySelectorAll('.project').forEach((project) => project.classList.add('is-visible'));
      }
    });
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      if (entry.target.classList.contains('project-grid')) {
        entry.target.querySelectorAll('.project').forEach((project) => project.classList.add('is-visible'));
      }
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.04, rootMargin: '0px 0px -7% 0px' });

  revealTargets.forEach((element) => revealObserver.observe(element));

  const portrait = document.querySelector('.portrait-card');
  if (portrait && window.matchMedia('(hover: hover)').matches) {
    portrait.addEventListener('pointermove', (event) => {
      const box = portrait.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      portrait.style.setProperty('--portrait-rx', `${-y * 8}deg`);
      portrait.style.setProperty('--portrait-ry', `${x * 10}deg`);
      portrait.style.setProperty('--portrait-x', `${x * 5}px`);
      portrait.style.setProperty('--portrait-y', `${y * 5}px`);
    });

    portrait.addEventListener('pointerleave', () => {
      ['--portrait-rx', '--portrait-ry', '--portrait-x', '--portrait-y']
        .forEach((property) => portrait.style.removeProperty(property));
    });
  }

  document.querySelectorAll('.project-visual').forEach((visual) => {
    const art = visual.querySelector('.visual-art');
    if (!art || !window.matchMedia('(hover: hover)').matches) return;

    visual.addEventListener('pointermove', (event) => {
      const box = visual.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      art.style.setProperty('--art-x', `${x * 18}px`);
      art.style.setProperty('--art-y', `${y * 18}px`);
    });

    visual.addEventListener('pointerleave', () => {
      art.style.setProperty('--art-x', '0px');
      art.style.setProperty('--art-y', '0px');
    });
  });

  const stamp = document.querySelector('.experience-stamp');
  if (stamp) {
    let counted = false;
    const countObserver = new IntersectionObserver((entries, observer) => {
      if (!entries[0].isIntersecting || counted) return;
      counted = true;
      const start = performance.now();
      const duration = 850;

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        stamp.textContent = `${String(Math.round(eased * 9)).padStart(2, '0')}+`;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      observer.disconnect();
    }, { threshold: 0.7 });
    countObserver.observe(stamp);
  }

  const navLinks = [...document.querySelectorAll('nav a[href^="#"]')];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { threshold: 0, rootMargin: '-40% 0px -50% 0px' });

  sections.forEach((section) => navObserver.observe(section));

  let ticking = false;
  const updateGrid = () => {
    document.querySelector('main').style.backgroundPosition = `0 0, 0 ${window.scrollY * -0.025}px`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateGrid);
  }, { passive: true });
})();
