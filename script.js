gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);



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








// ===== INTERACTIVE CARD SYSTEM =====
const workSection = document.querySelector('.works');
const workCards = document.querySelectorAll(".work-card");
const cardInners = document.querySelectorAll(".card-inner");
const infoElements = document.querySelectorAll(".project-info-outside");

let mouseXx = 0;
let mouseYy = 0;
let sectionRect = workSection.getBoundingClientRect();
let animationFrame = null;
let hoveredCard = null;

// Update section rect on resize
window.addEventListener('resize', () => {
  sectionRect = workSection.getBoundingClientRect();
});

// Track which card is being hovered
cardInners.forEach((card, index) => {
  card.addEventListener('mouseenter', () => {
    hoveredCard = card;
  });

  card.addEventListener('mouseleave', () => {
    hoveredCard = null;
  });
});

// Check hover state on scroll
window.addEventListener('scroll', () => {
  if (hoveredCard) {
    const rect = hoveredCard.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom > 0;

    if (!isInView) {
      const mouseLeaveEvent = new Event('mouseleave');
      hoveredCard.dispatchEvent(mouseLeaveEvent);

      cardInners.forEach(card => {
        card.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.transform = '';
      });

      infoElements.forEach(info => {
        info.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        info.style.transform = '';
      });

      hoveredCard = null;
    }
  }
});

// Mouse leaves window
document.addEventListener('mouseleave', () => {
  if (hoveredCard) {
    const mouseLeaveEvent = new Event('mouseleave');
    hoveredCard.dispatchEvent(mouseLeaveEvent);

    cardInners.forEach(card => {
      card.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      card.style.transform = '';
    });

    infoElements.forEach(info => {
      info.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      info.style.transform = '';
    });

    hoveredCard = null;
  }
});

// GLOBAL MOUSE MOVE - affects both cards AND info
workSection.addEventListener("mousemove", (e) => {
  mouseXx = e.clientX;
  mouseYy = e.clientY;

  sectionRect = workSection.getBoundingClientRect();

  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }

  animationFrame = requestAnimationFrame(() => {
    const relX = (mouseXx - sectionRect.left) / sectionRect.width;
    const relY = (mouseYy - sectionRect.top) / sectionRect.height;

    workSection.style.backgroundPosition = `${50 + (relX - 0.5) * 15}% ${50 + (relY - 0.5) * 15}%`;
    workSection.style.transition = 'background-position 0.2s cubic-bezier(0.4, 0, 0.2, 1)';

    // Move both cards AND their info
    workCards.forEach((card) => {
      const cardInner = card.querySelector('.card-inner');
      const info = card.querySelector('.project-info-outside');

      if (cardInner && !cardInner.matches(':hover') && cardInner !== hoveredCard) {
        const cardRect = cardInner.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;

        const distX = cardCenterX - mouseXx;
        const distY = cardCenterY - mouseYy;

        const distance = Math.sqrt(distX * distX + distY * distY);
        const maxDistance = 500;
        const strength = Math.max(0, 1 - distance / maxDistance);

        const moveX = -distX * strength * 0.5;
        const moveY = -distY * strength * 0.5;

        const limitedMoveX = Math.max(-50, Math.min(50, moveX));
        const limitedMoveY = Math.max(-50, Math.min(50, moveY));

        cardInner.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        cardInner.style.transform = `translate(${limitedMoveX}px, ${limitedMoveY}px)`;

        if (info) {
          info.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
          info.style.transform = `translate(${limitedMoveX * 0.8}px, ${limitedMoveY * 0.8}px)`;
        }
      }
    });

    animationFrame = null;
  });
});

// INDIVIDUAL CARD FOLLOW - moves both card AND its info
cardInners.forEach((card, index) => {
  let rafId = null;
  const info = document.querySelectorAll('.project-info-outside')[index];

  card.addEventListener("mousemove", (e) => {
    e.stopPropagation();

    if (rafId) {
      cancelAnimationFrame(rafId);
    }

    rafId = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const moveX = ((x - centerX) / centerX) * 45;
      const moveY = ((y - centerY) / centerY) * 45;

      card.style.transition = 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)';
      card.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.03)`;

      if (info) {
        info.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
        info.style.transform = `translate(${moveX * 0.6}px, ${moveY * 0.6}px)`;
      }
    });
  });

  card.addEventListener("mouseleave", () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
    }

    hoveredCard = null;

    card.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    card.style.transform = '';

    if (info) {
      info.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      info.style.transform = '';
    }
  });
});

// Mouse leaves section
workSection.addEventListener("mouseleave", () => {
  cardInners.forEach(card => {
    card.style.transition = 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
    card.style.transform = '';
  });

  infoElements.forEach(info => {
    info.style.transition = 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
    info.style.transform = '';
  });

  hoveredCard = null;
  workSection.style.transition = 'background-position 1.5s ease';
  workSection.style.backgroundPosition = '50% 50%';
});

// Scroll animation with hover protection
window.addEventListener("scroll", () => {
  const viewportHeight = window.innerHeight;

  workCards.forEach((card) => {
    const cardInner = card.querySelector('.card-inner');
    const info = card.querySelector('.project-info-outside');

    if (cardInner && cardInner !== hoveredCard && !cardInner.matches(':hover')) {
      const rect = cardInner.getBoundingClientRect();
      const offset = rect.top;
      const progress = Math.min(Math.max((viewportHeight - offset - 200) / viewportHeight, 0), 1);

      const floatY = progress * 20;

      cardInner.style.transform = `translateY(${floatY}px)`;
      cardInner.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

      if (info) {
        info.style.transform = `translateY(${floatY}px)`;
        info.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      }
    }
  });
});




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





