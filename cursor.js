/* ================================================
   cursor.js  —  drop-in custom cursor for olsanity
   Add <script src="cursor.js"></script> before </body>
   ================================================ */

(function () {

  /* Skip on touch devices — no cursor needed */
  if (window.matchMedia('(hover: none)').matches) return;

  /* ── Build DOM ── */
  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'cs-dot';
  ring.className = 'cs-ring';
  document.body.append(dot, ring);

  /* ── Styles ── */
  const style = document.createElement('style');
  style.textContent = `
    *, *::before, *::after { cursor: none !important; }

    .cs-dot {
      position: fixed;
      top: 0; left: 0;
      width: 8px; height: 8px;
      border-radius: 50%;
      background: #F5B841;
      pointer-events: none;
      z-index: 999999;
      transform: translate(-50%, -50%);
      transition: width .2s ease, height .2s ease, background .2s ease, opacity .2s ease;
      mix-blend-mode: normal;
      will-change: transform;
    }

    .cs-ring {
      position: fixed;
      top: 0; left: 0;
      width: 46px; height: 46px;
      border-radius: 50%;
      border: 1.5px solid rgba(245, 184, 65, 0.55);
      pointer-events: none;
      z-index: 999998;
      transform: translate(-50%, -50%);
      transition:
        width  .35s cubic-bezier(.22,1,.36,1),
        height .35s cubic-bezier(.22,1,.36,1),
        border-color .25s ease,
        background   .25s ease,
        opacity      .2s ease;
      will-change: transform;
    }

    /* ── BLEND STATE (hovering text) ── */
    .cs-dot.blend {
      width: 88px; height: 88px;
      background: #e7cc96;
      mix-blend-mode: difference;
    }

    .cs-ring.blend {
      width: 48px; height: 48px;
      border-color: transparent;
      background: transparent;
    }

    /* ── LINK / BUTTON STATE ── */
    .cs-dot.is-link {
      width: 12px; height: 12px;
      background: #F5B841;
    }

    .cs-ring.is-link {
      width: 48px; height: 48px;
      border-color: rgba(245, 184, 65, 0.8);
    }

    /* ── CLICK PULSE ── */
    .cs-ring.click {
      animation: csClick .4s ease forwards;
    }

    @keyframes csClick {
      0%   { transform: translate(-50%,-50%) scale(1);   opacity: 1; }
      100% { transform: translate(-50%,-50%) scale(1.8); opacity: 0; }
    }

    /* ── HIDE when mouse leaves window ── */
    .cs-dot.hidden, .cs-ring.hidden {
      opacity: 0;
    }
  `;
  document.head.appendChild(style);

  /* ── Tracking ── */
  let mx = -100, my = -100;
  let dx = -100, dy = -100; // dot position (smoothed)
  let rx = -100, ry = -100; // ring position (more lag)

  const DOT_LERP = 0.2;  // faster = tighter
  const RING_LERP = 0.08; // slower = more float

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function tick() {
    // Smooth movement
    dx = lerp(dx, mx, DOT_LERP);
    dy = lerp(dy, my, DOT_LERP);

    rx = lerp(rx, mx, RING_LERP);
    ry = lerp(ry, my, RING_LERP);

    dot.style.transform = `translate(calc(${dx}px - 50%), calc(${dy}px - 50%))`;
    ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;

    requestAnimationFrame(tick);
  }

  tick();

  /* ── Mouse move ── */
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.classList.remove('hidden');
    ring.classList.remove('hidden');
  });

  /* ── Hide when cursor leaves window ── */
  document.addEventListener('mouseleave', () => {
    dot.classList.add('hidden');
    ring.classList.add('hidden');
  });

  document.addEventListener('mouseenter', () => {
    dot.classList.remove('hidden');
    ring.classList.remove('hidden');
  });

  /* ── Click pulse ── */
  document.addEventListener('mousedown', () => {
    ring.classList.remove('click');
    void ring.offsetWidth; // force reflow to restart animation
    ring.classList.add('click');
  });

  document.addEventListener('mouseup', () => {
    setTimeout(() => ring.classList.remove('click'), 400);
  });

  /* ── Hover detection ── */

  /*
    BLEND targets: any element with data-cursor="blend"
    or: h1, h2, h3, .hero-title, .works-title, .project-title, .connect-title
    Add data-cursor="blend" to any element you want the effect on.
  */
  const BLEND_SELECTOR = [
    '[data-cursor="blend"]',
    '.hero-title',
    '.works-title',
    '.project-title',
    '.connect-title',
    '.connect-sub',
    '.logo-footer',
    '.loader-name',
    '.about-3d .layer',
    'h1', 'h2', 'h3'
  ].join(', ');

  /*
    LINK targets: a, button, [data-cursor="pointer"]
  */
  const LINK_SELECTOR = 'a, button, [data-cursor="pointer"]';

  function applyState(el) {
    if (!el) return clear();
    if (el.closest(LINK_SELECTOR)) return setLink();
    if (el.closest(BLEND_SELECTOR)) return setBlend();
    clear();
  }

  function setBlend() {
    dot.classList.add('blend'); ring.classList.add('blend');
    dot.classList.remove('is-link'); ring.classList.remove('is-link');
  }

  function setLink() {
    dot.classList.add('is-link'); ring.classList.add('is-link');
    dot.classList.remove('blend'); ring.classList.remove('blend');
  }

  function clear() {
    dot.classList.remove('blend', 'is-link');
    ring.classList.remove('blend', 'is-link');
  }

  document.addEventListener('mouseover', e => applyState(e.target));
  document.addEventListener('mouseout', () => clear());

})();
