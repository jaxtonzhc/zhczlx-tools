# Hyrule Toolbox — tools.zhczlx.com

A collection of free, privacy-first online tools built with a Vercel-inspired design language. All tools run entirely client-side — no data ever leaves your browser.

---

## 🎨 Design System

**Inspired by Open Design / Vercel Design System**

Based on the [Open Design](https://github.com/nexu-io/open-design) project's Vercel DESIGN.md specification:

| Token | Value |
|-------|-------|
| **Typeface** | Inter (UI) + JetBrains Mono (code) |
| **Color Philosophy** | Near-white canvas with near-black text (`#171717` / `#fafafa`), shadow-as-border technique |
| **Shadow System** | Multi-layer `box-shadow` stacks replacing traditional borders |
| **Border Technique** | `0px 0px 0px 1px rgba(0,0,0,0.08)` shadow-as-border |
| **Accent** | `#0072f5` (light) / `#3b82f6` (dark) |
| **Border Radius** | 4px / 8px / 12px / 9999px system |
| **Dark Mode** | CSS custom properties with `@media (prefers-color-scheme: dark)` + manual toggle |

Key design principles applied:
- **Compression as identity** — tight letter-spacing on headings
- **Three weight strict roles** — 400 (body) / 500 (UI) / 600 (headings)
- **Monochromatic with intentional accent** — color used sparingly for interactivity
- **Generous whitespace** — content breathing room
- **Micro-interactions** — hover states, smooth transitions, subtle animations

---

## 🧰 Tools

| Tool | File | Description |
|------|------|-------------|
| 🔐 **Password Generator** | `password-generator.html` | Strong random passwords with strength meter, character set toggles, entropy display, history |
| 📏 **Unit Converter** | `unit-converter.html` | Real-time conversion across length, weight, temperature, area, volume |
| 📊 **Text Counter** | `text-counter.html` | Real-time char/word/sentence/paragraph/line count, reading time, frequent words |
| 🔤 **Case Converter** | `text-case.html` | 8 format converters: UPPER / lower / Title / camelCase / snake_case / PascalCase / kebab-case / toggle |
| 🆔 **UUID Generator** | `uuid-generator.html` | UUID v4/v1/v7 with batch mode, format options, bulk copy |
| 🎨 **Color Converter** | `color-converter.html` | HEX / RGB / HSL / CMYK conversion with auto-detect input format, color picker, history |
| { } **JSON Formatter** | `json-formatter.html` | JSON5 parser, tree view with fold/expand, copy subtree, auto-fix trailing commas, fullscreen mode |

---

## 🌟 Core Advantages

### 1. Zero Server Dependency
All computation happens in the browser. No data uploaded, no cookies, no tracking.

### 2. JSON5 / Auto-Fix Engine
The JSON formatter is the standout tool — it strips comments (`//`, `/* */`), fixes trailing commas, and handles single quotes. This means even malformed JSON gets formatted correctly, dramatically reducing user friction.

### 3. Multi-Language Support (i18n)
Every tool supports 6 languages:
- 🇬🇧 English (default)
- 🇨🇳 中文
- 🇯🇵 日本語
- 🇰🇷 한국어
- 🇫🇷 Français
- 🇩🇪 Deutsch

Language is auto-detected from browser settings and persisted to `localStorage`.

### 4. Dark / Light Mode
Full theme support that respects `prefers-color-scheme` with manual override, persisted per-tool.

### 5. Client-Side Privacy
- Passwords generated with `crypto.getRandomValues()`
- Color conversions done locally
- UUIDs generated via `crypto.randomUUID()`
- No analytics, no cookies, no external requests (except Google Fonts)

### 6. Responsive Design
Fully responsive from 360px mobile to ultrawide desktop, with touch-friendly controls and adaptive layouts.

### 7. One-Click Copy
Every output field has a copy button with visual feedback and toast notification.

---

## 🏗️ Project Structure

```
zhczlx-tools/
├── CNAME                       # tools.zhczlx.com
├── index.html                  # Tools landing page
├── password-generator.html     # 🔐 Password Generator
├── unit-converter.html         # 📏 Unit Converter
├── text-counter.html           # 📊 Text Counter
├── text-case.html              # 🔤 Case Converter
├── uuid-generator.html         # 🆔 UUID Generator
├── color-converter.html        # 🎨 Color Converter
├── json-formatter.html         # { } JSON Formatter
├── test-complex.json5          # JSON5 test sample
├── css/
│   └── tools.css               # Shared design system
└── README.md                   # This file
```

### Shared CSS System (`css/tools.css`)

Contains the complete design token system:
- CSS custom properties for colors, shadows, radii, fonts
- Header / footer / navigation components
- Form controls (inputs, buttons, toggles, sliders)
- Animation keyframes
- Toast notification system
- Responsive breakpoints (768px, 480px)

### Each tool page follows the pattern:

```
[Header with logo + nav + language switcher + theme toggle]
[Main content with tool-specific UI]
[Footer with links]
[Inline <script> with all logic in an IIFE]
```

No external JavaScript dependencies. Zero frameworks. Pure vanilla JS.

---

## 🚀 Deployment

Hosted on **GitHub Pages** at `tools.zhczlx.com`.

```bash
# Deploy
git add -A
git commit -m "your message"
git push origin main
# GitHub Pages auto-deploys within ~30s
```

Custom domain via **Cloudflare** (DNS only, gray cloud):
- CNAME `tools` → `zhouhuacong.github.io`
- HTTPS auto-provisioned by GitHub + Let's Encrypt

---

## 📋 Future Plans

- [ ] Google AdSense integration
- [ ] More tools (Base64 encoder/decoder, QR code generator, Markdown previewer)
- [ ] PWA support (service worker for offline use)
- [ ] Per-tool URL hash routing for deep linking
