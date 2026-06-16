import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

const themeScript = fs.readFileSync(path.resolve(__dirname, '../js/theme.js'), 'utf-8');

function mockMatchMedia(prefersDark = false) {
  const listeners = [];
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: prefersDark && query === '(prefers-color-scheme: dark)',
    media: query,
    addEventListener: (event, cb) => listeners.push(cb),
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }));
  return listeners;
}

function setupDOM(opts = {}) {
  mockMatchMedia(opts.prefersDark || false);
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.style.colorScheme = '';
  document.body.innerHTML = '<button id="themeToggle">🌓</button>';
  localStorage.clear();

  if (opts.storedTheme) {
    localStorage.setItem('zhczlx-theme', opts.storedTheme);
  }

  // Re-run the script in the jsdom environment
  const fn = new Function(themeScript);
  fn();
}

describe('theme.js', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('should default to light theme when no stored preference and no system dark mode', () => {
    // jsdom matchMedia defaults to "not all" (no dark preference)
    setupDOM();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.getElementById('themeToggle').textContent).toBe('🌓');
  });

  it('should restore stored dark theme from localStorage', () => {
    setupDOM({ storedTheme: 'dark' });
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.getElementById('themeToggle').textContent).toBe('☀️');
  });

  it('should restore stored light theme from localStorage', () => {
    setupDOM({ storedTheme: 'light' });
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.getElementById('themeToggle').textContent).toBe('🌓');
  });

  it('should toggle from light to dark on click', () => {
    setupDOM();
    const btn = document.getElementById('themeToggle');
    btn.click();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('zhczlx-theme')).toBe('dark');
    expect(btn.textContent).toBe('☀️');
  });

  it('should toggle from dark back to light on second click', () => {
    setupDOM({ storedTheme: 'dark' });
    const btn = document.getElementById('themeToggle');
    btn.click();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('zhczlx-theme')).toBe('light');
  });

  it('should set colorScheme style on html element', () => {
    setupDOM({ storedTheme: 'dark' });
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('should use unified localStorage key "zhczlx-theme"', () => {
    setupDOM();
    const btn = document.getElementById('themeToggle');
    btn.click();
    expect(localStorage.getItem('zhczlx-theme')).toBeTruthy();
    // Should NOT use old keys
    expect(localStorage.getItem('pwgen_theme')).toBeNull();
    expect(localStorage.getItem('unit-theme')).toBeNull();
    expect(localStorage.getItem('textCounterTheme')).toBeNull();
  });
});
