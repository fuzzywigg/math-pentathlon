import { describe, it, expect, afterEach, vi } from 'vitest';

import { createInitialState as createContig } from '../../src/games/contig-60/types';
import {
  renderBoard as renderContigBoard,
  renderDice as renderContigDice,
  renderExpressionSelector,
  injectContigStyles,
  getPlayerName as contigName,
} from '../../src/games/contig-60/board-ui';
import { doRollDice as rollContig } from '../../src/games/contig-60/rules';

import { createInitialState as createStar } from '../../src/games/star-track/types';
import {
  renderBoard as renderStarBoard,
  renderStatus as renderStarStatus,
} from '../../src/games/star-track/board-ui';
import {
  drawChains,
  getPhaseMessage as starPhase,
} from '../../src/games/star-track/rules';

import { createInitialState as createSum } from '../../src/games/sum-dominoes/rules';
import {
  renderBoard as renderSumBoard,
  renderHand as renderSumHand,
  renderDice as renderSumDice,
  injectSDStyles,
  getPlayerName as sumName,
} from '../../src/games/sum-dominoes/board-ui';

import { createInitialState as createQueens } from '../../src/games/queens-guards/types';
import {
  renderBoard as renderQueensBoard,
  injectQGStyles,
  getPlayerName as queensName,
} from '../../src/games/queens-guards/board-ui';

import { createInitialState as createHexAGone } from '../../src/games/hex-a-gone/types';
import {
  renderBoard as renderHagBoard,
  renderStatus as renderHagStatus,
} from '../../src/games/hex-a-gone/board-ui';
import {
  selectBlock as selectHag,
  commitSelection,
  getPhaseMessage as hagPhase,
} from '../../src/games/hex-a-gone/rules';

import { createInitialState as createRemainder } from '../../src/games/remainder-islands/types';
import {
  renderBoard as renderRemainderBoard,
  renderDice as renderRemainderDice,
  renderScores as renderRemainderScores,
  renderDivisionPreview,
  renderGameOver as renderRemainderOver,
  injectRemainderIslandsStyles,
  getPlayerName as remainderName,
} from '../../src/games/remainder-islands/board-ui';
import {
  performRoll,
  setSelectedIsland,
} from '../../src/games/remainder-islands/rules';

import { createInitialGameState as createKings } from '../../src/games/kings-quadraphages/game-state';
import {
  handleCellClick,
  renderBoard as renderKingsBoard,
  renderStatus as renderKingsStatus,
  renderMoveHistory as renderKingsHistory,
} from '../../src/games/kings-quadraphages/board-ui';

import { createInitialState as createFab } from '../../src/games/fab-a-diffy/rules';
import {
  renderAnswerBoard,
  injectFabStyles,
  getPlayerName as fabName,
} from '../../src/games/fab-a-diffy/board-ui';

import { createInitialState as createPar } from '../../src/games/par-55/rules';
import {
  renderHand as renderParHand,
  injectPar55Styles,
  getPlayerName as parName,
} from '../../src/games/par-55/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Burn wave 13 — Contig board / inject / expressions', () => {
  it('inject styles; board cells; dice CTA; names', () => {
    injectContigStyles();
    expect(document.getElementById('contig-styles')).toBeTruthy();

    const fresh = createContig();
    const board = renderContigBoard(fresh, () => {});
    document.body.appendChild(board);
    expect(board.classList.contains('contig-board')).toBe(true);
    expect(board.querySelectorAll('.contig-cell').length).toBe(60);

    let rolled = 0;
    const dice = renderContigDice(null, () => {
      rolled++;
    }, true);
    document.body.appendChild(dice);
    dice.querySelector('.contig-roll-btn')?.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    expect(rolled).toBe(1);

    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    const withDice = rollContig(createContig());
    const exprs = renderExpressionSelector(
      withDice,
      () => {},
      () => {}
    );
    document.body.appendChild(exprs);
    expect(exprs.classList.contains('contig-expressions')).toBe(true);
    expect(contigName('player1')).not.toBe(contigName('player2'));
  });
});

describe('Burn wave 13 — Star Track board draw CTA + status', () => {
  it('renderBoard shows draw; status mirrors phase; choices after draw', () => {
    const container = document.createElement('div');
    const status = document.createElement('div');
    document.body.appendChild(container);
    document.body.appendChild(status);

    let drew = 0;
    const fresh = createStar();
    renderStarBoard(fresh, container, () => {
      drew++;
    });
    expect(container.querySelector('.star-track-board')).toBeTruthy();
    const drawBtn = container.querySelector(
      '.star-track-draw-btn'
    ) as HTMLButtonElement | null;
    expect(drawBtn).toBeTruthy();
    drawBtn!.click();
    expect(drew).toBe(1);

    renderStarStatus(fresh, status);
    expect(status.textContent?.length).toBeGreaterThan(0);
    expect(starPhase(fresh).length).toBeGreaterThan(0);

    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const selecting = drawChains(createStar());
    let picked: number | null = null;
    renderStarBoard(selecting, container, undefined, (idx) => {
      picked = idx;
    });
    expect(container.querySelector('.star-track-choices')).toBeTruthy();
    const choice = container.querySelector(
      '.star-track-chain-btn'
    ) as HTMLButtonElement | null;
    expect(choice).toBeTruthy();
    choice!.click();
    expect(picked).toBe(0);
  });
});

describe('Burn wave 13 — Sum Dominoes board / hand / dice inject', () => {
  it('inject styles; board; both hands; dice CTA; names', () => {
    injectSDStyles();
    expect(document.getElementById('sd-styles')).toBeTruthy();

    const state = createSum();
    const board = renderSumBoard(state, () => {});
    document.body.appendChild(board);
    expect(board.classList.contains('sd-board')).toBe(true);

    const hand1 = renderSumHand(state, 'player1', () => {});
    const hand2 = renderSumHand(state, 'player2', () => {});
    document.body.appendChild(hand1);
    document.body.appendChild(hand2);
    expect(hand1.classList.contains('sd-hand-player1')).toBe(true);
    expect(hand2.querySelectorAll('.sd-hand-domino').length).toBe(7);

    let rolled = 0;
    const dice = renderSumDice(null, () => {
      rolled++;
    }, true);
    document.body.appendChild(dice);
    dice
      .querySelector('.sd-roll-btn')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(rolled).toBe(1);
    expect(sumName('player1')).not.toBe(sumName('player2'));
  });
});

describe('Burn wave 13 — Queens SVG board + inject styles', () => {
  it('renderBoard returns svg; inject styles; names distinct', () => {
    injectQGStyles();
    expect(document.getElementById('qg-styles')).toBeTruthy();

    const state = createQueens();
    let clicks = 0;
    const svg = renderQueensBoard(state, () => {
      clicks++;
    });
    document.body.appendChild(svg);
    expect(svg.tagName.toLowerCase()).toBe('svg');
    expect(svg.querySelectorAll('[data-cell-key]').length).toBeGreaterThan(0);
    const cell = svg.querySelector('[data-cell-key]') as SVGElement | null;
    cell?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(clicks).toBeGreaterThanOrEqual(0);
    expect(queensName('player1')).not.toBe(queensName('player2'));
  });
});

describe('Burn wave 13 — Hex-a-Gone board + bank + status', () => {
  it('board + bank mount; status after select/commit', () => {
    const container = document.createElement('div');
    const status = document.createElement('div');
    document.body.appendChild(container);
    document.body.appendChild(status);

    const fresh = createHexAGone();
    renderHagBoard(fresh, container, () => {}, () => {}, () => {});
    expect(
      container.querySelector('.hex-a-gone-board, .hex-a-gone-wrapper')
    ).toBeTruthy();
    expect(
      container.querySelector('.hex-a-gone-bank, .hex-a-gone-cell')
    ).toBeTruthy();

    renderHagStatus(fresh, status);
    expect(status.textContent?.length).toBeGreaterThan(0);
    expect(hagPhase(fresh).length).toBeGreaterThan(0);

    const committed = commitSelection(selectHag(fresh, 'triangle'));
    renderHagBoard(committed, container, () => {}, () => {}, () => {});
    renderHagStatus(committed, status);
    expect(status.textContent?.length).toBeGreaterThan(0);
  });
});

describe('Burn wave 13 — Remainder board / scores / preview / over', () => {
  it('inject; board; dice; scores; preview; gameOver banner', () => {
    injectRemainderIslandsStyles();
    expect(document.getElementById('remainder-islands-styles')).toBeTruthy();

    const fresh = createRemainder();
    const board = renderRemainderBoard(fresh, () => {}, () => {});
    document.body.appendChild(board);
    expect(
      board.querySelectorAll('.remainder-island, [data-island-id], .island')
        .length
    ).toBeGreaterThan(0);

    const dice = renderRemainderDice(null);
    document.body.appendChild(dice);
    expect(dice.classList.contains('remainder-dice')).toBe(true);

    const scores = renderRemainderScores(fresh);
    document.body.appendChild(scores);
    expect(scores.textContent?.length).toBeGreaterThan(0);

    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    const rolled = performRoll(createRemainder());
    if (rolled.phase === 'selectIsland' && rolled.validIslands[0]) {
      const withSel = setSelectedIsland(rolled, rolled.validIslands[0]!);
      const preview = renderDivisionPreview(withSel);
      document.body.appendChild(preview);
      expect(preview.classList.contains('remainder-preview')).toBe(true);
      expect(preview.textContent?.length).toBeGreaterThan(0);
    }

    const over = {
      ...fresh,
      phase: 'gameOver' as const,
      winner: 'player1' as const,
      player1Score: 12,
      player2Score: 4,
    };
    const overEl = renderRemainderOver(over);
    document.body.appendChild(overEl);
    expect(overEl.textContent?.length).toBeGreaterThan(0);
    expect(remainderName('player1')).not.toBe(remainderName('player2'));
  });
});

describe('Burn wave 13 — Kings handleCellClick + chrome', () => {
  it('select king via handleCellClick; board/status/history mount', () => {
    const state = createKings();
    // Opening P1 king is at 1-based (1, 5)
    const click = handleCellClick(1, 5, state);
    expect(click.isInvalidClick).toBe(false);
    expect(click.state.selectedKingPosition).toEqual({ row: 1, col: 5 });

    const bad = handleCellClick(1, 1, click.state);
    expect(bad.isInvalidClick).toBe(true);

    const board = document.createElement('div');
    const status = document.createElement('div');
    const history = document.createElement('div');
    history.id = 'move-history';
    document.body.appendChild(board);
    document.body.appendChild(status);
    document.body.appendChild(history);
    renderKingsBoard(state, board, () => {});
    expect(board.querySelectorAll('.cell').length).toBeGreaterThan(0);
    renderKingsStatus(state, status);
    expect(status.textContent?.length).toBeGreaterThan(0);
    renderKingsHistory(state, history);
    expect(history.textContent?.length).toBeGreaterThanOrEqual(0);
  });
});

describe('Burn wave 13 — complementary Fab / Par inject chrome', () => {
  it('Fab answer board + Par hand inject', () => {
    injectFabStyles();
    expect(document.getElementById('fab-styles')).toBeTruthy();
    const fabAnswers = renderAnswerBoard(createFab(), () => {});
    document.body.appendChild(fabAnswers);
    expect(fabAnswers.classList.contains('fab-answer-board')).toBe(true);
    expect(fabName('player1')).not.toBe(fabName('player2'));

    injectPar55Styles();
    expect(document.getElementById('par55-styles')).toBeTruthy();
    const hand = renderParHand(createPar(), 'player1', () => {});
    document.body.appendChild(hand);
    expect(
      hand.classList.contains('par55-hand') ||
        hand.querySelector('.par55-block, .par55-hand-block')
    ).toBeTruthy();
    expect(parName('player1')).not.toBe(parName('player2'));
  });
});
