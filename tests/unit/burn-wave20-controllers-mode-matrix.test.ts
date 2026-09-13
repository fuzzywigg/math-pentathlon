/**
 * Wave 20 — module-style controller mode/state matrix after tutorial & AI flips.
 * Deepens Hex / Calla / Star / HAG / Contig / Juggle / Queens / FIAR / Pent
 * beyond wave 19 persist smoke. Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

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
  resetGame as resetCalla,
  startTutorial as startCallaTutorial,
  isTutorialActive as isCallaTutorial,
} from '../../src/games/calla/game-controller';

import {
  initGame as initStar,
  newGameVsHuman as starVsHuman,
  newGameVsAI as starVsAI,
  getGameState as getStarState,
  setAIDifficulty as setStarAI,
  resetGame as resetStar,
  startTutorial as startStarTutorial,
  isTutorialActive as isStarTutorial,
} from '../../src/games/star-track/game-controller';

import {
  initGame as initHag,
  newGameVsHuman as hagVsHuman,
  newGameVsAI as hagVsAI,
  getGameState as getHagState,
  setAIDifficulty as setHagAI,
  resetGame as resetHag,
  startTutorial as startHagTutorial,
  isTutorialActive as isHagTutorial,
} from '../../src/games/hex-a-gone/game-controller';

import {
  initGame as initContig,
  newGameVsHuman as contigVsHuman,
  newGameVsAI as contigVsAI,
  setAIDifficulty as setContigAI,
  startTutorial as startContigTutorial,
  isTutorialActive as isContigTutorial,
} from '../../src/games/contig-60/game-controller';

import {
  initGame as initJuggle,
  newGameVsHuman as juggleVsHuman,
  newGameVsAI as juggleVsAI,
  setAIDifficulty as setJuggleAI,
  startTutorial as startJuggleTutorial,
  isTutorialActive as isJuggleTutorial,
} from '../../src/games/juggle/game-controller';

import {
  initGame as initQueens,
  newGameVsHuman as queensVsHuman,
  newGameVsAI as queensVsAI,
  setAIDifficulty as setQueensAI,
  startTutorial as startQueensTutorial,
  isTutorialActive as isQueensTutorial,
} from '../../src/games/queens-guards/game-controller';

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
  initGame as initPent,
  newGameVsHuman as pentVsHuman,
  newGameVsAI as pentVsAI,
  getCurrentState as getPentState,
  startTutorial as startPentTutorial,
  isTutorialActive as isPentTutorial,
} from '../../src/games/pent-em-in/game-controller';

import { tutorialManager } from '../../src/core/tutorial';

afterEach(() => {
  document.body.innerHTML = '';
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

describe('Wave 20 mode-matrix — Hex / Calla / Star / HAG reset after vsAI', () => {
  it('Hex vsAI → setAI → vsHuman → reset keeps empty history', () => {
    const { board, status } = mountPair();
    initHex(board, status);
    hexVsAI('easy');
    expect(getHexState().currentPlayer).toBe('player1');
    expect(getHexState().moveHistory).toHaveLength(0);
    setHexAI('hard');
    hexVsHuman();
    expect(getHexState().winner).toBeNull();
    resetHex();
    expect(getHexState().moveHistory).toHaveLength(0);
    expect(isHexTutorial()).toBe(false);
  });

  it('Calla / Star / HAG vsAI→vsHuman→reset restores opening seat', () => {
    const { board, status } = mountPair();

    initCalla(board, status);
    callaVsAI('medium');
    setCallaAI('hard');
    expect(getCallaState().currentPlayer).toBe('player1');
    callaVsHuman();
    resetCalla();
    expect(getCallaState().winner).toBeNull();
    expect(isCallaTutorial()).toBe(false);

    initStar(board, status);
    starVsAI('easy');
    setStarAI('medium');
    expect(getStarState().currentPlayer).toBe('player1');
    starVsHuman();
    resetStar();
    expect(getStarState().winner).toBeNull();
    expect(isStarTutorial()).toBe(false);

    initHag(board, status);
    hagVsAI('hard');
    setHagAI('easy');
    expect(getHagState().currentPlayer).toBe('player1');
    hagVsHuman();
    resetHag();
    expect(getHagState().winner).toBeNull();
    expect(isHagTutorial()).toBe(false);
  });
});

describe('Wave 20 mode-matrix — Contig / Juggle / Queens chrome + tutorial', () => {
  it('Contig / Juggle / Queens vsAI remounts board chrome; tutorial exits', () => {
    const { board, status } = mountPair();

    initContig(board, status);
    contigVsAI('easy');
    setContigAI('hard');
    expect(board.querySelector('.contig-board, .contig-cell, table, [data-row]')).not.toBeNull();
    startContigTutorial();
    expect(isContigTutorial()).toBe(true);
    tutorialManager.exit();
    expect(isContigTutorial()).toBe(false);
    contigVsHuman();
    expect(board.innerHTML.length).toBeGreaterThan(0);

    initJuggle(board, status);
    juggleVsAI('medium');
    setJuggleAI('easy');
    expect(board.querySelector('.juggle-board, .juggle-dice, [data-row]')).not.toBeNull();
    startJuggleTutorial();
    expect(isJuggleTutorial()).toBe(true);
    tutorialManager.exit();
    expect(isJuggleTutorial()).toBe(false);
    juggleVsHuman();

    initQueens(board, status);
    queensVsAI('hard');
    setQueensAI('medium');
    expect(board.querySelector('.qg-board, svg, [data-ring]')).not.toBeNull();
    startQueensTutorial();
    expect(isQueensTutorial()).toBe(true);
    tutorialManager.exit();
    expect(isQueensTutorial()).toBe(false);
    queensVsHuman();
  });
});

describe('Wave 20 mode-matrix — FIAR / Pent state after mode flips', () => {
  it('FIAR placement phase and Pent selectPiece survive AI↔human', () => {
    const { board, status } = mountPair();

    initFiar(board, status);
    fiarVsAI('easy');
    setFiarAI('hard');
    expect(getFiarState().phase).toBe('placement');
    expect(getFiarState().chipsPlaced.player1).toBe(0);
    fiarVsHuman();
    expect(getFiarState().phase).toBe('placement');
    startFiarTutorial();
    expect(isFiarTutorial()).toBe(true);
    tutorialManager.exit();
    expect(isFiarTutorial()).toBe(false);

    initPent(board, status);
    pentVsAI('medium');
    expect(getPentState().phase).toBe('selectPiece');
    expect(getPentState().currentPlayer).toBe('player1');
    pentVsHuman();
    expect(getPentState().phase).toBe('selectPiece');
    startPentTutorial();
    expect(isPentTutorial()).toBe(true);
    tutorialManager.exit();
    expect(isPentTutorial()).toBe(false);
  });

  it('Hex tutorial start then exit does not leave tutorial sticky after vsAI', () => {
    const { board, status } = mountPair();
    initHex(board, status);
    startHexTutorial();
    expect(isHexTutorial()).toBe(true);
    tutorialManager.exit();
    hexVsAI('medium');
    expect(isHexTutorial()).toBe(false);
    expect(getHexState().currentPlayer).toBe('player1');
    startCallaTutorial();
    // wrong game tutorial should still be exit-able
    tutorialManager.exit();
    expect(isCallaTutorial()).toBe(false);
    startStarTutorial();
    tutorialManager.exit();
    expect(isStarTutorial()).toBe(false);
    startHagTutorial();
    tutorialManager.exit();
    expect(isHagTutorial()).toBe(false);
  });
});
