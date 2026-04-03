gsap.registerPlugin(ScrollTrigger);

/* ==============================
   NAV — hover pill
============================== */
const linksContainer = document.querySelector(".links-pill");
if (linksContainer) {
  const links = linksContainer.querySelectorAll("a");
  const hoverPill = linksContainer.querySelector(".hover-pill");

  links.forEach(link => {
    link.addEventListener("mouseenter", () => {
      const rect = link.getBoundingClientRect();
      const containerRect = linksContainer.getBoundingClientRect();
      hoverPill.style.width = rect.width + 24 + "px";
      hoverPill.style.left = rect.left - containerRect.left - 12 + "px";
      hoverPill.style.opacity = "1";
    });
  });

  linksContainer.addEventListener("mouseleave", () => {
    hoverPill.style.opacity = "0";
  });
}

/* ==============================
   NAV — pill reveal on load
============================== */
window.addEventListener("load", () => {
  const pills = document.querySelectorAll(".nav-pill");
  pills.forEach((pill, index) => {
    setTimeout(() => pill.classList.add("reveal"), index * 180);
  });
});

/* ==============================
   NAV — hamburger
============================== */
const hamburger = document.querySelector(".nav-hamburger");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-menu a");

function toggleMenu() {
  hamburger.classList.toggle("open");
  mobileMenu.classList.toggle("open");
}

hamburger.addEventListener("click", toggleMenu);
mobileLinks.forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
  });
});

/* ==============================
   THREE.JS HERO CANVAS
============================== */
const canvas = document.getElementById("hero-canvas");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

scene.add(new THREE.AmbientLight(0xffffff, 0.3));
const pointLight = new THREE.PointLight(0xff6f3c, 1.2);
pointLight.position.set(3, 3, 3);
scene.add(pointLight);

const count = 1200;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
const twinkleOffsets = new Float32Array(count);

for (let i = 0; i < count; i++) {
  const i3 = i * 3;
  positions[i3] = (Math.random() - 0.5) * 8;
  positions[i3 + 1] = (Math.random() - 0.5) * 6;
  positions[i3 + 2] = (Math.random() - 0.5) * 6;

  const starType = Math.random();
  if (starType < 0.7) {
    colors[i3] = 0.9; colors[i3 + 1] = 0.9; colors[i3 + 2] = 1;
  } else if (starType < 0.9) {
    colors[i3] = 0.6; colors[i3 + 1] = 0.7; colors[i3 + 2] = 1;
  } else {
    colors[i3] = 1; colors[i3 + 1] = 0.85; colors[i3 + 2] = 0.7;
  }
  twinkleOffsets[i] = Math.random() * 40;
}

geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

function createCircleTexture() {
  const size = 64;
  const cv = document.createElement("canvas");
  cv.width = size; cv.height = size;
  const ctx = cv.getContext("2d");
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "white");
  grad.addColorStop(0.2, "white");
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(cv);
}

const starMaterial = new THREE.PointsMaterial({
  vertexColors: true,
  size: 0.018,
  transparent: true,
  opacity: 0.9,
  map: createCircleTexture(),
  alphaTest: 0.01,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});

const points = new THREE.Points(geometry, starMaterial);
scene.add(points);

let mouseX = 0, mouseY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function animate() {
  requestAnimationFrame(animate);
  const pos = geometry.attributes.position.array;
  const col = geometry.attributes.color.array;
  const time = Date.now() * 0.002;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    pos[i3] += Math.cos(time + i3) * 0.0003 + mouseX * 0.0008;
    pos[i3 + 1] += Math.sin(time + i3) * 0.0003 + mouseY * 0.0008;
    const twinkle = (Math.sin(time * 2 + twinkleOffsets[i]) + 1) / 2;
    const brightness = 0.6 + twinkle * 0.4;
    col[i3] = brightness; col[i3 + 1] = brightness; col[i3 + 2] = brightness * 0.8;
  }

  geometry.attributes.position.needsUpdate = true;
  geometry.attributes.color.needsUpdate = true;
  points.rotation.y += 0.001 + mouseX * 0.002;
  points.rotation.x += 0.0005 + mouseY * 0.002;
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ==============================
   LOADER
============================== */
const loaderName = document.querySelector(".loader-name");
if (loaderName) {
  loaderName.innerHTML = loaderName.textContent
    .split("")
    .map(letter => {
      const delay = (Math.random() * 0.6).toFixed(2);
      return `<span style="animation-delay:${delay}s">${letter}</span>`;
    })
    .join("");

  window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");
    setTimeout(() => loader.classList.add("lift"), 2000);
    setTimeout(() => loader.remove(), 3200);
  });
}

/* ==============================
   HERO — title rotation
============================== */
const titles = [
  "Frontend Developer specializing in modern UI and motion.",
  "Building high-performance, scalable, refined web experiences.",
  "Everyday I write poetry, most days I code, for what's life without art."
];

const typingElement = document.getElementById("typing");
if (typingElement) {
  let titleIndex = 0;
  typingElement.textContent = titles[0];

  function rotateTitles() {
    typingElement.style.opacity = 0;
    setTimeout(() => {
      titleIndex = (titleIndex + 1) % titles.length;
      typingElement.textContent = titles[titleIndex];
      typingElement.style.opacity = 1;
    }, 400);
  }

  typingElement.style.transition = "opacity 0.4s ease";
  setInterval(rotateTitles, 4000);

}

/* ==============================
   HERO — parallax + fade on scroll
============================== */
const heroInner = document.querySelector(".hero-inner");

if (heroInner) {
  document.addEventListener("mousemove", (e) => {
    const x = (window.innerWidth / 2 - e.clientX) / 50;
    const y = (window.innerHeight / 2 - e.clientY) / 50;
    heroInner.style.transform = `translate(${x}px, ${y}px)`;
  });

  window.addEventListener("load", () => {
    setTimeout(() => heroInner.classList.add("visible"), 200);
  });

  window.addEventListener("load", () => {
    const heroParts = [
      document.querySelector(".hero-title"),
      document.querySelector(".hero-subtext"),
      document.querySelector(".hero-cta"),
      document.querySelector(".service-scroller")
    ].filter(Boolean);

    heroParts.forEach((el, i) => {
      setTimeout(() => el.classList.add("visible"), 500 + i * 250);
    });
  });

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const heroHeight = window.innerHeight;
    const progress = Math.min(scrollTop / heroHeight, 1);
    const scaleY = 1 - progress * 0.22;
    const scaleX = 1 - progress * 0.12;
    const translateZ = -progress * 40;
    heroInner.style.transform = `scaleX(${scaleX}) scaleY(${scaleY}) translateZ(${translateZ}px)`;
    heroInner.style.opacity = 1 - progress * 0.85;
  });
}

/* ==============================
   HERO — button magnetic
============================== */
document.querySelectorAll(".btn-primary, .btn-secondary").forEach(btn => {
  btn.addEventListener("mousemove", e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "translate(0,0)";
  });
});

/* ==============================
   WORKS — card tilt + scroll entrance
============================== */
const cards = document.querySelectorAll(".card-inner");

cards.forEach(card => {
  const info = card.nextElementSibling;

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const moveX = ((x - rect.width / 2) / (rect.width / 2)) * 12;
    const moveY = ((y - rect.height / 2) / (rect.height / 2)) * 12;
    card.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
    if (info) info.style.transform = `translate(${moveX * 0.25}px, ${moveY * 0.25}px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translate(0,0) scale(1)";
    if (info) info.style.transform = "translate(0,0)";
  });
});

const cardObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

cards.forEach(card => cardObserver.observe(card));

/* ==============================
   ABOUT — 3D parallax layers
============================== */
const aboutSection = document.querySelector(".about");
const layers = document.querySelectorAll(".layer");
const aboutSticky = document.querySelector(".about-sticky");

if (aboutSection && layers.length) {
  window.addEventListener("scroll", () => {
    const rect = aboutSection.getBoundingClientRect();
    const scrollProgress = -rect.top / (aboutSection.offsetHeight - window.innerHeight);
    const clamped = Math.max(0, Math.min(1, scrollProgress));

    layers.forEach((layer, index) => {
      const depth = (index - 1) * 400;
      const movement = clamped * 3000;
      layer.style.transform = `translate(-50%, -50%) translateZ(${depth + movement}px)`;
    });

    if (aboutSticky) {
      aboutSticky.style.opacity = clamped > 0.8 ? 1 - (clamped - 0.8) * 5 : 1;
    }
  });
}

/* ==============================
   ABOUT — vinyl progress
============================== */
(function () {
  const totalSeconds = 384;
  let currentSeconds = 355;
  const timeEl = document.getElementById("liveMin");
  const fillEl = document.getElementById("progressFill");
  if (!timeEl || !fillEl) return;

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function updateDisplay() {
    timeEl.textContent = formatTime(currentSeconds);
    fillEl.style.width = (currentSeconds / totalSeconds * 100) + "%";
  }

  setInterval(() => {
    currentSeconds = (currentSeconds + 1) > totalSeconds ? 0 : currentSeconds + 1;
    updateDisplay();
  }, 1000);

  updateDisplay();
})();

/* ==============================
   ABOUT — GSAP box entrance
============================== */
gsap.from(".about-grid .box", {
  scrollTrigger: { trigger: ".about-grid", start: "top 55%" },
  duration: 1,
  opacity: 0,
  y: 50,
  rotation: 8,
  scale: 0.9,
  stagger: 0.18,
  ease: "elastic.out(2, 0.5)"
});

/* ==============================
   CONNECT — scroll reveal + typewriter
============================== */
(function () {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(".cs-fade").forEach(el => io.observe(el));

  const lines = ["Let's talk.", "I'd love to help.", "Fill me in."];
  const textEl = document.querySelector(".typed-text");
  const sectEl = document.querySelector(".connect-section");
  if (!textEl || !sectEl) return;

  let pi = 0, ci = 0, deleting = false, going = false;

  function tick() {
    const phrase = lines[pi];
    if (!deleting) {
      textEl.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(tick, 2000); return; }
    } else {
      textEl.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % lines.length; setTimeout(tick, 350); return; }
    }
    setTimeout(tick, deleting ? 35 : 68);
  }

  const startObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !going) {
      going = true;
      setTimeout(tick, 700);
      startObs.disconnect();
    }
  }, { threshold: 0.2 });

  startObs.observe(sectEl);
})();

/* ==============================
   CONTACT FORM
============================== */
(function () {
  const btn = document.getElementById("formSubmit");
  const success = document.getElementById("formSuccess");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const name = document.getElementById("fname")?.value.trim();
    const email = document.getElementById("femail")?.value.trim();
    const subject = document.getElementById("fsubject")?.value;
    const message = document.getElementById("fmessage")?.value.trim();

    // Basic validation
    if (!name || !email || !subject || !message) {
      // Shake empty fields
      [
        { id: "fname", val: name },
        { id: "femail", val: email },
        { id: "fsubject", val: subject },
        { id: "fmessage", val: message }
      ].forEach(({ id, val }) => {
        if (!val) {
          const el = document.getElementById(id);
          if (el) {
            el.style.borderColor = "rgba(239,68,68,0.5)";
            el.style.animation = "shake 0.35s ease";
            setTimeout(() => {
              el.style.animation = "";
              el.style.borderColor = "";
            }, 400);
          }
        }
      });
      return;
    }

    // Simulate sending
    btn.classList.add("sending");

    setTimeout(() => {
      btn.classList.remove("sending");
      btn.style.display = "none";
      success.classList.add("show");

      // Reset form
      ["fname", "femail", "fmessage"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
      });
      const sel = document.getElementById("fsubject");
      if (sel) sel.selectedIndex = 0;
    }, 1800);
  });

  // Re-enable if they want to send another
  success.addEventListener("click", () => {
    success.classList.remove("show");
    btn.style.display = "";
  });

  // Add shake keyframe if not in CSS
  const shakeStyle = document.createElement("style");
  shakeStyle.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(6px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(shakeStyle);
})();

/* ==============================
   FOOTER — live date & time
============================== */
function updateDateTime() {
  const now = new Date();
  const dateString = now.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }).toUpperCase();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} ${ampm}`;

  const dateEl = document.getElementById("footer-date");
  const timeEl = document.getElementById("footer-time");
  if (dateEl) dateEl.textContent = dateString;
  if (timeEl) timeEl.textContent = formattedTime;
}

updateDateTime();
setInterval(updateDateTime, 1000);