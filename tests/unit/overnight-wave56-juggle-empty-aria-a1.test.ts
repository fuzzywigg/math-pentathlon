/**
 * Wave 56 leftover after #256 — Juggle empty-cell aria coord A1.
 * Distinct from wave55 occupied owner aria. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { renderBoard } from '../../src/games/juggle/board-ui';

describe('Wave 56 juggle — empty aria A1', () => {
  it('labels top-left empty cell with A1 coord while placing', () => {
    const s = createInitialState();
    const el = renderBoard(
      s.boards.player1,
      'player1',
      true,
      { ...s, phase: 'placing' },
      () => undefined,
      () => undefined,
      () => undefined
    );
    const cell = el.querySelector(
      '.juggle-cell[data-row="0"][data-col="0"]'
    );
    expect(cell?.getAttribute('aria-label')).toMatch(/A1/);
  });
});
