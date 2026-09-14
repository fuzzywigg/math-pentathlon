/**
 * Wave 59 leftover after #272 — Pinball balls row seat icons.
 * Distinct from name-only Blue/Red. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderScores } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 59 pinball — scores ball seat icons', () => {
  it('repeats seat icons for remaining balls', () => {
    const el = renderScores(createInitialState());
    const p1Balls = el.querySelector(
      '.pinball-player-score.player1 .pinball-balls'
    )?.textContent ?? '';
    const p2Balls = el.querySelector(
      '.pinball-player-score.player2 .pinball-balls'
    )?.textContent ?? '';
    expect(p1Balls).toContain('🔵');
    expect(p2Balls).toContain('🔴');
    expect(p1Balls.includes('🔴')).toBe(false);
    expect(p2Balls.includes('🔵')).toBe(false);
    expect([...p1Balls].filter((c) => c === '🔵').length).toBeGreaterThan(0);
  });
});
