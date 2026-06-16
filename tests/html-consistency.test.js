import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const pagesDir = path.resolve(__dirname, '..');
const htmlFiles = [
  'index.html',
  'password-generator.html',
  'unit-converter.html',
  'text-counter.html',
  'text-case.html',
  'uuid-generator.html',
  'color-converter.html',
  'json-formatter.html',
  'qr-generator.html',
];

const toolPages = htmlFiles.filter(f => f !== 'index.html');

function readPage(filename) {
  return fs.readFileSync(path.join(pagesDir, filename), 'utf-8');
}

describe('HTML consistency across all pages', () => {

  describe('Header structure', () => {
    htmlFiles.forEach(file => {
      it(`${file} should have unified header with #langSelect and #themeToggle`, () => {
        const html = readPage(file);
        expect(html).toContain('id="langSelect"');
        expect(html).toContain('id="themeToggle"');
        expect(html).toContain('class="site-header"');
        expect(html).toContain('class="header-inner"');
        expect(html).toContain('class="header-nav"');
        expect(html).toContain('class="header-controls"');
      });
    });
  });

  describe('Footer structure', () => {
    htmlFiles.forEach(file => {
      it(`${file} should have unified footer`, () => {
        const html = readPage(file);
        expect(html).toContain('class="site-footer"');
        expect(html).toContain('class="footer-inner"');
        expect(html).toContain('Hyrule Toolbox');
      });
    });
  });

  describe('Shared JS references', () => {
    htmlFiles.forEach(file => {
      it(`${file} should include all 3 shared JS files`, () => {
        const html = readPage(file);
        expect(html).toContain('src="js/theme.js"');
        expect(html).toContain('src="js/i18n.js"');
        expect(html).toContain('src="js/common.js"');
      });
    });
  });

  describe('Translation dictionary', () => {
    htmlFiles.forEach(file => {
      it(`${file} should define window.__pageTranslations`, () => {
        const html = readPage(file);
        expect(html).toContain('__pageTranslations');
      });
    });
  });

  describe('Favicon', () => {
    htmlFiles.forEach(file => {
      it(`${file} should have emoji favicon`, () => {
        const html = readPage(file);
        expect(html).toContain('rel="icon"');
      });
    });
  });

  describe('Language code consistency', () => {
    htmlFiles.forEach(file => {
      it(`${file} should NOT use deprecated zh-CN language code`, () => {
        const html = readPage(file);
        expect(html).not.toContain("value=\"zh-CN\"");
        expect(html).not.toContain("'zh-CN':");
      });
    });
  });

  describe('No old localStorage keys', () => {
    const oldKeys = ['pwgen_theme', 'unit-theme', 'textCounterTheme', 'uuid-theme',
                     'cc-theme', 'json-theme', 'pwgen_lang', 'unit-lang',
                     'textCounterLang', 'uuid-lang', 'cc-lang', 'json-lang', 'preferred_lang'];
    htmlFiles.forEach(file => {
      it(`${file} should not reference old localStorage keys`, () => {
        const html = readPage(file);
        oldKeys.forEach(key => {
          expect(html).not.toContain(`'${key}'`);
          expect(html).not.toContain(`"${key}"`);
        });
      });
    });
  });

  describe('No darkOverrideStyle injection', () => {
    htmlFiles.forEach(file => {
      it(`${file} should not contain darkOverrideStyle`, () => {
        const html = readPage(file);
        expect(html).not.toContain('darkOverrideStyle');
      });
    });
  });

  describe('Brand consistency', () => {
    htmlFiles.forEach(file => {
      it(`${file} should use "Hyrule Toolbox" branding`, () => {
        const html = readPage(file);
        expect(html).toContain('Hyrule Toolbox');
      });
    });
  });

  describe('Language select options', () => {
    htmlFiles.forEach(file => {
      it(`${file} should offer 6 languages: en, zh, ja, ko, fr, de`, () => {
        const html = readPage(file);
        expect(html).toContain('value="en"');
        expect(html).toContain('value="zh"');
        expect(html).toContain('value="ja"');
        expect(html).toContain('value="ko"');
        expect(html).toContain('value="fr"');
        expect(html).toContain('value="de"');
      });
    });
  });

  describe('Nav links in all pages', () => {
    const navLinks = [
      'password-generator.html',
      'unit-converter.html',
      'text-counter.html',
      'text-case.html',
      'uuid-generator.html',
      'color-converter.html',
      'json-formatter.html',
      'qr-generator.html',
    ];
    htmlFiles.forEach(file => {
      it(`${file} should have all 8 tool nav links`, () => {
        const html = readPage(file);
        navLinks.forEach(link => {
          expect(html).toContain(`href="${link}"`);
        });
      });
    });
  });

  describe('Active nav link on tool pages', () => {
    const pageToLink = {
      'password-generator.html': 'password-generator.html',
      'unit-converter.html': 'unit-converter.html',
      'text-counter.html': 'text-counter.html',
      'text-case.html': 'text-case.html',
      'uuid-generator.html': 'uuid-generator.html',
      'color-converter.html': 'color-converter.html',
      'json-formatter.html': 'json-formatter.html',
      'qr-generator.html': 'qr-generator.html',
    };
    toolPages.forEach(file => {
      it(`${file} should mark its own nav link as active`, () => {
        const html = readPage(file);
        const expectedLink = pageToLink[file];
        const activePattern = new RegExp(`href="${expectedLink}"[^>]*class="active"`);
        expect(html).toMatch(activePattern);
      });
    });
  });

  describe('Toast element present', () => {
    htmlFiles.forEach(file => {
      it(`${file} should have a #toast element`, () => {
        const html = readPage(file);
        expect(html).toContain('id="toast"');
      });
    });
  });
});
