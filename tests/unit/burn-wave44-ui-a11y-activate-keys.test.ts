/**
 * Wave 44 overnight HEAVY — bindCellActivateKeys / bindBoardCellKeys.
 */
import { describe, it, expect, vi } from 'vitest';
import { bindCellActivateKeys, bindBoardCellKeys } from '../../src/ui/board-a11y';

describe('Wave 44 UI — activate keys', () => {
  it('Enter/Space activate cell and board delegation', () => {
    const cell = document.createElement('div');
    cell.tabIndex = 0;
    const onCell = vi.fn();
    bindCellActivateKeys(cell, onCell);
    cell.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    cell.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(onCell).toHaveBeenCalledTimes(2);

    const board = document.createElement('div');
    const target = document.createElement('div');
    target.className = 'cell';
    target.tabIndex = 0;
    board.appendChild(target);
    const onBoard = vi.fn();
    bindBoardCellKeys(board, (el) => el.classList.contains('cell'), onBoard);
    target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(onBoard).toHaveBeenCalledWith(target);
  });
});
