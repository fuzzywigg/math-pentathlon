/**
 * Wave 58 leftover after #262 (retry #273 RED) — Ramrod box Sum: N label exact.
 * Distinct from slot aria Sum N slot K. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { renderBoard } from '../../src/games/ramrod/board-ui';

describe('Wave 58 ramrod — sum label exact', () => {
  it('renders Sum: target on first box label', () => {
    const state = createInitialState();
    const board = renderBoard(state, () => undefined);
    const target = state.boxes.get('box-0-0')!.targetSum;
    expect(board.querySelector('.ramrod-box-label')?.textContent).toBe(
      `Sum: ${target}`
    );
  });
});
