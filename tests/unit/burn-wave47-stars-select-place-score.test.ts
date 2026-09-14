/**
 * Wave 47 leftover after #214/#215 — Stars & Bars select/place/score leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  CONFIG,
  type AttributeCard,
  type StarsState,
} from '../../src/games/stars-bars/types';
import {
  createInitialState,
  selectCard,
  placeCard,
  clearSelection,
  getValidPlacements,
} from '../../src/games/stars-bars/rules';

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

describe('Wave 47 stars deepen 7 — Stars — select / clear / place', () => {
  it('opening deals HAND_SIZE and star corners/center', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    expect(state.playerHands.player1).toHaveLength(CONFIG.HAND_SIZE);
    expect(state.playerHands.player2).toHaveLength(CONFIG.HAND_SIZE);
    expect(state.phase).toBe('selectingCard');
    expect(state.cells[0][0].isStar).toBe(true);
    expect(state.cells[0][4].isStar).toBe(true);
    expect(state.cells[2][2].isStar).toBe(true);
    expect(state.cells[4][0].isStar).toBe(true);
    expect(state.cells[4][4].isStar).toBe(true);
    expect(state.cells[1][1].isStar).toBe(false);
  });

  it('selectCard unknown id / gameOver are identity; clear restores selecting', () => {
    const state = createInitialState();
    expect(selectCard(state, 'missing-card')).toBe(state);
    const over = { ...state, phase: 'gameOver' as const, winner: 'player1' as const };
    expect(selectCard(over, state.playerHands.player1[0].id)).toBe(over);
    let next = selectCard(state, state.playerHands.player1[0].id);
    expect(next.phase).toBe('placingCard');
    next = clearSelection(next);
    expect(next.selectedCard).toBeNull();
    expect(next.phase).toBe('selectingCard');
  });

  it('first place anywhere scores 0 and draws replacement when deck remains', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createInitialState();
    const deckBefore = state.deck.length;
    const handCard = state.playerHands.player1[0];
    state = selectCard(state, handCard.id);
    state = placeCard(state, 0, 0);
    expect(state.playerScores.player1).toBe(0);
    expect(state.moveHistory[0].breakdown).toBe('first card');
    expect(state.cells[0][0].owner).toBe('player1');
    expect(state.currentPlayer).toBe('player2');
    expect(state.playerHands.player1).toHaveLength(CONFIG.HAND_SIZE);
    expect(state.deck.length).toBe(deckBefore - 1);
    expect(state.lastMove).toEqual({ row: 0, col: 0 });
  });

  it('star placement doubles positive adjacency score', () => {
    const boardCard = card({ id: 'board' });
    const handCard = card({ id: 'hand', shape: 'square' }); // 1-way
    const base = createInitialState();
    const cells = base.cells.map((row) => row.map((c) => ({ ...c })));
    cells[0][1] = { ...cells[0][1], card: boardCard, owner: 'player2' };
    let state: StarsState = {
      ...base,
      cells,
      playerHands: { player1: [handCard], player2: [] },
      deck: [],
      phase: 'selectingCard',
      selectedCard: null,
      currentPlayer: 'player1',
    };
    state = selectCard(state, handCard.id);
    // (0,0) is star adjacent to (0,1)
    state = placeCard(state, 0, 0);
    expect(state.playerScores.player1).toBe(2);
    expect(state.moveHistory[0].breakdown).toContain('star');
  });

  it('TARGET_SCORE ends game for placer', () => {
    const handCard = card({ id: 'win' });
    const base = createInitialState();
    let state: StarsState = {
      ...base,
      playerHands: { player1: [handCard], player2: [card({ id: 'p2' })] },
      playerScores: { player1: CONFIG.TARGET_SCORE - 1, player2: 0 },
      deck: [],
      phase: 'selectingCard',
    };
    // Seed adjacent so score can accrue: place first on empty → 0 won't win.
    // Place on empty board first card scores 0 — force score via override after select.
    state = selectCard(state, handCard.id);
    // Put a neighbor with 1+ diffs then place on star for enough points
    const neighbor = card({
      id: 'n',
      shape: 'hexagon',
      color: 'blue',
      size: 'large',
      thickness: 'thick',
    });
    const cells = state.cells.map((row) => row.map((c) => ({ ...c })));
    cells[0][1] = { ...cells[0][1], card: neighbor, owner: 'player2' };
    state = { ...state, cells, playerScores: { player1: CONFIG.TARGET_SCORE - 1, player2: 0 } };
    // hand card differs in all 4 attrs → 4, star doubles → 8 ≥ remaining 1
    const next = placeCard(state, 0, 0);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.playerScores.player1).toBeGreaterThanOrEqual(CONFIG.TARGET_SCORE);
  });

  it('placeCard identity when not placing / occupied / non-adjacent', () => {
    let state = createInitialState();
    expect(placeCard(state, 0, 0)).toBe(state);
    const first = state.playerHands.player1[0];
    state = selectCard(state, first.id);
    state = placeCard(state, 2, 2);
    // P2 select
    const second = state.playerHands.player2[0];
    state = selectCard(state, second.id);
    const before = state;
    expect(placeCard(state, 2, 2)).toBe(before); // occupied
    expect(placeCard(state, 0, 0)).toBe(before); // not adjacent to center
    expect(getValidPlacements(state).some((p) => p.row === 1 && p.col === 1)).toBe(
      true
    );
  });
});
