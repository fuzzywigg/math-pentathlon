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
  getGameState as getKingsState,
  getGameMode,
  getAIDifficulty,
  setAIDifficulty as setKingsAI,
  startTutorial as startKingsTutorial,
  isTutorialActive as isKingsTutorial,
  newGame as kingsNewGame,
} from '../../src/games/kings-quadraphages/game-controller';
import {
  newGameVsHuman as fabVsHuman,
  newGameVsAI as fabVsAI,
  isTutorialActive as isFabTutorial,
} from '../../src/games/fab-a-diffy/game-controller';
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

describe('Kings game-controller', () => {
  it('initGame / modes / difficulty round-trip', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    const history = document.createElement('div');
    document.body.appendChild(board);
    document.body.appendChild(status);
    document.body.appendChild(history);

    initKings(board, status, history);
    expect(getKingsState().currentPlayer).toBe('player1');

    kingsVsAI('easy');
    expect(getGameMode()).toBe('human-vs-ai');
    expect(getAIDifficulty()).toBe('easy');
    setKingsAI('hard');
    expect(getAIDifficulty()).toBe('hard');

    kingsVsHuman();
    expect(getGameMode()).toBe('human-vs-human');
    kingsNewGame();
    expect(getKingsState().turnPhase).toBe('moveKing');
  });

  it('startTutorial activates kings tutorial', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    const history = document.createElement('div');
    document.body.appendChild(board);
    document.body.appendChild(status);
    document.body.appendChild(history);
    initKings(board, status, history);
    startKingsTutorial();
    expect(isKingsTutorial()).toBe(true);
    tutorialManager.exit();
  });
});

describe('Fab-a-Diffy game-controller', () => {
  it('newGameVsHuman / vsAI return controllers with UI chrome', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const human = fabVsHuman(container);
    expect(human.isAI).toBe(false);
    expect(human.aiPlayer).toBeNull();
    expect(human.state.phase).toBe('selectingBar1');
    expect(container.querySelector('.fab-status, .fab-game-area')).toBeTruthy();

    const ai = fabVsAI(container, 'easy');
    expect(ai.isAI).toBe(true);
    expect(ai.aiPlayer).toBe('player2');
    expect(ai.aiDifficulty).toBe('easy');
    expect(isFabTutorial()).toBe(false);
  });
});
