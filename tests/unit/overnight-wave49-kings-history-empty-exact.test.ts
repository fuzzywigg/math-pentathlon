/**
 * Wave 49 — Kings empty history exact leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderMoveHistory } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => { document.body.innerHTML = ''; });

describe('Wave 49 kings — empty history', () => {
  it('shows No moves yet on opening', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    renderMoveHistory(createInitialGameState(), el);
    expect(el.querySelector('.move-history-empty')?.textContent).toBe('No moves yet');
  });
});
