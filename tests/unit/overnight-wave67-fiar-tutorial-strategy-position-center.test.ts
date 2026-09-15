/**
 * Wave 67 leftover after tip/#316 — FIAR strategy position center.
 * Wave65 strategy lis; lock position center leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 67 fiar — tutorial strategy position', () => {
  it('strategy-tips positions center', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.position).toBe('center');
  });
});
