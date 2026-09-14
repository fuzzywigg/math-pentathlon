/**
 * Wave 52 — Kings moveKing history entry leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderMoveHistory } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 52 kings — history moveKing entry', () => {
  it('renders ♚from→to for moveKing action', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const state = {
      ...createInitialGameState(),
      moveHistory: [
        {
          player: 'player1' as const,
          action: 'moveKing' as const,
          from: { row: 1, col: 5 },
          to: { row: 2, col: 5 },
        },
      ],
    };
    renderMoveHistory(state, el);
    const entry = el.querySelector('.move-history-entry.move-p1');
    expect(entry?.textContent).toMatch(/♚E1→E2/);
  });
});
