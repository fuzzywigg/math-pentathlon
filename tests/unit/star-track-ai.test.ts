import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  StarTrackGameState,
  ChainLink,
  TRACK_LENGTH,
  createInitialState,
} from '../../src/games/star-track/types';
import {
  getAIChainChoice,
  executeAITurn,
  isAITurn,
} from '../../src/games/star-track/ai';
import { drawChains } from '../../src/games/star-track/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

function chain(id: number, length: 1 | 2 | 3 | 4 | 5 | 6): ChainLink {
  return { id, length };
}

function selectState(
  drawn: [ChainLink, ChainLink],
  overrides: Partial<StarTrackGameState> = {}
): StarTrackGameState {
  return {
    ...createInitialState(),
    phase: 'selectChain',
    drawnChains: drawn,
    chainBucket: [chain(99, 1), chain(98, 2)],
    ...overrides,
  };
}

describe('Star Track AI', () => {
  it('isAITurn requires human-vs-ai and AI seat', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player2', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
    expect(
      isAITurn(
        { ...state, currentPlayer: 'player2' },
        'player2',
        'human-vs-ai'
      )
    ).toBe(true);
    expect(
      isAITurn(
        { ...state, phase: 'gameOver', winner: 'player1' },
        'player2',
        'human-vs-ai'
      )
    ).toBe(false);
  });

  it('getAIChainChoice returns null outside selectChain / wrong seat', () => {
    const state = createInitialState();
    expect(getAIChainChoice(state, 'player1')).toBeNull();

    const selecting = selectState([chain(1, 2), chain(2, 5)], {
      currentPlayer: 'player2',
    });
    expect(getAIChainChoice(selecting, 'player1')).toBeNull();
  });

  it('hard prefers the winning chain when one reaches the goal', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99); // no random branch
    const state = selectState([chain(1, 2), chain(2, 5)], {
      player1Position: TRACK_LENGTH - 4, // needs 4; chain 5 wins, chain 2 does not
      currentPlayer: 'player1',
    });

    const choice = getAIChainChoice(state, 'player1', 'hard');
    expect(choice?.chainIndex).toBe(1);
  });

  it('hard prefers exact finish over overshoot when both win', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = selectState([chain(1, 3), chain(2, 6)], {
      player1Position: TRACK_LENGTH - 3, // needs exactly 3
      currentPlayer: 'player1',
    });

    const choice = getAIChainChoice(state, 'player1', 'hard');
    expect(choice?.chainIndex).toBe(0);
  });

  it('still returns a legal index when opponent is near the goal', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = selectState([chain(1, 3), chain(2, 4)], {
      player2Position: 0,
      player1Position: TRACK_LENGTH - 3,
      currentPlayer: 'player2',
    });

    const choice = getAIChainChoice(state, 'player2', 'hard');
    expect(choice).not.toBeNull();
    expect([0, 1]).toContain(choice!.chainIndex);
  });

  it('executeAITurn draws and selects for AI player', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const bucket = [chain(1, 2), chain(2, 6), chain(3, 4), chain(4, 1)];
    const state: StarTrackGameState = {
      ...createInitialState(),
      currentPlayer: 'player2',
      phase: 'drawChains',
      chainBucket: bucket,
    };

    const next = executeAITurn(state, 'player2', 'hard');
    expect(next.moveHistory).toHaveLength(1);
    expect(next.moveHistory[0].player).toBe('player2');
    expect(next.currentPlayer).toBe('player1');
    expect(next.phase).toBe('drawChains');
    expect(next.player2Position).toBeGreaterThan(0);
  });

  it('executeAITurn can finish the race', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    let state: StarTrackGameState = {
      ...createInitialState(),
      currentPlayer: 'player1',
      phase: 'drawChains',
      player1Position: TRACK_LENGTH - 2,
      chainBucket: [chain(1, 5), chain(2, 1), chain(3, 3)],
    };

    state = executeAITurn(state, 'player1', 'hard');
    expect(state.phase).toBe('gameOver');
    expect(state.winner).toBe('player1');
    expect(state.player1Position).toBe(TRACK_LENGTH);
  });

  it('medium may randomize among choices', () => {
    // Force randomness branch: Math.random < 0.15 for medium
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const state = selectState([chain(1, 2), chain(2, 3)], {
      currentPlayer: 'player1',
    });
    const choice = getAIChainChoice(state, 'player1', 'medium');
    expect(choice).not.toBeNull();
    expect([0, 1]).toContain(choice!.chainIndex);
    expect(spy).toHaveBeenCalled();
  });

  it('drawChains helper still feeds AI path', () => {
    const state = {
      ...createInitialState(),
      // pop order: last element first → drawnChains[0]=len5, [1]=len4
      chainBucket: [chain(1, 4), chain(2, 5)],
      currentPlayer: 'player2' as const,
    };
    const drawn = drawChains(state);
    expect(drawn.phase).toBe('selectChain');
    expect(drawn.drawnChains![0].length).toBe(5);
    expect(drawn.drawnChains![1].length).toBe(4);
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const choice = getAIChainChoice(drawn, 'player2', 'hard');
    expect(choice?.chainIndex).toBe(0); // longer chain 5
  });
});
