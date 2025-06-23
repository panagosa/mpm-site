// ===== Custom Cursor =====
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Smooth cursor animation
function animateCursor() {
  // Main cursor
  cursorX += (mouseX - cursorX) * 0.5;
  cursorY += (mouseY - cursorY) * 0.5;
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  
  // Follower
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top = followerY + 'px';
  
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hide cursor when leaving window
document.addEventListener('mouseout', (e) => {
  if (!e.relatedTarget) {
    cursor.style.opacity = '0';
    cursorFollower.style.opacity = '0';
  }
});

document.addEventListener('mouseover', () => {
  cursor.style.opacity = '1';
  cursorFollower.style.opacity = '1';
});

// ===== Loading Animation =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelector('.loader').classList.add('loaded');
    // Start animations after loader
    initAnimations();
  }, 2000);
});

// ===== Navigation =====
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Sticky navigation
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  // Hide/show navbar on scroll
  if (currentScroll > lastScroll && currentScroll > 500) {
    navbar.style.transform = 'translateY(-100%)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }
  
  lastScroll = currentScroll;
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  navToggle.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
  });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===== Parallax Effects =====
function initParallax() {
  const parallaxElements = document.querySelectorAll('.gradient-orb, .floating-element');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach((element, index) => {
      const speed = 0.5 + (index * 0.1);
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  });
}

// ===== Intersection Observer for Animations =====
function initAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        
        // Counter animation for metrics
        if (entry.target.classList.contains('metric-value')) {
          animateCounter(entry.target);
        }
        
        // Client logo animation
        if (entry.target.classList.contains('client-logo')) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      }
    });
  }, observerOptions);
  
  // Observe elements
  document.querySelectorAll('.service-card, .case-item, .value-item, .team-member, .metric-value').forEach(el => {
    observer.observe(el);
  });
  
  // Also observe client logos
  document.querySelectorAll('.client-logo').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });
}

// ===== Counter Animation =====
function animateCounter(element) {
  const target = parseFloat(element.getAttribute('data-count'));
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;
  
  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target % 1 === 0 ? target : target.toFixed(1);
    }
  };
  
  updateCounter();
}

// ===== Horizontal Scroll for Case Studies =====
const casesWrapper = document.querySelector('.cases-wrapper');
const casesContainer = document.querySelector('.cases-container');

if (casesWrapper && casesContainer) {
  let isDown = false;
  let startX;
  let scrollLeft;
  
  casesWrapper.addEventListener('mousedown', (e) => {
    isDown = true;
    casesWrapper.classList.add('active');
    startX = e.pageX - casesWrapper.offsetLeft;
    scrollLeft = casesWrapper.scrollLeft;
  });
  
  casesWrapper.addEventListener('mouseleave', () => {
    isDown = false;
    casesWrapper.classList.remove('active');
  });
  
  casesWrapper.addEventListener('mouseup', () => {
    isDown = false;
    casesWrapper.classList.remove('active');
  });
  
  casesWrapper.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - casesWrapper.offsetLeft;
    const walk = (x - startX) * 2;
    casesWrapper.scrollLeft = scrollLeft - walk;
  });
  
  // Touch support
  let touchStartX = 0;
  
  casesWrapper.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  });
  
  casesWrapper.addEventListener('touchmove', (e) => {
    const touchEndX = e.touches[0].clientX;
    const diff = touchStartX - touchEndX;
    casesWrapper.scrollLeft += diff;
    touchStartX = touchEndX;
  });
}

// ===== Form Handling =====
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Add loading state
    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
      submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
      submitBtn.style.background = 'var(--gradient-primary)';
      
      // Reset form
      setTimeout(() => {
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
      }, 3000);
    }, 2000);
  });
}

// ===== Magnetic Buttons =====
document.querySelectorAll('.btn, .social-link').forEach(button => {
  button.addEventListener('mousemove', (e) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translate(0, 0)';
  });
});

// ===== Tilt Effect for Cards =====
document.querySelectorAll('.service-card, .case-item').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
  });
});

// ===== Smooth Reveal Animations =====
const revealElements = document.querySelectorAll('.section-header, .about-text, .contact-content > p');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, {
  threshold: 0.1
});

revealElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'all 0.8s ease';
  revealObserver.observe(el);
});

// ===== Background Animation =====
function animateBackground() {
  const gridPattern = document.querySelector('.grid-pattern');
  if (gridPattern) {
    let offset = 0;
    setInterval(() => {
      offset += 0.5;
      gridPattern.style.transform = `translate(${offset}px, ${offset}px)`;
      if (offset >= 50) offset = 0;
    }, 50);
  }
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
  initParallax();
  animateBackground();
  
  // Add CSS classes for animations
  const style = document.createElement('style');
  style.textContent = `
    .service-card, .case-item, .value-item, .team-member {
      opacity: 0;
      transform: translateY(50px);
      transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .service-card.animate, .case-item.animate, .value-item.animate, .team-member.animate {
      opacity: 1;
      transform: translateY(0);
    }
    
    .service-card:nth-child(1) { transition-delay: 0s; }
    .service-card:nth-child(2) { transition-delay: 0.1s; }
    .service-card:nth-child(3) { transition-delay: 0.2s; }
    .service-card:nth-child(4) { transition-delay: 0.3s; }
    .service-card:nth-child(5) { transition-delay: 0.4s; }
    
    .value-item:nth-child(1) { transition-delay: 0s; }
    .value-item:nth-child(2) { transition-delay: 0.1s; }
    .value-item:nth-child(3) { transition-delay: 0.2s; }
    .value-item:nth-child(4) { transition-delay: 0.3s; }
    
    .cases-wrapper.active {
      cursor: grabbing;
    }
    
    .cases-wrapper {
      cursor: grab;
    }
  `;
  document.head.appendChild(style);
});

// ===== Performance Optimization =====
// Debounce function for scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Optimize scroll events
const optimizedScroll = debounce(() => {
  // Scroll-based animations
}, 10);

window.addEventListener('scroll', optimizedScroll);

// ===== Easter Egg: Konami Code =====
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      activateEasterEgg();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

function activateEasterEgg() {
  document.body.style.animation = 'rainbow 3s linear infinite';
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rainbow {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
  
  setTimeout(() => {
    document.body.style.animation = '';
  }, 5000);
} 