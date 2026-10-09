#!/usr/bin/env node
/**
 * Report-only mutation harness for rules engines (burn-1008-mp-mutation-audit).
 *
 * Stryker is not used here: Vitest multi-project isolate:false + this
 * environment's Node/babel engine constraints made a reliable Stryker run
 * impractical. This script applies TypeScript-AST mutants to each
 * `src/games/<game>/rules.ts`, runs focused rules unit tests, and prints
 * killed / survived / timed-out / error scores.
 *
 * Usage:
 *   npm run mutation:report
 *   npm run mutation:report -- --games=hex,fiar --max=40
 *   npm run mutation:report -- --games=star-track --max=0   # all mutants
 *
 * NOT wired into CI. Exit code is always 0 for report-only use unless the
 * harness itself crashes before producing a report.
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const GAMES_DIR = path.join(ROOT, 'src/games');
const ARTIFACT_DIR = path.join(ROOT, 'docs');
const REPORT_JSON = path.join(ARTIFACT_DIR, 'mutation-report-rules.json');

const COMPARISON_FLIP = new Map([
  [ts.SyntaxKind.LessThanToken, ts.factory.createToken(ts.SyntaxKind.LessThanEqualsToken)],
  [ts.SyntaxKind.LessThanEqualsToken, ts.factory.createToken(ts.SyntaxKind.LessThanToken)],
  [ts.SyntaxKind.GreaterThanToken, ts.factory.createToken(ts.SyntaxKind.GreaterThanEqualsToken)],
  [ts.SyntaxKind.GreaterThanEqualsToken, ts.factory.createToken(ts.SyntaxKind.GreaterThanToken)],
  [ts.SyntaxKind.EqualsEqualsEqualsToken, ts.factory.createToken(ts.SyntaxKind.ExclamationEqualsEqualsToken)],
  [ts.SyntaxKind.ExclamationEqualsEqualsToken, ts.factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken)],
  [ts.SyntaxKind.EqualsEqualsToken, ts.factory.createToken(ts.SyntaxKind.ExclamationEqualsToken)],
  [ts.SyntaxKind.ExclamationEqualsToken, ts.factory.createToken(ts.SyntaxKind.EqualsEqualsToken)],
]);

const ARITH_FLIP = new Map([
  [ts.SyntaxKind.PlusToken, ts.factory.createToken(ts.SyntaxKind.MinusToken)],
  [ts.SyntaxKind.MinusToken, ts.factory.createToken(ts.SyntaxKind.PlusToken)],
  [ts.SyntaxKind.AsteriskToken, ts.factory.createToken(ts.SyntaxKind.SlashToken)],
  [ts.SyntaxKind.SlashToken, ts.factory.createToken(ts.SyntaxKind.AsteriskToken)],
]);

const LOGICAL_FLIP = new Map([
  [ts.SyntaxKind.AmpersandAmpersandToken, ts.factory.createToken(ts.SyntaxKind.BarBarToken)],
  [ts.SyntaxKind.BarBarToken, ts.factory.createToken(ts.SyntaxKind.AmpersandAmpersandToken)],
]);

function parseArgs(argv) {
  const opts = {
    games: null,
    max: 35,
    timeoutMs: 45_000,
    jsonOut: REPORT_JSON,
    quietTests: true,
  };
  for (const arg of argv) {
    if (arg.startsWith('--games=')) opts.games = arg.slice(8).split(',').map((s) => s.trim()).filter(Boolean);
    else if (arg.startsWith('--max=')) opts.max = Number(arg.slice(6));
    else if (arg.startsWith('--timeout=')) opts.timeoutMs = Number(arg.slice(10));
    else if (arg.startsWith('--json=')) opts.jsonOut = path.resolve(ROOT, arg.slice(7));
    else if (arg === '--verbose-tests') opts.quietTests = false;
  }
  if (!Number.isFinite(opts.max) || opts.max < 0) opts.max = 35;
  if (!Number.isFinite(opts.timeoutMs) || opts.timeoutMs < 5_000) opts.timeoutMs = 45_000;
  return opts;
}

function listGames() {
  return fs
    .readdirSync(GAMES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => fs.existsSync(path.join(GAMES_DIR, name, 'rules.ts')))
    .sort();
}

/** Focused rules-unit globs; excludes AI / scoring / difficulty suites by name. */
function testGlobsForGame(game) {
  const globs = [
    `tests/unit/${game}-rules.test.ts`,
    `tests/unit/${game}-rules.*.test.ts`,
    `tests/unit/${game}-end-rules*.test.ts`,
    `tests/unit/${game}-official-rules.test.ts`,
    `tests/unit/overnight-wave*-${game}-*rules*.test.ts`,
    `tests/unit/burn-wave*-${game}*rules*.test.ts`,
    `tests/unit/overnight-wave*-${game}-rules-*.test.ts`,
  ];
  // Shared rules smoke that covers multiple engines (safe, non-AI).
  if (game === 'kings-quadraphages') {
    globs.push('tests/unit/rules.test.ts');
    globs.push('tests/unit/overnight-wave55-kings-rules-no-king-reject.test.ts');
    globs.push('tests/unit/overnight-wave49-kings-valid-moves-no-king.test.ts');
    globs.push('tests/unit/burn-wave41-kings-king-move-oob-reject.test.ts');
    globs.push('tests/unit/burn-wave41-kings-win-trap-placements.test.ts');
    globs.push('tests/unit/burn-wave42-kings-king-directions-matrix.test.ts');
    globs.push('tests/unit/burn-wave42-kings-draw-supply-zero.test.ts');
    globs.push('tests/unit/burn-wave35-kings-can-complete-supply.test.ts');
    globs.push('tests/unit/kings-quadraphages-supply-exhaustion.test.ts');
  }
  if (game === 'kwatro-sinko') {
    globs.push('tests/unit/kwatro-sinko-end-rules-375.test.ts');
    globs.push('tests/unit/burn-wave41-kwatro-sinko-opening-rules.test.ts');
    globs.push('tests/unit/burn-wave47-kwatro-sinko-opening-rules.test.ts');
    globs.push('tests/unit/overnight-wave67-kwatro-rules-node-coords-exact.test.ts');
  }
  if (game === 'fiar') {
    globs.push('tests/unit/fiar-official-rules.test.ts');
  }
  if (game === 'contig-60') {
    globs.push('tests/unit/contig-60-end-rules.test.ts');
  }
  if (game === 'par-55') {
    globs.push('tests/unit/burn-wave47-par-55-rules.test.ts');
  }
  if (game === 'frac-fact') {
    // Overnight suites use abbreviated "frac" not "frac-fact".
    globs.push('tests/unit/overnight-wave54-frac-rules-*.test.ts');
    globs.push('tests/unit/burn-wave31-expr-target-validate-rules.test.ts');
  }
  // Mutation-strengthening suites (added by this task when present).
  globs.push(`tests/unit/mutation-${game}-rules.test.ts`);
  return globs;
}

function expandExistingTests(globs) {
  const found = new Set();
  for (const g of globs) {
    // vitest accepts globs; still prefer existing files for dry messaging
    if (!g.includes('*')) {
      if (fs.existsSync(path.join(ROOT, g))) found.add(g);
      continue;
    }
    const dir = path.dirname(g);
    const base = path.basename(g);
    const re = new RegExp(
      '^' +
        base
          .replace(/[.+^${}()|[\]\\]/g, '\\$&')
          .replace(/\*/g, '.*') +
        '$'
    );
    const absDir = path.join(ROOT, dir);
    if (!fs.existsSync(absDir)) continue;
    for (const name of fs.readdirSync(absDir)) {
      if (re.test(name)) found.add(path.join(dir, name));
    }
  }
  return [...found].sort();
}

function lineOf(sourceFile, pos) {
  return sourceFile.getLineAndCharacterOfPosition(pos).line + 1;
}

function collectMutants(sourceText, filePath) {
  const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  const mutants = [];

  function pushMutant(id, kind, node, replacementNode, description) {
    const transformer = (context) => {
      const visit = (n) => {
        if (n === node) return replacementNode;
        return ts.visitEachChild(n, visit, context);
      };
      return (sf) => ts.visitNode(sf, visit);
    };
    const result = ts.transform(sourceFile, [transformer]);
    const mutatedSf = result.transformed[0];
    const text = printer.printFile(mutatedSf);
    result.dispose();
    if (text === sourceText) return;
    mutants.push({
      id,
      kind,
      line: lineOf(sourceFile, node.getStart(sourceFile)),
      description,
      text,
    });
  }

  let counter = 0;
  const visit = (node) => {
    // Skip type-only subtrees (mutating annotations cannot be killed at runtime).
    if (
      ts.isTypeNode(node) ||
      ts.isTypeAliasDeclaration(node) ||
      ts.isInterfaceDeclaration(node) ||
      ts.isTypeParameterDeclaration(node) ||
      (ts.isParameter(node) && node.type && false) // fall through; handled below
    ) {
      // Still walk value defaults on parameters, but not the type annotation child.
    }
    if (ts.isAsExpression(node) || ts.isTypeAssertionExpression?.(node)) {
      // Visit expression only
      visit(node.expression);
      return;
    }
    if (ts.isParameter(node)) {
      if (node.name) visit(node.name);
      if (node.initializer) visit(node.initializer);
      return;
    }
    if (ts.isPropertyDeclaration(node) || ts.isPropertySignature(node)) {
      if (node.initializer) visit(node.initializer);
      return;
    }
    if (
      ts.isTypeNode(node) ||
      ts.isTypeAliasDeclaration(node) ||
      ts.isInterfaceDeclaration(node)
    ) {
      return;
    }

    // Binary operators
    if (ts.isBinaryExpression(node)) {
      const op = node.operatorToken.kind;
      if (COMPARISON_FLIP.has(op)) {
        const flipped = COMPARISON_FLIP.get(op);
        pushMutant(
          `m${++counter}`,
          'ConditionalBoundary/Equality',
          node,
          ts.factory.updateBinaryExpression(node, node.left, flipped, node.right),
          `flip ${ts.tokenToString(op)} → ${ts.tokenToString(flipped.kind)}`
        );
      }
      if (ARITH_FLIP.has(op)) {
        // Skip string concatenation heuristics: if either side is a string literal
        const leftStr = ts.isStringLiteral(node.left) || ts.isTemplateExpression(node.left);
        const rightStr = ts.isStringLiteral(node.right) || ts.isTemplateExpression(node.right);
        if (!(leftStr || rightStr) || op !== ts.SyntaxKind.PlusToken) {
          const flipped = ARITH_FLIP.get(op);
          pushMutant(
            `m${++counter}`,
            'Arithmetic',
            node,
            ts.factory.updateBinaryExpression(node, node.left, flipped, node.right),
            `flip ${ts.tokenToString(op)} → ${ts.tokenToString(flipped.kind)}`
          );
        }
      }
      if (LOGICAL_FLIP.has(op)) {
        const flipped = LOGICAL_FLIP.get(op);
        pushMutant(
          `m${++counter}`,
          'Logical',
          node,
          ts.factory.updateBinaryExpression(node, node.left, flipped, node.right),
          `flip ${ts.tokenToString(op)} → ${ts.tokenToString(flipped.kind)}`
        );
      }
    }

    // Boolean literals
    if (node.kind === ts.SyntaxKind.TrueKeyword) {
      pushMutant(`m${++counter}`, 'BooleanLiteral', node, ts.factory.createFalse(), 'true → false');
    }
    if (node.kind === ts.SyntaxKind.FalseKeyword) {
      pushMutant(`m${++counter}`, 'BooleanLiteral', node, ts.factory.createTrue(), 'false → true');
    }

    // Prefix ! removal
    if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.ExclamationToken) {
      pushMutant(`m${++counter}`, 'UnaryNot', node, node.operand, 'remove !');
    }

    // Numeric literal ±1 (skip 0/1 when used as indices carefully — still mutate)
    if (ts.isNumericLiteral(node)) {
      const v = Number(node.text);
      if (Number.isFinite(v) && Number.isInteger(v) && Math.abs(v) <= 64) {
        pushMutant(
          `m${++counter}`,
          'NumericBoundary',
          node,
          ts.factory.createNumericLiteral(String(v + 1)),
          `${v} → ${v + 1}`
        );
        if (v !== 0) {
          pushMutant(
            `m${++counter}`,
            'NumericBoundary',
            node,
            ts.factory.createNumericLiteral(String(v - 1)),
            `${v} → ${v - 1}`
          );
        }
      }
    }

    // return true/false already covered via boolean literals inside ReturnStatement

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

  // Deduplicate by mutated text
  const seen = new Set();
  const unique = [];
  for (const m of mutants) {
    if (seen.has(m.text)) continue;
    seen.add(m.text);
    unique.push(m);
  }
  return unique;
}

function runVitest(testFiles, timeoutMs, quiet) {
  if (testFiles.length === 0) {
    return { status: 'no-tests', exitCode: 0, durationMs: 0, stdout: '', stderr: 'no test files' };
  }
  const args = ['vitest', 'run', ...testFiles, '--reporter=dot'];
  const started = Date.now();
  const result = spawnSync('npx', args, {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: timeoutMs,
    env: { ...process.env, FORCE_COLOR: '0' },
    maxBuffer: 8 * 1024 * 1024,
  });
  const durationMs = Date.now() - started;
  if (result.error && result.error.code === 'ETIMEDOUT') {
    return { status: 'timeout', exitCode: null, durationMs, stdout: result.stdout || '', stderr: result.stderr || '' };
  }
  const exitCode = result.status;
  if (exitCode === 0) {
    return { status: 'survived', exitCode, durationMs, stdout: quiet ? '' : result.stdout, stderr: quiet ? '' : result.stderr };
  }
  return { status: 'killed', exitCode, durationMs, stdout: quiet ? '' : result.stdout, stderr: quiet ? '' : result.stderr };
}

function scoreOf(killed, total) {
  if (total === 0) return null;
  return Math.round((1000 * killed) / total) / 10;
}

function formatTable(rows) {
  const headers = ['Game', 'Mutants', 'Killed', 'Survived', 'Timeout', 'Error', 'Score %'];
  const widths = headers.map((h, i) => Math.max(h.length, ...rows.map((r) => String(r[i]).length)));
  const line = (cols) => cols.map((c, i) => String(c).padEnd(widths[i])).join('  ');
  return [line(headers), line(widths.map((w) => '-'.repeat(w))), ...rows.map(line)].join('\n');
}

function mutateGame(game, opts) {
  const rulesPath = path.join(GAMES_DIR, game, 'rules.ts');
  const original = fs.readFileSync(rulesPath, 'utf8');
  const allMutants = collectMutants(original, rulesPath);
  const selected =
    opts.max === 0 ? allMutants : allMutants.slice(0, opts.max);

  const tests = expandExistingTests(testGlobsForGame(game));
  console.log(`\n=== ${game} ===`);
  console.log(`rules: ${path.relative(ROOT, rulesPath)} (${original.split('\n').length} lines)`);
  console.log(`mutants: ${selected.length}/${allMutants.length} (cap=${opts.max === 0 ? 'none' : opts.max})`);
  console.log(`tests: ${tests.length ? tests.join(', ') : '(none found)'}`);

  // Baseline sanity: original must pass
  const baseline = runVitest(tests, opts.timeoutMs, opts.quietTests);
  if (baseline.status !== 'survived' && baseline.status !== 'no-tests') {
    console.warn(`  WARN: baseline tests did not pass (${baseline.status}, exit=${baseline.exitCode}). Skipping mutants.`);
    return {
      game,
      lines: original.split('\n').length,
      tests,
      availableMutants: allMutants.length,
      ranMutants: 0,
      killed: 0,
      survived: 0,
      timeout: 0,
      error: 0,
      score: null,
      skipped: true,
      skipReason: `baseline ${baseline.status}`,
      survivors: [],
    };
  }

  let killed = 0;
  let survived = 0;
  let timeout = 0;
  let error = 0;
  const survivors = [];

  for (let i = 0; i < selected.length; i++) {
    const m = selected[i];
    process.stdout.write(`  [${i + 1}/${selected.length}] L${m.line} ${m.kind}: ${m.description} ... `);
    try {
      fs.writeFileSync(rulesPath, m.text);
      const result = runVitest(tests, opts.timeoutMs, opts.quietTests);
      if (result.status === 'killed') {
        killed++;
        console.log(`KILLED (${result.durationMs}ms)`);
      } else if (result.status === 'timeout') {
        timeout++;
        console.log(`TIMEOUT`);
        survivors.push({ ...m, outcome: 'timeout' });
      } else if (result.status === 'no-tests') {
        error++;
        console.log(`ERROR (no tests)`);
        survivors.push({ ...m, outcome: 'no-tests' });
      } else {
        survived++;
        console.log(`SURVIVED (${result.durationMs}ms)`);
        survivors.push({
          id: m.id,
          kind: m.kind,
          line: m.line,
          description: m.description,
          outcome: 'survived',
        });
      }
    } catch (e) {
      error++;
      console.log(`ERROR (${e.message})`);
      survivors.push({ id: m.id, kind: m.kind, line: m.line, description: m.description, outcome: 'error', error: e.message });
    } finally {
      fs.writeFileSync(rulesPath, original);
    }
  }

  const ran = selected.length;
  const detected = killed; // timeouts count against score as not-killed
  const score = scoreOf(detected, ran);
  console.log(`  → killed ${killed}/${ran}  survived ${survived}  timeout ${timeout}  error ${error}  score ${score ?? 'n/a'}%`);

  return {
    game,
    lines: original.split('\n').length,
    tests,
    availableMutants: allMutants.length,
    ranMutants: ran,
    killed,
    survived,
    timeout,
    error,
    score,
    skipped: false,
    survivors: survivors.map(({ id, kind, line, description, outcome }) => ({
      id,
      kind,
      line,
      description,
      outcome,
    })),
  };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const games = opts.games ?? listGames();
  console.log('Mutation report (rules engines) — report-only, not CI-gated');
  console.log(`games=${games.join(',')}`);
  console.log(`maxMutantsPerGame=${opts.max === 0 ? 'all' : opts.max} timeoutMs=${opts.timeoutMs}`);

  const results = [];
  const started = Date.now();
  for (const game of games) {
    results.push(mutateGame(game, opts));
  }

  const rows = results.map((r) => [
    r.game,
    r.ranMutants,
    r.killed,
    r.survived,
    r.timeout,
    r.error,
    r.score == null ? (r.skipped ? 'skip' : 'n/a') : r.score.toFixed(1),
  ]);

  console.log('\n========== SUMMARY ==========');
  console.log(formatTable(rows));
  console.log(`elapsed=${((Date.now() - started) / 1000).toFixed(1)}s`);

  const report = {
    taskId: 'burn-1008-mp-mutation-audit',
    generatedAt: new Date().toISOString(),
    harness: 'scripts/mutation-report.mjs (custom AST; Stryker not used)',
    options: { max: opts.max, timeoutMs: opts.timeoutMs, games },
    results,
  };
  fs.mkdirSync(path.dirname(opts.jsonOut), { recursive: true });
  fs.writeFileSync(opts.jsonOut, JSON.stringify(report, null, 2));
  console.log(`\nWrote ${path.relative(ROOT, opts.jsonOut)}`);
}

try {
  main();
} catch (err) {
  console.error(err);
  process.exit(1);
}
