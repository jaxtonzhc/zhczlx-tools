import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

const commonScript = fs.readFileSync(path.resolve(__dirname, '../src/js/common.js'), 'utf-8');

function setupDOM() {
  document.body.innerHTML = '<div class="toast" id="toast"></div>';
  delete window.showToast;
  delete window.copyToClipboard;
  delete window.HyruleI18n;

  // Provide a minimal HyruleI18n mock
  window.HyruleI18n = {
    t: (key, fallback) => {
      const dict = { 'toast.copied': '✅ Copied', 'toast.failed': '❌ Failed' };
      return dict[key] || fallback || key;
    }
  };

  const fn = new Function(commonScript);
  fn();
}

describe('common.js', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setupDOM();
  });

  it('should expose showToast globally', () => {
    expect(typeof window.showToast).toBe('function');
  });

  it('should expose copyToClipboard globally', () => {
    expect(typeof window.copyToClipboard).toBe('function');
  });

  it('should show toast with custom message', () => {
    window.showToast('Hello');
    const toast = document.getElementById('toast');
    expect(toast.textContent).toBe('Hello');
    expect(toast.classList.contains('show')).toBe(true);
  });

  it('should show default toast message from i18n', () => {
    window.showToast();
    const toast = document.getElementById('toast');
    expect(toast.textContent).toBe('✅ Copied');
  });

  it('should hide toast after 2 seconds', () => {
    window.showToast('Test');
    const toast = document.getElementById('toast');
    expect(toast.classList.contains('show')).toBe(true);
    vi.advanceTimersByTime(2100);
    expect(toast.classList.contains('show')).toBe(false);
  });

  it('should reset toast timer on rapid calls', () => {
    window.showToast('First');
    vi.advanceTimersByTime(1500);
    window.showToast('Second');
    const toast = document.getElementById('toast');
    expect(toast.textContent).toBe('Second');
    vi.advanceTimersByTime(1500);
    expect(toast.classList.contains('show')).toBe(true);
    vi.advanceTimersByTime(600);
    expect(toast.classList.contains('show')).toBe(false);
  });

  it('should handle missing toast element gracefully', () => {
    document.getElementById('toast').remove();
    expect(() => window.showToast('Test')).not.toThrow();
  });

  it('should call clipboard API via copyToClipboard', async () => {
    const mockWrite = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText: mockWrite }
    });

    window.copyToClipboard('test-text', 'Copied!');
    await vi.runAllTimersAsync();

    expect(mockWrite).toHaveBeenCalledWith('test-text');
  });
});
