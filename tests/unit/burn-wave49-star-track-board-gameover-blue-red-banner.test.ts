/**
 * Wave 49 — Star-track gameOver Blue/Red banner. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { renderBoard } from '../../src/games/star-track/board-ui';

describe('Wave 49 star-track — gameOver banner', () => {
  it('announces Blue reaches the star', () => {
    const s = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    const box = document.createElement('div');
    renderBoard(s, box);
    expect(box.querySelector('.star-track-winner')?.textContent).toMatch(/Blue reaches the star/);
  });
});
