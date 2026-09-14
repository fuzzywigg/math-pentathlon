/**
 * Wave 42 leftovers D — stars AI winning preference. Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  CONFIG,
  countDifferences,
  type AttributeCard,
  type StarsState,
} from '../../src/games/stars-bars/types';
import { createInitialState } from '../../src/games/stars-bars/rules';
import { getAIMove } from '../../src/games/stars-bars/ai';

afterEach(() => vi.restoreAllMocks());

function card(partial: Partial<AttributeCard> & { id: string }): AttributeCard {
  return {
    shape: 'circle',
    color: 'red',
    size: 'small',
    thickness: 'thin',
    ...partial,
  };
}

describe('Wave 42 stars — AI winning preference', () => {
  it('near TARGET_SCORE, hard AI with Math.random=0 picks finishing move', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const neighbor = card({
      id: 'n',
      shape: 'hexagon',
      color: 'blue',
      size: 'large',
      thickness: 'thick',
    });
    const finish = card({ id: 'finish' }); // 4 diffs vs neighbor
    const noise = card({ id: 'noise', shape: 'square' }); // 1 vs neighbor

    const finishPts = countDifferences(finish, neighbor);
    // star (0,0) doubles → enough to win from TARGET-1 if finishPts*2 >= 1
    expect(finishPts * 2).toBeGreaterThanOrEqual(1);

    const base = createInitialState();
    const cells = base.cells.map((row) => row.map((c) => ({ ...c })));
    cells[0][1] = { ...cells[0][1], card: neighbor, owner: 'player2' };

    const state: StarsState = {
      ...base,
      cells,
      playerHands: {
        player1: [finish, noise],
        player2: [card({ id: 'p2' })],
      },
      deck: [],
      currentPlayer: 'player1',
      selectedCard: null,
      phase: 'selectingCard',
      playerScores: { player1: CONFIG.TARGET_SCORE - 1, player2: 0 },
    };

    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(move!.cardId).toBe('finish');
    expect(move!.row).toBe(0);
    expect(move!.col).toBe(0);
  });
});
