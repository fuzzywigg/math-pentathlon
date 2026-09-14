/**
 * Wave 42 — Star Track isGameOver + AI gate handshake.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, TRACK_LENGTH } from '../../src/games/star-track/types';
import { isGameOver } from '../../src/games/star-track/rules';
import { isAITurn } from '../../src/games/star-track/ai';

describe('Wave 42 Star Track — game over gates', () => {
  it('isGameOver true at TRACK_LENGTH; AI turn false when over', () => {
    const over = {
      ...createInitialState(),
      player1Position: TRACK_LENGTH,
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(isGameOver(over)).toBe(true);
    expect(isAITurn(over, 'player1', 'human-vs-ai')).toBe(false);
  });
});
