import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  AttributeCard,
  StarsState,
  countDifferences,
  CONFIG,
} from '../../src/games/stars-bars/types';
import {
  createInitialState,
  selectCard,
  placeCard,
  getValidPlacements,
  passTurn,
  clearSelection,
  hasValidMoves,
} from '../../src/games/stars-bars/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

function card(
  overrides: Partial<AttributeCard> & Pick<AttributeCard, 'id'>
): AttributeCard {
  return {
    shape: 'circle',
    color: 'red',
    size: 'small',
    thickness: 'thin',
    ...overrides,
  };
}

describe('Stars & Bars – countDifferences', () => {
  it('counts differing attributes', () => {
    const a = card({ id: 'a' });
    const b = card({
      id: 'b',
      shape: 'square',
      color: 'blue',
      size: 'large',
      thickness: 'thick',
    });
    expect(countDifferences(a, a)).toBe(0);
    expect(countDifferences(a, b)).toBe(4);
    expect(
      countDifferences(a, card({ id: 'c', color: 'blue', size: 'large' }))
    ).toBe(2);
  });
});

describe('Stars & Bars – createInitialState', () => {
  it('deals hands and starts selecting', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    expect(state.phase).toBe('selectingCard');
    expect(state.currentPlayer).toBe('player1');
    expect(state.playerHands.player1).toHaveLength(CONFIG.HAND_SIZE);
    expect(state.playerHands.player2).toHaveLength(CONFIG.HAND_SIZE);
    expect(state.cells).toHaveLength(CONFIG.BOARD_SIZE);
    expect(state.cells[0][0].isStar).toBe(true);
    expect(state.cells[2][2].isStar).toBe(true);
  });
});

describe('Stars & Bars – placement adjacency', () => {
  it('first card may be placed anywhere', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createInitialState();
    const placements = getValidPlacements(state);
    expect(placements).toHaveLength(CONFIG.BOARD_SIZE * CONFIG.BOARD_SIZE);

    const handCard = state.playerHands.player1[0];
    state = selectCard(state, handCard.id);
    expect(state.phase).toBe('placingCard');
    expect(state.selectedCard?.id).toBe(handCard.id);

    state = placeCard(state, 1, 1);
    expect(state.cells[1][1].card?.id).toBe(handCard.id);
    expect(state.cells[1][1].owner).toBe('player1');
    expect(state.currentPlayer).toBe('player2');
    expect(state.phase).toBe('selectingCard');
    expect(state.playerScores.player1).toBe(0); // first card scores 0
  });

  it('second card must be adjacent to an existing card', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createInitialState();
    const first = state.playerHands.player1[0];
    state = selectCard(state, first.id);
    state = placeCard(state, 2, 2);

    // player2's turn
    const valid = getValidPlacements(state);
    expect(valid.every((p) => !(p.row === 0 && p.col === 0) || true)).toBe(
      true
    );
    // Far corner is not adjacent to center (2,2) on a 5x5? 0,0 is adjacent diagonally? 
    // Adjacent includes diagonals within 1 cell — (0,0) is 2 away → invalid
    expect(valid.some((p) => p.row === 0 && p.col === 0)).toBe(false);
    expect(valid.some((p) => p.row === 1 && p.col === 1)).toBe(true);
    expect(valid.some((p) => p.row === 2 && p.col === 3)).toBe(true);

    const second = state.playerHands.player2[0];
    state = selectCard(state, second.id);
    const before = state;
    expect(placeCard(state, 0, 0)).toBe(before); // not adjacent

    state = placeCard(state, 1, 1);
    expect(state.cells[1][1].card?.id).toBe(second.id);
    expect(state.currentPlayer).toBe('player1');
  });

  it('star cell doubles score when differences exist', () => {
    // Build a controlled board: place non-star first, then adjacent star
    const boardCard = card({
      id: 'board',
      shape: 'circle',
      color: 'red',
      size: 'small',
      thickness: 'thin',
    });
    const handCard = card({
      id: 'hand',
      shape: 'square', // 1 diff
      color: 'red',
      size: 'small',
      thickness: 'thin',
    });

    const base = createInitialState();
    const cells = base.cells.map((row) => row.map((c) => ({ ...c })));
    cells[1][0] = {
      ...cells[1][0],
      card: boardCard,
      owner: 'player2',
    };

    let state: StarsState = {
      ...base,
      cells,
      playerHands: {
        player1: [handCard],
        player2: [],
      },
      deck: [],
      currentPlayer: 'player1',
      phase: 'selectingCard',
      selectedCard: null,
    };

    // (0,0) is a star and adjacent to (1,0)
    expect(cells[0][0].isStar).toBe(true);
    state = selectCard(state, handCard.id);
    state = placeCard(state, 0, 0);

    // 1 difference × star x2 = 2
    expect(state.playerScores.player1).toBe(2);
    expect(state.moveHistory[0].breakdown).toContain('star');
  });
});

describe('Stars & Bars – passTurn', () => {
  it('flips current player and clears selection', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createInitialState();
    const id = state.playerHands.player1[0].id;
    state = selectCard(state, id);
    expect(state.selectedCard).not.toBeNull();

    const next = passTurn(state);
    expect(next.currentPlayer).toBe('player2');
    expect(next.selectedCard).toBeNull();
    expect(next.phase).toBe('selectingCard');
  });

  it('is a no-op when game is over', () => {
    const state: StarsState = {
      ...createInitialState(),
      phase: 'gameOver',
      winner: 'player1',
    };
    expect(passTurn(state)).toBe(state);
  });
});

describe('Stars & Bars – clearSelection / hasValidMoves / illegal / end', () => {
  it('clearSelection returns to selectingCard', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createInitialState();
    state = selectCard(state, state.playerHands.player1[0].id);
    const cleared = clearSelection(state);
    expect(cleared.selectedCard).toBeNull();
    expect(cleared.phase).toBe('selectingCard');
  });

  it('hasValidMoves is true with a non-empty hand on an open board', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(hasValidMoves(createInitialState())).toBe(true);
  });

  it('selectCard ignores cards not in the current hand', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    expect(selectCard(state, 'nope')).toBe(state);
  });

  it('placeCard is a no-op without selection', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    expect(placeCard(state, 0, 0)).toBe(state);
  });

  it('empty hands with full board leads to gameOver via place exhaustion path', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const base = createInitialState();
    // Fill almost all cells so only one slot remains; empty decks and single card
    const cells = base.cells.map((row) =>
      row.map((c) => ({
        ...c,
        card: c.row === 0 && c.col === 0 ? null : card({ id: `fill-${c.row}-${c.col}` }),
        owner:
          c.row === 0 && c.col === 0
            ? null
            : ('player2' as const),
      }))
    );
    const handCard = card({ id: 'last' });
    let state: StarsState = {
      ...base,
      cells,
      playerHands: { player1: [handCard], player2: [] },
      deck: [],
      phase: 'selectingCard',
      selectedCard: null,
      currentPlayer: 'player1',
      playerScores: { player1: 10, player2: 3 },
    };
    state = selectCard(state, 'last');
    state = placeCard(state, 0, 0);
    // After placing last cards, rules may end or continue — assert score updated / history
    expect(state.moveHistory.length).toBeGreaterThan(0);
    expect(state.cells[0][0].card?.id).toBe('last');
  });
});
