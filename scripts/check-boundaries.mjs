#!/usr/bin/env node
/**
 * Module-boundary / import-graph audit for src/.
 *
 * Walks TypeScript sources with a regex import parser (no new deps), builds the
 * relative-import graph, then reports:
 *   - circular import SCCs (value edges; type-only edges listed separately)
 *   - layering violations (engine→UI/AI, core→games/ui, AI→UI, cross-game)
 *   - engine/AI modules referencing browser DOM globals
 *   - dead re-export barrels and barrels that re-export *-ui
 *
 * Counts are ratcheted against docs/dev/module-boundaries-ceilings.json —
 * totals may only go down. Exit 0 when at or under the ceiling; exit 1 if any
 * category rises.
 *
 * Usage: npm run check:boundaries
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const CEILING_PATH = path.join(
  ROOT,
  'docs/dev/module-boundaries-ceilings.json'
);

const DOM_IDENT =
  /\b(?:document|window|HTMLElement|SVGElement|localStorage|sessionStorage|navigator)\b/;

const UI_REEXPORT =
  /(?:^|\n)\s*export\s+\*\s+from\s+['"]\.\/[^'"]*(?:-ui|dice-selector|dice-ui|highlight-ui)['"]/;

/**
 * @param {string} dir
 * @param {string[]} [out]
 * @returns {string[]}
 */
function walkTs(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkTs(p, out);
    else if (
      ent.isFile() &&
      /\.tsx?$/.test(ent.name) &&
      !ent.name.endsWith('.d.ts')
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

/**
 * @param {string} fromFile
 * @param {string} spec
 * @returns {string | null}
 */
function resolveImport(fromFile, spec) {
  if (!spec.startsWith('.') || spec.includes('?')) return null;
  const base = path.resolve(path.dirname(fromFile), spec);
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    path.join(base, 'index.ts'),
    path.join(base, 'index.tsx'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) {
      return path.normalize(c);
    }
  }
  return null;
}

/**
 * Collect relative imports from a source file.
 * @param {string} file
 * @param {string} text stripped source
 * @returns {{ value: Set<string>, typeOnly: Set<string> }}
 */
function collectImports(file, text) {
  /** @type {Set<string>} */
  const value = new Set();
  /** @type {Set<string>} */
  const typeOnly = new Set();

  /**
   * @param {string} spec
   * @param {boolean} isType
   */
  function add(spec, isType) {
    const resolved = resolveImport(file, spec);
    if (!resolved) return;
    if (isType) {
      typeOnly.add(resolved);
      value.add(resolved); // type edges participate in "all" graph
    } else {
      value.add(resolved);
    }
  }

  for (const m of text.matchAll(
    /(?:^|\n)\s*import\s+type\s+[\s\S]*?from\s*['"]([^'"]+)['"]/g
  )) {
    add(m[1], true);
  }
  for (const m of text.matchAll(
    /(?:^|\n)\s*export\s+type\s+[\s\S]*?from\s*['"]([^'"]+)['"]/g
  )) {
    add(m[1], true);
  }
  for (const m of text.matchAll(
    /(?:^|\n)\s*import\s+(?!type\b)[\s\S]*?from\s*['"]([^'"]+)['"]/g
  )) {
    add(m[1], false);
  }
  for (const m of text.matchAll(
    /(?:^|\n)\s*export\s+(?!type\b)[\s\S]*?from\s*['"]([^'"]+)['"]/g
  )) {
    add(m[1], false);
  }
  for (const m of text.matchAll(/import\s*\(\s*['"]([^'"]+)['"]\s*\)/g)) {
    add(m[1], false);
  }
  for (const m of text.matchAll(/(?:^|\n)\s*import\s*['"]([^'"]+)['"]/g)) {
    add(m[1], false);
  }

  // Targets that only appear via `import type` / `export type` stay type-only;
  // if a value import also exists, drop typeOnly membership.
  for (const t of [...typeOnly]) {
    // Heuristic: if we also matched a non-type import to t, typeOnly still has
    // it from the type pass — clear when a value import line also resolved to t.
    // Re-scan value-only patterns is expensive; instead: if the raw file has a
    // non-type import of the same specifier, keep both. For SCC "value" mode we
    // exclude typeOnly, so dual imports should NOT be in typeOnly.
  }

  return { value, typeOnly };
}

/**
 * Refine typeOnly: a target is type-only iff every import of it from this file
 * was type-only. Re-parse with simpler line-aware check on stripped text.
 * @param {string} text
 * @param {string} file
 * @param {Set<string>} all
 * @returns {Set<string>}
 */
function refineTypeOnly(text, file, all) {
  /** @type {Map<string, { type: boolean, value: boolean }>} */
  const flags = new Map();
  for (const t of all) flags.set(t, { type: false, value: false });

  const patterns = [
    {
      re: /(?:^|\n)\s*import\s+type\s+[\s\S]*?from\s*['"]([^'"]+)['"]/g,
      type: true,
    },
    {
      re: /(?:^|\n)\s*export\s+type\s+[\s\S]*?from\s*['"]([^'"]+)['"]/g,
      type: true,
    },
    {
      re: /(?:^|\n)\s*import\s+(?!type\b)[\s\S]*?from\s*['"]([^'"]+)['"]/g,
      type: false,
    },
    {
      re: /(?:^|\n)\s*export\s+(?!type\b)[\s\S]*?from\s*['"]([^'"]+)['"]/g,
      type: false,
    },
    { re: /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g, type: false },
    { re: /(?:^|\n)\s*import\s*['"]([^'"]+)['"]/g, type: false },
  ];

  for (const { re, type } of patterns) {
    for (const m of text.matchAll(re)) {
      const resolved = resolveImport(file, m[1]);
      if (!resolved || !flags.has(resolved)) continue;
      const f = flags.get(resolved);
      if (type) f.type = true;
      else f.value = true;
    }
  }

  /** @type {Set<string>} */
  const typeOnly = new Set();
  for (const [t, f] of flags) {
    if (f.type && !f.value) typeOnly.add(t);
  }
  return typeOnly;
}

/**
 * @param {string} rel
 */
function classify(rel) {
  if (rel.startsWith('src/games/')) {
    const parts = rel.split('/');
    const game = parts[2];
    const file = parts.slice(3).join('/');
    if (
      /^(rules|types|board|game-state|serialization|layout|pieces)\.ts$/.test(
        file
      )
    ) {
      return { layer: 'engine', game };
    }
    if (
      file === 'ai.ts' ||
      file === 'ai-client.ts' ||
      file === 'ai.worker.ts' ||
      /^ai[-.]/.test(file)
    ) {
      return { layer: 'ai', game };
    }
    if (
      /board-ui|board-renderer|game-controller|tutorial|board-3d/.test(file)
    ) {
      return { layer: 'game-ui', game };
    }
    if (file === 'index.ts') return { layer: 'barrel', game };
    return { layer: 'game-other', game };
  }
  if (rel.startsWith('src/core/')) {
    if (
      /-ui\.ts$/.test(rel) ||
      /\/dice-selector\.ts$/.test(rel) ||
      /\/highlight-ui\.ts$/.test(rel)
    ) {
      return { layer: 'core-ui', game: null };
    }
    return { layer: 'core', game: null };
  }
  if (rel.startsWith('src/ui/')) return { layer: 'ui', game: null };
  if (rel.startsWith('src/demos/')) return { layer: 'demos', game: null };
  if (rel.startsWith('src/pwa/')) return { layer: 'pwa', game: null };
  if (rel === 'src/main.ts') return { layer: 'entry', game: null };
  return { layer: 'other', game: null };
}

/**
 * Tarjan SCC. @param {Map<string, string[]>} adj
 * @returns {string[][]}
 */
function findSccs(adj) {
  let index = 0;
  const indices = new Map();
  const lowlink = new Map();
  /** @type {string[]} */
  const stack = [];
  const onStack = new Set();
  /** @type {string[][]} */
  const sccs = [];

  /** @param {string} v */
  function strongconnect(v) {
    indices.set(v, index);
    lowlink.set(v, index);
    index++;
    stack.push(v);
    onStack.add(v);
    for (const w of adj.get(v) || []) {
      if (!indices.has(w)) {
        strongconnect(w);
        lowlink.set(v, Math.min(lowlink.get(v), lowlink.get(w)));
      } else if (onStack.has(w)) {
        lowlink.set(v, Math.min(lowlink.get(v), indices.get(w)));
      }
    }
    if (lowlink.get(v) === indices.get(v)) {
      /** @type {string[]} */
      const scc = [];
      let w;
      do {
        w = stack.pop();
        onStack.delete(w);
        scc.push(w);
      } while (w !== v);
      const selfLoop = (adj.get(v) || []).includes(v);
      if (scc.length > 1 || selfLoop) sccs.push(scc);
    }
  }

  for (const n of adj.keys()) {
    if (!indices.has(n)) strongconnect(n);
  }
  return sccs;
}

/**
 * @returns {{
 *   files: number,
 *   edges: number,
 *   cycles: string[][],
 *   cyclesIncludingTypeOnly: string[][],
 *   violations: { kind: string, from: string, to: string }[],
 *   domHits: { file: string, layer: string, sample: string }[],
 *   deadBarrels: string[],
 *   mixedBarrels: string[],
 *   counts: Record<string, number>,
 * }}
 */
export function auditBoundaries() {
  const files = walkTs(SRC);
  /** @type {Map<string, { all: Set<string>, typeOnly: Set<string>, raw: string }>} */
  const graph = new Map();

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    const text = stripComments(raw);
    const { value: all } = collectImports(file, text);
    const typeOnly = refineTypeOnly(text, file, all);
    graph.set(file, { all, typeOnly, raw });
  }

  /**
   * @param {boolean} ignoreTypeOnly
   * @returns {Map<string, string[]>}
   */
  function buildAdj(ignoreTypeOnly) {
    /** @type {Map<string, string[]>} */
    const adj = new Map();
    for (const [n, { all, typeOnly }] of graph) {
      const outs = [];
      for (const t of all) {
        if (!graph.has(t)) continue;
        if (ignoreTypeOnly && typeOnly.has(t)) continue;
        outs.push(t);
      }
      adj.set(n, outs);
    }
    return adj;
  }

  const cyclesValue = findSccs(buildAdj(true)).map((scc) =>
    scc.map(relRoot).sort()
  );
  const cyclesAll = findSccs(buildAdj(false)).map((scc) =>
    scc.map(relRoot).sort()
  );

  /** @type {{ kind: string, from: string, to: string }[]} */
  const violations = [];
  /** @type {{ file: string, layer: string, sample: string }[]} */
  const domHits = [];

  for (const [file, { all, raw }] of graph) {
    const fromRel = relRoot(file);
    const from = classify(fromRel);
    const code = stripComments(raw);

    if (
      (from.layer === 'engine' || from.layer === 'ai') &&
      DOM_IDENT.test(code)
    ) {
      const sample =
        code
          .split('\n')
          .find((l) => DOM_IDENT.test(l))
          ?.trim()
          .slice(0, 120) ?? '';
      if (sample) {
        domHits.push({ file: fromRel, layer: from.layer, sample });
      }
    }

    for (const t of all) {
      const toRel = relRoot(t);
      const to = classify(toRel);

      if (from.layer === 'engine') {
        if (
          ['ui', 'game-ui', 'demos', 'pwa', 'entry', 'core-ui'].includes(
            to.layer
          )
        ) {
          violations.push({ kind: 'engine→ui', from: fromRel, to: toRel });
        }
        if (to.layer === 'ai') {
          violations.push({ kind: 'engine→ai', from: fromRel, to: toRel });
        }
      }
      if (from.layer === 'core' && toRel.startsWith('src/games/')) {
        violations.push({ kind: 'core→games', from: fromRel, to: toRel });
      }
      if (
        from.layer === 'core' &&
        (to.layer === 'ui' || to.layer === 'demos' || to.layer === 'game-ui')
      ) {
        violations.push({ kind: 'core→ui', from: fromRel, to: toRel });
      }
      if (from.game && to.game && from.game !== to.game) {
        violations.push({ kind: 'cross-game', from: fromRel, to: toRel });
      }
      if (
        from.layer === 'ai' &&
        ['ui', 'game-ui', 'demos', 'core-ui'].includes(to.layer)
      ) {
        violations.push({ kind: 'ai→ui', from: fromRel, to: toRel });
      }
    }
  }

  const barrels = files.filter((f) => path.basename(f) === 'index.ts');
  /** @type {string[]} */
  const deadBarrels = [];
  /** @type {string[]} */
  const mixedBarrels = [];

  for (const b of barrels) {
    const bRel = relRoot(b);
    let importers = 0;
    for (const [, { all }] of graph) {
      if (all.has(b)) importers++;
    }
    const raw = fs.readFileSync(b, 'utf8');
    if (importers === 0) deadBarrels.push(bRel);
    if (UI_REEXPORT.test(stripComments(raw))) mixedBarrels.push(bRel);
  }

  deadBarrels.sort();
  mixedBarrels.sort();
  violations.sort((a, b) =>
    `${a.kind}:${a.from}:${a.to}`.localeCompare(`${b.kind}:${b.from}:${b.to}`)
  );

  const byKind = {
    cycles: cyclesValue.length,
    cycles_including_type_only: cyclesAll.length,
    engine_imports_ui: violations.filter((v) => v.kind === 'engine→ui').length,
    engine_imports_ai: violations.filter((v) => v.kind === 'engine→ai').length,
    cross_game_imports: violations.filter((v) => v.kind === 'cross-game')
      .length,
    core_imports_games: violations.filter((v) => v.kind === 'core→games')
      .length,
    core_imports_ui: violations.filter((v) => v.kind === 'core→ui').length,
    ai_imports_ui: violations.filter((v) => v.kind === 'ai→ui').length,
    engine_or_ai_dom_globals: domHits.length,
    dead_barrels: deadBarrels.length,
    mixed_ui_barrels: mixedBarrels.length,
  };

  return {
    files: files.length,
    edges: [...graph.values()].reduce((n, g) => n + g.all.size, 0),
    cycles: cyclesValue,
    cyclesIncludingTypeOnly: cyclesAll,
    violations,
    domHits,
    deadBarrels,
    mixedBarrels,
    counts: byKind,
  };
}

function main() {
  const report = auditBoundaries();
  const { counts } = report;

  console.log('Module boundary audit (src/)');
  console.log(`  files: ${report.files}  relative-import edges: ${report.edges}`);
  console.log('');
  console.log('Counts:');
  for (const [k, v] of Object.entries(counts)) {
    console.log(`  ${k}: ${v}`);
  }

  if (report.cycles.length) {
    console.log('\nCycles (value imports):');
    for (const c of report.cycles) console.log(`  - ${c.join(' → ')}`);
  }
  if (
    report.cyclesIncludingTypeOnly.length &&
    report.cyclesIncludingTypeOnly.length !== report.cycles.length
  ) {
    console.log('\nCycles (including type-only edges):');
    for (const c of report.cyclesIncludingTypeOnly)
      console.log(`  - ${c.join(' → ')}`);
  }
  if (report.violations.length) {
    console.log('\nLayering violations:');
    for (const v of report.violations)
      console.log(`  - [${v.kind}] ${v.from} → ${v.to}`);
  }
  if (report.domHits.length) {
    console.log('\nEngine/AI DOM / browser globals:');
    for (const d of report.domHits)
      console.log(`  - [${d.layer}] ${d.file}: ${d.sample}`);
  }
  if (report.deadBarrels.length) {
    console.log('\nDead re-export barrels (0 importers):');
    for (const b of report.deadBarrels) console.log(`  - ${b}`);
  }
  if (report.mixedBarrels.length) {
    console.log('\nBarrels that re-export UI modules (layer mix):');
    for (const b of report.mixedBarrels) console.log(`  - ${b}`);
  }

  if (!fs.existsSync(CEILING_PATH)) {
    console.error(`\nFAIL: missing ceiling file ${relRoot(CEILING_PATH)}`);
    process.exit(1);
  }

  const ceilingDoc = JSON.parse(fs.readFileSync(CEILING_PATH, 'utf8'));
  const ceiling = ceilingDoc.ceilings ?? ceilingDoc;
  /** @type {string[]} */
  const rises = [];
  for (const [key, value] of Object.entries(counts)) {
    const max = ceiling[key];
    if (typeof max !== 'number') {
      rises.push(`missing ceiling for ${key}`);
      continue;
    }
    if (value > max) {
      rises.push(`${key}: ${value} > ceiling ${max}`);
    }
  }

  console.log(`\nCeiling file: ${relRoot(CEILING_PATH)}`);
  if (rises.length) {
    console.error('FAIL: boundary counts rose above committed ceiling:');
    for (const r of rises) console.error(`  ${r}`);
    process.exit(1);
  }

  console.log('OK: all counts at or under committed ceiling (may only go down).');
  process.exit(0);
}

const isMain =
  process.argv[1] &&
  path.normalize(fileURLToPath(import.meta.url)) ===
    path.normalize(process.argv[1]);

if (isMain) {
  main();
}
