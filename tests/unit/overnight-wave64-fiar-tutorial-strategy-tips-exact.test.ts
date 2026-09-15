/**
 * Wave 64 leftover after #305 — FIAR strategy tips sentences exact.
 * Wave54 soft Block/threats/center; deepen full tip leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 64 fiar — tutorial strategy tips exact', () => {
  it('strategy-tips locks block paths / multiple threats / control center', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.message).toContain(
      "Block opponent's potential winning paths"
    );
    expect(step?.message).toContain('Set up multiple winning threats');
    expect(step?.message).toContain('Control the center of the board');
  });
});
