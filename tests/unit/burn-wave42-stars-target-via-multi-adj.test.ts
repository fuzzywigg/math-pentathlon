/**
 * Wave 42 leftovers D — stars target via multi-adj. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  CONFIG,
  countDifferences,
  type AttributeCard,
  type StarsState,
} from '../../src/games/stars-bars/types';
import {
  createInitialState,
  placeCard,
} from '../../src/games/stars-bars/rules';

function card(partial: Partial<AttributeCard> & { id: string }): AttributeCard {
  return {
    shape: 'circle',
    color: 'red',
    size: 'small',
    thickness: 'thin',
    ...partial,
  };
}

describe('Wave 42 stars — target via multi-adj', () => {
  it('multi-adj place that crosses TARGET_SCORE ends game', () => {
    const n22 = card({
      id: 'n22',
      shape: 'hexagon',
      color: 'blue',
      size: 'large',
      thickness: 'thick',
    });
    const n23 = card({
      id: 'n23',
      shape: 'triangle',
      color: 'yellow',
      size: 'large',
      thickness: 'thick',
    });
    const n32 = card({
      id: 'n32',
      shape: 'rectangle',
      color: 'blue',
      size: 'large',
      thickness: 'thick',
    });
    const place = card({ id: 'place' });

    const gained =
      countDifferences(place, n22) +
      countDifferences(place, n23) +
      countDifferences(place, n32);
    expect(gained).toBeGreaterThan(0);

    const base = createInitialState();
    const cells = base.cells.map((row) => row.map((c) => ({ ...c })));
    cells[2][2] = { ...cells[2][2], card: n22, owner: 'player2' };
    cells[2][3] = { ...cells[2][3], card: n23, owner: 'player2' };
    cells[3][2] = { ...cells[3][2], card: n32, owner: 'player2' };

    const near = CONFIG.TARGET_SCORE - Math.min(gained, CONFIG.TARGET_SCORE);
    const state: StarsState = {
      ...base,
      cells,
      playerHands: { player1: [place], player2: [card({ id: 'p2' })] },
      deck: [],
      currentPlayer: 'player1',
      selectedCard: place,
      phase: 'placingCard',
      playerScores: { player1: near, player2: 0 },
    };

    const next = placeCard(state, 3, 3);
    expect(next.playerScores.player1).toBeGreaterThanOrEqual(CONFIG.TARGET_SCORE);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });
});
