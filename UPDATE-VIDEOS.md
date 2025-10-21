# How to Update Snacktime Sketch Show Video Links

## Current Status
✅ Custom thumbnails created for all 4 episodes
✅ HTML structure in place
⏳ Need actual YouTube video URLs

## Steps to Update Video Links

1. **Visit the Snacktime Sketch Show YouTube Channel:**
   - Go to: https://www.youtube.com/@SnackTimeSketchShow
   - Or search for "@SnackTimeSketchShow" on YouTube

2. **Find Each Episode Video:**
   - Snack Island (Love Island parody)
   - Corporate Meltdown
   - Remodel or Remarry
   - Crisp AI

3. **Get the Video URL:**
   - Click on each video
   - Copy the URL from the browser address bar
   - It will look like: `https://www.youtube.com/watch?v=XXXXX`

4. **Update index.html:**
   - Open `index.html` in your editor
   - Find the TODO comments for each episode (lines 74, 91, 108, 125)
   - Replace `https://www.youtube.com/@SnackTimeSketchShow` with the actual video URL
   
   Example:
   ```html
   <!-- BEFORE -->
   <a href="https://www.youtube.com/@SnackTimeSketchShow" target="_blank" class="work-play-btn">
   
   <!-- AFTER -->
   <a href="https://www.youtube.com/watch?v=abc123XYZ" target="_blank" class="work-play-btn">
   ```

## Optional: Use YouTube Thumbnails

If you prefer to use YouTube's actual video thumbnails instead of the custom SVG files:

1. Get the video ID from the URL (the part after `v=`)
2. Replace the thumbnail image source with:
   ```html
   <img src="https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg" alt="...">
   ```

For example, if video URL is `https://www.youtube.com/watch?v=abc123XYZ`:
```html
<img src="https://img.youtube.com/vi/abc123XYZ/maxresdefault.jpg" alt="Snack Island">
```

## Current Thumbnails

The custom SVG thumbnails are located at:
- `assets/snack-island.svg` (pink gradient)
- `assets/corporate-meltdown.svg` (purple gradient)
- `assets/remodel-or-remarry.svg` (pink-red gradient)
- `assets/crisp-ai.svg` (blue gradient)

These can be replaced with actual video screenshots or YouTube thumbnails once you have the videos.

