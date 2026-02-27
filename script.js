gsap.registerPlugin(ScrollTrigger);







const linksContainer = document.querySelector(".links-pill");
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



window.addEventListener("load", () => {
  const pills = document.querySelectorAll(".nav-pill");

  pills.forEach((pill, index) => {
    setTimeout(() => {
      pill.classList.add("reveal");
    }, index * 180);
  });
});


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













const canvas = document.getElementById("hero-canvas");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  15,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.3));
const pointLight = new THREE.PointLight(0xff6f3c, 1.2);
pointLight.position.set(3, 3, 3);
scene.add(pointLight);

// === Particles ===
const count = 1200;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
const twinkleOffsets = new Float32Array(count); // unique twinkle speed per star

for (let i = 0; i < count; i++) {
  const i3 = i * 3;

  positions[i3] = (Math.random() - 0.5) * 8;
  positions[i3 + 1] = (Math.random() - 0.5) * 6;
  positions[i3 + 2] = (Math.random() - 0.5) * 6;


  const starType = Math.random();

  if (starType < 0.7) {
    // White stars
    colors[i3] = 0.9;
    colors[i3 + 1] = 0.9;
    colors[i3 + 2] = 1;
  } else if (starType < 0.9) {
    // Blue stars
    colors[i3] = 0.6;
    colors[i3 + 1] = 0.7;
    colors[i3 + 2] = 1;
  } else {
    // Slight warm stars
    colors[i3] = 1;
    colors[i3 + 1] = 0.85;
    colors[i3 + 2] = 0.7;
  }

  // Each star twinkles at different rhythm
  twinkleOffsets[i] = Math.random() * 40;
}

geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

function createCircleTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  gradient.addColorStop(0, "white");
  gradient.addColorStop(0.2, "white");
  gradient.addColorStop(1, "transparent");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  return new THREE.CanvasTexture(canvas);
}

const material = new THREE.PointsMaterial({
  vertexColors: true,
  size: 0.018,
  transparent: true,
  opacity: 0.9,
  map: createCircleTexture(),
  alphaTest: 0.01,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});

const points = new THREE.Points(geometry, material);
scene.add(points);

// === Mouse Interaction ===
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// === Animation Loop ===
function animate() {
  requestAnimationFrame(animate);

  const positions = geometry.attributes.position.array;
  const colors = geometry.attributes.color.array;
  const time = Date.now() * 0.002;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // Subtle floating motion
    positions[i3 + 1] += Math.sin(time + i3) * 0.0003;
    positions[i3] += Math.cos(time + i3) * 0.0003;

    // Mouse influence
    positions[i3] += mouseX * 0.0008;
    positions[i3 + 1] += mouseY * 0.0008;

    // ✨ Twinkle effect
    const twinkle = (Math.sin(time * 2 + twinkleOffsets[i]) + 1) / 2;
    const brightness = 0.6 + twinkle * 0.4;

    colors[i3] = brightness;        // R
    colors[i3 + 1] = brightness; // G
    colors[i3 + 2] = brightness * .8;              // B
  }

  geometry.attributes.position.needsUpdate = true;
  geometry.attributes.color.needsUpdate = true;

  points.rotation.y += 0.001 + mouseX * 0.002;
  points.rotation.x += 0.0005 + mouseY * 0.002;

  renderer.render(scene, camera);
}

animate();

// Responsive
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});



const titles = [
  "Frontend Developer specializing in modern UI and motion.",
  "Building high-performance, scalable, refined web experiences.",
  "Everyday I write poetry, most days I code, for what's life without art."
];

const typingElement = document.getElementById("typing");

let index = 0;

function rotateTitles() {
  typingElement.style.opacity = 0;

  setTimeout(() => {
    index = (index + 1) % titles.length;
    typingElement.textContent = titles[index];
    typingElement.style.opacity = 1;
  }, 400);
}

typingElement.textContent = titles[0];
setInterval(rotateTitles, 4000);



const hero = document.querySelector(".hero-inner");

document.addEventListener("mousemove", (e) => {
  const x = (window.innerWidth / 2 - e.clientX) / 40;
  const y = (window.innerHeight / 2 - e.clientY) / 40;

  hero.style.transform = `translate(${x}px, ${y}px)`;
});

window.addEventListener("load", () => {
  const heroInner = document.querySelector(".hero-inner");
  setTimeout(() => {
    heroInner.classList.add("visible");
  }, 200); // small delay for nicer timing
});


window.addEventListener("load", () => {
  const heroParts = [
    document.querySelector(".hero-title"),
    document.getElementById("typing"),
    document.querySelector(".hero-subtext"),
    document.querySelector(".hero-cta"),
    document.querySelector(".service-scroller")
  ];

  heroParts.forEach((el, i) => {
    setTimeout(() => el.classList.add("visible"), i * 300);
  });
});

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const heroHeight = window.innerHeight; // full viewport height
  const progress = Math.min(scrollTop / heroHeight, 1); // 0 → 1

  // Calculate shrinking and perspective
  const scaleY = 1 - progress * 0.25; // shrink 25% vertically
  const scaleX = 1 - progress * 0.15; // optional horizontal squeeze
  const translateZ = -progress * 50; // subtle Z-depth effect

  hero.style.transform = `
    scaleX(${scaleX})
    scaleY(${scaleY})
    translateZ(${translateZ}px)
  `;

  // Optional: fade out slightly
  hero.style.opacity = 1 - progress * 0.9;
});








// ===== MINIMAL INTERACTIVE CARDS =====
// ===== MINIMAL INTERACTIVE CARDS + SCROLL ENTRANCE =====
const cards = document.querySelectorAll(".card-inner");

// Card tilt hover
cards.forEach(card => {
  const info = card.nextElementSibling; // .project-info-outside

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const moveX = ((x - centerX) / centerX) * 15;
    const moveY = ((y - centerY) / centerY) * 15;

    card.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
    if (info) info.style.transform = `translate(${moveX * 0.3}px, ${moveY * 0.3}px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translate(0,0) scale(1)";
    if (info) info.style.transform = "translate(0,0)";
  });
});

// Scroll entrance using IntersectionObserver
const observerOptions = {
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      obs.unobserve(entry.target); // only trigger once
    }
  });
}, observerOptions);

cards.forEach(card => observer.observe(card));




const aboutSection = document.querySelector(".about");
const layers = document.querySelectorAll(".layer");
const aboutSticky = document.querySelector(".about-sticky");

window.addEventListener("scroll", () => {
  const rect = aboutSection.getBoundingClientRect();
  const scrollProgress = -rect.top / (aboutSection.offsetHeight - window.innerHeight);

  // Clamp the progress between 0 and 1
  const clampedProgress = Math.max(0, Math.min(1, scrollProgress));

  layers.forEach((layer, index) => {
    const depth = (index - 1) * 400;
    // Increase movement range to push layers completely out of view
    const movement = clampedProgress * 2000; // Increased from 800 to 2000

    layer.style.transform = `
      translate(-50%, -50%)
      translateZ(${depth + movement}px)
    `;
  });

  // Optional: Add a fade out effect at the end
  if (clampedProgress > 0.8) {
    aboutSticky.style.opacity = 1 - (clampedProgress - 0.8) * 5;
  } else {
    aboutSticky.style.opacity = 1;
  }
});


(function () {
  const totalSeconds = 384;
  const startSeconds = 355;

  const timeEl = document.getElementById('liveMin');
  const fillEl = document.getElementById('progressFill');

  let currentSeconds = startSeconds;

  function formatTime(sec) {
    let m = Math.floor(sec / 60);
    let s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function updateDisplay() {
    // Update timestamp
    timeEl.textContent = formatTime(currentSeconds);

    // Update progress bar width (percentage)
    let percent = (currentSeconds / totalSeconds) * 100;
    fillEl.style.width = percent + '%';
  }

  // Advance time every second
  setInterval(() => {
    currentSeconds++;
    if (currentSeconds > totalSeconds) {
      currentSeconds = 0; // Loop back to start
    }
    updateDisplay();
  }, 1000);

  // Initial display
  updateDisplay();
})();


gsap.from(".about-grid .box", {
  scrollTrigger: {
    trigger: ".about-grid",
    start: "top 50%",
  },
  duration: 1,
  opacity: 0,
  y: 50,
  rotation: 8,
  scale: 0.9,
  stagger: 0.2,
  ease: "power3.out",
  ease: "elastic.out(2, 0.5)"
});



