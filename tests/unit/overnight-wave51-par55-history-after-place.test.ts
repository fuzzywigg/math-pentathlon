/**
 * Overnight HEAVY leftovers after #234 — Par55 history entry after place. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectBlock,
  placeBlock,
  getValidPlacements,
} from '../../src/games/par-55/rules';
import { renderMoveHistory } from '../../src/games/par-55/board-ui';

describe('Wave 51 par55 — history after place', () => {
  it('renders one history move with player class after place', () => {
    let state = createInitialState();
    state = selectBlock(state, state.hands.player1[0]!.id);
    const target = getValidPlacements(state)[0]!;
    state = placeBlock(state, target);
    const el = renderMoveHistory(state);
    expect(el.querySelectorAll('.par55-history-move').length).toBe(1);
    expect(el.querySelector('.par55-history-move.player1')).toBeTruthy();
  });
});
