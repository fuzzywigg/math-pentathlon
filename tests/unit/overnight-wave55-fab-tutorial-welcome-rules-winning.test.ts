/**
 * Wave 55 leftover after #249/#250 — Fab tutorial welcome/rules/winning copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 55 fab — tutorial welcome rules winning', () => {
  it('covers claim-most, turn sequence, used-once, and scores highlight', () => {
    const welcome = fabADiffyTutorial.steps.find((s) => s.id === 'welcome');
    expect(welcome?.message).toMatch(/Fab-a-Diffy/);
    expect(welcome?.message).toMatch(/Claim the most answer bars/);
    expect(welcome?.position).toBe('center');

    const seq = fabADiffyTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(seq?.message).toMatch(/Select Bars/);
    expect(seq?.message).toMatch(/Choose Operation/);
    expect(seq?.message).toMatch(/Match Answer/);
    expect(seq?.position).toBe('bottom');
    expect(seq?.highlightSelector).toBe('.fab-bar-pool');

    const rules = fabADiffyTutorial.steps.find((s) => s.id === 'rules');
    expect(rules?.message).toMatch(/used once/);
    expect(rules?.message).toMatch(/2\/4 = 1\/2/);
    expect(rules?.highlightSelector).toBe('.fab-answer-board');

    const winning = fabADiffyTutorial.steps.find((s) => s.id === 'winning');
    expect(winning?.message).toMatch(/most answer bars when all bars are used/);
    expect(winning?.highlightSelector).toBe('.fab-scores');
  });
});
