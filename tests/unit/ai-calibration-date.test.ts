/**
 * Hermetic coverage for ai-calibration OUT/title date stamp (q-mp-1352).
 * Date metadata only — no AI search/scoring/difficulty/timing.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import { resolveCalibrationDate } from '../../scripts/lib/calibration-date.mjs';

const AI_CALIBRATION = resolve(process.cwd(), 'scripts/run-ai-calibration.ts');

describe('resolveCalibrationDate (q-mp-1352)', () => {
  it('honors a non-empty CALIBRATION_DATE override', () => {
    expect(resolveCalibrationDate('2026-10-07')).toBe('2026-10-07');
    expect(resolveCalibrationDate('2099-01-02')).toBe('2099-01-02');
  });

  it('defaults to UTC YYYY-MM-DD via toISOString when unset/empty', () => {
    const fixed = new Date('2026-11-02T15:04:05.000Z');
    expect(resolveCalibrationDate(undefined, fixed)).toBe('2026-11-02');
    expect(resolveCalibrationDate('', fixed)).toBe('2026-11-02');
    expect(resolveCalibrationDate(null, fixed)).toBe('2026-11-02');
  });

  it('matches live UTC today when now is omitted', () => {
    const stamp = resolveCalibrationDate(undefined);
    expect(stamp).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(stamp).toBe(new Date().toISOString().slice(0, 10));
  });
});

describe('run-ai-calibration live OUT/title stamp (q-mp-1352)', () => {
  it('wires resolveCalibrationDate and drops hardcoded 2026-10-07 OUT/title', () => {
    const src = readFileSync(AI_CALIBRATION, 'utf8');
    expect(src).toMatch(
      /resolveCalibrationDate\(\s*process\.env\.CALIBRATION_DATE\s*\)/
    );
    expect(src).toMatch(/ai-calibration-\$\{DATE\}\.md/);
    expect(src).toMatch(/# AI Calibration — \$\{DATE\}/);
    expect(src).not.toMatch(/['`]ai-calibration-2026-10-07\.md['`]/);
    expect(src).not.toMatch(/['`]# AI Calibration — 2026-10-07['`]/);
    // Seed constant may still encode 20261007; that is not the OUT stamp.
    expect(src).toMatch(/BASE_SEED\s*=\s*20261007/);
  });
});
