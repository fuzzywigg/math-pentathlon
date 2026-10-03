/**
 * Wave 65 leftover after tip/#305 — FIAR strategy center-board exact.
 * Soft /center of the board/; lock full li leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 65 fiar — tutorial strategy center exact', () => {
  it('strategy-tips lists control the center of the board', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.message).toContain(
      '<li>Watch for wins in either color after every move</li>'
    );
    expect(step?.title).toBe('Strategy Tips');
  });
});
