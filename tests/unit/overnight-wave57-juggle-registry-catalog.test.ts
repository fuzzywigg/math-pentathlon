/**
 * Wave 57 leftover after #262 — Juggle registry catalog fields.
 * Distinct from tutorial/engine chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getGameById } from '../../src/core/game-registry';

describe('Wave 57 juggle — registry catalog', () => {
  it('locks Division III catalog fields', () => {
    const g = getGameById('juggle');
    expect(g?.name).toBe('Juggle');
    expect(g?.division).toBe('Division III');
    expect(g?.gradeRange).toBe('Grades 4-5');
    expect(g?.description).toBe(
      'Juggle polyominoes to complete your 9x9 grid. Area and transformations.'
    );
    expect(g?.icon).toBe('⊞');
  });
});
