/**
 * APP.JS — DRA. NATHALIA LISBOA (ADVOCACIA CRIMINAL & DIREITO DO CONSUMIDOR)
 * Inclui:
 * 1. Motor Parallax 3D & Partículas Douradas no Hero
 * 2. Elevação 3D Dinâmica de Camadas [data-layer] na Rolagem
 * 3. Motor Determinístico 3D Fly-Over (14.5s @ 60fps — seek(t))
 * 4. Triagem WhatsApp Oficial (21) 98180-1373 (Criminal & Consumidor)
 * 5. Simulador de Paridade Processual & Áudio Imersivo Web Audio API
 */

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  initHeroParallax();
  initParticleCanvas();
  initScrollLayerLift();
  initEmergencyModal();
  initBalanceSlider();
  initAudioAmbience();
  initMobileMenu();
  initFlyoverEngine();
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
    if (document.body.classList.contains('flyover-active')) return;
    const rect = heroSection.getBoundingClientRect();
    if (e.clientY < rect.bottom && e.clientY > rect.top) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseX = (e.clientX - centerX) / centerX;
      mouseY = (e.clientY - centerY) / centerY;
    }
  });

  function renderLoop() {
    if (!document.body.classList.contains('flyover-active')) {
      currentX += (mouseX - currentX) * 0.06;
      currentY += (mouseY - currentY) * 0.06;

      const rotY = currentX * 16;
      const rotX = -currentY * 16;
      const transX = currentX * 22;
      const transY = currentY * 18;

      heroObject.style.transform = `translate3d(${transX}px, ${transY}px, 60px) rotateY(${rotY}deg) rotateX(${rotX}deg)`;

      if (layerBack) layerBack.style.transform = `translate3d(${-currentX * 14}px, ${-currentY * 10}px, -40px)`;
      if (layerMid) layerMid.style.transform = `translate3d(${currentX * 10}px, ${currentY * 8}px, 0px)`;
      if (layerFront) layerFront.style.transform = `translate3d(${currentX * 20}px, ${currentY * 15}px, 30px)`;
    }
    requestAnimationFrame(renderLoop);
  }

  requestAnimationFrame(renderLoop);
}

/* ========================================================
   2. CANVAS DE PARTÍCULAS DOURADAS COM PROFUNDIDADE
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
  const particleCount = window.innerWidth < 768 ? 32 : 70;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3.4 + 0.8,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: (Math.random() - 0.5) * 0.35 - 0.18,
      opacity: Math.random() * 0.65 + 0.2,
      blur: Math.random() > 0.6 ? 4 : 0,
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

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      const dynamicOpacity = Math.sin(p.pulse) * 0.25 + p.opacity;

      ctx.save();
      if (p.blur > 0) ctx.filter = `blur(${p.blur}px)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.goldTone + Math.max(0.1, dynamicOpacity) + ')';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#C5A059';
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(animateParticles);
  }

  animateParticles();
}

/* ========================================================
   3. ELEVAÇÃO 3D DAS CAMADAS [data-layer] NA ROLAGEM NORMAL
   ======================================================== */
function initScrollLayerLift() {
  const layers = document.querySelectorAll('[data-layer]');
  if (!layers.length) return;

  function updateLayersOnScroll() {
    if (document.body.classList.contains('flyover-active')) return;
    const vh = window.innerHeight;
    const centerLine = vh * 0.52;

    layers.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const elCenter = rect.top + rect.height / 2;
      const dist = Math.abs(elCenter - centerLine);
      const maxRange = vh * 0.55;

      if (dist < maxRange) {
        const factor = Math.pow(1 - dist / maxRange, 2);
        const type = el.getAttribute('data-layer');
        let z = 24 * factor;
        let deg = 8 * factor;

        if (type === 'chip') {
          z = 52 * factor;
          deg = 22 * factor;
        } else if (type === 'testimonial') {
          z = 88 * factor;
          deg = 24 * factor;
          el.style.borderBottomWidth = `${Math.round(10 + 24 * factor)}px`;
        } else if (type === 'photo-card') {
          z = 68 * factor;
          deg = 18 * factor;
        }

        const sx = (0.10 * z).toFixed(1);
        const sy = (4 + 0.36 * z).toFixed(1);
        const sblur = (7 + 0.5 * z).toFixed(1);

        el.style.transform = `perspective(1200px) translate3d(0, ${(-z * 0.18).toFixed(1)}px, ${z.toFixed(1)}px) rotateX(${deg.toFixed(1)}deg)`;
        el.style.boxShadow = `${sx}px ${sy}px ${sblur}px rgba(26, 33, 51, 0.26)`;
      } else {
        el.style.transform = '';
        el.style.boxShadow = '';
      }
    });
  }

  window.addEventListener('scroll', updateLayersOnScroll, { passive: true });
  updateLayersOnScroll();
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

      // Número Oficial da Dra. Nathalia Lisboa (OAB/RJ 219.544)
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
   5. SLIDER DA BALANÇA DA JUSTIÇA (SEÇÃO 3)
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
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!mobileMenuBtn || !mobileMenu) return;

  function toggleMenu() {
    mobileMenu.classList.toggle('hidden');
  }

  mobileMenuBtn.addEventListener('click', toggleMenu);
  if (closeMobileMenuBtn) closeMobileMenuBtn.addEventListener('click', toggleMenu);
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
  });
}

/* ========================================================
   8. MOTOR DETERMINÍSTICO 3D FLY-OVER (14.5s @ 60fps)
      Implementação fiel de <direction>, <structure> e <build>
      - Sem cortes, câmera contínua única (seek(t))
      - Piso #f9fbfb centro / #f2f3f6 cantos
      - 0-8.2s Flight | 7.75-9.25s Rise | 9.25-9.47s Overhead
      - 9.47-9.97s Dive | 9.97-14.5s End Title Card (Geist 500 + Instrument Serif)
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
  const CRUISE_SPEED = 770; // px/s conforme especificação

  // Integração determinística da curva de velocidade da câmera (0 a 8.5s)
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
    const startY = 390; // Centro da metade superior do Hero
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

  window.addEventListener('resize', fitStageToWindow);

  function openFlyover(initialTime = 0, autoPlay = true) {
    if (!isFlyoverOpen) {
      isFlyoverOpen = true;
      document.body.classList.add('flyover-active');

      // Clona a página inteira para o palco 3D sem alterar o DOM principal
      pageMount.innerHTML = '';
      pageClone = mainPageContent.cloneNode(true);
      pageClone.id = 'pageSheet';
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

  // Função Determinística Principal seek(t)
  function seekFlyover(t) {
    currentTime = Math.max(0, Math.min(DURATION, t));
    if (scrubber) scrubber.value = currentTime.toFixed(2);
    if (timeLabel) timeLabel.innerText = `${currentTime.toFixed(2)}s / 14.50s`;

    if (!pageClone) return;

    // 1. Cálculo de Tilt (56° -> 0° entre 8.15s e 8.95s)
    const flattenProgress = smoothstep(8.15, 8.95, currentTime);
    const tiltDeg = 56 * (1 - flattenProgress);

    // 2. Cálculo de Escala / Distância e Ponto de Olhar (Look-At Y)
    let lookAtY = integrateLookAtY(currentTime);
    const maxFlightY = integrateLookAtY(8.3);
    const pageCenterY = totalPageHeight * 0.5;

    // Transição do Rise (7.75s - 9.25s) para mostrar a página inteira como uma tira centralizada
    const riseProgress = smoothstep(7.75, 9.25, currentTime);
    const overheadScale = (1152 - 84) / Math.max(totalPageHeight, 2800); // Borda inferior a 42px do fundo
    const flightScale = 1360 / (1360 + (1700 - 1360) * smoothstep(0, 8.2, currentTime));

    let currentScale = flightScale * Math.pow(overheadScale / flightScale, riseProgress);
    lookAtY = lookAtY * (1 - riseProgress) + pageCenterY * riseProgress;

    // 9.25s - 9.47s: Overhead creeping 3.5% closer
    if (currentTime > 9.25) {
      const creep1 = smoothstep(9.25, 9.47, currentTime);
      currentScale *= 1 + 0.035 * creep1;
    }

    // 9.47s - 9.97s: Dive para o Hero Card (1018px de largura = escala 1018/1440 = 0.7069, topo em y = 283)
    const diveProgress = easeInOutQuad((currentTime - 9.47) / 0.50);
    const heroCardScale = 1018 / 1440; // ~0.7069
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

      // Topo da página desce para y = 283 no final do Dive
      const dropProgress = smoothstep(9.62, 9.97, currentTime);
      const topYInStage = -576 + 283 * dropProgress;
      lookAtY = pageCenterY * (1 - diveProgress);
      sheetOffsetY = topYInStage / currentScale;

      cornerRadius = 24 + 14 * diveProgress; // 24px -> 38px corners
      const heroHeight = 860;
      heroClipBottom = totalPageHeight - (totalPageHeight - heroHeight) * diveProgress;
    }

    // Aplica transformação 3D da câmera no Rig e na Folha da Página
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

    // 3. Desfoque de Profundidade (DOF) - desaparece durante o Rise/Overhead/EndCard
    const dofOpacity = 1 - smoothstep(7.75, 8.85, currentTime);
    if (dofNear) dofNear.style.opacity = dofOpacity.toFixed(2);
    if (dofFar) dofFar.style.opacity = dofOpacity.toFixed(2);

    // 4. Elevação 3D individual das peças [data-layer] conforme cruzam o foco
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
        z = 22 + 90 * p; // 22px -> 112px
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

    // 5. Os 4 Logo Tiles Flutuantes (0.1s até 14.5s)
    updateFloatingTiles(currentTime);

    // 6. End Title Card (10.02s - 14.5s)
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

    // 0.1 - 1.35s: Tiles sobem ao lado do botão Hero, crescem para 140-180px nos cantos superiores
    // 1.2 - 2.4s: Acompanham e saem pelo topo; um passa na esquerda em 5.4s; no Dive (9.47s+) pousam nos cantos do Hero Card
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
        // 5.4s: Um logo tile passa pela borda esquerda próximo à lente e desfocado
        const p = (t - 4.8) / 1.3;
        x = 95;
        y = 1100 - p * 1250;
        size = 210;
        blur = 14;
        rot = -18 + p * 25;
        opacity = Math.sin(p * Math.PI);
      } else if (t >= 9.47) {
        // 9.47s - 14.5s: 2 tiles nos cantos superiores do Hero Card, 1 nítido na direita, 2 grandes desfocados nos cantos inferiores
        const enter = smoothstep(9.55, 10.05, t);
        const holdDrift = smoothstep(10.0, 14.5, t) * 10;
        opacity = enter;
        if (idx === 0) {
          // Canto superior esquerdo do Hero Card
          x = 215 - holdDrift;
          y = 290 - holdDrift * 0.5;
          size = 110;
          rot = -10;
          blur = 0;
        } else if (idx === 1) {
          // Nítido na borda direita do Hero Card
          x = 1235 + holdDrift;
          y = 430 + holdDrift * 0.6;
          size = 128;
          rot = 12;
          blur = 0;
        } else if (idx === 2) {
          // Grande e suave no canto inferior esquerdo
          x = 120 - holdDrift;
          y = 980 + holdDrift;
          size = 240;
          rot = 18;
          blur = 18;
          opacity = enter * 0.75;
        } else {
          // Grande e suave no canto inferior direito
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

    // 10.12s: Linha 1 em Geist 500 (74px), uma palavra a cada 0.06s
    line1Words.forEach((w, i) => {
      const start = 10.12 + i * 0.06;
      const p = smoothstep(start, start + 0.28, t);
      w.style.opacity = p.toFixed(3);
      w.style.transform = `translateY(${((1 - p) * 14).toFixed(1)}px)`;
      w.style.filter = `blur(${((1 - p) * 8).toFixed(1)}px)`;
    });

    // 10.36s: Linha 2 em Instrument Serif Italic (82px, #8b8b92), uma palavra a cada 0.05s, subindo 16px de um blur de 12px em 0.34s
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

  // Eventos de UI do Fly-Over
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

  // Expor API global seek(t) conforme especificação <build>
  window.seek = (t) => openFlyover(t, false);

  // Suporte a parâmetros de URL (?flyover=1 ou ?t=1.6)
  const params = new URLSearchParams(window.location.search);
  if (params.has('t')) {
    const tVal = parseFloat(params.get('t')) || 0;
    setTimeout(() => openFlyover(tVal, false), 150);
  } else if (params.get('flyover') === '1') {
    setTimeout(() => openFlyover(0, true), 150);
  }
}
