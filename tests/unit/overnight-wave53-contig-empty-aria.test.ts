/**
 * Overnight HEAVY leftovers after #236 — Contig empty cell aria-label. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, BOARD_NUMBERS } from '../../src/games/contig-60/types';
import { renderBoard } from '../../src/games/contig-60/board-ui';

describe('Wave 53 contig — empty aria', () => {
  it('labels an unowned opening cell as empty', () => {
    const value = BOARD_NUMBERS[0]![0]!;
    const el = renderBoard(createInitialState(), () => undefined);
    expect(el.querySelector(`[data-value="${value}"]`)?.getAttribute('aria-label')).toBe(
      `${value}, empty`
    );
  });
});
