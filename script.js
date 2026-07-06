const WHATSAPP_URL = 'https://wa.me/77775807877?text=' + encodeURIComponent('Здравствуйте! Хочу записаться на диагностику.');
const MOBILE_BREAKPOINT = 768;

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMobileMenu();
    initHeaderScroll();
    initScrollReveal();
    initStaggerGroups();
    initParallax();
    initHeroAnimation();
    initMobileCtaBar();
    initDiagnosticButtons();
    initContactForm();
});

function initDiagnosticButtons() {
    document.querySelectorAll('.js-diagnostic').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(WHATSAPP_URL, '_blank');
            closeMobileMenu();
        });
    });
}

function initNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.classList.contains('js-diagnostic')) return;

            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    closeMobileMenu();
                }
            }
        });
    });
}

function getNavOverlay() {
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        document.body.appendChild(overlay);
        overlay.addEventListener('click', closeMobileMenu);
    }
    return overlay;
}

function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', isOpen);
        document.body.classList.toggle('nav-open', isOpen);
        getNavOverlay().classList.toggle('visible', isOpen);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
    });
}

function closeMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.querySelector('.nav-overlay');

    if (navLinks) navLinks.classList.remove('open');
    if (toggle) {
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    }
    if (overlay) overlay.classList.remove('visible');
    document.body.classList.remove('nav-open');
}

function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    const update = () => header.classList.toggle('scrolled', window.scrollY > 48);

    update();
    window.addEventListener('scroll', update, { passive: true });
}

function initStaggerGroups() {
    const groups = document.querySelectorAll('.stagger-group');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
    );

    groups.forEach(group => observer.observe(group));
}

function initParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth <= MOBILE_BREAKPOINT) return;

    const images = document.querySelectorAll('.section-bg img');
    if (!images.length) return;

    let ticking = false;

    const update = () => {
        images.forEach((img) => {
            const section = img.closest('.section-bg');
            if (!section) return;

            const rect = section.getBoundingClientRect();
            const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
            const offset = (progress - 0.5) * 40;
            img.style.transform = `translate3d(0, ${offset}px, 0) scale(1.04)`;
        });
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });

    update();
}

function initHeroAnimation() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    setTimeout(() => {
        hero.classList.add('hero-loaded');
    }, 120);
}

function initMobileCtaBar() {
    const ctaBar = document.querySelector('.mobile-cta-bar');
    const hero = document.querySelector('.hero');

    if (!ctaBar || !hero) return;

    const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;

    const updateCtaBar = () => {
        if (!isMobile()) {
            document.body.classList.remove('has-mobile-cta');
            ctaBar.classList.remove('visible');
            return;
        }

        document.body.classList.add('has-mobile-cta');
        const heroBottom = hero.getBoundingClientRect().bottom;
        ctaBar.classList.toggle('visible', heroBottom < 0);
    };

    updateCtaBar();
    window.addEventListener('scroll', updateCtaBar, { passive: true });
    window.addEventListener('resize', updateCtaBar, { passive: true });
}

function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const parent = entry.target.parentElement;
                const siblings = parent
                    ? [...parent.querySelectorAll(':scope > .reveal')]
                    : [];
                const index = siblings.indexOf(entry.target);
                const delay = isMobile ? index * 100 : index * 80;

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);

                observer.unobserve(entry.target);
            });
        },
        {
            threshold: isMobile ? 0.08 : 0.1,
            rootMargin: isMobile ? '0px 0px -20px 0px' : '0px 0px -40px 0px',
        }
    );

    elements.forEach(el => observer.observe(el));
}

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = form.querySelector('#name').value.trim();
        const message = form.querySelector('#message').value.trim();

        const subject = encodeURIComponent(`Заявка с сайта от ${name}`);
        const body = encodeURIComponent(
            `Имя: ${name}\n\nЗапрос:\n${message || '—'}`
        );

        window.location.href = `mailto:lunnoesolnce2011@gmail.com?subject=${subject}&body=${body}`;
        showToast('Открыт почтовый клиент — отправьте письмо');
        form.reset();
    });
}

function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}
