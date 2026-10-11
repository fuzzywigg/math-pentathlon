/**
 * @vitest-environment node
 *
 * Hermetic argv / write-guard coverage for report-coverage-map
 * (q-mp-906 unknown flags; q-mp-977 --dry-run; q-mp-993 empty/invalid shape;
 * q-mp-1005 malformed JSON — no stack).
 * Spawns the script only for help/unknown/dry-run/garbage — no doc writes on those paths.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path, { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  invalidSummaryMessage,
  malformedJsonMessage,
  OUT_MD,
  OUT_SVG,
  parseArgs,
  USAGE,
  validateCoverageSummary,
  writeReport,
} from '../../scripts/report-coverage-map.mjs';

const SCRIPT = resolve(process.cwd(), 'scripts/report-coverage-map.mjs');
const MD_PATH = resolve(process.cwd(), OUT_MD);
const SVG_PATH = resolve(process.cwd(), OUT_SVG);

function runScript(argv: string[]) {
  return spawnSync(process.execPath, [SCRIPT, ...argv], {
    encoding: 'utf8',
    env: { ...process.env },
    timeout: 15_000,
  });
}

describe('report-coverage-map CLI argv (q-mp-906 / q-mp-977)', () => {
  it('parseArgs recognizes --help / -h / --dry-run, path, and unknown flags', () => {
    expect(parseArgs([])).toEqual({
      ok: true,
      help: false,
      dryRun: false,
      summaryPath: undefined,
    });
    expect(parseArgs(['--help'])).toEqual({
      ok: true,
      help: true,
      dryRun: false,
      summaryPath: undefined,
    });
    expect(parseArgs(['-h'])).toEqual({
      ok: true,
      help: true,
      dryRun: false,
      summaryPath: undefined,
    });
    expect(parseArgs(['--dry-run'])).toEqual({
      ok: true,
      help: false,
      dryRun: true,
      summaryPath: undefined,
    });
    expect(parseArgs(['--dry-run', 'coverage/coverage-summary.json'])).toEqual({
      ok: true,
      help: false,
      dryRun: true,
      summaryPath: 'coverage/coverage-summary.json',
    });
    expect(parseArgs(['coverage/coverage-summary.json'])).toEqual({
      ok: true,
      help: false,
      dryRun: false,
      summaryPath: 'coverage/coverage-summary.json',
    });
    expect(parseArgs(['--wat'])).toEqual({
      ok: false,
      message: 'Unknown flag: --wat',
    });
    expect(parseArgs(['--help', 'extra.json']).ok).toBe(true);
    expect(parseArgs(['a.json', 'b.json'])).toEqual({
      ok: false,
      message: 'Unexpected argument: b.json',
    });
  });

  it('USAGE documents help, dry-run, and optional summary path', () => {
    expect(USAGE).toMatch(/--help/);
    expect(USAGE).toMatch(/--dry-run/);
    expect(USAGE).toMatch(/coverage-summary\.json/);
    expect(USAGE).toMatch(/coverage-map/);
  });

  it('--help prints usage and exits 0 without path lookup', () => {
    const result = runScript(['--help']);
    expect(result.status).toBe(0);
    const combined = `${result.stdout}${result.stderr}`;
    expect(combined).toMatch(/Usage: node scripts\/report-coverage-map\.mjs/);
    expect(combined).toMatch(/--help/);
    expect(combined).toMatch(/--dry-run/);
    expect(combined).not.toMatch(/missing coverage summary at --help/);
    expect(combined).not.toMatch(/wrote /);
  });

  it('-h matches --help (no path lookup)', () => {
    const result = runScript(['-h']);
    expect(result.status).toBe(0);
    const combined = `${result.stdout}${result.stderr}`;
    expect(combined).toMatch(/Usage:/i);
    expect(combined).not.toMatch(/missing coverage summary at -h/);
  });

  it('unknown flags exit 2 with usage before path lookup', () => {
    const result = runScript(['--wat']);
    expect(result.status).toBe(2);
    const combined = `${result.stdout}${result.stderr}`;
    expect(combined).toMatch(/Unknown flag:\s*--wat/);
    expect(combined).toMatch(/Usage: node scripts\/report-coverage-map\.mjs/);
    expect(combined).not.toMatch(/missing coverage summary at --wat/);
    expect(combined).not.toMatch(/wrote /);
  });

  it('writeReport({ dryRun: true }) skips writeFileSync', () => {
    const mdBefore = fs.statSync(MD_PATH).mtimeMs;
    const svgBefore = fs.statSync(SVG_PATH).mtimeMs;
    const result = writeReport({
      dryRun: true,
      now: '2026-10-11T00:00:00.000Z',
      root: '/workspace',
      summary: {
        total: {
          lines: { total: 10, covered: 5, pct: 50 },
          branches: { total: 4, covered: 2, pct: 50 },
          functions: { total: 2, covered: 1, pct: 50 },
          statements: { total: 10, covered: 5, pct: 50 },
        },
        '/workspace/src/games/hex/rules.ts': {
          lines: { total: 10, covered: 5, pct: 50 },
          branches: { total: 4, covered: 2, pct: 50 },
          functions: { total: 2, covered: 1, pct: 50 },
          statements: { total: 10, covered: 5, pct: 50 },
        },
      },
    });
    expect(result.dryRun).toBe(true);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]?.dir).toBe('src/games/hex');
    expect(result.svg).toContain('<svg');
    expect(result.md).toContain('# Unit coverage map');
    expect(fs.statSync(MD_PATH).mtimeMs).toBe(mdBefore);
    expect(fs.statSync(SVG_PATH).mtimeMs).toBe(svgBefore);
  });

  it('CLI --dry-run exits 0, prints counts, and does not write docs', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cov-map-dry-'));
    const summaryPath = path.join(tmpDir, 'coverage-summary.json');
    fs.writeFileSync(
      summaryPath,
      JSON.stringify({
        total: {
          lines: { total: 10, covered: 5, pct: 50 },
          branches: { total: 4, covered: 2, pct: 50 },
          functions: { total: 2, covered: 1, pct: 50 },
          statements: { total: 10, covered: 5, pct: 50 },
        },
        [`${process.cwd()}/src/games/hex/rules.ts`]: {
          lines: { total: 10, covered: 5, pct: 50 },
          branches: { total: 4, covered: 2, pct: 50 },
          functions: { total: 2, covered: 1, pct: 50 },
          statements: { total: 10, covered: 5, pct: 50 },
        },
      }),
      'utf8'
    );
    const mdBefore = fs.statSync(MD_PATH).mtimeMs;
    const svgBefore = fs.statSync(SVG_PATH).mtimeMs;
    const result = runScript(['--dry-run', summaryPath]);
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/dry-run; not writing/);
    expect(result.stdout).toMatch(/would write/);
    expect(result.stdout).toMatch(/director/);
    expect(result.stdout).not.toMatch(/^\s*wrote /m);
    expect(fs.statSync(MD_PATH).mtimeMs).toBe(mdBefore);
    expect(fs.statSync(SVG_PATH).mtimeMs).toBe(svgBefore);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});

describe('report-coverage-map invalid / malformed summaries (q-mp-993 / q-mp-1005)', () => {
  it('validateCoverageSummary rejects empty object, array, and zero-directory', () => {
    expect(validateCoverageSummary({})).toEqual({
      ok: false,
      reason: 'zero directories under src/',
    });
    expect(validateCoverageSummary([])).toEqual({
      ok: false,
      reason: 'array-shaped summary',
    });
    expect(validateCoverageSummary(null)).toEqual({
      ok: false,
      reason: 'expected a non-null object',
    });
    expect(
      validateCoverageSummary(
        {
          total: {
            lines: { total: 1, covered: 0, pct: 0 },
          },
          '/workspace/README.md': {
            lines: { total: 1, covered: 0, pct: 0 },
          },
        },
        { root: '/workspace' }
      )
    ).toEqual({ ok: false, reason: 'zero directories under src/' });
    const ok = validateCoverageSummary(
      {
        '/workspace/src/games/hex/rules.ts': {
          lines: { total: 10, covered: 5, pct: 50 },
          branches: { total: 4, covered: 2, pct: 50 },
          functions: { total: 2, covered: 1, pct: 50 },
          statements: { total: 10, covered: 5, pct: 50 },
        },
      },
      { root: '/workspace' }
    );
    expect(ok.ok).toBe(true);
    if (ok.ok) {
      expect(ok.rows).toHaveLength(1);
      expect(ok.rows[0]?.dir).toBe('src/games/hex');
    }
  });

  it('invalidSummaryMessage / malformedJsonMessage are stack-free', () => {
    const invalid = invalidSummaryMessage(
      'tmp/c.json',
      'zero directories under src/'
    );
    expect(invalid).toMatch(/invalid coverage summary at tmp\/c\.json/);
    expect(invalid).toMatch(/zero directories under src\//);
    expect(invalid).toMatch(/no doc writes/);
    expect(invalid).not.toMatch(/at Object\.|SyntaxError|stack/i);

    const malformed = malformedJsonMessage(
      'tmp/bad.json',
      "Expected property name or '}' in JSON at position 1"
    );
    expect(malformed).toMatch(/malformed JSON in tmp\/bad\.json/);
    expect(malformed).toMatch(/Expected property name/);
    expect(malformed).toMatch(/npm run test:unit:coverage/);
    expect(malformed).not.toMatch(/at writeReport|at ModuleJob/);
  });

  it('writeReport rejects {} / [] without writing docs', () => {
    const mdBefore = fs.statSync(MD_PATH).mtimeMs;
    const svgBefore = fs.statSync(SVG_PATH).mtimeMs;
    for (const summary of [{}, []] as const) {
      try {
        writeReport({
          summary: summary as never,
          dryRun: false,
          now: '2026-10-11T00:00:00.000Z',
          root: '/workspace',
        });
        expect.fail('expected writeReport to throw');
      } catch (err) {
        expect(err).toMatchObject({ code: 'INVALID_SUMMARY' });
        expect((err as Error).message).toMatch(/invalid coverage summary/);
        expect((err as Error).message).not.toMatch(/at Object\.writeFileSync/);
      }
    }
    expect(fs.statSync(MD_PATH).mtimeMs).toBe(mdBefore);
    expect(fs.statSync(SVG_PATH).mtimeMs).toBe(svgBefore);
  });

  it('CLI rejects {} and [] with exit 1 and no doc writes', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cov-map-empty-'));
    const emptyObj = path.join(tmpDir, 'empty.json');
    const emptyArr = path.join(tmpDir, 'array.json');
    fs.writeFileSync(emptyObj, '{}', 'utf8');
    fs.writeFileSync(emptyArr, '[]', 'utf8');
    const mdBefore = fs.statSync(MD_PATH).mtimeMs;
    const svgBefore = fs.statSync(SVG_PATH).mtimeMs;

    for (const summaryPath of [emptyObj, emptyArr]) {
      const result = runScript([summaryPath]);
      expect(result.status).toBe(1);
      const combined = `${result.stdout}${result.stderr}`;
      expect(combined).toMatch(/invalid coverage summary/);
      expect(combined).toMatch(/no doc writes/);
      expect(combined).not.toMatch(/wrote /);
      expect(combined).not.toMatch(/at writeReport|at ModuleJob/);
    }

    expect(fs.statSync(MD_PATH).mtimeMs).toBe(mdBefore);
    expect(fs.statSync(SVG_PATH).mtimeMs).toBe(svgBefore);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('CLI malformed JSON exits 1 with short message and no stack', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cov-map-bad-'));
    const badPath = path.join(tmpDir, 'bad.json');
    fs.writeFileSync(badPath, '{', 'utf8');
    const mdBefore = fs.statSync(MD_PATH).mtimeMs;
    const svgBefore = fs.statSync(SVG_PATH).mtimeMs;

    const result = runScript([badPath]);
    expect(result.status).toBe(1);
    const combined = `${result.stdout}${result.stderr}`;
    expect(combined).toMatch(/malformed JSON/);
    expect(combined).toMatch(/npm run test:unit:coverage/);
    expect(combined).not.toMatch(/at writeReport/);
    expect(combined).not.toMatch(/at ModuleJob/);
    expect(combined).not.toMatch(/report:coverage-map error:\s*SyntaxError/);
    expect(combined).not.toMatch(/wrote /);
    expect(fs.statSync(MD_PATH).mtimeMs).toBe(mdBefore);
    expect(fs.statSync(SVG_PATH).mtimeMs).toBe(svgBefore);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});

describe('report-coverage-map UTF-8 BOM summary ingest (q-mp-1388)', () => {
  const sampleSummary = () =>
    JSON.stringify({
      total: {
        lines: { total: 10, covered: 5, pct: 50 },
        branches: { total: 4, covered: 2, pct: 50 },
        functions: { total: 2, covered: 1, pct: 50 },
        statements: { total: 10, covered: 5, pct: 50 },
      },
      [`${process.cwd()}/src/games/hex/rules.ts`]: {
        lines: { total: 10, covered: 5, pct: 50 },
        branches: { total: 4, covered: 2, pct: 50 },
        functions: { total: 2, covered: 1, pct: 50 },
        statements: { total: 10, covered: 5, pct: 50 },
      },
    });

  it('writeReport accepts BOM-prefixed summary with byte-identical map vs non-BOM', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cov-map-bom-'));
    // Same path for both reads so md path stamps match; only the file bytes differ.
    const summaryPath = path.join(tmpDir, 'coverage-summary.json');
    const body = sampleSummary();
    const opts = {
      summaryPath,
      dryRun: true as const,
      now: '2026-10-11T00:00:00.000Z',
    };

    fs.writeFileSync(summaryPath, body, 'utf8');
    const plain = writeReport(opts);

    fs.writeFileSync(summaryPath, `\uFEFF${body}`, 'utf8');
    const bom = writeReport(opts);

    expect(bom.rows).toEqual(plain.rows);
    expect(bom.svg).toBe(plain.svg);
    expect(bom.md).toBe(plain.md);
    expect(
      Buffer.from(bom.svg, 'utf8').equals(Buffer.from(plain.svg, 'utf8'))
    ).toBe(true);
    expect(
      Buffer.from(bom.md, 'utf8').equals(Buffer.from(plain.md, 'utf8'))
    ).toBe(true);

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('CLI --dry-run accepts BOM summary (exit 0) and still rejects BOM-malformed', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cov-map-bom-cli-'));
    const bomOk = path.join(tmpDir, 'bom-ok.json');
    const bomBad = path.join(tmpDir, 'bom-bad.json');
    fs.writeFileSync(bomOk, `\uFEFF${sampleSummary()}`, 'utf8');
    fs.writeFileSync(bomBad, '\uFEFF{', 'utf8');

    const ok = runScript(['--dry-run', bomOk]);
    expect(ok.status).toBe(0);
    expect(ok.stdout).toMatch(/dry-run; not writing/);
    expect(ok.stdout).toMatch(/director/);
    expect(`${ok.stdout}${ok.stderr}`).not.toMatch(/malformed JSON/);

    const bad = runScript(['--dry-run', bomBad]);
    expect(bad.status).toBe(1);
    expect(`${bad.stdout}${bad.stderr}`).toMatch(/malformed JSON/);

    // Mid-payload FEFF is not a leading BOM — still malformed.
    const midBom = path.join(tmpDir, 'mid-bom.json');
    fs.writeFileSync(midBom, `{\uFEFF"total":{}}`, 'utf8');
    const mid = runScript(['--dry-run', midBom]);
    expect(mid.status).toBe(1);
    expect(`${mid.stdout}${mid.stderr}`).toMatch(/malformed JSON/);

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});
