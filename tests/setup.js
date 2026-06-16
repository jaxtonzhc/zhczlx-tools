import { vi } from 'vitest';

const store = new Map();

const localStorageMock = {
  getItem: vi.fn((key) => (store.has(key) ? store.get(key) : null)),
  setItem: vi.fn((key, value) => {
    store.set(String(key), String(value));
  }),
  removeItem: vi.fn((key) => {
    store.delete(key);
  }),
  clear: vi.fn(() => {
    store.clear();
  }),
  get length() {
    return store.size;
  },
  key: vi.fn((index) => Array.from(store.keys())[index] ?? null),
};

if (typeof globalThis.localStorage === 'undefined') {
  Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    configurable: true,
    writable: true,
  });
}

if (typeof window !== 'undefined' && typeof window.localStorage === 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    configurable: true,
    writable: true,
  });
}
