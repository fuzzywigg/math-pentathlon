/**
 * Wave 65 leftover after tip/#305 — Fab rules highlight + top position.
 * Wave55 pinned selector; deepen position top leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 65 fab — tutorial rules highlight top', () => {
  it('rules highlights answer-board from top', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'rules');
    expect(step?.highlightSelector).toBe('.fab-answer-board');
    expect(step?.position).toBe('top');
  });
});
