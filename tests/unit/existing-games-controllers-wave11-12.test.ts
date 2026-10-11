/**
 * q-mp-1187: shard of existing-games-controllers (coverage-preserving).
 * Shard `wave11-12` — describe/wave split for unit-isolated parallel wall trim.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  initGame as initHex,
  newGameVsHuman as hexVsHuman,
  newGameVsAI as hexVsAI,
  getGameState as getHexState,
  setAIDifficulty as setHexAI,
  startTutorial as startHexTutorial,
  isTutorialActive as isHexTutorial,
} from '../../src/games/hex/game-controller';
import {
  initGame as initCalla,
  newGameVsHuman as callaVsHuman,
  newGameVsAI as callaVsAI,
  getGameState as getCallaState,
  setAIDifficulty as setCallaAI,
  getCurrentHint,
  startTutorial as startCallaTutorial,
  isTutorialActive as isCallaTutorial,
  resetGame as resetCalla,
} from '../../src/games/calla/game-controller';
import {
  initGame as initKings,
  newGameVsHuman as kingsVsHuman,
  newGameVsAI as kingsVsAI,
  getAIDifficulty,
  setAIDifficulty as setKingsAI,
  startTutorial as startKingsTutorial,
  isTutorialActive as isKingsTutorial,
} from '../../src/games/kings-quadraphages/game-controller';
import {
  newGameVsHuman as fabVsHuman,
  startTutorial as startFabTutorial,
  isTutorialActive as isFabTutorial,
} from '../../src/games/fab-a-diffy/game-controller';
import {
  newGameVsHuman as parVsHuman,
  startTutorial as startParTutorial,
  isTutorialActive as isParTutorial,
} from '../../src/games/par-55/game-controller';
import {
  newGameVsHuman as starsVsHuman,
  startTutorial as startStarsTutorial,
  isTutorialActive as isStarsTutorial,
} from '../../src/games/stars-bars/game-controller';
import {
  newGameVsHuman as ramrodVsHuman,
  startTutorial as startRamrodTutorial,
  isTutorialActive as isRamrodTutorial,
} from '../../src/games/ramrod/game-controller';
import {
  newGameVsHuman as kwaVsHuman,
  startTutorial as startKwaTutorial,
  isTutorialActive as isKwaTutorial,
} from '../../src/games/kwatro-sinko/game-controller';
import {
  newGameVsHuman as primeVsHuman,
  startTutorial as startPrimeTutorial,
  isTutorialActive as isPrimeTutorial,
} from '../../src/games/prime-gold/game-controller';
import {
  initGame as initJuggle,
  newGameVsAI as juggleVsAI,
  setAIDifficulty as setJuggleAI,
} from '../../src/games/juggle/game-controller';
import {
  initGame as initHexAGone,
  newGameVsHuman as hexAGoneVsHuman,
  newGameVsAI as hexAGoneVsAI,
  getGameState as getHexAGoneState,
  setAIDifficulty as setHexAGoneAI,
} from '../../src/games/hex-a-gone/game-controller';
import {
  initGame as initPent,
  newGameVsHuman as pentVsHuman,
  getCurrentState as getPentState,
} from '../../src/games/pent-em-in/game-controller';
import {
  initGame as initFiar,
  newGameVsHuman as fiarVsHuman,
  newGameVsAI as fiarVsAI,
  getCurrentState as getFiarState,
  setAIDifficulty as setFiarAI,
  startTutorial as startFiarTutorial,
  isTutorialActive as isFiarTutorial,
} from '../../src/games/fiar/game-controller';
import {
  initGame as initRemainder,
  newGameVsHuman as remainderVsHuman,
  getCurrentState as getRemainderState,
} from '../../src/games/remainder-islands/game-controller';
import {
  initGame as initContig,
  newGameVsHuman as contigVsHuman,
  newGameVsAI as contigVsAI,
  setAIDifficulty as setContigAI,
} from '../../src/games/contig-60/game-controller';
import { newGameVsHuman as sdVsHuman } from '../../src/games/sum-dominoes/game-controller';
import {
  initGame as initStar,
  newGameVsHuman as starVsHuman,
  newGameVsAI as starVsAI,
  getGameState as getStarState,
  setAIDifficulty as setStarAI,
} from '../../src/games/star-track/game-controller';
import {
  initGame as initQueens,
  newGameVsHuman as queensVsHuman,
  newGameVsAI as queensVsAI,
  setAIDifficulty as setQueensAI,
} from '../../src/games/queens-guards/game-controller';
import { tutorialManager } from '../../src/core/tutorial';
import { mountPair } from '../helpers/mount-pair';

afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
  if (tutorialManager.getIsActive()) {
    tutorialManager.exit();
  }
});

describe('Wave 12 — controller tutorial deepenings (Hex / Calla / Kings / Fab / Par / Stars / Ramrod / Kwa / Prime / FIAR)', () => {
  it('Hex / Calla / Kings / FIAR startTutorial then exit', () => {
    const { board, status } = mountPair();
    initHex(board, status);
    hexVsHuman();
    startHexTutorial();
    expect(isHexTutorial()).toBe(true);
    tutorialManager.exit();
    expect(isHexTutorial()).toBe(false);

    initCalla(board, status);
    callaVsHuman();
    startCallaTutorial();
    expect(isCallaTutorial()).toBe(true);
    tutorialManager.exit();

    const history = document.createElement('div');
    document.body.appendChild(history);
    initKings(board, status, history);
    kingsVsHuman();
    startKingsTutorial();
    expect(isKingsTutorial()).toBe(true);
    tutorialManager.exit();

    initFiar(board, status);
    fiarVsHuman();
    startFiarTutorial();
    expect(isFiarTutorial()).toBe(true);
    tutorialManager.exit();
    expect(isFiarTutorial()).toBe(false);
  });

  it('Fab / Par / Stars / Ramrod / Kwa / Prime tutorials start cleanly', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    fabVsHuman(container);
    startFabTutorial();
    expect(isFabTutorial()).toBe(true);
    tutorialManager.exit();

    parVsHuman(container);
    startParTutorial();
    expect(isParTutorial()).toBe(true);
    tutorialManager.exit();

    starsVsHuman(container);
    startStarsTutorial();
    expect(isStarsTutorial()).toBe(true);
    tutorialManager.exit();

    ramrodVsHuman(container);
    startRamrodTutorial();
    expect(isRamrodTutorial()).toBe(true);
    tutorialManager.exit();

    kwaVsHuman(container);
    startKwaTutorial();
    expect(isKwaTutorial()).toBe(true);
    tutorialManager.exit();

    primeVsHuman(container);
    startPrimeTutorial();
    expect(isPrimeTutorial()).toBe(true);
    tutorialManager.exit();
    expect(isPrimeTutorial()).toBe(false);
  });

  it('Hex / Calla / FIAR / Juggle / Hex-a-Gone AI difficulty round-trips', () => {
    const { board, status } = mountPair();
    initHex(board, status);
    hexVsAI('easy');
    setHexAI('hard');
    setHexAI('medium');

    initCalla(board, status);
    callaVsAI('hard');
    setCallaAI('easy');

    initFiar(board, status);
    fiarVsAI('medium');
    setFiarAI('hard');

    initJuggle(board, status);
    juggleVsAI('easy');
    setJuggleAI('hard');

    initHexAGone(board, status);
    hexAGoneVsAI('medium');
    setHexAGoneAI('easy');
    expect(getHexAGoneState().currentPlayer).toBe('player1');
  });
});

describe('Controller setAIDifficulty round-trips', () => {
  it('Hex / Calla / Kings / Contig / Juggle / FIAR / Queens / Hex-a-Gone / Star', () => {
    const { board, status } = mountPair();

    initHex(board, status);
    hexVsAI('easy');
    setHexAI('hard');
    expect(getHexState().currentPlayer).toBeTruthy();

    initCalla(board, status);
    callaVsAI('easy');
    setCallaAI('medium');
    expect(getCallaState().currentPlayer).toBeTruthy();

    initKings(board, status);
    kingsVsAI('easy');
    setKingsAI('hard');
    expect(getAIDifficulty()).toBe('hard');

    initContig(board, status);
    contigVsAI('easy');
    setContigAI('hard');
    expect(board.querySelector('.contig-board, .contig-roll-btn')).toBeTruthy();

    initJuggle(board, status);
    juggleVsAI('easy');
    setJuggleAI('medium');
    expect(
      board.querySelector('.juggle-board, .juggle-dice-area')
    ).toBeTruthy();

    initFiar(board, status);
    fiarVsAI('easy');
    setFiarAI('hard');
    expect(getFiarState().phase).toBe('placement');

    initQueens(board, status);
    queensVsAI('easy');
    setQueensAI('medium');
    expect(board.querySelector('svg, .qg-board')).toBeTruthy();

    initHexAGone(board, status);
    hexAGoneVsAI('easy');
    setHexAGoneAI('hard');
    expect(getHexAGoneState().currentPlayer).toBeTruthy();

    initStar(board, status);
    starVsAI('easy');
    setStarAI('hard');
    expect(getStarState().phase).toBe('drawChains');
  });
});

describe('Controller illegal-click deepenings (Hex-a-Gone / Remainder / Pent / FIAR)', () => {
  it('Hex-a-Gone board click before commit keeps selectBlocks', () => {
    const { board, status } = mountPair();
    initHexAGone(board, status);
    hexAGoneVsHuman();
    expect(getHexAGoneState().phase).toBe('selectBlocks');
    const before = getHexAGoneState().moveHistory?.length ?? 0;
    const cell = board.querySelector(
      '.hex-a-gone-cell, [data-q], .hex-cell'
    ) as HTMLElement | null;
    cell?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getHexAGoneState().phase).toBe('selectBlocks');
    expect(getHexAGoneState().moveHistory?.length ?? 0).toBe(before);
  });

  it('Remainder island click before roll stays rolling', () => {
    const { board, status } = mountPair();
    initRemainder(board, status);
    remainderVsHuman();
    expect(getRemainderState().phase).toBe('rolling');
    const island = board.querySelector(
      '.remainder-island, [data-island-id]'
    ) as HTMLElement | null;
    island?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getRemainderState().phase).toBe('rolling');
    expect(getRemainderState().currentRoll).toBeNull();
  });

  it('Pent board click without piece keeps selectPiece', () => {
    const { board, status } = mountPair();
    initPent(board, status);
    pentVsHuman();
    expect(getPentState().phase).toBe('selectPiece');
    const cell = board.querySelector(
      '.pent-cell, [data-row], .pent-board td'
    ) as HTMLElement | null;
    cell?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getPentState().phase).toBe('selectPiece');
    expect(getPentState().selectedPiece).toBeNull();
  });

  it('FIAR movement-node click without selection stays in placement or movement', () => {
    const { board, status } = mountPair();
    initFiar(board, status);
    fiarVsHuman();
    const phase = getFiarState().phase;
    expect(phase === 'placement' || phase === 'movement').toBe(true);
    const before = getFiarState().moveHistory.length;
    const node = board.querySelector(
      '[data-node-id], .fiar-node'
    ) as HTMLElement | null;
    // Premature movement dest without selection should not crash
    node?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getFiarState().moveHistory.length).toBeGreaterThanOrEqual(before);
    expect(board.querySelector('.fiar-board, svg')).toBeTruthy();
  });
});

describe('Wave 11 — controller illegal-click deepenings (Star / Queens / Contig / Sum)', () => {
  it('Star Track chain click before draw stays drawChains', () => {
    const { board, status } = mountPair();
    initStar(board, status);
    starVsHuman();
    expect(getStarState().phase).toBe('drawChains');
    const choice = board.querySelector(
      '.star-track-choice, .star-track-choices'
    ) as HTMLElement | null;
    choice?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getStarState().phase).toBe('drawChains');
  });

  it('Queens empty-cell click without selection keeps board', () => {
    const { board, status } = mountPair();
    initQueens(board, status);
    queensVsHuman();
    const cell = board.querySelector(
      '.qg-cell, [data-ring], svg'
    ) as HTMLElement | null;
    cell?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(
      board.querySelector('.qg-board, .qg-board-container, svg')
    ).toBeTruthy();
  });

  it('Contig cell click before roll stays rolling', () => {
    const { board, status } = mountPair();
    initContig(board, status);
    contigVsHuman();
    const cell = board.querySelector('.contig-cell') as HTMLElement | null;
    cell?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(
      board.querySelector('.contig-roll-btn, .contig-dice-area')
    ).toBeTruthy();
  });

  it('Sum Dominoes cell click before roll keeps dice chrome', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    sdVsHuman(container);
    const cell = container.querySelector(
      '.sd-cell, .sd-board td, [data-row]'
    ) as HTMLElement | null;
    cell?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(
      container.querySelector('.sd-roll-btn, .sd-dice-area, .sd-board')
    ).toBeTruthy();
  });
});

describe('Wave 11 — controller tutorial + AI difficulty deepenings', () => {
  it('Contig / Star / Queens setAIDifficulty round-trips via vsAI', () => {
    const { board, status } = mountPair();
    initContig(board, status);
    contigVsAI('hard');
    setContigAI('easy');
    setContigAI('medium');

    initStar(board, status);
    starVsAI('easy');
    setStarAI('hard');

    initQueens(board, status);
    queensVsAI('medium');
    setQueensAI('hard');
    expect(
      board.querySelector('.qg-board, .qg-board-container, svg')
    ).toBeTruthy();
  });
});

describe('Calla game-controller', () => {
  it('initGame and mode switches keep hint null until AI teaches', () => {
    const { board, status } = mountPair();
    initCalla(board, status);
    expect(getCallaState().currentPlayer).toBe('player1');
    expect(getCurrentHint()).toBeNull();

    callaVsAI('easy');
    setCallaAI('medium');
    expect(getCallaState().player1Pits.length).toBe(5);

    callaVsHuman();
    resetCalla();
    expect(getCallaState().winner).toBeNull();
  });

  it('startTutorial wires the calla config', () => {
    const { board, status } = mountPair();
    initCalla(board, status);
    startCallaTutorial();
    expect(isCallaTutorial()).toBe(true);
    tutorialManager.exit();
  });
});
