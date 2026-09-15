/**
 * Wave 67 leftover after tip/#316 — Fab strategy position center.
 * Wave65 plan/versatile body; lock strategy position leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 67 fab — tutorial strategy position', () => {
  it('strategy-tips positions center', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.position).toBe('center');
  });
});
