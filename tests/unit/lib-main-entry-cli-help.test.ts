/**
 * @vitest-environment node
 *
 * Hermetic coverage for lib-module main-entry usage / --help (q-mp-958).
 */
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  ENV_NUMBER_USAGE,
  main as envNumberMain,
} from '../../scripts/lib/env-number.mjs';
import {
  PAGE_READY_USAGE,
  main as pageReadyMain,
} from '../../scripts/lib/page-ready.mjs';
import {
  DISMISS_OWL_USAGE,
  main as dismissOwlMain,
} from '../../scripts/lib/dismiss-owl.mjs';

const ROOT = process.cwd();

const libs = [
  {
    rel: 'scripts/lib/env-number.mjs',
    usage: ENV_NUMBER_USAGE,
    main: envNumberMain,
    harnessHint: /runtime-perf\.mjs/,
  },
  {
    rel: 'scripts/lib/page-ready.mjs',
    usage: PAGE_READY_USAGE,
    main: pageReadyMain,
    harnessHint: /mobile-audit\.mjs/,
  },
  {
    rel: 'scripts/lib/dismiss-owl.mjs',
    usage: DISMISS_OWL_USAGE,
    main: dismissOwlMain,
    harnessHint: /console-sweep\.mjs/,
  },
] as const;

function runCli(rel: string, args: string[]) {
  return spawnSync(process.execPath, [resolve(ROOT, rel), ...args], {
    encoding: 'utf8',
    timeout: 15_000,
    env: { ...process.env },
  });
}

describe('lib main-entry usage (q-mp-958)', () => {
  for (const lib of libs) {
    describe(lib.rel, () => {
      it('exports usage naming the library path and a harness importer', () => {
        expect(lib.usage).toMatch(
          new RegExp(`Usage: node ${lib.rel.replace(/\./g, '\\.')}`)
        );
        expect(lib.usage).toMatch(/Library module/);
        expect(lib.usage).toMatch(lib.harnessHint);
        expect(lib.usage).toMatch(/-h, --help/);
      });

      it('--help prints usage and exits 0', () => {
        const r = runCli(lib.rel, ['--help']);
        expect(r.status).toBe(0);
        const text = `${r.stdout}\n${r.stderr}`;
        expect(text).toMatch(
          new RegExp(`Usage: node ${lib.rel.replace(/\./g, '\\.')}`)
        );
        expect(text).toMatch(/Library module/);
        expect(text).toMatch(lib.harnessHint);
      });

      it('-h matches --help', () => {
        const r = runCli(lib.rel, ['-h']);
        expect(r.status).toBe(0);
        expect(r.stdout).toMatch(/Library module/);
      });

      it('bare main prints usage and exits 0', () => {
        const r = runCli(lib.rel, []);
        expect(r.status).toBe(0);
        expect(r.stdout).toMatch(/Library module/);
      });

      it('--wat exits 2 with unknown-flag + usage', () => {
        const r = runCli(lib.rel, ['--wat']);
        expect(r.status).toBe(2);
        const text = `${r.stdout}\n${r.stderr}`;
        expect(text).toMatch(/Unknown flag: --wat/);
        expect(text).toMatch(
          new RegExp(`Usage: node ${lib.rel.replace(/\./g, '\\.')}`)
        );
      });

      it('import-as-library does not treat the importer as main', () => {
        // This test file imported the module; if isMain fired, process would have exited.
        expect(typeof lib.main).toBe('function');
        expect(import.meta.url).not.toBe(
          pathToFileURL(resolve(ROOT, lib.rel)).href
        );
      });
    });
  }
});
