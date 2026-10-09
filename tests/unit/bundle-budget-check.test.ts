import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  parseMenuCriticalRefs,
  mapGameChunks,
  partitionOvers,
  resolveSizeCheckExitCode,
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
    expect(parseSizeCheckArgs([])).toEqual({ failOnNewOver: false });
    expect(parseSizeCheckArgs(['--fail-on-new-over'])).toEqual({
      failOnNewOver: true,
    });
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
