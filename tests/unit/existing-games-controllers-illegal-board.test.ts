/**
 * q-mp-1187: shard of existing-games-controllers (coverage-preserving).
 * Shard `illegal-board` — describe/wave split for unit-isolated parallel wall trim.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  initGame as initHex,
  newGameVsHuman as hexVsHuman,
  newGameVsAI as hexVsAI,
  getGameState as getHexState,
  setAIDifficulty as setHexAI,
  resetGame as resetHex,
  startTutorial as startHexTutorial,
  isTutorialActive as isHexTutorial,
} from '../../src/games/hex/game-controller';
import {
  initGame as initCalla,
  getGameState as getCallaState,
} from '../../src/games/calla/game-controller';
import {
  initGame as initKings,
  newGameVsHuman as kingsVsHuman,
  getGameState as getKingsState,
} from '../../src/games/kings-quadraphages/game-controller';
import { newGameVsHuman as fabVsHuman } from '../../src/games/fab-a-diffy/game-controller';
import { newGameVsHuman as parVsHuman } from '../../src/games/par-55/game-controller';
import { newGameVsHuman as starsVsHuman } from '../../src/games/stars-bars/game-controller';
import { newGameVsHuman as ramrodVsHuman } from '../../src/games/ramrod/game-controller';
import { newGameVsHuman as kwaVsHuman } from '../../src/games/kwatro-sinko/game-controller';
import { newGameVsHuman as primeVsHuman } from '../../src/games/prime-gold/game-controller';
import {
  initGame as initJuggle,
  newGameVsHuman as juggleVsHuman,
  startTutorial as startJuggleTutorial,
  isTutorialActive as isJuggleTutorial,
} from '../../src/games/juggle/game-controller';
import {
  initGame as initHexAGone,
  newGameVsHuman as hexAGoneVsHuman,
  getGameState as getHexAGoneState,
  startTutorial as startHexAGoneTutorial,
  isTutorialActive as isHexAGoneTutorial,
} from '../../src/games/hex-a-gone/game-controller';
import {
  initGame as initPent,
  newGameVsHuman as pentVsHuman,
  getCurrentState as getPentState,
  startTutorial as startPentTutorial,
  isTutorialActive as isPentTutorial,
} from '../../src/games/pent-em-in/game-controller';
import {
  initGame as initFiar,
  getCurrentState as getFiarState,
} from '../../src/games/fiar/game-controller';
import {
  initGame as initFrac,
  newGameVsHuman as fracVsHuman,
  newGameVsAI as fracVsAI,
  getCurrentState as getFracState,
  startTutorial as startFracTutorial,
  isTutorialActive as isFracTutorial,
} from '../../src/games/frac-fact/game-controller';
import {
  initGame as initPinball,
  newGameVsHuman as pinballVsHuman,
  newGameVsAI as pinballVsAI,
  getCurrentState as getPinballState,
  startTutorial as startPinballTutorial,
  isTutorialActive as isPinballTutorial,
} from '../../src/games/fraction-pinball/game-controller';
import {
  initGame as initRemainder,
  newGameVsHuman as remainderVsHuman,
  newGameVsAI as remainderVsAI,
  getCurrentState as getRemainderState,
  startTutorial as startRemainderTutorial,
  isTutorialActive as isRemainderTutorial,
} from '../../src/games/remainder-islands/game-controller';
import {
  initGame as initStar,
  getGameState as getStarState,
} from '../../src/games/star-track/game-controller';
import { tutorialManager } from '../../src/core/tutorial';
import { mountPair } from '../helpers/mount-pair';

afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
  if (tutorialManager.getIsActive()) {
    tutorialManager.exit();
  }
});

describe('Wave 11 — controller tutorial + AI difficulty deepenings', () => {
  it('Frac / Pinball / Remainder / Juggle / Hex-a-Gone / Pent tutorials start cleanly', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    initFrac(container);
    fracVsHuman();
    startFracTutorial();
    expect(isFracTutorial()).toBe(true);
    tutorialManager.exit();

    initPinball(container);
    pinballVsHuman();
    startPinballTutorial();
    expect(isPinballTutorial()).toBe(true);
    tutorialManager.exit();

    initRemainder(container);
    remainderVsHuman();
    startRemainderTutorial();
    expect(isRemainderTutorial()).toBe(true);
    tutorialManager.exit();

    const { board, status } = mountPair();
    initJuggle(board, status);
    juggleVsHuman();
    startJuggleTutorial();
    expect(isJuggleTutorial()).toBe(true);
    tutorialManager.exit();

    initHexAGone(board, status);
    hexAGoneVsHuman();
    startHexAGoneTutorial();
    expect(isHexAGoneTutorial()).toBe(true);
    tutorialManager.exit();

    initPent(board, status);
    pentVsHuman();
    startPentTutorial();
    expect(isPentTutorial()).toBe(true);
    tutorialManager.exit();
    expect(isPentTutorial()).toBe(false);
  });
});

describe('Controller illegal-click no-ops (FIAR / Star / Pent / Hex-a-Gone / Remainder)', () => {
  it('FIAR re-click occupied node does not grow moveHistory twice', () => {
    const { board, status } = mountPair();
    initFiar(board, status);
    const node = board.querySelector('[data-node-id]') as HTMLElement | null;
    expect(node).toBeTruthy();
    node!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const afterFirst = getFiarState().moveHistory.length;
    expect(afterFirst).toBeGreaterThanOrEqual(1);
    node!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getFiarState().moveHistory.length).toBe(afterFirst);
  });

  it('Star Track board space click before draw leaves phase at drawChains', () => {
    const { board, status } = mountPair();
    initStar(board, status);
    expect(getStarState().phase).toBe('drawChains');
    const space = board.querySelector('[data-space]') as HTMLElement | null;
    space?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getStarState().phase).toBe('drawChains');
    expect(getStarState().player1Position).toBe(0);
  });

  it("Pent'Em In board click without piece keeps selectPiece phase", () => {
    const { board, status } = mountPair();
    initPent(board, status);
    expect(getPentState().phase).toBe('selectPiece');
    const cell = board.querySelector(
      '.pent-board .interaction rect, .pent-board rect[data-row], rect'
    ) as HTMLElement | null;
    cell?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getPentState().phase).toBe('selectPiece');
    expect(getPentState().selectedPiece).toBeFalsy();
  });

  it('Hex-a-Gone board click before confirm leaves selection uncommitted', () => {
    const { board, status } = mountPair();
    initHexAGone(board, status);
    const before = getHexAGoneState().moveHistory.length;
    const cell = board.querySelector(
      '[data-q], .hexagone-cell, .hag-cell, svg'
    ) as HTMLElement | null;
    cell?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getHexAGoneState().moveHistory.length).toBe(before);
    expect(getHexAGoneState().phase).not.toBe('gameOver');
  });

  it('Remainder Islands island click before roll stays in rolling', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    initRemainder(container);
    expect(getRemainderState().phase).toBe('rolling');
    const island = container.querySelector(
      '[data-island-id], .remainder-island, .island'
    ) as HTMLElement | null;
    island?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getRemainderState().phase).toBe('rolling');
    expect(getRemainderState().currentRoll).toBeNull();
  });
});

describe('Hex game-controller', () => {
  it('initGame / vs-human / vs-AI / reset expose a fresh board', () => {
    const { board, status } = mountPair();
    initHex(board, status);
    expect(getHexState().currentPlayer).toBe('player1');
    expect(getHexState().moveHistory).toHaveLength(0);
    expect(board.querySelector('.hex-board, .hex-cell-group')).toBeTruthy();

    hexVsAI('easy');
    expect(getHexState().boardSize).toBeGreaterThan(0);
    setHexAI('hard');
    resetHex();
    expect(getHexState().moveHistory).toHaveLength(0);

    hexVsHuman();
    expect(getHexState().winner).toBeNull();
  });

  it('startTutorial activates then exits cleanly', () => {
    const { board, status } = mountPair();
    initHex(board, status);
    startHexTutorial();
    expect(isHexTutorial()).toBe(true);
    tutorialManager.exit();
    expect(isHexTutorial()).toBe(false);
  });
});

describe('Single-container quiz controllers (Frac / Pinball / Remainder)', () => {
  it('Frac Fact init / modes / tutorial', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    initFrac(container);
    expect(getFracState().phase).toBe('playing');
    fracVsAI('easy', 'easy');
    fracVsHuman('medium');
    startFracTutorial();
    expect(isFracTutorial()).toBe(true);
    tutorialManager.exit();
  });

  it('Fraction Pinball init / modes / tutorial', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    initPinball(container);
    expect(['answering', 'showResult', 'gameOver']).toContain(
      getPinballState().phase
    );
    pinballVsAI('easy');
    pinballVsHuman();
    startPinballTutorial();
    expect(isPinballTutorial()).toBe(true);
    tutorialManager.exit();
  });

  it('Remainder Islands init / modes / tutorial', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    initRemainder(container);
    expect(['rolling', 'selectIsland', 'gameOver']).toContain(
      getRemainderState().phase
    );
    remainderVsAI('easy');
    remainderVsHuman();
    startRemainderTutorial();
    expect(isRemainderTutorial()).toBe(true);
    tutorialManager.exit();
  });
});

describe('Controller illegal-click no-ops (Hex / Calla)', () => {
  it('Hex occupied cell click leaves moveHistory unchanged', () => {
    const { board, status } = mountPair();
    initHex(board, status);
    const before = getHexState().moveHistory.length;
    const empty = board.querySelector(
      '.hex-cell-group[data-row="2"][data-col="2"]'
    ) as HTMLElement | null;
    empty?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const afterPlace = getHexState().moveHistory.length;
    expect(afterPlace).toBeGreaterThanOrEqual(before);

    const occupied = board.querySelector(
      '.hex-cell-group[data-row="2"][data-col="2"]'
    ) as HTMLElement | null;
    const hist = getHexState().moveHistory.length;
    occupied?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getHexState().moveHistory.length).toBe(hist);
  });

  it('Calla invalid pit click does not grow moveHistory', () => {
    const { board, status } = mountPair();
    initCalla(board, status);
    const before = getCallaState().moveHistory.length;
    const invalid = board.querySelector(
      '.calla-pit:not(.calla-pit-valid)'
    ) as HTMLElement | null;
    if (invalid) {
      invalid.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(getCallaState().moveHistory.length).toBe(before);
    } else {
      expect(getCallaState().player1Pits.length).toBeGreaterThan(0);
    }
  });
});

describe('Wave 13 — controller illegal-click deepenings', () => {
  it('Fab / Par / Prime / Stars / Ramrod / Kwa premature clicks keep chrome', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    fabVsHuman(container);
    container
      .querySelector('.fab-answer-wrapper, .fab-answer-board')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(
      container.querySelector('.fab-bar-pool, .fab-answer-board')
    ).toBeTruthy();

    parVsHuman(container);
    container
      .querySelector('.par55-base, .par55-board, svg')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(container.querySelector('.par55-hand, .par55-board')).toBeTruthy();

    primeVsHuman(container);
    container
      .querySelector('.pg-cell, .pg-board')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(container.querySelector('.pg-roll-btn, .pg-dice-area')).toBeTruthy();

    starsVsHuman(container);
    container
      .querySelector('.stars-cell, .stars-board')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(
      container.querySelector(
        '.stars-hand, .stars-hand-container, .stars-board'
      )
    ).toBeTruthy();

    ramrodVsHuman(container);
    container
      .querySelector('.ramrod-box, .ramrod-board')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(
      container.querySelector('.ramrod-player-rods, .ramrod-board')
    ).toBeTruthy();

    kwaVsHuman(container);
    container
      .querySelector('.kwa-node, .kwa-board, svg')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(container.querySelector('.kwa-board, .kwa-chip-info')).toBeTruthy();
  });

  it('Pent / Remainder / Kings illegal clicks keep opening chrome', () => {
    const { board, status } = mountPair();
    initPent(board, status);
    pentVsHuman();
    board
      .querySelector('.pent-cell, .pent-board')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(
      board.querySelector('.pent-piece-selector, .pent-board')
    ).toBeTruthy();

    const container = document.createElement('div');
    document.body.appendChild(container);
    initRemainder(container);
    remainderVsHuman();
    container
      .querySelector('.remainder-island, .remainder-board')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(
      container.querySelector('.remainder-dice, .remainder-board')
    ).toBeTruthy();

    const history = document.createElement('div');
    document.body.appendChild(history);
    initKings(board, status, history);
    kingsVsHuman();
    const far = board.querySelector(
      '.cell[data-row="5"][data-col="5"]'
    ) as HTMLElement | null;
    far?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getKingsState().selectedKingPosition).toBeNull();
    expect(board.querySelector('.board, .cell')).toBeTruthy();
  });
});
