/**
 * Wave 54 leftover after #240/#241 — Fab tutorial strategy-tips copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 54 fab — tutorial strategy tips', () => {
  it('strategy-tips lists plan / block / versatile; center position', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.title).toBe('Strategy Tips');
    expect(step?.position).toBe('center');
    expect(step?.message).toMatch(/Plan combinations/);
    expect(step?.message).toMatch(/Block opponent/);
    expect(step?.message).toMatch(/versatile fractions/);
  });
});
