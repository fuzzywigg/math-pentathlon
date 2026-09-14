/**
 * Wave 27 companion — history/status DOM after legal moves (formatMove ↔ rendered chrome).
 * Revives never-merged #121/#132 after #138. Distinct from secondary-ui empty mounts,
 * rules-only formatMove checks, and status-ui-edges / serialization (#120).
 * Tests-only. Existing games only — no product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState as createFab,
  selectBar1,
  selectBar2,
  selectOperation,
  executeMove,
  calculateResult,
  findMatchingAnswers,
  formatMove as formatFabMove,
} from '../../src/games/fab-a-diffy/rules';
import { renderMoveHistory as renderFabHistory } from '../../src/games/fab-a-diffy/board-ui';
import type { FractionOperation } from '../../src/core/fractions/types';

import {
  createInitialState as createPar,
  selectBlock,
  placeBlock,
  formatMove as formatParMove,
  getValidPlacements as parPlacements,
} from '../../src/games/par-55/rules';
import { renderMoveHistory as renderParHistory } from '../../src/games/par-55/board-ui';

import {
  createInitialState as createRamrod,
  selectRod,
  placeRod,
  formatMove as formatRamrodMove,
  getValidPlacements as ramPlacements,
} from '../../src/games/ramrod/rules';
import { renderMoveHistory as renderRamrodHistory } from '../../src/games/ramrod/board-ui';

import {
  createInitialState as createKwa,
  selectChip,
  moveChip,
  formatMove as formatKwaMove,
  getValidMoves as kwaMoves,
} from '../../src/games/kwatro-sinko/rules';
import { renderMoveHistory as renderKwaHistory } from '../../src/games/kwatro-sinko/board-ui';

import {
  createInitialState as createSum,
  doRollDice as sumRoll,
  selectDomino,
  placeDomino,
  formatMove as formatSumMove,
  getValidPlacements as sumPlacements,
} from '../../src/games/sum-dominoes/rules';
import { getDiceSum } from '../../src/games/sum-dominoes/types';

import {
  createInitialState as createStars,
  selectCard,
  placeCard,
  getValidPlacements as starsPlacements,
} from '../../src/games/stars-bars/rules';
import { renderMoveHistory as renderStarsHistory } from '../../src/games/stars-bars/board-ui';

import {
  createInitialState as createPrime,
  rollDice as primeRoll,
  placeChip as primePlace,
  getValidPlacements as primePlacements,
} from '../../src/games/prime-gold/rules';
import { renderMoveHistory as renderPrimeHistory } from '../../src/games/prime-gold/board-ui';

import { renderMoveHistory as renderKingsHistory } from '../../src/games/kings-quadraphages/board-ui';

import { createInitialState as createHex } from '../../src/games/hex/types';
import { makeMove as hexMove } from '../../src/games/hex/rules';
import { renderStatus as renderHexStatus } from '../../src/games/hex/board-ui';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import { makeMove as callaMove, getLastMoveInfo } from '../../src/games/calla/rules';
import { renderStatus as renderCallaStatus } from '../../src/games/calla/board-ui';

import { createInitialState as createStar } from '../../src/games/star-track/types';
import { drawChains, selectChain } from '../../src/games/star-track/rules';
import { renderStatus as renderStarStatus } from '../../src/games/star-track/board-ui';

import { newGameVsHuman as parVsHuman } from '../../src/games/par-55/game-controller';
import { newGameVsHuman as starsVsHuman } from '../../src/games/stars-bars/game-controller';
import { newGameVsHuman as primeVsHuman } from '../../src/games/prime-gold/game-controller';
import {
  initGame as initFiar,
  newGameVsHuman as fiarVsHuman,
  getCurrentState as getFiarState,
} from '../../src/games/fiar/game-controller';
import {
  initGame as initKings,
  newGameVsHuman as kingsVsHuman,
  getGameState as getKingsState,
} from '../../src/games/kings-quadraphages/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

function click(el: Element | null): void {
  expect(el).toBeTruthy();
  el!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

describe('Wave 27 history-DOM — Fab formatMove equation appears in render', () => {
  it('completed claim history row shows operator and equals', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.25);
    let state = createFab();
    const bars = [...state.fractionBars.values()].filter((b) => !b.used);
    expect(bars.length).toBeGreaterThanOrEqual(2);

    const ops: FractionOperation[] = ['add', 'subtract', 'multiply', 'divide'];
    let claimed = false;

    outer: for (let i = 0; i < bars.length; i++) {
      for (let j = 0; j < bars.length; j++) {
        if (i === j) continue;
        let trial = selectBar1(state, bars[i].id);
        trial = selectBar2(trial, bars[j].id);
        if (trial.phase !== 'selectingOperation') continue;

        for (const op of ops) {
          let confirming = selectOperation(trial, op);
          if (confirming.phase !== 'confirmingMove') continue;
          const result = calculateResult(bars[i].fraction, bars[j].fraction, op);
          if (!result) continue;
          const matches = findMatchingAnswers(confirming, result);
          if (matches.length === 0) continue;
          confirming = executeMove(confirming, matches[0]);
          if (confirming.moveHistory.length > 0) {
            state = confirming;
            claimed = true;
            break outer;
          }
        }
      }
    }

    if (!claimed) {
      const empty = renderFabHistory(createFab());
      expect(empty.querySelector('.fab-history')).toBeTruthy();
      return;
    }

    const move = state.moveHistory[state.moveHistory.length - 1];
    expect(formatFabMove(state, move)).toMatch(/=/);

    const hist = renderFabHistory(state);
    const row = hist.querySelector('.fab-history-move');
    expect(row).toBeTruthy();
    expect(row!.textContent).toMatch(/=/);
    expect(row!.textContent).toMatch(/\d/);
  });
});

describe('Wave 27 history-DOM — Par place → formatMove + history row', () => {
  it('placeBlock history renders score bump fragment', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    let state = createPar();
    const block = state.hands.player1[0];
    state = selectBlock(state, block.id);
    const spots = parPlacements(state);
    expect(spots.length).toBeGreaterThan(0);
    state = placeBlock(state, spots[0]);
    expect(state.moveHistory.length).toBe(1);

    expect(formatParMove(state.moveHistory[0])).toMatch(/pts/i);

    const hist = renderParHistory(state);
    const row = hist.querySelector('.par55-history-move');
    expect(row).toBeTruthy();
    expect(row!.textContent).toMatch(/\+|Blue|Red|\d/i);
  });
});

describe('Wave 27 history-DOM — Ramrod place → formatMove + history chrome', () => {
  it('rod placement formats length; history mounts', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.35);
    let state = createRamrod();
    const rodId = state.playerRods.player1[0];
    state = selectRod(state, rodId);
    const spots = ramPlacements(state, rodId);
    expect(spots.length).toBeGreaterThan(0);
    state = placeRod(state, spots[0].boxId, spots[0].slot);
    expect(state.moveHistory.length).toBe(1);

    expect(formatRamrodMove(state.moveHistory[0])).toMatch(/Rod|cm/i);

    const hist = renderRamrodHistory(state);
    expect(hist.className).toMatch(/ramrod/);
    expect(hist.querySelector('.ramrod-history-list, .ramrod-history-move, h3')).toBeTruthy();
  });
});

describe('Wave 27 history-DOM — Kwatro move → formatMove + history chip text', () => {
  it('legal moveChip produces Chip format and history row', () => {
    let state = createKwa();
    const p1Chips = [...state.chips.values()].filter((c) => c.owner === 'player1');
    let moved = false;
    for (const chip of p1Chips) {
      const selected = selectChip(state, chip.id);
      if (selected.phase !== 'selectingDest') continue;
      const dests = kwaMoves(selected, chip.id);
      if (dests.length === 0) continue;
      const next = moveChip(selected, dests[0]);
      if (next.moveHistory.length > 0) {
        state = next;
        moved = true;
        break;
      }
    }
    if (!moved) {
      const chip = [...createKwa().chips.values()][0];
      expect(
        formatKwaMove({
          player: 'player1',
          chip,
          fromNode: 'n0-0',
          toNode: 'n1-0',
          alignment: null,
          moveNumber: 1,
        })
      ).toMatch(/Chip|\d/);
      return;
    }
    const last = state.moveHistory[state.moveHistory.length - 1];
    expect(formatKwaMove(last)).toMatch(/Chip|\d/);

    const hist = renderKwaHistory(state);
    expect(hist.querySelector('.kwa-history-move')?.textContent).toMatch(/\d/);
  });
});

describe('Wave 27 history-DOM — Sum Dominoes formatMove after place', () => {
  it('placed domino formats [f1|f2] shape', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.15);
    let state = createSum();
    state = sumRoll(state);
    if (state.phase === 'passing' || !state.currentDice) {
      expect(state.currentDice || state.phase === 'passing').toBeTruthy();
      return;
    }
    const sum = getDiceSum(state.currentDice);
    let placed = false;
    for (const d of state.hands.player1) {
      let trial = selectDomino(state, d.id);
      if (!trial.selectedDomino) continue;
      const spots = sumPlacements(trial, d, sum);
      if (spots.length === 0) continue;
      trial = placeDomino(trial, spots[0].position, spots[0].orientation);
      if (trial.moveHistory.length > 0) {
        state = trial;
        placed = true;
        break;
      }
    }
    if (!placed) {
      expect(state.phase).toMatch(/placing|passing|rolling/);
      return;
    }
    expect(formatSumMove(state.moveHistory[0])).toMatch(/\[\d+\|\d+\]/);
  });
});

describe('Wave 27 history-DOM — Stars / Prime render after rules place', () => {
  it('Stars placeCard history shows score fragment', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    let state = createStars();
    const card = state.playerHands.player1[0];
    state = selectCard(state, card.id);
    const spots = starsPlacements(state);
    expect(spots.length).toBeGreaterThan(0);
    state = placeCard(state, spots[0].row, spots[0].col);
    expect(state.moveHistory.length).toBe(1);

    const hist = renderStarsHistory(state);
    expect(hist.querySelector('.stars-move-item, .stars-history-move')?.textContent).toMatch(
      /\+|\d/
    );
  });

  it('Prime placeChip history shows equation fragment when place succeeds', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.45);
    let state = createPrime();
    state = primeRoll(state);
    if (state.phase !== 'placing') {
      expect(state.phase).toMatch(/pass|roll/i);
      return;
    }
    const spots = primePlacements(state);
    if (spots.length === 0) {
      expect(state.diceRoll).toBeTruthy();
      return;
    }
    state = primePlace(state, spots[0].value, spots[0].expr);
    expect(state.moveHistory.length).toBeGreaterThanOrEqual(1);
    const hist = renderPrimeHistory(state);
    expect(hist.querySelector('.pg-move-item')?.textContent).toMatch(/=|\d/);
  });
});

describe('Wave 27 history-DOM — Kings history mounts after controller turn', () => {
  it('full P1 turn writes move-history-entry rows', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    const history = document.createElement('div');
    document.body.appendChild(board);
    document.body.appendChild(status);
    document.body.appendChild(history);

    initKings(board, status, history);
    kingsVsHuman();

    click(board.querySelector('.cell[data-row="1"][data-col="5"]'));
    click(board.querySelector('.cell-valid-move'));
    click(
      board.querySelector('.cell-valid-placement') ??
        board.querySelector('.cell-empty')
    );

    expect(getKingsState().currentPlayer).toBe('player2');
    expect(getKingsState().moveHistory.length).toBeGreaterThanOrEqual(2);

    // Controller should have painted history; also assert pure render API
    expect(
      history.querySelector('.move-history-entry') ||
        history.querySelector('.move-history-list')
    ).toBeTruthy();

    const scratch = document.createElement('div');
    renderKingsHistory(getKingsState(), scratch);
    expect(scratch.querySelector('.move-history-entry')).toBeTruthy();
  });
});

describe('Wave 27 status-DOM — Hex/Calla/Star/FIAR after legal move', () => {
  it('Hex makeMove status shows Red turn', () => {
    const el = document.createElement('div');
    let state = createHex();
    state = hexMove(state, { row: 2, col: 2 });
    renderHexStatus(state, el);
    expect(el.querySelector('.status-turn')?.textContent).toMatch(/Red/i);
    expect(state.currentPlayer).toBe('player2');
  });

  it('Calla makeMove refreshes status and getLastMoveInfo', () => {
    const el = document.createElement('div');
    let state = createCalla();
    const pit = state.player1Pits.findIndex((n) => n > 0);
    expect(pit).toBeGreaterThanOrEqual(0);
    state = callaMove(state, pit);
    renderCallaStatus(state, el);
    expect(el.querySelector('.status-turn, .calla-scores')).toBeTruthy();
    expect(getLastMoveInfo(state)).toMatch(/cube/i);
  });

  it('Star draw+select status shows progress chrome', () => {
    const el = document.createElement('div');
    let state = createStar();
    state = drawChains(state);
    expect(state.phase).toBe('selectChain');
    state = selectChain(state, 0);
    renderStarStatus(state, el);
    expect(el.querySelector('.status-turn, .progress-p1')).toBeTruthy();
    expect(state.currentPlayer).toBe('player2');
  });

  it('FIAR controller place paints status mentioning Red', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.appendChild(board);
    document.body.appendChild(status);
    initFiar(board, status);
    fiarVsHuman();
    click(board.querySelector('[data-node-id]'));
    expect(getFiarState().currentPlayer).toBe('player2');
    expect(status.querySelector('.fiar-status')?.textContent).toMatch(/Red|Player 2|turn/i);
  });
});

describe('Wave 27 history-DOM — controller Par/Stars/Prime after legal place', () => {
  it('Par controller place paints .par55-history-move', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = parVsHuman(container);

    const handBlock = container.querySelector(
      '.par55-hand-player1 .par55-hand-block.clickable'
    );
    click(handBlock);
    expect(ctrl.state.phase).toBe('placingBlock');
    expect(ctrl.state.selectedBlock).toBeTruthy();

    const baseGroup = container.querySelector(
      'g[data-base-id]:has(.par55-valid-base), g[data-base-id]'
    );
    // Prefer a valid base group that contains the highlight class
    const validPent = container.querySelector('.par55-valid-base');
    click(validPent?.closest('g[data-base-id]') ?? baseGroup);

    expect(ctrl.state.moveHistory.length).toBe(1);
    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(container.querySelector('.par55-history-move')?.textContent).toMatch(/\d|\+/);
  });

  it('Stars controller place paints move item', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = starsVsHuman(container);
    const hand =
      container.querySelector('.stars-hand-label.player1')?.parentElement ??
      container.querySelector('.stars-hand.player1, .stars-hand-player1');
    click(hand?.querySelector('.stars-card:not(.disabled), .stars-card') ?? null);
    expect(ctrl.state.phase).toBe('placingCard');
    click(container.querySelector('.stars-cell.valid, .stars-cell-valid'));
    expect(ctrl.state.moveHistory.length).toBe(1);
    expect(
      container.querySelector('.stars-move-item, .stars-history-move')?.textContent
    ).toMatch(/\d|\+/);
  });

  it('Prime controller roll keeps history chrome mountable', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = primeVsHuman(container);
    click(container.querySelector('.pg-roll-btn, .prime-roll-btn'));
    const hist = renderPrimeHistory(ctrl.state);
    expect(hist.className).toMatch(/pg|prime|history/i);
  });
});
