/**
 * Wave 67 leftover after tip/#316 — Fab tutorial config name exact.
 * Soft Learn Fab match; lock name leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 67 fab — tutorial name exact', () => {
  it('tutorial name is Learn Fab-a-Diffy', () => {
    expect(fabADiffyTutorial.name).toBe('Learn Fab-a-Diffy');
    expect(fabADiffyTutorial.id).toBe('fab-a-diffy-basics');
  });
});
