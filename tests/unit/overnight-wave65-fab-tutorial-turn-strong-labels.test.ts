/**
 * Wave 65 leftover after tip/#305 — Fab turn-sequence strong labels exact.
 * Wave55 soft-matches Select/Choose/Match; lock <strong> labels leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 65 fab — tutorial turn strong labels', () => {
  it('turn-sequence uses exact Select/Choose/Match strong labels', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(step?.message).toContain('<strong>Select Bars:</strong>');
    expect(step?.message).toContain('<strong>Choose Operation:</strong>');
    expect(step?.message).toContain('<strong>Match Answer:</strong>');
  });
});
