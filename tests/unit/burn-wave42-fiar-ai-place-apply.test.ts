/**
 * Wave 42 — FIAR AI placement + applyAIMove (leftover; not in #187 engines).
 * Distinct from wave41 place/paths matrices. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAIMove, applyAIMove } from '../../src/games/fiar/ai';
import { placeChip, canPlaceChip } from '../../src/games/fiar/rules';
import { createInitialState, CONFIG } from '../../src/games/fiar/types';

describe('Wave 42 fiar — AI place + apply', () => {
  it('easy returns place move on opening', () => {
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(move!.type).toBe('place');
    expect(move!.nodeId).toBeTruthy();
    expect(canPlaceChip(state, move!.nodeId!)).toBe(true);
  });

  it('applyAIMove place advances chipsPlaced and flips seat', () => {
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy')!;
    const next = applyAIMove(state, move);
    expect(next).not.toBe(state);
    expect(next.chipsPlaced.player1).toBe(1);
    expect(next.currentPlayer).toBe('player2');
    expect(next.board.nodes.get(move.nodeId!)!.chip).toBe('player1');
  });

  it('applyAIMove incomplete place/move identities', () => {
    const state = createInitialState();
    expect(applyAIMove(state, { type: 'place' })).toBe(state);
    expect(applyAIMove(state, { type: 'move', from: '0-0' })).toBe(state);
  });

  it('gameOver phase yields null AI move', () => {
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(getAIMove(state, 'player1', 'easy')).toBeNull();
  });

  it('human place then AI place keeps total ≤ chips*2', () => {
    let state = createInitialState();
    state = placeChip(state, '2-2');
    const ai = getAIMove(state, 'player2', 'easy')!;
    state = applyAIMove(state, ai);
    expect(state.chipsPlaced.player1 + state.chipsPlaced.player2).toBe(2);
    expect(state.chipsPlaced.player1).toBeLessThanOrEqual(
      CONFIG.CHIPS_PER_PLAYER
    );
  });
});
