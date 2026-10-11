import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  parseMenuCriticalRefs,
  mapGameChunks,
  partitionOvers,
  resolveSizeCheckExitCode,
  resolveSizeCheckCatchExitCode,
  parseSizeCheckArgs,
} from '../../scripts/check-bundle-budgets.mjs';

describe('bundle budget helpers', () => {
  it('parses menu JS/CSS refs from index.html', () => {
    const html = `
      <script type="module" src="/assets/index-abc12345.js"></script>
      <link rel="modulepreload" href="/vendor/vite-preload-abc12345.js">
      <link rel="modulepreload" href="/assets/core-abc12345.js">
      <link rel="modulepreload" href="/assets/ui-abc12345.js">
      <link rel="stylesheet" href="/assets/ui-abc12345.css">
      <link rel="stylesheet" href="/assets/index-abc12345.css">
      <link rel="manifest" href="/site.webmanifest">
      <link rel="preload" href="/fonts/inter.woff2" as="font">
    `;
    expect(parseMenuCriticalRefs(html)).toEqual([
      'assets/core-abc12345.js',
      'assets/index-abc12345.css',
      'assets/index-abc12345.js',
      'assets/ui-abc12345.css',
      'assets/ui-abc12345.js',
      'vendor/vite-preload-abc12345.js',
    ]);
  });

  // q-mp-1132: only real src/href attributes (not data-src / ng-src / xsrc)
  it('ignores data-src, ng-src, and xsrc attribute names (q-mp-1132)', () => {
    expect(parseMenuCriticalRefs('<div data-src="/assets/x.js">')).toEqual([]);
    expect(parseMenuCriticalRefs('<img ng-src="/assets/x.js">')).toEqual([]);
    expect(parseMenuCriticalRefs('<x xsrc="/assets/x.js">')).toEqual([]);
    expect(parseMenuCriticalRefs('<script src="/assets/x.js">')).toEqual([
      'assets/x.js',
    ]);
  });

  // q-mp-1150: single-quoted src/href values
  it('accepts single-quoted src and href asset refs (q-mp-1150)', () => {
    expect(parseMenuCriticalRefs("<script src='/assets/x.js'>")).toEqual([
      'assets/x.js',
    ]);
    expect(parseMenuCriticalRefs("<link href='/assets/x.css'>")).toEqual([
      'assets/x.css',
    ]);
    expect(
      parseMenuCriticalRefs(
        "<script src='/assets/a.js'><link href=\"/assets/b.css\">"
      )
    ).toEqual(['assets/a.js', 'assets/b.css']);
  });

  // q-mp-1151: case-insensitive SRC/HREF
  it('accepts case-insensitive SRC and HREF attribute names (q-mp-1151)', () => {
    expect(parseMenuCriticalRefs('<script SRC="/assets/x.js">')).toEqual([
      'assets/x.js',
    ]);
    expect(parseMenuCriticalRefs('<link HREF="/assets/x.css">')).toEqual([
      'assets/x.css',
    ]);
    expect(parseMenuCriticalRefs('<link Href="/assets/x.css">')).toEqual([
      'assets/x.css',
    ]);
    // Word boundary still required with case folding (1132 + 1151)
    expect(parseMenuCriticalRefs('<div data-SRC="/assets/x.js">')).toEqual([]);
  });

  it('maps game chunks without short-id stealing longer names', () => {
    const files = [
      'game-hex-aaaaaaaa.js',
      'game-hex-a-gone-bbbbbbbb.js',
      'game-queens-guards--cccccccc.js',
    ];
    const map = mapGameChunks(files, ['hex', 'hex-a-gone', 'queens-guards']);
    expect(map.get('hex')).toBe('game-hex-aaaaaaaa.js');
    expect(map.get('hex-a-gone')).toBe('game-hex-a-gone-bbbbbbbb.js');
    expect(map.get('queens-guards')).toBe('game-queens-guards--cccccccc.js');
  });

  // q-mp-1300: duplicate hashes must not follow readdir order
  it('leaves game id unmapped when duplicate hashes exist (q-mp-1300)', () => {
    const oldFirst = mapGameChunks(
      ['game-hex-old.js', 'game-hex-new.js'],
      ['hex']
    );
    const newFirst = mapGameChunks(
      ['game-hex-new.js', 'game-hex-old.js'],
      ['hex']
    );
    expect(oldFirst.has('hex')).toBe(false);
    expect(newFirst.has('hex')).toBe(false);
    expect(oldFirst.size).toBe(0);
    expect(newFirst.size).toBe(0);
  });

  it('preserves hex vs hex-a-gone when hex has duplicate hashes (q-mp-1300)', () => {
    const files = [
      'game-hex-old.js',
      'game-hex-new.js',
      'game-hex-a-gone-bbbbbbbb.js',
    ];
    const map = mapGameChunks(files, ['hex', 'hex-a-gone']);
    expect(map.get('hex-a-gone')).toBe('game-hex-a-gone-bbbbbbbb.js');
    expect(map.has('hex')).toBe(false);
  });

  it('does not let hex steal ambiguous hex-a-gone duplicates (q-mp-1300)', () => {
    const files = [
      'game-hex-aaaaaaaa.js',
      'game-hex-a-gone-old.js',
      'game-hex-a-gone-new.js',
    ];
    const map = mapGameChunks(files, ['hex', 'hex-a-gone']);
    expect(map.has('hex-a-gone')).toBe(false);
    expect(map.get('hex')).toBe('game-hex-aaaaaaaa.js');
  });
});

describe('known vs NEW OVER allowlist (q-mp-123)', () => {
  it('classifies known OVER separately from novel OVER', () => {
    const fixtureOvers = [
      'game-ramrod',
      'game-juggle',
      'menu-critical-path',
    ];
    const allowlist = ['game-ramrod', 'menu-critical-path'];
    const { known, novel, stale } = partitionOvers(fixtureOvers, allowlist);

    expect(known).toEqual(['game-ramrod', 'menu-critical-path']);
    expect(novel).toEqual(['game-juggle']);
    expect(stale).toEqual([]);
  });

  it('reports stale allowlist entries when an OVER is cleared', () => {
    const { known, novel, stale } = partitionOvers(
      ['game-juggle'],
      ['game-ramrod', 'game-juggle']
    );
    expect(known).toEqual(['game-juggle']);
    expect(novel).toEqual([]);
    expect(stale).toEqual(['game-ramrod']);
  });

  it('treats empty/missing allowlist as all OVER novel', () => {
    expect(partitionOvers(['game-hex'], [])).toEqual({
      known: [],
      novel: ['game-hex'],
      stale: [],
    });
    expect(partitionOvers(['game-hex'], null)).toEqual({
      known: [],
      novel: ['game-hex'],
      stale: [],
    });
  });

  it('exits non-zero only with --fail-on-new-over and novel OVER', () => {
    expect(
      resolveSizeCheckExitCode({ novelCount: 1, failOnNewOver: false })
    ).toBe(0);
    expect(
      resolveSizeCheckExitCode({ novelCount: 0, failOnNewOver: true })
    ).toBe(0);
    expect(
      resolveSizeCheckExitCode({ novelCount: 2, failOnNewOver: true })
    ).toBe(1);
    expect(parseSizeCheckArgs([])).toEqual({
      ok: true,
      failOnNewOver: false,
    });
    expect(parseSizeCheckArgs(['--fail-on-new-over'])).toEqual({
      ok: true,
      failOnNewOver: true,
    });
  });

  // q-mp-1312: typos / unknown argv must not silently stay report-only
  it('rejects unknown or misspelled size:check flags (q-mp-1312)', () => {
    const typo = parseSizeCheckArgs(['--fail-on-new-ovr']);
    expect(typo.ok).toBe(false);
    if (!typo.ok) {
      expect(typo.message).toMatch(/Unknown flag: --fail-on-new-ovr/);
      expect(typo.message).toMatch(/--fail-on-new-over/);
    }
    const junk = parseSizeCheckArgs(['--oops']);
    expect(junk.ok).toBe(false);
    if (!junk.ok) {
      expect(junk.message).toMatch(/Unknown flag: --oops/);
    }
    const positional = parseSizeCheckArgs(['dist']);
    expect(positional.ok).toBe(false);
    // Exact flag still enables the soft gate; default empty argv stays report-only.
    expect(parseSizeCheckArgs(['--fail-on-new-over'])).toEqual({
      ok: true,
      failOnNewOver: true,
    });
    expect(parseSizeCheckArgs([])).toEqual({
      ok: true,
      failOnNewOver: false,
    });
    // Typo must not enable failOnNewOver (would have been false + exit 0 before).
    expect(
      resolveSizeCheckExitCode({
        novelCount: 2,
        failOnNewOver: false,
      })
    ).toBe(0);
  });

  // q-mp-1253: NaN / negative / non-finite novelCount must not green-wash the soft gate
  it('fails closed on non-finite or negative novelCount under --fail-on-new-over (q-mp-1253)', () => {
    expect(
      resolveSizeCheckExitCode({ novelCount: Number.NaN, failOnNewOver: true })
    ).toBe(2);
    expect(
      resolveSizeCheckExitCode({ novelCount: -1, failOnNewOver: true })
    ).toBe(2);
    expect(
      resolveSizeCheckExitCode({
        novelCount: Number.POSITIVE_INFINITY,
        failOnNewOver: true,
      })
    ).toBe(2);
    // Default (no flag) stays report-only 0 even for invalid counts.
    expect(
      resolveSizeCheckExitCode({ novelCount: Number.NaN, failOnNewOver: false })
    ).toBe(0);
    expect(
      resolveSizeCheckExitCode({ novelCount: -1, failOnNewOver: false })
    ).toBe(0);
    // Finite positives / zero unchanged.
    expect(
      resolveSizeCheckExitCode({ novelCount: 2, failOnNewOver: true })
    ).toBe(1);
    expect(
      resolveSizeCheckExitCode({ novelCount: 0, failOnNewOver: true })
    ).toBe(0);
  });

  // q-mp-1265: measurement throw under --fail-on-new-over must not force exit 0
  it('catch exit is non-zero under --fail-on-new-over (q-mp-1265)', () => {
    expect(resolveSizeCheckCatchExitCode(false)).toBe(0);
    expect(resolveSizeCheckCatchExitCode(true)).toBe(2);
  });

  it('committed knownOvers matches tip measurement (empty after q-mp-110)', () => {
    const budgets = JSON.parse(
      readFileSync(resolve(process.cwd(), 'bundle-budgets.json'), 'utf8')
    ) as { knownOvers: string[] };
    expect(Array.isArray(budgets.knownOvers)).toBe(true);
    expect(budgets.knownOvers).toEqual([]);
  });

  it('CI size:check uses --fail-on-new-over under continue-on-error', () => {
    const ci = readFileSync(
      resolve(process.cwd(), '.github/workflows/ci.yml'),
      'utf8'
    );
    expect(ci).toMatch(/permissions:\s*\n\s*contents:\s*read/);
    expect(ci).toContain('persist-credentials: false');
    expect(ci).toMatch(
      /Report gzip bundle budgets[\s\S]*?continue-on-error:\s*true[\s\S]*?size:check -- --fail-on-new-over/
    );
  });
});
