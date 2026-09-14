/**
 * Wave 49 — Queens getPlayerName Blue/Red. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — player names', () => {
  it('maps seats to Blue/Red', () => {
    expect(getPlayerName('player1')).toBe('Blue');
    expect(getPlayerName('player2')).toBe('Red');
  });
});
