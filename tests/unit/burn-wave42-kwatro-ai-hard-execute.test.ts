/**
 * Wave 42 — Kwatro-Sinko getAIMove hard and executeAITurn pass path. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState,
  passTurn,
  hasValidMoves,
} from '../../src/games/kwatro-sinko/rules';
import { getAIMove, executeAITurn } from '../../src/games/kwatro-sinko/ai';
import type { Chip, KwaState } from '../../src/games/kwatro-sinko/types';

function blockCurrentPlayer(state: KwaState): KwaState {
  const nodes = new Map(state.nodes);
  const chips = new Map(state.chips);
  let n = 0;
  for (const [id, node] of nodes) {
    if (!node.chip) {
      const chip: Chip = {
        id: `block-${n++}`,
        value: 0,
        owner: state.currentPlayer === 'player1' ? 'player2' : 'player1',
        position: id,
      };
      chips.set(chip.id, chip);
      nodes.set(id, { ...node, chip });
    }
  }
  return { ...state, nodes, chips };
}

describe('Wave 42 kwatro-sinko — AI hard execute', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('hard prefers top move when random is above threshold', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = passTurn(createInitialState());
    const move = getAIMove(state, 'player2', 'hard');

    expect(move).not.toBeNull();
    expect(move!.chipId.startsWith('p2-')).toBe(true);
  });

  it('executeAITurn applies select and move for AI on opening pass flip', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = passTurn(createInitialState());
    const after = executeAITurn(state, 'player2', 'hard');

    expect(after.currentPlayer).toBe('player1');
    expect(after.moveHistory.length).toBeGreaterThan(0);
    expect(after.phase).not.toBe('selectingDest');
  });

  it('executeAITurn passes when AI has no valid moves', () => {
    const blocked = blockCurrentPlayer(createInitialState());
    expect(hasValidMoves(blocked)).toBe(false);
    expect(getAIMove(blocked, 'player1', 'hard')).toBeNull();

    const after = executeAITurn(blocked, 'player1', 'hard');
    expect(after.currentPlayer).toBe('player2');
    expect(after.selectedChip).toBeNull();
    expect(after.phase).toBe('selectingChip');
    expect(after.moveHistory).toHaveLength(0);
  });

  it('executeAITurn pass path matches manual passTurn', () => {
    const blocked = blockCurrentPlayer(passTurn(createInitialState()));
    const viaAi = executeAITurn(blocked, 'player2', 'medium');
    const viaPass = passTurn(blocked);

    expect(viaAi.currentPlayer).toBe(viaPass.currentPlayer);
    expect(viaAi.phase).toBe(viaPass.phase);
  });
});
