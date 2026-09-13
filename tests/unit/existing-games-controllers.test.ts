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
  initGame as initStarTrack,
  newGameVsHuman as starTrackVsHuman,
  newGameVsAI as starTrackVsAI,
  getGameState as getStarTrackState,
  setAIDifficulty as setStarTrackAI,
  resetGame as resetStarTrack,
  startTutorial as startStarTrackTutorial,
  isTutorialActive as isStarTrackTutorial,
} from '../../src/games/star-track/game-controller';
import {
  newGameVsHuman as sdVsHuman,
  newGameVsAI as sdVsAI,
  startTutorial as startSdTutorial,
  isTutorialActive as isSdTutorial,
} from '../../src/games/sum-dominoes/game-controller';
import {
  initGame as initContig,
  newGameVsHuman as contigVsHuman,
  newGameVsAI as contigVsAI,
  setAIDifficulty as setContigAI,
  startTutorial as startContigTutorial,
  isTutorialActive as isContigTutorial,
} from '../../src/games/contig-60/game-controller';
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
  initGame as initPent,
  newGameVsHuman as pentVsHuman,
  newGameVsAI as pentVsAI,
  getCurrentState as getPentState,
  startTutorial as startPentTutorial,
  isTutorialActive as isPentTutorial,
} from '../../src/games/pent-em-in/game-controller';
import {
  initGame as initRemainder,
  newGameVsHuman as remainderVsHuman,
  newGameVsAI as remainderVsAI,
  getCurrentState as getRemainderState,
  startTutorial as startRemainderTutorial,
  isTutorialActive as isRemainderTutorial,
} from '../../src/games/remainder-islands/game-controller';
import {
  initGame as initJuggle,
  newGameVsHuman as juggleVsHuman,
  newGameVsAI as juggleVsAI,
  setAIDifficulty as setJuggleAI,
  startTutorial as startJuggleTutorial,
  isTutorialActive as isJuggleTutorial,
} from '../../src/games/juggle/game-controller';
import {
  newGameVsHuman as ramrodVsHuman,
  newGameVsAI as ramrodVsAI,
  startTutorial as startRamrodTutorial,
  isTutorialActive as isRamrodTutorial,
} from '../../src/games/ramrod/game-controller';
import {
  newGameVsHuman as primeVsHuman,
  newGameVsAI as primeVsAI,
  startTutorial as startPrimeTutorial,
  isTutorialActive as isPrimeTutorial,
} from '../../src/games/prime-gold/game-controller';
import {
  newGameVsHuman as starsVsHuman,
  newGameVsAI as starsVsAI,
  startTutorial as startStarsTutorial,
  isTutorialActive as isStarsTutorial,
} from '../../src/games/stars-bars/game-controller';
import {
  newGameVsHuman as par55VsHuman,
  newGameVsAI as par55VsAI,
  startTutorial as startPar55Tutorial,
  isTutorialActive as isPar55Tutorial,
} from '../../src/games/par-55/game-controller';
import {
  newGameVsHuman as kwaVsHuman,
  newGameVsAI as kwaVsAI,
  startTutorial as startKwaTutorial,
  isTutorialActive as isKwaTutorial,
} from '../../src/games/kwatro-sinko/game-controller';
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

describe('Star Track game-controller', () => {
  it('init / modes / reset expose drawChains phase', () => {
    const { board, status } = mountPair();
    initStarTrack(board, status);
    expect(getStarTrackState().phase).toBe('drawChains');
    expect(getStarTrackState().currentPlayer).toBe('player1');

    starTrackVsAI('easy');
    setStarTrackAI('hard');
    resetStarTrack();
    expect(getStarTrackState().phase).toBe('drawChains');

    starTrackVsHuman();
    startStarTrackTutorial();
    expect(isStarTrackTutorial()).toBe(true);
    tutorialManager.exit();
  });
});

describe('Sum Dominoes game-controller', () => {
  it('vsHuman / vsAI return rolling-phase controllers', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const human = sdVsHuman(container);
    expect(human.isAI).toBe(false);
    expect(human.state.phase).toBe('rolling');
    expect(container.querySelector('.sd-game-area, .sd-status')).toBeTruthy();

    const ai = sdVsAI(container, 'easy');
    expect(ai.isAI).toBe(true);
    expect(ai.aiPlayer).toBe('player2');

    startSdTutorial();
    expect(isSdTutorial()).toBe(true);
    tutorialManager.exit();
  });
});

describe('Contig 60 game-controller', () => {
  it('init / modes / tutorial mount board chrome', () => {
    const { board, status } = mountPair();
    initContig(board, status);
    expect(board.querySelector('.contig-board, .contig-cell')).toBeTruthy();

    contigVsAI('easy');
    setContigAI('medium');
    contigVsHuman();
    startContigTutorial();
    expect(isContigTutorial()).toBe(true);
    tutorialManager.exit();
  });
});

describe('Hex-a-Gone game-controller', () => {
  it('init / modes expose selectBlocks and bank', () => {
    const { board, status } = mountPair();
    initHexAGone(board, status);
    expect(getHexAGoneState().phase).toBe('selectBlocks');
    expect(getHexAGoneState().board.length).toBeGreaterThan(0);

    hexAGoneVsAI('easy');
    setHexAGoneAI('hard');
    resetHexAGone();
    expect(getHexAGoneState().winner).toBeNull();

    hexAGoneVsHuman();
    startHexAGoneTutorial();
    expect(isHexAGoneTutorial()).toBe(true);
    tutorialManager.exit();
  });
});

describe('Queens & Guards game-controller', () => {
  it('init / modes / tutorial mount qg board', () => {
    const { board, status } = mountPair();
    initQueens(board, status);
    expect(
      board.querySelector('.qg-board, .qg-board-container, svg')
    ).toBeTruthy();

    queensVsAI('easy');
    setQueensAI('medium');
    queensVsHuman();
    startQueensTutorial();
    expect(isQueensTutorial()).toBe(true);
    tutorialManager.exit();
  });
});

describe('FIAR game-controller', () => {
  it('init / modes start in placement with zero chips', () => {
    const { board, status } = mountPair();
    initFiar(board, status);
    expect(getFiarState().phase).toBe('placement');
    expect(getFiarState().chipsPlaced.player1).toBe(0);

    fiarVsAI('easy');
    setFiarAI('hard');
    fiarVsHuman();
    expect(getFiarState().winner).toBeNull();

    startFiarTutorial();
    expect(isFiarTutorial()).toBe(true);
    tutorialManager.exit();
  });
});

describe('Frac Fact game-controller', () => {
  it('init / difficulty / AI expose playing phase', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    initFrac(container);
    expect(getFracState().phase).toBe('playing');
    expect(getFracState().currentProblem).toBeTruthy();

    setFracDifficulty('easy');
    expect(getFracState().difficulty).toBe('easy');

    fracVsAI('medium', 'easy');
    fracVsHuman('hard');
    expect(getFracState().difficulty).toBe('hard');

    startFracTutorial();
    expect(isFracTutorial()).toBe(true);
    tutorialManager.exit();
  });
});

describe('Fraction Pinball game-controller', () => {
  it('init / modes expose answering phase', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    initPinball(container);
    expect(getPinballState().phase).toBe('answering');

    pinballVsAI('easy');
    pinballVsHuman();
    expect(getPinballState().winner).toBeNull();

    startPinballTutorial();
    expect(isPinballTutorial()).toBe(true);
    tutorialManager.exit();
  });
});

describe("Pent'Em In game-controller", () => {
  it('init / modes expose selectPiece phase', () => {
    const { board, status } = mountPair();
    initPent(board, status);
    expect(getPentState().phase).toBe('selectPiece');
    expect(board.querySelector('.pent-board, svg')).toBeTruthy();

    pentVsAI('easy');
    pentVsHuman();
    startPentTutorial();
    expect(isPentTutorial()).toBe(true);
    tutorialManager.exit();
  });
});

describe('Remainder Islands game-controller', () => {
  it('init / modes start rolling with chips', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    initRemainder(container);
    expect(getRemainderState().phase).toBe('rolling');
    expect(getRemainderState().player1Chips).toBeGreaterThan(0);

    remainderVsAI('easy');
    remainderVsHuman();
    startRemainderTutorial();
    expect(isRemainderTutorial()).toBe(true);
    tutorialManager.exit();
  });
});

describe('Juggle game-controller', () => {
  it('init / modes / tutorial mount juggle chrome', () => {
    const { board, status } = mountPair();
    initJuggle(board, status);
    expect(
      board.querySelector('.juggle-board, .juggle-grid, canvas, svg')
    ).toBeTruthy();

    juggleVsAI('easy');
    setJuggleAI('medium');
    juggleVsHuman();
    startJuggleTutorial();
    expect(isJuggleTutorial()).toBe(true);
    tutorialManager.exit();
  });
});

describe('Ramrod / Prime Gold / Stars & Bars / Par 55 / Kwatro controllers', () => {
  it('container-style controllers mount chrome and support tutorials', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const ramrod = ramrodVsHuman(container);
    expect(ramrod.isAI).toBe(false);
    expect(ramrod.state.currentPlayer).toBe('player1');
    expect(ramrodVsAI(container, 'easy').isAI).toBe(true);
    startRamrodTutorial();
    expect(isRamrodTutorial()).toBe(true);
    tutorialManager.exit();

    const prime = primeVsHuman(container);
    expect(prime.state.phase).toBeTruthy();
    expect(primeVsAI(container, 'easy').aiPlayer).toBe('player2');
    startPrimeTutorial();
    expect(isPrimeTutorial()).toBe(true);
    tutorialManager.exit();

    const stars = starsVsHuman(container);
    expect(stars.state.phase).toBe('selectingCard');
    expect(starsVsAI(container, 'easy').isAI).toBe(true);
    startStarsTutorial();
    expect(isStarsTutorial()).toBe(true);
    tutorialManager.exit();

    const par = par55VsHuman(container);
    expect(par.state.phase).toBe('selectingBlock');
    expect(par55VsAI(container, 'easy').isAI).toBe(true);
    startPar55Tutorial();
    expect(isPar55Tutorial()).toBe(true);
    tutorialManager.exit();

    const kwa = kwaVsHuman(container);
    expect(kwa.state.currentPlayer).toBe('player1');
    expect(kwaVsAI(container, 'easy').isAI).toBe(true);
    startKwaTutorial();
    expect(isKwaTutorial()).toBe(true);
    tutorialManager.exit();
  });
});
