// ===== Custom Cursor with Text Interaction =====
const cursor = document.createElement('div');
cursor.className = 'cursor';
document.body.appendChild(cursor);

const cursorDot = document.createElement('div');
cursorDot.className = 'cursor-dot';
document.body.appendChild(cursorDot);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

// Smooth cursor follow
function animateCursor() {
  const dx = mouseX - cursorX;
  const dy = mouseY - cursorY;
  
  cursorX += dx * 0.15;
  cursorY += dy * 0.15;
  
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effects on interactive elements
const interactiveElements = document.querySelectorAll('a, button, .hero-title span, .nav-link, .contact-item');
interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hover');
  });
  
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover');
  });
});

// Split hero title text into individual letters
const heroTitleContainer = document.querySelector('.hero-title span');
if (heroTitleContainer) {
  const text = heroTitleContainer.textContent;
  heroTitleContainer.textContent = '';
  
  text.split('').forEach((char, index) => {
    const letterSpan = document.createElement('span');
    letterSpan.className = 'letter';
    letterSpan.textContent = char === ' ' ? '\u00A0' : char;
    if (char === ' ') {
      letterSpan.classList.add('space');
    }
    heroTitleContainer.appendChild(letterSpan);
  });
  
  // Individual letter movement based on cursor
  const letters = heroTitleContainer.querySelectorAll('.letter');
  const heroSection = document.querySelector('.hero-title');
  
  // Use requestAnimationFrame for smooth updates
  let animationFrameId = null;
  let targetLifts = new Map();
  
  document.addEventListener('mousemove', (e) => {
    if (heroSection) {
      const rect = heroSection.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      // Calculate target lifts for each letter
      letters.forEach((letter) => {
        const letterRect = letter.getBoundingClientRect();
        const letterCenterX = letterRect.left + letterRect.width / 2;
        const letterCenterY = letterRect.top + letterRect.height / 2;
        
        // Calculate distance from cursor to letter center
        const deltaX = mouseX - letterCenterX;
        const deltaY = mouseY - letterCenterY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Maximum effect distance (adjust for sensitivity)
        const maxDistance = 150;
        
        // Calculate how much to lift the letter (closer = more lift)
        const liftAmount = Math.max(0, (maxDistance - distance) / maxDistance);
        const lift = liftAmount * -30; // Maximum lift of 30px
        
        targetLifts.set(letter, lift);
      });
      
      // Smooth animation using requestAnimationFrame
      if (!animationFrameId) {
        const animate = () => {
          letters.forEach((letter) => {
            const targetLift = targetLifts.get(letter) || 0;
            const currentTransform = letter.style.transform;
            const currentMatch = currentTransform.match(/translateY\(([-\d.]+)px\)/);
            const currentLift = currentMatch ? parseFloat(currentMatch[1]) : 0;
            
            // Smooth interpolation
            const newLift = currentLift + (targetLift - currentLift) * 0.15;
            
            if (Math.abs(newLift - targetLift) > 0.1) {
              letter.style.transform = `translateY(${newLift}px)`;
              animationFrameId = requestAnimationFrame(animate);
            } else {
              letter.style.transform = `translateY(${targetLift}px)`;
            }
          });
          
          if (Array.from(targetLifts.values()).some(lift => Math.abs(lift) > 0.1)) {
            animationFrameId = requestAnimationFrame(animate);
          } else {
            animationFrameId = null;
          }
        };
        animationFrameId = requestAnimationFrame(animate);
      }
    }
  });
  
  // Reset letters when mouse leaves the hero area
  heroSection.addEventListener('mouseleave', () => {
    letters.forEach(letter => {
      targetLifts.set(letter, 0);
      letter.style.transform = 'translateY(0px)';
    });
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  });
}

// ===== Video Click to Play =====
const videos = document.querySelectorAll('video');

videos.forEach(video => {
  video.addEventListener('click', () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });
});

// ===== Flashcard-Style Video Carousel =====
const workGrid = document.querySelector('.work-grid');
const prevArrow = document.querySelector('.carousel-arrow-prev');
const nextArrow = document.querySelector('.carousel-arrow-next');

if (workGrid && prevArrow && nextArrow) {
  const workItems = workGrid.querySelectorAll('.work-item');
  let currentIndex = 0;
  let isTransitioning = false;

  // Pause any playing videos when switching
  function pauseAllVideos() {
    workItems.forEach(item => {
      const video = item.querySelector('video');
      if (video) {
        video.pause();
      }
    });
  }

  function updateCarousel() {
    // Remove active class from all items
    workItems.forEach((item, index) => {
      item.classList.remove('active');
    });

    // Add active class to current item
    if (workItems[currentIndex]) {
      workItems[currentIndex].classList.add('active');
    }

    // Update arrow states
    prevArrow.classList.toggle('disabled', currentIndex === 0);
    nextArrow.classList.toggle('disabled', currentIndex === workItems.length - 1);
    
    isTransitioning = false;
  }

  function goToNext() {
    if (isTransitioning) return;
    if (currentIndex < workItems.length - 1) {
      isTransitioning = true;
      pauseAllVideos();
      currentIndex++;
      updateCarousel();
    }
  }

  function goToPrev() {
    if (isTransitioning) return;
    if (currentIndex > 0) {
      isTransitioning = true;
      pauseAllVideos();
      currentIndex--;
      updateCarousel();
    }
  }

  // Arrow click handlers
  nextArrow.addEventListener('click', goToNext);
  prevArrow.addEventListener('click', goToPrev);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (workItems.length === 0 || isTransitioning) return;
    
    // Only handle if work section is visible
    const activeItem = workGrid.querySelector('.work-item.active');
    if (!activeItem) return;
    
    const rect = activeItem.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (!isVisible) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      goToNext();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      goToPrev();
    }
  });

  // Initialize carousel
  updateCarousel();
}

// ===== Navigation =====
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar at bottom - scroll behavior not needed
// Navbar background uses CSS variable, no need to update here

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offsetTop = target.offsetTop;
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
    const isActive = navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isActive);
  });

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
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
// Konami code for extra wildness
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
let konamiIndex = 0;

document.addEventListener('keydown', function(e) {
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