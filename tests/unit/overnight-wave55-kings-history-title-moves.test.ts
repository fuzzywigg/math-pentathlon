/**
 * Wave 55 leftover after #250 — Kings history chrome title. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderMoveHistory } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 kings — history title', () => {
  it('renders Moves heading on empty history', () => {
    const el = document.createElement('div');
    renderMoveHistory(createInitialGameState(), el);
    expect(el.querySelector('.move-history-title')?.textContent).toBe('Moves');
  });
});
