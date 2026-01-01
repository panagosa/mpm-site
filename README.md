# Deadpan Media - Portfolio

A bold, distinctive portfolio website showcasing the work and team of Deadpan Media with unique interactive features.

## 🎯 Features

### Design
- **Bold Color Palette**: Rust/orange background (#D96A3A) with dark teal text (#3F5F5A)
- **Custom Cursor**: Interactive custom cursor with hover effects
- **Modern Typography**: Space Grotesk font family
- **Responsive Design**: Fully optimized for all devices with mobile menu
- **Interactive Elements**: Letter animations, video carousel, and a fun "wild mode" easter egg

### Sections
1. **Hero Section**
   - Company logo and name with interactive letter animations
   - Custom cursor effects
   - Fun button that triggers "wild mode" neon theme

2. **Portfolio Section** (`portfolio.html`)
   - Filterable video grid (Ads, Brand Films, Social Media)
   - Lightbox video player
   - Project details and descriptions

3. **Work Section** (`work.html`)
   - Video carousel with keyboard navigation
   - Click-to-play video functionality
   - Arrow navigation controls

4. **About Section**
   - Company description
   - Team member profiles (Judah Miller, Alex Panagos)

5. **Contact Section**
   - Contact form with FormSubmit integration
   - Email link
   - Form validation and submission handling

### Technical Features
- **Custom Cursor**: Smooth following cursor with hover states
- **Video Handling**: Click-to-play, carousel navigation, lightbox viewing
- **Form Submission**: AJAX form handling via FormSubmit
- **Mobile Menu**: Hamburger menu for mobile devices
- **Smooth Animations**: Scroll-triggered animations and transitions
- **Wild Mode**: Easter egg neon theme activated by button or Konami code

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern CSS with Grid, Flexbox, CSS Variables, and custom animations
- **JavaScript**: Vanilla JS for interactive features
- **Google Fonts**: Space Grotesk font family
- **FormSubmit**: Contact form handling

## 📦 Setup Instructions

1. Clone or download the repository
2. Open `index.html` in a modern web browser
3. No build process required - it's ready to use!

## 🎨 Customization

### Colors
Edit the CSS variables in `style.css`:
```css
:root {
  --color-bg: #D96A3A;              /* Rust/orange background */
  --color-text: #3F5F5A;            /* Dark teal text */
  --color-text-light: rgba(63, 95, 90, 0.8); /* Teal with opacity */
  --color-border: #3F5F5A;         /* Dark teal borders */
  --color-accent-rust: #D96A3A;    /* Rust accent */
  --color-accent-mustard: #C89A3A; /* Mustard/gold hover accent */
}
```

### Content
- Update company information in HTML files
- Replace video URLs with your own content
- Modify team member information
- Update contact email and form endpoint

### Styling
- Adjust spacing using CSS custom properties (--spacing-*)
- Modify typography by changing font families
- Update colors to match your brand
- Customize animations and transitions

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🚀 Performance

- Optimized animations using requestAnimationFrame
- Lazy loading considerations for videos
- Clean HTML structure
- Minimal external dependencies

## 🎮 Easter Eggs

- **Wild Mode Button**: Click the "DO NOT PRESS THIS BUTTON" on the homepage
- **Konami Code**: Enter the Konami code (↑↑↓↓←→←→BA) to activate wild mode
- **Floating Text**: "HIRE US" messages appear in wild mode

## 📄 License

This project is created for Deadpan Media. All rights reserved.

---

Built with creativity and interactive design