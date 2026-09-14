/**
 * Wave 58 leftover after #262 (retry #273 RED) — Ramrod slot aria Sum N slot K.
 * Distinct from wave56 data-col. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { renderBoard } from '../../src/games/ramrod/board-ui';

describe('Wave 58 ramrod — slot aria sum slot', () => {
  it('labels first slot of first box with Sum target slot 1', () => {
    const state = createInitialState();
    const board = renderBoard(state, () => undefined);
    const firstBox = board.querySelector('.ramrod-box')!;
    const target = state.boxes.get('box-0-0')!.targetSum;
    const slot0 = firstBox.querySelectorAll('.ramrod-slot')[0];
    expect(slot0.getAttribute('aria-label')).toMatch(
      new RegExp(`Sum ${target} slot 1`)
    );
  });
});
