/**
 * @vitest-environment node
 *
 * Hermetic coverage for report-lint-buckets headroom against non-numeric
 * ceilings (q-mp-1254). Does not spawn the eslint probe or write ceilings.
 */
import { describe, it, expect } from 'vitest';
import {
  coerceCeilingNumber,
  resolveRuleHeadroom,
} from '../../scripts/report-lint-buckets.mjs';

describe('report-lint-buckets coerceCeilingNumber (q-mp-1254)', () => {
  it('accepts finite numbers', () => {
    expect(coerceCeilingNumber(0)).toBe(0);
    expect(coerceCeilingNumber(12)).toBe(12);
    expect(coerceCeilingNumber(3.5)).toBe(3.5);
  });

  it('coerces finite numeric strings', () => {
    expect(coerceCeilingNumber('12')).toBe(12);
    expect(coerceCeilingNumber(' 7 ')).toBe(7);
    expect(coerceCeilingNumber('0')).toBe(0);
  });

  it('rejects non-numeric / non-finite values', () => {
    expect(coerceCeilingNumber('abc')).toBeNull();
    expect(coerceCeilingNumber('')).toBeNull();
    expect(coerceCeilingNumber('   ')).toBeNull();
    expect(coerceCeilingNumber(NaN)).toBeNull();
    expect(coerceCeilingNumber(Infinity)).toBeNull();
    expect(coerceCeilingNumber(-Infinity)).toBeNull();
    expect(coerceCeilingNumber(null)).toBeNull();
    expect(coerceCeilingNumber(undefined)).toBeNull();
    expect(coerceCeilingNumber({})).toBeNull();
    expect(coerceCeilingNumber([])).toBeNull();
  });
});

describe('report-lint-buckets resolveRuleHeadroom (q-mp-1254)', () => {
  it('computes positive headroom for numeric ceilings', () => {
    const got = resolveRuleHeadroom(10, 3);
    expect(got.ok).toBe(true);
    if (got.ok) {
      expect(got.ceiling).toBe(10);
      expect(got.headroom).toBe(7);
      expect(got.note).toContain('−7 headroom');
    }
  });

  it('computes OVER note when total exceeds ceiling', () => {
    const got = resolveRuleHeadroom(2, 5);
    expect(got.ok).toBe(true);
    if (got.ok) {
      expect(got.headroom).toBe(-3);
      expect(got.note).toContain('+3 OVER ceiling');
    }
  });

  it('prints empty note at exact ceiling', () => {
    const got = resolveRuleHeadroom(4, 4);
    expect(got.ok).toBe(true);
    if (got.ok) {
      expect(got.headroom).toBe(0);
      expect(got.note).toBe('');
    }
  });

  it('coerces numeric string ceilings the same as numbers', () => {
    const got = resolveRuleHeadroom('10', 3);
    expect(got.ok).toBe(true);
    if (got.ok) {
      expect(got.ceiling).toBe(10);
      expect(got.headroom).toBe(7);
    }
  });

  it('rejects non-numeric string ceilings with explicit skip note', () => {
    // Baseline bug: 'abc' - 3 → NaN; both headroom > 0 and < 0 false → blank note.
    const got = resolveRuleHeadroom('abc', 3);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.ceiling).toBe('abc');
      expect(got.headroom).toBeNull();
      expect(got.error).toBe('non-numeric ceiling');
      expect(got.note).toMatch(/invalid ceiling: non-numeric; headroom skipped/);
    }
  });

  it('rejects NaN / Infinity ceilings', () => {
    for (const bad of [NaN, Infinity, -Infinity]) {
      const got = resolveRuleHeadroom(bad, 1);
      expect(got.ok).toBe(false);
      if (!got.ok) {
        expect(got.headroom).toBeNull();
        expect(got.error).toBe('non-numeric ceiling');
      }
    }
  });
});
