/**
 * Hyrule Toolbox — Unified Theme Module
 * Shared across all pages for consistent dark/light mode.
 */
(function () {
  'use strict';

  var THEME_KEY = 'zhczlx-theme';
  var htmlEl = document.documentElement;
  var themeToggle = document.getElementById('themeToggle');

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getStoredTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }

  function setStoredTheme(theme) {
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* noop */ }
  }

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    htmlEl.style.colorScheme = theme;
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF13';
    }
  }

  // Initialize: stored > system > light
  var stored = getStoredTheme();
  var initialTheme = stored || getSystemTheme();
  applyTheme(initialTheme);

  // Toggle on click — only persist on explicit user action
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = htmlEl.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      setStoredTheme(next);
    });
  }

  // Follow system changes when user hasn't explicitly chosen
  try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!getStoredTheme()) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  } catch (e) { /* older browsers */ }

})();
