/* ============================================
   MYSTIC ARCHETYPES — Main JavaScript
   Stars, Particles, Scroll Reveals, FAQ, Form
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── REDUCED MOTION DETECTION ───────────────
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── STAR FIELD ─────────────────────────────
  if (!prefersReducedMotion) {
    const starsContainer = document.getElementById('starsContainer');
    const isMobile = window.innerWidth < 640;
    const STAR_COUNT = isMobile ? 40 : 80;

    for (let i = 0; i < STAR_COUNT; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      const size = Math.random() * 2.5 + 0.5;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.setProperty('--duration', `${Math.random() * 4 + 2}s`);
      star.style.setProperty('--delay', `${Math.random() * 5}s`);
      starsContainer.appendChild(star);
    }

    // ─── FLOATING GOLD PARTICLES ────────────────
    const PARTICLE_COUNT = isMobile ? 10 : 20;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.setProperty('--duration', `${Math.random() * 12 + 8}s`);
      particle.style.setProperty('--delay', `${Math.random() * 10}s`);
      starsContainer.appendChild(particle);
    }
  }

  // ─── SCROLL REVEAL ──────────────────────────
  const revealElements = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    // Instantly show all elements
    revealElements.forEach(el => el.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ─── FAQ ACCORDION ──────────────────────────
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq__question');

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      faqItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ─── BIRTHDATE MASK ─────────────────────────
  const birthdateInput = document.getElementById('inputBirthdate');

  birthdateInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);

    if (value.length > 4) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
    } else if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }

    e.target.value = value;
  });

  // ─── HOTMART CHECKOUT URL ───────────────────
  const HOTMART_CHECKOUT_URL = 'https://pay.hotmart.com/G106007349B';

  // ─── FORM SUBMISSION ────────────────────────
  const heroForm = document.getElementById('heroForm');

  heroForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('inputName').value.trim();
    const birthdate = document.getElementById('inputBirthdate').value.trim();

    if (!name || !birthdate) {
      return;
    }

    // Validate birthdate format
    const bdRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!bdRegex.test(birthdate)) {
      alert('Por favor, insira a data de nascimento no formato DD/MM/AAAA.');
      return;
    }

    // Visual feedback
    const btn = document.getElementById('btnHero');
    const originalText = btn.innerHTML;
    btn.innerHTML = '✦ REDIRECIONANDO...';
    btn.style.pointerEvents = 'none';
    btn.style.opacity = '0.7';

    // Build Hotmart checkout URL with pre-filled name
    const checkoutUrl = `${HOTMART_CHECKOUT_URL}?name=${encodeURIComponent(name)}`;

    // Small delay for visual feedback, then redirect
    setTimeout(() => {
      window.open(checkoutUrl, '_blank');

      // Reset button after redirect
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.pointerEvents = '';
        btn.style.opacity = '';
      }, 1000);
    }, 800);
  });

  // ─── SMOOTH SCROLL FOR BUTTONS ──────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ─── PARALLAX-LIKE EFFECT ON HERO ───────────
  if (!prefersReducedMotion) {
    const heroBg = document.querySelector('.hero__bg img');

    if (heroBg && window.innerWidth > 768) {
      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroHeight = document.querySelector('.hero').offsetHeight;

        if (scrollY < heroHeight) {
          const translate = scrollY * 0.3;
          heroBg.style.transform = `translateY(${translate}px) scale(1.1)`;
        }
      }, { passive: true });
    }
  }

});
