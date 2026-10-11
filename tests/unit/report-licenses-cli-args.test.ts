/**
 * @vitest-environment node
 *
 * Hermetic argv + dry-run write-guard coverage for report-licenses (q-mp-979).
 * Malformed lock message helper (q-mp-1026).
 * Empty/missing packages gate helpers (q-mp-1037).
 */
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {
  parseArgs,
  writeLicenseArtifacts,
  malformedLockMessage,
  isUsableLockPackages,
  emptyPackagesMessage,
  USAGE,
  OUT_DIR,
  OUT_DIR_REL,
} from '../../scripts/report-licenses.mjs';

const SCRIPT = path.resolve(process.cwd(), 'scripts/report-licenses.mjs');
const SBOM_PATH = path.join(OUT_DIR, 'sbom.cdx.json');
const SUMMARY_MD_PATH = path.join(OUT_DIR, 'summary.md');
const SUMMARY_JSON_PATH = path.join(OUT_DIR, 'summary.json');

function mtimesOrZero(p: string): number {
  try {
    return fs.statSync(p).mtimeMs;
  } catch {
    return 0;
  }
}

describe('report-licenses parseArgs / CLI (q-mp-979)', () => {
  it('parseArgs accepts known flags and defaults', () => {
    expect(parseArgs([])).toEqual({
      ok: true,
      help: false,
      dryRun: false,
    });
    expect(parseArgs(['--help'])).toMatchObject({ ok: true, help: true });
    expect(parseArgs(['-h', '--dry-run'])).toEqual({
      ok: true,
      help: true,
      dryRun: true,
    });
    expect(parseArgs(['--dry-run'])).toEqual({
      ok: true,
      help: false,
      dryRun: true,
    });
  });

  it('parseArgs rejects unknown flags and bare args', () => {
    expect(parseArgs(['--wat'])).toEqual({
      ok: false,
      message: 'Unknown flag: --wat',
    });
    expect(parseArgs(['docs/dev/x.md']).ok).toBe(false);
  });

  it('USAGE documents help, dry-run, and default write path', () => {
    expect(USAGE).toMatch(/--help/);
    expect(USAGE).toMatch(/--dry-run/);
    expect(USAGE).toMatch(/test-results\/licenses/);
  });

  it('CLI --help exits 0 and does not write license artifacts', () => {
    const sbomBefore = mtimesOrZero(SBOM_PATH);
    const mdBefore = mtimesOrZero(SUMMARY_MD_PATH);
    const jsonBefore = mtimesOrZero(SUMMARY_JSON_PATH);
    const r = spawnSync(process.execPath, [SCRIPT, '--help'], {
      encoding: 'utf8',
    });
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/Usage: node scripts\/report-licenses\.mjs/);
    expect(r.stdout).toMatch(/--dry-run/);
    expect(r.stdout).not.toMatch(/License & provenance report/);
    expect(r.stdout).not.toMatch(/Wrote /);
    expect(mtimesOrZero(SBOM_PATH)).toBe(sbomBefore);
    expect(mtimesOrZero(SUMMARY_MD_PATH)).toBe(mdBefore);
    expect(mtimesOrZero(SUMMARY_JSON_PATH)).toBe(jsonBefore);
  });

  it('CLI unknown flag exits 2 without writing', () => {
    const sbomBefore = mtimesOrZero(SBOM_PATH);
    const mdBefore = mtimesOrZero(SUMMARY_MD_PATH);
    const jsonBefore = mtimesOrZero(SUMMARY_JSON_PATH);
    const r = spawnSync(process.execPath, [SCRIPT, '--wat'], {
      encoding: 'utf8',
    });
    expect(r.status).toBe(2);
    expect(r.stderr).toMatch(/Unknown flag: --wat/);
    expect(r.stderr).toMatch(/Usage: node scripts\/report-licenses\.mjs/);
    expect(mtimesOrZero(SBOM_PATH)).toBe(sbomBefore);
    expect(mtimesOrZero(SUMMARY_MD_PATH)).toBe(mdBefore);
    expect(mtimesOrZero(SUMMARY_JSON_PATH)).toBe(jsonBefore);
  });

  it('writeLicenseArtifacts({ dryRun: true }) skips writeFileSync', () => {
    const sbomBefore = mtimesOrZero(SBOM_PATH);
    const mdBefore = mtimesOrZero(SUMMARY_MD_PATH);
    const jsonBefore = mtimesOrZero(SUMMARY_JSON_PATH);
    const result = writeLicenseArtifacts({
      sbomText: '{"probe":true}\n',
      summaryMd: '# dry-run probe\n',
      summaryJsonText: '{"probe":true}\n',
      dryRun: true,
    });
    expect(result.wrote).toBe(false);
    expect(result.outDir).toBe(OUT_DIR);
    expect(OUT_DIR_REL).toBe('test-results/licenses');
    expect(mtimesOrZero(SBOM_PATH)).toBe(sbomBefore);
    expect(mtimesOrZero(SUMMARY_MD_PATH)).toBe(mdBefore);
    expect(mtimesOrZero(SUMMARY_JSON_PATH)).toBe(jsonBefore);
  });

  it('malformedLockMessage is short, includes hint, and is stack-free (q-mp-1026)', () => {
    const msg = malformedLockMessage(
      '/tmp/package-lock.json',
      "Expected property name or '}' in JSON at position 1"
    );
    expect(msg).toMatch(
      /report:licenses — malformed JSON in \/tmp\/package-lock\.json/
    );
    expect(msg).toMatch(/Expected property name/);
    expect(msg).toMatch(/npm install/);
    expect(msg).not.toMatch(/at JSON\.parse|at main|at ModuleJob|SyntaxError/);
  });

  it('rejects null / missing / empty packages as unusable (q-mp-1037)', () => {
    expect(isUsableLockPackages(null)).toBe(false);
    expect(isUsableLockPackages(undefined)).toBe(false);
    expect(isUsableLockPackages({})).toBe(false);
    expect(isUsableLockPackages([])).toBe(false);
    expect(isUsableLockPackages({ '': { name: 'demo' } })).toBe(true);
    const msg = emptyPackagesMessage('/tmp/package-lock.json');
    expect(msg).toMatch(
      /report:licenses — empty or missing packages in \/tmp\/package-lock\.json/
    );
    expect(msg).toMatch(/non-empty "packages" object/);
    expect(msg).toMatch(/npm install/);
    expect(msg).not.toMatch(/Would write|Lockfile packages:/);
  });
});
