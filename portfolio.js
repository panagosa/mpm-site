// ===== Portfolio Page JavaScript =====

// ===== Main Video Player Functionality =====
// Initialize elements when DOM is ready to prevent null reference errors
let mainVideo, mainVideoInfo, mainVideoTitle, mainVideoClient, mainVideoDescription, mainVideoYear, sidebarItems;

function initPortfolioElements() {
  mainVideo = document.getElementById('mainVideo');
  mainVideoInfo = document.getElementById('mainVideoInfo');
  
  if (!mainVideo || !mainVideoInfo) {
    console.error('Portfolio video elements not found');
    return false;
  }
  
  mainVideoTitle = mainVideoInfo.querySelector('.main-video-title');
  mainVideoClient = mainVideoInfo.querySelector('.main-video-client');
  mainVideoDescription = mainVideoInfo.querySelector('.main-video-description');
  mainVideoYear = mainVideoInfo.querySelector('.main-video-year');
  sidebarItems = document.querySelectorAll('.sidebar-video-item');
  
  return true;
}

// Function to load video into main player
function loadMainVideo(videoSrc, poster, title, client, description, year, shouldAutoplay = false) {
  if (!mainVideo || !mainVideoInfo) {
    console.error('Cannot load video: elements not initialized');
    return;
  }
  
  // Update video source
  mainVideo.poster = poster;
  mainVideo.src = videoSrc;
  
  // Update video info
  if (mainVideoTitle) mainVideoTitle.textContent = title || '';
  if (mainVideoClient) mainVideoClient.textContent = client || '';
  if (mainVideoDescription) mainVideoDescription.textContent = description || '';
  if (mainVideoYear) mainVideoYear.textContent = year || '';
  
  // Load the new video
  mainVideo.load();
  
  // Autoplay only if requested (not on initial page load)
  if (shouldAutoplay) {
    // Wait for video to be ready
    const playVideo = () => {
      mainVideo.play().catch(err => {
        console.log('Autoplay prevented:', err);
      });
    };
    
    if (mainVideo.readyState >= 2) {
      playVideo();
    } else {
      mainVideo.addEventListener('loadeddata', playVideo, { once: true });
    }
  }
}

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
    
    // Load first video without autoplay
    loadMainVideo(videoSrc, poster, title, client, description, year, false);
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
      loadMainVideo(videoSrc, poster, title, client, description, year, true);
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

