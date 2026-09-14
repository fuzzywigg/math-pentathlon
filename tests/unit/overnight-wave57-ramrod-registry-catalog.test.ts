/**
 * Wave 57 leftover after #262 — Ramrod registry catalog fields.
 * Distinct from tutorial/engine chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getGameById } from '../../src/core/game-registry';

describe('Wave 57 ramrod — registry catalog', () => {
  it('locks Division II catalog fields', () => {
    const g = getGameById('ramrod');
    expect(g?.name).toBe('Ramrod');
    expect(g?.division).toBe('Division II');
    expect(g?.gradeRange).toBe('Grades 2-3');
    expect(g?.description).toBe(
      'Network addend combinations with Cuisenaire rods to complete sum boxes.'
    );
    expect(g?.icon).toBe('▭');
  });
});
