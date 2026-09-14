/**
 * Overnight HEAVY leftover after #229 — Pent selector selected + click. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { selectPiece } from '../../src/games/pent-em-in/rules';
import { renderPieceSelector } from '../../src/games/pent-em-in/board-ui';

describe('Wave 50 pent — selector selected/click', () => {
  it('marks selected piece and invokes onPieceSelect', () => {
    const state = selectPiece(createInitialState(), 'F');
    const onSelect = vi.fn();
    const el = renderPieceSelector(state, onSelect);
    const selected = el.querySelector('.pent-piece-option.selected');
    expect(selected).toBeTruthy();
    expect(selected?.querySelector('.pent-piece-label')?.textContent).toBe('F');
    const other = [...el.querySelectorAll('.pent-piece-option')].find(
      (n) => !n.classList.contains('selected')
    ) as HTMLElement;
    expect(other).toBeTruthy();
    other.click();
    expect(onSelect).toHaveBeenCalled();
    expect(typeof onSelect.mock.calls[0][0]).toBe('string');
  });
});
