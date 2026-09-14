/**
 * Wave 49 — Kings history place entry leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderMoveHistory } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => { document.body.innerHTML = ''; });

describe('Wave 49 kings — history place entry', () => {
  it('renders placeQuadraphage entry with ● coord', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const state = {
      ...createInitialGameState(),
      moveHistory: [
        {
          player: 'player1' as const,
          action: 'placeQuadraphage' as const,
          from: null,
          to: { row: 3, col: 4 },
        },
      ],
    };
    renderMoveHistory(state, el);
    const entry = el.querySelector('.move-history-entry.move-p1');
    expect(entry?.textContent).toMatch(/●D3/);
  });
});
