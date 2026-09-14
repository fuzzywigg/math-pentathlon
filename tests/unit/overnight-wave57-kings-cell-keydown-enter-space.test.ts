/**
 * Wave 57 leftover after #263 — Kings board Enter/Space activate cell. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderBoard } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 57 kings — cell keydown', () => {
  it('Enter and Space on empty cell call onCellClick', () => {
    const onClick = vi.fn();
    const el = document.createElement('div');
    renderBoard(createInitialGameState(), el, onClick);
    const cell = el.querySelector(
      '.cell[data-row="1"][data-col="1"]'
    ) as HTMLElement;
    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(onClick).toHaveBeenCalledWith(1, 1);
    onClick.mockClear();
    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );
    expect(onClick).toHaveBeenCalledWith(1, 1);
  });
});
