/** Wave 42 — Par 55 hard AI prefers TARGET-winning place. Tests-only. */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState,
  getValidPlacements,
  calculateScore,
} from '../../src/games/par-55/rules';
import { getAIMove } from '../../src/games/par-55/ai';
import {
  CONFIG,
  createBaseId,
  type AttributeBlock,
  type Par55State,
} from '../../src/games/par-55/types';

afterEach(() => vi.restoreAllMocks());

function forgeNearWin(): Par55State {
  const open = createInitialState();
  const centerId = createBaseId(2, 3);
  const centerBlock = open.bases.get(centerId)!.block!;

  const winning: AttributeBlock = { ...centerBlock, id: 'win-block' };
  const losing: AttributeBlock = {
    id: 'lose-block',
    shape: centerBlock.shape === 'circle' ? 'square' : 'circle',
    color: centerBlock.color === 'red' ? 'blue' : 'red',
    size: centerBlock.size === 'small' ? 'large' : 'small',
    thickness: centerBlock.thickness === 'thin' ? 'thick' : 'thin',
  };

  return {
    ...open,
    scores: { player1: CONFIG.TARGET_SCORE - 1, player2: 0 },
    hands: {
      player1: [winning, losing],
      player2: open.hands.player2,
    },
    currentPlayer: 'player1',
    phase: 'selectingBlock',
    selectedBlock: null,
  };
}

describe('Wave 42 par55 — AI winning prefer', () => {
  it('hard AI near TARGET picks a move that reaches TARGET', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = forgeNearWin();
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    const block = state.hands.player1.find((b) => b.id === move!.blockId)!;
    const points = calculateScore(state, block, move!.baseId).totalPoints;
    expect(state.scores.player1 + points).toBeGreaterThanOrEqual(
      CONFIG.TARGET_SCORE
    );
  });

  it('winning block scores more than zero-match block on same board', () => {
    const state = forgeNearWin();
    const win = state.hands.player1[0];
    const lose = state.hands.player1[1];
    const baseId = getValidPlacements(state)[0];
    expect(calculateScore(state, win, baseId).totalPoints).toBeGreaterThan(
      calculateScore(state, lose, baseId).totalPoints
    );
  });

  it('hard prefers win-block id over lose-block when randomness off', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = forgeNearWin();
    const move = getAIMove(state, 'player1', 'hard');
    expect(move?.blockId).toBe('win-block');
  });

  it('medium also prefers winning placement with randomness suppressed', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = forgeNearWin();
    const move = getAIMove(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    const block = state.hands.player1.find((b) => b.id === move!.blockId)!;
    expect(
      state.scores.player1 +
        calculateScore(state, block, move!.baseId).totalPoints
    ).toBeGreaterThanOrEqual(CONFIG.TARGET_SCORE);
  });
});
