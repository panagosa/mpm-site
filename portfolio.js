// ===== Portfolio Page JavaScript =====

// ===== Filter Functionality =====
const filterButtons = document.querySelectorAll('.filter-btn');
const videoItems = document.querySelectorAll('.video-item');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Update active state
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Get filter value
    const filterValue = button.getAttribute('data-filter');
    
    // Filter videos
    videoItems.forEach((item, index) => {
      const category = item.getAttribute('data-category');
      
      if (filterValue === 'all' || category === filterValue) {
        item.classList.remove('hidden');
        // Stagger animation
        setTimeout(() => {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        }, index * 50);
      } else {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
          item.classList.add('hidden');
        }, 300);
      }
    });
  });
});

// ===== Lightbox Functionality =====
const lightbox = document.getElementById('lightbox');
const lightboxVideo = lightbox.querySelector('.lightbox-video');
const lightboxTitle = lightbox.querySelector('.lightbox-title');
const lightboxClient = lightbox.querySelector('.lightbox-client');
const lightboxDescription = lightbox.querySelector('.lightbox-description');
const lightboxYear = lightbox.querySelector('.lightbox-year');
const lightboxClose = lightbox.querySelector('.lightbox-close');
const lightboxOverlay = lightbox.querySelector('.lightbox-overlay');

// Open lightbox
function openLightbox(videoSrc, title, client, description, year) {
  lightboxVideo.src = videoSrc;
  lightboxTitle.textContent = title;
  lightboxClient.textContent = client;
  lightboxDescription.textContent = description || '';
  lightboxYear.textContent = year || '';
  
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Play video
  setTimeout(() => {
    lightboxVideo.play().catch(err => {
      console.log('Autoplay prevented:', err);
    });
  }, 300);
}

// Close lightbox
function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  lightboxVideo.pause();
  lightboxVideo.src = '';
}

// Play button click handlers
document.querySelectorAll('.play-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const videoSrc = btn.getAttribute('data-video');
    const title = btn.getAttribute('data-title') || btn.closest('.video-item').querySelector('.video-title').textContent;
    const client = btn.getAttribute('data-client') || btn.closest('.video-item').querySelector('.video-client').textContent;
    const description = btn.getAttribute('data-description') || '';
    const year = btn.getAttribute('data-year') || btn.closest('.video-item').querySelector('.video-year').textContent;
    
    openLightbox(videoSrc, title, client, description, year);
  });
});

// Close lightbox handlers
lightboxClose.addEventListener('click', closeLightbox);
lightboxOverlay.addEventListener('click', closeLightbox);

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) {
    closeLightbox();
  }
});

// ===== Scroll Animations =====
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

// Observe video items for fade-in animation
document.addEventListener('DOMContentLoaded', () => {
  const animateElements = document.querySelectorAll('.video-item');
  
  animateElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });
});

// ===== Video Thumbnail Hover Effect =====
document.querySelectorAll('.video-thumbnail').forEach(thumbnail => {
  thumbnail.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.02)';
  });
  
  thumbnail.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
  });
});

// ===== Smooth Page Load =====
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
});

// ===== Video Grid Masonry Effect (Optional Enhancement) =====
function adjustVideoGrid() {
  const videoGrid = document.getElementById('videoGrid');
  const items = Array.from(videoGrid.querySelectorAll('.video-item:not(.hidden)'));
  
  // Reset heights
  items.forEach(item => {
    item.style.height = 'auto';
  });
  
  // Simple equal height for same row items (optional)
  if (window.innerWidth > 768) {
    let currentRow = [];
    let currentTop = null;
    
    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const itemTop = rect.top + window.scrollY;
      
      if (currentTop === null || Math.abs(itemTop - currentTop) < 10) {
        currentRow.push(item);
        currentTop = itemTop;
      } else {
        // Set equal heights for previous row
        if (currentRow.length > 1) {
          const maxHeight = Math.max(...currentRow.map(el => el.offsetHeight));
          currentRow.forEach(el => {
            el.style.height = maxHeight + 'px';
          });
        }
        currentRow = [item];
        currentTop = itemTop;
      }
      
      // Handle last row
      if (index === items.length - 1 && currentRow.length > 1) {
        const maxHeight = Math.max(...currentRow.map(el => el.offsetHeight));
        currentRow.forEach(el => {
          el.style.height = maxHeight + 'px';
        });
      }
    });
  }
}

// Adjust on load and resize
window.addEventListener('load', adjustVideoGrid);
window.addEventListener('resize', adjustVideoGrid);

// Re-adjust after filter
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    setTimeout(adjustVideoGrid, 500);
  });
});

