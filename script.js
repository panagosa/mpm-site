// ===== Logo Bounce and Roll Animation =====
const logoImg = document.querySelector('.logo-img');

if (logoImg) {
  logoImg.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Remove the animation class if it exists (to allow re-triggering)
    logoImg.classList.remove('bounce-roll');
    
    // Force a reflow to restart the animation
    void logoImg.offsetWidth;
    
    // Add the animation class
    logoImg.classList.add('bounce-roll');
    
    // Remove the class after animation completes
    setTimeout(() => {
      logoImg.classList.remove('bounce-roll');
    }, 2000);
  });
}

// ===== Lazy Loading for Images and Videos =====
const lazyLoadObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const element = entry.target;
      
      if (element.tagName === 'IMG') {
        element.src = element.dataset.src || element.src;
        element.classList.remove('lazy');
      } else if (element.tagName === 'VIDEO') {
        element.load();
        element.classList.remove('lazy');
      }
      
      lazyLoadObserver.unobserve(element);
    }
  });
}, {
  rootMargin: '50px 0px',
  threshold: 0.1
});

// Observe lazy-loaded elements
document.addEventListener('DOMContentLoaded', () => {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const lazyVideos = document.querySelectorAll('video[loading="lazy"]');
  
  [...lazyImages, ...lazyVideos].forEach(element => {
    lazyLoadObserver.observe(element);
  });
});

// ===== Video Performance Optimization =====
const videos = document.querySelectorAll('video');

videos.forEach(video => {
  // Add loading state
  video.addEventListener('loadstart', () => {
    video.style.opacity = '0.7';
  });
  
  video.addEventListener('canplay', () => {
    video.style.opacity = '1';
  });
  
  // Click to play/pause
  video.addEventListener('click', () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });
  
  // Pause video when not in viewport
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting && !video.paused) {
        video.pause();
      }
    });
  }, { threshold: 0.5 });
  
  videoObserver.observe(video);
});

// ===== Auto-Scrolling Carousel =====
const workGrid = document.querySelector('.work-grid');

if (workGrid) {
  let scrollSpeed = 1.5625; // 50% faster total (1.25 * 1.25 = 1.5625 pixels per frame)
  let isUserInteracting = false;
  let animationId;

  function autoScroll() {
    if (!isUserInteracting) {
      workGrid.scrollLeft += scrollSpeed;
      
      // When we reach the middle point (end of first set), reset to start
      // This creates a seamless infinite loop
      const itemWidth = 600; // Width of one item + gap
      const totalItems = 5; // Number of unique items
      const resetPoint = itemWidth * totalItems;
      
      if (workGrid.scrollLeft >= resetPoint) {
        workGrid.scrollLeft = 0;
      }
    }
    
    animationId = requestAnimationFrame(autoScroll);
  }

  // Start auto-scroll
  autoScroll();

  // Pause auto-scroll on hover
  workGrid.addEventListener('mouseenter', () => {
    isUserInteracting = true;
  });

  workGrid.addEventListener('mouseleave', () => {
    isUserInteracting = false;
  });

  // Add touch/drag scrolling support
  let isDown = false;
  let startX;
  let scrollLeftStart;

  workGrid.addEventListener('mousedown', (e) => {
    isDown = true;
    isUserInteracting = true;
    startX = e.pageX - workGrid.offsetLeft;
    scrollLeftStart = workGrid.scrollLeft;
    workGrid.style.cursor = 'default';
  });

  workGrid.addEventListener('mouseleave', () => {
    if (isDown) {
      isDown = false;
      workGrid.style.cursor = 'default';
      setTimeout(() => {
        isUserInteracting = false;
      }, 1000);
    }
  });

  workGrid.addEventListener('mouseup', () => {
    isDown = false;
    workGrid.style.cursor = 'default';
    setTimeout(() => {
      isUserInteracting = false;
    }, 1000);
  });

  workGrid.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - workGrid.offsetLeft;
    const walk = (x - startX) * 2;
    workGrid.scrollLeft = scrollLeftStart - walk;
  });

  // Mobile touch interactions
  let touchStartTime = 0;
  let touchStartX = 0;
  let touchStartY = 0;
  let isTouchScrolling = false;

  workGrid.addEventListener('touchstart', (e) => {
    isUserInteracting = true;
    isTouchScrolling = true;
    touchStartTime = Date.now();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  workGrid.addEventListener('touchmove', (e) => {
    if (!isTouchScrolling) return;
    
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const deltaX = Math.abs(touchStartX - touchX);
    const deltaY = Math.abs(touchStartY - touchY);
    
    // If user is scrolling horizontally, keep auto-scroll paused
    if (deltaX > deltaY) {
      isUserInteracting = true;
    }
  }, { passive: true });

  workGrid.addEventListener('touchend', () => {
    const touchDuration = Date.now() - touchStartTime;
    
    // If it was a quick tap (less than 200ms), resume auto-scroll quickly
    if (touchDuration < 200) {
      setTimeout(() => {
        isUserInteracting = false;
        isTouchScrolling = false;
      }, 500);
    } else {
      // If it was a longer interaction, wait longer before resuming
      setTimeout(() => {
        isUserInteracting = false;
        isTouchScrolling = false;
      }, 1500);
    }
  }, { passive: true });

  // Ensure auto-scroll works on mobile by checking if it's still running
  setInterval(() => {
    if (!isUserInteracting && !isTouchScrolling && !animationId) {
      autoScroll();
    }
  }, 100);
}

// ===== Navigation =====
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');

// Sticky navigation
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
  } else {
    navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offsetTop = target.offsetTop - 70; // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// ===== Form Handling =====
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Collect field values
    const name = document.querySelector('#name').value.trim();
    const email = document.querySelector('#email').value.trim();
    const company = document.querySelector('#company').value.trim();
    const message = document.querySelector('#message').value.trim();

    // Prepare UI state (loading)
    const submitBtn = contactForm.querySelector('.btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Endpoint provided by FormSubmit for AJAX submissions
    const endpoint = 'https://formsubmit.co/ajax/info@deadpanmedia.com';

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        company,
        message,
        _subject: `New Project Inquiry from ${name || 'Website Visitor'}`,
        _captcha: false
      })
    })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(() => {
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.backgroundColor = '#28a745';
        contactForm.reset();
      })
      .catch(() => {
        submitBtn.textContent = 'Error! Try Again';
        submitBtn.style.backgroundColor = '#dc3545';
      })
      .finally(() => {
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.backgroundColor = '';
        }, 3000);
      });
  });
}

// ===== Simple Scroll Animations =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe elements for simple fade-in animation
document.addEventListener('DOMContentLoaded', () => {
  const animateElements = document.querySelectorAll('.work-item, .team-member, .about-text, .contact-info');
  
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});

// ===== Mobile Menu Toggle =====
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close mobile menu on outside click
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// ===== Neon Wild Mode Toggle =====
let isWildMode = false;

function triggerWildMode() {
  const button = document.querySelector('.fun-button');
  const floatingHire = document.getElementById('floating-hire');
  
  if (!isWildMode) {
    // Enter wild mode
    document.body.classList.add('wild-mode');
    button.textContent = 'PRESS THIS BUTTON';
    floatingHire.style.display = 'block';
    isWildMode = true;
  } else {
    // Exit wild mode
    document.body.classList.remove('wild-mode');
    button.textContent = 'DO NOT PRESS THIS BUTTON';
    floatingHire.style.display = 'none';
    isWildMode = false;
  }
}

// Add some extra wild effects
document.addEventListener('keydown', function(e) {
  // Konami code for extra wildness
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
  let konamiIndex = 0;
  
  if (e.code === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      triggerWildMode();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});