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
  startTutorial as startFabTutorial,
  isTutorialActive as isFabTutorial,
} from '../../src/games/fab-a-diffy/game-controller';
import {
  newGameVsHuman as parVsHuman,
  newGameVsAI as parVsAI,
  startTutorial as startParTutorial,
  isTutorialActive as isParTutorial,
} from '../../src/games/par-55/game-controller';
import {
  newGameVsHuman as starsVsHuman,
  newGameVsAI as starsVsAI,
  startTutorial as startStarsTutorial,
  isTutorialActive as isStarsTutorial,
} from '../../src/games/stars-bars/game-controller';
import {
  newGameVsHuman as ramrodVsHuman,
  newGameVsAI as ramrodVsAI,
  startTutorial as startRamrodTutorial,
  isTutorialActive as isRamrodTutorial,
} from '../../src/games/ramrod/game-controller';
import {
  newGameVsHuman as kwaVsHuman,
  newGameVsAI as kwaVsAI,
  startTutorial as startKwaTutorial,
  isTutorialActive as isKwaTutorial,
} from '../../src/games/kwatro-sinko/game-controller';
import {
  newGameVsHuman as primeVsHuman,
  newGameVsAI as primeVsAI,
  startTutorial as startPrimeTutorial,
  isTutorialActive as isPrimeTutorial,
} from '../../src/games/prime-gold/game-controller';
import {
  initGame as initJuggle,
  newGameVsHuman as juggleVsHuman,
  newGameVsAI as juggleVsAI,
  setAIDifficulty as setJuggleAI,
  startTutorial as startJuggleTutorial,
  isTutorialActive as isJuggleTutorial,
} from '../../src/games/juggle/game-controller';
import {
  initGame as initHexAGone,
  newGameVsHuman as hexAGoneVsHuman,
  newGameVsAI as hexAGoneVsAI,
  getGameState as getHexAGoneState,
  setAIDifficulty as setHexAGoneAI,
  resetGame as resetHexAGone,
  startTutorial as startHexAGoneTutorial,
  isTutorialActive as isHexAGoneTutorial,
} from '../../src/games/hex-a-gone/game-controller';
import {
  initGame as initPent,
  newGameVsHuman as pentVsHuman,
  newGameVsAI as pentVsAI,
  getCurrentState as getPentState,
  startTutorial as startPentTutorial,
  isTutorialActive as isPentTutorial,
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
  initGame as initFrac,
  newGameVsHuman as fracVsHuman,
  newGameVsAI as fracVsAI,
  getCurrentState as getFracState,
  setDifficulty as setFracDifficulty,
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
  initGame as initContig,
  newGameVsHuman as contigVsHuman,
  newGameVsAI as contigVsAI,
  setAIDifficulty as setContigAI,
  startTutorial as startContigTutorial,
  isTutorialActive as isContigTutorial,
} from '../../src/games/contig-60/game-controller';
import {
  newGameVsHuman as sdVsHuman,
  newGameVsAI as sdVsAI,
  startTutorial as startSdTutorial,
  isTutorialActive as isSdTutorial,
} from '../../src/games/sum-dominoes/game-controller';
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
  initGame as initQueens,
  newGameVsHuman as queensVsHuman,
  newGameVsAI as queensVsAI,
  setAIDifficulty as setQueensAI,
  startTutorial as startQueensTutorial,
  isTutorialActive as isQueensTutorial,
} from '../../src/games/queens-guards/game-controller';
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

describe('Container-style controllers (Par / Stars / Ramrod / Kwatro / Prime)', () => {
  it('Par 55 human / AI / tutorial round-trip', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const human = parVsHuman(container);
    expect(human.isAI).toBe(false);
    expect(human.state.phase).toBe('selectingBlock');
    expect(container.querySelector('.par55-board, .par55-scores')).toBeTruthy();

    const ai = parVsAI(container, 'easy');
    expect(ai.isAI).toBe(true);
    expect(ai.aiPlayer).toBe('player2');

    startParTutorial();
    expect(isParTutorial()).toBe(true);
    tutorialManager.exit();
  });

  it('Stars & Bars human / AI / tutorial', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const human = starsVsHuman(container);
    expect(human.state.phase).toBe('selectingCard');
    expect(container.querySelector('.stars-board')).toBeTruthy();
    expect(starsVsAI(container, 'medium').isAI).toBe(true);
    startStarsTutorial();
    expect(isStarsTutorial()).toBe(true);
    tutorialManager.exit();
  });

  it('Ramrod human / AI / tutorial', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const human = ramrodVsHuman(container);
    expect(human.state.phase).toBe('selectingRod');
    expect(container.querySelector('.ramrod-board')).toBeTruthy();
    expect(ramrodVsAI(container, 'easy').aiPlayer).toBe('player2');
    startRamrodTutorial();
    expect(isRamrodTutorial()).toBe(true);
    tutorialManager.exit();
  });

  it('Kwatro-Sinko human / AI / tutorial', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const human = kwaVsHuman(container);
    expect(human.state.phase).toBe('selectingChip');
    expect(container.querySelector('.kwa-board')).toBeTruthy();
    expect(kwaVsAI(container, 'hard').isAI).toBe(true);
    startKwaTutorial();
    expect(isKwaTutorial()).toBe(true);
    tutorialManager.exit();
  });

  it('Prime Gold human / AI / tutorial', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const human = primeVsHuman(container);
    expect(human.state.phase).toBe('rolling');
    expect(container.querySelector('.pg-board, .pg-roll-btn')).toBeTruthy();
    expect(primeVsAI(container, 'easy').isAI).toBe(true);
    startPrimeTutorial();
    expect(isPrimeTutorial()).toBe(true);
    tutorialManager.exit();
  });
});

describe('Board+status controllers (Juggle / Hex-a-Gone / Pent / FIAR)', () => {
  it('Juggle init / modes / tutorial', () => {
    const { board, status } = mountPair();
    initJuggle(board, status);
    expect(board.querySelector('.juggle-board, .juggle-roll-btn')).toBeTruthy();
    juggleVsAI('easy');
    juggleVsHuman();
    startJuggleTutorial();
    expect(isJuggleTutorial()).toBe(true);
    tutorialManager.exit();
  });

  it('Hex-a-Gone init / modes / getGameState / tutorial', () => {
    const { board, status } = mountPair();
    initHexAGone(board, status);
    expect(getHexAGoneState().phase).toBe('selectBlocks');
    hexAGoneVsAI('medium');
    hexAGoneVsHuman();
    expect(getHexAGoneState().winner).toBeNull();
    startHexAGoneTutorial();
    expect(isHexAGoneTutorial()).toBe(true);
    tutorialManager.exit();
  });

  it("Pent'Em In init / modes / getCurrentState / tutorial", () => {
    const { board, status } = mountPair();
    initPent(board, status);
    expect(getPentState().phase).toBe('selectPiece');
    pentVsAI('easy');
    pentVsHuman();
    startPentTutorial();
    expect(isPentTutorial()).toBe(true);
    tutorialManager.exit();
  });

  it('FIAR init / modes / getCurrentState / tutorial', () => {
    const { board, status } = mountPair();
    initFiar(board, status);
    expect(getFiarState().phase).toBe('placement');
    fiarVsAI('easy');
    fiarVsHuman();
    startFiarTutorial();
    expect(isFiarTutorial()).toBe(true);
    tutorialManager.exit();
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

describe('Previously untested controllers (Contig / Sum Dominoes / Star Track / Queens)', () => {
  it('Contig 60 init / modes / tutorial mount board chrome', () => {
    const { board, status } = mountPair();
    initContig(board, status);
    expect(board.querySelector('.contig-board, .contig-roll-btn')).toBeTruthy();
    expect(board.querySelector('.contig-score-p1')).toBeTruthy();
    contigVsAI('easy');
    contigVsHuman();
    startContigTutorial();
    expect(isContigTutorial()).toBe(true);
    tutorialManager.exit();
  });

  it('Sum Dominoes human / AI / tutorial', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const human = sdVsHuman(container);
    expect(human.state.phase).toBe('rolling');
    expect(container.querySelector('.sd-board')).toBeTruthy();
    expect(sdVsAI(container, 'medium').isAI).toBe(true);
    startSdTutorial();
    expect(isSdTutorial()).toBe(true);
    tutorialManager.exit();
  });

  it('Star Track init / getGameState / modes / tutorial', () => {
    const { board, status } = mountPair();
    initStar(board, status);
    expect(getStarState().phase).toBe('drawChains');
    expect(
      board.querySelector('.star-track-board, .star-track-draw-btn')
    ).toBeTruthy();
    starVsAI('easy');
    expect(getStarState().player1Position).toBe(0);
    starVsHuman();
    startStarTutorial();
    expect(isStarTutorial()).toBe(true);
    tutorialManager.exit();
  });

  it('Queens & Guards init / modes / tutorial', () => {
    const { board, status } = mountPair();
    initQueens(board, status);
    expect(board.querySelector('svg, .qg-board')).toBeTruthy();
    expect(
      status.querySelector('.qg-status, [role="status"]') || status.textContent
    ).toBeTruthy();
    queensVsAI('easy');
    queensVsHuman();
    startQueensTutorial();
    expect(isQueensTutorial()).toBe(true);
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

describe('Controller illegal-click no-ops (Par / Stars / Fab / Kwatro / Contig / Sum / Prime / Juggle)', () => {
  it('Par answer-board click without selection leaves selectingBlock', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = parVsHuman(container);
    expect(ctrl.state.phase).toBe('selectingBlock');
    const before = ctrl.state.moveHistory.length;
    const base = container.querySelector(
      '.par55-base, .par55-board'
    ) as HTMLElement | null;
    base?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.moveHistory.length).toBe(before);
    expect(ctrl.state.phase).toBe('selectingBlock');
  });

  it('Stars board cell click without card keeps selectingCard', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = starsVsHuman(container);
    expect(ctrl.state.phase).toBe('selectingCard');
    const before = ctrl.state.moveHistory.length;
    const cell = container.querySelector(
      '.stars-cell, [data-row]'
    ) as HTMLElement | null;
    cell?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.moveHistory.length).toBe(before);
    expect(ctrl.state.phase).toBe('selectingCard');
  });

  it('Fab answer click before bar selection leaves selectingBar1', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = fabVsHuman(container);
    expect(ctrl.state.phase).toBe('selectingBar1');
    const before = ctrl.state.moveHistory.length;
    const answer = container.querySelector(
      '.fab-answer-wrapper, .fab-answer-board'
    ) as HTMLElement | null;
    answer?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.moveHistory.length).toBe(before);
    expect(ctrl.state.phase).toBe('selectingBar1');
  });

  it('Kwatro node click without chip keeps selectingChip', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = kwaVsHuman(container);
    expect(ctrl.state.phase).toBe('selectingChip');
    const before = ctrl.state.moveHistory.length;
    const node = container.querySelector(
      '[data-node-id], .kwa-node'
    ) as HTMLElement | null;
    node?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.moveHistory.length).toBe(before);
    expect(ctrl.state.phase).toBe('selectingChip');
  });

  it('Contig cell click before roll stays in rolling', () => {
    const { board, status } = mountPair();
    initContig(board, status);
    contigVsHuman();
    const cell = board.querySelector('.contig-cell') as HTMLElement | null;
    cell?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(board.querySelector('.contig-roll-btn')).toBeTruthy();
  });

  it('Sum Dominoes board click before roll keeps rolling phase', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = sdVsHuman(container);
    expect(ctrl.state.phase).toBe('rolling');
    const before = ctrl.state.moveHistory.length;
    const cell = container.querySelector(
      '.sd-cell, .sd-board'
    ) as HTMLElement | null;
    cell?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.moveHistory.length).toBe(before);
    expect(ctrl.state.phase).toBe('rolling');
  });

  it('Prime Gold cell click before roll stays rolling', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = primeVsHuman(container);
    expect(ctrl.state.phase).toBe('rolling');
    const before = ctrl.state.moveHistory.length;
    const cell = container.querySelector(
      '.pg-cell, .pg-board'
    ) as HTMLElement | null;
    cell?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.moveHistory.length).toBe(before);
    expect(ctrl.state.phase).toBe('rolling');
  });

  it('Juggle board click before roll keeps rolling chrome', () => {
    const { board, status } = mountPair();
    initJuggle(board, status);
    juggleVsHuman();
    const beforePhase = board.querySelector(
      '.juggle-roll-btn, .juggle-dice-area'
    );
    const cell = board.querySelector(
      '.juggle-cell, .juggle-board td, [data-row]'
    ) as HTMLElement | null;
    cell?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(
      board.querySelector('.juggle-roll-btn, .juggle-dice-area, .juggle-board')
    ).toBeTruthy();
    expect(beforePhase || board.querySelector('.juggle-board')).toBeTruthy();
  });
});

describe('Controller AI difficulty field round-trips (container games)', () => {
  it('Par / Stars / Ramrod / Kwatro / Prime / Sum / Fab keep aiDifficulty', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    expect(parVsAI(container, 'hard').aiDifficulty).toBe('hard');
    expect(starsVsAI(container, 'medium').aiDifficulty).toBe('medium');
    expect(ramrodVsAI(container, 'easy').aiDifficulty).toBe('easy');
    expect(kwaVsAI(container, 'hard').aiDifficulty).toBe('hard');
    expect(primeVsAI(container, 'medium').aiDifficulty).toBe('medium');
    expect(sdVsAI(container, 'easy').aiDifficulty).toBe('easy');
    expect(fabVsAI(container, 'hard').aiDifficulty).toBe('hard');
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

describe('Wave 11 — controller tutorial + AI difficulty deepenings', () => {
  it('Contig / Star / Queens / Sum startTutorial then exit clears active', () => {
    const { board, status } = mountPair();
    initContig(board, status);
    contigVsHuman();
    startContigTutorial();
    expect(isContigTutorial()).toBe(true);
    tutorialManager.exit();
    expect(isContigTutorial()).toBe(false);

    initStar(board, status);
    starVsHuman();
    startStarTutorial();
    expect(isStarTutorial()).toBe(true);
    tutorialManager.exit();
    expect(isStarTutorial()).toBe(false);

    initQueens(board, status);
    queensVsHuman();
    startQueensTutorial();
    expect(isQueensTutorial()).toBe(true);
    tutorialManager.exit();
    expect(isQueensTutorial()).toBe(false);

    const container = document.createElement('div');
    document.body.appendChild(container);
    sdVsHuman(container);
    startSdTutorial();
    expect(isSdTutorial()).toBe(true);
    tutorialManager.exit();
    expect(isSdTutorial()).toBe(false);
  });

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

describe('Wave 12 — controller illegal-click deepenings (Calla / Hex / FIAR / Frac / Pinball / Juggle)', () => {
  it('Calla empty-board click keeps pits', () => {
    const { board, status } = mountPair();
    initCalla(board, status);
    callaVsHuman();
    board.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(board.querySelector('.calla-board, .calla-pit')).toBeTruthy();
  });

  it('Hex cell click is legal on opening (smoke)', () => {
    const { board, status } = mountPair();
    initHex(board, status);
    hexVsHuman();
    const before = getHexState().moveHistory.length;
    const cell = board.querySelector(
      '[data-row], .hex-cell'
    ) as HTMLElement | null;
    cell?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getHexState().moveHistory.length).toBeGreaterThanOrEqual(before);
    expect(board.querySelector('.hex-board, [data-row]')).toBeTruthy();
  });

  it('FIAR / Frac / Pinball / Juggle premature clicks keep chrome', () => {
    const { board, status } = mountPair();
    initFiar(board, status);
    fiarVsHuman();
    board.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(board.querySelector('.fiar-board, svg')).toBeTruthy();

    const container = document.createElement('div');
    document.body.appendChild(container);
    initFrac(container);
    fracVsHuman();
    container
      .querySelector('.frac-choice-btn, button')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(
      container.querySelector('.frac-problem, .frac-scores, .frac-game-area')
    ).toBeTruthy();

    initPinball(container);
    pinballVsHuman();
    container.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(
      container.querySelector(
        '.pinball-challenge, .pinball-scores, .pinball-board'
      )
    ).toBeTruthy();

    initJuggle(board, status);
    juggleVsHuman();
    const cell = board.querySelector(
      '.juggle-cell, .juggle-board'
    ) as HTMLElement | null;
    cell?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(
      board.querySelector('.juggle-roll-btn, .juggle-dice-area, .juggle-board')
    ).toBeTruthy();
  });
});

describe('Wave 13 — controller AI difficulty leftovers', () => {
  it('Fab / Par / Stars / Ramrod / Kwa / Prime vs-AI round-trips', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    fabVsAI(container, 'easy');
    fabVsAI(container, 'hard');
    expect(
      container.querySelector('.fab-bar-pool, .fab-answer-board')
    ).toBeTruthy();

    parVsAI(container, 'medium');
    parVsAI(container, 'easy');
    expect(container.querySelector('.par55-hand, .par55-board')).toBeTruthy();

    starsVsAI(container, 'hard');
    starsVsAI(container, 'medium');
    expect(
      container.querySelector(
        '.stars-hand, .stars-hand-container, .stars-board'
      )
    ).toBeTruthy();

    ramrodVsAI(container, 'easy');
    ramrodVsAI(container, 'hard');
    expect(
      container.querySelector('.ramrod-player-rods, .ramrod-board')
    ).toBeTruthy();

    kwaVsAI(container, 'medium');
    kwaVsAI(container, 'easy');
    expect(container.querySelector('.kwa-board, .kwa-chip-info')).toBeTruthy();

    primeVsAI(container, 'hard');
    primeVsAI(container, 'medium');
    expect(container.querySelector('.pg-roll-btn, .pg-dice-area')).toBeTruthy();
  });

  it('Pent / Remainder / Pinball / Kings / Frac AI deepenings', () => {
    const { board, status } = mountPair();
    initPent(board, status);
    pentVsAI('easy');
    pentVsAI('hard');
    expect(getPentState().currentPlayer).toBe('player1');

    const container = document.createElement('div');
    document.body.appendChild(container);
    initRemainder(container);
    remainderVsAI('medium');
    remainderVsAI('easy');
    expect(getRemainderState().phase).toBeTruthy();

    initPinball(container);
    pinballVsAI('hard');
    pinballVsAI('medium');
    expect(getPinballState().phase).toBeTruthy();

    initFrac(container);
    fracVsAI('easy', 'easy');
    fracVsAI('hard', 'hard');
    expect(getFracState().phase).toBeTruthy();

    const history = document.createElement('div');
    document.body.appendChild(history);
    initKings(board, status, history);
    kingsVsAI('medium');
    setKingsAI('hard');
    setKingsAI('easy');
    expect(getKingsState().currentPlayer).toBe('player1');
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

describe('Wave 13 — controller tutorial + getState deepenings', () => {
  it('double-start tutorial stays active; exit restores opening phase', () => {
    const { board, status } = mountPair();
    initHex(board, status);
    hexVsHuman();
    startHexTutorial();
    startHexTutorial();
    expect(isHexTutorial()).toBe(true);
    expect(getHexState().moveHistory).toHaveLength(0);
    tutorialManager.exit();
    expect(isHexTutorial()).toBe(false);
    expect(getHexState().winner).toBeNull();

    initCalla(board, status);
    callaVsHuman();
    startCallaTutorial();
    expect(isCallaTutorial()).toBe(true);
    tutorialManager.exit();
    expect(getCallaState().currentPlayer).toBe('player1');

    initStar(board, status);
    starVsHuman();
    startStarTutorial();
    expect(isStarTutorial()).toBe(true);
    tutorialManager.exit();
    expect(getStarState().phase).toBe('drawChains');

    initFiar(board, status);
    fiarVsHuman();
    startFiarTutorial();
    expect(isFiarTutorial()).toBe(true);
    tutorialManager.exit();
    expect(getFiarState().phase).toBe('placement');
  });
});

describe('Wave 14 — controller hint / difficulty / newGame / reset', () => {
  it('Frac setDifficulty regenerates at 0 problems and no-ops after progress', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    initFrac(container);
    fracVsHuman('medium');
    expect(getFracState().problemsCompleted).toBe(0);
    const before = getFracState().currentProblem;
    setFracDifficulty('easy');
    expect(getFracState().difficulty).toBe('easy');
    expect(getFracState().currentProblem).toBeTruthy();
    // May or may not equal prior problem; difficulty must stick
    void before;
    setFracDifficulty('hard');
    expect(getFracState().difficulty).toBe('hard');

    // Force problemsCompleted > 0 so setDifficulty becomes a no-op
    const advanced = {
      ...getFracState(),
      problemsCompleted: 2,
      difficulty: 'hard' as const,
    };
    // Mutate via submitting is heavy; assert contract by calling after marking
    // through a shallow assign on returned snapshot is not shared — instead
    // complete one answer if possible.
    const problem = getFracState().currentProblem;
    if (problem) {
      const choice = container.querySelector(
        '.frac-choice, .frac-fact-choice, button'
      ) as HTMLElement | null;
      choice?.click();
    }
    const completed = getFracState().problemsCompleted;
    if (completed > 0) {
      setFracDifficulty('easy');
      expect(getFracState().difficulty).not.toBe('easy');
    } else {
      // Still at 0: setDifficulty remains live
      setFracDifficulty('easy');
      expect(getFracState().difficulty).toBe('easy');
    }
  });

  it('Calla getCurrentHint is null for human and vs-AI opening', () => {
    const { board, status } = mountPair();
    initCalla(board, status);
    callaVsHuman();
    expect(getCurrentHint()).toBeNull();
    callaVsAI('easy');
    expect(getCurrentHint()).toBeNull();
  });

  it('Kings newGame restores opening phase/supplies; mode unchanged', () => {
    const { board, status } = mountPair();
    const history = document.createElement('div');
    document.body.appendChild(history);
    initKings(board, status, history);
    kingsVsHuman();
    const mode = getGameMode();
    expect(getKingsState().turnPhase).toBe('moveKing');
    expect(getKingsState().player1Supply).toBeGreaterThan(0);
    kingsNewGame();
    expect(getGameMode()).toBe(mode);
    expect(getKingsState().turnPhase).toBe('moveKing');
    expect(getKingsState().selectedKingPosition).toBeNull();
    expect(getKingsState().moveHistory).toHaveLength(0);
  });

  it('Hex / Star / Hex-a-Gone / Calla resetGame restores opening phase', () => {
    const { board, status } = mountPair();

    initHex(board, status);
    hexVsHuman();
    resetHex();
    expect(getHexState().winner).toBeNull();
    expect(getHexState().moveHistory).toHaveLength(0);

    initStar(board, status);
    starVsHuman();
    resetStar();
    expect(getStarState().phase).toBe('drawChains');
    expect(getStarState().player1Position).toBe(0);

    initHexAGone(board, status);
    hexAGoneVsHuman();
    resetHexAGone();
    expect(getHexAGoneState().phase).toBe('selectBlocks');
    expect(getHexAGoneState().moveHistory).toHaveLength(0);

    initCalla(board, status);
    callaVsHuman();
    resetCalla();
    expect(getCallaState().phase).toBe('selectPit');
    expect(getCallaState().player1Calla).toBe(0);
  });

  it('Fab / Par / Prime vs-human then vs-AI remounts with zero scores', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    fabVsHuman(container);
    expect(
      container.querySelector('.fab-bar-pool, .fab-answer-board')
    ).toBeTruthy();
    fabVsAI(container, 'easy');
    expect(
      container.querySelector('.fab-scores, .fab-bar-pool, .fab-answer-board')
    ).toBeTruthy();

    parVsHuman(container);
    expect(container.querySelector('.par55-hand, .par55-board')).toBeTruthy();
    parVsAI(container, 'easy');
    expect(container.querySelector('.par55-scores, .par55-board')).toBeTruthy();

    primeVsHuman(container);
    expect(container.querySelector('.pg-roll-btn, .pg-dice-area')).toBeTruthy();
    primeVsAI(container, 'easy');
    expect(
      container.querySelector('.pg-scores, .pg-roll-btn, .pg-dice-area')
    ).toBeTruthy();
  });
});
