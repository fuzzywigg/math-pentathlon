/**
 * Wave 56 leftover after #255/#256 — Fab tutorial objective step. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 56 fab — tutorial objective', () => {
  it('objective restates claim-most; center position; no highlight', () => {
    expect(fabADiffyTutorial.id).toBe('fab-a-diffy-basics');
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'objective');
    expect(step?.title).toBe('Objective');
    expect(step?.message).toMatch(/Claim the most answer bars/);
    expect(step?.message).toMatch(/combining fraction bars/);
    expect(step?.position).toBe('center');
    expect(step?.highlightSelector).toBeUndefined();
  });
});
