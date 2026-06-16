# Reddit / Hacker News 推广帖草稿

---

## 📌 Show HN: I built a JSON5 formatter that handles what no other tool can — trailing commas, comments, and broken JSON auto-fix

**Link:** https://tools.zhczlx.com/json-formatter.html

**The problem:** Every JSON developer has been burned by a trailing comma or a comment left in a JSON file during debugging. Standard JSON formatters just show `Parse Error at line 3` — zero help.

**The solution:** A browser-based JSON5 formatter + tree viewer that:
- ✅ Auto-fixes trailing commas (the #1 JSON pain point)
- ✅ Strips `//` and `/* */` comments
- ✅ Accepts single-quoted strings
- ✅ Renders a visual tree view with fold/expand
- ✅ Lets you copy any subtree with one click
- ⛶ Fullscreen mode for complex data
- 🌐 Available in 6 languages (EN/中文/日本語/한국어/Français/Deutsch)

All client-side — no data ever leaves your browser.

**Tech stack:** Vanilla JS, no frameworks. Hosted on GitHub Pages with Cloudflare DNS. Design inspired by the Open Design / Vercel design system.

The tool is part of a larger toolbox at https://tools.zhczlx.com/ — but the JSON5 formatter is the hero.

---

## 🐦 Twitter/X 帖子

**Post 1 (JSON focus):**
> "Other JSON formatters choke on a single trailing comma. Mine fixes it, strips your comments, accepts single quotes, and gives you a tree view with copy-subtree. All client-side. Zero cost. https://tools.zhczlx.com/json-formatter.html"

**Post 2 (Toolbox):**
> "Built a free developer toolbox: password generator, unit converter, UUID generator, color converter... but the JSON5 formatter is the star — it even fixes broken JSON with trailing commas. No server upload. No ads. https://tools.zhczlx.com"

---

## 📋 Reddit 发帖步骤

1. 打开 https://www.reddit.com/r/webdev/submit
2. 标题：Show HN / I built a JSON5 formatter that fixes trailing commas — other tools can't handle this
3. URL: https://tools.zhczlx.com/json-formatter.html
4. 也发到 r/javascript, r/programming, r/tools
