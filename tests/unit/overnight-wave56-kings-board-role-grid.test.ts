/**
 * Wave 56 leftover after #256 — Kings board role=grid. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderBoard } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 kings — board grid', () => {
  it('.board has role=grid', () => {
    const el = document.createElement('div');
    renderBoard(createInitialGameState(), el);
    expect(el.querySelector('.board')?.getAttribute('role')).toBe('grid');
  });
});
