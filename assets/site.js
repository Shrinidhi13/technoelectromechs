(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuClose = document.getElementById('menuClose');
  const scrollProgress = document.getElementById('scrollProgress');
  const toast = document.getElementById('toast');
  const pageRegions = Array.from(document.querySelectorAll('header, main, footer, .mobile-actions'));

  let returnFocus = null;
  let menuTimer = null;
  let scrollTicking = false;

  function openMenu() {
    window.clearTimeout(menuTimer);
    returnFocus = document.activeElement;
    mobileMenu.hidden = false;
    document.body.classList.add('menu-open');
    pageRegions.forEach((region) => { region.setAttribute('inert', ''); });
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close navigation menu');
    window.requestAnimationFrame(() => {
      mobileMenu.classList.add('is-open');
      menuClose.focus();
    });
  }

  function closeMenu(restoreFocus = true, focusTarget = null) {
    mobileMenu.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');

    const finish = () => {
      mobileMenu.hidden = true;
      pageRegions.forEach((region) => { region.removeAttribute('inert'); });
      if (focusTarget instanceof HTMLElement) {
        const hadTabindex = focusTarget.hasAttribute('tabindex');
        if (!hadTabindex) focusTarget.setAttribute('tabindex', '-1');
        focusTarget.focus({ preventScroll: true });
        if (!hadTabindex) {
          focusTarget.addEventListener('blur', () => focusTarget.removeAttribute('tabindex'), { once: true });
        }
      } else if (restoreFocus && returnFocus instanceof HTMLElement) {
        returnFocus.focus();
      }
    };

    if (reducedMotion) finish();
    else menuTimer = window.setTimeout(finish, 260);
  }

  function trapMenuFocus(event) {
    if (event.key === 'Escape') {
      closeMenu();
      return;
    }
    if (event.key !== 'Tab') return;

    const focusable = Array.from(mobileMenu.querySelectorAll('a[href], button:not([disabled])'));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  menuToggle.addEventListener('click', () => {
    if (menuToggle.getAttribute('aria-expanded') === 'true') closeMenu();
    else openMenu();
  });
  menuClose.addEventListener('click', () => closeMenu());
  mobileMenu.addEventListener('keydown', trapMenuFocus);
  mobileMenu.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      const section = document.getElementById(decodeURIComponent(link.hash.slice(1)));
      const focusTarget = section?.querySelector('h1, h2, h3') || section;
      closeMenu(false, focusTarget);
    });
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1040 && !mobileMenu.hidden) closeMenu(false);
  }, { passive: true });

  const rangeData = {
    compact: {
      label: 'APPLICATION / COMPACT',
      title: 'Backup power for essential commercial loads.',
      text: 'A practical starting point for clinics, retail, offices, petrol pumps and smaller facilities where footprint and dependable automatic changeover matter.',
      uses: ['Compact footprint', 'Manual or AMF control', 'Site-specific installation'],
      image: 'https://www.mahindrapowerol.com/images/10kva-genset-img.jpg',
      alt: 'Compact Mahindra Powerol diesel generator set',
      watermark: '30'
    },
    commercial: {
      label: 'APPLICATION / COMMERCIAL',
      title: 'Continuity for facilities with mixed electrical loads.',
      text: 'A starting band for hotels, schools, hospitals, offices and commercial buildings where lighting, HVAC, lifts and equipment must be considered together.',
      uses: ['Mixed-load assessment', 'AMF integration', 'Acoustic configuration'],
      image: 'https://www.mahindrapowerol.com/images/125kva-genset-img.jpg',
      alt: 'Mahindra Powerol commercial diesel generator set',
      watermark: '125'
    },
    industrial: {
      label: 'APPLICATION / INDUSTRIAL',
      title: 'Standby capacity for production environments.',
      text: 'For manufacturing and process facilities where motor starts, load sequencing, duty cycle and future expansion materially affect generator selection.',
      uses: ['Motor-start review', 'Plant integration', 'Preventive AMC planning'],
      image: 'https://www.mahindrapowerol.com/images/250-320kva-genset-img.jpg',
      alt: 'Mahindra Powerol industrial diesel generator set',
      watermark: '320'
    },
    heavy: {
      label: 'APPLICATION / HIGH CAPACITY',
      title: 'High-capacity standby for critical infrastructure.',
      text: 'For large industrial and infrastructure sites where electrical coordination, installation logistics and a structured maintenance plan are essential.',
      uses: ['High-capacity planning', 'Commissioning sequence', 'Lifecycle service strategy'],
      image: 'https://www.mahindrapowerol.com/images/400-625kva-genset-img.jpg',
      alt: 'Mahindra Powerol high-capacity diesel generator set',
      watermark: '625'
    },
    project: {
      label: 'APPLICATION / PROJECT SCALE',
      title: '1,010–1,250 kVA for major continuity projects.',
      text: 'For large plants, infrastructure, healthcare campuses and critical facilities where load studies, electrical coordination, delivery access and commissioning sequence require project-level planning.',
      uses: ['Dedicated project review', 'High-capacity system integration', 'Commissioning and AMC strategy'],
      image: 'assets/powerol-1010-1250-preview.png',
      alt: 'Mahindra Powerol 1010 to 1250 kVA diesel generator set',
      watermark: '1250'
    }
  };

  const rangePanel = document.getElementById('rangePanel');
  const rangeLabel = document.getElementById('rangeLabel');
  const rangeTitle = document.getElementById('rangeTitle');
  const rangeText = document.getElementById('rangeText');
  const rangeUses = document.getElementById('rangeUses');
  const rangeImage = document.getElementById('rangeImage');
  const rangeWatermark = document.getElementById('rangeWatermark');
  const rangeChoices = Array.from(document.querySelectorAll('.range-choice'));

  function renderRange(key) {
    const data = rangeData[key];
    if (!data) return;

    rangePanel.classList.add('is-changing');
    rangePanel.setAttribute('aria-busy', 'true');
    rangeChoices.forEach((choice) => {
      const active = choice.dataset.range === key;
      choice.classList.toggle('is-active', active);
      choice.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    const update = () => {
      rangeLabel.textContent = data.label;
      rangeTitle.textContent = data.title;
      rangeText.textContent = data.text;
      rangeUses.replaceChildren(...data.uses.map((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        return li;
      }));
      rangeImage.src = data.image;
      rangeImage.alt = data.alt;
      rangeWatermark.textContent = data.watermark;
      rangePanel.setAttribute('aria-busy', 'false');
      window.requestAnimationFrame(() => rangePanel.classList.remove('is-changing'));
    };

    if (reducedMotion) update();
    else window.setTimeout(update, 140);
  }

  rangeChoices.forEach((choice) => {
    choice.addEventListener('click', () => renderRange(choice.dataset.range));
  });

  function updateScrollProgress() {
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    const progress = distance > 0 ? Math.min(1, window.scrollY / distance) : 0;
    scrollProgress.style.width = `${progress * 100}%`;
    scrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateScrollProgress);
      scrollTicking = true;
    }
  }, { passive: true });
  updateScrollProgress();

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const navLinks = Array.from(document.querySelectorAll('.desktop-nav a[href^="#"]'));
  const observedSections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${visible.target.id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-28% 0px -58% 0px', threshold: [0, .15, .5] });
    observedSections.forEach((section) => sectionObserver.observe(section));
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 3200);
  }

  const quoteForm = document.getElementById('quoteForm');
  quoteForm.addEventListener('invalid', (event) => {
    event.target.setAttribute('aria-invalid', 'true');
    showToast('Please complete the highlighted required fields.');
    window.requestAnimationFrame(() => {
      const firstInvalid = quoteForm.querySelector(':invalid');
      if (firstInvalid instanceof HTMLElement) firstInvalid.focus();
    });
  }, true);

  quoteForm.addEventListener('input', (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement) {
      if (event.target.validity.valid) event.target.removeAttribute('aria-invalid');
    }
  });

  quoteForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!quoteForm.reportValidity()) return;

    const data = new FormData(quoteForm);
    const value = (name) => String(data.get(name) || '').trim();
    const lines = [
      'New website enquiry — Techno Electromechs',
      '',
      `Name: ${value('name')}`,
      `Phone: ${value('phone')}`,
      value('company') && `Company: ${value('company')}`,
      value('location') && `Site: ${value('location')}`,
      `Requirement: ${value('requirement')}`,
      `Approx. range: ${value('kva') || 'Not sure'}`,
      `Timeline: ${value('timeline') || 'Not specified'}`,
      value('message') && `Details: ${value('message')}`
    ].filter(Boolean);

    const url = `https://wa.me/919823012044?text=${encodeURIComponent(lines.join('\n'))}`;
    showToast('Your enquiry is ready to review in WhatsApp.');
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  window.addEventListener('load', () => {
    if (!window.location.hash) return;
    const targetId = decodeURIComponent(window.location.hash.slice(1));
    const target = document.getElementById(targetId);
    if (target) window.requestAnimationFrame(() => target.scrollIntoView());
  }, { once: true });

  document.getElementById('year').textContent = String(new Date().getFullYear());
})();
