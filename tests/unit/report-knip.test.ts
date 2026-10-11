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
    const metrics = summarizeKnip({
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
    const { growth, shrink, same } = diffMetrics(grown, baseline);
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
        expect(result.message).toMatch(/schema invalid|finite number/i);
      }
    }
  });
});
