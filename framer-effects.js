// ===== Framer-Style Effects =====
// All Framer-like interactions: scroll reveals, magnetic buttons,
// text reveals, parallax, tilt cards, smooth scroll, page transitions

(function() {
  'use strict';

  // Respect reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // =============================================
  // 1. PAGE LOADER / ENTRANCE SEQUENCE
  // =============================================
  function initPageLoader() {
    const loader = document.querySelector('.page-loader');
    if (!loader) return;

    // Hide loader once page is ready
    const hideLoader = () => {
      loader.classList.add('loaded');
      setTimeout(() => {
        loader.style.display = 'none';
        triggerEntranceSequence();
      }, 600);
    };

    if (document.readyState === 'complete') {
      setTimeout(hideLoader, 200);
    } else {
      window.addEventListener('load', () => setTimeout(hideLoader, 200));
    }
  }

  // =============================================
  // 2. ENTRANCE SEQUENCE
  // =============================================
  function triggerEntranceSequence() {
    // Logo entrance
    const logo = document.querySelector('.top-logo, .hero-logo, .hero-title');
    const topLogo = document.querySelector('.top-logo');
    if (topLogo) {
      topLogo.classList.add('entrance-logo');
      setTimeout(() => topLogo.classList.add('entrance-visible'), 100);
    }

    // Main content entrance
    const mainContent = document.querySelector('.hero, .portfolio-work, .work, .about, .contact, .press, .looping-images-section');
    if (mainContent) {
      mainContent.classList.add('entrance-content');
      setTimeout(() => mainContent.classList.add('entrance-visible'), 300);
    }

    // Nav links staggered entrance
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.classList.add('entrance-nav');
      const navLinks = navbar.querySelectorAll('.nav-link');
      navLinks.forEach((link, i) => {
        link.style.transitionDelay = `${0.5 + i * 0.08}s`;
        setTimeout(() => link.classList.add('entrance-visible'), 50);
      });
    }
  }

  // =============================================
  // 3. SCROLL-TRIGGERED REVEAL ANIMATIONS
  // =============================================
  function initScrollReveals() {
    if (prefersReducedMotion) return;

    // Auto-add reveal classes to common elements
    const revealSelectors = [
      '.about-text',
      '.team-member',
      '.contact-content',
      '.contact-form .form-group',
      '.contact-form .btn',
      '.main-video-container',
      '.video-sidebar',
      '.press-header',
      '.work-content'
    ];

    revealSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (!el.classList.contains('reveal')) {
          el.classList.add('reveal');
        }
      });
    });

    // Add stagger to grid containers
    const grids = document.querySelectorAll('.press-grid, .team, .video-sidebar');
    grids.forEach(grid => {
      grid.classList.add('stagger-children');
      Array.from(grid.children).forEach(child => {
        if (!child.classList.contains('reveal')) {
          child.classList.add('reveal');
        }
      });
    });

    // Observe all reveal elements
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      revealObserver.observe(el);
    });
  }

  // =============================================
  // 4. TEXT REVEAL ANIMATIONS
  // =============================================
  function initTextReveals() {
    if (prefersReducedMotion) return;

    // Apply to headings on non-homepage pages
    const headings = document.querySelectorAll('.press-title, .press-subtitle');

    headings.forEach(heading => {
      const text = heading.textContent;
      const words = text.split(' ');
      heading.textContent = '';
      heading.style.overflow = 'hidden';

      words.forEach((word, i) => {
        const wrapper = document.createElement('span');
        wrapper.className = 'text-reveal-word';
        wrapper.style.transitionDelay = `${i * 0.06}s`;

        const inner = document.createElement('span');
        inner.className = 'text-reveal-word-inner';
        inner.textContent = word;

        wrapper.appendChild(inner);
        heading.appendChild(wrapper);

        // Add space between words
        if (i < words.length - 1) {
          const space = document.createTextNode('\u00A0');
          heading.appendChild(space);
        }
      });
    });

    // Observe text reveals
    const textObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.text-reveal-word').forEach(word => {
            word.classList.add('reveal-visible');
          });
          textObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.press-title, .press-subtitle').forEach(el => {
      textObserver.observe(el);
    });
  }

  // =============================================
  // 5. MAGNETIC HOVER EFFECT
  // =============================================
  function initMagneticButtons() {
    if (prefersReducedMotion) return;

    const magneticElements = document.querySelectorAll(
      '.fun-button, .carousel-arrow, .contact-form .btn, .press-arrow, .top-logo-link, .filter-btn, .video-overlay-close, .lightbox-close'
    );

    magneticElements.forEach(el => {
      el.classList.add('magnetic');

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Magnetic pull strength
        const strength = 0.3;
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  // =============================================
  // 6. CARD TILT / 3D HOVER
  // =============================================
  function initCardTilt() {
    if (prefersReducedMotion) return;

    const cards = document.querySelectorAll('.press-card, .sidebar-video-item');

    cards.forEach(card => {
      card.classList.add('tilt-card');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const tiltX = (y - 0.5) * -10; // degrees
        const tiltY = (x - 0.5) * 10;

        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => {
          card.style.transition = '';
        }, 500);
      });
    });
  }

  // =============================================
  // 7. SMOOTH SCROLL (LENIS-STYLE LERP)
  // =============================================
  function initSmoothScroll() {
    if (prefersReducedMotion) return;

    // Skip on portfolio page (overflow: hidden)
    if (document.body.classList.contains('portfolio-page')) return;

    // Simple lerp-based smooth scroll
    let currentScroll = window.scrollY;
    let targetScroll = window.scrollY;
    let scrolling = false;
    const ease = 0.08;

    // Override native scroll behavior
    document.documentElement.style.scrollBehavior = 'auto';

    window.addEventListener('scroll', () => {
      targetScroll = window.scrollY;
      if (!scrolling) {
        scrolling = true;
        smoothScrollLoop();
      }
    }, { passive: true });

    function smoothScrollLoop() {
      currentScroll += (targetScroll - currentScroll) * ease;

      if (Math.abs(targetScroll - currentScroll) < 0.5) {
        currentScroll = targetScroll;
        scrolling = false;
      }

      // Apply transform-based smooth scroll to content
      const scrollContent = document.querySelector('body');
      if (scrollContent) {
        // Use CSS variable for parallax elements to reference
        document.documentElement.style.setProperty('--scroll-y', currentScroll + 'px');
      }

      if (scrolling) {
        requestAnimationFrame(smoothScrollLoop);
      }
    }
  }

  // =============================================
  // 8. PARALLAX ON SCROLL
  // =============================================
  function initParallax() {
    if (prefersReducedMotion) return;
    if (document.body.classList.contains('portfolio-page')) return;

    const parallaxElements = [];

    // Hero logo parallax
    const heroLogo = document.querySelector('.hero-logo');
    if (heroLogo) {
      parallaxElements.push({ el: heroLogo, speed: 0.3 });
    }

    // Hero title parallax (slight)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      parallaxElements.push({ el: heroTitle, speed: 0.15 });
    }

    // Top logo subtle parallax
    const topLogo = document.querySelector('.top-logo');
    if (topLogo) {
      parallaxElements.push({ el: topLogo, speed: 0.05 });
    }

    if (parallaxElements.length === 0) return;

    let ticking = false;

    function updateParallax() {
      const scrollY = window.scrollY;

      parallaxElements.forEach(({ el, speed }) => {
        const rect = el.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        const offset = (scrollY - elementTop) * speed;

        // Only apply if element is near viewport
        if (rect.top < window.innerHeight + 200 && rect.bottom > -200) {
          el.style.transform = `translateY(${offset}px)`;
        }
      });

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // =============================================
  // 9. ANIMATED GRADIENT BACKGROUND
  // =============================================
  function initGradientBackground() {
    // Don't add on portfolio page
    if (document.body.classList.contains('portfolio-page')) return;

    const bg = document.createElement('div');
    bg.className = 'gradient-bg';
    bg.setAttribute('aria-hidden', 'true');

    bg.innerHTML = `
      <div class="gradient-blob gradient-blob-1"></div>
      <div class="gradient-blob gradient-blob-2"></div>
      <div class="gradient-blob gradient-blob-3"></div>
    `;

    document.body.insertBefore(bg, document.body.firstChild);
  }

  // =============================================
  // 10. ENHANCED HOVER MICRO-INTERACTIONS
  // =============================================
  function initMicroInteractions() {
    // Add hover lift to buttons
    document.querySelectorAll('.fun-button, .contact-form .btn, .filter-btn, .carousel-arrow').forEach(btn => {
      btn.classList.add('btn-hover-lift');
    });

    // Add underline slide to nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.add('link-hover-slide');
    });

    // Add focus line animation to form groups
    document.querySelectorAll('.form-group').forEach(group => {
      group.classList.add('form-focus-line');
    });
  }

  // =============================================
  // 11. SMOOTH PAGE TRANSITIONS
  // =============================================
  function initPageTransitions() {
    if (prefersReducedMotion) return;

    // Use View Transitions API if available
    if (!document.startViewTransition) {
      // Fallback: simple fade transition
      initFallbackTransitions();
      return;
    }

    // Intercept navigation links for smooth transitions
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');

      // Only handle internal navigation links
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || link.target === '_blank') {
        return;
      }

      link.addEventListener('click', (e) => {
        e.preventDefault();

        document.startViewTransition(() => {
          window.location.href = href;
        });
      });
    });
  }

  function initFallbackTransitions() {
    // Simple CSS-based page transition fallback
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');

      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || link.target === '_blank') {
        return;
      }

      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.style.opacity = '0';
        document.body.style.transform = 'translateY(-10px)';
        document.body.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

        setTimeout(() => {
          window.location.href = href;
        }, 250);
      });
    });

    // Fade in on page load
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(10px)';
    requestAnimationFrame(() => {
      document.body.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      document.body.style.opacity = '1';
      document.body.style.transform = 'translateY(0)';
    });
  }

  // =============================================
  // 12. STAGGERED GRID ANIMATIONS (via scroll)
  // =============================================
  // Already handled in initScrollReveals with .stagger-children

  // =============================================
  // INITIALIZE EVERYTHING
  // =============================================
  function init() {
    initPageLoader();
    initGradientBackground();
    initMicroInteractions();
    initMagneticButtons();
    initCardTilt();
    initPageTransitions();

    // These need DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initScrollReveals();
        initTextReveals();
        initParallax();
        initSmoothScroll();
      });
    } else {
      initScrollReveals();
      initTextReveals();
      initParallax();
      initSmoothScroll();
    }
  }

  // If no loader, trigger entrance directly after small delay
  if (!document.querySelector('.page-loader')) {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(triggerEntranceSequence, 100);
    });
  }

  init();
})();
