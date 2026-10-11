import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { readReporterJson } from '../../scripts/lib/read-reporter-json.mjs';

const tempDirs: string[] = [];

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

function tempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

function writeJson(body: string): string {
  const path = join(tempDir('read-reporter-'), 'report.json');
  writeFileSync(path, body);
  return path;
}

describe('readReporterJson rejects null / non-object roots (q-mp-1153)', () => {
  it('rejects JSON null with a clear parse error', () => {
    expect(readReporterJson(writeJson('null'))).toEqual({
      ok: false,
      error: 'non-object json root',
    });
  });

  it('rejects array roots', () => {
    expect(readReporterJson(writeJson('[]'))).toEqual({
      ok: false,
      error: 'non-object json root',
    });
    expect(readReporterJson(writeJson('[{"suites":[]}]'))).toEqual({
      ok: false,
      error: 'non-object json root',
    });
  });

  it('rejects primitive non-object roots', () => {
    expect(readReporterJson(writeJson('42'))).toEqual({
      ok: false,
      error: 'non-object json root',
    });
    expect(readReporterJson(writeJson('"report"'))).toEqual({
      ok: false,
      error: 'non-object json root',
    });
    expect(readReporterJson(writeJson('true'))).toEqual({
      ok: false,
      error: 'non-object json root',
    });
  });

  it('accepts object reporter roots unchanged', () => {
    const result = readReporterJson(
      writeJson('{"suites":[],"success":true,"numPassedTests":1}')
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toMatchObject({
        suites: [],
        success: true,
        numPassedTests: 1,
      });
    }
  });

  it('keeps corrupt / missing paths distinct from non-object roots', () => {
    expect(readReporterJson(writeJson('{'))).toEqual({
      ok: false,
      error: 'corrupt json',
    });
    expect(readReporterJson(join(tempDir('missing-'), 'nope.json'))).toEqual({
      ok: false,
      error: 'missing json',
    });
  });
});

describe('readReporterJson accepts UTF-8 BOM JSON (q-mp-1321)', () => {
  it('parses object roots prefixed with U+FEFF', () => {
    const result = readReporterJson(writeJson('\uFEFF{"numFailedTests":0,"success":true}'));
    expect(result).toEqual({
      ok: true,
      data: { numFailedTests: 0, success: true },
    });
  });

  it('still rejects BOM-prefixed corrupt JSON and non-object roots', () => {
    expect(readReporterJson(writeJson('\uFEFF{'))).toEqual({
      ok: false,
      error: 'corrupt json',
    });
    expect(readReporterJson(writeJson('\uFEFFnull'))).toEqual({
      ok: false,
      error: 'non-object json root',
    });
    expect(readReporterJson(writeJson('\uFEFF[]'))).toEqual({
      ok: false,
      error: 'non-object json root',
    });
  });

  it('does not treat a mid-payload FEFF as a leading BOM strip that salvages corrupt JSON', () => {
    // Leading char is '{', not BOM — FEFF inside remains and JSON.parse fails closed.
    expect(readReporterJson(writeJson('{\uFEFF"numFailedTests":0}'))).toEqual({
      ok: false,
      error: 'corrupt json',
    });
  });
});
