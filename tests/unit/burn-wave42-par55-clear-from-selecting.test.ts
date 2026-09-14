/** Wave 42 — Par 55 clearSelection edges from selecting/placing/over. Tests-only. */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectBlock,
  clearSelection,
} from '../../src/games/par-55/rules';

describe('Wave 42 par55 — clearSelection edges', () => {
  it('clear from placingBlock resets selected and phase', () => {
    let state = createInitialState();
    state = selectBlock(state, state.hands.player1[0].id);
    expect(state.phase).toBe('placingBlock');
    const cleared = clearSelection(state);
    expect(cleared.selectedBlock).toBeNull();
    expect(cleared.phase).toBe('selectingBlock');
  });

  it('clear when already selectingBlock with null selected stays selecting', () => {
    const state = createInitialState();
    expect(state.phase).toBe('selectingBlock');
    expect(state.selectedBlock).toBeNull();
    const cleared = clearSelection(state);
    expect(cleared.selectedBlock).toBeNull();
    expect(cleared.phase).toBe('selectingBlock');
    expect(cleared.hands).toEqual(state.hands);
    expect(cleared.scores).toEqual(state.scores);
  });

  it('clear from gameOver forces selectingBlock phase', () => {
    const over = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player2' as const,
      selectedBlock: 'stale-id',
    };
    const cleared = clearSelection(over);
    expect(cleared.phase).toBe('selectingBlock');
    expect(cleared.selectedBlock).toBeNull();
    expect(cleared.winner).toBe('player2');
  });

  it('clear does not mutate hand contents or scores', () => {
    let state = createInitialState();
    const handSnapshot = state.hands.player1.map((b) => b.id);
    const scoreSnapshot = { ...state.scores };
    state = selectBlock(state, state.hands.player1[0].id);
    const cleared = clearSelection(state);
    expect(cleared.hands.player1.map((b) => b.id)).toEqual(handSnapshot);
    expect(cleared.scores).toEqual(scoreSnapshot);
  });

  it('clear returns a new object (not same reference)', () => {
    const state = createInitialState();
    const cleared = clearSelection(state);
    expect(cleared).not.toBe(state);
  });
});
