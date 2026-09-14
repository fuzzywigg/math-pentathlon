/**
 * Wave 42 — FIAR placeChip seat flip and history length. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { placeChip } from '../../src/games/fiar/rules';
import { createInitialState } from '../../src/games/fiar/types';

describe('Wave 42 fiar — place alternate history', () => {
  it('placeChip alternates currentPlayer each successful place', () => {
    let state = createInitialState();
    expect(state.currentPlayer).toBe('player1');
    state = placeChip(state, '0-0');
    expect(state.currentPlayer).toBe('player2');
    expect(state.board.nodes.get('0-0')?.chip).toBe('player1');
    state = placeChip(state, '1-1');
    expect(state.currentPlayer).toBe('player1');
    expect(state.board.nodes.get('1-1')?.chip).toBe('player2');
  });

  it('moveHistory grows by one place entry per chip', () => {
    let state = createInitialState();
    state = placeChip(state, '0-0');
    expect(state.moveHistory).toHaveLength(1);
    expect(state.moveHistory[0]).toMatchObject({
      type: 'place',
      nodeId: '0-0',
      player: 'player1',
      moveNumber: 1,
    });
    state = placeChip(state, '4-4');
    expect(state.moveHistory).toHaveLength(2);
    expect(state.moveHistory[1].moveNumber).toBe(2);
    expect(state.moveHistory[1].player).toBe('player2');
  });

  it('history length equals number of placed chips after three places', () => {
    let state = createInitialState();
    for (const id of ['0-0', '0-1', '0-2']) {
      state = placeChip(state, id);
    }
    expect(state.moveHistory).toHaveLength(3);
    expect(state.moveHistory.every((m) => m.type === 'place')).toBe(true);
  });
});
