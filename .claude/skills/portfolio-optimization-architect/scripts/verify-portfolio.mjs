#!/usr/bin/env node
/**
 * verify-portfolio.mjs — mechanical gate runner for the portfolio-optimization-architect skill.
 *
 * Usage (from anywhere; paths resolve against the repo root):
 *   node .claude/skills/portfolio-optimization-architect/scripts/verify-portfolio.mjs [--all | check...]
 *
 * Checks:
 *   crlf          no CRLF/CR line endings in tracked text sources
 *   casing        every relative/@-alias import resolves with exact character casing, and every
 *                 public asset URL referenced from src/ matches public/ exactly (D-11)
 *   img           no raw <img> in src/ (Invariant F-1 — next/image only)
 *   client        'use client' census; fails on files missing from
 *                 docs/optimization-state/client-allowlist.json (info-only if absent)
 *   placeholders  TODO/TBD/FIXME/lorem/??? — warn in src/, FAIL in docs/portfolio-internals/
 *   assets        public/ hygiene: extensionless files (fail), >300KB sources (warn)
 *   deps          dependencies with no import/reference anywhere (warn — heuristic)
 *   docs          G1 path-evidence, G2 zero-placeholder, G3 link/anchor integrity
 *                 for docs/portfolio-internals/ (skipped while that tree doesn't exist)
 *   budget        first-load JS/CSS/HTML per prerendered route, read from the production
 *                 build output (Next 16 removed First Load JS from `next build` — D-8).
 *                 FAILs if there is no build output; warns over the 140 KB gz JS target.
 *
 * Exit code 1 if any check FAILs. Warnings never fail a gate but must be spoken to.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../../..');
const SRC = path.join(ROOT, 'src');
const DOCS = path.join(ROOT, 'docs', 'portfolio-internals');
const ALLOWLIST = path.join(ROOT, 'docs', 'optimization-state', 'client-allowlist.json');

const TEXT_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.css', '.json', '.md', '.svg', '.txt', '.yml', '.yaml']);
const CODE_EXTS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.css', '.json'];
const IGNORE_DIRS = new Set(['node_modules', '.next', '.git', 'out', '.vercel']);
const ROOT_TEXT_FILES = ['package.json', 'tsconfig.json', 'next.config.ts', 'postcss.config.mjs', 'eslint.config.mjs', 'pnpm-workspace.yaml', '.gitattributes', '.env.example', 'AGENTS.md', 'CLAUDE.md'];
// pnpm-lock.yaml is deliberately not a ROOT_TEXT_FILE: it names every dependency and would blind the deps check (D-7).
const KNOWN_ROOT_FILES = new Set([...ROOT_TEXT_FILES, 'pnpm-lock.yaml', 'next-env.d.ts']);
const BUILD_APP = path.join(ROOT, '.next', 'server', 'app');
const BUDGET_JS_GZ_KB = 140; // cwv-invariants.md budget for the homepage, binding from Phase 2.8
// Case-sensitive on the ALL-CAPS stub tokens so CSS ::placeholder / JSX placeholder= never match.
const PLACEHOLDER_RES = [/\b(TODO|FIXME|TBD|HACK|XXX|PLACEHOLDER)\b|\?{3,}|<your[- ]/, /lorem ipsum/i];
const hasPlaceholder = (line) => PLACEHOLDER_RES.some((re) => re.test(line));

const rel = (p) => path.relative(ROOT, p) || '.';

function* walk(dir) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    if (e.isDirectory()) {
      if (!IGNORE_DIRS.has(e.name)) yield* walk(path.join(dir, e.name));
    } else if (e.isFile()) {
      yield path.join(dir, e.name);
    }
  }
}

function textFiles() {
  const files = [];
  for (const f of walk(SRC)) if (TEXT_EXTS.has(path.extname(f))) files.push(f);
  const docsRoot = path.join(ROOT, 'docs');
  for (const f of walk(docsRoot)) if (TEXT_EXTS.has(path.extname(f))) files.push(f);
  for (const name of ROOT_TEXT_FILES) {
    const p = path.join(ROOT, name);
    if (fs.existsSync(p)) files.push(p);
  }
  return files;
}

function read(f) { return fs.readFileSync(f, 'utf8'); }

// Case-insensitive path resolution: returns the on-disk path (may differ in case) or null.
function ciResolve(p) {
  const r = path.relative(ROOT, p);
  if (r.startsWith('..')) return fs.existsSync(p) ? p : null;
  let cur = ROOT;
  for (const seg of r.split(path.sep)) {
    let entries;
    try { entries = fs.readdirSync(cur); } catch { return null; }
    const hit = entries.includes(seg) ? seg : entries.find((e) => e.toLowerCase() === seg.toLowerCase());
    if (!hit) return null;
    cur = path.join(cur, hit);
  }
  return cur;
}

// ---------- checks ----------

function checkCrlf() {
  const fails = [];
  for (const f of textFiles()) {
    if (read(f).includes('\r')) fails.push(`${rel(f)} contains CR/CRLF line endings`);
  }
  return { fails, warns: [], info: [] };
}

function extractImports(content) {
  // Commented-out imports are dead code, not path claims — strip comments first.
  content = content.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const specs = new Set();
  const patterns = [
    /(?:import|export)\s[^;'"]*?from\s*(['"])([^'"]+)\1/gs, // import x from '...' / export ... from '...'
    /(?:^|\n)\s*import\s*(['"])([^'"]+)\1/g,                // side-effect import '...'
    /import\(\s*(['"])([^'"]+)\1\s*\)/g,                    // dynamic import('...')
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(content)) !== null) specs.add(m[2]);
  }
  return [...specs];
}

function checkCasing() {
  const fails = [];
  const EXTS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.css', '.json'];
  for (const f of walk(SRC)) {
    if (!['.ts', '.tsx'].includes(path.extname(f))) continue;
    for (const spec of extractImports(read(f))) {
      let base = null;
      if (spec.startsWith('@/')) base = path.join(SRC, spec.slice(2));
      else if (spec.startsWith('./') || spec.startsWith('../')) base = path.resolve(path.dirname(f), spec);
      else continue; // package import — not ours to check
      const candidates = [base, ...EXTS.map((e) => base + e), ...EXTS.map((e) => path.join(base, 'index' + e))];
      const exact = candidates.find((c) => fs.existsSync(c) && fs.statSync(c).isFile());
      if (exact) continue;
      const ci = candidates.map(ciResolve).find((c) => c && fs.statSync(c).isFile());
      if (ci) fails.push(`${rel(f)}: import "${spec}" — case mismatch, disk has ${rel(ci)}`);
      else fails.push(`${rel(f)}: import "${spec}" — does not resolve to any file`);
    }
  }
  // D-11 — public asset URLs referenced from src/ (string literals and CSS url()). NTFS served
  // `/images/process/…` for `public/images/Process/…`; Linux and Vercel return 404. Case mismatch
  // FAILs; a path with no file in any casing only warns (dead data is indistinguishable here).
  const warns = []; const info = [];
  const ASSET_EXT = 'png|jpe?g|webp|avif|gif|svg|ico|woff2?|ttf|otf|mp4|webm|pdf';
  const literalRe = new RegExp(`(['"\`])(/(?!/|_next/)[^'"\`\\s$]*?\\.(?:${ASSET_EXT}))(?:[?#][^'"\`\\s]*)?\\1`, 'gi');
  const cssUrlRe = new RegExp(`url\\(\\s*(['"]?)(/(?!/|_next/)[^)'"\\s]+?\\.(?:${ASSET_EXT}))(?:[?#][^)'"\\s]*)?\\1\\s*\\)`, 'gi');
  let checked = 0;
  for (const f of walk(SRC)) {
    if (!['.ts', '.tsx', '.js', '.jsx', '.mjs', '.css'].includes(path.extname(f))) continue;
    // Blank out comments while keeping offsets, so commented-out references are ignored and line numbers stay true.
    const content = read(f)
      .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
      .replace(/^[ \t]*\/\/.*$/gm, (m) => ' '.repeat(m.length));
    const seen = new Set();
    for (const re of [literalRe, cssUrlRe]) {
      for (const m of content.matchAll(re)) {
        const urlPath = m[2];
        const line = content.slice(0, m.index).split('\n').length;
        if (seen.has(`${line}:${urlPath}`)) continue;
        seen.add(`${line}:${urlPath}`);
        checked++;
        let decoded;
        try { decoded = decodeURIComponent(urlPath); } catch { decoded = urlPath; }
        const onDisk = path.join(ROOT, 'public', decoded);
        if (fs.existsSync(onDisk) && fs.statSync(onDisk).isFile()) continue;
        const ci = ciResolve(onDisk);
        if (ci && fs.statSync(ci).isFile()) fails.push(`${rel(f)}:${line} "${urlPath}" — case mismatch, disk has ${rel(ci)} (404 on Linux/Vercel)`);
        else warns.push(`${rel(f)}:${line} "${urlPath}" — no file under public/ in any casing (dead reference or 404)`);
      }
    }
  }
  info.push(`${checked} public asset reference(s) checked`);
  return { fails, warns, info };
}

function checkImg() {
  const fails = [];
  for (const f of walk(SRC)) {
    if (!['.tsx', '.jsx'].includes(path.extname(f))) continue;
    read(f).split('\n').forEach((line, i) => {
      if (/<img\b/.test(line)) fails.push(`${rel(f)}:${i + 1} raw <img> — route through next/image (Invariant F-1)`);
    });
  }
  return { fails, warns: [], info: [] };
}

function checkClient() {
  const fails = []; const warns = []; const info = [];
  const clientFiles = [];
  for (const f of walk(SRC)) {
    if (!CODE_EXTS.includes(path.extname(f))) continue;
    if (/(['"])use client\1/.test(read(f).slice(0, 400))) clientFiles.push(rel(f));
  }
  info.push(`'use client' modules: ${clientFiles.length}`);
  if (fs.existsSync(ALLOWLIST)) {
    let allow;
    try { allow = new Set(JSON.parse(read(ALLOWLIST))); }
    catch { fails.push(`${rel(ALLOWLIST)} is not valid JSON`); return { fails, warns, info }; }
    for (const f of clientFiles) if (!allow.has(f)) fails.push(`${f} carries 'use client' but is not in the allowlist`);
    for (const a of allow) if (!clientFiles.includes(a)) warns.push(`allowlist entry ${a} is no longer a client module — prune it`);
  } else {
    info.push(`(no ${rel(ALLOWLIST)} yet — census is informational)`);
    for (const f of clientFiles) info.push(`  - ${f}`);
  }
  return { fails, warns, info };
}

function scanPlaceholders(dir, level) {
  const hits = [];
  for (const f of walk(dir)) {
    if (!TEXT_EXTS.has(path.extname(f))) continue;
    read(f).split('\n').forEach((line, i) => {
      if (hasPlaceholder(line)) hits.push(`${rel(f)}:${i + 1} ${line.trim().slice(0, 90)}`);
    });
  }
  return hits.map((h) => `[${level}] ${h}`);
}

function checkPlaceholders() {
  const warns = scanPlaceholders(SRC, 'src');
  const fails = fs.existsSync(DOCS) ? scanPlaceholders(DOCS, 'docs') : [];
  return { fails, warns, info: [] };
}

function checkAssets() {
  const fails = []; const warns = [];
  const pub = path.join(ROOT, 'public');
  for (const f of walk(pub)) {
    if (!path.basename(f).includes('.')) fails.push(`${rel(f)} has no file extension`);
    if (/\s/.test(path.basename(f))) warns.push(`${rel(f)} has whitespace in its name — URL-encoding hazard, prefer hyphens`);
    const kb = Math.round(fs.statSync(f).size / 1024);
    if (kb > 300) warns.push(`${rel(f)} is ${kb}KB — will be served optimized, but consider a lighter source`);
  }
  return { fails, warns, info: [] };
}

function checkDeps() {
  const warns = []; const info = [];
  const pkgPath = path.join(ROOT, 'package.json');
  if (!fs.existsSync(pkgPath)) return { fails: [`package.json missing`], warns, info };
  const deps = Object.keys(JSON.parse(read(pkgPath)).dependencies ?? {});
  const haystack = [];
  for (const f of walk(SRC)) if (CODE_EXTS.includes(path.extname(f))) haystack.push(read(f));
  // package.json declares every dependency by name — scanning it would mark all of them as used.
  for (const name of ROOT_TEXT_FILES.filter((n) => n !== 'package.json')) {
    const p = path.join(ROOT, name);
    if (fs.existsSync(p)) haystack.push(read(p));
  }
  const blob = haystack.join('\n');
  const INDIRECT = new Set(['react-dom']); // used by the runtime, rarely imported directly
  for (const d of deps) {
    if (INDIRECT.has(d)) continue;
    if (!blob.includes(`'${d}`) && !blob.includes(`"${d}`)) {
      warns.push(`dependency "${d}" has no import/reference in src/ or root configs — dead? (heuristic)`);
    }
  }
  info.push(`${deps.length} runtime dependencies scanned`);
  return { fails: [], warns, info };
}

function slugify(h) {
  return h.toLowerCase().replace(/[`*_~]/g, '').replace(/[^\p{L}\p{N} -]/gu, '').trim().replace(/\s+/g, '-');
}

function checkDocs() {
  const fails = []; const warns = []; const info = [];
  if (!fs.existsSync(DOCS)) {
    info.push(`${rel(DOCS)} does not exist yet — docs gates skipped`);
    return { fails, warns, info };
  }
  const mdFiles = [...walk(DOCS)].filter((f) => f.endsWith('.md'));
  const headingsOf = (f) => {
    const set = new Set();
    for (const m of read(f).matchAll(/^#{1,6}\s+(.+)$/gm)) set.add(slugify(m[1]));
    return set;
  };
  for (const f of mdFiles) {
    const content = read(f);
    // G2 — zero placeholders (also covered by `placeholders`, repeated here so `docs` is self-contained)
    content.split('\n').forEach((line, i) => {
      if (hasPlaceholder(line)) fails.push(`G2 ${rel(f)}:${i + 1} placeholder survives: ${line.trim().slice(0, 80)}`);
    });
    // G1 — path evidence in backticks
    for (const m of content.matchAll(/`([^`\n]+)`/g)) {
      let tok = m[1].trim();
      if (/[\s*{}()<>|,]/.test(tok)) continue;           // globs, code, brace lists — not path claims
      tok = tok.replace(/:\d+(-\d+)?$/, '').replace(/\/$/, '');
      if (tok.startsWith('planned:')) continue;
      if (tok.startsWith('/')) {
        if (!fs.existsSync(tok)) warns.push(`G1 ${rel(f)}: absolute path \`${tok}\` not found (external evidence?)`);
        continue;
      }
      const isPathy = /^(src|docs|public|scripts|app|\.claude|\.github)\//.test(tok) || KNOWN_ROOT_FILES.has(tok);
      if (!isPathy) continue;
      if (!fs.existsSync(path.join(ROOT, tok))) fails.push(`G1 ${rel(f)}: cited path \`${tok}\` does not exist (prefix planned: if intentional)`);
    }
    // G3 — links and anchors
    for (const m of content.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
      const target = m[1];
      if (/^(https?:|mailto:)/.test(target)) continue;
      const [file, anchor] = target.split('#');
      const dest = file ? path.resolve(path.dirname(f), file) : f;
      if (file && !fs.existsSync(dest)) { fails.push(`G3 ${rel(f)}: link target ${target} does not exist`); continue; }
      if (anchor && dest.endsWith('.md')) {
        if (!headingsOf(dest).has(anchor.toLowerCase())) warns.push(`G3 ${rel(f)}: anchor #${anchor} not found in ${rel(dest)} (slug heuristic)`);
      }
    }
  }
  info.push(`${mdFiles.length} manual file(s) checked`);
  return { fails, warns, info };
}

function checkBudget() {
  const fails = []; const warns = []; const info = [];
  if (!fs.existsSync(BUILD_APP)) {
    fails.push(`${rel(BUILD_APP)} not found — run \`pnpm build\` first (budget measures the production build output)`);
    return { fails, warns, info };
  }
  const kb = (n) => (n / 1024).toFixed(1);
  const sizes = (buf) => ({ raw: buf.length, gz: zlib.gzipSync(buf, { level: 9 }).length, br: zlib.brotliCompressSync(buf).length });
  // Framework-internal prerenders (_not-found, _global-error) are not user routes.
  const pages = [...walk(BUILD_APP)].filter((f) => f.endsWith('.html') && !path.basename(f).startsWith('_'));
  if (!pages.length) fails.push(`no prerendered routes under ${rel(BUILD_APP)} — budget cannot measure dynamic-only output`);
  for (const page of pages) {
    const html = read(page);
    const route = '/' + path.relative(BUILD_APP, page).replace(/\\/g, '/').replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '');
    // noModule scripts are legacy polyfills that modern browsers never download.
    const legacy = new Set([...html.matchAll(/<script\b[^>]*>/g)]
      .filter((m) => /\bnoModule\b/i.test(m[0]))
      .map((m) => (m[0].match(/src="\/_next\/(static\/[^"]+)"/) ?? [])[1])
      .filter(Boolean));
    // Every chunk the document references — <script src>, <link rel=preload> and the inline RSC payload.
    const jsFiles = [...new Set([...html.matchAll(/static\/chunks\/[\w.~-]+\.js/g)].map((m) => m[0]))].filter((f) => !legacy.has(f));
    const cssFiles = [...new Set([...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="\/_next\/(static\/[^"]+\.css)"/g)].map((m) => m[1]))];
    const measure = (files) => files.map((f) => {
      const p = path.join(ROOT, '.next', f);
      if (!fs.existsSync(p)) { fails.push(`${route}: referenced asset ${f} missing from .next/ — stale or partial build`); return null; }
      return { f, ...sizes(fs.readFileSync(p)) };
    }).filter(Boolean);
    const js = measure(jsFiles); const css = measure(cssFiles);
    const sum = (rows, k) => rows.reduce((a, r) => a + r[k], 0);
    const doc = sizes(Buffer.from(html));
    info.push(`${route}  JS ${js.length} files: ${kb(sum(js, 'gz'))} KB gz / ${kb(sum(js, 'br'))} KB br / ${kb(sum(js, 'raw'))} KB raw | CSS ${css.length} files: ${kb(sum(css, 'gz'))} KB gz | HTML ${kb(doc.gz)} KB gz`);
    for (const r of [...js].sort((a, b) => b.gz - a.gz).slice(0, 3)) info.push(`    ${kb(r.gz).padStart(6)} KB gz  ${r.f}`);
    if (route === '/' && sum(js, 'gz') / 1024 > BUDGET_JS_GZ_KB) {
      warns.push(`/ first-load JS ${kb(sum(js, 'gz'))} KB gz exceeds the ${BUDGET_JS_GZ_KB} KB gz target (binding from Phase 2.8)`);
    }
  }
  return { fails, warns, info };
}

// ---------- runner ----------

const CHECKS = {
  crlf: checkCrlf, casing: checkCasing, img: checkImg, client: checkClient,
  placeholders: checkPlaceholders, assets: checkAssets, deps: checkDeps, docs: checkDocs,
  budget: checkBudget,
};

const args = process.argv.slice(2).filter((a) => a !== '--all');
const requested = args.length && !process.argv.includes('--all') ? args : Object.keys(CHECKS);
const unknown = requested.filter((r) => !CHECKS[r]);
if (unknown.length) { console.error(`Unknown check(s): ${unknown.join(', ')}. Valid: ${Object.keys(CHECKS).join(', ')}`); process.exit(2); }

let passed = 0, failed = 0, warned = 0;
for (const name of requested) {
  const { fails, warns, info } = CHECKS[name]();
  const status = fails.length ? '✗ FAIL' : '✓ pass';
  if (fails.length) failed++; else passed++;
  warned += warns.length;
  console.log(`\n[${name}] ${status}${warns.length ? ` (${warns.length} warning${warns.length > 1 ? 's' : ''})` : ''}`);
  for (const line of info) console.log(`  i ${line}`);
  for (const line of warns) console.log(`  ⚠ ${line}`);
  for (const line of fails) console.log(`  ✗ ${line}`);
}
console.log(`\nVERIFY: ${passed} passed, ${failed} failed, ${warned} warning(s) — checks: ${requested.join(', ')}`);
process.exit(failed ? 1 : 0);
