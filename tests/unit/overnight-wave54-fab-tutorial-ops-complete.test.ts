/**
 * Wave 54 leftover after #240/#241 — Fab tutorial operations + complete copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 54 fab — tutorial ops / complete', () => {
  it('operations lists four symbols; complete asks Finish', () => {
    expect(fabADiffyTutorial.id).toBe('fab-a-diffy-basics');
    expect(fabADiffyTutorial.name).toBe('Learn Fab-a-Diffy');
    const ops = fabADiffyTutorial.steps.find((s) => s.id === 'operations');
    expect(ops?.message).toMatch(/\+/);
    expect(ops?.message).toMatch(/−/);
    expect(ops?.message).toMatch(/×/);
    expect(ops?.message).toMatch(/÷/);
    const complete = fabADiffyTutorial.steps.find((s) => s.id === 'complete');
    expect(complete?.title).toMatch(/Ready to Play/);
    expect(complete?.message).toMatch(/Finish/);
    expect(complete?.message).toMatch(/claim those answer bars/);
  });
});
