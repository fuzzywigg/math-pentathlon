/**
 * Wave 56 leftover after #256 — Juggle empty cell aria coord A1.
 * Distinct from wave55 occupied aria owner. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { renderBoard } from '../../src/games/juggle/board-ui';

describe('Wave 56 juggle — empty cell aria coord', () => {
  it('labels opening A1 empty without owner', () => {
    const el = renderBoard(
      createInitialState().boards.player1,
      'player1',
      true,
      createInitialState(),
      () => undefined,
      () => undefined,
      () => undefined
    );
    const cell = el.querySelector(
      '.juggle-cell[data-row="0"][data-col="0"]'
    ) as HTMLElement;
    const label = cell.getAttribute('aria-label') ?? '';
    expect(label).toMatch(/^A1/);
    expect(label).toMatch(/empty/i);
    expect(label).not.toMatch(/Blue|Red/);
  });
});
