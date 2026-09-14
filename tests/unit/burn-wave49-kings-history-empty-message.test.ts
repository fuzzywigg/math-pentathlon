/**
 * Wave 49 — Kings empty move history message. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderMoveHistory } from '../../src/games/kings-quadraphages/board-ui';

describe('Wave 49 kings — history empty', () => {
  it('shows No moves yet', () => {
    const box = document.createElement('div');
    renderMoveHistory(createInitialGameState(), box);
    expect(box.querySelector('.move-history-empty')?.textContent).toBe('No moves yet');
  });
});
