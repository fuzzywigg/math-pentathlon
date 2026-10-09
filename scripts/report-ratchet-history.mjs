#!/usr/bin/env node
/**
 * Report-only ratchet ceiling history chart (q-mp-074).
 *
 * Walks git history for:
 *   - docs/dev/lint-ratchet-ceilings.json          → curly ceiling
 *   - docs/dev/type-ratchet-phase2-baseline.json   → Phase-2 out-of-scope errors
 *   - docs/dev/module-boundaries-ceilings.json     → sum of boundary ceilings
 *
 * Writes:
 *   - docs/dev/ratchet-ceiling-history.svg
 *   - docs/dev/ratchet-ceiling-history.md
 *
 * No new dependencies. Usage:
 *   node scripts/report-ratchet-history.mjs
 *   npm run report:ratchet-history
 *
 * By default uses `git log --all` so pre-squash tip folds still appear when
 * those refs are present locally. Pass --first-parent to restrict to HEAD.
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

export const TRACKED = Object.freeze({
  curly: 'docs/dev/lint-ratchet-ceilings.json',
  typePhase2: 'docs/dev/type-ratchet-phase2-baseline.json',
  boundaries: 'docs/dev/module-boundaries-ceilings.json',
});

export const OUT_SVG = 'docs/dev/ratchet-ceiling-history.svg';
export const OUT_MD = 'docs/dev/ratchet-ceiling-history.md';

/**
 * @typedef {{ sha: string, date: string, subject: string }} GitCommitMeta
 * @typedef {{
 *   sha: string,
 *   date: string,
 *   subject: string,
 *   curly: number | null,
 *   typeOutOfScope: number | null,
 *   boundarySum: number | null,
 * }} HistoryRow
 */

/**
 * Extract the three chart metrics from a parsed ceiling/baseline JSON blob.
 * Unknown / missing shapes yield null for that metric (row still kept).
 *
 * @param {'curly' | 'typePhase2' | 'boundaries'} kind
 * @param {unknown} json
 * @returns {number | null}
 */
export function extractMetric(kind, json) {
  if (json == null || typeof json !== 'object') return null;
  const obj = /** @type {Record<string, unknown>} */ (json);
  switch (kind) {
    case 'curly': {
      const rules = obj.rules;
      if (rules == null || typeof rules !== 'object') return null;
      const curly = /** @type {Record<string, unknown>} */ (rules).curly;
      return typeof curly === 'number' && Number.isFinite(curly) ? curly : null;
    }
    case 'typePhase2': {
      const n = obj.outOfScopeErrors;
      return typeof n === 'number' && Number.isFinite(n) ? n : null;
    }
    case 'boundaries': {
      const ceilings = obj.ceilings;
      if (ceilings == null || typeof ceilings !== 'object') return null;
      let sum = 0;
      let saw = false;
      for (const v of Object.values(
        /** @type {Record<string, unknown>} */ (ceilings)
      )) {
        if (typeof v === 'number' && Number.isFinite(v)) {
          sum += v;
          saw = true;
        }
      }
      return saw ? sum : null;
    }
    default: {
      const _exhaustive = /** @type {never} */ (kind);
      void _exhaustive;
      return null;
    }
  }
}

/**
 * Parse `git log --format` lines of `sha<TAB>isoDate<TAB>subject`.
 * @param {string} stdout
 * @returns {GitCommitMeta[]}
 */
export function parseGitLogLines(stdout) {
  const rows = [];
  for (const line of stdout.split('\n')) {
    if (!line.trim()) continue;
    const firstTab = line.indexOf('\t');
    const secondTab = firstTab === -1 ? -1 : line.indexOf('\t', firstTab + 1);
    if (firstTab === -1 || secondTab === -1) continue;
    const sha = line.slice(0, firstTab).trim();
    const date = line.slice(firstTab + 1, secondTab).trim();
    const subject = line.slice(secondTab + 1).trim();
    if (!sha || !date) continue;
    rows.push({ sha, date, subject });
  }
  return rows;
}

/**
 * Merge per-file commit lists into chronological rows (oldest → newest).
 * Later commits overwrite earlier metric values for the same sha.
 *
 * @param {{
 *   curly: Array<GitCommitMeta & { value: number | null }>,
 *   typePhase2: Array<GitCommitMeta & { value: number | null }>,
 *   boundaries: Array<GitCommitMeta & { value: number | null }>,
 * }} byKind
 * @returns {HistoryRow[]}
 */
export function mergeHistory(byKind) {
  /** @type {Map<string, HistoryRow>} */
  const bySha = new Map();

  /**
   * @param {Array<GitCommitMeta & { value: number | null }>} commits
   * @param {'curly' | 'typeOutOfScope' | 'boundarySum'} field
   */
  function apply(commits, field) {
    for (const c of commits) {
      const existing = bySha.get(c.sha);
      if (existing) {
        existing[field] = c.value;
        // Prefer the newest subject/date seen for that sha.
        existing.date = c.date;
        existing.subject = c.subject;
      } else {
        bySha.set(c.sha, {
          sha: c.sha,
          date: c.date,
          subject: c.subject,
          curly: field === 'curly' ? c.value : null,
          typeOutOfScope: field === 'typeOutOfScope' ? c.value : null,
          boundarySum: field === 'boundarySum' ? c.value : null,
        });
      }
    }
  }

  apply(byKind.curly, 'curly');
  apply(byKind.typePhase2, 'typeOutOfScope');
  apply(byKind.boundaries, 'boundarySum');

  const rows = [...bySha.values()];
  rows.sort((a, b) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return a.sha.localeCompare(b.sha);
  });

  // Forward-fill metrics so the chart has continuous series after first sighting.
  /** @type {number | null} */
  let lastCurly = null;
  /** @type {number | null} */
  let lastType = null;
  /** @type {number | null} */
  let lastBound = null;
  for (const row of rows) {
    if (row.curly != null) lastCurly = row.curly;
    else row.curly = lastCurly;
    if (row.typeOutOfScope != null) lastType = row.typeOutOfScope;
    else row.typeOutOfScope = lastType;
    if (row.boundarySum != null) lastBound = row.boundarySum;
    else row.boundarySum = lastBound;
  }
  return rows;
}

/**
 * Escape text for SVG / XML text nodes and attributes.
 * @param {string} s
 */
export function escapeXml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Build a simple multi-series SVG line chart. Each series is normalized to its
 * own max so curly (~1k), type (~100s), and boundary (~10s) share one plot.
 *
 * @param {HistoryRow[]} rows
 * @param {{ title?: string }} [opts]
 * @returns {string}
 */
export function renderSvg(rows, opts = {}) {
  const title = opts.title ?? 'Ratchet ceiling history';
  const width = 840;
  const height = 420;
  const padL = 56;
  const padR = 24;
  const padT = 48;
  const padB = 72;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const series = [
    {
      key: /** @type {const} */ ('curly'),
      label: 'curly ceiling',
      color: '#0b6e4f',
    },
    {
      key: /** @type {const} */ ('typeOutOfScope'),
      label: 'type Phase-2 out-of-scope',
      color: '#1d4e89',
    },
    {
      key: /** @type {const} */ ('boundarySum'),
      label: 'boundary ceiling sum',
      color: '#a15c00',
    },
  ];

  /** @param {'curly' | 'typeOutOfScope' | 'boundarySum'} key */
  function seriesMax(key) {
    let m = 0;
    for (const r of rows) {
      const v = r[key];
      if (typeof v === 'number' && v > m) m = v;
    }
    return m > 0 ? m : 1;
  }

  const n = Math.max(rows.length, 1);

  /** @param {number} i */
  function xAt(i) {
    if (n === 1) return padL + plotW / 2;
    return padL + (plotW * i) / (n - 1);
  }

  /**
   * @param {number | null} v
   * @param {number} max
   */
  function yAt(v, max) {
    if (v == null) return null;
    const t = v / max;
    return padT + plotH * (1 - t);
  }

  const parts = [];
  parts.push(
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(title)}">`,
    `<title>${escapeXml(title)}</title>`,
    `<desc>Normalized line chart of curly lint ceiling, Phase-2 type-ratchet out-of-scope errors, and module-boundary ceiling sum over git history.</desc>`,
    `<rect width="100%" height="100%" fill="#f7f5f0"/>`,
    `<text x="${padL}" y="28" font-family="Georgia, 'Times New Roman', serif" font-size="18" fill="#1a1a1a">${escapeXml(title)}</text>`,
    `<text x="${padL}" y="44" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11" fill="#555">Each series scaled to its own max (see table for raw counts)</text>`,
    // plot frame
    `<rect x="${padL}" y="${padT}" width="${plotW}" height="${plotH}" fill="#fffef9" stroke="#c9c2b4"/>`
  );

  // horizontal guides
  for (let g = 0; g <= 4; g++) {
    const y = padT + (plotH * g) / 4;
    parts.push(
      `<line x1="${padL}" y1="${y}" x2="${padL + plotW}" y2="${y}" stroke="#e4ddd0" stroke-width="1"/>`
    );
    const pct = 100 - g * 25;
    parts.push(
      `<text x="${padL - 8}" y="${y + 4}" text-anchor="end" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="10" fill="#666">${pct}%</text>`
    );
  }

  for (const s of series) {
    const max = seriesMax(s.key);
    /** @type {string[]} */
    const pts = [];
    rows.forEach((r, i) => {
      const y = yAt(r[s.key], max);
      if (y == null) return;
      pts.push(`${xAt(i).toFixed(2)},${y.toFixed(2)}`);
    });
    if (pts.length >= 2) {
      parts.push(
        `<polyline fill="none" stroke="${s.color}" stroke-width="2.5" points="${pts.join(' ')}"/>`
      );
    }
    rows.forEach((r, i) => {
      const y = yAt(r[s.key], max);
      if (y == null) return;
      parts.push(
        `<circle cx="${xAt(i).toFixed(2)}" cy="${y.toFixed(2)}" r="3.5" fill="${s.color}"/>`
      );
    });
  }

  // x labels (sparse)
  const labelEvery = Math.max(1, Math.ceil(n / 8));
  rows.forEach((r, i) => {
    if (i % labelEvery !== 0 && i !== n - 1) return;
    const label = r.date.slice(0, 10);
    parts.push(
      `<text x="${xAt(i).toFixed(2)}" y="${height - 36}" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="10" fill="#444">${escapeXml(label)}</text>`
    );
    parts.push(
      `<text x="${xAt(i).toFixed(2)}" y="${height - 22}" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="9" fill="#777">${escapeXml(r.sha.slice(0, 7))}</text>`
    );
  });

  // legend
  let lx = padL;
  const ly = height - 8;
  for (const s of series) {
    parts.push(
      `<rect x="${lx}" y="${ly - 10}" width="12" height="12" fill="${s.color}"/>`,
      `<text x="${lx + 16}" y="${ly}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="11" fill="#222">${escapeXml(s.label)}</text>`
    );
    lx += 16 + s.label.length * 6.2 + 18;
  }

  if (rows.length === 0) {
    parts.push(
      `<text x="${padL + plotW / 2}" y="${padT + plotH / 2}" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="14" fill="#666">No history found for tracked ceiling files</text>`
    );
  }

  parts.push(`</svg>`);
  return `${parts.join('\n')}\n`;
}

/**
 * Markdown table + short preamble for docs/dev/.
 * @param {HistoryRow[]} rows
 * @param {{ generatedAt?: string, gitMode?: string }} [meta]
 */
export function renderMarkdown(rows, meta = {}) {
  const generatedAt = meta.generatedAt ?? new Date().toISOString();
  const gitMode = meta.gitMode ?? 'git log --all';
  const lines = [
    '# Ratchet ceiling history',
    '',
    `Task: \`q-mp-074\`. Generated \`${generatedAt}\` via \`${gitMode}\`.`,
    '',
    'Tracks three report-only ceilings over git history:',
    '',
    '- **curly** — `docs/dev/lint-ratchet-ceilings.json` → `rules.curly`',
    '- **type Phase-2 out-of-scope** — `docs/dev/type-ratchet-phase2-baseline.json` → `outOfScopeErrors`',
    '- **boundary sum** — `docs/dev/module-boundaries-ceilings.json` → sum of `ceilings.*`',
    '',
    'Chart (each series normalized to its own max):',
    '',
    '![Ratchet ceiling history](./ratchet-ceiling-history.svg)',
    '',
    'Regenerate with `npm run report:ratchet-history` (no network; reads local git only).',
    '',
    '| SHA | Date | curly | type oos | boundary Σ | Subject |',
    '| --- | --- | ---: | ---: | ---: | --- |',
  ];

  for (const r of rows) {
    const curly = r.curly == null ? '—' : String(r.curly);
    const type = r.typeOutOfScope == null ? '—' : String(r.typeOutOfScope);
    const bound = r.boundarySum == null ? '—' : String(r.boundarySum);
    const subj = r.subject.replace(/\|/g, '\\|');
    lines.push(
      `| \`${r.sha.slice(0, 7)}\` | ${r.date.slice(0, 10)} | ${curly} | ${type} | ${bound} | ${subj} |`
    );
  }

  if (rows.length === 0) {
    lines.push('| — | — | — | — | — | _(no commits found)_ |');
  }

  lines.push('');
  return `${lines.join('\n')}\n`;
}

/**
 * @param {(args: string[]) => { status: number | null, stdout: string, stderr: string }} runGit
 * @param {{ firstParent?: boolean }} [opts]
 */
export function collectHistory(runGit, opts = {}) {
  const firstParent = opts.firstParent === true;
  const logArgsBase = [
    'log',
    ...(firstParent ? [] : ['--all']),
    '--date-order',
    '--format=%H\t%cI\t%s',
    '--',
  ];

  /**
   * @param {'curly' | 'typePhase2' | 'boundaries'} kind
   * @param {string} filePath
   */
  function loadKind(kind, filePath) {
    const log = runGit([...logArgsBase, filePath]);
    if ((log.status ?? 1) !== 0) {
      throw new Error(
        `git log failed for ${filePath}: ${log.stderr || log.stdout}`
      );
    }
    const metas = parseGitLogLines(log.stdout);
    return metas.map((m) => {
      const shown = runGit(['show', `${m.sha}:${filePath}`]);
      if ((shown.status ?? 1) !== 0) {
        return { ...m, value: /** @type {null} */ (null) };
      }
      try {
        const json = JSON.parse(shown.stdout);
        return { ...m, value: extractMetric(kind, json) };
      } catch {
        return { ...m, value: /** @type {null} */ (null) };
      }
    });
  }

  return mergeHistory({
    curly: loadKind('curly', TRACKED.curly),
    typePhase2: loadKind('typePhase2', TRACKED.typePhase2),
    boundaries: loadKind('boundaries', TRACKED.boundaries),
  });
}

/**
 * Default git runner (spawnSync). Exported for tests that want to spy shape only.
 * @param {string[]} args
 */
export function runGit(args) {
  const result = spawnSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });
  return {
    status: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
}

/**
 * @param {{ firstParent?: boolean, runGit?: typeof runGit, now?: string }} [opts]
 */
export function writeReport(opts = {}) {
  const git = opts.runGit ?? runGit;
  const firstParent = opts.firstParent === true;
  const rows = collectHistory(git, { firstParent });
  const gitMode = firstParent ? 'git log (HEAD only)' : 'git log --all';
  const svg = renderSvg(rows);
  const md = renderMarkdown(rows, {
    generatedAt: opts.now ?? new Date().toISOString(),
    gitMode,
  });
  const svgPath = path.join(ROOT, OUT_SVG);
  const mdPath = path.join(ROOT, OUT_MD);
  fs.mkdirSync(path.dirname(svgPath), { recursive: true });
  fs.writeFileSync(svgPath, svg, 'utf8');
  fs.writeFileSync(mdPath, md, 'utf8');
  return { rows, svgPath, mdPath, gitMode };
}

function main() {
  const firstParent = process.argv.includes('--first-parent');
  const { rows, svgPath, mdPath, gitMode } = writeReport({ firstParent });
  console.log(
    `report:ratchet-history — ${rows.length} commit(s) via ${gitMode}`
  );
  console.log(`  wrote ${path.relative(ROOT, svgPath)}`);
  console.log(`  wrote ${path.relative(ROOT, mdPath)}`);
}

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMain) {
  try {
    main();
  } catch (err) {
    console.error('report:ratchet-history error:', err);
    process.exitCode = 1;
  }
}
