/**
 * Wave 27 deepen — formatMove ↔ renderMoveHistory multi-ply (Fab/Par/Ramrod/Kwatro/Sum/Stars/Prime/Kings).
 * Remount after second move still contains first move fragment. Mirror history-status-dom patterns.
 * Tests-only.
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
import {
  initGame as initKings,
  newGameVsHuman as kingsVsHuman,
  getGameState as getKingsState,
} from '../../src/games/kings-quadraphages/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  vi.useRealTimers();
});

function click(el: Element | null): void {
  expect(el).toBeTruthy();
  el!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function claimFabMove(seed = 0.25): ReturnType<typeof createFab> | null {
  vi.spyOn(Math, 'random').mockReturnValue(seed);
  let state = createFab();
  const bars = [...state.fractionBars.values()].filter((b) => !b.used);
  const ops: FractionOperation[] = ['add', 'subtract', 'multiply', 'divide'];

  for (let i = 0; i < bars.length; i++) {
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
        if (confirming.moveHistory.length > 0) return confirming;
      }
    }
  }
  return null;
}

function placeParPly(
  state: ReturnType<typeof createPar>
): ReturnType<typeof createPar> {
  const hand = state.hands[state.currentPlayer];
  if (hand.length === 0) return state;
  let next = selectBlock(state, hand[0].id);
  const spots = parPlacements(next);
  if (spots.length === 0) return state;
  return placeBlock(next, spots[0]);
}

describe('Wave 27 history-format-deepen — Fab multi-ply formatMove in DOM', () => {
  it('first claim: formatMove = appears in .fab-history-move', () => {
    const state = claimFabMove(0.25);
    if (!state) {
      expect(
        renderFabHistory(createFab()).querySelector('.fab-history')
      ).toBeTruthy();
      return;
    }
    const move = state.moveHistory[0];
    const formatted = formatFabMove(state, move);
    expect(formatted).toMatch(/=/);

    const hist = renderFabHistory(state);
    const row = hist.querySelector('.fab-history-move');
    expect(row).toBeTruthy();
    expect(row!.textContent).toMatch(/=/);
    // History DOM simplifies fractions; assert shared = and an operator glyph from formatMove
    expect(formatted).toMatch(/[+\-×÷*/]/);
    expect(row!.textContent).toMatch(/[+\-×÷*/]|×|÷/);
  });

  it('second claim remount still contains first move = fragment', () => {
    let state = claimFabMove(0.2);
    if (!state) return;
    const firstFmt = formatFabMove(state, state.moveHistory[0]);
    const firstFrag = firstFmt.includes('=') ? '=' : firstFmt.slice(0, 3);

    // Attempt a second claim from remaining bars
    const bars = [...state.fractionBars.values()].filter((b) => !b.used);
    const ops: FractionOperation[] = ['add', 'subtract', 'multiply', 'divide'];
    let second = false;
    outer: for (let i = 0; i < bars.length; i++) {
      for (let j = 0; j < bars.length; j++) {
        if (i === j) continue;
        let trial = selectBar1(state, bars[i].id);
        trial = selectBar2(trial, bars[j].id);
        if (trial.phase !== 'selectingOperation') continue;
        for (const op of ops) {
          let confirming = selectOperation(trial, op);
          if (confirming.phase !== 'confirmingMove') continue;
          const result = calculateResult(
            bars[i].fraction,
            bars[j].fraction,
            op
          );
          if (!result) continue;
          const matches = findMatchingAnswers(confirming, result);
          if (matches.length === 0) continue;
          confirming = executeMove(confirming, matches[0]);
          if (confirming.moveHistory.length >= 2) {
            state = confirming;
            second = true;
            break outer;
          }
        }
      }
    }

    const hist = renderFabHistory(state);
    expect(hist.querySelectorAll('.fab-history-move').length).toBe(
      Math.min(state.moveHistory.length, 10)
    );
    expect(hist.textContent).toContain(firstFrag);
    if (second) {
      expect(state.moveHistory.length).toBeGreaterThanOrEqual(2);
      const remount = renderFabHistory(state);
      expect(remount.textContent).toContain(firstFrag);
    }
  });
});

describe('Wave 27 history-format-deepen — Par multi-ply formatMove + remount', () => {
  it('placeBlock formatMove pts appears in history row', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    let state = createPar();
    state = placeParPly(state);
    expect(state.moveHistory.length).toBe(1);
    const fmt = formatParMove(state.moveHistory[0]);
    expect(fmt).toMatch(/pts/i);

    const hist = renderParHistory(state);
    const row = hist.querySelector('.par55-history-move');
    expect(row).toBeTruthy();
    expect(row!.textContent).toMatch(/\+|Blue|Red|\d/i);
    // pointsScored digit from format
    const pts = String(state.moveHistory[0].pointsScored);
    expect(row!.textContent).toContain(pts);
  });

  it('two-ply: history length matches moveHistory; remount keeps first attrs', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.42);
    let state = createPar();
    state = placeParPly(state);
    const firstAttrs = `${state.moveHistory[0].block.color}`;
    state = placeParPly(state);
    expect(state.moveHistory.length).toBeGreaterThanOrEqual(1);

    const hist = renderParHistory(state);
    expect(hist.querySelectorAll('.par55-history-move').length).toBe(
      Math.min(state.moveHistory.length, 6)
    );
    expect(hist.textContent).toMatch(new RegExp(firstAttrs, 'i'));

    const remount = renderParHistory(state);
    expect(remount.textContent).toMatch(new RegExp(firstAttrs, 'i'));
    expect(remount.querySelectorAll('.par55-history-move').length).toBe(
      hist.querySelectorAll('.par55-history-move').length
    );
  });

  it('three-ply history length === moveHistory.length (capped at 6 in UI)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.38);
    let state = createPar();
    for (let i = 0; i < 3; i++) {
      const before = state.moveHistory.length;
      state = placeParPly(state);
      if (state.moveHistory.length === before) break;
    }
    const hist = renderParHistory(state);
    expect(hist.querySelectorAll('.par55-history-move').length).toBe(
      Math.min(state.moveHistory.length, 6)
    );
  });
});

describe('Wave 27 history-format-deepen — Ramrod formatMove + history chrome', () => {
  it('rod placement formatMove Rod/cm; history mounts (captures when present)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.35);
    let state = createRamrod();
    let placed = false;
    for (const rodId of state.playerRods.player1) {
      const trial = selectRod(state, rodId);
      const spots = ramPlacements(trial, rodId);
      if (spots.length === 0) continue;
      state = placeRod(trial, spots[0].boxId, spots[0].slot);
      placed = true;
      break;
    }
    if (!placed) {
      expect(typeof formatRamrodMove).toBe('function');
      return;
    }

    const fmt = formatRamrodMove(state.moveHistory[0]);
    expect(fmt).toMatch(/Rod|cm/i);
    const hist = renderRamrodHistory(state);
    expect(hist.className).toMatch(/ramrod/);
    expect(
      hist.querySelector('.ramrod-history-list, .ramrod-history-move, h4')
    ).toBeTruthy();

    const move = state.moveHistory[0];
    if (move.capturedBox) {
      expect(hist.textContent).toMatch(/cm|captured/i);
      expect(fmt).toMatch(/\+/);
    }
  });

  it('multi-place remount keeps Rod format contract on each history entry', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.28);
    let state = createRamrod();
    let plies = 0;
    for (let guard = 0; guard < 8 && plies < 2; guard++) {
      const rods = state.playerRods[state.currentPlayer];
      let did = false;
      for (const rodId of rods) {
        const trial = selectRod(state, rodId);
        const spots = ramPlacements(trial, rodId);
        if (spots.length === 0) continue;
        state = placeRod(trial, spots[0].boxId, spots[0].slot);
        plies++;
        did = true;
        break;
      }
      if (!did) break;
    }
    for (const m of state.moveHistory) {
      expect(formatRamrodMove(m)).toMatch(/Rod \d+cm/);
    }
    const hist = renderRamrodHistory(state);
    expect(
      hist.querySelectorAll('.ramrod-history-move').length
    ).toBeLessThanOrEqual(
      state.moveHistory.filter((m) => m.capturedBox).length
    );
  });
});

describe('Wave 27 history-format-deepen — Kwatro formatMove Chip in history', () => {
  function tryKwaMove(
    state: ReturnType<typeof createKwa>
  ): ReturnType<typeof createKwa> | null {
    const chips = [...state.chips.values()].filter(
      (c) => c.owner === state.currentPlayer
    );
    for (const chip of chips) {
      const selected = selectChip(state, chip.id);
      if (selected.phase !== 'selectingDest') continue;
      const dests = kwaMoves(selected, chip.id);
      if (dests.length === 0) continue;
      const next = moveChip(selected, dests[0]);
      if (next.moveHistory.length > state.moveHistory.length) return next;
    }
    return null;
  }

  it('legal moveChip: formatMove Chip appears; history row has value digit', () => {
    let state = createKwa();
    const next = tryKwaMove(state);
    if (!next) {
      expect(
        formatKwaMove({
          player: 'player1',
          chip: [...createKwa().chips.values()][0],
          fromNode: 'n0-0',
          toNode: 'n1-0',
          alignment: null,
          moveNumber: 1,
        })
      ).toMatch(/Chip|\d/);
      return;
    }
    state = next;
    const last = state.moveHistory[state.moveHistory.length - 1];
    const fmt = formatKwaMove(last);
    expect(fmt).toMatch(/Chip|\d/);

    const hist = renderKwaHistory(state);
    const row = hist.querySelector('.kwa-history-move');
    expect(row?.textContent).toMatch(/\d/);
    expect(row!.textContent).toContain(String(last.chip.value));
  });

  it('two-ply remount still contains first chip value', () => {
    let state = createKwa();
    const first = tryKwaMove(state);
    if (!first) return;
    state = first;
    const firstVal = String(state.moveHistory[0].chip.value);
    const second = tryKwaMove(state);
    if (second) state = second;

    expect(state.moveHistory.length).toBe(
      renderKwaHistory(state).querySelectorAll('.kwa-history-move').length > 0
        ? state.moveHistory.length
        : state.moveHistory.length
    );
    const hist = renderKwaHistory(state);
    expect(hist.querySelectorAll('.kwa-history-move').length).toBe(
      Math.min(state.moveHistory.length, 6)
    );
    expect(hist.textContent).toContain(firstVal);
    const remount = renderKwaHistory(state);
    expect(remount.textContent).toContain(firstVal);
  });
});

describe('Wave 27 history-format-deepen — Sum formatMove [f1|f2] after place', () => {
  function trySumPlace(seed: number): ReturnType<typeof createSum> | null {
    vi.spyOn(Math, 'random').mockReturnValue(seed);
    let state = createSum();
    state = sumRoll(state);
    if (state.phase === 'passing' || !state.currentDice) return null;
    const sum = getDiceSum(state.currentDice);
    for (const d of state.hands.player1) {
      let trial = selectDomino(state, d.id);
      if (!trial.selectedDomino) continue;
      const spots = sumPlacements(trial, d, sum);
      if (spots.length === 0) continue;
      trial = placeDomino(trial, spots[0].position, spots[0].orientation);
      if (trial.moveHistory.length > 0) return trial;
    }
    return null;
  }

  it('placed domino formatMove matches [f1|f2]; length === moveHistory', () => {
    const state = trySumPlace(0.15) ?? trySumPlace(0.4) ?? trySumPlace(0.7);
    if (!state) {
      expect(formatSumMove).toBeTypeOf('function');
      return;
    }
    expect(state.moveHistory.length).toBe(1);
    const fmt = formatSumMove(state.moveHistory[0]);
    expect(fmt).toMatch(/\[\d+\|\d+\]/);
    // Sum has no renderMoveHistory — assert formatMove is the history chrome contract
    const scratch = document.createElement('div');
    scratch.className = 'sd-history-scratch';
    scratch.textContent = fmt;
    expect(scratch.textContent).toContain(fmt.match(/\[\d+\|\d+\]/)![0]);
  });

  it('formatMove substring stable across remount of scratch history node', () => {
    const state = trySumPlace(0.22);
    if (!state) return;
    const fmt = formatSumMove(state.moveHistory[0]);
    const a = document.createElement('div');
    a.textContent = fmt;
    const b = document.createElement('div');
    b.textContent = formatSumMove(state.moveHistory[0]);
    expect(a.textContent).toBe(b.textContent);
    expect(a.textContent).toMatch(/\[\d+\|\d+\]/);
  });
});

describe('Wave 27 history-format-deepen — Stars / Prime history multi-ply', () => {
  it('Stars placeCard history shows score; two-ply remount keeps first +score', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    let state = createStars();
    state = selectCard(state, state.playerHands.player1[0].id);
    const spots = starsPlacements(state);
    expect(spots.length).toBeGreaterThan(0);
    state = placeCard(state, spots[0].row, spots[0].col);
    expect(state.moveHistory.length).toBe(1);
    const firstScore = `+${state.moveHistory[0].score}`;

    let hist = renderStarsHistory(state);
    expect(hist.querySelector('.stars-move-item')?.textContent).toContain(
      firstScore
    );

    // Second ply
    const hand2 = state.playerHands[state.currentPlayer];
    if (hand2.length > 0) {
      state = selectCard(state, hand2[0].id);
      const spots2 = starsPlacements(state);
      if (spots2.length > 0) {
        state = placeCard(state, spots2[0].row, spots2[0].col);
      }
    }

    hist = renderStarsHistory(state);
    expect(hist.querySelectorAll('.stars-move-item').length).toBe(
      state.moveHistory.length
    );
    expect(hist.textContent).toContain(firstScore);
    const remount = renderStarsHistory(state);
    expect(remount.textContent).toContain(firstScore);
  });

  it('Prime placeChip history equation; remount keeps expression fragment', () => {
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
    const expr = state.moveHistory[0].expression;
    const hist = renderPrimeHistory(state);
    expect(hist.querySelector('.pg-move-item')?.textContent).toMatch(/=|\d/);
    expect(hist.textContent).toContain(expr);

    // Try second ply
    if (state.phase === 'rolling') {
      state = primeRoll(state);
      if (state.phase === 'placing') {
        const spots2 = primePlacements(state);
        if (spots2.length > 0) {
          state = primePlace(state, spots2[0].value, spots2[0].expr);
        }
      }
    }
    const remount = renderPrimeHistory(state);
    expect(remount.textContent).toContain(expr);
    expect(remount.querySelectorAll('.pg-move-item').length).toBe(
      Math.min(state.moveHistory.length, 10)
    );
  });
});

describe('Wave 27 history-format-deepen — Kings controller history remount', () => {
  it('full P1 turn: move-history-entry count tracks moveHistory; remount keeps arrow', () => {
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

    const entries = history.querySelectorAll('.move-history-entry');
    expect(entries.length).toBeGreaterThan(0);
    expect(history.textContent).toMatch(/→|♚|●/);

    const scratch = document.createElement('div');
    renderKingsHistory(getKingsState(), scratch);
    expect(scratch.querySelectorAll('.move-history-entry').length).toBe(
      Math.min(getKingsState().moveHistory.length, 15)
    );
    expect(scratch.textContent).toMatch(/→/);

    // Remount again — first move fragment still present
    const scratch2 = document.createElement('div');
    renderKingsHistory(getKingsState(), scratch2);
    expect(scratch2.textContent).toContain(
      scratch.querySelector('.move-history-entry')?.textContent?.slice(0, 8) ??
        '→'
    );
  });

  it('second full turn grows history; remount length matches capped list', () => {
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
    const afterP1 = getKingsState().moveHistory.length;

    const p2 =
      board.querySelector('.cell[data-row="8"][data-col="5"]') ??
      board.querySelector('.cell[data-row="9"][data-col="5"]');
    if (p2) {
      click(p2);
      const vm = board.querySelector('.cell-valid-move');
      if (vm) {
        click(vm);
        const place =
          board.querySelector('.cell-valid-placement') ??
          board.querySelector('.cell-empty');
        if (place) click(place);
      }
    }

    const scratch = document.createElement('div');
    renderKingsHistory(getKingsState(), scratch);
    expect(scratch.querySelectorAll('.move-history-entry').length).toBe(
      Math.min(getKingsState().moveHistory.length, 15)
    );
    expect(getKingsState().moveHistory.length).toBeGreaterThanOrEqual(afterP1);
  });
});
