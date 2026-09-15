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
      '<li>Control the center of the board</li>'
    );
    expect(step?.title).toBe('Strategy Tips');
  });
});
