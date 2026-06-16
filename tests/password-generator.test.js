import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

const fullHtml = fs.readFileSync(
  path.resolve(__dirname, '../password-generator.html'),
  'utf-8'
);

function setupPage() {
  // Mock crypto.getRandomValues (jsdom has it but let's be safe)
  if (!globalThis.crypto) {
    globalThis.crypto = {};
  }
  if (!globalThis.crypto.getRandomValues) {
    globalThis.crypto.getRandomValues = function (arr) {
      for (var i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 4294967296);
      }
      return arr;
    };
  }

  // Mock matchMedia for theme.js
  window.matchMedia =
    window.matchMedia ||
    function () {
      return {
        matches: false,
        addEventListener: function () {},
        removeEventListener: function () {},
      };
    };

  window.__pageTranslations = window.__pageTranslations || { en: {} };

  // Load common.js globals (showToast, copyToClipboard) before page scripts
  window.showToast = window.showToast || function () {};
  window.copyToClipboard = window.copyToClipboard || function () {};
  window.HyruleI18n = window.HyruleI18n || { t: function (k) { return k; }, getLang: function () { return 'en'; }, apply: function () {} };

  document.documentElement.innerHTML = fullHtml
    .replace(/^[\s\S]*?<body[^>]*>/i, '')
    .replace(/<\/body>[\s\S]*$/i, '');

  // Execute all inline scripts from the page
  var scripts = document.querySelectorAll('script:not([src])');
  scripts.forEach(function (s) {
    if (s.textContent.trim()) {
      try {
        new Function(s.textContent)();
      } catch (e) {
        // theme.js/i18n.js/common.js are external, only inline scripts run here
      }
    }
  });
}

function getPasswordDisplay() {
  var pwText = document.getElementById('pwText');
  return pwText ? pwText.textContent : '';
}

function clickGenerate() {
  var btn = document.getElementById('generateBtn');
  if (btn) btn.click();
}

function setCharset(key, enabled) {
  var opts = document.querySelectorAll('.charset-option');
  for (var i = 0; i < opts.length; i++) {
    if (opts[i].getAttribute('data-key') === key) {
      var cb = opts[i].querySelector('input[type="checkbox"]');
      if (cb.checked !== enabled) {
        cb.checked = enabled;
        opts[i].classList.toggle('active', enabled);
      }
      return;
    }
  }
}

function enableOnlyCharsets(keys) {
  var all = ['uppercase', 'lowercase', 'numbers', 'symbols'];
  all.forEach(function (k) {
    setCharset(k, keys.indexOf(k) !== -1);
  });
}

function setLength(len) {
  var slider = document.getElementById('lengthSlider');
  if (slider) {
    slider.value = len;
    slider.dispatchEvent(new Event('input'));
  }
}

describe('Password Generator — functional tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    setupPage();
    vi.runAllTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should generate a password on page load', () => {
    var pwd = getPasswordDisplay();
    expect(pwd.length).toBeGreaterThan(0);
  });

  it('should generate password with default length of 16', () => {
    clickGenerate();
    var pwd = getPasswordDisplay();
    expect(pwd.length).toBe(16);
  });

  it('should respect custom length', () => {
    setLength(32);
    clickGenerate();
    var pwd = getPasswordDisplay();
    expect(pwd.length).toBe(32);
  });

  it('should generate only uppercase when only uppercase is selected', () => {
    enableOnlyCharsets(['uppercase']);
    clickGenerate();
    var pwd = getPasswordDisplay();
    expect(pwd).toMatch(/^[A-Z]+$/);
  });

  it('should generate only lowercase when only lowercase is selected', () => {
    enableOnlyCharsets(['lowercase']);
    clickGenerate();
    var pwd = getPasswordDisplay();
    expect(pwd).toMatch(/^[a-z]+$/);
  });

  it('should generate only numbers when only numbers is selected', () => {
    enableOnlyCharsets(['numbers']);
    clickGenerate();
    var pwd = getPasswordDisplay();
    expect(pwd).toMatch(/^[0-9]+$/);
  });

  it('should generate only symbols when only symbols is selected', () => {
    enableOnlyCharsets(['symbols']);
    clickGenerate();
    var pwd = getPasswordDisplay();
    expect(pwd).toMatch(/^[^a-zA-Z0-9]+$/);
  });

  it('should include symbols when symbols charset is enabled (bug fix verification)', () => {
    enableOnlyCharsets(['uppercase', 'lowercase', 'numbers', 'symbols']);
    var symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
    var found = false;
    // Generate multiple times to reduce flakiness
    for (var attempt = 0; attempt < 20; attempt++) {
      clickGenerate();
      var pwd = getPasswordDisplay();
      for (var i = 0; i < pwd.length; i++) {
        if (symbolChars.indexOf(pwd[i]) !== -1) {
          found = true;
          break;
        }
      }
      if (found) break;
    }
    expect(found).toBe(true);
  });

  it('should guarantee at least one char from each selected charset', () => {
    enableOnlyCharsets(['uppercase', 'lowercase', 'numbers', 'symbols']);
    setLength(8);
    var symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';

    for (var attempt = 0; attempt < 10; attempt++) {
      clickGenerate();
      var pwd = getPasswordDisplay();

      var hasUpper = /[A-Z]/.test(pwd);
      var hasLower = /[a-z]/.test(pwd);
      var hasNumber = /[0-9]/.test(pwd);
      var hasSymbol = false;
      for (var i = 0; i < pwd.length; i++) {
        if (symbolChars.indexOf(pwd[i]) !== -1) {
          hasSymbol = true;
          break;
        }
      }
      expect(hasUpper).toBe(true);
      expect(hasLower).toBe(true);
      expect(hasNumber).toBe(true);
      expect(hasSymbol).toBe(true);
    }
  });

  it('should handle minimum length of 4', () => {
    enableOnlyCharsets(['uppercase', 'lowercase', 'numbers', 'symbols']);
    setLength(4);
    clickGenerate();
    var pwd = getPasswordDisplay();
    expect(pwd.length).toBe(4);
  });

  it('should display correct entropy for uppercase-only (95 bits for 20 chars)', () => {
    enableOnlyCharsets(['uppercase']);
    setLength(20);
    clickGenerate();
    var statEntropy = document.getElementById('statEntropy');
    // 26 chars pool, 20 length => 20 * log2(26) ≈ 94
    expect(statEntropy.textContent).toMatch(/9[0-9] bits/);
  });

  it('should display character types count', () => {
    enableOnlyCharsets(['uppercase', 'lowercase']);
    clickGenerate();
    var statTypes = document.getElementById('statTypes');
    expect(statTypes.textContent).toContain('2');
  });

  it('should update strength meter visually', () => {
    enableOnlyCharsets(['uppercase', 'lowercase', 'numbers', 'symbols']);
    setLength(32);
    clickGenerate();
    var bars = document.querySelectorAll('.strength-bar.active');
    expect(bars.length).toBeGreaterThan(0);
  });

  it('should add password to history on generate', () => {
    clickGenerate();
    var historyItems = document.querySelectorAll('#historyList .history-item');
    expect(historyItems.length).toBeGreaterThanOrEqual(1);
  });

  it('should clear history when clear button is clicked', () => {
    clickGenerate();
    clickGenerate();
    var clearBtn = document.getElementById('clearHistoryBtn');
    clearBtn.click();
    var historyItems = document.querySelectorAll('#historyList .history-item');
    expect(historyItems.length).toBe(0);
  });

  it('checkbox toggle should not double-toggle (bug regression)', () => {
    enableOnlyCharsets(['uppercase']);
    var symbolOpt = document.querySelector('.charset-option[data-key="symbols"]');
    var cb = symbolOpt.querySelector('input[type="checkbox"]');
    expect(cb.checked).toBe(false);

    // Simulate a click on the label (not the checkbox itself)
    symbolOpt.click();
    expect(cb.checked).toBe(true);
    expect(symbolOpt.classList.contains('active')).toBe(true);
  });
});
