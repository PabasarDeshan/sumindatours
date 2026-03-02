// main.js - Functional logic for Sri Lankan Safest Driving

console.log('Script main.js loaded');

const init = () => {
    console.log('DOM ready, initializing...');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            console.log('Mobile menu toggled');
        });

        // Mobile Dropdown Toggle
        document.querySelectorAll('.dropdown > a').forEach(dropdownToggle => {
            dropdownToggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    e.stopPropagation();
                    const parent = dropdownToggle.parentElement;

                    // Close other dropdowns
                    document.querySelectorAll('.dropdown').forEach(d => {
                        if (d !== parent) d.classList.remove('active');
                    });

                    parent.classList.toggle('active');
                    console.log('Mobile dropdown toggled:', parent.classList.contains('active'));
                }
            });
        });
    }

    // Toggle detailed itineraries (Backup logic - inline is primary)
    const seeMoreBtn = document.getElementById('see-more-btn');
    const detailedContainer = document.getElementById('detailed-itineraries-container');

    if (seeMoreBtn && detailedContainer) {
        seeMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            detailedContainer.style.display = 'block';
            seeMoreBtn.style.display = 'none';
            detailedContainer.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Close menu on link click
    document.querySelectorAll('.nav-links a:not(.dropdown > a), .dropdown-menu a').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn?.classList.remove('active');
            navLinks?.classList.remove('active');
        });
    });

    // Sticky Navbar logic
    const header = document.querySelector('.main-header');
    const handleScroll = () => {
        if (window.pageYOffset > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // ── Image Carousel Helper ──────────────────────────────────────────────
    function setupCarousel(trackId, prevBtnId, nextBtnId, dotsNavId) {
        const track = document.getElementById(trackId);
        if (!track) return;

        const items = Array.from(track.children);
        const nextButton = document.getElementById(nextBtnId);
        const prevButton = document.getElementById(prevBtnId);
        const dotsNav = document.getElementById(dotsNavId);

        let currentIndex = 0;
        let autoSlideInterval;

        // Determine if it's a multi-item carousel
        const isMulti = track.classList.contains('tour-carousel-track') || track.classList.contains('multi-carousel-track');

        const getItemsPerPage = () => {
            // For single large image carousel layout
            if (isMulti) return 1;
            return 1;
        };

        const getMaxIndex = () => {
            const itemsPerPage = getItemsPerPage();
            return Math.max(0, items.length - itemsPerPage);
        };

        // Create dots
        const createDots = () => {
            if (!dotsNav) return;
            dotsNav.innerHTML = '';

            // For multi-carousel, we can still have dots for each individual item 
            // but restricted so we don't scroll past the end
            const maxIdx = getMaxIndex();
            const dotCount = isMulti ? maxIdx + 1 : items.length;

            if (dotCount <= 1) return; // No dots needed for single page

            for (let i = 0; i < dotCount; i++) {
                const dot = document.createElement('div');
                dot.classList.add('carousel-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    moveToSlide(i);
                    resetAutoSlide();
                });
                dotsNav.appendChild(dot);
            }
        };

        createDots();
        window.addEventListener('resize', () => {
            createDots();
            moveToSlide(currentIndex); // Re-align on resize
        });

        function updateDots() {
            if (!dotsNav) return;
            const dots = Array.from(dotsNav.children);
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        function moveToSlide(index) {
            const maxIndex = getMaxIndex();
            const itemsPerPage = getItemsPerPage();

            if (index < 0) index = maxIndex;
            else if (index > maxIndex) index = 0;

            const slidePercentage = 100 / itemsPerPage;
            track.style.transform = `translateX(-${index * slidePercentage}%)`;
            currentIndex = index;
            updateDots();
        }

        function startAutoSlide() {
            autoSlideInterval = setInterval(() => {
                moveToSlide(currentIndex + 1);
            }, 5000);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                moveToSlide(currentIndex + 1);
                resetAutoSlide();
            });
        }
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                moveToSlide(currentIndex - 1);
                resetAutoSlide();
            });
        }

        // Pause on Hover
        const container = track.parentElement;
        if (container) {
            container.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
            container.addEventListener('mouseleave', () => startAutoSlide());
        }

        // Initial Start
        startAutoSlide();
    }

    // ── Global Carousel Auto-Initialization ──────────────────────────────
    // This logic automatically finds any carousel track and its controls
    // based on common naming conventions (e.g. prefix-carousel, prefix-prev, etc.)
    const autoDiscoverCarousels = () => {
        const potentialTracks = document.querySelectorAll('[id$="-carousel"], [id$="-track"]');
        potentialTracks.forEach(track => {
            const id = track.id;
            const prefix = id.replace('-carousel', '').replace('-track', '');

            // Avoid duplicate initialization by marking the track
            if (!track.dataset.initialized) {
                console.log(`Auto-initializing carousel: ${id}`);
                setupCarousel(id, `${prefix}-prev`, `${prefix}-next`, `${prefix}-dots`);
                track.dataset.initialized = 'true';
            }
        });
    };

    // Initialize all carousels found on the current page
    autoDiscoverCarousels();

    // ── FAQ Accordion ───────────────────────────────────────────────────
    const accordionItems = document.querySelectorAll('.faq-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.faq-question');
        if (header) {
            header.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');

                // Close all other items for a cleaner accordion effect
                accordionItems.forEach(i => i.classList.remove('active'));

                // Toggle current item
                if (!isOpen) {
                    item.classList.add('active');
                }
            });
        }
    });

    // ── Global Scroll Reveal Animations ──────────────────────────────────
    const revealElements = () => {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Once animated, we can stop observing
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Targeted elements for reveal (Comprehensive list for all pages)
        const elementsToWatch = document.querySelectorAll(
            '.section-title, .service-card, .explore-card, .transfer-content, .transfer-image, .faq-item, .gallery-carousel-wrapper, .villa-card, .registration-flex, .intro-content, .timeline-item, .location-detail, .tour-overview, .about-text-block, .about-highlight, .certificate-container, .registration-header, .about-header, .services-header, .rentals-header, .registration-text-block, .best-places-header, .place-card, .tour-detail-block, .tour-info-content, .contact-heading, .contact-form-card, .contact-info, .reviews-header, .masonry-item, .google-reviews-section, .page-title, .included-section, .price-item, .rental-card, .villa-title-header, .villa-description, .cta-section, .registration-content, .main-review-display, .thumbnail-carousel'
        );

        elementsToWatch.forEach(el => {
            if (el) {
                el.classList.add('reveal', 'reveal-up');
                observer.observe(el);
            }
        });

        // Add staggered delays to children of grids and lists
        const staggeredGrids = '.services-grid, .itineraries-grid, .villas-grid, .best-places-grid, .detailed-itineraries, .masonry-grid, .price-list, .rentals-grid, .amenities-list, .about-list, .route-list, .thumbnail-carousel';
        document.querySelectorAll(staggeredGrids).forEach(grid => {
            const children = grid.children;
            for (let i = 0; i < children.length; i++) {
                children[i].style.transitionDelay = `${(i % 8) * 0.1}s`;
            }
        });
    };

    // Initialize reveal animations
    revealElements();

    console.log('Sri Lankan Safest Driving website fully initialized!');
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
