/**
 * Hyrule Toolbox — Shared Utilities
 * Toast notification system, clipboard helpers, card animation.
 */
(function () {
  'use strict';

  // ===== Toast Notification =====
  var toastEl = document.getElementById('toast');
  var toastTimeout = null;

  window.showToast = function (message) {
    if (!toastEl) return;
    toastEl.textContent = message || (window.HyruleI18n ? window.HyruleI18n.t('toast.copied', '\u2705 Copied') : '\u2705 Copied');
    toastEl.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function () {
      toastEl.classList.remove('show');
    }, 2000);
  };

  // ===== Clipboard Helper =====
  window.copyToClipboard = function (text, successMsg) {
    if (text == null) return;
    var msg = successMsg || (window.HyruleI18n ? window.HyruleI18n.t('toast.copied') : '\u2705 Copied');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        window.showToast(msg);
      }).catch(function () {
        fallbackCopy(text, msg);
      });
    } else {
      fallbackCopy(text, msg);
    }
  };

  function fallbackCopy(text, successMsg) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;left:-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      window.showToast(successMsg);
    } catch (e) {
      var failMsg = window.HyruleI18n ? window.HyruleI18n.t('toast.failed', '\u274C Copy failed') : '\u274C Copy failed';
      window.showToast(failMsg);
    }
    document.body.removeChild(ta);
  }

  // ===== Intersection Observer for card animations =====
  if ('IntersectionObserver' in window) {
    var cards = document.querySelectorAll('.animate-in');
    if (cards.length) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      cards.forEach(function (card) {
        card.style.animationPlayState = 'paused';
        observer.observe(card);
      });
      setTimeout(function () {
        cards.forEach(function (c) { c.style.animationPlayState = 'running'; });
      }, 2000);
    }
  }

})();
