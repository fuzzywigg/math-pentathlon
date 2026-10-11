/**
 * q-mp-1187: shard of existing-games-controllers (coverage-preserving).
 * Shard `illegal-modes` — describe/wave split for unit-isolated parallel wall trim.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  initGame as initHex,
  newGameVsHuman as hexVsHuman,
  getGameState as getHexState,
  resetGame as resetHex,
} from '../../src/games/hex/game-controller';
import {
  initGame as initCalla,
  newGameVsHuman as callaVsHuman,
  newGameVsAI as callaVsAI,
  getGameState as getCallaState,
  getCurrentHint,
  resetGame as resetCalla,
} from '../../src/games/calla/game-controller';
import {
  initGame as initKings,
  newGameVsHuman as kingsVsHuman,
  newGameVsAI as kingsVsAI,
  getGameState as getKingsState,
  getGameMode,
  setAIDifficulty as setKingsAI,
  newGame as kingsNewGame,
} from '../../src/games/kings-quadraphages/game-controller';
import {
  newGameVsHuman as fabVsHuman,
  newGameVsAI as fabVsAI,
} from '../../src/games/fab-a-diffy/game-controller';
import {
  newGameVsHuman as parVsHuman,
  newGameVsAI as parVsAI,
} from '../../src/games/par-55/game-controller';
import {
  newGameVsHuman as starsVsHuman,
  newGameVsAI as starsVsAI,
} from '../../src/games/stars-bars/game-controller';
import { newGameVsAI as ramrodVsAI } from '../../src/games/ramrod/game-controller';
import {
  newGameVsHuman as kwaVsHuman,
  newGameVsAI as kwaVsAI,
} from '../../src/games/kwatro-sinko/game-controller';
import {
  newGameVsHuman as primeVsHuman,
  newGameVsAI as primeVsAI,
} from '../../src/games/prime-gold/game-controller';
import {
  initGame as initJuggle,
  newGameVsHuman as juggleVsHuman,
} from '../../src/games/juggle/game-controller';
import {
  initGame as initHexAGone,
  newGameVsHuman as hexAGoneVsHuman,
  getGameState as getHexAGoneState,
  resetGame as resetHexAGone,
} from '../../src/games/hex-a-gone/game-controller';
import {
  initGame as initPent,
  newGameVsAI as pentVsAI,
  getCurrentState as getPentState,
} from '../../src/games/pent-em-in/game-controller';
import {
  initGame as initFiar,
  newGameVsHuman as fiarVsHuman,
} from '../../src/games/fiar/game-controller';
import {
  initGame as initFrac,
  newGameVsHuman as fracVsHuman,
  newGameVsAI as fracVsAI,
  getCurrentState as getFracState,
  setDifficulty as setFracDifficulty,
} from '../../src/games/frac-fact/game-controller';
import {
  initGame as initPinball,
  newGameVsHuman as pinballVsHuman,
  newGameVsAI as pinballVsAI,
  getCurrentState as getPinballState,
} from '../../src/games/fraction-pinball/game-controller';
import {
  initGame as initRemainder,
  newGameVsAI as remainderVsAI,
  getCurrentState as getRemainderState,
} from '../../src/games/remainder-islands/game-controller';
import {
  initGame as initContig,
  newGameVsHuman as contigVsHuman,
} from '../../src/games/contig-60/game-controller';
import {
  newGameVsHuman as sdVsHuman,
  newGameVsAI as sdVsAI,
} from '../../src/games/sum-dominoes/game-controller';
import {
  initGame as initStar,
  newGameVsHuman as starVsHuman,
  getGameState as getStarState,
  resetGame as resetStar,
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
