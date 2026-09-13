/**
 * Wave 19 — controller remount / difficulty persist / getState after mode switches.
 * Distinct from existing-games-controllers smoke and wave 18 AI midphase.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  initGame as initHex,
  newGameVsHuman as hexVsHuman,
  newGameVsAI as hexVsAI,
  getGameState as getHexState,
  setAIDifficulty as setHexAI,
  resetGame as resetHex,
  isTutorialActive as isHexTutorial,
} from '../../src/games/hex/game-controller';

import {
  initGame as initCalla,
  newGameVsHuman as callaVsHuman,
  newGameVsAI as callaVsAI,
  getGameState as getCallaState,
  setAIDifficulty as setCallaAI,
  getCurrentHint,
  resetGame as resetCalla,
  isTutorialActive as isCallaTutorial,
} from '../../src/games/calla/game-controller';

import {
  initGame as initStar,
  newGameVsHuman as starVsHuman,
  newGameVsAI as starVsAI,
  getGameState as getStarState,
  setAIDifficulty as setStarAI,
  resetGame as resetStar,
  isTutorialActive as isStarTutorial,
} from '../../src/games/star-track/game-controller';

import {
  initGame as initHag,
  newGameVsHuman as hagVsHuman,
  newGameVsAI as hagVsAI,
  getGameState as getHagState,
  setAIDifficulty as setHagAI,
  resetGame as resetHag,
  isTutorialActive as isHagTutorial,
} from '../../src/games/hex-a-gone/game-controller';

import {
  initGame as initFrac,
  newGameVsHuman as fracVsHuman,
  newGameVsAI as fracVsAI,
  getCurrentState as getFracState,
  setDifficulty as setFracDifficulty,
  isTutorialActive as isFracTutorial,
} from '../../src/games/frac-fact/game-controller';

import {
  initGame as initPinball,
  newGameVsHuman as pinballVsHuman,
  newGameVsAI as pinballVsAI,
  getCurrentState as getPinballState,
  isTutorialActive as isPinballTutorial,
} from '../../src/games/fraction-pinball/game-controller';

import {
  initGame as initKings,
  newGameVsAI as kingsVsAI,
  newGameVsHuman as kingsVsHuman,
  getGameState as getKingsState,
  getGameMode,
  getAIDifficulty,
  setAIDifficulty as setKingsAI,
  newGame as kingsNewGame,
  isTutorialActive as isKingsTutorial,
} from '../../src/games/kings-quadraphages/game-controller';

import {
  initGame as initFiar,
  newGameVsAI as fiarVsAI,
  newGameVsHuman as fiarVsHuman,
  getCurrentState as getFiarState,
  setAIDifficulty as setFiarAI,
  isTutorialActive as isFiarTutorial,
} from '../../src/games/fiar/game-controller';

import {
  initGame as initQueens,
  newGameVsAI as queensVsAI,
  newGameVsHuman as queensVsHuman,
  setAIDifficulty as setQueensAI,
  isTutorialActive as isQueensTutorial,
} from '../../src/games/queens-guards/game-controller';

import {
  newGameVsHuman as fabVsHuman,
  newGameVsAI as fabVsAI,
  isTutorialActive as isFabTutorial,
} from '../../src/games/fab-a-diffy/game-controller';

import {
  newGameVsHuman as primeVsHuman,
  newGameVsAI as primeVsAI,
  isTutorialActive as isPrimeTutorial,
} from '../../src/games/prime-gold/game-controller';

import { tutorialManager } from '../../src/core/tutorial';

afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
  if (tutorialManager.getIsActive()) {
    tutorialManager.exit();
  }
});

function mountPair(): { board: HTMLElement; status: HTMLElement } {
  const board = document.createElement('div');
  const status = document.createElement('div');
  document.body.appendChild(board);
  document.body.appendChild(status);
  return { board, status };
}

describe('Wave 19 controller-persist — Hex difficulty cycle + reset', () => {
  it('easy→medium→hard then reset clears history and winner', () => {
    const { board, status } = mountPair();
    initHex(board, status);
    hexVsAI('easy');
    setHexAI('medium');
    setHexAI('hard');
    expect(getHexState().winner).toBeNull();
    expect(isHexTutorial()).toBe(false);

    // Force a non-empty history via reset path: reset must zero history
    resetHex();
    expect(getHexState().moveHistory).toHaveLength(0);
    expect(getHexState().currentPlayer).toBe('player1');

    hexVsHuman();
    expect(getHexState().winner).toBeNull();
    expect(board.querySelector('.hex-board, .hex-cell-group, svg')).toBeTruthy();
  });
});

describe('Wave 19 controller-persist — Calla hint + remount', () => {
  it('hint stays null; AI→human remount keeps pits inventory', () => {
    const { board, status } = mountPair();
    initCalla(board, status);
    expect(getCurrentHint()).toBeNull();
    callaVsAI('hard');
    setCallaAI('easy');
    expect(getCallaState().player1Pits).toHaveLength(5);
    expect(isCallaTutorial()).toBe(false);

    callaVsHuman();
    resetCalla();
    expect(getCallaState().winner).toBeNull();
    expect(getCallaState().player1Calla).toBe(0);
  });
});

describe('Wave 19 controller-persist — Star Track / Hex-a-Gone reset', () => {
  it('Star Track AI difficulty + reset restores draw phase', () => {
    const { board, status } = mountPair();
    initStar(board, status);
    starVsAI('medium');
    setStarAI('hard');
    expect(getStarState().phase).toBe('drawChains');
    expect(isStarTutorial()).toBe(false);
    resetStar();
    expect(getStarState().player1Position).toBe(0);
    expect(getStarState().drawnChains).toBeNull();
    starVsHuman();
    expect(getStarState().winner).toBeNull();
  });

  it('Hex-a-Gone remount restores bank and selectBlocks phase', () => {
    const { board, status } = mountPair();
    initHag(board, status);
    hagVsAI('easy');
    setHagAI('hard');
    expect(getHagState().phase).toBe('selectBlocks');
    expect(isHagTutorial()).toBe(false);
    resetHag();
    expect(getHagState().placedBlocks).toHaveLength(0);
    hagVsHuman();
    expect(getHagState().winner).toBeNull();
  });
});

describe('Wave 19 controller-persist — quiz difficulty + kings mode', () => {
  it('Frac Fact setDifficulty cycles and AI remount keeps problem', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    initFrac(container);
    fracVsHuman('easy');
    expect(getFracState().difficulty).toBe('easy');
    setFracDifficulty('hard');
    expect(getFracState().difficulty).toBe('hard');
    fracVsAI('medium', 'medium');
    expect(getFracState().currentProblem).not.toBeNull();
    expect(isFracTutorial()).toBe(false);
  });

  it('Pinball human→AI remount exposes challenge state', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    initPinball(container);
    pinballVsHuman();
    expect(getPinballState().currentChallenge).not.toBeNull();
    pinballVsAI('easy');
    expect(getPinballState().winner).toBeNull();
    expect(isPinballTutorial()).toBe(false);
  });

  it('Kings getGameMode / getAIDifficulty persist across newGame', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    const history = document.createElement('div');
    document.body.appendChild(board);
    document.body.appendChild(status);
    document.body.appendChild(history);

    initKings(board, status, history);
    kingsVsAI('easy');
    expect(getGameMode()).toBe('human-vs-ai');
    expect(getAIDifficulty()).toBe('easy');
    setKingsAI('hard');
    expect(getAIDifficulty()).toBe('hard');
    kingsNewGame();
    expect(getKingsState().turnPhase).toBe('moveKing');
    expect(getGameMode()).toBe('human-vs-ai');
    kingsVsHuman();
    expect(getGameMode()).toBe('human-vs-human');
    expect(isKingsTutorial()).toBe(false);
  });
});

describe('Wave 19 controller-persist — FIAR / Queens / Fab / Prime', () => {
  it('FIAR difficulty + state seat after vs switches', () => {
    const { board, status } = mountPair();
    initFiar(board, status);
    fiarVsAI('easy');
    setFiarAI('hard');
    expect(getFiarState().phase).toBe('placement');
    fiarVsHuman();
    expect(getFiarState().chipsPlaced.player1).toBe(0);
    expect(isFiarTutorial()).toBe(false);
  });

  it('Queens AI difficulty remount keeps empty throne', () => {
    const { board, status } = mountPair();
    initQueens(board, status);
    queensVsAI('medium');
    setQueensAI('easy');
    queensVsHuman();
    expect(isQueensTutorial()).toBe(false);
    expect(board.querySelector('.qg-board, .qg-board-container, svg')).toBeTruthy();
  });

  it('Fab / Prime container controllers flip isAI and keep chrome', () => {
    const fabBox = document.createElement('div');
    document.body.appendChild(fabBox);
    const fabH = fabVsHuman(fabBox);
    expect(fabH.isAI).toBe(false);
    const fabA = fabVsAI(fabBox, 'hard');
    expect(fabA.isAI).toBe(true);
    expect(fabA.aiDifficulty).toBe('hard');
    expect(isFabTutorial()).toBe(false);

    const primeBox = document.createElement('div');
    document.body.appendChild(primeBox);
    const pH = primeVsHuman(primeBox);
    expect(pH.state.phase).toBe('rolling');
    const pA = primeVsAI(primeBox, 'easy');
    expect(pA.isAI).toBe(true);
    expect(isPrimeTutorial()).toBe(false);
  });
});
