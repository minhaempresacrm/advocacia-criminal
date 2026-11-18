/**
 * APP.JS - ADVOCACIA CRIMINAL DE ELITE
 * Motor de Interações, Canvas de Partículas 3D, Parallax e Triagem WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicialização dos Ícones Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  }

  initHeroParallax();
  initParticleCanvas();
  initEmergencyModal();
  initBalanceSlider();
  initAudioAmbience();
  initMobileMenu();
});

/* ========================================================
   1. PARALLAX DO HERO & MOVIMENTO 3D
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

  window.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    if (e.clientY < rect.bottom && e.clientY > rect.top) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseX = (e.clientX - centerX) / centerX;
      mouseY = (e.clientY - centerY) / centerY;
    }
  });

  function renderLoop() {
    // Interpolação suave (Lerp)
    currentX += (mouseX - currentX) * 0.06;
    currentY += (mouseY - currentY) * 0.06;

    // Rotação do objeto 3D central
    const rotY = currentX * 18;
    const rotX = -currentY * 18;
    const transX = currentX * 25;
    const transY = currentY * 20;

    heroObject.style.transform = `translate3d(${transX}px, ${transY}px, 60px) rotateY(${rotY}deg) rotateX(${rotX}deg)`;

    // Camadas de texto monumental em profundidade
    if (layerBack) {
      layerBack.style.transform = `translate3d(${-currentX * 15}px, ${-currentY * 12}px, -40px)`;
    }
    if (layerMid) {
      layerMid.style.transform = `translate3d(${currentX * 10}px, ${currentY * 8}px, 0px)`;
    }
    if (layerFront) {
      layerFront.style.transform = `translate3d(${currentX * 22}px, ${currentY * 18}px, 30px)`;
    }

    requestAnimationFrame(renderLoop);
  }

  requestAnimationFrame(renderLoop);
}

/* ========================================================
   2. CANVAS DE PARTÍCULAS E BRILHOS 3D
   ======================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('heroParticles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = window.innerWidth < 768 ? 35 : 75;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3.5 + 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4 - 0.2,
      opacity: Math.random() * 0.7 + 0.2,
      blur: Math.random() > 0.6 ? 4 : 0, // Depth of field blur
      pulse: Math.random() * Math.PI,
      goldTone: Math.random() > 0.4 ? 'rgba(197, 160, 89, ' : 'rgba(243, 229, 171, '
    });
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += 0.02;

      // Wrap around
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      const dynamicOpacity = Math.sin(p.pulse) * 0.3 + p.opacity;

      ctx.save();
      if (p.blur > 0) {
        ctx.filter = `blur(${p.blur}px)`;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.goldTone + Math.max(0.1, dynamicOpacity) + ')';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#C5A059';
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(animateParticles);
  }

  animateParticles();
}

/* ========================================================
   3. MODAL DE TRIAGEM URGENTE & WHATSAPP DIRETO
   ======================================================== */
function initEmergencyModal() {
  const openModalBtns = document.querySelectorAll('.js-open-emergency-modal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modal = document.getElementById('emergencyModal');
  const emergencyForm = document.getElementById('emergencyForm');

  if (!modal) return;

  function openModal() {
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
      openModal();
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  if (emergencyForm) {
    emergencyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('clientName')?.value || 'Não informado';
      const city = document.getElementById('clientCity')?.value || 'Não informada';
      const reason = document.getElementById('emergencyReason')?.value || 'Atendimento de Urgência';
      const details = document.getElementById('caseDetails')?.value || 'Sem detalhes adicionais';

      const whatsappNumber = '5511999999999'; // Substituir pelo número real
      const message = encodeURIComponent(
        `🚨 *PLANTÃO CRIMINAL 24H - ATENDIMENTO DE URGÊNCIA*\n\n` +
        `⚖️ *Nome:* ${name}\n` +
        `📍 *Cidade/Comarca:* ${city}\n` +
        `⚠️ *Ocorrência:* ${reason}\n` +
        `📝 *Resumo:* ${details}\n\n` +
        `_Solicito contato urgente do advogado criminalista de plantão._`
      );

      const url = `https://wa.me/${whatsappNumber}?text=${message}`;
      window.open(url, '_blank');
      closeModal();
    });
  }
}

/* ========================================================
   4. SLIDER DA BALANÇA DA JUSTIÇA (SEÇÃO 3)
   ======================================================== */
function initBalanceSlider() {
  const balanceRange = document.getElementById('balanceRange');
  const leftPan = document.getElementById('leftPan');
  const rightPan = document.getElementById('rightPan');
  const balanceStatus = document.getElementById('balanceStatus');

  if (!balanceRange || !leftPan || !rightPan) return;

  balanceRange.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value); // -50 a +50
    const tilt = val * 0.4;

    leftPan.style.transform = `translateY(${tilt * 1.5}px)`;
    rightPan.style.transform = `translateY(${-tilt * 1.5}px)`;

    if (val < -15) {
      balanceStatus.innerText = '⚠️ Estado de Risco: Acusação Desproporcional sem Defesa Técnica';
      balanceStatus.className = 'text-sm font-semibold text-red-400 mt-3 transition-colors';
    } else if (val > 15) {
      balanceStatus.innerText = '🛡️ Defesa Implacável: Nulidades Arguidas e Paridade de Armas Conquistada';
      balanceStatus.className = 'text-sm font-semibold text-emerald-400 mt-3 transition-colors';
    } else {
      balanceStatus.innerText = '⚖️ Em Equilíbrio: Análise Estratégica das Provas e Depoimentos';
      balanceStatus.className = 'text-sm font-semibold text-[#C5A059] mt-3 transition-colors';
    }
  });
}

/* ========================================================
   5. AMBIÊNCIA SONORA SUTIL (WEB AUDIO API - R$ 0,00)
   ======================================================== */
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

        // Sub-bass drone sutil e acolhedor (55Hz e 110Hz harmônico)
        osc1 = audioCtx.createOscillator();
        osc2 = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(55, audioCtx.currentTime);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(110, audioCtx.currentTime);

        // Volume bem sutil
        gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.04, audioCtx.currentTime + 3);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc1.start();
        osc2.start();

        isPlaying = true;
        audioToggle.classList.add('border-emerald-500/50', 'text-emerald-400');
        if (audioIcon) audioIcon.setAttribute('data-lucide', 'volume-2');
      } catch (err) {
        console.warn('Áudio não suportado ou bloqueado pelo navegador', err);
      }
    } else {
      if (gainNode && audioCtx) {
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1);
        setTimeout(() => {
          if (osc1) osc1.stop();
          if (osc2) osc2.stop();
          if (audioCtx) audioCtx.close();
        }, 1000);
      }
      isPlaying = false;
      audioToggle.classList.remove('border-emerald-500/50', 'text-emerald-400');
      if (audioIcon) audioIcon.setAttribute('data-lucide', 'volume-x');
    }
    if (window.lucide) window.lucide.createIcons();
  });
}

/* ========================================================
   6. MENU MOBILE
   ======================================================== */
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMobileMenuBtn = document.getElementById('closeMobileMenuBtn');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!mobileMenuBtn || !mobileMenu) return;

  function toggleMenu() {
    mobileMenu.classList.toggle('hidden');
  }

  mobileMenuBtn.addEventListener('click', toggleMenu);
  if (closeMobileMenuBtn) closeMobileMenuBtn.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}
