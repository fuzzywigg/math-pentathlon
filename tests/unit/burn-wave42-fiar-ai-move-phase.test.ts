/**
 * Wave 42 — FIAR AI movement phase after full placement. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAIMove, applyAIMove } from '../../src/games/fiar/ai';
import {
  placeChip,
  getValidMoves,
  getSelectableNodes,
} from '../../src/games/fiar/rules';
import {
  createInitialState,
  CONFIG,
  type FiarGameState,
} from '../../src/games/fiar/types';

function fillPlacement(): FiarGameState {
  let s = createInitialState();
  const nodes = ['0-0', '0-1', '0-2', '0-3', '4-0', '4-1', '4-2', '4-3'];
  for (const id of nodes) s = placeChip(s, id);
  expect(s.phase).toBe('movement');
  expect(s.chipsPlaced.player1).toBe(CONFIG.CHIPS_PER_PLAYER);
  return s;
}

describe('Wave 42 fiar — AI movement', () => {
  it('movement AI easy returns from/to among valid moves', () => {
    const state = fillPlacement();
    const move = getAIMove(state, state.currentPlayer, 'easy');
    expect(move).not.toBeNull();
    expect(move!.type).toBe('move');
    expect(move!.from).toBeTruthy();
    expect(move!.to).toBeTruthy();
    const valids = getValidMoves(state, move!.from!);
    expect(valids).toContain(move!.to!);
  }, 15000);

  it('applyAIMove move clears origin and occupies dest', () => {
    const state = fillPlacement();
    const move = getAIMove(state, state.currentPlayer, 'easy')!;
    const next = applyAIMove(state, move);
    expect(next.board.nodes.get(move.from!)!.chip).toBeNull();
    expect(next.board.nodes.get(move.to!)!.chip).toBe(state.currentPlayer);
    expect(next.selectedNode).toBeNull();
  }, 15000);

  it('selectable nodes nonempty after placement', () => {
    const state = fillPlacement();
    expect(getSelectableNodes(state).length).toBeGreaterThan(0);
  });
});
