/**
 * Wave 60 leftover after #282 — Contig registry catalog fields. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getGameById } from '../../src/core/game-registry';

describe('Wave 60 contig — registry catalog', () => {
  it('locks Division III catalog fields', () => {
    const g = getGameById('contig-60');
    expect(g?.name).toBe('Contig 60');
    expect(g?.division).toBe('Division III');
    expect(g?.gradeRange).toBe('Grades 4-5');
    expect(g?.description).toBe(
      'Form number sentences from dice rolls. Four operations strategy game.'
    );
    expect(g?.playerCount).toBe('2 Players');
    expect(g?.difficulty).toBe('intermediate');
    expect(g?.icon).toBe('🎲');
  });
});
