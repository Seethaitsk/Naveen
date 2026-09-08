// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function () {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 80,
            disable: function () {
                return window.innerWidth < 768;
            }
        });
    }

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Auto-close mobile navigation menu when a link is clicked
    const navLinks = document.querySelectorAll('#navbarNav .nav-link, #navbarNav .btn');
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && typeof bootstrap !== 'undefined') {
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) {
                        bsCollapse.hide();
                    }
                }
            });
        });
    }

    // CTA Form Submission Handling
    const ctaForm = document.getElementById('ctaForm');
    if (ctaForm) {
        ctaForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Thank you for requesting a consultation! Naveen R. will get back to you shortly.');
            ctaForm.reset();
        });
    }

    // Dynamic Cursor Spotlight Tracking for Cards
    const spotlightCards = document.querySelectorAll('.service-card, .why-choose-card');
    spotlightCards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Hero Banner Auto Carousel Controller
    const heroCarouselEl = document.getElementById('heroCarousel');
    if (heroCarouselEl && typeof bootstrap !== 'undefined') {
        const heroCarousel = bootstrap.Carousel.getOrCreateInstance(heroCarouselEl, {
            interval: 3500,
            pause: false,
            ride: 'carousel',
            wrap: true,
            touch: true
        });

        heroCarousel.cycle();

        // Keyboard arrow navigation when viewing hero section
        document.addEventListener('keydown', function (e) {
            const heroRect = heroCarouselEl.getBoundingClientRect();
            if (heroRect.top < window.innerHeight && heroRect.bottom > 0) {
                if (e.key === 'ArrowLeft') {
                    heroCarousel.prev();
                } else if (e.key === 'ArrowRight') {
                    heroCarousel.next();
                }
            }
        });

        // Touch swipe gesture detection for mobile devices
        let touchStartX = 0;
        let touchEndX = 0;

        heroCarouselEl.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        heroCarouselEl.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            const swipeThreshold = 45;
            if (touchEndX < touchStartX - swipeThreshold) {
                heroCarousel.next();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                heroCarousel.prev();
            }
        }, { passive: true });
    }
});