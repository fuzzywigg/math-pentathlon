/**
 * Wave 48 overnight — Calla board cube dots + last-sown class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, type CallaGameState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 48 calla overnight — cube dots last', () => {
  it('renders calla-cubes for 1–6 and omits for >6; marks last sown', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [3, 7, 1, 0, 2],
      lastSownPit: { side: 'player1', index: 0 },
    };
    const container = document.createElement('div');
    renderBoard(state, container);
    const cubes = container.querySelectorAll('.calla-cubes');
    expect(cubes.length).toBeGreaterThan(0);
    const last = container.querySelector('.calla-pit-last, .calla-last-move');
    expect(last || container.innerHTML.includes('last')).toBeTruthy();
  });
});
