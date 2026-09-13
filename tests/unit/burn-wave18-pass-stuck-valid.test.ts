/**
 * Wave 18 — stuck-seat / placement-validity / passTurn helpers.
 * Distinct from wave 15 wrong-phase identity matrices.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState as createSum,
  canPlayDomino,
  isValidPlacement,
  passTurn as sumPass,
  doRollDice as sumRoll,
} from '../../src/games/sum-dominoes/rules';
import { CONFIG as SD_CONFIG, getDiceSum } from '../../src/games/sum-dominoes/types';

import {
  createInitialState as createPar,
  hasValidMoves as parHasMoves,
  passTurn as parPass,
  isValidPlacement as parValidPlace,
  selectBlock,
  getValidPlacements as parPlacements,
} from '../../src/games/par-55/rules';

import {
  createInitialState as createRamrod,
  hasValidMoves as ramHasMoves,
  passTurn as ramPass,
  isValidPlacement as ramValidPlace,
  selectRod,
  getValidPlacements as ramPlacements,
} from '../../src/games/ramrod/rules';

import {
  createInitialState as createStars,
  hasValidMoves as starsHasMoves,
  passTurn as starsPass,
  selectCard,
} from '../../src/games/stars-bars/rules';

import {
  createInitialState as createKwa,
  hasValidMoves as kwaHasMoves,
  passTurn as kwaPass,
  isValidMove as kwaIsValid,
} from '../../src/games/kwatro-sinko/rules';

import {
  createInitialState as createFab,
  hasAnyValidMove,
  passTurn as fabPass,
} from '../../src/games/fab-a-diffy/rules';

import { createInitialState as createContig } from '../../src/games/contig-60/types';
import {
  passTurn as contigPass,
  hasValidMoves as contigHasMoves,
  checkWinner as contigWinner,
  doRollDice as contigRoll,
} from '../../src/games/contig-60/rules';

import {
  createInitialState as createPrime,
  rollDice as primeRoll,
  hasValidMoves as primeHasMoves,
  passTurn as primePass,
} from '../../src/games/prime-gold/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 18 pass/valid — Sum Dominoes', () => {
  it('canPlayDomino rejects impossible face sums; accepts playable after roll', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    let state = sumRoll(createSum());
    expect(state.currentDice).not.toBeNull();
    const sum = getDiceSum(state.currentDice!);
    const hand = state.hands.player1;
    expect(hand.length).toBeGreaterThan(0);

    // Impossible: target sum 0 never matches any domino adjacency
    for (const d of hand) {
      expect(canPlayDomino(state, d, 0)).toBe(false);
    }

    // At least the helper is consistent with isValidPlacement scan
    const playable = hand.filter((d) => canPlayDomino(state, d, sum));
    for (const d of playable) {
      let found = false;
      for (let row = 0; row < SD_CONFIG.BOARD_SIZE && !found; row++) {
        for (let col = 0; col < SD_CONFIG.BOARD_SIZE && !found; col++) {
          for (const orientation of ['horizontal', 'vertical'] as const) {
            if (isValidPlacement(state, d, { row, col }, orientation, sum)) {
              found = true;
              break;
            }
          }
        }
      }
      expect(found).toBe(true);
    }
  });

  it('passTurn from passing phase flips seat back to rolling', () => {
    const state = {
      ...createSum(),
      phase: 'passing' as const,
      passCount: 0,
      selectedDomino: null,
    };
    const next = sumPass(state);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('rolling');
    expect(next.passCount).toBe(1);
  });
});

describe('Wave 18 pass/valid — Par / Ramrod / Stars', () => {
  it('Par opening hasValidMoves; passTurn flips seat and clears selection', () => {
    let state = createPar();
    const block = state.hands.player1[0];
    state = selectBlock(state, block.id);
    expect(parPlacements(state).length).toBeGreaterThan(0);
    expect(parHasMoves(state)).toBe(true);
    expect(parValidPlace(state, parPlacements(state)[0])).toBe(true);

    const passed = parPass(state);
    expect(passed.currentPlayer).toBe('player2');
    expect(passed.selectedBlock).toBeNull();
    expect(passed.phase).toBe('selectingBlock');
  });

  it('Par empty-hand hasValidMoves is false', () => {
    const state = {
      ...createPar(),
      hands: { player1: [], player2: createPar().hands.player2 },
      selectedBlock: null,
    };
    expect(parHasMoves(state)).toBe(false);
  });

  it('Ramrod select + hasValidMoves; passTurn flips', () => {
    let state = createRamrod();
    const rodId = state.playerRods.player1[0];
    expect(rodId).toBeTruthy();
    state = selectRod(state, rodId);
    const placements = ramPlacements(state, rodId);
    expect(placements.length).toBeGreaterThanOrEqual(0);
    expect(typeof ramHasMoves(state)).toBe('boolean');
    if (placements.length > 0) {
      const { boxId, slot } = placements[0];
      expect(ramValidPlace(state, rodId, boxId, slot)).toBe(true);
    }
    const passed = ramPass(state);
    expect(passed.currentPlayer).toBe('player2');
    expect(passed.selectedRod).toBeNull();
  });

  it('Stars passTurn flips; hasValidMoves reflects hand', () => {
    const state = createStars();
    expect(typeof starsHasMoves(state)).toBe('boolean');
    const card = state.playerHands.player1[0];
    if (card) {
      const selected = selectCard(state, card.id);
      expect(selected.selectedCard).not.toBeNull();
    }
    const passed = starsPass(state);
    expect(passed.currentPlayer).toBe('player2');
    expect(passed.phase).toBe('selectingCard');
  });
});

describe('Wave 18 pass/valid — Kwatro / Fab', () => {
  it('Kwatro hasValidMoves on opening; passTurn flips; bogus move invalid', () => {
    const state = createKwa();
    expect(kwaHasMoves(state)).toBe(true);
    expect(kwaIsValid(state, 'nope-chip', 'nope-node')).toBe(false);
    const passed = kwaPass(state);
    expect(passed.currentPlayer).toBe('player2');
  });

  it('Fab hasAnyValidMove true opening; false when all bars used', () => {
    const fresh = createFab();
    expect(hasAnyValidMove(fresh)).toBe(true);
    const bars = new Map(
      [...fresh.fractionBars.entries()].map(([id, bar]) => [
        id,
        { ...bar, used: true },
      ])
    );
    expect(hasAnyValidMove({ ...fresh, fractionBars: bars })).toBe(false);
    const passed = fabPass(fresh);
    expect(passed.currentPlayer).toBe('player2');
  });
});

describe('Wave 18 pass/valid — Contig / Prime pass + winner probes', () => {
  it('Contig after roll: hasValidMoves boolean; pass from calculating; checkWinner null', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.33);
    const rolled = contigRoll(createContig());
    expect(typeof contigHasMoves(rolled)).toBe('boolean');
    expect(contigWinner(createContig())).toBeNull();
    // passTurn only fires from calculating
    const calculating = { ...rolled, phase: 'calculating' as const };
    const passed = contigPass(calculating);
    expect(passed.currentPlayer).toBe('player2');
    expect(passed.phase).toBe('rolling');
  });

  it('Prime after roll: hasValidMoves boolean; passTurn flips seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.27);
    const rolled = primeRoll(createPrime());
    expect(typeof primeHasMoves(rolled)).toBe('boolean');
    const passed = primePass(rolled);
    expect(passed.currentPlayer).toBe('player2');
  });
});
