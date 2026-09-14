/**
 * Wave 36 — parseTime malformed / partial string leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { parseTime } from '../../src/core/timer-scoring';

describe('Wave 36 timer-parse — malformed inputs', () => {
  it('throws when seconds segment is missing', () => {
    expect(() => parseTime('')).toThrow();
    expect(() => parseTime('x')).toThrow();
    expect(() => parseTime('1')).toThrow();
  });

  it('returns NaN for non-numeric MM:SS / HH:MM:SS fragments', () => {
    expect(Number.isNaN(parseTime('a:b'))).toBe(true);
    expect(Number.isNaN(parseTime('a:b:c'))).toBe(true);
    expect(Number.isNaN(parseTime(':'))).toBe(true);
    expect(Number.isNaN(parseTime('::'))).toBe(true);
  });

  it('single-digit MM:SS still parses', () => {
    expect(parseTime('1:2')).toBe((1 * 60 + 2) * 1000);
  });
});
