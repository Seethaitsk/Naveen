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

    // CTA Form Submission Handling via Web3Forms
    const ctaForm = document.getElementById('ctaForm');
    const formResult = document.getElementById('formResult');
    const submitBtn = document.getElementById('submitBtn');

    if (ctaForm) {
        ctaForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = new FormData(ctaForm);
            const accessKey = formData.get('access_key');

            // Quick check if access key has been replaced
            if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
                if (formResult) {
                    formResult.className = 'mt-3 p-3 rounded-3 text-center small bg-warning text-dark d-block';
                    formResult.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i>Please add your Web3Forms <strong>Access Key</strong> in <code>index.html</code> (line ~1089).';
                }
                return;
            }

            // Set loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> <span>Sending Request...</span>';
            }
            if (formResult) {
                formResult.className = 'mt-3 p-3 rounded-3 text-center small bg-dark text-white-50 border border-secondary d-block';
                formResult.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Submitting your request...';
            }

            try {
                const object = Object.fromEntries(formData);
                const json = JSON.stringify(object);

                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                });

                const data = await response.json();

                if (response.status === 200 && data.success) {
                    if (formResult) {
                        formResult.className = 'mt-3 p-3 rounded-3 text-center small bg-success bg-opacity-25 text-white border border-success d-block';
                        formResult.innerHTML = '<i class="fas fa-check-circle text-warning me-2"></i><strong>Thank you!</strong> Your consultation request has been sent successfully. I will get back to you within 24 hours.';
                    }
                    ctaForm.reset();
                } else {
                    let errorMsg = data.message || 'Submission failed. Please try again.';
                    if (window.location.protocol === 'file:') {
                        errorMsg += ' (Web3Forms requires running on a local server like Live Server or http://localhost, not directly as file://)';
                    }
                    throw new Error(errorMsg);
                }
            } catch (error) {
                if (formResult) {
                    formResult.className = 'mt-3 p-3 rounded-3 text-center small bg-danger bg-opacity-25 text-white border border-danger d-block';
                    formResult.innerHTML = `<i class="fas fa-times-circle text-danger me-2"></i><strong>Oops!</strong> ${error.message || 'Something went wrong. Please try again later.'}`;
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span class="btn-text">Request Free Consultation</span> <i class="fas fa-arrow-right btn-icon"></i>';
                }
            }
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