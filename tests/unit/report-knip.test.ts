/**
 * Unit coverage for knip report-only metric helpers (q-mp-118 / q-mp-1036).
 * No network: exercises pure summarize / diff / baseline-schema helpers only.
 */
import { describe, it, expect } from 'vitest';
import {
  countIssueField,
  summarizeKnip,
  diffMetrics,
  validateBaselineMetrics,
  METRIC_KEYS,
} from '../../scripts/report-knip.mjs';

describe('report-knip helpers', () => {
  it('countIssueField handles arrays and enumMembers-style objects', () => {
    expect(countIssueField(undefined)).toBe(0);
    expect(countIssueField([{ name: 'a' }, { name: 'b' }])).toBe(2);
    expect(
      countIssueField({
        Color: ['Red', 'Blue'],
        Size: ['S'],
      })
    ).toBe(3);
  });

  it('summarizeKnip aggregates unused export / type / file totals', () => {
    const result = summarizeKnip({
      files: ['src/orphan.ts'],
      issues: [
        {
          file: 'src/a.ts',
          exports: [{ name: 'unusedA' }],
          types: [{ name: 'T1' }, { name: 'T2' }],
          dependencies: [],
          devDependencies: [],
          unlisted: [{ name: 'esbuild' }],
          duplicates: [[{ name: 'x' }, { name: 'y' }]],
        },
        {
          file: 'src/b.ts',
          exports: [{ name: 'unusedB' }, { name: 'unusedC' }],
          types: [],
          dependencies: [{ name: 'leftpad' }],
          devDependencies: [],
          unlisted: [],
          duplicates: [],
        },
      ],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const { metrics } = result;
    expect(metrics.unusedFiles).toBe(1);
    expect(metrics.unusedExports).toBe(3);
    expect(metrics.unusedTypes).toBe(2);
    expect(metrics.unusedDependencies).toBe(1);
    expect(metrics.unusedDevDependencies).toBe(0);
    expect(metrics.unlisted).toBe(1);
    expect(metrics.duplicates).toBe(1);
    for (const key of METRIC_KEYS) {
      expect(typeof metrics[key]).toBe('number');
    }
  });

  it('summarizeKnip rejects non-array issues as unparseable (q-mp-1106b)', () => {
    const result = summarizeKnip({
      files: ['src/orphan.ts'],
      issues: { exports: [{ name: 'unusedA' }] },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toMatch(/unparseable/i);
      expect(result.message).toMatch(/issues must be an array/i);
    }
  });

  it('summarizeKnip rejects null / undefined / non-object roots without throw (q-mp-1154)', () => {
    for (const bad of [null, undefined, 42, 'x', []]) {
      const result = summarizeKnip(bad);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.message).toMatch(/unparseable/i);
        expect(result.message).toMatch(/root must be a non-null object/i);
      }
    }
  });

  it('summarizeKnip accepts object root with missing issues as empty (q-mp-1154)', () => {
    const result = summarizeKnip({ files: ['src/orphan.ts'] });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.metrics.unusedFiles).toBe(1);
    expect(result.metrics.unusedExports).toBe(0);
  });

  it('diffMetrics flags growth vs baseline (ratchet-down posture)', () => {
    const baseline = {
      unusedFiles: 0,
      unusedExports: 7,
      unusedTypes: 95,
      unusedDependencies: 0,
      unusedDevDependencies: 0,
      unlisted: 3,
      duplicates: 3,
    };
    const grown = { ...baseline, unusedExports: 9, unusedTypes: 90 };
    const result = diffMetrics(grown, baseline);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const { growth, shrink, same } = result;
    expect(growth).toEqual([
      {
        key: 'unusedExports',
        baseline: 7,
        current: 9,
        delta: 2,
      },
    ]);
    expect(shrink).toEqual([
      {
        key: 'unusedTypes',
        baseline: 95,
        current: 90,
        delta: -5,
      },
    ]);
    expect(same).toContain('unusedFiles');
    expect(same).not.toContain('unusedExports');
  });

  it('diffMetrics fails closed on non-finite baseline / current (q-mp-1235)', () => {
    const finite = {
      unusedFiles: 0,
      unusedExports: 3,
      unusedTypes: 36,
      unusedDependencies: 0,
      unusedDevDependencies: 0,
      unlisted: 3,
      duplicates: 0,
    };
    const allFive = Object.fromEntries(
      METRIC_KEYS.map((key) => [key, 5])
    ) as Record<string, number>;
    const allNaN = Object.fromEntries(
      METRIC_KEYS.map((key) => [key, Number.NaN])
    ) as Record<string, number>;

    // Pre-fix: NaN deltas used to land every key in `same` (growth: 0).
    const washed = diffMetrics(allFive, allNaN);
    expect(washed.ok).toBe(false);
    if (!washed.ok) {
      expect(washed.message).toMatch(/schema invalid|finite number/i);
      expect(washed.message).toMatch(/unusedFiles/);
    }

    for (const bad of [
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    ]) {
      const badBaseline = diffMetrics(finite, { ...finite, unusedTypes: bad });
      expect(badBaseline.ok).toBe(false);
      if (!badBaseline.ok) {
        expect(badBaseline.message).toMatch(/schema invalid|finite number/i);
        expect(badBaseline.message).toMatch(/unusedTypes/);
      }

      const badCurrent = diffMetrics({ ...finite, unusedExports: bad }, finite);
      expect(badCurrent.ok).toBe(false);
      if (!badCurrent.ok) {
        expect(badCurrent.message).toMatch(/schema invalid|finite number/i);
        expect(badCurrent.message).toMatch(/unusedExports/);
      }
    }

    // Finite deltas unchanged.
    const same = diffMetrics(finite, finite);
    expect(same.ok).toBe(true);
    if (same.ok) {
      expect(same.growth).toEqual([]);
      expect(same.shrink).toEqual([]);
      expect(same.same).toEqual([...METRIC_KEYS]);
    }
  });

  it('validateBaselineMetrics accepts a full numeric metrics object', () => {
    const metrics = {
      unusedFiles: 0,
      unusedExports: 3,
      unusedTypes: 36,
      unusedDependencies: 0,
      unusedDevDependencies: 0,
      unlisted: 3,
      duplicates: 0,
    };
    const result = validateBaselineMetrics(metrics);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.metrics).toEqual(metrics);
  });

  it('validateBaselineMetrics rejects incomplete metrics (q-mp-1036)', () => {
    const result = validateBaselineMetrics({ unusedExports: 3 });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toMatch(/incomplete|missing numeric/i);
      expect(result.message).not.toMatch(/no baseline file/i);
      expect(result.message).not.toMatch(/growth/i);
    }
  });

  it('validateBaselineMetrics rejects null / empty-string / non-numeric values', () => {
    const full = {
      unusedFiles: 0,
      unusedExports: 3,
      unusedTypes: 36,
      unusedDependencies: 0,
      unusedDevDependencies: 0,
      unlisted: 3,
      duplicates: 0,
    };
    for (const bad of [null, '', '3', Number.NaN, Number.POSITIVE_INFINITY]) {
      const result = validateBaselineMetrics({ ...full, unusedTypes: bad });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.message).toMatch(
          /schema invalid|finite (number|integer)/i
        );
      }
    }
  });

  it('validateBaselineMetrics rejects negative / non-integer counts (q-mp-1155)', () => {
    const full = {
      unusedFiles: 0,
      unusedExports: 3,
      unusedTypes: 36,
      unusedDependencies: 0,
      unusedDevDependencies: 0,
      unlisted: 3,
      duplicates: 0,
    };
    for (const bad of [-1, 0.5, -0.5, 1.25]) {
      const result = validateBaselineMetrics({ ...full, unusedFiles: bad });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.message).toMatch(/integer\s*≥\s*0|finite integer/i);
      }
    }
  });
});
