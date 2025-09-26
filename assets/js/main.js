// AURA Website JavaScript
(function() {
    'use strict';

    // DOM Elements
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        initNavigation();
        initScrollEffects();
        initSmoothScrolling();
        initIntersectionObserver();
        initAnimations();
    });

    // Navigation functionality
    function initNavigation() {
        // Mobile menu toggle
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
                document.body.classList.toggle('nav-open');
            });
        }

        // Close mobile menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('nav-open');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });

        // Handle escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });
    }

    // Scroll effects
    function initScrollEffects() {
        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateNavbar() {
            const scrollY = window.scrollY;

            // Add/remove navbar background
            if (scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide/show navbar on scroll
            if (scrollY > lastScrollY && scrollY > 200) {
                navbar.classList.add('nav-hidden');
            } else {
                navbar.classList.remove('nav-hidden');
            }

            lastScrollY = scrollY;
            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // Smooth scrolling for anchor links
    function initSmoothScrolling() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);

                    if (targetElement) {
                        const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar

                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // Intersection Observer for active nav links and animations
    function initIntersectionObserver() {
        const sections = document.querySelectorAll('section[id]');
        const observerOptions = {
            rootMargin: '-100px 0px -70%',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Update active nav link
                    const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                    if (activeLink) {
                        navLinks.forEach(link => link.classList.remove('active'));
                        activeLink.classList.add('active');
                    }

                    // Trigger animations
                    entry.target.classList.add('in-view');
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Initialize animations
    function initAnimations() {
        // Fade in animations
        const fadeElements = document.querySelectorAll('.person-card, .pillar-card, .commandment-item');

        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';

                    setTimeout(() => {
                        entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);

                    fadeObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        });

        fadeElements.forEach(element => {
            fadeObserver.observe(element);
        });

        // Stagger animations for grids
        animateGrid('.people-grid .person-card', 200);
        animateGrid('.pillars-grid .pillar-card', 150);
    }

    // Animate grid items with stagger
    function animateGrid(selector, staggerDelay) {
        const gridItems = document.querySelectorAll(selector);

        const gridObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const items = Array.from(gridItems);
                    const index = items.indexOf(entry.target);

                    setTimeout(() => {
                        entry.target.style.opacity = '0';
                        entry.target.style.transform = 'translateY(40px)';
                        entry.target.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, 50);
                    }, index * staggerDelay);

                    gridObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        });

        gridItems.forEach(item => {
            gridObserver.observe(item);
        });
    }

    // Parallax effects
    function initParallax() {
        const parallaxElements = document.querySelectorAll('.hero-pattern, .vision-icon');

        function updateParallax() {
            const scrollY = window.scrollY;

            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }

        let ticking = false;
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }

        window.addEventListener('scroll', () => {
            requestTick();
            ticking = false;
        }, { passive: true });
    }

    // Location markers interaction
    function initLocationMarkers() {
        const markers = document.querySelectorAll('.marker');
        const labels = document.querySelectorAll('.location-label');

        markers.forEach((marker, index) => {
            marker.addEventListener('mouseenter', function() {
                if (labels[index]) {
                    labels[index].style.color = '#ffffff';
                    labels[index].style.fontWeight = '600';
                }
            });

            marker.addEventListener('mouseleave', function() {
                if (labels[index]) {
                    labels[index].style.color = '';
                    labels[index].style.fontWeight = '';
                }
            });
        });
    }

    // Performance optimizations
    function initPerformanceOptimizations() {
        // Preload critical images
        const criticalImages = [
            // Add any critical image paths here
        ];

        criticalImages.forEach(imageSrc => {
            const img = new Image();
            img.src = imageSrc;
        });

        // Lazy load non-critical images
        const lazyImages = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        lazyImageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => {
                lazyImageObserver.observe(img);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }

    // Accessibility improvements
    function initAccessibility() {
        // Focus management for mobile menu
        const firstFocusableElement = navMenu.querySelector('.nav-link');
        const lastFocusableElement = navMenu.querySelector('.nav-link:last-child');

        navMenu.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstFocusableElement) {
                    e.preventDefault();
                    lastFocusableElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusableElement) {
                    e.preventDefault();
                    firstFocusableElement.focus();
                }
            }
        });

        // Announce page changes for screen readers
        function announcePageChange(pageName) {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.className = 'sr-only';
            announcement.textContent = `Navigated to ${pageName} section`;
            document.body.appendChild(announcement);

            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 1000);
        }

        // Update page title based on active section
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionName = entry.target.getAttribute('data-section-name') ||
                                      entry.target.querySelector('h1, h2')?.textContent ||
                                      'AURA';
                    document.title = `${sectionName} - AURA`;
                }
            });
        }, {
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        });

        document.querySelectorAll('section[id]').forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // Error handling
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        // Implement error reporting if needed
    });

    // Initialize additional features when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initParallax();
            initLocationMarkers();
            initPerformanceOptimizations();
            initAccessibility();
        });
    } else {
        initParallax();
        initLocationMarkers();
        initPerformanceOptimizations();
        initAccessibility();
    }

    // Expose public API
    window.AURA = {
        version: '1.0.0',
        initNavigation,
        initScrollEffects,
        initSmoothScrolling
    };

})();