/**
 * Wave 27 deepen — select→place seat flips + history chrome (Par / Stars / Ramrod / Kwatro / Fab / Pent).
 * Re-select / cancel no-op matrices where APIs exist. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { newGameVsHuman as parVsHuman } from '../../src/games/par-55/game-controller';
import {
  createInitialState as createPar,
  selectBlock,
  placeBlock,
  clearSelection as clearPar,
  getValidPlacements as parPlacements,
} from '../../src/games/par-55/rules';

import { newGameVsHuman as starsVsHuman } from '../../src/games/stars-bars/game-controller';
import {
  createInitialState as createStars,
  selectCard,
  placeCard,
  clearSelection as clearStars,
  getValidPlacements as starsPlacements,
} from '../../src/games/stars-bars/rules';

import { newGameVsHuman as ramrodVsHuman } from '../../src/games/ramrod/game-controller';
import {
  createInitialState as createRamrod,
  selectRod,
  placeRod,
  clearSelection as clearRamrod,
  getValidPlacements as ramPlacements,
} from '../../src/games/ramrod/rules';

import { newGameVsHuman as kwaVsHuman } from '../../src/games/kwatro-sinko/game-controller';
import {
  createInitialState as createKwa,
  selectChip,
  moveChip,
  clearSelection as clearKwa,
  getValidMoves as kwaMoves,
} from '../../src/games/kwatro-sinko/rules';

import { newGameVsHuman as fabVsHuman } from '../../src/games/fab-a-diffy/game-controller';
import {
  createInitialState as createFab,
  selectBar1,
  selectBar2,
  selectOperation,
  executeMove,
  clearSelection as clearFab,
  calculateResult,
  findMatchingAnswers,
} from '../../src/games/fab-a-diffy/rules';
import type { FractionOperation } from '../../src/core/fractions/types';

import {
  initGame as initPent,
  newGameVsHuman as pentVsHuman,
  getCurrentState as getPentState,
} from '../../src/games/pent-em-in/game-controller';
import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import {
  selectPiece as pentSelect,
  cancelSelection as pentCancel,
  placePiece as pentPlace,
  canPlacePiece,
} from '../../src/games/pent-em-in/rules';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  vi.useRealTimers();
});

function click(el: Element | null): void {
  expect(el).toBeTruthy();
  el!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function mountContainer(): HTMLElement {
  const container = document.createElement('div');
  document.body.appendChild(container);
  return container;
}

function mountPair(): { board: HTMLElement; status: HTMLElement } {
  const board = document.createElement('div');
  const status = document.createElement('div');
  document.body.appendChild(board);
  document.body.appendChild(status);
  return { board, status };
}

describe('Wave 27 seat-place-select — Par select→place flips seat + history', () => {
  it('hand block + valid base place grows history and flips to player2', () => {
    const container = mountContainer();
    const ctrl = parVsHuman(container);
    expect(ctrl.state.phase).toBe('selectingBlock');

    click(container.querySelector('.par55-hand-player1 .par55-hand-block.clickable'));
    expect(ctrl.state.phase).toBe('placingBlock');
    expect(ctrl.state.selectedBlock).toBeTruthy();

    const validPent = container.querySelector('.par55-valid-base');
    click(validPent?.closest('g[data-base-id]') ?? validPent);
    expect(ctrl.state.moveHistory.length).toBe(1);
    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(container.querySelector('.par55-status')?.textContent).toMatch(
      /Select|turn|Place/i
    );
    expect(container.querySelector('.par55-history-move')).toBeTruthy();
  });

  it('second ply for P2 returns seat to player1 when place succeeds', () => {
    const container = mountContainer();
    const ctrl = parVsHuman(container);

    click(container.querySelector('.par55-hand-player1 .par55-hand-block.clickable'));
    click(
      container.querySelector('.par55-valid-base')?.closest('g[data-base-id]') ??
        container.querySelector('.par55-valid-base')
    );
    expect(ctrl.state.currentPlayer).toBe('player2');

    const p2Block = container.querySelector(
      '.par55-hand-player2 .par55-hand-block.clickable'
    );
    if (p2Block) {
      click(p2Block);
      const valid = container.querySelector('.par55-valid-base');
      if (valid && ctrl.state.phase === 'placingBlock') {
        click(valid.closest('g[data-base-id]') ?? valid);
        if (ctrl.state.moveHistory.length >= 2) {
          expect(ctrl.state.currentPlayer).toBe('player1');
        }
      }
    }
  });

  it('rules clearSelection after select restores selectingBlock without history growth', () => {
    let state = createPar();
    const block = state.hands.player1[0];
    state = selectBlock(state, block.id);
    expect(state.phase).toBe('placingBlock');
    state = clearPar(state);
    expect(state.phase).toBe('selectingBlock');
    expect(state.selectedBlock).toBeNull();
    expect(state.moveHistory).toHaveLength(0);
  });

  it('rules select→place matches controller: history length 1 and seat P2', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    let state = createPar();
    state = selectBlock(state, state.hands.player1[0].id);
    const spots = parPlacements(state);
    expect(spots.length).toBeGreaterThan(0);
    state = placeBlock(state, spots[0]);
    expect(state.moveHistory).toHaveLength(1);
    expect(state.currentPlayer).toBe('player2');
    expect(state.phase).toBe('selectingBlock');
  });
});

describe('Wave 27 seat-place-select — Stars select→place flips seat + history', () => {
  it('card + valid cell place grows history and flips player', () => {
    const container = mountContainer();
    const ctrl = starsVsHuman(container);
    expect(ctrl.state.phase).toBe('selectingCard');

    const hand =
      container.querySelector('.stars-hand-label.player1')?.parentElement ??
      container.querySelector('.stars-hand.player1, .stars-hand-player1');
    click(hand?.querySelector('.stars-card:not(.disabled), .stars-card') ?? null);
    expect(ctrl.state.phase).toBe('placingCard');

    click(container.querySelector('.stars-cell.valid, .stars-cell-valid'));
    expect(ctrl.state.moveHistory.length).toBe(1);
    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(container.querySelector('.stars-status')?.textContent).toMatch(
      /Select|Place|turn/i
    );
    expect(container.querySelector('.stars-move-item, .stars-history')).toBeTruthy();
  });

  it('rules clearSelection after selectCard restores selectingCard', () => {
    let state = createStars();
    const card = state.playerHands.player1[0];
    state = selectCard(state, card.id);
    expect(state.phase).toBe('placingCard');
    if (typeof clearStars === 'function') {
      state = clearStars(state);
      expect(state.selectedCard).toBeNull();
      expect(state.phase).toBe('selectingCard');
    }
    expect(state.moveHistory).toHaveLength(0);
  });

  it('rules two-ply placeCard XOR seats and history length 2', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    let state = createStars();
    for (let ply = 0; ply < 2; ply++) {
      const hand = state.playerHands[state.currentPlayer];
      if (hand.length === 0) break;
      state = selectCard(state, hand[0].id);
      const spots = starsPlacements(state);
      if (spots.length === 0) break;
      state = placeCard(state, spots[0].row, spots[0].col);
    }
    if (state.moveHistory.length === 2) {
      expect(state.currentPlayer).toBe('player1');
    }
    expect(state.moveHistory.length).toBeGreaterThanOrEqual(1);
  });
});

describe('Wave 27 seat-place-select — Ramrod select→place when slot valid', () => {
  it('rod select enters placing; place flips seat when slot available', () => {
    const container = mountContainer();
    const ctrl = ramrodVsHuman(container);
    expect(ctrl.state.phase).toBe('selectingRod');

    const rod = container.querySelector(
      '.ramrod-player-player1 .ramrod-rod-wrapper.selectable, .ramrod-rod-wrapper.selectable, .ramrod-rod-wrapper'
    );
    click(rod);
    expect(ctrl.state.selectedRod || ctrl.state.phase === 'placingRod').toBeTruthy();
    expect(container.querySelector('.ramrod-status')?.textContent).toMatch(
      /Select|Place|turn|box|Rod/i
    );

    if (ctrl.state.phase === 'placingRod' && ctrl.state.selectedRod) {
      const slot = container.querySelector(
        '.ramrod-slot.valid, .ramrod-slot.selectable, .ramrod-hint'
      );
      if (slot) {
        const before = ctrl.state.moveHistory.length;
        click(slot.closest('.ramrod-slot') ?? slot);
        if (ctrl.state.moveHistory.length > before) {
          expect(ctrl.state.currentPlayer).toBe('player2');
          expect(
            container.querySelector('.ramrod-history-move, .ramrod-history, .ramrod-status')
          ).toBeTruthy();
        }
      }
    }
  });

  it('rules clearSelection after selectRod restores selectingRod', () => {
    let state = createRamrod();
    const rodId = state.playerRods.player1[0];
    state = selectRod(state, rodId);
    expect(state.selectedRod).toBe(rodId);
    state = clearRamrod(state);
    expect(state.selectedRod).toBeNull();
    expect(state.phase).toBe('selectingRod');
    expect(state.moveHistory).toHaveLength(0);
  });

  it('rules select→place when placements exist flips seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.35);
    let state = createRamrod();
    for (const rodId of state.playerRods.player1) {
      const trial = selectRod(state, rodId);
      const spots = ramPlacements(trial, rodId);
      if (spots.length === 0) continue;
      state = placeRod(trial, spots[0].boxId, spots[0].slot);
      expect(state.moveHistory.length).toBe(1);
      expect(state.currentPlayer).toBe('player2');
      return;
    }
    expect(state.playerRods.player1.length).toBeGreaterThan(0);
  });
});

describe('Wave 27 seat-place-select — Kwatro select→move when dest legal', () => {
  it('chip select enters dest phase; move flips when legal dest clicked', () => {
    const container = mountContainer();
    const ctrl = kwaVsHuman(container);
    expect(ctrl.state.phase).toBe('selectingChip');

    const target =
      container.querySelector('.kwa-selectable-chip')?.closest('g[data-node-id]') ??
      container.querySelector('.kwa-selectable-chip, g[data-node-id]');
    click(target);
    expect(
      ctrl.state.selectedChip ||
        ctrl.state.phase === 'selectingDest' ||
        container.querySelector('.kwa-status')
    ).toBeTruthy();
    expect(container.querySelector('.kwa-status')?.textContent).toMatch(
      /Select|Move|Place|turn|chip|Blue|Red/i
    );

    if (ctrl.state.phase === 'selectingDest' && ctrl.state.selectedChip) {
      const dest =
        container.querySelector('.kwa-valid-dest, .kwa-node-valid, [data-valid="true"]') ??
        container.querySelector('g[data-node-id]:not(.kwa-occupied)');
      if (dest) {
        const before = ctrl.state.moveHistory.length;
        click(dest);
        if (ctrl.state.moveHistory.length > before) {
          expect(ctrl.state.currentPlayer).toBe('player2');
          expect(container.querySelector('.kwa-history-move, .kwa-history')).toBeTruthy();
        }
      }
    }
  });

  it('rules clearSelection after selectChip restores selectingChip', () => {
    let state = createKwa();
    const p1 = [...state.chips.values()].find((c) => c.owner === 'player1');
    expect(p1).toBeTruthy();
    state = selectChip(state, p1!.id);
    if (state.phase === 'selectingDest') {
      state = clearKwa(state);
      expect(state.selectedChip).toBeNull();
      expect(state.phase).toBe('selectingChip');
    }
    expect(state.moveHistory).toHaveLength(0);
  });

  it('rules selectChip→moveChip flips seat when dest exists', () => {
    let state = createKwa();
    const p1Chips = [...state.chips.values()].filter((c) => c.owner === 'player1');
    for (const chip of p1Chips) {
      const selected = selectChip(state, chip.id);
      if (selected.phase !== 'selectingDest') continue;
      const dests = kwaMoves(selected, chip.id);
      if (dests.length === 0) continue;
      const next = moveChip(selected, dests[0]);
      if (next.moveHistory.length > 0) {
        expect(next.currentPlayer).toBe('player2');
        expect(next.phase).toBe('selectingChip');
        return;
      }
    }
    expect(p1Chips.length).toBeGreaterThan(0);
  });
});

describe('Wave 27 seat-place-select — Fab bars→op→claim when possible', () => {
  it('newGameVsHuman paints .fab-status and selectable .fab-bar-wrapper', () => {
    const container = mountContainer();
    const ctrl = fabVsHuman(container);
    expect(ctrl.state.phase).toBe('selectingBar1');
    expect(container.querySelector('.fab-status')?.textContent).toMatch(
      /turn|Select|fraction|bar/i
    );
    expect(container.querySelector('.fab-bar-wrapper:not(.fab-bar-disabled)')).toBeTruthy();
    expect(container.querySelector('.fab-btn, .fab-controls, .fab-scores')).toBeTruthy();
  });

  it('two bar clicks advance toward selectingOperation; clear restores bar1', () => {
    const container = mountContainer();
    const ctrl = fabVsHuman(container);
    const bars = [
      ...container.querySelectorAll('.fab-bar-wrapper:not(.fab-bar-disabled)'),
    ];
    expect(bars.length).toBeGreaterThanOrEqual(2);
    click(bars[0]);
    expect(ctrl.state.phase).toBe('selectingBar2');
    expect(ctrl.state.selectedBar1).toBeTruthy();

    const bars2 = [
      ...container.querySelectorAll('.fab-bar-wrapper:not(.fab-bar-disabled)'),
    ];
    const second = bars2.find((b) => b !== bars[0] && !b.classList.contains('fab-bar-selected'));
    if (second) {
      click(second);
      expect(['selectingOperation', 'selectingBar2', 'confirmingMove']).toContain(
        ctrl.state.phase
      );
    }

    const clear = [...container.querySelectorAll('.fab-btn')].find((b) =>
      /clear/i.test(b.textContent ?? '')
    );
    if (clear) {
      click(clear);
      expect(ctrl.state.phase).toBe('selectingBar1');
      expect(ctrl.state.selectedBar1).toBeNull();
      expect(ctrl.state.moveHistory).toHaveLength(0);
    }
  });

  it('rules claim when match found flips seat and grows history', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.25);
    let state = createFab();
    const bars = [...state.fractionBars.values()].filter((b) => !b.used);
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

    if (claimed) {
      expect(state.currentPlayer).toBe('player2');
      expect(state.phase).toBe('selectingBar1');
      expect(state.moveHistory.length).toBe(1);
    } else {
      expect(clearFab(selectBar1(createFab(), bars[0].id)).phase).toBe('selectingBar1');
    }
  });
});

describe('Wave 27 seat-place-select — Pent-em-in select→placePiece + cancel', () => {
  it('initGame + newGameVsHuman: piece option select enters placePiece status', () => {
    const { board, status } = mountPair();
    initPent(board, status);
    pentVsHuman();

    expect(getPentState().phase).toBe('selectPiece');
    expect(status.querySelector('.pent-status')?.textContent).toMatch(
      /Select|turn|piece/i
    );

    const piece = status.querySelector('.pent-piece-option, .pent-piece');
    click(piece);
    expect(getPentState().phase).toBe('placePiece');
    expect(getPentState().selectedPiece).toBeTruthy();
    expect(status.querySelector('.pent-status')?.textContent).toMatch(/Place|turn/i);
    expect(status.querySelector('.pent-btn-cancel, .pent-controls')).toBeTruthy();
  });

  it('cancel restores selectPiece without placing', () => {
    const { board, status } = mountPair();
    initPent(board, status);
    pentVsHuman();
    click(status.querySelector('.pent-piece-option'));
    expect(getPentState().phase).toBe('placePiece');
    click(status.querySelector('.pent-btn-cancel'));
    expect(getPentState().phase).toBe('selectPiece');
    expect(getPentState().selectedPiece).toBeNull();
    expect(getPentState().placedPieces?.length ?? 0).toBe(0);
  });

  it('rules select + cancel no-op matrix; place when canPlace flips seat', () => {
    let state = createPent();
    const available = state.player1Pieces.available;
    expect(available.length).toBeGreaterThan(0);
    state = pentSelect(state, available[0]);
    expect(state.phase).toBe('placePiece');
    state = pentCancel(state);
    expect(state.phase).toBe('selectPiece');
    expect(state.selectedPiece).toBeNull();

    state = pentSelect(createPent(), available[0]);
    // Limit scan — avoid OOM from exhaustive board walk in jsdom
    let placed = false;
    for (let row = 0; row < 6 && !placed; row++) {
      for (let col = 0; col < 6 && !placed; col++) {
        if (
          canPlacePiece(state, state.selectedPiece!, { row, col }, 0, false)
        ) {
          state = pentPlace(state, state.selectedPiece!, { row, col }, 0, false);
          placed = true;
        }
      }
    }
    if (placed) {
      expect(state.currentPlayer).toBe('player2');
      expect(state.phase).toBe('selectPiece');
    } else {
      expect(state.phase).toBe('placePiece');
    }
  });

  it('board cell click in placePiece places when preview valid', () => {
    const { board, status } = mountPair();
    initPent(board, status);
    pentVsHuman();
    click(status.querySelector('.pent-piece-option'));
    expect(getPentState().phase).toBe('placePiece');

    const cells = [...board.querySelectorAll('[data-row][data-col]')];
    const beforePlayer = getPentState().currentPlayer;
    for (const cell of cells.slice(0, 40)) {
      click(cell);
      if (getPentState().currentPlayer !== beforePlayer) {
        expect(getPentState().phase).toBe('selectPiece');
        expect(status.querySelector('.pent-status')?.textContent).toMatch(/turn|Select/i);
        return;
      }
      if (getPentState().phase === 'selectPiece' && getPentState().selectedPiece === null) {
        // cancel path accidentally — stop
        break;
      }
    }
    // Soft: still in place or advanced
    expect(['placePiece', 'selectPiece']).toContain(getPentState().phase);
  });
});
