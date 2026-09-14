/**
 * Wave 51 leftover after #233 — classic Hex empty cell click. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderBoard } from '../../src/games/hex/board-ui';

describe('Wave 51 hex — empty click', () => {
  it('fires onCellClick for empty cell', () => {
    const onClick = vi.fn();
    const container = document.createElement('div');
    renderBoard(createInitialState(5), container, onClick);
    const group = container.querySelector('[data-row="1"][data-col="2"]') as SVGGElement;
    group.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).toHaveBeenCalledWith(1, 2);
  });
});
