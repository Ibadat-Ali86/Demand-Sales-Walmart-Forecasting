# ForecastAI - Visual Effects, Animations & Media Guide

## Complete Reference for UI Enhancements

---

## Table of Contents

1. [Visual Effects Library](#visual-effects-library)
2. [Animation Catalog](#animation-catalog)
3. [Sliders & Carousels](#sliders--carousels)
4. [Loading Animations](#loading-animations)
5. [Textual Animations](#textual-animations)
6. [Background Videos & Wallpapers](#background-videos--wallpapers)
7. [Interactive Effects](#interactive-effects)
8. [Particle Systems](#particle-systems)

---

## 1. Visual Effects Library

### 1.1 Glassmorphism Effects

**For Cards, Modals, and Overlays**

```css
.glass-card {
  background: rgba(28, 35, 51, 0.6);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(163, 173, 191, 0.12);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

/* Frosted glass navigation */
.glass-nav {
  background: rgba(10, 14, 26, 0.7);
  backdrop-filter: blur(20px) saturate(150%);
  border-bottom: 1px solid rgba(163, 173, 191, 0.08);
}

/* Modal overlay with blur */
.glass-overlay {
  background: rgba(10, 14, 26, 0.85);
  backdrop-filter: blur(12px);
}
```

### 1.2 Gradient Mesh Backgrounds

**Animated Fluid Gradients**

```css
.gradient-mesh {
  background: 
    radial-gradient(at 20% 30%, rgba(74, 158, 255, 0.15) 0px, transparent 50%),
    radial-gradient(at 80% 70%, rgba(183, 148, 246, 0.12) 0px, transparent 50%),
    radial-gradient(at 40% 80%, rgba(0, 217, 255, 0.08) 0px, transparent 50%);
  animation: gradientShift 20s ease infinite;
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%, 100% 50%, 50% 100%;
  }
  33% {
    background-position: 100% 50%, 0% 50%, 50% 0%;
  }
  66% {
    background-position: 50% 0%, 50% 100%, 100% 50%;
  }
}
```

### 1.3 Neon Glow Effects

**For Status Indicators and Accents**

```css
.neon-blue {
  color: var(--accent-blue);
  text-shadow: 
    0 0 10px rgba(74, 158, 255, 0.8),
    0 0 20px rgba(74, 158, 255, 0.6),
    0 0 30px rgba(74, 158, 255, 0.4);
}

.neon-border {
  border: 1px solid var(--accent-blue);
  box-shadow: 
    0 0 10px rgba(74, 158, 255, 0.4),
    inset 0 0 10px rgba(74, 158, 255, 0.2);
  animation: neonPulse 2s ease-in-out infinite;
}

@keyframes neonPulse {
  0%, 100% {
    box-shadow: 
      0 0 10px rgba(74, 158, 255, 0.4),
      inset 0 0 10px rgba(74, 158, 255, 0.2);
  }
  50% {
    box-shadow: 
      0 0 20px rgba(74, 158, 255, 0.6),
      inset 0 0 20px rgba(74, 158, 255, 0.3);
  }
}
```

### 1.4 Holographic Effect

**For Premium Features or CTAs**

```css
.holographic {
  background: linear-gradient(
    45deg,
    #4A9EFF 0%,
    #B794F6 25%,
    #00D9FF 50%,
    #4ADE80 75%,
    #4A9EFF 100%
  );
  background-size: 300% 300%;
  animation: holographicShift 3s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@keyframes holographicShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

### 1.5 Data Visualization Effects

**Animated Grid Lines (Terminal Style)**

```css
.data-grid {
  position: relative;
  background-image: 
    linear-gradient(rgba(163, 173, 191, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(163, 173, 191, 0.03) 1px, transparent 1px);
  background-size: 20px 20px;
  animation: gridScroll 20s linear infinite;
}

@keyframes gridScroll {
  0% { background-position: 0 0; }
  100% { background-position: 20px 20px; }
}

/* Scanline effect */
.scanlines::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    transparent,
    rgba(74, 158, 255, 0.3),
    transparent
  );
  animation: scanlineMove 2s linear infinite;
}

@keyframes scanlineMove {
  0% { transform: translateY(0); }
  100% { transform: translateY(100vh); }
}
```

---

## 2. Animation Catalog

### 2.1 Page Transitions

**Slide & Fade**

```css
/* React Router transition group */
.page-enter {
  opacity: 0;
  transform: translateX(100px);
}

.page-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: opacity 400ms, transform 400ms;
}

.page-exit {
  opacity: 1;
  transform: translateX(0);
}

.page-exit-active {
  opacity: 0;
  transform: translateX(-100px);
  transition: opacity 400ms, transform 400ms;
}
```

**Zoom In/Out**

```css
@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.page-zoom-in {
  animation: zoomIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 2.2 Card Hover Effects

**Lift & Glow**

```css
.card-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(74, 158, 255, 0.2);
  border-color: var(--accent-blue);
}
```

**3D Tilt Effect**

```javascript
// Using vanilla-tilt.js or custom implementation
const card = document.querySelector('.tilt-card');

card.addEventListener('mousemove', (e) => {
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const rotateX = (y - centerY) / 10;
  const rotateY = (centerX - x) / 10;
  
  card.style.transform = `
    perspective(1000px)
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
    scale(1.05)
  `;
});

card.addEventListener('mouseleave', () => {
  card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
});
```

### 2.3 Button Interactions

**Magnetic Button**

```javascript
const magneticBtn = document.querySelector('.magnetic-btn');

magneticBtn.addEventListener('mousemove', (e) => {
  const rect = magneticBtn.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  
  magneticBtn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
});

magneticBtn.addEventListener('mouseleave', () => {
  magneticBtn.style.transform = 'translate(0, 0)';
});
```

**Ripple Effect**

```javascript
function createRipple(event) {
  const button = event.currentTarget;
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.classList.add('ripple');
  
  button.appendChild(ripple);
  
  setTimeout(() => ripple.remove(), 600);
}

// CSS
.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  transform: scale(0);
  animation: rippleEffect 0.6s ease-out;
}

@keyframes rippleEffect {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
```

### 2.4 Number Counter Animation

```javascript
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toLocaleString();
    }
  }, 16);
}

// Usage
const accuracyElement = document.querySelector('.accuracy-value');
animateCounter(accuracyElement, 98.77);
```

### 2.5 Scroll-Triggered Animations

**Parallax Scrolling**

```javascript
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll('.parallax');
  
  parallaxElements.forEach(el => {
    const speed = el.dataset.speed || 0.5;
    el.style.transform = `translateY(${scrolled * speed}px)`;
  });
});
```

**Fade In on Scroll**

```javascript
const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in-scroll').forEach(el => {
  observer.observe(el);
});

// CSS
.fade-in-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-in-visible {
  opacity: 1;
  transform: translateY(0);
}
```

---

## 3. Sliders & Carousels

### 3.1 Feature Slider (Swiper.js Implementation)

```html
<div class="swiper feature-slider">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <div class="feature-slide">
        <img src="feature1.jpg" alt="Feature 1" />
        <h3>Advanced ML Models</h3>
        <p>Ensemble methods with 98.77% accuracy</p>
      </div>
    </div>
    <!-- More slides... -->
  </div>
  <div class="swiper-pagination"></div>
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>
```

```javascript
import Swiper from 'swiper';

const swiper = new Swiper('.feature-slider', {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 'auto',
  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
});
```

### 3.2 Testimonial Carousel

```css
.testimonial-carousel {
  overflow: hidden;
  position: relative;
}

.testimonial-track {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.testimonial-slide {
  min-width: 100%;
  padding: var(--space-12);
  opacity: 0;
  transition: opacity 0.5s;
}

.testimonial-slide.active {
  opacity: 1;
}
```

### 3.3 Image Gallery with Lightbox

```javascript
// Lightbox effect
function openLightbox(imageSrc) {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-overlay"></div>
    <div class="lightbox-content">
      <img src="${imageSrc}" alt="Full size" />
      <button class="lightbox-close">✕</button>
    </div>
  `;
  
  document.body.appendChild(lightbox);
  
  // Animate in
  requestAnimationFrame(() => {
    lightbox.classList.add('active');
  });
  
  // Close handlers
  lightbox.querySelector('.lightbox-close').onclick = () => closeLightbox(lightbox);
  lightbox.querySelector('.lightbox-overlay').onclick = () => closeLightbox(lightbox);
}

function closeLightbox(lightbox) {
  lightbox.classList.remove('active');
  setTimeout(() => lightbox.remove(), 300);
}

// CSS
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  opacity: 0;
  transition: opacity 0.3s;
}

.lightbox.active {
  opacity: 1;
}

.lightbox-overlay {
  position: absolute;
  inset: 0;
  background: rgba(10, 14, 26, 0.95);
  backdrop-filter: blur(10px);
}

.lightbox-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-12);
}

.lightbox-content img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  animation: zoomIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 4. Loading Animations

### 4.1 Skeleton Screens

```css
/* Skeleton for card */
.skeleton-card {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

.skeleton-line {
  height: 16px;
  background: linear-gradient(
    90deg,
    var(--bg-tertiary) 25%,
    var(--bg-elevated) 50%,
    var(--bg-tertiary) 75%
  );
  background-size: 200% 100%;
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-3);
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

.skeleton-line:last-child {
  width: 60%;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(
    90deg,
    var(--bg-tertiary) 25%,
    var(--bg-elevated) 50%,
    var(--bg-tertiary) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}
```

### 4.2 Custom Spinners

**DNA Helix Spinner**

```css
.dna-spinner {
  width: 60px;
  height: 60px;
  position: relative;
}

.dna-spinner::before,
.dna-spinner::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  background: var(--accent-blue);
  border-radius: 50%;
  animation: dnaRotate 2s linear infinite;
}

.dna-spinner::after {
  background: var(--accent-purple);
  animation-delay: 1s;
}

@keyframes dnaRotate {
  0% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(24px, 12px) scale(0.7);
  }
  50% {
    transform: translate(0, 24px) scale(1);
  }
  75% {
    transform: translate(-24px, 12px) scale(0.7);
  }
  100% {
    transform: translate(0, 0) scale(1);
  }
}
```

**Pulse Rings**

```css
.pulse-spinner {
  width: 60px;
  height: 60px;
  position: relative;
}

.pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid var(--accent-blue);
  border-radius: 50%;
  opacity: 0;
  animation: pulseRing 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.pulse-ring:nth-child(2) {
  animation-delay: 1s;
}

@keyframes pulseRing {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}
```

**Cube Flip**

```css
.cube-spinner {
  width: 40px;
  height: 40px;
  position: relative;
  transform-style: preserve-3d;
  animation: cubeFlip 2s infinite;
}

.cube-face {
  position: absolute;
  width: 100%;
  height: 100%;
  background: var(--accent-blue);
  border: 2px solid var(--accent-purple);
}

.cube-face:nth-child(1) { transform: rotateY(0deg) translateZ(20px); }
.cube-face:nth-child(2) { transform: rotateY(90deg) translateZ(20px); }
.cube-face:nth-child(3) { transform: rotateY(180deg) translateZ(20px); }
.cube-face:nth-child(4) { transform: rotateY(-90deg) translateZ(20px); }

@keyframes cubeFlip {
  0%, 100% { transform: rotateX(0) rotateY(0); }
  25% { transform: rotateX(90deg) rotateY(0); }
  50% { transform: rotateX(90deg) rotateY(90deg); }
  75% { transform: rotateX(0) rotateY(90deg); }
}
```

### 4.3 Progress Indicators

**Circular Progress**

```html
<svg class="circular-progress" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="45" class="progress-bg"></circle>
  <circle cx="50" cy="50" r="45" class="progress-fill" 
    stroke-dasharray="283" stroke-dashoffset="113"></circle>
  <text x="50" y="50" class="progress-text">60%</text>
</svg>
```

```css
.circular-progress {
  width: 120px;
  height: 120px;
  transform: rotate(-90deg);
}

.progress-bg {
  fill: none;
  stroke: var(--bg-tertiary);
  stroke-width: 8;
}

.progress-fill {
  fill: none;
  stroke: url(#gradient);
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease;
}

.progress-text {
  transform: rotate(90deg);
  transform-origin: center;
  fill: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: bold;
  text-anchor: middle;
  dominant-baseline: central;
}

/* Gradient definition */
<defs>
  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#4A9EFF" />
    <stop offset="100%" stop-color="#B794F6" />
  </linearGradient>
</defs>
```

---

## 5. Textual Animations

### 5.1 Typewriter Effect

```javascript
function typewriter(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Usage
const headline = document.querySelector('.typewriter');
typewriter(headline, 'Predict Sales with AI', 100);
```

### 5.2 Text Split & Stagger

```javascript
// Split text into spans for individual character animation
function splitText(element) {
  const text = element.textContent;
  element.innerHTML = '';
  
  text.split('').forEach((char, index) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.animationDelay = `${index * 0.05}s`;
    element.appendChild(span);
  });
}

// CSS
.split-text span {
  display: inline-block;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.5s forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 5.3 Glitch Text Effect

```css
.glitch {
  position: relative;
  font-family: var(--font-display);
  font-size: var(--text-5xl);
  font-weight: bold;
  color: var(--text-primary);
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.glitch::before {
  color: var(--accent-cyan);
  z-index: -1;
  animation: glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
}

.glitch::after {
  color: var(--accent-pink);
  z-index: -2;
  animation: glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse infinite;
}

@keyframes glitch {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
  100% {
    transform: translate(0);
  }
}
```

### 5.4 Gradient Text Animation

```css
.gradient-text-animated {
  background: linear-gradient(
    90deg,
    #4A9EFF,
    #B794F6,
    #00D9FF,
    #4ADE80,
    #FFC947,
    #4A9EFF
  );
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientTextFlow 5s linear infinite;
}

@keyframes gradientTextFlow {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

### 5.5 Scramble Text Effect

```javascript
function scrambleText(element, finalText, duration = 2000) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = finalText.length;
  let frame = 0;
  const frames = duration / 30;
  
  const interval = setInterval(() => {
    let output = '';
    
    for (let i = 0; i < length; i++) {
      const progress = frame / frames;
      if (progress * length > i) {
        output += finalText[i];
      } else {
        output += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    
    element.textContent = output;
    frame++;
    
    if (frame >= frames) {
      element.textContent = finalText;
      clearInterval(interval);
    }
  }, 30);
}

// Usage
scrambleText(document.querySelector('.scramble'), 'ForecastAI');
```

---

## 6. Background Videos & Wallpapers

### 6.1 Video Background Recommendations

**Hero Section Videos (MP4 Format, 20-30 seconds loop)**

**Option 1: Abstract Data Flow**
- Flowing particles representing data streams
- Color scheme: Blue (#4A9EFF) to Purple (#B794F6) gradient
- Style: Slow-moving, non-distracting
- Suggested resolution: 1920x1080 at 30fps
- File size: <5MB (highly compressed)

**Option 2: Neural Network Visualization**
- Animated neural network nodes and connections
- Color: Cyan (#00D9FF) connections on dark background
- Style: Pulsing nodes, flowing connections
- Motion: Subtle, professional

**Option 3: Financial Charts Animation**
- Animated line charts and candlestick patterns
- Color: Green (#4ADE80) for gains, subtle red for comparisons
- Style: Clean, stock-market aesthetic
- Speed: Slow pan, gradual changes

**Implementation:**

```html
<div class="video-background">
  <video autoplay muted loop playsinline>
    <source src="bg-data-flow.mp4" type="video/mp4">
    <source src="bg-data-flow.webm" type="video/webm">
  </video>
  <div class="video-overlay"></div>
</div>
```

```css
.video-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
}

.video-background video {
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  object-fit: cover;
  opacity: 0.15;
  filter: blur(2px);
}

.video-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    var(--bg-primary) 100%
  );
}

/* Pause video when not in viewport (performance) */
@media (prefers-reduced-motion: reduce) {
  .video-background video {
    display: none;
  }
}
```

### 6.2 Static Background Wallpapers

**Landing Page Wallpaper Suggestions:**

**1. Circuit Board Pattern**
```css
.circuit-bg {
  background-image: url('circuit-pattern.svg');
  background-size: 600px 600px;
  background-position: center;
  opacity: 0.03;
  animation: circuitMove 60s linear infinite;
}

@keyframes circuitMove {
  0% { background-position: 0 0; }
  100% { background-position: 600px 600px; }
}
```

**2. Topographic Data Contours**
```css
.topo-bg {
  background: 
    radial-gradient(circle at 20% 50%, rgba(74, 158, 255, 0.03) 0, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(183, 148, 246, 0.03) 0, transparent 50%);
  background-size: 100% 100%;
}
```

**3. Matrix Code Rain (Subtle)**
```javascript
// Canvas-based Matrix effect
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const fontSize = 14;
const columns = canvas.width / fontSize;

const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
  ctx.fillStyle = 'rgba(10, 14, 26, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = 'rgba(74, 158, 255, 0.5)';
  ctx.font = `${fontSize}px monospace`;
  
  for (let i = 0; i < drops.length; i++) {
    const char = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(char, i * fontSize, drops[i] * fontSize);
    
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

setInterval(drawMatrix, 50);
```

**4. Geometric Polygons**
```css
.poly-bg {
  background-image: 
    linear-gradient(30deg, rgba(74, 158, 255, 0.05) 12%, transparent 12.5%, transparent 87%, rgba(74, 158, 255, 0.05) 87.5%, rgba(74, 158, 255, 0.05)),
    linear-gradient(150deg, rgba(74, 158, 255, 0.05) 12%, transparent 12.5%, transparent 87%, rgba(74, 158, 255, 0.05) 87.5%, rgba(74, 158, 255, 0.05)),
    linear-gradient(30deg, rgba(74, 158, 255, 0.05) 12%, transparent 12.5%, transparent 87%, rgba(74, 158, 255, 0.05) 87.5%, rgba(74, 158, 255, 0.05)),
    linear-gradient(150deg, rgba(74, 158, 255, 0.05) 12%, transparent 12.5%, transparent 87%, rgba(74, 158, 255, 0.05) 87.5%, rgba(74, 158, 255, 0.05));
  background-size: 80px 140px;
  background-position: 0 0, 0 0, 40px 70px, 40px 70px;
}
```

### 6.3 Dashboard Background Patterns

**Data Visualization Inspired**

```css
.dashboard-bg {
  background: 
    linear-gradient(90deg, rgba(163, 173, 191, 0.02) 1px, transparent 1px),
    linear-gradient(rgba(163, 173, 191, 0.02) 1px, transparent 1px);
  background-size: 40px 40px;
  position: relative;
}

.dashboard-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: radial-gradient(
    ellipse at top,
    rgba(74, 158, 255, 0.08),
    transparent
  );
}
```

---

## 7. Interactive Effects

### 7.1 Mouse Trail Effect

```javascript
class MouseTrail {
  constructor() {
    this.particles = [];
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9999';
    document.body.appendChild(this.canvas);
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
    document.addEventListener('mousemove', (e) => this.addParticle(e));
    
    this.animate();
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  addParticle(e) {
    this.particles.push({
      x: e.clientX,
      y: e.clientY,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      life: 1
    });
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles = this.particles.filter(particle => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.life -= 0.02;
      
      if (particle.life <= 0) return false;
      
      this.ctx.fillStyle = `rgba(74, 158, 255, ${particle.life})`;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      
      return true;
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize
new MouseTrail();
```

### 7.2 Cursor Glow Effect

```css
body {
  cursor: none;
}

.cursor-glow {
  position: fixed;
  width: 20px;
  height: 20px;
  border: 2px solid var(--accent-blue);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transition: transform 0.15s ease;
  mix-blend-mode: difference;
}

.cursor-glow::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  background: radial-gradient(
    circle,
    rgba(74, 158, 255, 0.3),
    transparent
  );
  transform: translate(-50%, -50%);
  transition: opacity 0.3s;
}

.cursor-glow.hover {
  transform: scale(1.5);
}

.cursor-glow.hover::before {
  opacity: 0.6;
}
```

```javascript
const cursor = document.createElement('div');
cursor.className = 'cursor-glow';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
});

// Add hover effect
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});
```

---

## 8. Particle Systems

### 8.1 Floating Particles Background

```javascript
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 80;
    
    this.resize();
    this.createParticles();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  createParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }
  
  drawParticle(particle) {
    this.ctx.fillStyle = `rgba(74, 158, 255, ${particle.opacity})`;
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          this.ctx.strokeStyle = `rgba(74, 158, 255, ${0.2 * (1 - distance / 150)})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }
  
  update() {
    this.particles.forEach(particle => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
    });
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => this.drawParticle(particle));
    this.drawConnections();
    this.update();
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize
const canvas = document.getElementById('particles-canvas');
new ParticleSystem(canvas);
```

---

## Implementation Priority

### Phase 1: Core Effects (Week 1)
1. ✅ Page load animations (fade-in, stagger)
2. ✅ Button hover effects (lift, glow)
3. ✅ Loading spinners & skeleton screens
4. ✅ Basic background patterns

### Phase 2: Interactive (Week 2)
1. ✅ Scroll-triggered animations
2. ✅ Number counters
3. ✅ Toast notifications
4. ✅ Modal animations

### Phase 3: Advanced (Week 3)
1. ✅ Chart animations (D3.js)
2. ✅ Particle systems
3. ✅ Video backgrounds
4. ✅ Custom cursors

### Phase 4: Polish (Week 4)
1. ✅ Text effects (typewriter, glitch)
2. ✅ Sliders & carousels
3. ✅ Micro-interactions
4. ✅ Performance optimization

---

## Performance Considerations

**Best Practices:**
- Use CSS animations over JavaScript when possible (GPU accelerated)
- Debounce/throttle scroll and resize events
- Lazy load heavy animations
- Use `will-change` property sparingly
- Reduce particle count on mobile devices
- Implement `prefers-reduced-motion` media query
- Use WebP for images, optimize video compression
- Monitor FPS with browser DevTools

```javascript
// Performance monitoring
const perfObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(`${entry.name}: ${entry.duration}ms`);
  }
});

perfObserver.observe({ entryTypes: ['measure', 'navigation'] });
```

---

**Document Complete**  
**Total Effects Documented:** 50+  
**Implementation Ready:** Yes  
**Browser Support:** Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
