/**
 * APP.JS — DRA. NATHALIA LISBOA (ADVOCACIA CRIMINAL & DIREITO DO CONSUMIDOR)
 * Versão Otimizada 60fps + GSAP ScrollTrigger Scrollytelling + Fly-Over 3D (14.5s)
 */

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  initHeroParallax();
  initParticleCanvas();
  initEmergencyModal();
  initBalanceSlider();
  initAudioAmbience();
  initMobileMenu();
  initScrollytelling();
  initFlyoverEngine();
});

/* ========================================================
   1. PARALLAX LEVE DO HERO (PAUSA QUANDO FORA DA TELA)
   ======================================================== */
function initHeroParallax() {
  const heroSection = document.getElementById('hero');
  const heroObject = document.getElementById('heroObject');
  const layerBack = document.querySelector('.parallax-layer-back');
  const layerMid = document.querySelector('.parallax-layer-mid');
  const layerFront = document.querySelector('.parallax-layer-front');

  if (!heroSection || !heroObject) return;

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  let isHeroVisible = true;
  let rafId = null;

  const observer = new IntersectionObserver(
    (entries) => {
      isHeroVisible = entries[0].isIntersecting;
      if (!isHeroVisible && rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },
    { threshold: 0.05 }
  );
  observer.observe(heroSection);

  function scheduleLoop() {
    if (!rafId && isHeroVisible && !document.body.classList.contains('flyover-active')) {
      rafId = requestAnimationFrame(renderLoop);
    }
  }

  window.addEventListener(
    'mousemove',
    (e) => {
      if (!isHeroVisible || document.body.classList.contains('flyover-active')) return;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseX = (e.clientX - centerX) / centerX;
      mouseY = (e.clientY - centerY) / centerY;
      scheduleLoop();
    },
    { passive: true }
  );

  function renderLoop() {
    rafId = null;
    if (!isHeroVisible || document.body.classList.contains('flyover-active')) return;

    const dx = mouseX - currentX;
    const dy = mouseY - currentY;
    currentX += dx * 0.08;
    currentY += dy * 0.08;

    const rotY = currentX * 10;
    const rotX = -currentY * 10;
    const transX = currentX * 14;
    const transY = currentY * 12;

    heroObject.style.transform = `translate3d(${transX.toFixed(1)}px, ${transY.toFixed(1)}px, 0) rotateY(${rotY.toFixed(1)}deg) rotateX(${rotX.toFixed(1)}deg)`;
    if (layerBack) layerBack.style.transform = `translate3d(${(-currentX * 10).toFixed(1)}px, ${(-currentY * 8).toFixed(1)}px, 0)`;
    if (layerMid) layerMid.style.transform = `translate3d(${(currentX * 7).toFixed(1)}px, ${(currentY * 5).toFixed(1)}px, 0)`;
    if (layerFront) layerFront.style.transform = `translate3d(${(currentX * 13).toFixed(1)}px, ${(currentY * 10).toFixed(1)}px, 0)`;

    if (Math.abs(dx) > 0.002 || Math.abs(dy) > 0.002) {
      rafId = requestAnimationFrame(renderLoop);
    }
  }
}

/* ========================================================
   2. CANVAS DE PARTÍCULAS ULTRA-LEVE (SPRITES PRÉ-RENDERIZADOS)
   Zero ctx.filter / shadowBlur por frame — Roda liso a 60fps
   ======================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('heroParticles');
  const heroSection = document.getElementById('hero');
  if (!canvas || !heroSection) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let width = (canvas.width = heroSection.offsetWidth || window.innerWidth);
  let height = (canvas.height = heroSection.offsetHeight || window.innerHeight);
  let isVisible = true;
  let rafId = null;

  // Pré-renderiza 2 sprites leves em canvas offscreen para evitar blur em tempo real
  function createGlowSprite(radius, colorHex) {
    const off = document.createElement('canvas');
    const size = radius * 4;
    off.width = size;
    off.height = size;
    const octx = off.getContext('2d');
    const grad = octx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, colorHex);
    grad.addColorStop(0.45, colorHex.replace('1)', '0.45)'));
    grad.addColorStop(1, colorHex.replace('1)', '0)'));
    octx.fillStyle = grad;
    octx.beginPath();
    octx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    octx.fill();
    return off;
  }

  const spriteGold = createGlowSprite(6, 'rgba(197, 160, 89, 1)');
  const spriteLight = createGlowSprite(8, 'rgba(243, 229, 171, 1)');

  window.addEventListener(
    'resize',
    () => {
      width = canvas.width = heroSection.offsetWidth || window.innerWidth;
      height = canvas.height = heroSection.offsetHeight || window.innerHeight;
    },
    { passive: true }
  );

  const count = window.innerWidth < 768 ? 14 : 26;
  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 10 + 6,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.35 - 0.1,
      alpha: Math.random() * 0.45 + 0.2,
      sprite: i % 3 === 0 ? spriteLight : spriteGold
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      isVisible = entries[0].isIntersecting;
      if (isVisible && !rafId) {
        rafId = requestAnimationFrame(animateParticles);
      } else if (!isVisible && rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },
    { threshold: 0.02 }
  );
  observer.observe(heroSection);

  function animateParticles() {
    if (!isVisible || document.body.classList.contains('flyover-active')) {
      rafId = null;
      return;
    }

    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;

      ctx.globalAlpha = p.alpha;
      ctx.drawImage(p.sprite, p.x, p.y, p.size, p.size);
    }
    ctx.globalAlpha = 1;
    rafId = requestAnimationFrame(animateParticles);
  }

  rafId = requestAnimationFrame(animateParticles);
}

/* ========================================================
   3. GSAP + SCROLLTRIGGER SCROLLYTELLING (DESKTOP >= 1024px)
      + ROLAGEM FLUIDA COM REVELAÇÕES LEVES NO MOBILE
   ======================================================== */
function initScrollytelling() {
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);
  if (window.ScrollToPlugin) {
    gsap.registerPlugin(ScrollToPlugin);
  }

  const headerEl = document.getElementById('siteHeader');
  const getHeaderH = () => (headerEl ? headerEl.offsetHeight : 104);

  // Mapa de referências ScrollTrigger para recalibrar cliques do menu superior
  const triggersMap = {};

  const mm = gsap.matchMedia();

  // ------------------------------------------------------
  // DESKTOP (>= 1024px): PINNING & SCROLLYTELLING COMPLETO
  // ------------------------------------------------------
  mm.add('(min-width: 1024px)', () => {
    // 1. HERO PINNING (~120vh) + CORTINA PELA SEÇÃO "A ADVOGADA"
    const heroTitleStack = document.getElementById('heroTitleStack');
    const heroChips = document.getElementById('heroChips');
    const heroMetrics = document.getElementById('heroMetrics');
    const heroSubtitle = document.getElementById('heroSubtitle');
    const heroLinksRow = document.getElementById('heroLinksRow');

    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero',
        start: () => `top ${getHeaderH()}px`,
        end: '+=120%',
        pin: true,
        pinSpacing: false,
        scrub: 1,
        invalidateOnRefresh: true
      }
    });

    if (heroTitleStack) {
      heroTl.to(heroTitleStack, { scale: 1.08, ease: 'none' }, 0);
    }
    if (heroChips) {
      heroTl.to(heroChips, { opacity: 0, y: -28, ease: 'none' }, 0);
    }
    if (heroMetrics) {
      heroTl.to(heroMetrics, { opacity: 0, y: 24, ease: 'none' }, 0.05);
    }
    if (heroSubtitle) {
      heroTl.to(heroSubtitle, { opacity: 0.25, y: -10, ease: 'none' }, 0.15);
    }
    if (heroLinksRow) {
      heroTl.to(heroLinksRow, { opacity: 0, ease: 'none' }, 0.15);
    }
    triggersMap['#hero'] = heroTl.scrollTrigger;

    // 2. SEÇÃO "A ADVOGADA" (#sobre): COLUNA ESQUERDA FIXA + DESTAQUE PROGRESSIVO
    const sobreLeftPin = document.getElementById('sobreLeftPin');
    const sobreBlocks = gsap.utils.toArray('.js-sobre-block');

    if (sobreLeftPin) {
      ScrollTrigger.create({
        trigger: '#sobreGrid',
        start: () => `top ${getHeaderH() + 24}px`,
        end: () => {
          const gridEl = document.getElementById('sobreGrid');
          const pinEl = document.getElementById('sobreLeftPin');
          if (!gridEl || !pinEl) return '+=300';
          const travel = Math.max(80, gridEl.offsetHeight - pinEl.offsetHeight);
          return `+=${travel}`;
        },
        pin: '#sobreLeftPin',
        pinSpacing: false,
        invalidateOnRefresh: true
      });
    }

    sobreBlocks.forEach((block) => {
      gsap.fromTo(
        block,
        { opacity: 0.4, y: 24 },
        {
          opacity: 1,
          y: 0,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: block,
            start: 'top 78%',
            end: 'top 38%',
            scrub: 1
          }
        }
      );
    });

    // 3. SEÇÃO "FRENTES DE ATUAÇÃO" (#areas): PIN 100VH + TRILHO HORIZONTAL EM 2 ATOS
    const areasTrack = document.getElementById('areasTrack');
    const areasProgressBar = document.getElementById('areasProgressBar');
    const areasActLabel = document.getElementById('areasActLabel');
    const areasActBadge = document.getElementById('areasActBadge');

    if (areasTrack) {
      const areasTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#areas',
          start: () => `top ${getHeaderH()}px`,
          end: '+=200%',
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (!areasActLabel) return;
            if (self.progress >= 0.5) {
              areasActLabel.textContent = 'ATO II / II • DIREITO DO CONSUMIDOR';
              if (areasActBadge) {
                areasActBadge.classList.remove('bg-crimson/70');
                areasActBadge.classList.add('bg-emerald-950/90');
              }
            } else {
              areasActLabel.textContent = 'ATO I / II • ADVOCACIA CRIMINAL';
              if (areasActBadge) {
                areasActBadge.classList.remove('bg-emerald-950/90');
                areasActBadge.classList.add('bg-crimson/70');
              }
            }
          }
        }
      });

      // Pequena pausa no Ato I -> deslizamento suave para Ato II -> pausa no Ato II
      areasTl
        .to(areasTrack, { xPercent: 0, duration: 0.18, ease: 'none' })
        .to(areasTrack, { xPercent: -50, duration: 0.64, ease: 'power1.inOut' })
        .to(areasTrack, { xPercent: -50, duration: 0.18, ease: 'none' });

      if (areasProgressBar) {
        areasTl.fromTo(
          areasProgressBar,
          { width: '15%' },
          { width: '100%', duration: 1.0, ease: 'none' },
          0
        );
      }

      triggersMap['#areas'] = areasTl.scrollTrigger;
    }

    // 4. SEÇÃO "O RITO ESTRATÉGICO" (#rito / #forca): PIN ~180VH + PASSOS SEQUENCIAIS
    const ritoSteps = [
      document.getElementById('ritoStep1'),
      document.getElementById('ritoStep2'),
      document.getElementById('ritoStep3')
    ].filter(Boolean);

    if (ritoSteps.length === 3) {
      const setActiveStep = (activeIdx) => {
        ritoSteps.forEach((stepEl, idx) => {
          if (idx === activeIdx) {
            stepEl.classList.add('is-active');
            stepEl.style.opacity = '1';
          } else {
            stepEl.classList.remove('is-active');
            stepEl.style.opacity = '0.32';
          }
        });
      };

      const ritoSt = ScrollTrigger.create({
        trigger: '#rito',
        start: () => `top ${getHeaderH()}px`,
        end: '+=180%',
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          if (p < 0.34) {
            setActiveStep(0);
          } else if (p < 0.68) {
            setActiveStep(1);
          } else {
            setActiveStep(2);
          }
        }
      });

      setActiveStep(0);
      triggersMap['#rito'] = ritoSt;
      triggersMap['#forca'] = ritoSt;
    }

    // 5. STACKING SECTION ("RECONHECIMENTO" -> CTA FINAL & RODAPÉ SOBEM POR CIMA)
    const depoimentoInner = document.getElementById('depoimentoInner');
    const depoSt = ScrollTrigger.create({
      trigger: '#depoimento',
      start: () => `top ${getHeaderH()}px`,
      end: '+=100%',
      pin: true,
      pinSpacing: false,
      invalidateOnRefresh: true
    });
    triggersMap['#depoimento'] = depoSt;

    if (depoimentoInner) {
      gsap.to(depoimentoInner, {
        scale: 0.96,
        opacity: 0.42,
        ease: 'none',
        scrollTrigger: {
          trigger: '#closingStack',
          start: 'top bottom',
          end: () => `top ${getHeaderH() + 60}px`,
          scrub: 1,
          invalidateOnRefresh: true
        }
      });
    }

    return () => {
      Object.keys(triggersMap).forEach((k) => delete triggersMap[k]);
    };
  });

  // ------------------------------------------------------
  // MOBILE (< 1024px): ROLAGEM FLUIDA SEM PINNING + REVEAL LEVE
  // ------------------------------------------------------
  mm.add('(max-width: 1023px)', () => {
    const mobileItems = gsap.utils.toArray('.feature-card, .js-sobre-block, .rito-step, .testimonial-3d-card');
    mobileItems.forEach((el) => {
      el.style.opacity = '1';
      gsap.from(el, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true
        }
      });
    });
  });

  // ------------------------------------------------------
  // RECALIBRAÇÃO DOS LINKS ÂNCORA DO MENU SUPERIOR
  // ------------------------------------------------------
  document.querySelectorAll('.js-nav-anchor').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const targetEl = document.querySelector(href);
      if (!targetEl) return;

      e.preventDefault();

      // Fecha menu mobile se estiver aberto
      const mobileMenu = document.getElementById('mobileMenu');
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
      }

      const headerH = getHeaderH();
      let destY = 0;

      if (href === '#hero') {
        destY = 0;
      } else if (triggersMap[href]) {
        destY = triggersMap[href].start;
      } else {
        const rectTop = targetEl.getBoundingClientRect().top + window.scrollY;
        destY = Math.max(0, rectTop - headerH);
      }

      if (window.ScrollToPlugin) {
        gsap.to(window, {
          duration: 0.85,
          scrollTo: { y: destY, autoKill: true },
          ease: 'power2.inOut'
        });
      } else {
        window.scrollTo({ top: destY, behavior: 'smooth' });
      }
    });
  });

  // Recalcula ScrollTrigger após carregamento completo de imagens e fontes
  const safeRefresh = () => {
    ScrollTrigger.refresh();
  };
  window.addEventListener('load', safeRefresh);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(safeRefresh);
  }
}

/* ========================================================
   4. MODAL DE TRIAGEM & WHATSAPP OFICIAL DRA. NATHALIA LISBOA
      Tel/WhatsApp Oficial: (21) 98180-1373
   ======================================================== */
function initEmergencyModal() {
  const openModalBtns = document.querySelectorAll('.js-open-emergency-modal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modal = document.getElementById('emergencyModal');
  const emergencyForm = document.getElementById('emergencyForm');

  if (!modal) return;

  function openModal(preselectedArea) {
    if (preselectedArea) {
      const sel = document.getElementById('emergencyReason');
      if (sel) {
        for (let i = 0; i < sel.options.length; i++) {
          if (sel.options[i].value.toLowerCase().includes(preselectedArea.toLowerCase())) {
            sel.selectedIndex = i;
            break;
          }
        }
      }
    }
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  openModalBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const area = btn.getAttribute('data-area') || '';
      openModal(area);
    });
  });

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });

  if (emergencyForm) {
    emergencyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('clientName')?.value || 'Não informado';
      const city = document.getElementById('clientCity')?.value || 'Rio de Janeiro - RJ';
      const reason = document.getElementById('emergencyReason')?.value || 'Consultoria Jurídica';
      const details = document.getElementById('caseDetails')?.value || 'Solicito análise do meu caso.';

      const whatsappNumber = '5521981801373';
      const message = encodeURIComponent(
        `⚖️ *ATENDIMENTO JURÍDICO — DRA. NATHALIA LISBOA*\n\n` +
        `👤 *Cliente:* ${name}\n` +
        `📍 *Cidade/UF:* ${city}\n` +
        `📌 *Demanda:* ${reason}\n` +
        `📝 *Resumo:* ${details}\n\n` +
        `_Enviado através do Portal Oficial Dra. Nathalia Lisboa (OAB/RJ 219.544)._`
      );

      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
      closeModal();
    });
  }
}

/* ========================================================
   5. SLIDER DA BALANÇA DA JUSTIÇA (100% INTERATIVO)
   ======================================================== */
function initBalanceSlider() {
  const balanceRange = document.getElementById('balanceRange');
  const leftPan = document.getElementById('leftPan');
  const rightPan = document.getElementById('rightPan');
  const balanceStatus = document.getElementById('balanceStatus');

  if (!balanceRange || !leftPan || !rightPan) return;

  balanceRange.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    const tilt = val * 0.4;

    leftPan.style.transform = `translateY(${tilt * 1.5}px)`;
    rightPan.style.transform = `translateY(${-tilt * 1.5}px)`;

    if (val < -15) {
      balanceStatus.innerText = '⚠️ Risco Elevado: Abuso Estatal ou Bancário Sem Defesa Técnica Especializada';
      balanceStatus.className = 'text-sm font-semibold text-red-400 mt-4 transition-colors';
    } else if (val > 15) {
      balanceStatus.innerText = '🛡️ Defesa Implacável: Liberdade Garantida, Liminar Deferida e Indenização Integral';
      balanceStatus.className = 'text-sm font-semibold text-emerald-400 mt-4 transition-colors';
    } else {
      balanceStatus.innerText = '⚖️ Paridade de Armas: Análise Técnica de Provas, Contratos e Prerrogativas';
      balanceStatus.className = 'text-sm font-semibold text-[#C5A059] mt-4 transition-colors';
    }
  });
}

/* ========================================================
   6. AMBIÊNCIA SONORA SUTIL + EFEITOS DO FLY-OVER
   ======================================================== */
function playFlyoverSoundEffect(type) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'whoosh') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(48, ctx.currentTime + 0.45);
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.46);
    } else if (type === 'hit') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(92, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 0.85);
      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.85);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.86);
    }
  } catch (_) {}
}

function initAudioAmbience() {
  const audioToggle = document.getElementById('audioToggle');
  const audioIcon = document.getElementById('audioIcon');
  if (!audioToggle) return;

  let audioCtx = null;
  let isPlaying = false;
  let osc1, osc2, gainNode;

  audioToggle.addEventListener('click', () => {
    if (!isPlaying) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
        osc1 = audioCtx.createOscillator();
        osc2 = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(55, audioCtx.currentTime);
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(110, audioCtx.currentTime);

        gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.035, audioCtx.currentTime + 2.5);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc1.start();
        osc2.start();

        isPlaying = true;
        audioToggle.classList.add('border-emerald-500/50', 'text-emerald-400');
        if (audioIcon) audioIcon.setAttribute('data-lucide', 'volume-2');
      } catch (err) {
        console.warn('Áudio bloqueado pelo navegador', err);
      }
    } else {
      if (gainNode && audioCtx) {
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
        setTimeout(() => {
          if (osc1) osc1.stop();
          if (osc2) osc2.stop();
          if (audioCtx) audioCtx.close();
        }, 850);
      }
      isPlaying = false;
      audioToggle.classList.remove('border-emerald-500/50', 'text-emerald-400');
      if (audioIcon) audioIcon.setAttribute('data-lucide', 'volume-x');
    }
    if (window.lucide) window.lucide.createIcons();
  });
}

/* ========================================================
   7. MENU MOBILE
   ======================================================== */
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMobileMenuBtn = document.getElementById('closeMobileMenuBtn');

  if (!mobileMenuBtn || !mobileMenu) return;

  function toggleMenu() {
    mobileMenu.classList.toggle('hidden');
  }

  mobileMenuBtn.addEventListener('click', toggleMenu);
  if (closeMobileMenuBtn) closeMobileMenuBtn.addEventListener('click', toggleMenu);
}

/* ========================================================
   8. MOTOR DETERMINÍSTICO 3D FLY-OVER (14.5s @ 60fps)
      Mantido 100% intacto e limpo de pin-spacers GSAP ao clonar
   ======================================================== */
function initFlyoverEngine() {
  const startBtns = document.querySelectorAll('.js-start-flyover');
  const closeBtn = document.getElementById('flyoverCloseBtn');
  const playPauseBtn = document.getElementById('flyoverPlayPauseBtn');
  const scrubber = document.getElementById('flyoverScrubber');
  const timeLabel = document.getElementById('flyoverTimeLabel');
  const presetBtns = document.querySelectorAll('.js-flyover-preset');

  const stage = document.getElementById('flyoverStage');
  const cameraRig = document.getElementById('flyoverCameraRig');
  const mainPageContent = document.getElementById('mainPageContent');
  const pageMount = document.getElementById('flyoverPageMount');
  const dofNear = document.getElementById('flyoverDofNear');
  const dofFar = document.getElementById('flyoverDofFar');

  if (!stage || !cameraRig || !mainPageContent || !pageMount) return;

  let isFlyoverOpen = false;
  let isPlaying = false;
  let currentTime = 0;
  let lastFrameTs = null;
  let pageClone = null;
  let totalPageHeight = 3600;
  let soundFlags = { w1: false, w2: false, hit: false };

  const DURATION = 14.5;
  const CRUISE_SPEED = 770;

  function getShareOfCruise(t) {
    if (t <= 0) return 0;
    if (t < 0.6) return 0.5 * (t / 0.6);
    if (t < 1.25) return 0.5;
    if (t < 1.6) return 0.5 + 0.5 * ((t - 1.25) / 0.35);
    if (t < 7.3) return 1.0 + 0.04 * Math.sin(((t - 1.6) / 5.7) * Math.PI);
    if (t < 8.3) return 1.0 - 0.88 * ((t - 7.3) / 1.0);
    return Math.max(0, 0.12 * (1 - (t - 8.3) / 0.4));
  }

  function integrateLookAtY(t) {
    const startY = 390;
    const steps = 160;
    const clampedT = Math.min(Math.max(t, 0), 8.65);
    const dt = clampedT / steps;
    let y = startY;
    for (let i = 0; i < steps; i++) {
      const tau = (i + 0.5) * dt;
      y += getShareOfCruise(tau) * CRUISE_SPEED * dt;
    }
    return y;
  }

  function smoothstep(edge0, edge1, x) {
    const k = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return k * k * (3 - 2 * k);
  }

  function easeInOutQuad(x) {
    const k = Math.max(0, Math.min(1, x));
    return k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
  }

  function fitStageToWindow() {
    if (!isFlyoverOpen) return;
    const scaleX = (window.innerWidth * 0.96) / 1440;
    const scaleY = (window.innerHeight * 0.90) / 1152;
    const scale = Math.min(scaleX, scaleY, 1);
    stage.style.transform = `scale(${scale.toFixed(4)})`;
  }

  window.addEventListener('resize', fitStageToWindow, { passive: true });

  // Remove wrappers pin-spacer e estilos inline GSAP da cópia clonada do Fly-Over
  function sanitizeCloneForFlyover(cloneRoot) {
    cloneRoot.querySelectorAll('.pin-spacer').forEach((spacer) => {
      const parent = spacer.parentNode;
      while (spacer.firstChild) {
        parent.insertBefore(spacer.firstChild, spacer);
      }
      parent.removeChild(spacer);
    });

    const resetSelectors = '#hero, #heroTitleStack, #heroChips, #heroMetrics, #heroSubtitle, #heroLinksRow, #sobreLeftPin, .js-sobre-block, #areas, #areasTrack, #rito, #depoimento, #depoimentoInner';
    cloneRoot.querySelectorAll(resetSelectors).forEach((el) => {
      el.removeAttribute('style');
    });

    // Garante que todos os cards apareçam limpos na tira da página durante o Fly-Over
    const track = cloneRoot.querySelector('#areasTrack');
    if (track) {
      track.className = 'flex flex-col gap-6 w-full';
      const act1 = cloneRoot.querySelector('#areasAct1');
      const act2 = cloneRoot.querySelector('#areasAct2');
      if (act1) act1.className = 'w-full grid grid-cols-3 gap-6';
      if (act2) act2.className = 'w-full grid grid-cols-3 gap-6';
    }
    const areasSec = cloneRoot.querySelector('#areas');
    if (areasSec) {
      areasSec.classList.remove('lg:h-[calc(100vh-106px)]');
      areasSec.classList.add('py-20');
    }
  }

  function openFlyover(initialTime = 0, autoPlay = true) {
    if (!isFlyoverOpen) {
      isFlyoverOpen = true;
      document.body.classList.add('flyover-active');

      pageMount.innerHTML = '';
      pageClone = mainPageContent.cloneNode(true);
      pageClone.id = 'pageSheet';
      sanitizeCloneForFlyover(pageClone);
      pageMount.appendChild(pageClone);

      if (window.lucide) window.lucide.createIcons();

      setTimeout(() => {
        totalPageHeight = pageClone.scrollHeight || 3600;
        fitStageToWindow();
        seekFlyover(initialTime);
      }, 40);
    } else {
      seekFlyover(initialTime);
    }

    isPlaying = autoPlay;
    lastFrameTs = null;
    soundFlags = { w1: initialTime >= 8.66, w2: initialTime >= 9.80, hit: initialTime >= 9.97 };
    updatePlayPauseUI();
  }

  function closeFlyover() {
    isFlyoverOpen = false;
    isPlaying = false;
    document.body.classList.remove('flyover-active');
    pageMount.innerHTML = '';
    pageClone = null;
  }

  function updatePlayPauseUI() {
    if (!playPauseBtn) return;
    playPauseBtn.innerHTML = isPlaying
      ? '<i data-lucide="pause" class="w-4 h-4"></i><span>Pausar</span>'
      : '<i data-lucide="play" class="w-4 h-4"></i><span>Reproduzir</span>';
    if (window.lucide) window.lucide.createIcons();
  }

  function seekFlyover(t) {
    currentTime = Math.max(0, Math.min(DURATION, t));
    if (scrubber) scrubber.value = currentTime.toFixed(2);
    if (timeLabel) timeLabel.innerText = `${currentTime.toFixed(2)}s / 14.50s`;

    if (!pageClone) return;

    const flattenProgress = smoothstep(8.15, 8.95, currentTime);
    const tiltDeg = 56 * (1 - flattenProgress);

    let lookAtY = integrateLookAtY(currentTime);
    const pageCenterY = totalPageHeight * 0.5;

    const riseProgress = smoothstep(7.75, 9.25, currentTime);
    const overheadScale = (1152 - 84) / Math.max(totalPageHeight, 2800);
    const flightScale = 1360 / (1360 + (1700 - 1360) * smoothstep(0, 8.2, currentTime));

    let currentScale = flightScale * Math.pow(overheadScale / flightScale, riseProgress);
    lookAtY = lookAtY * (1 - riseProgress) + pageCenterY * riseProgress;

    if (currentTime > 9.25) {
      const creep1 = smoothstep(9.25, 9.47, currentTime);
      currentScale *= 1 + 0.035 * creep1;
    }

    const diveProgress = easeInOutQuad((currentTime - 9.47) / 0.50);
    const heroCardScale = 1018 / 1440;
    const heroCardHoldScale = heroCardScale * (1 + 0.02 * smoothstep(10.6, 14.5, currentTime));

    let sheetOffsetY = 0;
    let cornerRadius = 24;
    let heroClipBottom = totalPageHeight;

    if (currentTime >= 9.47) {
      const startDiveScale = overheadScale * 1.035;
      currentScale = startDiveScale * Math.pow(heroCardScale / startDiveScale, diveProgress);
      if (currentTime > 10.6) {
        currentScale = heroCardHoldScale;
      }

      const dropProgress = smoothstep(9.62, 9.97, currentTime);
      const topYInStage = -576 + 283 * dropProgress;
      lookAtY = pageCenterY * (1 - diveProgress);
      sheetOffsetY = topYInStage / currentScale;

      cornerRadius = 24 + 14 * diveProgress;
      const heroHeight = 820;
      heroClipBottom = totalPageHeight - (totalPageHeight - heroHeight) * diveProgress;
    }

    if (currentTime < 9.47) {
      cameraRig.style.transform = `scale(${currentScale.toFixed(4)}) rotateX(${tiltDeg.toFixed(2)}deg) translate3d(-720px, ${(-lookAtY).toFixed(1)}px, 0px)`;
    } else {
      const blendedLookY = (-lookAtY) * (1 - diveProgress) + sheetOffsetY * diveProgress;
      cameraRig.style.transform = `scale(${currentScale.toFixed(4)}) rotateX(${tiltDeg.toFixed(2)}deg) translate3d(-720px, ${blendedLookY.toFixed(1)}px, 0px)`;
    }

    pageClone.style.borderRadius = `${cornerRadius.toFixed(1)}px`;
    if (currentTime >= 9.47) {
      pageClone.style.clipPath = `inset(0px 0px ${(totalPageHeight - heroClipBottom).toFixed(0)}px 0px round ${cornerRadius.toFixed(1)}px)`;
    } else {
      pageClone.style.clipPath = `inset(0px 0px 0px 0px round 24px)`;
    }

    const dofOpacity = 1 - smoothstep(7.75, 8.85, currentTime);
    if (dofNear) dofNear.style.opacity = dofOpacity.toFixed(2);
    if (dofFar) dofFar.style.opacity = dofOpacity.toFixed(2);

    const cloneLayers = pageClone.querySelectorAll('[data-layer]');
    cloneLayers.forEach((el) => {
      const layerType = el.getAttribute('data-layer');
      const elTop = el.offsetTop || 0;
      const distFromFocus = Math.abs(elTop - lookAtY);
      const focusWindow = 650;
      const focusFactor = Math.max(0, 1 - distFromFocus / focusWindow) * (1 - riseProgress);

      let z = 0;
      let rotX = 0;

      if (layerType === 'hero-chip' && currentTime >= 0.1 && currentTime <= 2.2) {
        const p = smoothstep(0.1, 1.1, currentTime) * (1 - smoothstep(1.6, 2.2, currentTime));
        z = 72 * p;
        rotX = 30 * p;
      } else if (layerType === 'sec2-photo' && currentTime >= 1.35 && currentTime <= 3.1) {
        const p = smoothstep(1.35, 2.1, currentTime) * (1 - smoothstep(2.5, 3.1, currentTime));
        z = 118 * p;
        rotX = 46 * p;
      } else if (layerType === 'sec2-chip' && currentTime >= 1.35 && currentTime <= 2.9) {
        const p = smoothstep(1.35, 2.2, currentTime) * (1 - smoothstep(2.5, 2.9, currentTime));
        z = 195 * p;
        rotX = 54 * p;
      } else if (layerType === 'testimonial' && currentTime >= 5.1 && currentTime <= 7.2) {
        const p = smoothstep(5.45, 6.1, currentTime) * (1 - smoothstep(6.6, 7.2, currentTime));
        z = 22 + 90 * p;
        rotX = 30 * p;
        el.style.borderBottom = `${Math.round(8 + 26 * p)}px solid #FFFFFF`;
      } else if (focusFactor > 0.05) {
        z = 34 * focusFactor;
        rotX = 14 * focusFactor;
      }

      if (z > 1) {
        const sx = (0.10 * z).toFixed(1);
        const sy = (4 + 0.36 * z).toFixed(1);
        const sblur = (7 + 0.5 * z).toFixed(1);
        el.style.transform = `translate3d(0, ${(-z * 0.2).toFixed(1)}px, ${z.toFixed(1)}px) rotateX(${rotX.toFixed(1)}deg)`;
        el.style.boxShadow = `${sx}px ${sy}px ${sblur}px rgba(26, 33, 51, 0.26)`;
      } else {
        el.style.transform = '';
        el.style.boxShadow = '';
      }
    });

    updateFloatingTiles(currentTime);
    updateEndTitleCard(currentTime);
  }

  function updateFloatingTiles(t) {
    const tiles = [
      document.getElementById('flyTile0'),
      document.getElementById('flyTile1'),
      document.getElementById('flyTile2'),
      document.getElementById('flyTile3')
    ];
    if (!tiles[0]) return;

    tiles.forEach((tile, idx) => {
      let x = 720 + (idx - 1.5) * 52;
      let y = 640;
      let size = 32;
      let opacity = 1;
      let blur = 0;
      let rot = 0;

      if (t < 0.1) {
        size = 32;
        opacity = smoothstep(0, 0.1, t);
      } else if (t < 2.6) {
        const lift = smoothstep(0.1, 1.35, t);
        const driftOut = smoothstep(1.6, 2.5, t);
        const targetX = idx % 2 === 0 ? 150 + idx * 35 : 1260 - idx * 30;
        const targetY = idx < 2 ? 170 : 280;
        x = x * (1 - lift) + targetX * lift;
        y = y * (1 - lift) + targetY * lift - driftOut * 360;
        size = 32 + (155 + idx * 12) * lift;
        rot = (idx % 2 === 0 ? -12 : 14) * lift;
        blur = idx > 1 ? 2.5 * lift : 0;
        opacity = 1 - driftOut;
      } else if (t >= 4.8 && t <= 6.1 && idx === 0) {
        const p = (t - 4.8) / 1.3;
        x = 95;
        y = 1100 - p * 1250;
        size = 210;
        blur = 14;
        rot = -18 + p * 25;
        opacity = Math.sin(p * Math.PI);
      } else if (t >= 9.47) {
        const enter = smoothstep(9.55, 10.05, t);
        const holdDrift = smoothstep(10.0, 14.5, t) * 10;
        opacity = enter;
        if (idx === 0) {
          x = 215 - holdDrift;
          y = 290 - holdDrift * 0.5;
          size = 110;
          rot = -10;
          blur = 0;
        } else if (idx === 1) {
          x = 1235 + holdDrift;
          y = 430 + holdDrift * 0.6;
          size = 128;
          rot = 12;
          blur = 0;
        } else if (idx === 2) {
          x = 120 - holdDrift;
          y = 980 + holdDrift;
          size = 240;
          rot = 18;
          blur = 18;
          opacity = enter * 0.75;
        } else {
          x = 1320 + holdDrift;
          y = 990 + holdDrift;
          size = 250;
          rot = -16;
          blur = 20;
          opacity = enter * 0.75;
        }
      } else {
        opacity = 0;
      }

      tile.style.width = `${size.toFixed(0)}px`;
      tile.style.height = `${size.toFixed(0)}px`;
      tile.style.opacity = opacity.toFixed(3);
      tile.style.filter = blur > 0 ? `blur(${blur.toFixed(1)}px)` : 'none';
      tile.style.transform = `translate3d(${(x - size / 2).toFixed(1)}px, ${(y - size / 2).toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg)`;
    });
  }

  function updateEndTitleCard(t) {
    const badgePill = document.getElementById('endCardBadge');
    const line1Words = document.querySelectorAll('.js-end-line1-word');
    const line2Words = document.querySelectorAll('.js-end-line2-word');

    if (badgePill) {
      const p = smoothstep(10.02, 10.28, t);
      badgePill.style.opacity = p.toFixed(3);
      badgePill.style.transform = `translateY(${((1 - p) * 12).toFixed(1)}px)`;
    }

    line1Words.forEach((w, i) => {
      const start = 10.12 + i * 0.06;
      const p = smoothstep(start, start + 0.28, t);
      w.style.opacity = p.toFixed(3);
      w.style.transform = `translateY(${((1 - p) * 14).toFixed(1)}px)`;
      w.style.filter = `blur(${((1 - p) * 8).toFixed(1)}px)`;
    });

    line2Words.forEach((w, i) => {
      const start = 10.36 + i * 0.05;
      const p = smoothstep(start, start + 0.34, t);
      w.style.opacity = p.toFixed(3);
      w.style.transform = `translateY(${((1 - p) * 16).toFixed(1)}px)`;
      w.style.filter = `blur(${((1 - p) * 12).toFixed(1)}px)`;
    });
  }

  function tick(ts) {
    if (isFlyoverOpen && isPlaying) {
      if (lastFrameTs === null) lastFrameTs = ts;
      const dt = (ts - lastFrameTs) / 1000;
      lastFrameTs = ts;

      let nextT = currentTime + dt;
      if (nextT >= 8.66 && !soundFlags.w1) {
        soundFlags.w1 = true;
        playFlyoverSoundEffect('whoosh');
      }
      if (nextT >= 9.80 && !soundFlags.w2) {
        soundFlags.w2 = true;
        playFlyoverSoundEffect('whoosh');
      }
      if (nextT >= 9.97 && !soundFlags.hit) {
        soundFlags.hit = true;
        playFlyoverSoundEffect('hit');
      }

      if (nextT >= DURATION) {
        nextT = DURATION;
        isPlaying = false;
        updatePlayPauseUI();
      }
      seekFlyover(nextT);
    } else {
      lastFrameTs = null;
    }
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);

  startBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openFlyover(0, true);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeFlyover);

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      if (currentTime >= DURATION) {
        currentTime = 0;
        soundFlags = { w1: false, w2: false, hit: false };
      }
      isPlaying = !isPlaying;
      updatePlayPauseUI();
    });
  }

  if (scrubber) {
    scrubber.addEventListener('input', (e) => {
      isPlaying = false;
      updatePlayPauseUI();
      seekFlyover(parseFloat(e.target.value));
    });
  }

  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetT = parseFloat(btn.getAttribute('data-time') || '0');
      isPlaying = false;
      updatePlayPauseUI();
      openFlyover(targetT, false);
    });
  });

  window.seek = (t) => openFlyover(t, false);

  const params = new URLSearchParams(window.location.search);
  if (params.has('t')) {
    const tVal = parseFloat(params.get('t')) || 0;
    setTimeout(() => openFlyover(tVal, false), 150);
  } else if (params.get('flyover') === '1') {
    setTimeout(() => openFlyover(0, true), 150);
  }
}
