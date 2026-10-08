#!/usr/bin/env node
/**
 * Rank non-AI engine modules from a vitest coverage-summary.json.
 * Usage: node scripts/engine-coverage-rank.mjs [path/to/coverage-summary.json]
 */
import fs from 'node:fs';
import path from 'node:path';

const summaryPath =
  process.argv[2] ||
  path.resolve('coverage-engine-baseline/coverage-summary.json');

const raw = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));

const ENGINE_RE =
  /src\/games\/([^/]+)\/(rules|types|game-state|board|pieces|serialization)\.ts$/;

const rows = [];
for (const [filePath, stats] of Object.entries(raw)) {
  if (filePath === 'total') continue;
  const norm = filePath.replace(/\\/g, '/');
  const m = norm.match(ENGINE_RE);
  if (!m) continue;
  const game = m[1];
  const kind = m[2];
  if (norm.includes('/ai')) continue;
  const lines = stats.lines ?? { pct: 0, covered: 0, total: 0 };
  const branches = stats.branches ?? { pct: 0, covered: 0, total: 0 };
  rows.push({
    game,
    kind,
    file: norm.includes('src/games/')
      ? norm.slice(norm.indexOf('src/games/'))
      : norm,
    linePct: lines.pct,
    lineCov: lines.covered,
    lineTot: lines.total,
    branchPct: branches.pct,
    branchCov: branches.covered,
    branchTot: branches.total,
  });
}

rows.sort((a, b) => a.branchPct - b.branchPct || a.linePct - b.linePct);

console.log(
  [
    'rank',
    'file',
    'line%',
    'lines',
    'branch%',
    'branches',
  ].join('\t')
);
rows.forEach((r, i) => {
  console.log(
    [
      i + 1,
      r.file,
      r.linePct.toFixed(2),
      `${r.lineCov}/${r.lineTot}`,
      r.branchPct.toFixed(2),
      `${r.branchCov}/${r.branchTot}`,
    ].join('\t')
  );
});

const byGame = new Map();
for (const r of rows) {
  if (!byGame.has(r.game)) byGame.set(r.game, []);
  byGame.get(r.game).push(r);
}

console.log('\n--- per-game (rules.ts preferred; companions listed) ---');
const games = [...byGame.keys()].sort((a, b) => {
  const ar = byGame.get(a).find((x) => x.kind === 'rules') ?? byGame.get(a)[0];
  const br = byGame.get(b).find((x) => x.kind === 'rules') ?? byGame.get(b)[0];
  return ar.branchPct - br.branchPct;
});
for (const g of games) {
  const files = byGame.get(g);
  const primary = files.find((x) => x.kind === 'rules') ?? files[0];
  console.log(
    `${g}\trules-branch ${primary.branchPct.toFixed(2)}% (${primary.branchCov}/${primary.branchTot})\tline ${primary.linePct.toFixed(2)}% (${primary.lineCov}/${primary.lineTot})`
  );
  for (const f of files.filter((x) => x !== primary)) {
    console.log(
      `  + ${f.kind}\tbranch ${f.branchPct.toFixed(2)}%\tline ${f.linePct.toFixed(2)}%`
    );
  }
}
