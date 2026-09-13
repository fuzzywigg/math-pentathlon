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
  startTutorial as startJuggleTutorial,
  isTutorialActive as isJuggleTutorial,
} from '../../src/games/juggle/game-controller';
import {
  initGame as initHexAGone,
  newGameVsHuman as hexAGoneVsHuman,
  newGameVsAI as hexAGoneVsAI,
  getGameState as getHexAGoneState,
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
  startTutorial as startFiarTutorial,
  isTutorialActive as isFiarTutorial,
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
  initGame as initContig,
  newGameVsHuman as contigVsHuman,
  newGameVsAI as contigVsAI,
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
  startTutorial as startStarTutorial,
  isTutorialActive as isStarTutorial,
} from '../../src/games/star-track/game-controller';
import {
  initGame as initQueens,
  newGameVsHuman as queensVsHuman,
  newGameVsAI as queensVsAI,
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
    expect(board.querySelector('.star-track-board, .star-track-draw-btn')).toBeTruthy();
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
    expect(status.querySelector('.qg-status, [role="status"]') || status.textContent)
      .toBeTruthy();
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
