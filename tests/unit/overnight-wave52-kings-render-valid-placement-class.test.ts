/**
 * Wave 52 — Kings cell-valid-placement leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderBoard } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 52 kings — cell-valid-placement', () => {
  it('marks empty cells during placeQuadraphage phase', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const state = {
      ...createInitialGameState(),
      turnPhase: 'placeQuadraphage' as const,
    };
    renderBoard(state, container);
    expect(
      container.querySelectorAll('.cell-valid-placement').length
    ).toBeGreaterThan(0);
    expect(
      container
        .querySelector('.cell[data-row="1"][data-col="5"]')
        ?.classList.contains('cell-valid-placement')
    ).toBe(false);
  });
});
