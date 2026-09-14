/**
 * Wave 55 leftover after #250 — Juggle empty placing cell click + Enter.
 * Shared board-a11y pattern; not calla pit keys from #251. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState, selectDie } from '../../src/games/juggle/rules';
import { renderBoard } from '../../src/games/juggle/board-ui';

describe('Wave 55 juggle — placing click/Enter', () => {
  it('pointer empty cells fire click and Enter activate', () => {
    const s = selectDie(
      {
        ...createInitialState(),
        phase: 'selectingShape',
        currentDice: [1, 1],
      },
      0
    );
    const onClick = vi.fn();
    const el = renderBoard(
      s.boards.player1,
      'player1',
      true,
      s,
      onClick,
      () => undefined,
      () => undefined
    );
    const cell = el.querySelector('.juggle-cell[data-row="4"][data-col="4"]') as HTMLElement;
    expect(cell.style.cursor).toBe('pointer');
    cell.click();
    expect(onClick).toHaveBeenCalledWith(4, 4);

    onClick.mockClear();
    cell.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(onClick).toHaveBeenCalledWith(4, 4);
  });
});
