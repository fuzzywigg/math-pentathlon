/**
 * Overnight TOKENMAXX HEAVY leftovers after #296 — Fab turn-sequence body exacts.
 * Wave55 soft-matches Select/Choose/Match; deepen pool/op/claim sentences. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 63 fab — tutorial turn-sequence body exact', () => {
  it('turn-sequence lists pool choose + op pick + claim match', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(step?.message).toContain('Choose two fraction bars from your pool');
    expect(step?.message).toContain('Pick +, −, ×, or ÷');
    expect(step?.message).toContain(
      'If the result matches an available answer bar, claim it!'
    );
  });
});
