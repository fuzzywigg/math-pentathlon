import { describe, it, expect } from 'vitest';
import {
  StarTrackGameState,
  StarTrackChain,
  Player,
  TRACK_LENGTH,
} from '../../src/games/star-track/types';
import { drawChains, selectChain, isGameOver } from '../../src/games/star-track/rules';

// Helper to create an initial state for Star Track
function createInitialStarTrackState(
  chainBucket: StarTrackChain[] = [],
  player1Position: number = 0,
  player2Position: number = 0,
  currentPlayer: Player = 'player1',
  phase: 'drawChains' | 'selectChain' | 'placeChain' | 'gameOver' = 'drawChains',
): StarTrackGameState {
  return {
    player1Position,
    player2Position,
    currentPlayer,
    chainBucket,
    drawnChains: null,
    selectedChain: null,
    selectedChainIndex: null,
    moveHistory: [],
    phase,
    winner: null,
  };
}

// Helper to create a state with an empty chain bucket
function createStateWithEmptyBucket(): StarTrackGameState {
  return createInitialStarTrackState([]);
}

// Helper to create a state with one chain in the bucket
function createStateWithOneChain(): StarTrackGameState {
  return createInitialStarTrackState([{ length: 3, value: '3' }]);
}

// Helper to create a state with two chains in the bucket
function createStateWithTwoChains(): StarTrackGameState {
  return createInitialStarTrackState([
    { length: 3, value: '3' },
    { length: 5, value: '5' },
  ]);
}

describe('StarTrack Rules', () => {
  describe('drawChains', () => {
    it('game ends when chain bucket is empty', () => {
      const state = createStateWithEmptyBucket();
      const result = drawChains(state);
      expect(result.phase).toBe('gameOver');
      expect(result.winner).toBeDefined();
    });

    it('single chain remaining auto-selects', () => {
      const state = createStateWithOneChain();
      const result = drawChains(state);
      expect(result.drawnChains).toHaveLength(1);
      expect(result.drawnChains![0]).toEqual({ length: 3, value: '3' });
      expect(result.selectedChainIndex).toBe(0);
      expect(result.phase).toBe('placeChain');
    });

    it('draws two distinct chains when two or more are available', () => {
      const state = createStateWithTwoChains();
      const result = drawChains(state);
      expect(result.drawnChains).toHaveLength(2);
      expect(result.drawnChains![0]).toEqual({ length: 5, value: '5' }); // pop() takes last
      expect(result.drawnChains![1]).toEqual({ length: 3, value: '3' }); // then next to last
      expect(result.chainBucket).toHaveLength(0);
      expect(result.phase).toBe('selectChain');
    });

    it('returns state unchanged if not in drawChains phase', () => {
      const state = createInitialStarTrackState([], 0, 0, 'player1', 'selectChain');
      const result = drawChains(state);
      expect(result).toEqual(state);
    });
  });

  describe('selectChain', () => {
    it('selects a chain and moves to placeChain phase', () => {
      const initialChain1 = { length: 3, value: '3' };
      const initialChain2 = { length: 5, value: '5' };
      const state = createInitialStarTrackState(
        [],
        0,
        0,
        'player1',
        'selectChain'
      );
      state.drawnChains = [initialChain1, initialChain2];

      const result = selectChain(state, 0); // Select first chain

      expect(result.selectedChain).toEqual(initialChain1);
      expect(result.drawnChains).toBeNull();
      expect(result.phase).toBe('drawChains');
      expect(result.chainBucket).toContainEqual(initialChain2); // Unused chain returned
    });

    it('moves player position and switches to opponent if not game over', () => {
      const initialChain1 = { length: 3, value: '3' };
      const initialChain2 = { length: 5, value: '5' };
      const state = createInitialStarTrackState(
        [],
        0,
        0,
        'player1',
        'selectChain'
      );
      state.drawnChains = [initialChain1, initialChain2];

      const result = selectChain(state, 0); // Select first chain

      expect(result.player1Position).toBe(initialChain1.length);
      expect(result.currentPlayer).toBe('player2');
      expect(result.phase).toBe('drawChains');
    });

    it('declares winner if player reaches or exceeds TRACK_LENGTH', () => {
      const winningChain = { length: TRACK_LENGTH, value: 'win' };
      const state = createInitialStarTrackState(
        [],
        0,
        0,
        'player1',
        'selectChain'
      );
      state.drawnChains = [winningChain, { length: 1, value: '1' }];

      const result = selectChain(state, 0);

      expect(result.player1Position).toBe(TRACK_LENGTH);
      expect(result.winner).toBe('player1');
      expect(result.phase).toBe('gameOver');
      expect(result.currentPlayer).toBe('player1'); // Winner remains current player
    });

    it('returns state unchanged if not in selectChain phase', () => {
      const state = createInitialStarTrackState([], 0, 0, 'player1', 'drawChains');
      const result = selectChain(state, 0);
      expect(result).toEqual(state);
    });
  });

  describe('isGameOver', () => {
    it('returns true if phase is gameOver', () => {
      const state = createInitialStarTrackState([], 0, 0, 'player1', 'gameOver');
      expect(isGameOver(state)).toBe(true);
    });

    it('returns true if winner is defined', () => {
      const state = createInitialStarTrackState([], 0, 0, 'player1', 'selectChain');
      state.winner = 'player1';
      expect(isGameOver(state)).toBe(true);
    });

    it('returns false otherwise', () => {
      const state = createInitialStarTrackState([], 0, 0, 'player1', 'drawChains');
      expect(isGameOver(state)).toBe(false);
    });
  });
});
