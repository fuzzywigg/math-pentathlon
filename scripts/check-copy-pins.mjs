#!/usr/bin/env node
/**
 * Report-only checker: flag tests that pin player-facing copy.
 *
 * Compliance reviews 7 (#580) and 8 (#583) had to drop tests that locked:
 *   - getPhaseMessage / getCurrentPhaseMessage return text
 *   - menu badge copy "Coming Soon"
 * plus other asserts that pin strings from those copy surfaces.
 *
 * Default: scan tests/, print findings, always exit 0 (not a CI gate).
 *
 * Usage:
 *   npm run check:copy-pins
 *   npm run check:copy-pins -- --self-test
 *   npm run check:copy-pins -- --fail          # exit 1 when findings (opt-in)
 *   npm run check:copy-pins -- --json          # machine-readable findings
 *
 * Docs: docs/dev/check-copy-pins.md
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TESTS_DIR = path.join(ROOT, 'tests');

const MESSAGE_APIS = ['getPhaseMessage', 'getCurrentPhaseMessage'];
const MATCHER_RE =
  /\.\s*(?:not\s*\.\s*)?(?:toBe|toEqual|toStrictEqual|toMatch|toContain)\s*\(/;
const EXPECT_RE = /\bexpect\s*\(/;
const COMING_SOON_LIT_RE = /(['"`])Coming Soon\1|\/Coming Soon\/[gimsuy]*/;
/** How many lines after `expect(` to join for multi-line asserts. */
const WINDOW_LINES = 6;

/** Known examples dropped by reviews 7/8 — used by --self-test. */
const REVIEW_EXAMPLES = [
  {
    id: 'review-7-calla-getPhaseMessage',
    path: 'virtual/review-7-calla-phase.ts',
    source: `
import { getPhaseMessage as callaPhase } from '../../src/games/calla/rules';
it('getPhaseMessage returns empty string when gameOver and winner is null', () => {
  const weird = { phase: 'gameOver', winner: null, currentPlayer: 'player1' };
  expect(callaPhase(weird)).toBe('');
});
`,
  },
  {
    id: 'review-7-coming-soon',
    path: 'virtual/review-7-coming-soon.ts',
    source: `
it('renders Coming Soon badge for unavailable games', () => {
  const badge = document.querySelector('.game-card-badge');
  expect(badge?.textContent).toBe('Coming Soon');
});
`,
  },
  {
    id: 'review-8-kings-getCurrentPhaseMessage',
    path: 'virtual/review-8-kings-phase.ts',
    source: `
import { getCurrentPhaseMessage } from '../../src/games/kings-quadraphages/game-state';
it('getCurrentPhaseMessage covers move / place / win / tie', () => {
  expect(getCurrentPhaseMessage(selected)).toMatch(/green square/);
  expect(getCurrentPhaseMessage(afterMove)).toMatch(/Place a Quadraphage/);
  expect(getCurrentPhaseMessage(p1Win)).toMatch(/Player 1 wins/);
  expect(getCurrentPhaseMessage(tie)).toMatch(/Tie/);
});
`,
  },
];

/** Negative cases — must produce zero findings (false-positive guard). */
const NEGATIVE_EXAMPLES = [
  {
    id: 'neg-badge-presence',
    path: 'virtual/neg-badge-presence.ts',
    source: `
it('renders Coming Soon badge for unavailable games and toggles accordion', () => {
  const badge = root.querySelector('.game-card-badge');
  expect(badge).toBeTruthy();
  expect(disabledCard?.getAttribute('tabindex')).toBe('-1');
});
`,
  },
  {
    id: 'neg-typeof-phase',
    path: 'virtual/neg-typeof-phase.ts',
    source: `
import { getPhaseMessage as callaPhase } from '../../src/games/calla/rules';
it('phase helper returns a string', () => {
  expect(typeof callaPhase(state)).toBe('string');
});
`,
  },
  {
    id: 'neg-fixture-name',
    path: 'virtual/neg-fixture-name.ts',
    source: `
const unavailable = { name: 'Coming Soon Probe', available: false };
expect(unavailable.available).toBe(false);
`,
  },
  {
    id: 'neg-length-only',
    path: 'virtual/neg-length-only.ts',
    source: `
import { getPhaseMessage } from '../../src/games/star-track/rules';
it('message non-empty', () => {
  expect(getPhaseMessage(drawn).length).toBeGreaterThan(0);
});
`,
  },
  {
    id: 'neg-phase-enum',
    path: 'virtual/neg-phase-enum.ts',
    source: `
it('engine phase enum', () => {
  expect(state.phase).toBe('placeBlocks');
  expect(state.turnPhase).toBe('selectChain');
});
`,
  },
];

/**
 * @param {string} dir
 * @param {string[]} [out]
 * @returns {string[]}
 */
function walkTests(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === '_tokenmaxx_archive' || ent.name === 'node_modules') {
        continue;
      }
      walkTests(p, out);
    } else if (
      ent.isFile() &&
      /\.(?:test|spec)\.(?:ts|tsx|js|mjs)$/.test(ent.name)
    ) {
      out.push(p);
    }
  }
  return out;
}

/** @param {string} p */
function toPosix(p) {
  return p.split(path.sep).join('/');
}

/** @param {string} abs */
function relRoot(abs) {
  return toPosix(path.relative(ROOT, abs));
}

/**
 * @param {string} text
 * @returns {string}
 */
function stripComments(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

/** @param {string} s */
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Collect local names bound to getPhaseMessage / getCurrentPhaseMessage.
 * @param {string} text
 * @returns {Set<string>}
 */
function collectMessageAliases(text) {
  const names = new Set(MESSAGE_APIS);
  const importRe = /import\s*\{([^}]+)\}\s*from\s*['"][^'"]+['"]/g;
  let m;
  while ((m = importRe.exec(text)) !== null) {
    const parts = m[1].split(',');
    for (const part of parts) {
      const bit = part.trim();
      if (!bit) continue;
      const asMatch = bit.match(
        /^(getPhaseMessage|getCurrentPhaseMessage)\s+as\s+([A-Za-z_$][\w$]*)$/
      );
      if (asMatch) {
        names.add(asMatch[2]);
        continue;
      }
      const plain = bit.match(/^(getPhaseMessage|getCurrentPhaseMessage)$/);
      if (plain) names.add(plain[1]);
    }
  }
  return names;
}

/**
 * Extract player-facing strings from return literals in phase-message helpers
 * plus the menu "Coming Soon" badge.
 * @returns {{ value: string, source: string }[]}
 */
function harvestCopyRegistry() {
  /** @type {{ value: string, source: string }[]} */
  const entries = [];
  const seen = new Set();

  /** @param {string} value @param {string} source */
  function add(value, source) {
    const v = value.replace(/\s+/g, ' ').trim();
    // Keep short but distinctive menu copy; otherwise require meaningful phrase.
    if (v === 'Coming Soon') {
      /* ok */
    } else if (v.length < 10) {
      return;
    }
    if (!/[A-Za-z]{3,}/.test(v)) return;
    // Skip identifiers / enum-like tokens mistakenly near returns.
    if (/^[A-Za-z][A-Za-z0-9]*$/.test(v) && !/\s/.test(v)) return;
    const key = v.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    entries.push({ value: v, source });
  }

  const badgeSrc = path.join(ROOT, 'src/ui/game-selector.ts');
  if (fs.existsSync(badgeSrc)) {
    add('Coming Soon', relRoot(badgeSrc));
  }

  const gamesDir = path.join(ROOT, 'src/games');
  if (!fs.existsSync(gamesDir)) return entries;

  for (const game of fs.readdirSync(gamesDir, { withFileTypes: true })) {
    if (!game.isDirectory()) continue;
    for (const file of ['rules.ts', 'game-state.ts']) {
      const abs = path.join(gamesDir, game.name, file);
      if (!fs.existsSync(abs)) continue;
      const stripped = stripComments(fs.readFileSync(abs, 'utf8'));
      const fnRe =
        /export\s+function\s+(getPhaseMessage|getCurrentPhaseMessage)\s*\([^)]*\)\s*(?::\s*[^{]+)?\{/g;
      let fm;
      while ((fm = fnRe.exec(stripped)) !== null) {
        const start = fm.index + fm[0].length - 1;
        let depth = 0;
        let end = start;
        for (let i = start; i < stripped.length; i++) {
          const ch = stripped[i];
          if (ch === '{') depth += 1;
          else if (ch === '}') {
            depth -= 1;
            if (depth === 0) {
              end = i;
              break;
            }
          }
        }
        const body = stripped.slice(start, end + 1);
        // Only harvest string/template literals that appear in return statements.
        const returnRe =
          /\breturn\s+((['"`])(?:\\.|(?!\2)[^\\])*\2|`(?:\\`|[^`])*`)\s*;?/g;
        let rm;
        while ((rm = returnRe.exec(body)) !== null) {
          const expr = rm[1];
          const quote = expr[0];
          const raw = expr.slice(1, -1)
            .replace(/\\n/g, ' ')
            .replace(/\\'/g, "'")
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\');
          if (quote === '`') {
            for (const seg of raw.split(/\$\{[^}]*\}/)) {
              add(seg, relRoot(abs));
            }
          } else {
            add(raw, relRoot(abs));
          }
        }
      }
    }
  }
  return entries;
}

/**
 * Extract one `expect(...).(not.)?matcher(...)` unit from text starting at expect(.
 * Returns null when the span cannot be balanced within `text`.
 * @param {string} text
 * @returns {{ unit: string, matcherArg: string } | null}
 */
function extractExpectUnit(text) {
  const start = text.search(EXPECT_RE);
  if (start < 0) return null;
  const openExpect = text.indexOf('(', start);
  if (openExpect < 0) return null;

  /** @param {number} from open paren index */
  function closeParen(from) {
    let depth = 0;
    let inStr = /** @type {null | string} */ (null);
    let escape = false;
    for (let i = from; i < text.length; i++) {
      const ch = text[i];
      if (inStr) {
        if (escape) {
          escape = false;
          continue;
        }
        if (ch === '\\') {
          escape = true;
          continue;
        }
        if (ch === inStr) inStr = null;
        continue;
      }
      if (ch === "'" || ch === '"' || ch === '`') {
        inStr = ch;
        continue;
      }
      if (ch === '(') depth += 1;
      else if (ch === ')') {
        depth -= 1;
        if (depth === 0) return i;
      }
    }
    return -1;
  }

  const endExpectArg = closeParen(openExpect);
  if (endExpectArg < 0) return null;
  const afterExpect = text.slice(endExpectArg + 1);
  const matcherMatch = afterExpect.match(
    /^\s*\.\s*(?:not\s*\.\s*)?(?:toBe|toEqual|toStrictEqual|toMatch|toContain)\s*\(/
  );
  if (!matcherMatch) return null;
  const matcherOpen =
    endExpectArg + 1 + afterExpect.indexOf('(', matcherMatch.index ?? 0);
  const matcherClose = closeParen(matcherOpen);
  if (matcherClose < 0) return null;
  const unit = text.slice(start, matcherClose + 1);
  const matcherArg = text.slice(matcherOpen + 1, matcherClose);
  return { unit, matcherArg };
}

/**
 * @typedef {{ file: string, line: number, kind: string, detail: string, snippet: string }} Finding
 */

/**
 * @param {string} fileRel
 * @param {string} source
 * @param {{ value: string, source: string }[]} registry
 * @returns {Finding[]}
 */
function scanSource(fileRel, source, registry) {
  /** @type {Finding[]} */
  const findings = [];
  const stripped = stripComments(source);
  const lines = stripped.split(/\r?\n/);
  const aliases = collectMessageAliases(stripped);
  const aliasList = [...aliases];

  /** @type {Set<string>} */
  const seenKeys = new Set();

  /** @param {Finding} f */
  function pushFinding(f) {
    const key = `${f.file}:${f.line}:${f.kind}`;
    if (seenKeys.has(key)) return;
    seenKeys.add(key);
    findings.push(f);
  }

  for (let i = 0; i < lines.length; i++) {
    // Start windows only on lines that open an expect( — avoids slide duplicates.
    if (!EXPECT_RE.test(lines[i])) continue;

    const window = lines.slice(i, i + WINDOW_LINES).join('\n');
    const extracted = extractExpectUnit(window);
    if (!extracted) continue;
    const { unit, matcherArg } = extracted;

    const snippet = lines[i].trim().slice(0, 160);
    const lineNo = i + 1;
    let flaggedApi = false;

    // --- Message API content pins ---
    for (const alias of aliasList) {
      const callRe = new RegExp(String.raw`\b${escapeRegExp(alias)}\s*\(`);
      if (!callRe.test(unit)) continue;
      if (
        new RegExp(String.raw`typeof\s+${escapeRegExp(alias)}\s*\(`).test(unit)
      ) {
        continue;
      }
      // Property probes: expect(getPhaseMessage(x).length)...
      if (
        new RegExp(
          String.raw`\b${escapeRegExp(alias)}\s*\([\s\S]*?\)\s*\.\s*(?:length|trim)\b`
        ).test(unit)
      ) {
        continue;
      }
      // expect(...alias(...)).matcher — not expect(other).toBe(alias())
      const expectCallRe = new RegExp(
        String.raw`expect\s*\(\s*(?:await\s+)?[\s\S]{0,240}?\b${escapeRegExp(alias)}\s*\(`
      );
      if (!expectCallRe.test(unit)) continue;

      pushFinding({
        file: fileRel,
        line: lineNo,
        kind: 'message-api',
        detail: `assert pins ${alias}() return text`,
        snippet,
      });
      flaggedApi = true;
      break;
    }

    // --- Coming Soon badge / aria copy ---
    if (COMING_SOON_LIT_RE.test(matcherArg)) {
      pushFinding({
        file: fileRel,
        line: lineNo,
        kind: 'coming-soon',
        detail: 'assert pins "Coming Soon" menu copy',
        snippet,
      });
    }

    // --- Copy-registry string pins (exact phrase / substantial substring) ---
    if (!flaggedApi) {
      for (const entry of registry) {
        const lit = entry.value;
        if (lit === 'Coming Soon') {
          // Handled by coming-soon kind.
          continue;
        }
        const litEsc = escapeRegExp(lit);
        // Exact full-string pin in matcher arg
        const exactRe = new RegExp(
          String.raw`^\s*(['"\`])${litEsc}\1\s*$`
        );
        const needles = [];
        if (lit.length >= 12) needles.push(lit);
        const fragMatch = lit.match(
          /(?:green square|Place a Quadraphage|Click your King|distributing cubes|Coming Soon|It's a tie|It's a draw|Select 1-3|Draw chains|Choose a chain)/i
        );
        if (fragMatch) needles.push(fragMatch[0]);

        let hit = exactRe.test(matcherArg);
        let detailLit = lit;
        if (!hit) {
          for (const needle of needles) {
            if (needle.length < 8) continue;
            const nEsc = escapeRegExp(needle);
            const softRe = new RegExp(
              String.raw`(['"\`])[^'"\`]*(?:${nEsc})[^'"\`]*\1|\/[^/\n]*(?:${nEsc})[^/\n]*\/`
            );
            if (softRe.test(matcherArg)) {
              hit = true;
              detailLit = needle;
              break;
            }
          }
        }
        if (!hit) continue;

        pushFinding({
          file: fileRel,
          line: lineNo,
          kind: 'registry-string',
          detail: `assert pins copy from ${entry.source}: "${detailLit}"`,
          snippet,
        });
        break;
      }
    }
  }

  return findings;
}

/**
 * @param {string[]} argv
 */
function parseArgs(argv) {
  return {
    selfTest: argv.includes('--self-test'),
    fail: argv.includes('--fail'),
    json: argv.includes('--json'),
  };
}

function runSelfTest(registry) {
  let ok = true;
  console.log('check-copy-pins: --self-test (review 7/8 examples + negatives)\n');

  for (const ex of REVIEW_EXAMPLES) {
    const findings = scanSource(ex.path, ex.source, registry);
    const pass = findings.length > 0;
    console.log(
      `${pass ? 'PASS' : 'FAIL'}  ${ex.id} — expected ≥1 finding, got ${findings.length}`
    );
    for (const f of findings) {
      console.log(`         L${f.line} [${f.kind}] ${f.detail}`);
    }
    if (!pass) ok = false;
  }

  for (const ex of NEGATIVE_EXAMPLES) {
    const findings = scanSource(ex.path, ex.source, registry);
    const pass = findings.length === 0;
    console.log(
      `${pass ? 'PASS' : 'FAIL'}  ${ex.id} — expected 0 findings, got ${findings.length}`
    );
    for (const f of findings) {
      console.log(`         L${f.line} [${f.kind}] ${f.detail} :: ${f.snippet}`);
    }
    if (!pass) ok = false;
  }

  console.log(ok ? '\nSelf-test OK' : '\nSelf-test FAILED');
  return ok ? 0 : 1;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const registry = harvestCopyRegistry();

  if (args.selfTest) {
    process.exitCode = runSelfTest(registry);
    return;
  }

  const files = walkTests(TESTS_DIR).sort();
  /** @type {Finding[]} */
  const findings = [];
  for (const abs of files) {
    const rel = relRoot(abs);
    const source = fs.readFileSync(abs, 'utf8');
    findings.push(...scanSource(rel, source, registry));
  }

  findings.sort((a, b) =>
    a.file === b.file ? a.line - b.line : a.file.localeCompare(b.file)
  );

  if (args.json) {
    console.log(
      JSON.stringify(
        {
          reportOnly: true,
          filesScanned: files.length,
          registrySize: registry.length,
          findingCount: findings.length,
          findings,
        },
        null,
        2
      )
    );
  } else {
    console.log('check-copy-pins: report-only (not a CI gate)');
    console.log(`  tests scanned: ${files.length}`);
    console.log(`  copy-registry entries: ${registry.length}`);
    console.log(`  findings: ${findings.length}`);
    console.log('');
    if (findings.length === 0) {
      console.log('No player-facing copy pins detected in tests/.');
    } else {
      let prev = '';
      for (const f of findings) {
        if (f.file !== prev) {
          console.log(`${f.file}`);
          prev = f.file;
        }
        console.log(`  L${f.line}  [${f.kind}] ${f.detail}`);
        if (f.snippet) console.log(`         ${f.snippet}`);
      }
      console.log('');
      console.log(
        'Guidance: prefer structural asserts (presence, tabindex, phase enum, ids)'
      );
      console.log(
        'over pinning getPhaseMessage / getCurrentPhaseMessage / "Coming Soon" text.'
      );
      console.log('See docs/dev/check-copy-pins.md');
    }
    console.log('');
    console.log('Report-only: exit 0');
  }

  if (args.fail && findings.length > 0) {
    process.exitCode = 1;
  }
}

main();
