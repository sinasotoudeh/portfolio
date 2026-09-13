#!/usr/bin/env node
/**
 * screenshot.mjs — visual verification for the portfolio-optimization-architect run (D-10).
 *
 * Captures real-Chromium screenshots of a running portfolio server at chosen scroll positions
 * and viewports, and records every console error, page error, failed request and HTTP >= 400
 * response next to the images. The agent reads the PNGs (Read tool) to analyze layout, compare
 * before/after states and catch broken assets. Screenshots are evidence for the owner's parity
 * review — they never replace it (V4 stays owner-attested).
 *
 * Usage (from the repo root, against `pnpm build && pnpm start` — dev mode adds overlays):
 *   node .claude/skills/portfolio-optimization-architect/scripts/screenshot.mjs [options]
 *
 * Options:
 *   --url <url>          page to capture (default http://localhost:3000)
 *   --out <dir>          output directory (default .visual/<timestamp>[-<label>], gitignored)
 *   --label <name>       suffix for the default output directory, e.g. baseline, 2.1-hero-after
 *   --viewport <list>    comma list of presets desktop (1440x900), laptop (1280x800),
 *                        mobile (390x844 @3x, touch) or WxH[@dpr]  (default desktop,mobile)
 *   --at <list>          scroll targets: top | bottom | <px> | <n>vh | <n>%  (default top)
 *   --every <n>vh        instead of --at: a capture every n viewport heights, top to bottom
 *   --selector <css>     capture this element (scrolled into view) instead of the viewport
 *   --full               one full-page capture per viewport (pinned sections show their
 *                        state at scroll 0 — prefer --every for scroll choreography)
 *   --settle <ms>        wait after reaching each target (default 1800; Lenis duration is 1.5s)
 *   --reduced-motion     emulate prefers-reduced-motion: reduce
 *
 * Browser: Playwright's Chromium from the machine-level tools dir
 *   $PLAYWRIGHT_TOOLS_DIR or ~/.local/share/portfolio-visual-tools  (playwright — see SKILL.md
 *   "Visual verification tooling" for the one-time install).
 * Exit code 1 on navigation/launch failure; captured HTTP/console errors are reported, not fatal.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../../..');
const TOOLS_DIR = process.env.PLAYWRIGHT_TOOLS_DIR ?? path.join(os.homedir(), '.local/share/portfolio-visual-tools');

const PRESETS = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1 },
  laptop: { width: 1280, height: 800, deviceScaleFactor: 1 },
  mobile: { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
};

function parseArgs(argv) {
  const opts = { url: 'http://localhost:3000', viewport: 'desktop,mobile', at: 'top', settle: 1800 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => {
      const v = argv[++i];
      if (v === undefined) fail(`${a} needs a value`);
      return v;
    };
    if (a === '--url') opts.url = next();
    else if (a === '--out') opts.out = next();
    else if (a === '--label') opts.label = next();
    else if (a === '--viewport') opts.viewport = next();
    else if (a === '--at') opts.at = next();
    else if (a === '--every') opts.every = next();
    else if (a === '--selector') opts.selector = next();
    else if (a === '--full') opts.full = true;
    else if (a === '--settle') opts.settle = Number(next());
    else if (a === '--reduced-motion') opts.reducedMotion = true;
    else if (a === '--help' || a === '-h') { printHelp(); process.exit(0); }
    else fail(`unknown option ${a} (see --help)`);
  }
  return opts;
}

function printHelp() {
  const src = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8');
  console.log(src.slice(src.indexOf('/**'), src.indexOf('*/') + 2));
}

function fail(msg) {
  console.error(`screenshot: ${msg}`);
  process.exit(1);
}

function loadPlaywright() {
  try {
    return createRequire(path.join(TOOLS_DIR, 'package.json'))('playwright');
  } catch {
    fail(`playwright not found in ${TOOLS_DIR}. One-time setup:\n` +
      `  mkdir -p ${TOOLS_DIR} && cd ${TOOLS_DIR} && pnpm init && pnpm add playwright && pnpm exec playwright install chromium\n` +
      `  sudo env "PATH=$PATH" ${TOOLS_DIR}/node_modules/.bin/playwright install-deps chromium`);
  }
}

function parseViewport(token) {
  if (PRESETS[token]) return { name: token, ...PRESETS[token] };
  const m = token.match(/^(\d+)x(\d+)(?:@(\d+(?:\.\d+)?))?$/);
  if (!m) fail(`bad viewport "${token}" — use desktop|laptop|mobile or WxH[@dpr]`);
  return { name: token, width: Number(m[1]), height: Number(m[2]), deviceScaleFactor: Number(m[3] ?? 1) };
}

// Resolve one --at token to a scrollY in px, given the viewport height and the max scroll.
function resolveTarget(token, vh, maxScroll) {
  if (token === 'top') return 0;
  if (token === 'bottom') return maxScroll;
  let m;
  if ((m = token.match(/^(\d+(?:\.\d+)?)vh$/))) return Math.round(Number(m[1]) * vh);
  if ((m = token.match(/^(\d+(?:\.\d+)?)%$/))) return Math.round((Number(m[1]) / 100) * maxScroll);
  if (/^\d+$/.test(token)) return Number(token);
  fail(`bad scroll target "${token}" — use top|bottom|<px>|<n>vh|<n>%`);
}

const timestamp = () => new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '-');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Scroll in half-viewport steps so IntersectionObserver / ScrollTrigger / Lenis see a real
// scroll path instead of a teleport, then wait for the page to settle.
async function walkTo(page, target, vh, settle) {
  const step = Math.max(200, Math.round(vh / 2));
  let y = await page.evaluate(() => window.scrollY);
  while (Math.abs(target - y) > step) {
    y += target > y ? step : -step;
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    await sleep(80);
  }
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), target);
  await sleep(settle);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  return page.evaluate(() => Math.round(window.scrollY));
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const { chromium } = loadPlaywright();
  const outDir = path.resolve(ROOT, opts.out ?? path.join('.visual', timestamp() + (opts.label ? `-${opts.label}` : '')));
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch().catch((e) => fail(`Chromium failed to launch — ${e.message.split('\n')[0]}\n` +
    `  Missing system libraries? Run once: sudo env "PATH=$PATH" ${TOOLS_DIR}/node_modules/.bin/playwright install-deps chromium`));
  const report = { url: opts.url, capturedAt: new Date().toISOString(), browser: browser.version(), viewports: [] };
  const files = [];

  try {
    for (const vp of opts.viewport.split(',').map((t) => parseViewport(t.trim()))) {
      const { name, ...contextOpts } = vp;
      const context = await browser.newContext({
        viewport: { width: contextOpts.width, height: contextOpts.height },
        deviceScaleFactor: contextOpts.deviceScaleFactor,
        isMobile: contextOpts.isMobile ?? false,
        hasTouch: contextOpts.hasTouch ?? false,
        reducedMotion: opts.reducedMotion ? 'reduce' : 'no-preference',
      });
      const page = await context.newPage();
      const issues = [];
      page.on('console', (msg) => { if (msg.type() === 'error') issues.push({ kind: 'console-error', text: msg.text() }); });
      page.on('pageerror', (err) => issues.push({ kind: 'page-error', text: err.message }));
      page.on('requestfailed', (req) => issues.push({ kind: 'request-failed', url: req.url(), text: req.failure()?.errorText }));
      page.on('response', (res) => { if (res.status() >= 400) issues.push({ kind: `http-${res.status()}`, url: res.url() }); });

      const response = await page.goto(opts.url, { waitUntil: 'load', timeout: 60_000 }).catch((e) => fail(`navigation to ${opts.url} failed — ${e.message.split('\n')[0]}`));
      if (!response?.ok()) fail(`${opts.url} answered HTTP ${response?.status()}`);
      // Next.js dev overlay/indicator would pollute captures; harmless no-op in production.
      await page.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
      await page.evaluate(() => document.fonts.ready);
      await sleep(opts.settle);

      const vh = contextOpts.height;
      const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
      const shots = [];
      const capture = async (label, fn) => {
        const file = path.join(outDir, `${name}-${label}.png`);
        await fn(file);
        files.push(file);
        shots.push({ label, file: path.relative(ROOT, file) });
      };

      if (opts.full) {
        await capture('full', (file) => page.screenshot({ path: file, fullPage: true }));
      } else if (opts.selector) {
        const el = page.locator(opts.selector).first();
        const top = await el.evaluate((node) => Math.round(node.getBoundingClientRect().top + window.scrollY)).catch(() => fail(`selector ${opts.selector} not found`));
        await walkTo(page, Math.min(top, maxScroll), vh, opts.settle);
        await capture(`sel-${opts.selector.replace(/[^\w-]+/g, '_').slice(0, 40)}`, (file) => el.screenshot({ path: file }));
      } else {
        const targets = opts.every
          ? (() => {
              const m = opts.every.match(/^(\d+(?:\.\d+)?)vh$/);
              if (!m) fail(`--every expects <n>vh, got "${opts.every}"`);
              const stepPx = Math.max(1, Math.round(Number(m[1]) * vh));
              const list = [];
              for (let y = 0; y < maxScroll; y += stepPx) list.push(y);
              list.push(maxScroll);
              return list;
            })()
          : opts.at.split(',').map((t) => resolveTarget(t.trim(), vh, maxScroll));
        for (const target of targets) {
          const actual = await walkTo(page, Math.min(target, maxScroll), vh, opts.settle);
          await capture(`y${String(actual).padStart(6, '0')}`, (file) => page.screenshot({ path: file }));
        }
      }

      report.viewports.push({ name, ...contextOpts, scrollHeight: maxScroll + vh, shots, issues });
      await context.close();
    }
  } finally {
    await browser.close();
  }

  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(`screenshots → ${path.relative(ROOT, outDir)}/  (Chromium ${report.browser})`);
  for (const vp of report.viewports) {
    console.log(`  [${vp.name}] ${vp.width}x${vp.height}@${vp.deviceScaleFactor}  page height ${vp.scrollHeight}px  ${vp.shots.length} shot(s)  ${vp.issues.length} issue(s)`);
    for (const issue of vp.issues) console.log(`    ⚠ ${issue.kind} ${issue.url ?? ''} ${issue.text ?? ''}`.trimEnd());
  }
  for (const f of files) console.log(`  ${path.relative(ROOT, f)}`);
}

main();
