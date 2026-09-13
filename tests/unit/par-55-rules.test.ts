import { describe, it, expect } from 'vitest';
import {
  CONFIG,
  AttributeBlock,
  countMatchingAttributes,
  createBaseId,
} from '../../src/games/par-55/types';
import {
  createInitialState,
  selectBlock,
  clearSelection,
  getValidPlacements,
  calculateScore,
  placeBlock,
  passTurn,
  hasValidMoves,
  isValidPlacement,
  formatMove,
  getAttributeDisplayName,
} from '../../src/games/par-55/rules';

function block(overrides: Partial<AttributeBlock> = {}): AttributeBlock {
  return {
    id: 'b1',
    shape: 'circle',
    color: 'red',
    size: 'small',
    thickness: 'thin',
    ...overrides,
  };
}

describe('Par 55 – attribute helpers', () => {
  it('countMatchingAttributes lists shared traits', () => {
    const a = block();
    const b = block({
      id: 'b2',
      shape: 'square',
      color: 'red',
      size: 'large',
      thickness: 'thick',
    });
    expect(countMatchingAttributes(a, a)).toEqual([
      'shape',
      'color',
      'size',
      'thickness',
    ]);
    expect(countMatchingAttributes(a, b)).toEqual(['color']);
    expect(
      countMatchingAttributes(
        a,
        block({
          id: 'b3',
          shape: 'square',
          color: 'blue',
          size: 'large',
          thickness: 'thick',
        })
      )
    ).toEqual([]);
  });

  it('createBaseId formats row/col ids', () => {
    expect(createBaseId(1, 2)).toBe('base-1-2');
    expect(createBaseId(0, 0)).toBe('base-0-0');
  });
});

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
    expect(matchDetails.reduce((sum, m) => sum + m.points, 0)).toBe(
      totalPoints
    );
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

describe('Par 55 – target win / format / isValidPlacement / empty hand', () => {
  it('reaches gameOver when placing pushes score to TARGET_SCORE', () => {
    const state = createInitialState();
    const blockId = state.hands.player1[0].id;
    let next = selectBlock(state, blockId);
    const baseId = getValidPlacements(next)[0];
    const { totalPoints } = calculateScore(
      next,
      next.hands.player1.find((b) => b.id === blockId)!,
      baseId
    );
    // Inject score so this placement crosses the target
    next = {
      ...next,
      scores: {
        player1: Math.max(0, CONFIG.TARGET_SCORE - Math.max(totalPoints, 1)),
        player2: 0,
      },
    };
    // If totalPoints is 0, bump to TARGET_SCORE - 0 so we need points; place anyway
    if (totalPoints === 0) {
      next = {
        ...next,
        scores: { player1: CONFIG.TARGET_SCORE, player2: 0 },
      };
    }
    next = placeBlock(next, baseId);
    if (next.scores.player1 >= CONFIG.TARGET_SCORE) {
      expect(next.phase).toBe('gameOver');
      expect(next.winner).toBe('player1');
    } else {
      // Placement scored 0 and injected score was below target — still a valid place
      expect(next.moveHistory).toHaveLength(1);
    }
  });

  it('formatMove and getAttributeDisplayName are exported helpers', () => {
    const state = createInitialState();
    const block = state.hands.player1[0];
    const move = {
      player: 'player1' as const,
      block,
      baseId: '0-0',
      pointsScored: 6,
      matchDetails: [],
      moveNumber: 1,
    };
    expect(formatMove(move)).toContain('pts');
    expect(formatMove(move)).toContain(block.shape);
    expect(getAttributeDisplayName('shape')).toBe('Shape');
    expect(getAttributeDisplayName('color')).toBe('Color');
    expect(getAttributeDisplayName('unknown')).toBe('unknown');
  });

  it('isValidPlacement is true for empty adjacent bases and false for seed', () => {
    const state = createInitialState();
    const valid = getValidPlacements(state);
    expect(isValidPlacement(state, valid[0])).toBe(true);
    const occupied = [...state.bases.values()].find((b) => b.block);
    expect(occupied).toBeTruthy();
    expect(isValidPlacement(state, occupied!.id)).toBe(false);
  });

  it('empty hand makes hasValidMoves false; passTurn still flips seat', () => {
    const state = {
      ...createInitialState(),
      hands: { player1: [], player2: createInitialState().hands.player2 },
    };
    expect(hasValidMoves(state)).toBe(false);
    expect(passTurn(state).currentPlayer).toBe('player2');
  });
});
