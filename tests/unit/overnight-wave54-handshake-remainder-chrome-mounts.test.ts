/**
 * Overnight HEAVY leftover after #241 — Remainder chrome mounts handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import {
  renderBoard,
  renderDice,
  renderScores,
  renderGameOver,
} from '../../src/games/remainder-islands/board-ui';

describe('Wave 54 handshake — remainder chrome mounts', () => {
  it('board/dice/scores/over shells mount together', () => {
    const s = createInitialState();
    expect(renderBoard(s, () => undefined, () => undefined).classList.contains('remainder-board')).toBe(true);
    expect(renderDice(null).classList.contains('remainder-dice')).toBe(true);
    expect(renderScores(s).classList.contains('remainder-scores')).toBe(true);
    expect(renderGameOver({ ...s, winner: null }).classList.contains('remainder-game-over')).toBe(true);
  });
});
