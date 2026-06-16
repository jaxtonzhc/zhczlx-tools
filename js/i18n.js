/**
 * Hyrule Toolbox — Unified i18n Engine
 * Declarative attribute-based translation system shared across all pages.
 *
 * Usage:
 *   1. Each page defines `window.__pageTranslations = { en: {...}, zh: {...}, ... }`
 *   2. Include this script after that definition.
 *   3. HTML elements use data-i18n="key" (textContent), data-i18n-html="key" (innerHTML),
 *      data-i18n-placeholder="key", data-i18n-title="key", data-i18n-aria="key".
 *   4. Call HyruleI18n.t('key') for dynamic strings (e.g. toast messages).
 */
(function () {
  'use strict';

  var LANG_KEY = 'zhczlx-lang';
  var SUPPORTED = ['en', 'zh', 'ja', 'ko', 'fr', 'de'];

  var translations = window.__pageTranslations || {};
  var currentLang = 'en';

  function getStoredLang() {
    try {
      var v = localStorage.getItem(LANG_KEY);
      if (v === 'zh-CN') return 'zh';
      return v;
    } catch (e) { return null; }
  }

  function setStoredLang(lang) {
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* noop */ }
  }

  function getDefaultLang() {
    var stored = getStoredLang();
    if (stored && translations[stored]) return stored;

    var nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
    var prefix = nav.split('-')[0];
    if (prefix === 'zh') return translations['zh'] ? 'zh' : 'en';
    if (SUPPORTED.indexOf(prefix) !== -1 && translations[prefix]) return prefix;
    return 'en';
  }

  function applyLanguage(lang) {
    if (!translations[lang]) lang = 'en';
    currentLang = lang;
    var t = translations[lang] || {};

    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;

    // Update <title>
    if (t['page.title']) document.title = t['page.title'];

    // Update meta description
    var meta = document.querySelector('meta[name="description"]');
    if (meta && t['page.description']) meta.setAttribute('content', t['page.description']);

    // Declarative: data-i18n -> textContent
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute('data-i18n');
      if (t[key] !== undefined) els[i].textContent = t[key];
    }

    // Declarative: data-i18n-html -> innerHTML (for strings with <strong> etc.)
    els = document.querySelectorAll('[data-i18n-html]');
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute('data-i18n-html');
      if (t[key] !== undefined) els[i].innerHTML = t[key];
    }

    // Declarative: data-i18n-placeholder -> placeholder attribute
    els = document.querySelectorAll('[data-i18n-placeholder]');
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute('data-i18n-placeholder');
      if (t[key] !== undefined) els[i].placeholder = t[key];
    }

    // Declarative: data-i18n-title -> title attribute
    els = document.querySelectorAll('[data-i18n-title]');
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute('data-i18n-title');
      if (t[key] !== undefined) els[i].title = t[key];
    }

    // Declarative: data-i18n-aria -> aria-label attribute
    els = document.querySelectorAll('[data-i18n-aria]');
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute('data-i18n-aria');
      if (t[key] !== undefined) els[i].setAttribute('aria-label', t[key]);
    }

    // Sync language selector UI
    var sel = document.getElementById('langSelect');
    if (sel) sel.value = lang;

    setStoredLang(lang);
  }

  // t() — get translated string for dynamic use (toast, alerts, etc.)
  function t(key, fallback) {
    var dict = translations[currentLang] || translations['en'] || {};
    if (dict[key] !== undefined) return dict[key];
    var en = translations['en'] || {};
    if (en[key] !== undefined) return en[key];
    return fallback || key;
  }

  // Initialize
  currentLang = getDefaultLang();
  applyLanguage(currentLang);

  // Bind language selector
  var sel = document.getElementById('langSelect');
  if (sel) {
    sel.addEventListener('change', function () {
      applyLanguage(this.value);
      // Allow pages to hook into language changes
      if (typeof window.__onLanguageChange === 'function') {
        window.__onLanguageChange(this.value);
      }
    });
  }

  // Public API
  window.HyruleI18n = {
    t: t,
    apply: applyLanguage,
    getLang: function () { return currentLang; }
  };

})();
