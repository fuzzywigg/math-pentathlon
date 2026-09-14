/**
 * Wave 49 leftover after #221/#226/#227 — Kings empty move history. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderMoveHistory } from '../../src/games/kings-quadraphages/board-ui';

describe('Wave 49 kings — empty history', () => {
  it('shows No moves yet', () => {
    const container = document.createElement('div');
    renderMoveHistory(createInitialGameState(), container);
    expect(container.querySelector('.move-history-empty')?.textContent).toBe('No moves yet');
  });
});
