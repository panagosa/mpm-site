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

// ===== Enhanced Logo Animations with Motion-like Effects =====
// Smooth animation utility using easing functions
function animateElement(element, keyframes, options = {}) {
  if (!element) return;
  
  const defaultOptions = {
    duration: 600,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    fill: 'forwards'
  };
  
  return element.animate(keyframes, { ...defaultOptions, ...options });
}

// Initial entrance animation for logos (no spin)
function setupLogoEntrance(logoElement) {
  if (!logoElement) return;
  
  // Set initial state
  logoElement.style.opacity = '0';
  logoElement.style.transform = 'scale(0.8)';
  
  // Animate entrance (scale only, no spin)
  const animation = animateElement(
    logoElement,
    [
      { opacity: 0, transform: 'scale(0.8)' },
      { opacity: 1, transform: 'scale(1)' }
    ],
    { duration: 800, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
  );
  
  animation.onfinish = () => {
    logoElement.style.opacity = '';
    logoElement.style.transform = '';
  };
}

// Enhanced hover animation with smooth scale and 360° rotation
// Triggers on touch - animation completes even if cursor leaves
function setupLogoHover(logoElement) {
  if (!logoElement) return;
  
  // Track if hover animation is active
  logoElement.dataset.hoverAnimating = 'false';
  let isSpinning = false;
  let animationEndHandler = null;
  
  logoElement.addEventListener('mouseenter', () => {
    // Don't trigger if already spinning
    if (isSpinning) return;
    
    isSpinning = true;
    logoElement.dataset.hoverAnimating = 'true';
    
    // Store current transform to restore after spin
    const currentTransform = logoElement.style.transform || '';
    const translateYMatch = currentTransform.match(/translateY\(([-\d.]+)px\)/);
    const currentLift = translateYMatch ? parseFloat(translateYMatch[1]) : 0;
    
    // Store the current lift value in data attribute for bounce to use later
    logoElement.dataset.storedLift = currentLift;
    
    // Clear transform so CSS animation can work (but preserve translateY in data)
    logoElement.style.transform = '';
    logoElement.style.transition = 'none'; // Disable transitions during spin
    
    // Add the spin animation class
    logoElement.classList.add('logo-spin-hover');
    
    // Set up animation end handler to clean up when animation completes
    animationEndHandler = (e) => {
      // Only handle logoSpin animation end
      if (e.animationName !== 'logoSpin') return;
      
      logoElement.dataset.hoverAnimating = 'false';
      logoElement.classList.remove('logo-spin-hover');
      logoElement.style.transition = ''; // Re-enable transitions
      isSpinning = false;
      
      // Restore the bounce position (translateY) after spin
      const storedLift = parseFloat(logoElement.dataset.storedLift) || 0;
      logoElement.style.transform = `translateY(${storedLift}px)`;
      
      // Remove the event listener after use
      logoElement.removeEventListener('animationend', animationEndHandler);
      animationEndHandler = null;
    };
    
    // Listen for animation end
    logoElement.addEventListener('animationend', animationEndHandler);
  });
  
  // Mouse leave doesn't stop the animation - it will complete on its own
  logoElement.addEventListener('mouseleave', () => {
    // Animation will complete and handler will restore bounce position
  });
}

// Function to apply bounce animation to a logo element (same as hero title letters)
function setupLogoBounce(logoElement) {
  if (!logoElement) return;
  
  let animationFrameId = null;
  let targetLift = 0;
  let storedLift = 0; // Store lift value during hover
  
  // Continuous animation loop that respects hover state
  const animate = () => {
    // Skip bounce animation if hover animation is active
    if (logoElement.dataset.hoverAnimating === 'true') {
      animationFrameId = requestAnimationFrame(animate);
      return;
    }
    
    const currentTransform = logoElement.style.transform || '';
    // Check if transform is being controlled by CSS animation (spin)
    const hasSpinClass = logoElement.classList.contains('logo-spin-hover');
    
    if (hasSpinClass) {
      // During spin, just continue the loop
      animationFrameId = requestAnimationFrame(animate);
      return;
    }
    
    const currentMatch = currentTransform.match(/translateY\(([-\d.]+)px\)/);
    const currentLift = currentMatch ? parseFloat(currentMatch[1]) : storedLift;
    
    // Smooth interpolation (same as letters)
    const newLift = currentLift + (targetLift - currentLift) * 0.15;
    
    if (Math.abs(newLift - targetLift) > 0.1) {
      logoElement.style.transform = `translateY(${newLift}px)`;
      animationFrameId = requestAnimationFrame(animate);
    } else {
      logoElement.style.transform = `translateY(${targetLift}px)`;
      storedLift = targetLift;
      if (Math.abs(targetLift) > 0.1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        animationFrameId = requestAnimationFrame(animate); // Continue loop
      }
    }
  };
  
  // Start the animation loop
  animationFrameId = requestAnimationFrame(animate);
  
  document.addEventListener('mousemove', (e) => {
    // Always calculate target lift, even during hover (for after hover ends)
    
    const logoRect = logoElement.getBoundingClientRect();
    const logoCenterX = logoRect.left + logoRect.width / 2;
    const logoCenterY = logoRect.top + logoRect.height / 2;
    
    // Calculate distance from cursor to logo center
    const deltaX = e.clientX - logoCenterX;
    const deltaY = e.clientY - logoCenterY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Maximum effect distance (same as hero title letters)
    const maxDistance = 150;
    
    // Calculate how much to lift the logo (closer = more lift, same as letters)
    const liftAmount = Math.max(0, (maxDistance - distance) / maxDistance);
    const lift = liftAmount * -30; // Maximum lift of 30px (same as letters)
    
    targetLift = lift;
  });
  
  // Reset logo when mouse leaves the logo area (same as letters)
  logoElement.addEventListener('mouseleave', () => {
    targetLift = 0;
    storedLift = 0;
    // Only reset transform if not spinning
    if (logoElement.dataset.hoverAnimating !== 'true') {
      logoElement.style.transform = 'translateY(0px)';
    }
  });
  
  // Resume bounce after spin completes
  logoElement.addEventListener('animationend', (e) => {
    if (e.animationName === 'logoSpin') {
      // Restore bounce position after spin
      if (targetLift !== 0) {
        logoElement.style.transform = `translateY(${targetLift}px)`;
        storedLift = targetLift;
      } else {
        logoElement.style.transform = 'translateY(0px)';
        storedLift = 0;
      }
    }
  });
}

// Apply animations to all logo elements
document.addEventListener('DOMContentLoaded', () => {
  const navLogo = document.querySelector('.nav-logo');
  const logoImg = document.querySelector('.logo-img');
  const heroLogo = document.querySelector('.hero-logo');
  const topLogoImg = document.querySelector('.top-logo-img');
  
  // Entrance animations removed - logos appear immediately
  if (heroLogo) {
    setupLogoHover(heroLogo);
  }
  if (logoImg) {
    setupLogoHover(logoImg);
  }
  if (topLogoImg) {
    setupLogoHover(topLogoImg);
  }
  if (navLogo) {
    setupLogoHover(navLogo); // Add hover spin to nav logo
  }
});

// ===== Video Click to Play =====
// Only add click handlers for videos without native controls
// Videos with controls will use their native play/pause buttons
const videos = document.querySelectorAll('video');

videos.forEach(video => {
  // Only add click-to-play for videos without controls
  // Videos with controls already have play/pause functionality
  if (!video.hasAttribute('controls')) {
    video.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent event bubbling
      if (video.paused) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }
  // Videos with controls: native controls handle play/pause, no custom handler needed
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
  // Create backdrop element
  let backdrop = document.querySelector('.nav-menu-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-menu-backdrop';
    document.body.appendChild(backdrop);
  }
  
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isActive);
    backdrop.classList.toggle('active');
  });
  
  // Close menu when clicking backdrop
  backdrop.addEventListener('click', () => {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    backdrop.classList.remove('active');
  });
  
  // Close mobile menu when clicking a link
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      backdrop.classList.remove('active');
    });
  });
  
  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      backdrop.classList.remove('active');
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

// ===== Looping Images Component =====
// Video data from portfolio
const videoData = [
  {
    video: "https://dc5bt2teggic6.cloudfront.net/Pete Davidson x MANSCAPED®： Ball-Ber Shop - The Lawn Mower® 5.0 Ultra-2.mp4",
    poster: "https://img.youtube.com/vi/gqceI4x3uNg/maxresdefault.jpg",
    title: "Ball-Ber Shop",
    client: "Manscaped",
    description: "A humorous commercial featuring Pete Davidson showcasing Manscaped's premium grooming products. This campaign combines comedy with product demonstration to engage a modern male audience.",
    year: "2024"
  },
  {
    video: "https://dc5bt2teggic6.cloudfront.net/Totinos： Petes Fleet delivers Totinos Pizza Rolls!.mp4",
    poster: "https://img.youtube.com/vi/ACrp2HN3f0w/maxresdefault.jpg",
    title: "Game Night",
    client: "Totino's",
    description: "A fun, energetic commercial featuring Pete Davidson's delivery fleet bringing Totino's Pizza Rolls to game night. This spot emphasizes convenience and taste for the target demographic.",
    year: "2024"
  },
  {
    video: "https://dc5bt2teggic6.cloudfront.net/03_SI_v08_FINAL_260825_01_wBumper.mp4",
    poster: "https://img.youtube.com/vi/BZZIpThjURI/maxresdefault.jpg",
    title: "Snack Island",
    client: "General Mills",
    description: "A comedic brand film that showcases General Mills' unique style. This piece combines humor with brand storytelling to create memorable content.",
    year: "2025"
  },
  {
    video: "https://dc5bt2teggic6.cloudfront.net/02_CORP_v10_FINAL_260825_01_wBumper.mp4",
    poster: "https://img.youtube.com/vi/TNu3y2lIb9Q/maxresdefault.jpg",
    title: "Corporate Meltdown",
    client: "General Mills",
    description: "A satirical brand film that humorously explores corporate culture through the lens of snack time. This piece demonstrates creative storytelling and brand voice.",
    year: "2025"
  },
  {
    video: "https://dc5bt2teggic6.cloudfront.net/01_AI_v09_FINAL_260825_01_wBumper.mp4",
    poster: "https://img.youtube.com/vi/1aCRNBkhOEY/maxresdefault.jpg",
    title: "Crisp AI",
    client: "General Mills",
    description: "A social media focused video that explores AI themes through comedic storytelling. This piece is optimized for digital platforms and engagement.",
    year: "2025"
  }
];

// Helper function to get the path offset for a specific index
function getPathOffset(index, total) {
  return index / total;
}

// Easing function (cubic-bezier equivalent)
function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Custom easing function for smoother animation
// Using a smoother ease-in-out curve
function customEase(t) {
  // Clamp t between 0 and 1
  t = Math.max(0, Math.min(1, t));
  
  // Smoother ease-in-out using a gentler curve
  // This creates a more linear, fluid motion
  return t < 0.5
    ? 2 * t * t * (3 - 2 * t)
    : 1 - 2 * (1 - t) * (1 - t) * (3 - 2 * (1 - t));
}

// Animation controller class
class AnimationController {
  constructor() {
    this.startTime = null;
    this.duration = 2000; // 2 seconds
    this.repeatDelay = 500; // 0.5 seconds
    this.isRunning = false;
    this.animationFrameId = null;
  }

  start(callback) {
    if (this.isRunning) return;
    this.isRunning = true;
    this.startTime = performance.now();
    this.animate(callback);
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  animate(callback) {
    if (!this.isRunning) return;

    const now = performance.now();
    const elapsed = now - this.startTime;
    const cycleTime = this.duration + this.repeatDelay;
    
    // Stop after one complete cycle
    if (elapsed >= cycleTime) {
      callback(1); // Ensure we end at progress 1
      this.stop();
      return;
    }
    
    const cycleProgress = elapsed / cycleTime;

    let progress;
    if (cycleProgress < this.duration / cycleTime) {
      // Animation phase
      const animProgress = cycleProgress / (this.duration / cycleTime);
      progress = customEase(animProgress);
    } else {
      // Delay phase - hold at 1 (completed animation)
      progress = 1;
    }

    callback(progress);

    this.animationFrameId = requestAnimationFrame(() => this.animate(callback));
  }
}

// Square with offset (for the first square inside the last square)
class SquareWithOffset {
  constructor(index, parentIndex, parentElement, total, videoData) {
    this.index = index;
    this.parentIndex = parentIndex;
    this.parentElement = parentElement;
    this.total = total;
    this.videoData = videoData;
    this.element = null;
    this.offset = 0;
    this.animationController = new AnimationController();
    this.createElement();
    this.startAnimation();
  }

  createElement() {
    const data = this.videoData[this.index % this.videoData.length];
    this.element = document.createElement('div');
    this.element.className = 'square-with-offset';
    this.element.style.position = 'absolute';
    this.element.style.inset = '0';
    this.element.style.borderRadius = '8px';
    this.element.style.overflow = 'hidden';
    this.element.style.cursor = 'pointer';

    const imgElement = document.createElement('img');
    imgElement.src = data.poster;
    imgElement.alt = data.title;
    imgElement.style.width = '100%';
    imgElement.style.height = '100%';
    imgElement.style.objectFit = 'cover';
    imgElement.draggable = false;

    this.element.appendChild(imgElement);
    this.parentElement.appendChild(this.element);

    // Add click handler
    this.element.addEventListener('click', () => {
      this.handleClick();
    });
  }

  handleClick() {
    const data = this.videoData[this.index % this.videoData.length];
    this.playVideo(data);
  }

  playVideo(data) {
    // Use the video overlay in the looping images section
    const videoOverlay = document.getElementById('videoOverlay');
    const videoPlayer = document.getElementById('videoOverlayPlayer');
    const videoTitle = document.getElementById('videoOverlayTitle');
    const videoClient = document.getElementById('videoOverlayClient');
    const videoYear = document.getElementById('videoOverlayYear');
    
    if (videoOverlay && videoPlayer) {
      // Set video source
      videoPlayer.poster = data.poster || '';
      videoPlayer.src = data.video;
      videoPlayer.muted = false;
      videoPlayer.playsInline = true;
      videoPlayer.load();
      
      // Set title, client, and year
      if (videoTitle) videoTitle.textContent = data.title || '';
      if (videoClient) videoClient.textContent = data.client || '';
      if (videoYear) videoYear.textContent = data.year || '';
      
      // Show overlay
      videoOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Wait for video to be ready before playing
      const playVideo = () => {
        videoPlayer.play().catch(err => {
          console.log('Autoplay prevented:', err);
        });
      };
      
      if (videoPlayer.readyState >= 3) {
        playVideo();
      } else {
        videoPlayer.addEventListener('canplay', playVideo, { once: true });
        videoPlayer.addEventListener('loadeddata', playVideo, { once: true });
      }
    } else if (typeof window.openLightbox === 'function') {
      // Fallback to lightbox
      window.openLightbox(data.video, data.title, data.client, data.description, data.year);
    } else {
      // Last resort: try to find and use lightbox directly
      const lightbox = document.getElementById('lightbox');
      if (lightbox) {
        const lightboxVideo = lightbox.querySelector('.lightbox-video');
        const lightboxTitle = lightbox.querySelector('.lightbox-title');
        const lightboxClient = lightbox.querySelector('.lightbox-client');
        const lightboxDescription = lightbox.querySelector('.lightbox-description');
        const lightboxYear = lightbox.querySelector('.lightbox-year');
        
        if (lightboxVideo) {
          lightboxVideo.src = data.video;
          lightboxVideo.muted = false;
        }
        if (lightboxTitle) lightboxTitle.textContent = data.title || '';
        if (lightboxClient) lightboxClient.textContent = data.client || '';
        if (lightboxDescription) lightboxDescription.textContent = data.description || '';
        if (lightboxYear) lightboxYear.textContent = data.year || '';
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
          if (lightboxVideo) {
            lightboxVideo.play().catch(err => console.log('Autoplay prevented:', err));
          }
        }, 300);
      }
    }
  }

  updatePosition(offset) {
    this.offset = offset;

    // Calculate the angle for both the first square and the last square
    const firstAngle = ((getPathOffset(this.index, this.total) + offset) % 1) * Math.PI * 2;
    const lastAngle = ((getPathOffset(this.parentIndex, this.total) + offset) % 1) * Math.PI * 2;

    // Calculate the x and y position difference
    const x = Math.cos(firstAngle) * 180 - Math.cos(lastAngle) * 180;
    const y = Math.sin(firstAngle) * 180 - Math.sin(lastAngle) * 180;

    this.element.style.transform = `translate(${x}px, ${y}px)`;
  }

  startAnimation() {
    this.animationController.start((progress) => {
      this.updatePosition(progress);
    });
  }

  destroy() {
    this.animationController.stop();
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

// Square component
class Square {
  constructor(index, container, total, videoData, hasChildren = false) {
    this.index = index;
    this.container = container;
    this.total = total;
    this.videoData = videoData;
    this.element = null;
    this.pathOffset = getPathOffset(index, total);
    this.animationController = new AnimationController();
    this.squareWithOffset = null;
    this.hasChildren = hasChildren;
    this.createElement();
    this.startAnimation();
    this.animateEntrance();
  }

  createElement() {
    const data = this.videoData[this.index % this.videoData.length];
    this.element = document.createElement('div');
    this.element.className = 'square';
    this.element.style.position = 'absolute';
    this.element.style.width = '150px';
    this.element.style.height = '150px';
    this.element.style.borderRadius = '8px';
    this.element.style.overflow = 'hidden';
    this.element.style.left = 'calc(50% - 75px)';
    this.element.style.top = 'calc(50% - 75px)';
    this.element.style.opacity = '0';
    this.element.style.transform = 'scale(0.9)';
    this.element.style.cursor = 'pointer';
    this.element.style.transition = 'transform 0.2s ease';

    const imgElement = document.createElement('img');
    imgElement.src = data.poster;
    imgElement.alt = data.title;
    imgElement.style.width = '100%';
    imgElement.style.height = '100%';
    imgElement.style.objectFit = 'cover';
    imgElement.draggable = false;

    this.element.appendChild(imgElement);

    // Store reference to children container if needed
    if (this.hasChildren) {
      this.childrenContainer = this.element;
    }

    // Add click handler
    this.element.addEventListener('click', () => {
      this.handleClick();
    });

    // Add hover effect
    this.element.addEventListener('mouseenter', () => {
      this.element.dataset.hovered = 'true';
      this.updateHoverTransform();
    });

    this.element.addEventListener('mouseleave', () => {
      this.element.dataset.hovered = 'false';
      this.updateHoverTransform();
    });

    this.container.appendChild(this.element);
  }

  handleClick() {
    const data = this.videoData[this.index % this.videoData.length];
    this.playVideo(data);
  }

  playVideo(data) {
    // Use the video overlay in the looping images section
    const videoOverlay = document.getElementById('videoOverlay');
    const videoPlayer = document.getElementById('videoOverlayPlayer');
    const videoTitle = document.getElementById('videoOverlayTitle');
    const videoClient = document.getElementById('videoOverlayClient');
    const videoYear = document.getElementById('videoOverlayYear');
    
    if (videoOverlay && videoPlayer) {
      // Set video source
      videoPlayer.poster = data.poster || '';
      videoPlayer.src = data.video;
      videoPlayer.muted = false;
      videoPlayer.playsInline = true;
      videoPlayer.load();
      
      // Set title, client, and year
      if (videoTitle) videoTitle.textContent = data.title || '';
      if (videoClient) videoClient.textContent = data.client || '';
      if (videoYear) videoYear.textContent = data.year || '';
      
      // Show overlay
      videoOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Wait for video to be ready before playing
      const playVideo = () => {
        videoPlayer.play().catch(err => {
          console.log('Autoplay prevented:', err);
        });
      };
      
      if (videoPlayer.readyState >= 3) {
        playVideo();
      } else {
        videoPlayer.addEventListener('canplay', playVideo, { once: true });
        videoPlayer.addEventListener('loadeddata', playVideo, { once: true });
      }
    } else if (typeof window.openLightbox === 'function') {
      // Fallback to lightbox
      window.openLightbox(data.video, data.title, data.client, data.description, data.year);
    } else {
      // Last resort: try to find and use lightbox directly
      const lightbox = document.getElementById('lightbox');
      if (lightbox) {
        const lightboxVideo = lightbox.querySelector('.lightbox-video');
        const lightboxTitle = lightbox.querySelector('.lightbox-title');
        const lightboxClient = lightbox.querySelector('.lightbox-client');
        const lightboxDescription = lightbox.querySelector('.lightbox-description');
        const lightboxYear = lightbox.querySelector('.lightbox-year');
        
        if (lightboxVideo) {
          lightboxVideo.src = data.video;
          lightboxVideo.muted = false;
        }
        if (lightboxTitle) lightboxTitle.textContent = data.title || '';
        if (lightboxClient) lightboxClient.textContent = data.client || '';
        if (lightboxDescription) lightboxDescription.textContent = data.description || '';
        if (lightboxYear) lightboxYear.textContent = data.year || '';
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
          if (lightboxVideo) {
            lightboxVideo.play().catch(err => console.log('Autoplay prevented:', err));
          }
        }, 300);
      }
    }
  }

  updatePosition(offset) {
    this.pathOffset = getPathOffset(this.index, this.total) + offset;
    this.currentOffset = offset;
    this.updateHoverTransform();
  }

  updateHoverTransform() {
    if (!this.element) return;
    
    const angle = (this.pathOffset % 1) * Math.PI * 2;
    const x = Math.cos(angle) * 180;
    const y = Math.sin(angle) * 180;
    const scale = this.element.dataset.hovered === 'true' ? 1.05 : 1;

    // Only update transform if entrance animation is complete
    if (this.element.style.opacity === '1' || parseFloat(this.element.style.opacity) > 0) {
      this.element.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    }
  }

  startAnimation() {
    this.animationController.start((progress) => {
      this.updatePosition(progress);
    });
  }

  animateEntrance() {
    const delay = this.index * 120 + 350; // 0.12s per index + 0.35s base
    setTimeout(() => {
      this.element.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
      this.element.style.opacity = '1';
      this.updatePosition(0);

      if (this.hasChildren && this.squareWithOffset && this.squareWithOffset.element) {
        this.squareWithOffset.element.style.transition = 'transform 1s ease-out';
        this.squareWithOffset.element.style.transform = 'scale(1)';
      }
    }, delay);
  }

  destroy() {
    this.animationController.stop();
    if (this.squareWithOffset) {
      this.squareWithOffset.destroy();
    }
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

// Main LoopingImages component
function initLoopingImages() {
  const wrapper = document.getElementById('loopingImagesWrapper');
  if (!wrapper) return;

  // Use video data length, but create 8 squares for smooth circular animation
  const totalSquares = 8;
  const lastIndex = totalSquares - 1;
  const squares = [];

  // Create container
  const container = document.createElement('div');
  container.className = 'looping-images-inner';
  container.style.position = 'relative';
  container.style.width = '500px';
  container.style.height = '500px';
  wrapper.appendChild(container);

  // Render all squares
  for (let i = 0; i < totalSquares; i++) {
    if (i === lastIndex) {
      // Render the last square with the duplicate first square inside it
      const square = new Square(lastIndex, container, totalSquares, videoData, true);
      const squareWithOffset = new SquareWithOffset(0, lastIndex, square.element, totalSquares, videoData);
      square.squareWithOffset = squareWithOffset;
      squares.push(square);
    } else {
      const square = new Square(i, container, totalSquares, videoData);
      squares.push(square);
    }
  }

  // Cleanup function
  return () => {
    squares.forEach(square => square.destroy());
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  };
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initLoopingImages();
  
  // Setup video overlay close button
  const videoOverlay = document.getElementById('videoOverlay');
  const videoOverlayClose = document.getElementById('videoOverlayClose');
  const videoOverlayPlayer = document.getElementById('videoOverlayPlayer');
  
  if (videoOverlayClose && videoOverlay && videoOverlayPlayer) {
    const closeVideoOverlay = () => {
      videoOverlay.classList.remove('active');
      document.body.style.overflow = '';
      videoOverlayPlayer.pause();
      videoOverlayPlayer.src = '';
    };
    
    videoOverlayClose.addEventListener('click', closeVideoOverlay);
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && videoOverlay.classList.contains('active')) {
        closeVideoOverlay();
      }
    });
    
    // Close when clicking outside the video
    videoOverlay.addEventListener('click', (e) => {
      if (e.target === videoOverlay) {
        closeVideoOverlay();
      }
    });
  }
});