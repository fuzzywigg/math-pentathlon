/**
 * Wave 13b — getPhaseMessage / formatMove / clearSelection edges.
 * Complements burn-wave13-rules-phase (illegal/getValid*). Still rules-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState as createHag } from '../../src/games/hex-a-gone/types';
import {
  selectBlock as selectHag,
  commitSelection,
  getPhaseMessage as hagMsg,
  getBlockColor,
} from '../../src/games/hex-a-gone/rules';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import { getPhaseMessage as callaMsg, isGameOver as callaOver } from '../../src/games/calla/rules';

import {
  createInitialState as createStar,
} from '../../src/games/star-track/types';
import {
  drawChains,
  selectChain,
  getPhaseMessage as starMsg,
  isGameOver as starOver,
} from '../../src/games/star-track/rules';

import {
  createInitialState as createFab,
  selectBar1,
  selectBar2,
  selectOperation,
  getOperationSymbol,
  clearSelection as clearFab,
} from '../../src/games/fab-a-diffy/rules';

import {
  createInitialState as createPar,
  selectBlock as selectPar,
  clearSelection as clearPar,
  getAttributeDisplayName,
  hasValidMoves as parHasMoves,
} from '../../src/games/par-55/rules';

import {
  createInitialState as createRamrod,
  selectRod,
  clearSelection as clearRamrod,
  hasValidMoves as ramrodHasMoves,
  getValidPlacements as ramrodPlacements,
} from '../../src/games/ramrod/rules';

import {
  createInitialState as createKwa,
  selectChip as kwaSelect,
  clearSelection as clearKwa,
  hasValidMoves as kwaHasMoves,
} from '../../src/games/kwatro-sinko/rules';

import {
  createInitialState as createStars,
  selectCard,
  clearSelection as clearStars,
  hasValidMoves as starsHasMoves,
} from '../../src/games/stars-bars/rules';

import {
  createInitialState as createPrime,
  rollDice as primeRoll,
  passTurn as passPrime,
} from '../../src/games/prime-gold/rules';

import { createInitialState as createRemainder } from '../../src/games/remainder-islands/types';
import {
  performRoll,
  setSelectedIsland,
  countOwnedIslands,
} from '../../src/games/remainder-islands/rules';

import {
  createInitialState as createSum,
  doRollDice as sumRoll,
  passTurn as passSum,
  getRemainingCount,
} from '../../src/games/sum-dominoes/rules';

import {
  createInitialState as createFiar,
} from '../../src/games/fiar/types';
import {
  isDraw as fiarIsDraw,
  deselectChip,
  getSelectableNodes,
} from '../../src/games/fiar/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 13b — Hex-a-Gone / Calla / Star phase messages', () => {
  it('hagMsg covers empty select, selected count, and getBlockColor', () => {
    const fresh = createHag();
    expect(hagMsg(fresh)).toMatch(/Select 1-3/);
    const one = selectHag(fresh, 'triangle');
    expect(hagMsg(one)).toMatch(/1 block/);
    const two = selectHag(one, 'rhombus');
    expect(hagMsg(two)).toMatch(/2 block/);
    expect(getBlockColor('triangle')).toMatch(/^#/);
  });

  it('callaMsg selectPit / gameOver win+tie; isGameOver', () => {
    expect(callaMsg(createCalla())).toMatch(/Select a shield/);
    expect(
      callaMsg({
        ...createCalla(),
        phase: 'gameOver',
        winner: 'tie',
      })
    ).toMatch(/tie/i);
    expect(
      callaOver({
        ...createCalla(),
        phase: 'gameOver',
        winner: 'player2',
      })
    ).toBe(true);
  });

  it('starMsg draw→select→win; isGameOver after finish', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    const fresh = createStar();
    expect(starMsg(fresh)).toMatch(/Draw chains/);
    let state = drawChains(fresh);
    expect(starMsg(state)).toMatch(/Choose a chain/);
    // Force near-finish then select longest available
    state = {
      ...state,
      player1Position: 11,
    };
    const longer =
      state.drawnChains![0]!.length >= state.drawnChains![1]!.length ? 0 : 1;
    state = selectChain(state, longer as 0 | 1);
    if (state.phase === 'gameOver') {
      expect(starOver(state)).toBe(true);
      expect(starMsg(state)).toMatch(/wins|draw/i);
    }
  });
});

describe('Wave 13b — Fab / Par / Ramrod / Kwatro / Stars clearSelection matrix', () => {
  it('Fab clearSelection from confirmingMove; getOperationSymbol set', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.22);
    let state = createFab();
    const unused = [...state.fractionBars.entries()]
      .filter(([, b]) => !b.used)
      .map(([id]) => id);
    state = selectBar1(state, unused[0]!);
    state = selectBar2(state, unused[1]!);
    state = selectOperation(state, 'multiply');
    expect(state.phase).toBe('confirmingMove');
    const cleared = clearFab(state);
    expect(cleared.phase).toBe('selectingBar1');
    expect(getOperationSymbol('add')).toBe('+');
    expect(getOperationSymbol('subtract')).toBe('−');
    expect(getOperationSymbol('multiply')).toBe('×');
    expect(getOperationSymbol('divide')).toBe('÷');
  });

  it('Par clearSelection + attribute names + hasValidMoves opening', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.18);
    let state = createPar();
    expect(parHasMoves(state)).toBe(true);
    state = selectPar(state, state.hands.player1[0]!.id);
    expect(clearPar(state).selectedBlock).toBeNull();
    expect(getAttributeDisplayName('color')).toBe('Color');
    expect(getAttributeDisplayName('unknown')).toBe('unknown');
  });

  it('Ramrod clearSelection + placements for selected rod nonempty', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.33);
    let state = createRamrod();
    expect(ramrodHasMoves(state)).toBe(true);
    const rodId = state.playerRods.player1[0]!;
    state = selectRod(state, rodId);
    expect(state.phase).toBe('placingRod');
    expect(ramrodPlacements(state, rodId).length).toBeGreaterThan(0);
    expect(clearRamrod(state).phase).toBe('selectingRod');
  });

  it('Kwatro clearSelection after select; hasValidMoves opening', () => {
    const state = createKwa();
    expect(kwaHasMoves(state)).toBe(true);
    const chipId = [...state.chips.entries()].find(
      ([, c]) => c.owner === 'player1' && c.position
    )?.[0];
    expect(chipId).toBeTruthy();
    const selected = kwaSelect(state, chipId!);
    if (selected.phase === 'selectingDest') {
      expect(clearKwa(selected).phase).toBe('selectingChip');
    }
  });

  it('Stars clearSelection from placingCard; hasValidMoves', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.27);
    let state = createStars();
    expect(starsHasMoves(state)).toBe(true);
    const card = state.playerHands.player1[0]!;
    state = selectCard(state, card.id);
    expect(state.phase).toBe('placingCard');
    expect(clearStars(state).phase).toBe('selectingCard');
  });
});

describe('Wave 13b — Prime / Remainder / Sum / FIAR phase helpers', () => {
  it('Prime passTurn from placing clears dice and returns to rolling', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const placing = primeRoll(createPrime());
    expect(placing.phase).toBe('placing');
    const passed = passPrime(placing);
    expect(passed.phase).toBe('rolling');
    expect(passed.diceRoll).toBeNull();
    expect(passed.currentPlayer).toBe('player2');
  });

  it('Remainder setSelectedIsland + countOwnedIslands', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.6);
    let state = performRoll(createRemainder());
    if (state.phase === 'selectIsland' && state.validIslands[0]) {
      state = setSelectedIsland(state, state.validIslands[0]);
      expect(state.selectedIsland).toBe(state.validIslands[0]);
    }
    const counts = countOwnedIslands(createRemainder());
    expect(counts.player1 + counts.player2).toBe(0);
  });

  it('Sum passTurn from passing / remaining counts', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.05);
    const rolling = createSum();
    const p1 = getRemainingCount(rolling, 'player1');
    const p2 = getRemainingCount(rolling, 'player2');
    expect(p1).toBeGreaterThan(0);
    expect(p2).toBeGreaterThan(0);

    const after = sumRoll(rolling);
    if (after.phase === 'passing') {
      const next = passSum(after);
      expect(next.currentPlayer).not.toBe(after.currentPlayer);
    }
  });

  it('FIAR isDraw false in placement; deselect clears; selectable empty', () => {
    const state = createFiar();
    expect(fiarIsDraw(state)).toBe(false);
    expect(getSelectableNodes(state)).toEqual([]);
    expect(deselectChip({ ...state, selectedNode: 'x' }).selectedNode).toBeNull();
  });
});
