/** Wave 42 — Star Track mid-race seat flip after non-winning select. Tests-only. */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  TRACK_LENGTH,
} from '../../src/games/star-track/types';
import { drawChains, selectChain } from '../../src/games/star-track/rules';

describe('Wave 42 Star Track — midrace seat flip', () => {
  it('player1 non-win select flips to player2 drawChains', () => {
    let state = drawChains(createInitialState());
    expect(state.currentPlayer).toBe('player1');
    state = selectChain(state, 0);
    expect(state.winner).toBeNull();
    expect(state.currentPlayer).toBe('player2');
    expect(state.phase).toBe('drawChains');
  });

  it('player2 midrace select flips back to player1', () => {
    let state = {
      ...createInitialState(),
      currentPlayer: 'player2' as const,
      player1Position: 3,
      player2Position: 2,
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 1 as const, id: 10 },
        { length: 2 as const, id: 11 },
      ],
    };
    state = selectChain(state, 0);
    expect(state.player2Position).toBe(3);
    expect(state.currentPlayer).toBe('player1');
    expect(state.phase).toBe('drawChains');
    expect(state.winner).toBeNull();
  });

  it('winning select does not flip seat', () => {
    let state = {
      ...createInitialState(),
      player1Position: TRACK_LENGTH - 2,
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 2 as const, id: 1 },
        { length: 1 as const, id: 2 },
      ],
    };
    state = selectChain(state, 0);
    expect(state.winner).toBe('player1');
    expect(state.currentPlayer).toBe('player1');
    expect(state.phase).toBe('gameOver');
  });

  it('two midrace turns alternate seats', () => {
    let state = drawChains(createInitialState());
    state = selectChain(state, 0);
    expect(state.currentPlayer).toBe('player2');
    state = drawChains(state);
    state = selectChain(state, 0);
    expect(state.currentPlayer).toBe('player1');
  });
});
