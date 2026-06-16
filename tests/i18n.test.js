import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

const i18nScript = fs.readFileSync(path.resolve(__dirname, '../js/i18n.js'), 'utf-8');

function setupDOM(opts = {}) {
  document.documentElement.removeAttribute('lang');
  document.body.innerHTML = `
    <h1 data-i18n="title">Default Title</h1>
    <p data-i18n="desc">Default Description</p>
    <input data-i18n-placeholder="input.placeholder" placeholder="Type here">
    <button data-i18n-title="btn.title" title="Click">OK</button>
    <span data-i18n-aria="label" aria-label="Label">X</span>
    <div data-i18n-html="html.content"><b>Bold</b></div>
    <select id="langSelect">
      <option value="en">EN</option>
      <option value="zh">中文</option>
    </select>
    <div id="toast"></div>
  `;
  localStorage.clear();

  if (opts.storedLang) {
    localStorage.setItem('zhczlx-lang', opts.storedLang);
  }

  window.__pageTranslations = opts.translations || {
    en: {
      'page.title': 'Test Page EN',
      'title': 'Hello',
      'desc': 'World',
      'input.placeholder': 'Enter text...',
      'btn.title': 'Click me',
      'label': 'Close',
      'html.content': '<em>Italic</em>',
      'toast.copied': 'Copied!',
      'toast.failed': 'Failed!'
    },
    zh: {
      'page.title': '测试页面',
      'title': '你好',
      'desc': '世界',
      'input.placeholder': '请输入...',
      'btn.title': '点击我',
      'label': '关闭',
      'html.content': '<em>斜体</em>',
      'toast.copied': '已复制！',
      'toast.failed': '失败！'
    }
  };

  const fn = new Function(i18nScript);
  fn();
}

describe('i18n.js', () => {
  beforeEach(() => {
    localStorage.clear();
    delete window.__pageTranslations;
    delete window.HyruleI18n;
  });

  it('should default to English when no stored preference', () => {
    setupDOM();
    expect(document.querySelector('[data-i18n="title"]').textContent).toBe('Hello');
    expect(document.querySelector('[data-i18n="desc"]').textContent).toBe('World');
  });

  it('should restore stored language', () => {
    setupDOM({ storedLang: 'zh' });
    expect(document.querySelector('[data-i18n="title"]').textContent).toBe('你好');
  });

  it('should handle data-i18n-placeholder', () => {
    setupDOM({ storedLang: 'zh' });
    expect(document.querySelector('input').placeholder).toBe('请输入...');
  });

  it('should handle data-i18n-title', () => {
    setupDOM({ storedLang: 'zh' });
    expect(document.querySelector('button').title).toBe('点击我');
  });

  it('should handle data-i18n-aria', () => {
    setupDOM({ storedLang: 'zh' });
    expect(document.querySelector('span').getAttribute('aria-label')).toBe('关闭');
  });

  it('should handle data-i18n-html (innerHTML)', () => {
    setupDOM({ storedLang: 'zh' });
    expect(document.querySelector('[data-i18n-html]').innerHTML).toBe('<em>斜体</em>');
  });

  it('should expose HyruleI18n.t() function', () => {
    setupDOM();
    expect(typeof window.HyruleI18n.t).toBe('function');
    expect(window.HyruleI18n.t('toast.copied')).toBe('Copied!');
  });

  it('should return fallback when key is missing', () => {
    setupDOM();
    expect(window.HyruleI18n.t('nonexistent', 'fallback')).toBe('fallback');
    expect(window.HyruleI18n.t('nonexistent')).toBe('nonexistent');
  });

  it('should sync langSelect value', () => {
    setupDOM({ storedLang: 'zh' });
    expect(document.getElementById('langSelect').value).toBe('zh');
  });

  it('should switch language on select change', () => {
    setupDOM();
    const sel = document.getElementById('langSelect');
    sel.value = 'zh';
    sel.dispatchEvent(new Event('change'));
    expect(document.querySelector('[data-i18n="title"]').textContent).toBe('你好');
    expect(localStorage.getItem('zhczlx-lang')).toBe('zh');
  });

  it('should use unified localStorage key "zhczlx-lang"', () => {
    setupDOM();
    const sel = document.getElementById('langSelect');
    sel.value = 'zh';
    sel.dispatchEvent(new Event('change'));
    expect(localStorage.getItem('zhczlx-lang')).toBe('zh');
    // Old keys should not exist
    expect(localStorage.getItem('pwgen_lang')).toBeNull();
    expect(localStorage.getItem('preferred_lang')).toBeNull();
  });

  it('should migrate legacy zh-CN stored value to zh', () => {
    setupDOM({ storedLang: 'zh-CN' });
    expect(document.querySelector('[data-i18n="title"]').textContent).toBe('你好');
  });

  it('should update page title', () => {
    setupDOM({ storedLang: 'zh' });
    expect(document.title).toBe('测试页面');
  });

  it('should expose getLang()', () => {
    setupDOM({ storedLang: 'zh' });
    expect(window.HyruleI18n.getLang()).toBe('zh');
  });
});
