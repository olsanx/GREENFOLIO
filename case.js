/* case-timi.js */

// ===== PROGRESS BAR =====
const progress = document.getElementById('progress');
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.body.scrollHeight - window.innerHeight;
    progress.style.width = `${(scrolled / total) * 100}%`;
}, { passive: true });

// ===== NAV SCROLL STATE =====
const nav = document.getElementById('nav');
const navLabel = document.getElementById('nav-section-label');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ===== SECTION LABEL IN NAV =====
const markers = document.querySelectorAll('.section-marker');
const markerObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            navLabel.textContent = e.target.dataset.label;
            navLabel.classList.add('visible');
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });
markers.forEach(m => markerObs.observe(m));

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            e.target.style.transitionDelay = '0s';
            e.target.classList.add('visible');
            obs.unobserve(e.target);
        }
    });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObs.observe(el));

// ===== IMAGE REVEAL =====
const imgSection = document.querySelector('.img-reveal-section');
const imgInner = document.querySelector('.img-reveal-inner');
if (imgInner) {
    const imgObs = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                imgInner.classList.add('revealed');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });
    imgObs.observe(imgSection);
}

// ===== HERO IMAGE LOAD =====
const heroStrip = document.getElementById('hero-img');
const heroImgEl = heroStrip?.querySelector('.hero-img-el');
if (heroImgEl) {
    if (heroImgEl.complete) {
        heroStrip.classList.add('loaded');
    } else {
        heroImgEl.addEventListener('load', () => heroStrip.classList.add('loaded'));
    }
}

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const dot = document.getElementById('cursor-dot');

if (cursor && dot) {
    let cx = 0, cy = 0;
    let tx = 0, ty = 0;

    window.addEventListener('mousemove', e => {
        tx = e.clientX;
        ty = e.clientY;
        dot.style.left = tx + 'px';
        dot.style.top = ty + 'px';
    }, { passive: true });

    function animateCursor() {
        cx += (tx - cx) * 0.12;
        cy += (ty - cy) * 0.12;
        cursor.style.left = cx + 'px';
        cursor.style.top = cy + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor react to data-cursor elements
    document.querySelectorAll('[data-cursor]').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            cursor.dataset.label = el.dataset.cursor;
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            cursor.dataset.label = '';
        });
    });

    // Hide on nav links etc
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.opacity = '0.5';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.opacity = '1';
        });
    });
}