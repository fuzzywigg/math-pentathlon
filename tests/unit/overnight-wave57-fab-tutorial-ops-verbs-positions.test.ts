/**
 * Wave 57 leftover after #257 — Fab tutorial ops verbs + rules/winning positions. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 57 fab — tutorial ops verbs positions', () => {
  it('ops verb copy; rules auto-simplify + position; winning position', () => {
    const ops = fabADiffyTutorial.steps.find((s) => s.id === 'operations');
    expect(ops?.message).toMatch(/Add fractions/);
    expect(ops?.message).toMatch(/Subtract fractions/);
    expect(ops?.message).toMatch(/Multiply fractions/);
    expect(ops?.message).toMatch(/Divide fractions/);
    expect(ops?.position).toBe('center');

    const rules = fabADiffyTutorial.steps.find((s) => s.id === 'rules');
    expect(rules?.message).toMatch(/automatically simplified/);
    expect(rules?.position).toBe('top');

    const winning = fabADiffyTutorial.steps.find((s) => s.id === 'winning');
    expect(winning?.position).toBe('bottom');
  });
});
