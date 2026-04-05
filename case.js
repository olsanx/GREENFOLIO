/* ================================================
   case.js — shared across all case study pages
   Requires GSAP + ScrollTrigger (loaded in HTML)
   ================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────
   1. NAV — slide in on load
────────────────────────────────────────── */
gsap.to('#csNav', {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out',
    delay: 0.1
});

/* ──────────────────────────────────────────
   2. HERO — staggered entrance sequence
   Each element wipes in top-to-bottom,
   slightly offset, with a soft blur lift.
────────────────────────────────────────── */
const heroTl = gsap.timeline({ delay: 0.25 });

heroTl
    .to('#h-eye', {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'power3.out'
    })
    .to('#h-title', {
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: 'power3.out'
    }, '-=0.3')
    .to('#h-desc', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
    }, '-=0.45')
    .to('#h-meta', {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'power3.out'
    }, '-=0.4')
    .to('#h-cta', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.out'
    }, '-=0.35');

/* ──────────────────────────────────────────
   3. SCROLL REVEALS
   All .reveal elements animate in as they
   enter the viewport. Results numbers get
   a separate counter animation.
────────────────────────────────────────── */
gsap.utils.toArray('.reveal').forEach(el => {
    gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true
        }
    });
});

/* ──────────────────────────────────────────
   4. RESULT NUMBERS — count up on reveal
────────────────────────────────────────── */
(function () {
    const results = document.querySelectorAll('.cs-result__num');

    results.forEach(el => {
        const raw = el.textContent.trim();

        // Only animate pure numeric values
        const numericMatch = raw.match(/^(\d+)(%?)$/);
        if (!numericMatch) return;

        const target = parseInt(numericMatch[1], 10);
        const suffix = numericMatch[2] || '';
        const obj = { val: 0 };

        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                gsap.to(obj, {
                    val: target,
                    duration: 1.4,
                    ease: 'power2.out',
                    onUpdate: () => {
                        el.textContent = Math.round(obj.val) + suffix;
                    }
                });
            }
        });
    });
})();

/* ──────────────────────────────────────────
   5. PROCESS STEPS — stagger in sequence
────────────────────────────────────────── */
gsap.utils.toArray('.cs-step').forEach((step, i) => {
    gsap.from(step, {
        opacity: 0,
        x: -16,
        duration: 0.5,
        ease: 'power2.out',
        delay: i * 0.08,
        scrollTrigger: {
            trigger: step,
            start: 'top 90%',
            once: true
        }
    });
});

/* ──────────────────────────────────────────
   6. READ PROGRESS BAR
────────────────────────────────────────── */

/* ──────────────────────────────────────────
   7. PROJECT NAV — cursor glow
────────────────────────────────────────── */
document.querySelectorAll('.cs-proj-nav__card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
        const y = ((e.clientY - r.top) / r.height * 100).toFixed(1);
        card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(245,184,65,0.05), transparent 60%), var(--bg)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.background = '';
    });
});