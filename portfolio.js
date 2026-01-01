// ===== Portfolio Page JavaScript =====

// ===== Main Video Player Functionality =====
// Initialize elements when DOM is ready to prevent null reference errors
let mainVideo, mainVideoInfo, mainVideoTitle, mainVideoClient, mainVideoDescription, mainVideoYear, sidebarItems, mainVideoWrapper;
let currentVideoSrc = ''; // Track current video to prevent unnecessary reloads

function initPortfolioElements() {
  mainVideo = document.getElementById('mainVideo');
  mainVideoInfo = document.getElementById('mainVideoInfo');
  mainVideoWrapper = document.querySelector('.main-video-wrapper');
  
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
  
  // Only reload if it's a different video
  if (currentVideoSrc !== videoSrc) {
    mainVideo.poster = poster;
    mainVideo.src = videoSrc;
    currentVideoSrc = videoSrc;
    
    // Set background image for sleek paused thumbnail
    if (mainVideoWrapper && poster) {
      mainVideoWrapper.style.setProperty('--poster-image', `url(${poster})`);
      mainVideoWrapper.style.backgroundImage = `var(--poster-image)`;
    }
    if (mainVideoWrapper) {
      mainVideoWrapper.classList.remove('playing'); // Reset playing state
    }
    
    // Load the new video
    mainVideo.load();
  }
  
  // Update video info
  if (mainVideoTitle) mainVideoTitle.textContent = title || '';
  if (mainVideoClient) mainVideoClient.textContent = client || '';
  if (mainVideoDescription) mainVideoDescription.textContent = description || '';
  if (mainVideoYear) mainVideoYear.textContent = year || '';
  
  // Autoplay only if requested
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
    
    // Load first video with autoplay (muted)
    loadMainVideo(videoSrc, poster, title, client, description, year, true);
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
  
  // Handle play/pause states for sleek thumbnail overlay
  if (mainVideo && mainVideoWrapper) {
    mainVideo.addEventListener('play', () => {
      mainVideoWrapper.classList.add('playing');
    });
    mainVideo.addEventListener('pause', () => {
      mainVideoWrapper.classList.remove('playing');
    });
    mainVideo.addEventListener('ended', () => {
      mainVideoWrapper.classList.remove('playing');
    });
  }
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
  }

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

