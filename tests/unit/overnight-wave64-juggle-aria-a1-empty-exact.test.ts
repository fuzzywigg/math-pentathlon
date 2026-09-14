/**
 * Wave 64 leftover after tip/#301 + open #303 wave63 — Juggle empty A1 aria exact.
 * Soft /A1/ in wave56. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { renderBoard } from '../../src/games/juggle/board-ui';

describe('Wave 64 juggle — empty A1 aria exact', () => {
  it('locks A1, empty on top-left cell', () => {
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
    expect(
      el
        .querySelector('.juggle-cell[data-row="0"][data-col="0"]')
        ?.getAttribute('aria-label')
    ).toBe('A1, empty');
  });
});
