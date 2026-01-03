// ===== Portfolio Page JavaScript =====

// ===== Main Video Player Functionality =====
// Initialize elements when DOM is ready to prevent null reference errors
let mainVideo, sidebarItems, mainVideoWrapper;
let currentVideoSrc = ''; // Track current video to prevent unnecessary reloads

function initPortfolioElements() {
  mainVideo = document.getElementById('mainVideo');
  mainVideoWrapper = document.querySelector('.main-video-wrapper');
  
  if (!mainVideo) {
    console.error('Portfolio video elements not found');
    return false;
  }
  
  sidebarItems = document.querySelectorAll('.sidebar-video-item');
  
  return true;
}

// Function to load video into main player (exposed globally)
window.loadMainVideo = function(videoSrc, poster, title, client, description, year, shouldAutoplay = false) {
  if (!mainVideo) {
    console.error('Cannot load video: elements not initialized');
    return;
  }
  
  // Only reload if it's a different video
  if (currentVideoSrc !== videoSrc) {
    mainVideo.poster = poster || '';
    mainVideo.src = videoSrc;
    mainVideo.muted = false; // Unmuted for user interaction
    mainVideo.playsInline = true; // For mobile devices
    currentVideoSrc = videoSrc;
    
    // Load the new video
    mainVideo.load();
  }
  
  // Set title, client, and year
  const mainVideoTitle = document.getElementById('mainVideoTitle');
  const mainVideoClient = document.getElementById('mainVideoClient');
  const mainVideoYear = document.getElementById('mainVideoYear');
  if (mainVideoTitle) mainVideoTitle.textContent = title || '';
  if (mainVideoClient) mainVideoClient.textContent = client || '';
  if (mainVideoYear) mainVideoYear.textContent = year || '';
  
  // Autoplay only if requested
  if (shouldAutoplay) {
    // Wait for video to be ready
    const playVideo = () => {
      // Video is unmuted for user interaction
      mainVideo.muted = false;
      mainVideo.play().catch(err => {
        console.log('Autoplay prevented:', err);
      });
    };
    
    // Try multiple events to ensure video plays
    if (mainVideo.readyState >= 3) {
      // Video has enough data to play
      playVideo();
    } else if (mainVideo.readyState >= 2) {
      // Video has metadata
      mainVideo.addEventListener('canplay', playVideo, { once: true });
      mainVideo.addEventListener('loadeddata', playVideo, { once: true });
    } else {
      // Video not loaded yet
      mainVideo.addEventListener('canplay', playVideo, { once: true });
      mainVideo.addEventListener('loadeddata', playVideo, { once: true });
      mainVideo.addEventListener('loadedmetadata', () => {
        mainVideo.addEventListener('canplay', playVideo, { once: true });
      }, { once: true });
    }
  }
};

// Initialize with first video (no autoplay on initial load)
document.addEventListener('DOMContentLoaded', () => {
  // Initialize elements first
  if (!initPortfolioElements()) {
    console.error('Failed to initialize portfolio elements');
    return;
  }
  
  const firstItem = sidebarItems[0];
  if (firstItem) {
    const videoSrc = firstItem.getAttribute('data-video');
    const poster = firstItem.getAttribute('data-poster');
    const title = firstItem.getAttribute('data-title');
    const client = firstItem.getAttribute('data-client');
    const description = firstItem.getAttribute('data-description');
    const year = firstItem.getAttribute('data-year');
    
    // Load first video with autoplay (unmuted)
    window.loadMainVideo(videoSrc, poster, title, client, description, year, true);
  }
  
  // Sidebar item click handlers
  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove active class from all items
      sidebarItems.forEach(i => i.classList.remove('active'));
      
      // Add active class to clicked item
      item.classList.add('active');
      
      // Get video data
      const videoSrc = item.getAttribute('data-video');
      const poster = item.getAttribute('data-poster');
      const title = item.getAttribute('data-title');
      const client = item.getAttribute('data-client');
      const description = item.getAttribute('data-description');
      const year = item.getAttribute('data-year');
      
      // Load video into main player with autoplay
      window.loadMainVideo(videoSrc, poster, title, client, description, year, true);
    });
  });
  
});

// ===== Lightbox Functionality =====
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const lightboxVideo = lightbox.querySelector('.lightbox-video');
  const lightboxTitle = lightbox.querySelector('.lightbox-title');
  const lightboxClient = lightbox.querySelector('.lightbox-client');
  const lightboxDescription = lightbox.querySelector('.lightbox-description');
  const lightboxYear = lightbox.querySelector('.lightbox-year');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxOverlay = lightbox.querySelector('.lightbox-overlay');

  // Open lightbox (exposed globally)
  window.openLightbox = function(videoSrc, title, client, description, year) {
    if (!lightboxVideo || !lightboxTitle || !lightboxClient) return;
    
    lightboxVideo.src = videoSrc;
    lightboxTitle.textContent = title || '';
    if (lightboxClient) lightboxClient.textContent = client || '';
    if (lightboxDescription) lightboxDescription.textContent = description || '';
    if (lightboxYear) lightboxYear.textContent = year || '';
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Play video
    setTimeout(() => {
      if (lightboxVideo) {
        lightboxVideo.play().catch(err => {
          console.log('Autoplay prevented:', err);
        });
      }
    }, 300);
  };

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.src = '';
    }
  }

  // Close lightbox handlers
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

// Removed page load fade to prevent double-load issues

