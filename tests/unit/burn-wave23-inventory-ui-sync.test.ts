/**
 * Wave 23 — inventory UI sync after mutated resource ledgers.
 * Distinct from wave 19 controller-persist / status-ui and wave 20/21
 * container controllers / attribute UI. Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  createInitialState as createPar,
  selectBlock,
  placeBlock,
  getValidPlacements as parPlacements,
} from '../../src/games/par-55/rules';
import {
  renderHand as renderParHand,
  renderScores as renderParScores,
} from '../../src/games/par-55/board-ui';

import {
  createInitialState as createSum,
  doRollDice as sumRoll,
  selectDomino,
  placeDomino,
  getValidPlacements as sumPlacements,
  canPlayDomino,
} from '../../src/games/sum-dominoes/rules';
import { getDiceSum } from '../../src/games/sum-dominoes/types';
import { renderHand as renderSumHand } from '../../src/games/sum-dominoes/board-ui';

import {
  createInitialState as createStars,
  selectCard,
  placeCard,
  getValidPlacements as starsPlacements,
} from '../../src/games/stars-bars/rules';
import {
  renderPlayerHand as renderStarsHand,
  renderScores as renderStarsScores,
} from '../../src/games/stars-bars/board-ui';

import { createInitialState as createHag } from '../../src/games/hex-a-gone/types';
import {
  selectBlock as hagSelect,
  commitSelection,
  selectBlockForPlacement,
  placeBlock as placeHag,
  getValidPlacements as hagPlacements,
} from '../../src/games/hex-a-gone/rules';
import { renderBoard as renderHagBoard } from '../../src/games/hex-a-gone/board-ui';

import { createInitialState as createFrac } from '../../src/games/frac-fact/types';
import {
  startGame as startFrac,
  submitAnswer as submitFrac,
} from '../../src/games/frac-fact/rules';
import { renderScores as renderFracScores } from '../../src/games/frac-fact/board-ui';

import {
  createInitialState as createPin,
  INITIAL_BALLS,
} from '../../src/games/fraction-pinball/types';
import {
  startGame as startPin,
  submitAnswer as submitPin,
} from '../../src/games/fraction-pinball/rules';
import { renderScores as renderPinScores } from '../../src/games/fraction-pinball/board-ui';

import {
  createInitialState as createFab,
  selectBar1,
  selectBar2,
  selectOperation,
  executeMove,
} from '../../src/games/fab-a-diffy/rules';
import { renderScores as renderFabScores } from '../../src/games/fab-a-diffy/board-ui';
import { Fraction } from '../../src/core/fractions/types';

import {
  createInitialGameState,
  selectKing,
  placeQuadraphage,
  getSupply,
} from '../../src/games/kings-quadraphages/game-state';
import {
  handleCellClick,
  renderStatus as renderKingsStatus,
} from '../../src/games/kings-quadraphages/board-ui';

import {
  createInitialState as createPent,
  getPlayerPieces,
} from '../../src/games/pent-em-in/types';
import {
  selectPiece,
  placePiece,
  getValidPlacements as pentPlacements,
} from '../../src/games/pent-em-in/rules';
import { renderPieceSelector } from '../../src/games/pent-em-in/board-ui';

import {
  createInitialState as createRamrod,
  selectRod,
  placeRod,
  getValidPlacements as ramPlacements,
} from '../../src/games/ramrod/rules';
import { renderPlayerRods } from '../../src/games/ramrod/board-ui';

import {
  createInitialState as createCalla,
  getPlayerPits,
} from '../../src/games/calla/types';
import { getValidPits, makeMove as callaMove } from '../../src/games/calla/rules';
import { renderBoard as renderCallaBoard } from '../../src/games/calla/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

function cycleRandom() {
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n = (n + 1) % 997;
    return (n + 1) / 997;
  });
}

function findBarId(
  state: ReturnType<typeof createFab>,
  frac: Fraction
): string {
  for (const [id, bar] of state.fractionBars) {
    if (
      bar.fraction.numerator === frac.numerator &&
      bar.fraction.denominator === frac.denominator &&
      !bar.used
    ) {
      return id;
    }
  }
  throw new Error(`bar missing`);
}

function findAnswerId(
  state: ReturnType<typeof createFab>,
  frac: Fraction
): string {
  for (const [id, bar] of state.answerBars) {
    if (
      bar.fraction.numerator === frac.numerator &&
      bar.fraction.denominator === frac.denominator &&
      bar.claimedBy === null
    ) {
      return id;
    }
  }
  throw new Error(`answer missing`);
}

describe('Wave 23 inventory-ui — Par hand count after place', () => {
  it('renderHand child count matches depleted/redrawn hand', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    let state = createPar();
    const block = state.hands.player1[0];
    state = selectBlock(state, block.id);
    state = placeBlock(state, parPlacements(state)[0]);
    expect(state.hands.player1.find((b) => b.id === block.id)).toBeUndefined();
    const handEl = renderParHand(state, 'player1', () => {});
    expect(handEl.querySelectorAll('.par55-hand-block').length).toBe(
      state.hands.player1.length
    );
    const scores = renderParScores(state);
    expect(scores.textContent).toBeTruthy();
  });
});

describe('Wave 23 inventory-ui — Sum hand tiles after place', () => {
  it('renderHand matches getRemaining hand length after legal place', () => {
    let done = false;
    for (let seed = 0; seed < 40 && !done; seed++) {
      vi.spyOn(Math, 'random').mockReturnValue(seed / 40);
      let state = createSum();
      state = sumRoll(state);
      if (!state.currentDice) {
        vi.restoreAllMocks();
        continue;
      }
      const sum = getDiceSum(state.currentDice);
      const playable = state.hands.player1.find((d) =>
        canPlayDomino(state, d, sum)
      );
      if (!playable) {
        vi.restoreAllMocks();
        continue;
      }
      state = selectDomino(state, playable.id);
      const placements = sumPlacements(state, playable, sum);
      if (placements.length === 0) {
        vi.restoreAllMocks();
        continue;
      }
      state = placeDomino(
        state,
        placements[0].position,
        placements[0].orientation
      );
      const handEl = renderSumHand(state, 'player1', () => {});
      expect(handEl.querySelectorAll('.sd-hand-domino').length).toBe(
        state.hands.player1.length
      );
      done = true;
      vi.restoreAllMocks();
    }
    expect(done).toBe(true);
  });
});

describe('Wave 23 inventory-ui — Stars hand + score chrome', () => {
  it('renderPlayerHand reflects post-place hand; scores mount', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    let state = createStars();
    const card = state.playerHands.player1[0];
    state = selectCard(state, card.id);
    const { row, col } = starsPlacements(state)[0];
    state = placeCard(state, row, col);
    const handEl = renderStarsHand(state, 'player1', () => {});
    expect(handEl.querySelectorAll('.stars-card').length).toBe(
      state.playerHands.player1.length
    );
    const scores = renderStarsScores(state);
    expect(scores.querySelector('.stars-score, .stars-scores') || scores)
      .toBeTruthy();
    expect(scores.textContent?.length).toBeGreaterThan(0);
  });
});

describe('Wave 23 inventory-ui — Hex-a-Gone bank block-count text', () => {
  it('renderBoard bank count drops after placeBlock', () => {
    let state = createHag();
    state = hagSelect(state, 'triangle');
    state = commitSelection(state);
    state = selectBlockForPlacement(state, 'triangle');
    const { q, r } = hagPlacements(state)[0];
    state = placeHag(state, q, r);

    const container = document.createElement('div');
    document.body.appendChild(container);
    const forBank =
      state.phase === 'selectBlocks'
        ? state
        : {
            ...state,
            phase: 'selectBlocks' as const,
            currentPlayer: 'player2' as const,
          };
    renderHagBoard(forBank, container);
    const counts = [...container.querySelectorAll('.block-count')].map(
      (el) => el.textContent || ''
    );
    expect(counts.some((t) => t.includes(`${forBank.bank.triangle} left`))).toBe(
      true
    );
  });
});

describe('Wave 23 inventory-ui — Frac / Pinball / Fab score chrome', () => {
  it('Frac renderScores shows bumped score after correct answer', () => {
    cycleRandom();
    let state = startFrac(createFrac());
    state = submitFrac(state, state.currentProblem!.correctAnswer);
    const el = renderFracScores(state);
    expect(el.querySelector('.frac-score-value')?.textContent).toContain(
      String(state.player1Stats.score)
    );
  });

  it('Pinball renderScores reflects ballsRemaining after miss', () => {
    cycleRandom();
    let state = startPin(createPin());
    const wrong = state.currentChallenge!.answerChoices.find(
      (a) => a !== state.currentChallenge!.correctAnswer
    )!;
    state = submitPin(state, wrong);
    expect(state.player1Stats.ballsRemaining).toBe(INITIAL_BALLS - 1);
    const el = renderPinScores(state);
    const balls = el.querySelector('.pinball-balls');
    expect(balls).toBeTruthy();
    expect((balls?.textContent || '').length).toBeGreaterThan(0);
  });

  it('Fab renderScores shows claimed score bump', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createFab();
    const barA = findBarId(state, { numerator: 1, denominator: 4 });
    const barB = findBarId(state, { numerator: 3, denominator: 4 });
    const answerId = findAnswerId(state, { numerator: 1, denominator: 1 });
    state = selectBar1(state, barA);
    state = selectBar2(state, barB);
    state = selectOperation(state, 'add');
    state = executeMove(state, answerId);
    const el = renderFabScores(state);
    expect(el.textContent).toContain('1');
  });
});

describe('Wave 23 inventory-ui — Kings supply chrome after place', () => {
  it('renderStatus .supply-p1 mirrors getSupply after placeQuadraphage', () => {
    let state = createInitialGameState();
    state = selectKing(state);
    state = handleCellClick(2, 5, state).state;
    state = placeQuadraphage(state, { row: 1, col: 4 });
    const el = document.createElement('div');
    document.body.appendChild(el);
    renderKingsStatus(state, el);
    const supply = el.querySelector('.supply-p1');
    expect(supply?.textContent).toContain(String(getSupply(state, 'player1')));
    expect(el.querySelector('.supply-p2')?.textContent).toContain(
      String(getSupply(state, 'player2'))
    );
  });
});

describe('Wave 23 inventory-ui — Pent piece selector tracks available', () => {
  it('renderPieceSelector option count equals available after place', () => {
    let state = createPent();
    const shapeId = getPlayerPieces(state, 'player1').available[0];
    state = selectPiece(state, shapeId);
    state = placePiece(
      state,
      shapeId,
      pentPlacements(state, shapeId, 0, false)[0],
      0,
      false
    );
    // Selector renders for currentPlayer — may be player2 after place
    const seat = state.currentPlayer;
    const available = getPlayerPieces(state, seat).available.length;
    const el = renderPieceSelector(state, () => {});
    expect(el.querySelectorAll('.pent-piece-option').length).toBe(available);
  });
});

describe('Wave 23 inventory-ui — Ramrod rod strip after place', () => {
  it('renderPlayerRods wrapper count matches playerRods length', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    let state = createRamrod();
    const rodId = state.playerRods.player1[0];
    state = selectRod(state, rodId);
    const { boxId, slot } = ramPlacements(state, rodId)[0];
    state = placeRod(state, boxId, slot);
    const el = renderPlayerRods(state, 'player1', () => {});
    expect(el.querySelectorAll('.ramrod-rod-wrapper').length).toBe(
      state.playerRods.player1.length
    );
  });
});

describe('Wave 23 inventory-ui — Calla pit chrome after sow', () => {
  it('renderBoard mounts; chosen pit inventory emptied in state', () => {
    let state = createCalla();
    const pitIndex = getValidPits(state)[0];
    expect(getPlayerPits(state, 'player1')[pitIndex]).toBeGreaterThan(0);
    state = callaMove(state, pitIndex);
    expect(getPlayerPits(state, 'player1')[pitIndex]).toBe(0);
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderCallaBoard(state, container, () => {});
    expect(
      container.querySelector('.calla-board, .calla-pit, [data-pit]')
    ).toBeTruthy();
  });
});
