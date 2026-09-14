/**
 * Wave 49 — FIAR getPlayerColor fallback hex leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerColor } from '../../src/games/fiar/board-ui';

describe('Wave 49 fiar — player color hex', () => {
  it('returns fallback seat hex when CSS vars unset', () => {
    expect(getPlayerColor('player1')).toBe('#3b82f6');
    expect(getPlayerColor('player2')).toBe('#ef4444');
  });
});
