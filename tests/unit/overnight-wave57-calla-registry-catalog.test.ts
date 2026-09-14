/**
 * Wave 57 leftover after #262 — Calla registry catalog fields.
 * Distinct from engine chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getGameById } from '../../src/core/game-registry';

describe('Wave 57 calla — registry catalog', () => {
  it('locks Division I catalog fields', () => {
    const g = getGameById('calla');
    expect(g?.name).toBe('Calla');
    expect(g?.division).toBe('Division I');
    expect(g?.gradeRange).toBe('Grades K-1');
    expect(g?.description).toBe(
      'Distribute cubes strategically to capture and earn free turns.'
    );
    expect(g?.icon).toBe('🎯');
    expect(g?.available).toBe(true);
  });
});
