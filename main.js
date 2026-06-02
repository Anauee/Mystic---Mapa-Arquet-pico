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

  // ─── CHECKOUT URL (GG CHECKOUT) ───────────────
  const CHECKOUT_URL = 'https://ggcheckout.app/checkout/v2/0rMhrAKclsjLJgn5EfdA';

  // ─── SUPABASE INITIALIZATION ────────────────
  const supabaseUrl = 'https://twkmeyojrsfsbrufffvj.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3a21leW9qcnNmc2JydWZmZnZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5OTcxODksImV4cCI6MjA5NTU3MzE4OX0.VQx86LyaeXfaHZjQiS_G5ZHlTVPBs6g_HqM5TGzaujk';
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  // ─── FORM SUBMISSION ────────────────────────
  const heroForm = document.getElementById('heroForm');

  heroForm.addEventListener('submit', async (e) => {
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
    btn.innerHTML = '✦ GERANDO MAPA (PODE LEVAR 20 SEGUNDOS)...';
    btn.style.pointerEvents = 'none';
    btn.style.opacity = '0.7';

    try {
      // 1. Gera um UUID único para esta tentativa
      const leadId = crypto.randomUUID();

      // 2. Salva no Supabase
      const { error } = await supabase
        .from('leads')
        .insert([
          { id: leadId, name: name, birthdate: birthdate }
        ]);

      if (error) {
        console.error('Erro ao salvar no Supabase:', error);
        // Fallback direto para o checkout se der erro no banco
        if (typeof fbq === 'function') fbq('track', 'InitiateCheckout');
        setTimeout(() => {
          window.location.href = `${CHECKOUT_URL}?utm_content=${encodeURIComponent(birthdate)}`;
        }, 400);
        return;
      }

      // 3. Chama a API do Entregável para gerar o preview do relatório
      const response = await fetch('https://mapa-arquet-pico-entregavel.vercel.app/api/gerar-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, nome: name, birthdate })
      });

      if (!response.ok) {
        throw new Error('Falha ao gerar o preview na API.');
      }

      const data = await response.json();

      if (data.success && data.previewHtml) {
        // 4. Salva o HTML do preview no sessionStorage e redireciona
        sessionStorage.setItem('previewHtml', data.previewHtml);
        sessionStorage.setItem('leadId', leadId);
        window.location.href = 'resultado.html';
      } else {
        throw new Error('API não retornou sucesso ou html vazio.');
      }

    } catch (err) {
      console.error('Erro inesperado:', err);
      // Fallback: se houver qualquer erro na geração (DeepSeek cair, etc),
      // mandamos direto para o checkout para não perder a venda.
      if (typeof fbq === 'function') fbq('track', 'InitiateCheckout');
      setTimeout(() => {
        const fallbackUrl = `${CHECKOUT_URL}?utm_content=${encodeURIComponent(birthdate)}`;
        window.location.href = fallbackUrl;
      }, 400);
    }
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
