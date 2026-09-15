/**
 * Wave 64 leftover after #305 — Fab turn-sequence strong step labels.
 * Wave63 locks pool/op/claim sentences; deepen Select/Choose/Match strongs. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 64 fab — tutorial turn strong labels', () => {
  it('turn-sequence uses Select Bars / Choose Operation / Match Answer strongs', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(step?.message).toContain('<strong>Select Bars:</strong>');
    expect(step?.message).toContain('<strong>Choose Operation:</strong>');
    expect(step?.message).toContain('<strong>Match Answer:</strong>');
  });
});
