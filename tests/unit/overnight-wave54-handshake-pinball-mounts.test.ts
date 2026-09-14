/**
 * Wave 54 leftover after #240 — Pinball board-ui opening mounts handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import {
  renderChallenge,
  renderResult,
  renderPinballBoard,
  renderScores,
  renderGameOver,
} from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 handshake — pinball mounts', () => {
  it('mounts challenge / empty result / board / scores / gameover', () => {
    const s = createInitialState();
    expect(renderChallenge(s, () => undefined).classList.contains('pinball-challenge')).toBe(true);
    expect(renderResult(s, () => undefined).classList.contains('pinball-result')).toBe(true);
    expect(renderPinballBoard(s).classList.contains('pinball-board')).toBe(true);
    expect(renderScores(s).classList.contains('pinball-scores')).toBe(true);
    expect(renderGameOver(s).classList.contains('pinball-game-over')).toBe(true);
  });
});
