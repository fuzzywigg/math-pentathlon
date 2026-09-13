import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectBlock,
  clearSelection,
  getValidPlacements,
  calculateScore,
  placeBlock,
  passTurn,
  hasValidMoves,
} from '../../src/games/par-55/rules';

describe('Par 55 – selectBlock / placeBlock', () => {
  it('selectBlock moves into placing phase for a hand block', () => {
    const state = createInitialState();
    const blockId = state.hands.player1[0].id;
    const next = selectBlock(state, blockId);
    expect(next.selectedBlock).toBe(blockId);
    expect(next.phase).toBe('placingBlock');
  });

  it('selectBlock ignores unknown ids', () => {
    const state = createInitialState();
    expect(selectBlock(state, 'missing')).toBe(state);
  });

  it('clearSelection returns to selectingBlock', () => {
    const state = createInitialState();
    const selected = selectBlock(state, state.hands.player1[0].id);
    const cleared = clearSelection(selected);
    expect(cleared.selectedBlock).toBeNull();
    expect(cleared.phase).toBe('selectingBlock');
  });

  it('placeBlock occupies a valid base and advances the turn', () => {
    const state = createInitialState();
    const blockId = state.hands.player1[0].id;
    let next = selectBlock(state, blockId);
    const placements = getValidPlacements(next);
    expect(placements.length).toBeGreaterThan(0);

    next = placeBlock(next, placements[0]);
    expect(next.bases.get(placements[0])?.block?.id).toBe(blockId);
    expect(next.hands.player1.some((b) => b.id === blockId)).toBe(false);
    expect(next.moveHistory).toHaveLength(1);
    expect(next.selectedBlock).toBeNull();
    if (next.phase !== 'gameOver') {
      expect(next.currentPlayer).toBe('player2');
      expect(next.phase).toBe('selectingBlock');
    }
  });

  it('placeBlock is a no-op without selection or on invalid base', () => {
    const state = createInitialState();
    expect(placeBlock(state, '0-0')).toBe(state);

    const selected = selectBlock(state, state.hands.player1[0].id);
    // Find an occupied base (center seed) — invalid target
    const occupied = [...selected.bases.values()].find((b) => b.block);
    expect(occupied).toBeTruthy();
    expect(placeBlock(selected, occupied!.id)).toBe(selected);
  });
});

describe('Par 55 – getValidPlacements / calculateScore / passTurn', () => {
  it('getValidPlacements lists empty bases adjacent to the seed', () => {
    const state = createInitialState();
    const valid = getValidPlacements(state);
    expect(valid.length).toBeGreaterThan(0);
    for (const id of valid) {
      expect(state.bases.get(id)?.block).toBeNull();
    }
  });

  it('calculateScore returns attribute match points vs neighbors', () => {
    const state = createInitialState();
    const block = state.hands.player1[0];
    const target = getValidPlacements(state)[0];
    const { totalPoints, matchDetails } = calculateScore(state, block, target);
    expect(totalPoints).toBeGreaterThanOrEqual(0);
    expect(matchDetails.every((m) => m.points > 0)).toBe(true);
    expect(
      matchDetails.reduce((sum, m) => sum + m.points, 0)
    ).toBe(totalPoints);
  });

  it('passTurn flips the current player', () => {
    const state = createInitialState();
    const next = passTurn(state);
    expect(next.currentPlayer).toBe('player2');
    expect(next.selectedBlock).toBeNull();
    expect(next.phase).toBe('selectingBlock');
  });

  it('hasValidMoves is true on a fresh board with a hand', () => {
    expect(hasValidMoves(createInitialState())).toBe(true);
  });
});
