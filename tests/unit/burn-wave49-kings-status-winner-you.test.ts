/**
 * Wave 49 — Kings hvai You Win banner. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderStatus } from '../../src/games/kings-quadraphages/board-ui';

describe('Wave 49 kings — You Win', () => {
  it('labels You Win', () => {
    const box = document.createElement('div');
    const s = { ...createInitialGameState(), winner: 'player1' as const, turnPhase: 'gameOver' as const };
    renderStatus(s, box, 'human-vs-ai');
    expect(box.querySelector('.status-winner')?.textContent).toMatch(/You Win/);
  });
});
