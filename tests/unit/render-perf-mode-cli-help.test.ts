/**
 * @vitest-environment node
 *
 * Hermetic coverage for render-perf-mode main-entry usage / --help (q-mp-919)
 * and deferred requireEnvNumber off import (q-mp-1000).
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
const RUNTIME = resolve(process.cwd(), 'scripts/runtime-perf.mjs');
const SCRIPT_HREF = pathToFileURL(SCRIPT).href;

function runCli(
  script: string,
  args: string[],
  envExtra: Record<string, string> = {}
) {
  return spawnSync(process.execPath, [script, ...args], {
    encoding: 'utf8',
    timeout: 15_000,
    env: { ...process.env, ...envExtra },
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
    const r = runCli(SCRIPT, ['--help']);
    expect(r.status).toBe(0);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Usage: node scripts\/render-perf-mode\.mjs/);
    expect(text).toMatch(/PERF_MODE=render npm run perf:runtime/);
    expect(text).toMatch(/-h, --help/);
  });

  it('-h matches --help', () => {
    const r = runCli(SCRIPT, ['-h']);
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/PERF_MODE=render npm run perf:runtime/);
  });

  it('bare main prints usage and exits 0', () => {
    const r = runCli(SCRIPT, []);
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/Usage: node scripts\/render-perf-mode\.mjs/);
    expect(r.stdout).toMatch(/PERF_MODE=render npm run perf:runtime/);
  });

  it('--wat exits 2 with unknown-flag + usage', () => {
    const r = runCli(SCRIPT, ['--wat']);
    expect(r.status).toBe(2);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Unknown flag: --wat/);
    expect(text).toMatch(/Usage: node scripts\/render-perf-mode\.mjs/);
  });

  it('import-as-library does not treat the importer as main', () => {
    // This test file imported the module; if isMain fired, process would have exited.
    expect(typeof main).toBe('function');
    expect(import.meta.url).not.toBe(SCRIPT_HREF);
  });
});

describe('render-perf-mode lazy PERF_* env (q-mp-1000)', () => {
  it('PERF_MOVES=abc --help prints usage and exits 0', () => {
    const r = runCli(SCRIPT, ['--help'], { PERF_MOVES: 'abc' });
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/Usage: node scripts\/render-perf-mode\.mjs/);
    expect(`${r.stdout}\n${r.stderr}`).not.toMatch(/Invalid PERF_MOVES/);
  });

  it('PERF_MOVES=abc -h matches --help under junk env', () => {
    const r = runCli(SCRIPT, ['-h'], { PERF_MOVES: 'abc' });
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/PERF_MODE=render npm run perf:runtime/);
  });

  it('runtime-perf --help under PERF_MOVES=abc exits 0 with usage', () => {
    const r = runCli(RUNTIME, ['--help'], { PERF_MOVES: 'abc' });
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/Usage: node scripts\/runtime-perf\.mjs/);
    expect(`${r.stdout}\n${r.stderr}`).not.toMatch(/Invalid PERF_MOVES/);
  });

  it('import under PERF_MOVES=abc does not exit', () => {
    const r = spawnSync(
      process.execPath,
      [
        '-e',
        `import(${JSON.stringify(SCRIPT_HREF)}).then(() => {
          console.log('import-ok');
          process.exit(0);
        })`,
      ],
      {
        encoding: 'utf8',
        timeout: 15_000,
        env: { ...process.env, PERF_MOVES: 'abc' },
      }
    );
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/import-ok/);
    expect(`${r.stdout}\n${r.stderr}`).not.toMatch(/Invalid PERF_MOVES/);
  });

  it('valid default accessors match former module-level defaults', () => {
    const r = spawnSync(
      process.execPath,
      [
        '-e',
        `import(${JSON.stringify(SCRIPT_HREF)}).then((m) => {
          console.log(
            [m.getCpuThrottle(), m.getHoverSamples(), m.getMoveTargetRender()].join(',')
          );
          process.exit(0);
        })`,
      ],
      {
        encoding: 'utf8',
        timeout: 15_000,
        env: {
          ...process.env,
          PERF_CPU_THROTTLE: '',
          PERF_HOVER_SAMPLES: '',
          PERF_MOVES: '',
        },
      }
    );
    expect(r.status).toBe(0);
    expect(r.stdout.trim()).toBe('4,12,20');
  });

  it('invalid PERF_MOVES still errors when accessor runs (not --help)', () => {
    const r = spawnSync(
      process.execPath,
      [
        '-e',
        `import(${JSON.stringify(SCRIPT_HREF)}).then((m) => {
          m.getMoveTargetRender();
          process.exit(0);
        })`,
      ],
      {
        encoding: 'utf8',
        timeout: 15_000,
        env: { ...process.env, PERF_MOVES: 'abc' },
      }
    );
    expect(r.status).toBe(2);
    expect(r.stderr).toMatch(/Invalid PERF_MOVES="abc"/);
  });
});
