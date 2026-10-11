/**
 * @vitest-environment node
 *
 * Hermetic coverage for render-perf-mode main-entry usage / --help (q-mp-919).
 */
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  RENDER_PERF_MODE_USAGE,
  main,
} from '../../scripts/render-perf-mode.mjs';

const SCRIPT = resolve(process.cwd(), 'scripts/render-perf-mode.mjs');

function runCli(args: string[]) {
  return spawnSync(process.execPath, [SCRIPT, ...args], {
    encoding: 'utf8',
    timeout: 15_000,
    env: { ...process.env },
  });
}

describe('render-perf-mode CLI usage (q-mp-919)', () => {
  it('exports usage that points at PERF_MODE=render npm run perf:runtime', () => {
    expect(RENDER_PERF_MODE_USAGE).toMatch(
      /Usage: node scripts\/render-perf-mode\.mjs/
    );
    expect(RENDER_PERF_MODE_USAGE).toMatch(
      /PERF_MODE=render npm run perf:runtime/
    );
    expect(RENDER_PERF_MODE_USAGE).toMatch(/-h, --help/);
  });

  it('--help prints usage and exits 0', () => {
    const r = runCli(['--help']);
    expect(r.status).toBe(0);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Usage: node scripts\/render-perf-mode\.mjs/);
    expect(text).toMatch(/PERF_MODE=render npm run perf:runtime/);
    expect(text).toMatch(/-h, --help/);
  });

  it('-h matches --help', () => {
    const r = runCli(['-h']);
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/PERF_MODE=render npm run perf:runtime/);
  });

  it('bare main prints usage and exits 0', () => {
    const r = runCli([]);
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/Usage: node scripts\/render-perf-mode\.mjs/);
    expect(r.stdout).toMatch(/PERF_MODE=render npm run perf:runtime/);
  });

  it('--wat exits 2 with unknown-flag + usage', () => {
    const r = runCli(['--wat']);
    expect(r.status).toBe(2);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Unknown flag: --wat/);
    expect(text).toMatch(/Usage: node scripts\/render-perf-mode\.mjs/);
  });

  it('import-as-library does not treat the importer as main', () => {
    // This test file imported the module; if isMain fired, process would have exited.
    expect(typeof main).toBe('function');
    expect(import.meta.url).not.toBe(pathToFileURL(SCRIPT).href);
  });
});
