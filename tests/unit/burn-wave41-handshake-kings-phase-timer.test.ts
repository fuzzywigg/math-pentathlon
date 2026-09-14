/**
 * Wave 41 handshake — Kings phase message × core formatTime.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialGameState,
  selectKing,
  getCurrentPhaseMessage,
} from '../../src/games/kings-quadraphages/game-state';
import { formatTime } from '../../src/core/timer-scoring';

describe('Wave 41 handshake — kings × timer formatTime', () => {
  it('opening / selected / place / over messages pair with clocks', () => {
    const open = createInitialGameState();
    expect(getCurrentPhaseMessage(open)).toContain('Player 1');
    expect(getCurrentPhaseMessage(open)).toContain('King');
    expect(formatTime(0)).toBe('00:00');

    const selected = selectKing(open);
    expect(getCurrentPhaseMessage(selected)).toContain('green');
    expect(formatTime(60_000)).toBe('01:00');

    const placing = {
      ...selected,
      turnPhase: 'placeQuadraphage' as const,
      selectedKingPosition: null,
    };
    expect(getCurrentPhaseMessage(placing)).toContain('Quadraphage');
    expect(formatTime(125_000)).toBe('02:05');

    const over = {
      ...open,
      turnPhase: 'gameOver' as const,
      winner: 'player2' as const,
    };
    expect(getCurrentPhaseMessage(over)).toContain('Player 2 wins');
    expect(formatTime(3661_000)).toMatch(/61:01|01:01:01/);
  });
});
