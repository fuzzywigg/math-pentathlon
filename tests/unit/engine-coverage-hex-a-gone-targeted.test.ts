/**
 * Targeted branch coverage for hex-a-gone/rules.ts —
 * hand-built / forged states only. Committed-while-selecting
 * gates and placeBlock remaining-selection edge. Engine code unchanged.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  type BlockShape,
  type HexAGoneGameState,
} from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  deselectBlock,
  placeBlock,
  getPhaseMessage,
  canPlayerMove,
  getValidPlacements,
} from '../../src/games/hex-a-gone/rules';

/** selectBlocks phase with committed=true — unreachable via public commitSelection. */
function forgedSelectCommitted(
  blocks: BlockShape[] = ['triangle']
): HexAGoneGameState {
  const base = createInitialState();
  return {
    ...base,
    phase: 'selectBlocks',
    turnSelection: { blocks, committed: true },
    selectedBlockForPlacement: blocks[0] ?? null,
  };
}

describe('Hex-a-Gone targeted — committed-while-selecting gates', () => {
  it('selectBlock is identity when committed in selectBlocks phase', () => {
    const state = forgedSelectCommitted(['hexagon']);
    expect(state.phase).toBe('selectBlocks');
    expect(state.turnSelection.committed).toBe(true);
    expect(selectBlock(state, 'triangle')).toBe(state);
    expect(selectBlock(state, 'hexagon')).toBe(state);
  });

  it('deselectBlock is identity when committed in selectBlocks phase', () => {
    const state = forgedSelectCommitted(['rhombus', 'square']);
    expect(deselectBlock(state, 'rhombus')).toBe(state);
    expect(deselectBlock(state, 'triangle')).toBe(state);
  });
});

describe('Hex-a-Gone targeted — placeBlock remaining selection edge', () => {
  it('placeBlock falls back when remaining selection head is falsy', () => {
    const opening = createInitialState();
    const empty = '' as unknown as BlockShape;
    const state: HexAGoneGameState = {
      ...opening,
      phase: 'placeBlocks',
      turnSelection: {
        blocks: ['triangle', empty],
        committed: true,
      },
      selectedBlockForPlacement: 'triangle',
    };

    const next = placeBlock(state, 0, 0);
    expect(next.phase).toBe('placeBlocks');
    expect(next.turnSelection.blocks).toEqual([empty]);
    // remainingBlocks[0] is falsy → selectedBlockForPlacement becomes null
    expect(next.selectedBlockForPlacement).toBeNull();
    expect(next.bank.triangle).toBe(opening.bank.triangle - 1);
  });

  it('getValidPlacements empty when no selected block; canPlayerMove false on full board', () => {
    const opening = createInitialState();
    expect(getValidPlacements(opening)).toEqual([]);

    const full: HexAGoneGameState = {
      ...opening,
      board: opening.board.map((c) => ({
        ...c,
        filled: true,
        filledBy: 'player1' as const,
        blockId: 1,
      })),
      bank: { ...opening.bank, triangle: 1 },
    };
    expect(canPlayerMove(full)).toBe(false);
    expect(getPhaseMessage(full)).toContain("Blue's turn");
  });
});
