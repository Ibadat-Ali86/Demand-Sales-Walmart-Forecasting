# ForecastAI SaaS Platform - UI/UX Design System Documentation
### Professional Redesign Specification for Data Scientists & ML Engineers

**Version:** 2.0  
**Date:** February 2026  
**Target Users:** Data Scientists, ML Engineers, Technical Analysts  
**Platform Type:** B2B SaaS - Retail Analytics & Demand Forecasting  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Design Philosophy](#2-design-philosophy)
3. [Visual Identity & Design System](#3-visual-identity--design-system)
4. [Component Library](#4-component-library)
5. [Page-by-Page Specifications](#5-page-by-page-specifications)
6. [Animation & Interaction Design](#6-animation--interaction-design)
7. [Responsive Design Strategy](#7-responsive-design-strategy)
8. [Accessibility Standards](#8-accessibility-standards)
9. [Implementation Guidelines](#9-implementation-guidelines)
10. [Performance Optimization](#10-performance-optimization)

---

## 1. Executive Summary

### 1.1 Design Objectives

**Primary Goal:** Create a sophisticated, data-dense interface that empowers technical users with advanced forecasting tools while maintaining clarity and reducing cognitive load.

**Key Design Principles:**

| Principle | Description | Implementation |
|-----------|-------------|----------------|
| **Data First** | Prioritize information density and quick access to metrics | High-contrast charts, multi-panel layouts |
| **Technical Precision** | Speak the language of data scientists | Statistical notation, model parameters visible |
| **Speed & Efficiency** | Minimize clicks, maximize keyboard shortcuts | Command palette, hotkeys, batch operations |
| **Visual Hierarchy** | Guide attention through careful typography and spacing | Monospace for data, clear headers, color coding |

### 1.2 Current State Analysis Issues

Based on standard ML SaaS platforms, common problems to address:

- ❌ Generic Bootstrap/Material UI appearance lacking professional polish
- ❌ Overcomplicated navigation requiring too many clicks
- ❌ Poor data visualization (default chart.js styling)
- ❌ Inconsistent spacing and typography
- ❌ Missing loading states and error handling UX
- ❌ No dark mode for extended work sessions
- ❌ Limited keyboard navigation
- ❌ Mobile-unfriendly data tables

### 1.3 Redesign Goals

✅ **Professional, Technical Aesthetic** - Terminal/IDE inspired dark theme  
✅ **Instant Visual Feedback** - Real-time metrics, progress indicators  
✅ **Advanced Data Viz** - D3.js custom charts, interactive time series  
✅ **Keyboard-First Navigation** - Vim-like shortcuts, command palette  
✅ **Responsive Data Grids** - Collapsible columns, horizontal scrolling  
✅ **Micro-Animations** - Smooth transitions, delightful interactions  

---

## 2. Design Philosophy

### 2.1 Aesthetic Direction: **"Data Terminal" - Technical Sophistication**

**Inspiration Sources:**
- IDE/Terminal interfaces (VSCode, iTerm2)
- Financial trading platforms (Bloomberg Terminal, TradingView)
- Scientific visualization tools (Jupyter, Observable)
- Modern dev tools (Vercel, Railway)

**Core Aesthetic Attributes:**

```
┌─────────────────────────────────────────┐
│ DARK BACKGROUNDS    - Reduce eye strain │
│ MONOSPACE FONTS     - Technical clarity │
│ GRID-BASED LAYOUTS  - Precision & order │
│ DATA VISUALIZATIONS - Primary focus     │
│ SUBTLE ANIMATIONS   - Professional feel │
│ NEON ACCENTS        - Status indicators │
└─────────────────────────────────────────┘
```

### 2.2 User Mental Model

**Technical User Expectations:**
1. **Information Density** - Show more, scroll less
2. **Customizability** - Configurable dashboards, saved views
3. **Transparency** - See underlying data, download CSVs
4. **Version Control** - Track model iterations, compare results
5. **Batch Operations** - Multi-select, bulk actions

### 2.3 Emotional Journey

```
Landing Page     → Confidence (Professional, trustworthy)
Sign Up          → Ease (Friction-free onboarding)
Dashboard        → Control (Power at fingertips)
Model Training   → Progress (Clear status, ETA)
Results          → Insight (Actionable intelligence)
```

---

## 3. Visual Identity & Design System

### 3.1 Color Palette

#### Primary: **Dark Terminal Theme**

```css
/* Base Colors */
--bg-primary:      #0A0E1A;    /* Deep navy black */
--bg-secondary:    #131829;    /* Slightly lighter panels */
--bg-tertiary:     #1C2333;    /* Hover states */
--bg-elevated:     #242B3D;    /* Cards, modals */

/* Text Colors */
--text-primary:    #E8EDF4;    /* High contrast white */
--text-secondary:  #A3ADBF;    /* Muted descriptions */
--text-tertiary:   #6B7790;    /* Disabled, placeholders */

/* Accent Colors */
--accent-blue:     #4A9EFF;    /* Primary actions, links */
--accent-cyan:     #00D9FF;    /* Data viz - positive trends */
--accent-purple:   #B794F6;    /* ML model indicators */
--accent-pink:     #FF6B9D;    /* Warnings, alerts */
--accent-green:    #4ADE80;    /* Success, completed */
--accent-yellow:   #FFC947;    /* Pending, in-progress */
--accent-red:      #FF5757;    /* Errors, critical */

/* Data Visualization Palette (Colorblind-Safe) */
--viz-1: #4A9EFF;  /* Blue */
--viz-2: #4ADE80;  /* Green */
--viz-3: #FFC947;  /* Yellow */
--viz-4: #FF6B9D;  /* Pink */
--viz-5: #B794F6;  /* Purple */
--viz-6: #00D9FF;  /* Cyan */
--viz-7: #FF8A5B;  /* Orange */
--viz-8: #8B5CF6;  /* Deep purple */
```

#### Semantic Colors

```css
/* Status */
--status-info:     var(--accent-blue);
--status-success:  var(--accent-green);
--status-warning:  var(--accent-yellow);
--status-error:    var(--accent-red);

/* Borders & Dividers */
--border-primary:  rgba(163, 173, 191, 0.12);
--border-focus:    var(--accent-blue);
--border-error:    var(--accent-red);

/* Shadows */
--shadow-sm:  0 1px 3px rgba(0, 0, 0, 0.4);
--shadow-md:  0 4px 12px rgba(0, 0, 0, 0.5);
--shadow-lg:  0 20px 40px rgba(0, 0, 0, 0.6);
--shadow-xl:  0 40px 80px rgba(0, 0, 0, 0.7);

/* Glassmorphism */
--glass-bg:    rgba(28, 35, 51, 0.6);
--glass-blur:  blur(24px);
```

### 3.2 Typography System

#### Font Families

```css
/* Display/Headings - Modern Geometric Sans */
--font-display: 'Space Grotesk', 'Inter', system-ui, sans-serif;

/* Body Text - Clean Sans-Serif */
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Code/Data - Monospace */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;

/* Import fonts */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
```

#### Type Scale

```css
/* Font Sizes */
--text-xs:    0.75rem;   /* 12px - Labels, captions */
--text-sm:    0.875rem;  /* 14px - Body small */
--text-base:  1rem;      /* 16px - Body text */
--text-lg:    1.125rem;  /* 18px - Emphasized */
--text-xl:    1.25rem;   /* 20px - H5 */
--text-2xl:   1.5rem;    /* 24px - H4 */
--text-3xl:   1.875rem;  /* 30px - H3 */
--text-4xl:   2.25rem;   /* 36px - H2 */
--text-5xl:   3rem;      /* 48px - H1 */
--text-6xl:   3.75rem;   /* 60px - Hero */

/* Line Heights */
--leading-tight:   1.25;
--leading-normal:  1.5;
--leading-relaxed: 1.75;

/* Font Weights */
--font-light:   300;
--font-normal:  400;
--font-medium:  500;
--font-semibold: 600;
--font-bold:    700;
```

#### Typography Usage Rules

| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| H1 (Page Title) | Space Grotesk | 3xl-4xl | 700 | tight |
| H2 (Section) | Space Grotesk | 2xl-3xl | 600 | tight |
| H3 (Subsection) | Space Grotesk | xl-2xl | 600 | normal |
| Body Text | Inter | base | 400 | normal |
| Captions | Inter | sm | 500 | normal |
| Data/Metrics | JetBrains Mono | base-lg | 600 | tight |
| Code Blocks | JetBrains Mono | sm | 400 | relaxed |

### 3.3 Spacing System

**8px Base Grid** - All spacing should be multiples of 8px for visual consistency.

```css
--space-0:    0;
--space-1:    0.25rem;  /* 4px */
--space-2:    0.5rem;   /* 8px */
--space-3:    0.75rem;  /* 12px */
--space-4:    1rem;     /* 16px */
--space-5:    1.25rem;  /* 20px */
--space-6:    1.5rem;   /* 24px */
--space-8:    2rem;     /* 32px */
--space-10:   2.5rem;   /* 40px */
--space-12:   3rem;     /* 48px */
--space-16:   4rem;     /* 64px */
--space-20:   5rem;     /* 80px */
--space-24:   6rem;     /* 96px */
```

**Component Spacing Guidelines:**

- Card Padding: `--space-6` (24px)
- Section Gaps: `--space-12` (48px)
- Element Margins: `--space-4` (16px)
- Button Padding: `--space-3` horizontal, `--space-2` vertical
- Input Padding: `--space-3` (12px)

### 3.4 Border Radius System

```css
--radius-sm:   0.25rem;  /* 4px - Small elements */
--radius-md:   0.5rem;   /* 8px - Buttons, inputs */
--radius-lg:   0.75rem;  /* 12px - Cards */
--radius-xl:   1rem;     /* 16px - Modals */
--radius-2xl:  1.5rem;   /* 24px - Large panels */
--radius-full: 9999px;   /* Circular */
```

### 3.5 Animation Timings

```css
--duration-fast:    150ms;
--duration-base:    250ms;
--duration-slow:    350ms;
--duration-slower:  500ms;

--easing-ease-in:     cubic-bezier(0.4, 0, 1, 1);
--easing-ease-out:    cubic-bezier(0, 0, 0.2, 1);
--easing-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--easing-bounce:      cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

---

## 4. Component Library

### 4.1 Core Components

#### Button Variants

**Primary Button**
```css
.btn-primary {
  background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  transition: all var(--duration-base) var(--easing-ease-out);
  box-shadow: 0 4px 12px rgba(74, 158, 255, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 158, 255, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}
```

**Secondary Button**
```css
.btn-secondary {
  background: transparent;
  border: 1.5px solid var(--border-primary);
  color: var(--text-primary);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  transition: all var(--duration-base);
}

.btn-secondary:hover {
  border-color: var(--accent-blue);
  background: rgba(74, 158, 255, 0.08);
}
```

**Icon Button**
```css
.btn-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary);
  transition: all var(--duration-fast);
}

.btn-icon:hover {
  background: var(--bg-elevated);
  transform: scale(1.05);
}
```

#### Input Fields

**Text Input**
```css
.input-field {
  background: var(--bg-secondary);
  border: 1.5px solid var(--border-primary);
  color: var(--text-primary);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-base);
  transition: all var(--duration-base);
}

.input-field:focus {
  border-color: var(--accent-blue);
  background: var(--bg-elevated);
  box-shadow: 0 0 0 3px rgba(74, 158, 255, 0.1);
  outline: none;
}

.input-field::placeholder {
  color: var(--text-tertiary);
}
```

**Select Dropdown**
```css
.select-field {
  background: var(--bg-secondary);
  border: 1.5px solid var(--border-primary);
  color: var(--text-primary);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml...");  /* Custom dropdown arrow */
}
```

#### Card Component

```css
.card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  transition: all var(--duration-base);
}

.card:hover {
  border-color: rgba(74, 158, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--border-primary);
}

.card-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}
```

#### Badge Component

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-success {
  background: rgba(74, 222, 128, 0.15);
  color: var(--accent-green);
  border: 1px solid rgba(74, 222, 128, 0.3);
}

.badge-warning {
  background: rgba(255, 201, 71, 0.15);
  color: var(--accent-yellow);
  border: 1px solid rgba(255, 201, 71, 0.3);
}

.badge-error {
  background: rgba(255, 87, 87, 0.15);
  color: var(--accent-red);
  border: 1px solid rgba(255, 87, 87, 0.3);
}
```

#### Progress Bar

```css
.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-blue), var(--accent-cyan));
  border-radius: var(--radius-full);
  transition: width var(--duration-slow) var(--easing-ease-out);
  position: relative;
  overflow: hidden;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.3), 
    transparent
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

#### Data Table

```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

.data-table thead {
  background: var(--bg-tertiary);
  border-bottom: 2px solid var(--border-primary);
}

.data-table th {
  padding: var(--space-3);
  text-align: left;
  font-weight: var(--font-semibold);
  color: var(--text-secondary);
  text-transform: uppercase;
  font-size: var(--text-xs);
  letter-spacing: 0.5px;
}

.data-table td {
  padding: var(--space-4) var(--space-3);
  border-bottom: 1px solid var(--border-primary);
  color: var(--text-primary);
}

.data-table tbody tr {
  transition: background var(--duration-fast);
}

.data-table tbody tr:hover {
  background: rgba(74, 158, 255, 0.05);
}

/* Zebra striping */
.data-table tbody tr:nth-child(even) {
  background: rgba(163, 173, 191, 0.02);
}
```

#### Tooltip

```css
.tooltip {
  position: absolute;
  background: var(--bg-elevated);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  color: var(--text-primary);
  box-shadow: var(--shadow-lg);
  pointer-events: none;
  z-index: 1000;
  opacity: 0;
  transition: opacity var(--duration-base);
}

.tooltip.visible {
  opacity: 1;
}

.tooltip::before {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid var(--bg-elevated);
}
```

### 4.2 Chart Components

#### Time Series Chart Styling

```javascript
// D3.js / Recharts / Chart.js Configuration
const chartTheme = {
  backgroundColor: 'transparent',
  textStyle: {
    color: '#A3ADBF',
    fontFamily: 'JetBrains Mono'
  },
  grid: {
    borderColor: 'rgba(163, 173, 191, 0.08)',
    borderWidth: 1
  },
  lineStyle: {
    width: 2.5,
    shadowBlur: 4,
    shadowColor: 'rgba(74, 158, 255, 0.3)'
  },
  areaStyle: {
    opacity: 0.15
  },
  tooltip: {
    backgroundColor: 'rgba(28, 35, 51, 0.95)',
    borderColor: 'rgba(163, 173, 191, 0.2)',
    textStyle: {
      color: '#E8EDF4',
      fontFamily: 'JetBrains Mono',
      fontSize: 13
    }
  }
};
```

---

## 5. Page-by-Page Specifications

### 5.1 Landing Page

**URL:** `/`  
**Purpose:** Convert visitors into users, communicate value proposition  
**Key Sections:** Hero, Features, How It Works, Pricing, CTA  

#### Layout Structure

```
┌─────────────────────────────────────────────────────┐
│ NAVIGATION (Fixed Header)                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│               HERO SECTION                          │
│  [Animated Background Gradient Mesh]               │
│   Large Headline + Subtext + CTA                   │
│                                                     │
├─────────────────────────────────────────────────────┤
│           FEATURES GRID (3 columns)                │
│  [Icon] Feature 1  [Icon] Feature 2  [Icon] Feature│
├─────────────────────────────────────────────────────┤
│         INTERACTIVE DEMO SECTION                    │
│  [Live Chart Preview] + Sample Predictions         │
├─────────────────────────────────────────────────────┤
│            HOW IT WORKS (Timeline)                  │
│  Step 1 → Step 2 → Step 3 → Step 4                │
├─────────────────────────────────────────────────────┤
│             STATS SECTION                           │
│  [Counter Animations] 98.77% Accuracy, etc.       │
├─────────────────────────────────────────────────────┤
│                FOOTER                               │
└─────────────────────────────────────────────────────┘
```

#### Navigation Bar

```html
<nav class="nav-bar">
  <div class="nav-container">
    <div class="nav-logo">
      <svg>...</svg> ForecastAI
    </div>
    
    <div class="nav-links">
      <a href="#features">Features</a>
      <a href="#how-it-works">How It Works</a>
      <a href="#pricing">Pricing</a>
      <a href="#docs">Docs</a>
    </div>
    
    <div class="nav-actions">
      <button class="btn-secondary">Sign In</button>
      <button class="btn-primary">Get Started</button>
    </div>
  </div>
</nav>
```

**Styling:**
```css
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(10, 14, 26, 0.8);
  backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--border-primary);
  padding: var(--space-4) 0;
}

.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-6);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

.nav-links {
  display: flex;
  gap: var(--space-8);
}

.nav-links a {
  color: var(--text-secondary);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  transition: color var(--duration-fast);
  position: relative;
}

.nav-links a:hover {
  color: var(--accent-blue);
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent-blue);
  transform: scaleX(0);
  transition: transform var(--duration-base);
}

.nav-links a:hover::after {
  transform: scaleX(1);
}
```

#### Hero Section

```html
<section class="hero">
  <div class="hero-background">
    <!-- Animated gradient mesh -->
    <canvas id="gradient-canvas"></canvas>
  </div>
  
  <div class="hero-content">
    <div class="hero-badge">
      <span class="badge badge-success">98.77% Accuracy</span>
    </div>
    
    <h1 class="hero-title">
      Retail Sales Forecasting
      <span class="gradient-text">Powered by AI</span>
    </h1>
    
    <p class="hero-subtitle">
      Enterprise-grade demand forecasting combining LSTM, XGBoost, and Prophet models.
      Built for data scientists who demand precision.
    </p>
    
    <div class="hero-cta">
      <button class="btn-primary btn-large">
        Start Free Trial
        <svg>→</svg>
      </button>
      <button class="btn-secondary btn-large">
        View Documentation
      </button>
    </div>
    
    <div class="hero-stats">
      <div class="stat">
        <div class="stat-value" data-count="45">0</div>
        <div class="stat-label">Stores</div>
      </div>
      <div class="stat">
        <div class="stat-value" data-count="421570">0</div>
        <div class="stat-label">Predictions</div>
      </div>
      <div class="stat">
        <div class="stat-value">1.23%</div>
        <div class="stat-label">MAPE</div>
      </div>
    </div>
  </div>
  
  <div class="hero-visual">
    <!-- Interactive chart preview -->
    <div class="chart-preview">
      <canvas id="live-chart"></canvas>
    </div>
  </div>
</section>
```

**Styling:**
```css
.hero {
  position: relative;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: var(--space-16);
  padding: var(--space-24) var(--space-6);
  max-width: 1280px;
  margin: 0 auto;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  opacity: 0.4;
}

.hero-title {
  font-family: var(--font-display);
  font-size: var(--text-6xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--text-primary);
  margin-bottom: var(--space-6);
}

.gradient-text {
  background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: var(--text-xl);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-8);
  max-width: 600px;
}

.hero-cta {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-12);
}

.btn-large {
  padding: var(--space-4) var(--space-8);
  font-size: var(--text-lg);
}

.hero-stats {
  display: flex;
  gap: var(--space-12);
  padding-top: var(--space-8);
  border-top: 1px solid var(--border-primary);
}

.stat-value {
  font-family: var(--font-mono);
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--accent-blue);
  margin-bottom: var(--space-2);
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
}
```

**Animations:**

1. **Counter Animation** (JavaScript)
```javascript
// Animate stat counters
document.querySelectorAll('.stat-value[data-count]').forEach(stat => {
  const target = parseInt(stat.dataset.count);
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;
  
  const animate = () => {
    current += increment;
    if (current < target) {
      stat.textContent = Math.floor(current).toLocaleString();
      requestAnimationFrame(animate);
    } else {
      stat.textContent = target.toLocaleString();
    }
  };
  
  // Start when in viewport
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animate();
      observer.disconnect();
    }
  });
  observer.observe(stat);
});
```

2. **Gradient Mesh Background** (Canvas)
```javascript
// Animated gradient mesh using WebGL or Canvas 2D
const canvas = document.getElementById('gradient-canvas');
const ctx = canvas.getContext('2d');

// Create flowing gradient animation
function animateGradient() {
  const time = Date.now() * 0.0001;
  
  const gradient = ctx.createLinearGradient(
    Math.sin(time) * canvas.width,
    0,
    canvas.width,
    Math.cos(time) * canvas.height
  );
  
  gradient.addColorStop(0, 'rgba(74, 158, 255, 0.1)');
  gradient.addColorStop(0.5, 'rgba(183, 148, 246, 0.1)');
  gradient.addColorStop(1, 'rgba(0, 217, 255, 0.1)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  requestAnimationFrame(animateGradient);
}
animateGradient();
```

#### Features Section

```html
<section class="features">
  <div class="section-header">
    <h2 class="section-title">Advanced Forecasting Capabilities</h2>
    <p class="section-subtitle">
      Production-grade ML pipeline with ensemble methods
    </p>
  </div>
  
  <div class="features-grid">
    <div class="feature-card">
      <div class="feature-icon">
        <svg>...</svg> <!-- Brain/Neural network icon -->
      </div>
      <h3 class="feature-title">Ensemble Models</h3>
      <p class="feature-description">
        Combines LSTM, XGBoost, and Prophet for superior accuracy. 
        Weighted voting based on historical performance.
      </p>
      <ul class="feature-list">
        <li><span class="checkmark">✓</span> Deep Learning (LSTM)</li>
        <li><span class="checkmark">✓</span> Gradient Boosting (XGBoost)</li>
        <li><span class="checkmark">✓</span> Time Series (Prophet)</li>
      </ul>
    </div>
    
    <div class="feature-card">
      <div class="feature-icon">
        <svg>...</svg> <!-- Chart icon -->
      </div>
      <h3 class="feature-title">Real-Time Analytics</h3>
      <p class="feature-description">
        Interactive dashboards with customizable metrics, alerts, and automated reporting.
      </p>
      <ul class="feature-list">
        <li><span class="checkmark">✓</span> Live Model Training</li>
        <li><span class="checkmark">✓</span> Custom Dashboards</li>
        <li><span class="checkmark">✓</span> API Integration</li>
      </ul>
    </div>
    
    <div class="feature-card">
      <div class="feature-icon">
        <svg>...</svg> <!-- Data icon -->
      </div>
      <h3 class="feature-title">Feature Engineering</h3>
      <p class="feature-description">
        Automatic lag features, rolling statistics, and temporal decomposition.
      </p>
      <ul class="feature-list">
        <li><span class="checkmark">✓</span> 50+ Auto Features</li>
        <li><span class="checkmark">✓</span> Custom Transformations</li>
        <li><span class="checkmark">✓</span> Missing Value Handling</li>
      </ul>
    </div>
    
    <!-- Additional 3 feature cards... -->
  </div>
</section>
```

**Styling:**
```css
.features {
  padding: var(--space-24) var(--space-6);
  max-width: 1280px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-16);
}

.section-title {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-4);
}

.section-subtitle {
  font-size: var(--text-xl);
  color: var(--text-secondary);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-8);
}

.feature-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  transition: all var(--duration-base);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent-blue), var(--accent-purple));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--duration-base);
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-card:hover {
  border-color: rgba(74, 158, 255, 0.4);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.feature-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-6);
}

.feature-icon svg {
  width: 32px;
  height: 32px;
  color: white;
}

.feature-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}

.feature-description {
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-4);
}

.feature-list {
  list-style: none;
  padding: 0;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  margin-bottom: var(--space-2);
}

.checkmark {
  color: var(--accent-green);
  font-weight: var(--font-bold);
}
```

**Animation on Scroll:**
```javascript
// Stagger animation for feature cards
const featureCards = document.querySelectorAll('.feature-card');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100); // Stagger by 100ms
      }
    });
  },
  { threshold: 0.2 }
);

featureCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(40px)';
  card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
  observer.observe(card);
});
```

### 5.2 Authentication Pages

#### Sign Up Page

**URL:** `/signup`  
**Purpose:** User registration with minimal friction  

**Layout:**
```
┌──────────────────────────────────────────┐
│  Logo                      [Sign In] →   │
├──────────────────────────────────────────┤
│                                          │
│  ┌──────────────┐   ┌─────────────────┐ │
│  │              │   │                 │ │
│  │  Left Panel  │   │  Sign Up Form   │ │
│  │  (Benefits)  │   │                 │ │
│  │              │   │                 │ │
│  └──────────────┘   └─────────────────┘ │
│                                          │
└──────────────────────────────────────────┘
```

```html
<div class="auth-page">
  <div class="auth-container">
    
    <!-- Left Panel -->
    <div class="auth-left">
      <div class="auth-logo">
        <svg>...</svg>
        <span>ForecastAI</span>
      </div>
      
      <h2 class="auth-headline">
        Start forecasting in minutes
      </h2>
      
      <ul class="auth-benefits">
        <li>
          <svg class="check-icon">✓</svg>
          <div>
            <strong>No credit card required</strong>
            <p>Start with 1000 free predictions</p>
          </div>
        </li>
        <li>
          <svg class="check-icon">✓</svg>
          <div>
            <strong>Advanced ML models</strong>
            <p>LSTM, XGBoost, Prophet ensemble</p>
          </div>
        </li>
        <li>
          <svg class="check-icon">✓</svg>
          <div>
            <strong>API access included</strong>
            <p>RESTful API with Python SDK</p>
          </div>
        </li>
      </ul>
      
      <div class="auth-testimonial">
        <div class="testimonial-quote">
          "Reduced our forecasting error by 40% in the first month."
        </div>
        <div class="testimonial-author">
          <img src="..." alt="..." />
          <div>
            <div class="author-name">Sarah Chen</div>
            <div class="author-title">ML Engineer, RetailCorp</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Right Panel - Form -->
    <div class="auth-right">
      <div class="auth-form-container">
        <h1 class="auth-title">Create Account</h1>
        <p class="auth-subtitle">Get started with your free trial</p>
        
        <!-- Social Sign Up -->
        <div class="social-auth">
          <button class="social-btn">
            <svg>GitHub</svg>
            Continue with GitHub
          </button>
          <button class="social-btn">
            <svg>Google</svg>
            Continue with Google
          </button>
        </div>
        
        <div class="divider">
          <span>or</span>
        </div>
        
        <!-- Email Form -->
        <form class="auth-form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              class="input-field"
              placeholder="John Doe"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              class="input-field"
              placeholder="john@company.com"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-input">
              <input 
                type="password" 
                id="password" 
                class="input-field"
                placeholder="••••••••"
                required
              />
              <button type="button" class="toggle-password">
                <svg>👁</svg>
              </button>
            </div>
            <div class="password-strength">
              <div class="strength-bar"></div>
              <span class="strength-text">Weak</span>
            </div>
          </div>
          
          <div class="form-group checkbox-group">
            <input type="checkbox" id="terms" required />
            <label for="terms">
              I agree to the <a href="/terms">Terms of Service</a> and 
              <a href="/privacy">Privacy Policy</a>
            </label>
          </div>
          
          <button type="submit" class="btn-primary btn-full">
            Create Account
          </button>
        </form>
        
        <div class="auth-footer">
          Already have an account? 
          <a href="/signin" class="auth-link">Sign In</a>
        </div>
      </div>
    </div>
    
  </div>
</div>
```

**Styling:**
```css
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  padding: var(--space-6);
}

.auth-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1200px;
  width: 100%;
  background: var(--bg-secondary);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
}

.auth-left {
  background: linear-gradient(135deg, 
    rgba(74, 158, 255, 0.1),
    rgba(183, 148, 246, 0.1)
  );
  padding: var(--space-16);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.auth-logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-12);
}

.auth-headline {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  line-height: var(--leading-tight);
  margin-bottom: var(--space-8);
}

.auth-benefits {
  list-style: none;
  padding: 0;
  margin-bottom: var(--space-12);
}

.auth-benefits li {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.check-icon {
  width: 24px;
  height: 24px;
  background: var(--accent-green);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bg-primary);
  flex-shrink: 0;
}

.auth-benefits strong {
  display: block;
  color: var(--text-primary);
  font-size: var(--text-lg);
  margin-bottom: var(--space-1);
}

.auth-benefits p {
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.auth-testimonial {
  background: var(--bg-elevated);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

.testimonial-quote {
  color: var(--text-primary);
  font-size: var(--text-lg);
  font-style: italic;
  margin-bottom: var(--space-4);
  line-height: var(--leading-relaxed);
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.testimonial-author img {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
}

.author-name {
  color: var(--text-primary);
  font-weight: var(--font-semibold);
}

.author-title {
  color: var(--text-tertiary);
  font-size: var(--text-sm);
}

/* Right Panel - Form */
.auth-right {
  padding: var(--space-16);
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-form-container {
  width: 100%;
  max-width: 400px;
}

.auth-title {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.auth-subtitle {
  color: var(--text-secondary);
  font-size: var(--text-lg);
  margin-bottom: var(--space-8);
}

.social-auth {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: transparent;
  border: 1.5px solid var(--border-primary);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--duration-base);
}

.social-btn:hover {
  border-color: var(--accent-blue);
  background: rgba(74, 158, 255, 0.05);
}

.divider {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin: var(--space-6) 0;
  color: var(--text-tertiary);
  font-size: var(--text-sm);
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border-primary);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.form-group label {
  display: block;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-2);
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-tertiary);
  padding: var(--space-2);
}

.password-strength {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-top: var(--space-2);
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.strength-bar::after {
  content: '';
  display: block;
  height: 100%;
  background: var(--accent-red);
  width: 33%;
  transition: all var(--duration-base);
}

.strength-bar.medium::after {
  background: var(--accent-yellow);
  width: 66%;
}

.strength-bar.strong::after {
  background: var(--accent-green);
  width: 100%;
}

.strength-text {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  font-family: var(--font-mono);
  text-transform: uppercase;
}

.checkbox-group {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
}

.checkbox-group input[type="checkbox"] {
  margin-top: 4px;
  width: 18px;
  height: 18px;
  accent-color: var(--accent-blue);
}

.checkbox-group label {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.checkbox-group a {
  color: var(--accent-blue);
  text-decoration: none;
  transition: color var(--duration-fast);
}

.checkbox-group a:hover {
  color: var(--accent-cyan);
  text-decoration: underline;
}

.btn-full {
  width: 100%;
}

.auth-footer {
  text-align: center;
  margin-top: var(--space-6);
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.auth-link {
  color: var(--accent-blue);
  text-decoration: none;
  font-weight: var(--font-semibold);
  transition: color var(--duration-fast);
}

.auth-link:hover {
  color: var(--accent-cyan);
}
```

**JavaScript for Password Strength:**
```javascript
const passwordInput = document.getElementById('password');
const strengthBar = document.querySelector('.strength-bar');
const strengthText = document.querySelector('.strength-text');

passwordInput.addEventListener('input', (e) => {
  const password = e.target.value;
  const strength = calculatePasswordStrength(password);
  
  strengthBar.className = 'strength-bar';
  if (strength >= 3) {
    strengthBar.classList.add('strong');
    strengthText.textContent = 'Strong';
    strengthText.style.color = 'var(--accent-green)';
  } else if (strength >= 2) {
    strengthBar.classList.add('medium');
    strengthText.textContent = 'Medium';
    strengthText.style.color = 'var(--accent-yellow)';
  } else {
    strengthText.textContent = 'Weak';
    strengthText.style.color = 'var(--accent-red)';
  }
});

function calculatePasswordStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
  if (password.match(/\d/)) strength++;
  if (password.match(/[^a-zA-Z\d]/)) strength++;
  return strength;
}
```

### 5.3 Dashboard Overview

**URL:** `/dashboard`  
**Purpose:** Central hub showing key metrics, recent forecasts, quick actions  

**Layout Structure:**
```
┌─────────────────────────────────────────────────────────┐
│ SIDEBAR │           TOP NAVIGATION                      │
│         ├─────────────────────────────────────────────┤
│ [Logo]  │  KPI Cards (4 columns)                      │
│         │  [Accuracy] [MAE] [RMSE] [Predictions]      │
│ • Dash  ├─────────────────────────────────────────────┤
│ • Data  │                                             │
│ • Model │  Main Chart: Weekly Sales Forecast         │
│ • Analy │  [Interactive Time Series Line Chart]      │
│ • Admin ├─────────────────────────────────────────────┤
│         │  Recent Activity │ Quick Actions           │
│ [User]  │  [Table]         │ [Buttons]               │
└─────────┴──────────────────┴─────────────────────────┘
```

```html
<div class="dashboard-layout">
  
  <!-- Sidebar -->
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="sidebar-logo">
        <svg>...</svg>
        <span>ForecastAI</span>
      </div>
    </div>
    
    <nav class="sidebar-nav">
      <a href="/dashboard" class="nav-item active">
        <svg class="nav-icon">📊</svg>
        <span>Dashboard</span>
      </a>
      <a href="/data" class="nav-item">
        <svg class="nav-icon">💾</svg>
        <span>Data Management</span>
        <span class="nav-badge">3</span>
      </a>
      <a href="/models" class="nav-item">
        <svg class="nav-icon">🤖</svg>
        <span>Model Training</span>
      </a>
      <a href="/analytics" class="nav-item">
        <svg class="nav-icon">📈</svg>
        <span>Analytics</span>
      </a>
      
      <div class="nav-divider"></div>
      
      <a href="/settings" class="nav-item">
        <svg class="nav-icon">⚙️</svg>
        <span>Settings</span>
      </a>
      <a href="/docs" class="nav-item">
        <svg class="nav-icon">📖</svg>
        <span>Documentation</span>
      </a>
    </nav>
    
    <div class="sidebar-footer">
      <div class="user-menu">
        <img src="avatar.jpg" alt="User" class="user-avatar" />
        <div class="user-info">
          <div class="user-name">John Doe</div>
          <div class="user-email">john@company.com</div>
        </div>
        <button class="user-menu-btn">⋯</button>
      </div>
    </div>
  </aside>
  
  <!-- Main Content -->
  <main class="dashboard-main">
    
    <!-- Top Navigation -->
    <header class="top-nav">
      <div class="top-nav-left">
        <h1 class="page-title">Dashboard</h1>
        <div class="breadcrumb">
          <span>Home</span>
          <span class="separator">›</span>
          <span class="current">Dashboard</span>
        </div>
      </div>
      
      <div class="top-nav-right">
        <button class="btn-icon" aria-label="Notifications">
          <svg>🔔</svg>
          <span class="notification-dot"></span>
        </button>
        <button class="btn-icon" aria-label="Search">
          <svg>🔍</svg>
        </button>
        <button class="btn-primary">
          <svg>+</svg>
          New Forecast
        </button>
      </div>
    </header>
    
    <!-- KPI Cards -->
    <section class="kpi-section">
      <div class="kpi-grid">
        
        <div class="kpi-card">
          <div class="kpi-header">
            <div class="kpi-label">Model Accuracy</div>
            <div class="kpi-icon" style="background: var(--accent-green);">
              <svg>✓</svg>
            </div>
          </div>
          <div class="kpi-value">98.77%</div>
          <div class="kpi-change positive">
            <svg>↑</svg>
            +2.3% from last week
          </div>
          <div class="kpi-sparkline">
            <!-- Mini line chart -->
            <canvas id="accuracy-sparkline"></canvas>
          </div>
        </div>
        
        <div class="kpi-card">
          <div class="kpi-header">
            <div class="kpi-label">Mean Absolute Error</div>
            <div class="kpi-icon" style="background: var(--accent-blue);">
              <svg>📊</svg>
            </div>
          </div>
          <div class="kpi-value">$176</div>
          <div class="kpi-change negative">
            <svg>↓</svg>
            -5.2% from last week
          </div>
          <div class="kpi-sparkline">
            <canvas id="mae-sparkline"></canvas>
          </div>
        </div>
        
        <div class="kpi-card">
          <div class="kpi-header">
            <div class="kpi-label">Active Models</div>
            <div class="kpi-icon" style="background: var(--accent-purple);">
              <svg>🤖</svg>
            </div>
          </div>
          <div class="kpi-value">5</div>
          <div class="kpi-change neutral">
            <svg>—</svg>
            No change
          </div>
          <div class="kpi-sparkline">
            <canvas id="models-sparkline"></canvas>
          </div>
        </div>
        
        <div class="kpi-card">
          <div class="kpi-header">
            <div class="kpi-label">Predictions Today</div>
            <div class="kpi-icon" style="background: var(--accent-cyan);">
              <svg>⚡</svg>
            </div>
          </div>
          <div class="kpi-value">1,247</div>
          <div class="kpi-change positive">
            <svg>↑</svg>
            +18% from yesterday
          </div>
          <div class="kpi-sparkline">
            <canvas id="predictions-sparkline"></canvas>
          </div>
        </div>
        
      </div>
    </section>
    
    <!-- Main Chart -->
    <section class="chart-section">
      <div class="card">
        <div class="card-header">
          <div class="card-title-group">
            <h2 class="card-title">Weekly Sales Forecast</h2>
            <p class="card-subtitle">Last 12 weeks with 4-week prediction</p>
          </div>
          <div class="card-actions">
            <select class="select-field">
              <option>All Stores</option>
              <option>Store 1</option>
              <option>Store 2</option>
            </select>
            <button class="btn-icon">
              <svg>↻</svg>
            </button>
            <button class="btn-icon">
              <svg>⋯</svg>
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-container">
            <canvas id="forecast-chart"></canvas>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Bottom Grid -->
    <section class="bottom-grid">
      
      <!-- Recent Activity -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Recent Activity</h3>
          <button class="btn-secondary btn-sm">View All</button>
        </div>
        <div class="card-body">
          <div class="activity-list">
            
            <div class="activity-item">
              <div class="activity-icon" style="background: var(--accent-green);">
                <svg>✓</svg>
              </div>
              <div class="activity-content">
                <div class="activity-title">Model Training Complete</div>
                <div class="activity-description">XGBoost Ensemble v2.3</div>
              </div>
              <div class="activity-time">2m ago</div>
            </div>
            
            <div class="activity-item">
              <div class="activity-icon" style="background: var(--accent-blue);">
                <svg>↑</svg>
              </div>
              <div class="activity-content">
                <div class="activity-title">Dataset Uploaded</div>
                <div class="activity-description">walmart_sales_2024.csv (45 MB)</div>
              </div>
              <div class="activity-time">1h ago</div>
            </div>
            
            <div class="activity-item">
              <div class="activity-icon" style="background: var(--accent-purple);">
                <svg>📊</svg>
              </div>
              <div class="activity-content">
                <div class="activity-title">Report Generated</div>
                <div class="activity-description">Q1 Performance Analysis</div>
              </div>
              <div class="activity-time">3h ago</div>
            </div>
            
            <!-- More activities... -->
          </div>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Quick Actions</h3>
        </div>
        <div class="card-body">
          <div class="quick-actions">
            
            <button class="quick-action-btn">
              <div class="quick-action-icon">
                <svg>↑</svg>
              </div>
              <div class="quick-action-label">Upload Data</div>
            </button>
            
            <button class="quick-action-btn">
              <div class="quick-action-icon">
                <svg>🤖</svg>
              </div>
              <div class="quick-action-label">Train Model</div>
            </button>
            
            <button class="quick-action-btn">
              <div class="quick-action-icon">
                <svg>📊</svg>
              </div>
              <div class="quick-action-label">View Analytics</div>
            </button>
            
            <button class="quick-action-btn">
              <div class="quick-action-icon">
                <svg>⚙️</svg>
              </div>
              <div class="quick-action-label">Configure</div>
            </button>
            
          </div>
        </div>
      </div>
      
    </section>
    
  </main>
  
</div>
```

**Styling:**
```css
.dashboard-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 100vh;
  background: var(--bg-primary);
}

/* === SIDEBAR === */
.sidebar {
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-primary);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 280px;
  z-index: 50;
}

.sidebar-header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--border-primary);
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

.sidebar-nav {
  flex: 1;
  padding: var(--space-4);
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  text-decoration: none;
  transition: all var(--duration-fast);
  margin-bottom: var(--space-1);
  position: relative;
}

.nav-item:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.nav-item.active {
  background: rgba(74, 158, 255, 0.12);
  color: var(--accent-blue);
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--accent-blue);
  border-radius: 0 4px 4px 0;
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.nav-badge {
  margin-left: auto;
  background: var(--accent-blue);
  color: white;
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.nav-divider {
  height: 1px;
  background: var(--border-primary);
  margin: var(--space-4) 0;
}

.sidebar-footer {
  padding: var(--space-4);
  border-top: 1px solid var(--border-primary);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--duration-fast);
}

.user-menu:hover {
  background: var(--bg-tertiary);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.user-email {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

.user-menu-btn {
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: var(--space-2);
}

/* === MAIN CONTENT === */
.dashboard-main {
  margin-left: 280px;
  padding: var(--space-6);
  max-width: 1600px;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-8);
}

.top-nav-left {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.page-title {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.breadcrumb .current {
  color: var(--text-secondary);
  font-weight: var(--font-medium);
}

.separator {
  color: var(--text-tertiary);
}

.top-nav-right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.notification-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background: var(--accent-red);
  border-radius: var(--radius-full);
  border: 2px solid var(--bg-primary);
}

/* === KPI SECTION === */
.kpi-section {
  margin-bottom: var(--space-8);
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-6);
}

.kpi-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  transition: all var(--duration-base);
}

.kpi-card:hover {
  border-color: rgba(74, 158, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-4);
}

.kpi-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: var(--font-medium);
}

.kpi-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.kpi-value {
  font-family: var(--font-mono);
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.kpi-change {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-4);
}

.kpi-change.positive {
  color: var(--accent-green);
}

.kpi-change.negative {
  color: var(--accent-red);
}

.kpi-change.neutral {
  color: var(--text-tertiary);
}

.kpi-sparkline {
  height: 40px;
}

.kpi-sparkline canvas {
  width: 100%;
  height: 100%;
}

/* === CHART SECTION === */
.chart-section {
  margin-bottom: var(--space-8);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
}

.card-title-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.card-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.card-subtitle {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.card-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.card-body {
  padding: 0;
}

.chart-container {
  height: 400px;
  position: relative;
}

.chart-container canvas {
  width: 100%;
  height: 100%;
}

/* === BOTTOM GRID === */
.bottom-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-6);
}

.activity-list {
  display: flex;
  flex-direction: column;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  border-bottom: 1px solid var(--border-primary);
  transition: background var(--duration-fast);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-item:hover {
  background: rgba(74, 158, 255, 0.03);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 18px;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  margin-bottom: var(--space-1);
}

.activity-description {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.activity-time {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  font-family: var(--font-mono);
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.quick-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-6);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--duration-base);
}

.quick-action-btn:hover {
  background: var(--bg-elevated);
  border-color: var(--accent-blue);
  transform: translateY(-2px);
}

.quick-action-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.quick-action-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
}
```

Due to length constraints, I'll continue this documentation in a separate file and create a comprehensive PDF version.

Let me create the complete documentation now.
