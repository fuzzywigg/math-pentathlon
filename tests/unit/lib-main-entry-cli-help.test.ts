/**
 * @vitest-environment node
 *
 * Hermetic coverage for lib-module main-entry usage / --help
 * (q-mp-958 + q-mp-975 + q-mp-980).
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
import {
  MUTATION_REPORT_ARGS_USAGE,
  main as mutationReportArgsMain,
} from '../../scripts/lib/mutation-report-args.mjs';
import {
  MOBILE_AUDIT_OUT_PATH_USAGE,
  main as mobileAuditOutPathMain,
} from '../../scripts/lib/mobile-audit-out-path.mjs';
import {
  PWA_MANIFEST_CONTRACT_USAGE,
  main as pwaManifestContractMain,
} from '../../scripts/lib/pwa-manifest-contract.mjs';
import {
  PAGE_SETTLE_USAGE,
  main as pageSettleMain,
} from '../../scripts/lib/page-settle.mjs';
import {
  ARTIFACT_DIR_USAGE,
  main as artifactDirMain,
} from '../../scripts/lib/artifact-dir.mjs';
import {
  HELP_ONLY_CLI_USAGE,
  main as helpOnlyCliMain,
} from '../../scripts/lib/help-only-cli.mjs';
import {
  BROWSER_HARNESS_CLI_USAGE,
  main as browserHarnessCliMain,
} from '../../scripts/lib/browser-harness-cli.mjs';
import {
  DEEP_PLAYTEST_CLI_USAGE,
  main as deepPlaytestCliMain,
} from '../../scripts/lib/deep-playtest-cli.mjs';
import {
  OFFLINE_PROBE_CLI_USAGE,
  main as offlineProbeCliMain,
} from '../../scripts/lib/offline-probe-cli.mjs';

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
  {
    rel: 'scripts/lib/mutation-report-args.mjs',
    usage: MUTATION_REPORT_ARGS_USAGE,
    main: mutationReportArgsMain,
    harnessHint: /mutation-report\.mjs/,
  },
  {
    rel: 'scripts/lib/mobile-audit-out-path.mjs',
    usage: MOBILE_AUDIT_OUT_PATH_USAGE,
    main: mobileAuditOutPathMain,
    harnessHint: /mobile-audit\.mjs/,
  },
  {
    rel: 'scripts/lib/pwa-manifest-contract.mjs',
    usage: PWA_MANIFEST_CONTRACT_USAGE,
    main: pwaManifestContractMain,
    harnessHint: /check-pwa-manifest\.mjs/,
  },
  {
    rel: 'scripts/lib/page-settle.mjs',
    usage: PAGE_SETTLE_USAGE,
    main: pageSettleMain,
    harnessHint: /console-sweep\.mjs/,
  },
  {
    rel: 'scripts/lib/artifact-dir.mjs',
    usage: ARTIFACT_DIR_USAGE,
    main: artifactDirMain,
    harnessHint: /console-sweep\.mjs/,
  },
  {
    rel: 'scripts/lib/help-only-cli.mjs',
    usage: HELP_ONLY_CLI_USAGE,
    main: helpOnlyCliMain,
    harnessHint: /check-workflows\.mjs/,
  },
  {
    rel: 'scripts/lib/browser-harness-cli.mjs',
    usage: BROWSER_HARNESS_CLI_USAGE,
    main: browserHarnessCliMain,
    harnessHint: /console-sweep\.mjs/,
  },
  {
    rel: 'scripts/lib/deep-playtest-cli.mjs',
    usage: DEEP_PLAYTEST_CLI_USAGE,
    main: deepPlaytestCliMain,
    harnessHint: /calla-deep-playtest\.mjs/,
  },
  {
    rel: 'scripts/lib/offline-probe-cli.mjs',
    usage: OFFLINE_PROBE_CLI_USAGE,
    main: offlineProbeCliMain,
    harnessHint: /probe-offline-resilience\.mjs/,
  },
] as const;

function runCli(rel: string, args: string[]) {
  return spawnSync(process.execPath, [resolve(ROOT, rel), ...args], {
    encoding: 'utf8',
    timeout: 15_000,
    env: { ...process.env },
  });
}

describe('lib main-entry usage (q-mp-958 / q-mp-975 / q-mp-980)', () => {
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
