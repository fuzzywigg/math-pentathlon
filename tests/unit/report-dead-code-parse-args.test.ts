import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {
  parseArgs,
  writeInventoryArtifacts,
  USAGE,
  OUT_MD_REL,
  OUT_JSON_REL,
} from '../../scripts/report-dead-code.mjs';

const SCRIPT = path.resolve(process.cwd(), 'scripts/report-dead-code.mjs');
const MD_PATH = path.resolve(process.cwd(), OUT_MD_REL);
const JSON_PATH = path.resolve(process.cwd(), OUT_JSON_REL);

describe('report-dead-code parseArgs / CLI (q-mp-896)', () => {
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
    expect(USAGE).toMatch(/dead-code-inventory/);
  });

  it('CLI --help exits 0 and does not write inventory docs', () => {
    const mdBefore = fs.statSync(MD_PATH).mtimeMs;
    const jsonBefore = fs.statSync(JSON_PATH).mtimeMs;
    const r = spawnSync(process.execPath, [SCRIPT, '--help'], {
      encoding: 'utf8',
    });
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/Usage: node scripts\/report-dead-code\.mjs/);
    expect(r.stdout).toMatch(/--dry-run/);
    expect(r.stdout).not.toMatch(/dead-code inventory — running knip/);
    expect(r.stdout).not.toMatch(/Wrote /);
    expect(fs.statSync(MD_PATH).mtimeMs).toBe(mdBefore);
    expect(fs.statSync(JSON_PATH).mtimeMs).toBe(jsonBefore);
  });

  it('CLI unknown flag exits 2 without writing', () => {
    const mdBefore = fs.statSync(MD_PATH).mtimeMs;
    const jsonBefore = fs.statSync(JSON_PATH).mtimeMs;
    const r = spawnSync(process.execPath, [SCRIPT, '--wat'], {
      encoding: 'utf8',
    });
    expect(r.status).toBe(2);
    expect(r.stderr).toMatch(/Unknown flag: --wat/);
    expect(r.stderr).toMatch(/Usage: node scripts\/report-dead-code\.mjs/);
    expect(fs.statSync(MD_PATH).mtimeMs).toBe(mdBefore);
    expect(fs.statSync(JSON_PATH).mtimeMs).toBe(jsonBefore);
  });

  it('writeInventoryArtifacts({ dryRun: true }) skips writeFileSync', () => {
    const mdBefore = fs.statSync(MD_PATH).mtimeMs;
    const jsonBefore = fs.statSync(JSON_PATH).mtimeMs;
    const result = writeInventoryArtifacts({
      md: '# dry-run probe\n',
      jsonText: '{"probe":true}\n',
      dryRun: true,
    });
    expect(result.wrote).toBe(false);
    expect(fs.statSync(MD_PATH).mtimeMs).toBe(mdBefore);
    expect(fs.statSync(JSON_PATH).mtimeMs).toBe(jsonBefore);
  });
});
