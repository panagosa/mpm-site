// Helper script to update video URLs and thumbnails
// Run this in your browser console after opening index.html

const videoUpdates = {
  'snack-island': {
    videoId: '', // Add video ID here (from youtube.com/watch?v=VIDEO_ID)
    line: 79
  },
  'corporate-meltdown': {
    videoId: '', // Add video ID here
    line: 96
  },
  'remodel-or-remarry': {
    videoId: '', // Add video ID here
    line: 113
  },
  'crisp-ai': {
    videoId: '', // Add video ID here
    line: 130
  }
};

// Instructions:
// 1. Go to https://www.youtube.com/@SnackTimeSketchShow
// 2. For each episode, copy the video ID from the URL (the part after v=)
// 3. Paste the video IDs into the videoUpdates object above
// 4. Update the href and img src in index.html with these values:
//    - href: https://www.youtube.com/watch?v=VIDEO_ID
//    - img src: https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg

console.log('Video URL Update Helper');
console.log('=======================');
console.log('\nTo update videos:');
console.log('1. Visit: https://www.youtube.com/@SnackTimeSketchShow');
console.log('2. Find each episode and copy the video URL');
console.log('3. Extract the video ID (the part after "v=" in the URL)');
console.log('\nThen update index.html with these patterns:');
console.log('- Link: https://www.youtube.com/watch?v=VIDEO_ID');
console.log('- Thumbnail: https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg');

