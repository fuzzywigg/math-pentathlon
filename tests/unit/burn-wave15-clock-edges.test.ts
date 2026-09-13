/**
 * Wave 15c — clock / turn-clock edges for existing games + shared timer helpers.
 * Distinct from wave 14 (types/helpers, dice/expr/score, state-phase) and from
 * wave 15 rules-phase / phase-format. Tests-only; no product inventing.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  createTimer,
  startTimer,
  pauseTimer,
  stopTimer,
  resetTimer,
  getTimerValue,
  isTimerWarning,
  isTimerCritical,
  isTimerComplete,
  addTime,
  formatTime,
  parseTime,
  getTimerProgress,
} from '../../src/core/timer-scoring';

import { createAxial } from '../../src/core/hex/types';
import {
  rotateRight,
  rotateLeft,
  rotateAround,
} from '../../src/core/hex/coordinates';

import {
  rotateCells90CW,
  rotatePolyomino,
} from '../../src/core/polyomino/transform';
import { TETROMINOES } from '../../src/core/polyomino/types';

import { createInitialState as createHag } from '../../src/games/hex-a-gone/types';
import {
  passTurn as passHag,
  getPhaseMessage as hagMsg,
} from '../../src/games/hex-a-gone/rules';

import {
  createInitialState as createPrime,
  rollDice as primeRoll,
  passTurn as passPrime,
  placeChip as placePrime,
} from '../../src/games/prime-gold/rules';

import { createInitialState as createContig } from '../../src/games/contig-60/types';
import {
  doRollDice as contigRoll,
  passTurn as passContig,
  placeChip as placeContig,
} from '../../src/games/contig-60/rules';

import {
  createInitialState as createSum,
  doRollDice as sumRoll,
  passTurn as passSum,
  selectDomino,
} from '../../src/games/sum-dominoes/rules';

import {
  createInitialState as createStars,
  selectCard,
  passTurn as passStars,
  placeCard,
} from '../../src/games/stars-bars/rules';

import {
  createInitialState as createPar,
  selectBlock as selectPar,
  passTurn as passPar,
  placeBlock as placePar,
} from '../../src/games/par-55/rules';

import {
  createInitialState as createRamrod,
  selectRod,
  passTurn as passRamrod,
  placeRod,
} from '../../src/games/ramrod/rules';

import {
  createInitialState as createKwa,
  selectChip as kwaSelect,
  passTurn as passKwa,
  moveChip as kwaMove,
} from '../../src/games/kwatro-sinko/rules';

import {
  createInitialState as createFab,
  selectBar1,
  passTurn as passFab,
  executeMove,
} from '../../src/games/fab-a-diffy/rules';

import {
  createInitialGameState as createKings,
  endTurn,
  selectKing,
  moveKing,
  placeQuadraphage,
} from '../../src/games/kings-quadraphages/game-state';

import { createInitialState as createFrac } from '../../src/games/frac-fact/types';
import {
  startGame as startFrac,
  submitAnswer as submitFrac,
  nextProblem,
} from '../../src/games/frac-fact/rules';

import { createInitialState as createPinball } from '../../src/games/fraction-pinball/types';
import {
  startGame as startPinball,
  submitAnswer as submitPinball,
  nextChallenge,
} from '../../src/games/fraction-pinball/rules';

import {
  createInitialState as createJuggle,
  doRollDice as juggleRoll,
  rotateShape,
  flipShape,
} from '../../src/games/juggle/rules';

import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import {
  selectPiece,
  rotateSelectedPiece,
  flipSelectedPiece,
} from '../../src/games/pent-em-in/rules';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 15 clock — timer identity / format / progress edges', () => {
  it('start/pause/stop/reset are identity outside their allowed states', () => {
    const stopped = createTimer({ initialTime: 10_000 });
    expect(pauseTimer(stopped)).toBe(stopped);
    expect(startTimer(stopped).state).toBe('running');

    const running = startTimer(stopped);
    expect(startTimer(running)).toBe(running);
    const paused = pauseTimer(running);
    expect(paused.state).toBe('paused');
    expect(pauseTimer(paused)).toBe(paused);

    const stoppedAgain = stopTimer(paused);
    expect(stoppedAgain.state).toBe('stopped');
    expect(stoppedAgain.elapsed).toBe(0);
    expect(stoppedAgain.remaining).toBe(10_000);
    expect(resetTimer(running)).toEqual(stopTimer(running));
  });

  it('countdown warning/critical/complete boundaries + up progress', () => {
    const t = createTimer({
      direction: 'down',
      initialTime: 60_000,
      warningThreshold: 10_000,
      criticalThreshold: 3_000,
    });
    expect(isTimerWarning({ ...t, remaining: 10_000 })).toBe(true);
    expect(isTimerWarning({ ...t, remaining: 3_000 })).toBe(false);
    expect(isTimerCritical({ ...t, remaining: 3_000 })).toBe(true);
    expect(isTimerCritical({ ...t, remaining: 0 })).toBe(true);
    expect(isTimerComplete({ ...t, remaining: 0 })).toBe(true);
    expect(isTimerComplete({ ...t, remaining: 1 })).toBe(false);

    const up = createTimer({ direction: 'up', initialTime: 30_000 });
    expect(isTimerComplete({ ...up, elapsed: 30_000, remaining: 0 })).toBe(
      false
    );
    expect(getTimerValue({ ...up, elapsed: 12_345 })).toBe(12_345);
    expect(getTimerProgress({ ...up, elapsed: 15_000 })).toBe(50);
    expect(getTimerProgress({ ...up, elapsed: 60_000 })).toBe(100);
    expect(
      getTimerProgress(createTimer({ initialTime: 0, direction: 'down' }))
    ).toBe(0);
    expect(addTime(t, -999_999).remaining).toBe(0);
  });

  it('formatTime / parseTime edge pads, separators, HH:MM:SS, cs', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(65_432, { showMilliseconds: true })).toBe('01:05.43');
    expect(
      formatTime(90_000, {
        padMinutes: false,
        padSeconds: false,
        separator: '-',
      })
    ).toBe('1-30');
    expect(parseTime('01:05.43')).toBe(65_430);
    expect(parseTime('1:02:03')).toBe((1 * 3600 + 2 * 60 + 3) * 1000);
    expect(parseTime('00:00.5')).toBe(500);
  });
});

describe('Wave 15 clock — hex/polyomino clockwise rotations used by live games', () => {
  it('rotateRight six times returns origin; rotateLeft inverse; rotateAround', () => {
    const start = createAxial(2, -1);
    let cw = start;
    for (let i = 0; i < 6; i++) cw = rotateRight(cw);
    expect(cw).toEqual(start);
    expect(rotateLeft(rotateRight(start))).toEqual(start);
    const around1 = rotateAround(createAxial(1, 0), createAxial(0, 0), 1);
    const cw1 = rotateRight(createAxial(1, 0));
    expect(around1.q + 0).toBe(cw1.q + 0);
    expect(around1.r + 0).toBe(cw1.r + 0);
    const neg = rotateAround(createAxial(1, 0), createAxial(0, 0), -1);
    const five = rotateAround(createAxial(1, 0), createAxial(0, 0), 5);
    expect(neg.q + 0).toBe(five.q + 0);
    expect(neg.r + 0).toBe(five.r + 0);
  });

  it('rotateCells90CW / rotatePolyomino preserve cell count (Juggle/Pent shapes)', () => {
    const I = TETROMINOES.find((s) => s.id === 'I')!;
    expect(rotateCells90CW(I.cells)).toHaveLength(I.cells.length);
    const poly = rotatePolyomino(I);
    expect(poly.cells).toHaveLength(I.cells.length);
    expect(poly.id).toBe(I.id);
  });

  it('Juggle / Pent rotate+flip are identity outside placing / without selection', () => {
    const juggle = createJuggle();
    expect(rotateShape(juggle)).toBe(juggle);
    expect(flipShape(juggle)).toBe(juggle);
    const rolled = juggleRoll(juggle);
    expect(rotateShape(rolled)).toBe(rolled);

    const pent = createPent();
    expect(rotateSelectedPiece(pent)).toBe(pent);
    expect(flipSelectedPiece(pent)).toBe(pent);
    const shapeId = pent.player1Pieces.available[0]!;
    const withPiece = selectPiece(pent, shapeId);
    expect(withPiece.phase).toBe('placePiece');
    const rotated = rotateSelectedPiece(withPiece);
    expect(rotated.selectedRotation).not.toBe(withPiece.selectedRotation);
  });
});

describe('Wave 15 clock — passTurn / endTurn seat clock + gameOver identity', () => {
  it('HAG / Prime / Contig / Sum passTurn flips or stays legal; wrong-phase identity', () => {
    const hag = createHag();
    const hagNext = passHag(hag);
    expect(hagNext.currentPlayer).not.toBe(hag.currentPlayer);
    const over = { ...hag, phase: 'gameOver' as const };
    expect(passHag(over)).toBe(over);
    expect(typeof hagMsg(hag)).toBe('string');

    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const prime = primeRoll(createPrime());
    expect(prime.phase).toBe('placing');
    const passed = passPrime(prime);
    expect(passed.phase).toBe('rolling');
    expect(passed.currentPlayer).not.toBe(prime.currentPlayer);
    const primeOpen = createPrime();
    expect(placePrime(primeOpen, 12, '2*6')).toBe(primeOpen);

    const contigOpen = createContig();
    const contig = contigRoll(contigOpen);
    expect(contig.phase).toBe('calculating');
    const cPass = passContig(contig);
    expect(cPass.currentPlayer).not.toBe(contig.currentPlayer);
    expect(placeContig(contigOpen, 1, '1+0')).toBe(contigOpen);

    const sum = createSum();
    const sumRolled = sumRoll(sum);
    if (sumRolled.phase === 'passing') {
      const next = passSum(sumRolled);
      expect(next.currentPlayer).not.toBe(sumRolled.currentPlayer);
    } else {
      expect(selectDomino(sum, sum.hands.player1[0]!.id)).toBe(sum);
    }
  });

  it('Stars / Par / Ramrod / Kwatro / Fab passTurn seat clock', () => {
    const stars = createStars();
    expect(passStars(stars).currentPlayer).not.toBe(stars.currentPlayer);
    expect(placeCard(stars, 0, 0)).toBe(stars);
    const card = stars.playerHands.player1[0]!;
    expect(selectCard(stars, card.id).phase).toBe('placingCard');

    const par = createPar();
    expect(passPar(par).currentPlayer).not.toBe(par.currentPlayer);
    expect(placePar(par, 'base-0')).toBe(par);
    const block = par.hands.player1[0]!;
    expect(selectPar(par, block.id).selectedBlock).toBe(block.id);

    const ramrod = createRamrod();
    expect(passRamrod(ramrod).currentPlayer).not.toBe(ramrod.currentPlayer);
    expect(placeRod(ramrod, 'box-0', 0)).toBe(ramrod);
    const rodId = ramrod.playerRods.player1[0]!;
    expect(selectRod(ramrod, rodId).selectedRod).toBe(rodId);

    const kwa = createKwa();
    expect(passKwa(kwa).currentPlayer).not.toBe(kwa.currentPlayer);
    expect(kwaMove(kwa, 'n0-0')).toBe(kwa);
    const chip = [...kwa.chips.values()].find((c) => c.owner === 'player1')!;
    const selected = kwaSelect(kwa, chip.id);
    // May stay selectingChip if chip has zero valid moves
    expect(['selectingChip', 'selectingDest']).toContain(selected.phase);

    const fab = createFab();
    expect(passFab(fab).currentPlayer).not.toBe(fab.currentPlayer);
    expect(executeMove(fab)).toBe(fab);
    const barId = [...fab.fractionBars.keys()][0]!;
    expect(selectBar1(fab, barId).selectedBar1).toBe(barId);
  });

  it('Kings endTurn flips seat; Frac/Pinball nextProblem/nextChallenge advance clock', () => {
    let kings = createKings();
    const flipped = endTurn(kings);
    expect(flipped.currentPlayer).toBe('player2');
    expect(flipped.turnPhase).toBe('moveKing');

    kings = selectKing(kings);
    kings = moveKing(kings, { row: 2, col: 5 });
    expect(kings.turnPhase).toBe('placeQuadraphage');
    kings = placeQuadraphage(kings, { row: 5, col: 5 });
    expect(kings.turnPhase).toBe('moveKing');
    expect(kings.currentPlayer).toBe('player2');

    const frac = startFrac(createFrac('easy'));
    const answered = submitFrac(
      frac,
      frac.currentProblem!.answerChoices[0]!
    );
    expect(answered.phase).toBe('showingResult');
    expect(['playing', 'gameOver']).toContain(nextProblem(answered).phase);

    const pin = startPinball(createPinball());
    const pinAns = submitPinball(
      pin,
      pin.currentChallenge!.answerChoices[0]!
    );
    expect(pinAns.phase).toBe('showResult');
    expect(['answering', 'gameOver']).toContain(nextChallenge(pinAns).phase);
  });
});
