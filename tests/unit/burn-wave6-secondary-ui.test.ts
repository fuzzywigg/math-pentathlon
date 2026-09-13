import { describe, it, expect, afterEach } from 'vitest';

import { createInitialState as createPar } from '../../src/games/par-55/rules';
import {
  renderScores as renderParScores,
  renderMoveHistory as renderParHistory,
  getPlayerName as parName,
} from '../../src/games/par-55/board-ui';

import { createInitialState as createStars } from '../../src/games/stars-bars/rules';
import {
  renderScores as renderStarsScores,
  renderMoveHistory as renderStarsHistory,
  getPlayerName as starsName,
} from '../../src/games/stars-bars/board-ui';

import { createInitialState as createKwa } from '../../src/games/kwatro-sinko/rules';
import {
  renderChipInfo,
  renderMoveHistory as renderKwaHistory,
  getPlayerName as kwaName,
} from '../../src/games/kwatro-sinko/board-ui';

import { createInitialState as createRemainder } from '../../src/games/remainder-islands/types';
import {
  renderDice as renderRemainderDice,
  renderScores as renderRemainderScores,
  renderDivisionPreview,
  renderGameOver as renderRemainderGameOver,
  getPlayerName as remainderName,
} from '../../src/games/remainder-islands/board-ui';

import { createInitialState as createPinball } from '../../src/games/fraction-pinball/types';
import {
  renderResult as renderPinballResult,
  renderScores as renderPinballScores,
  renderGameOver as renderPinballGameOver,
  getPlayerName as pinballName,
} from '../../src/games/fraction-pinball/board-ui';

import { createInitialState as createFrac } from '../../src/games/frac-fact/types';
import {
  renderScores as renderFracScores,
  renderGameOver as renderFracGameOver,
  getPlayerName as fracName,
} from '../../src/games/frac-fact/board-ui';

import { createInitialState as createHexAGone } from '../../src/games/hex-a-gone/types';
import { renderStatus as renderHexAGoneStatus } from '../../src/games/hex-a-gone/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Burn wave 6 — Par 55 secondary UI', () => {
  it('renderScores and renderMoveHistory mount expected shells', () => {
    const state = createPar();
    const scores = renderParScores(state);
    const history = renderParHistory(state);
    document.body.appendChild(scores);
    document.body.appendChild(history);
    expect(scores.classList.contains('par55-scores')).toBe(true);
    expect(history.classList.contains('par55-history')).toBe(true);
    expect(scores.textContent).toMatch(/\d/);
    expect(parName('player1').length).toBeGreaterThan(0);
  });
});

describe('Burn wave 6 — Stars & Bars secondary UI', () => {
  it('renderScores and empty history mount safely', () => {
    const state = createStars();
    const scores = renderStarsScores(state);
    const history = renderStarsHistory(state);
    document.body.appendChild(scores);
    document.body.appendChild(history);
    expect(scores.classList.contains('stars-scores')).toBe(true);
    expect(history.classList.contains('stars-move-history')).toBe(true);
    expect(starsName('player2').length).toBeGreaterThan(0);
  });
});

describe('Burn wave 6 — Kwatro secondary UI', () => {
  it('renderChipInfo and history mount', () => {
    const state = createKwa();
    const info = renderChipInfo(state);
    const history = renderKwaHistory(state);
    document.body.appendChild(info);
    document.body.appendChild(history);
    expect(info.classList.contains('kwa-chip-info')).toBe(true);
    expect(history.classList.contains('kwa-history')).toBe(true);
    expect(kwaName('player1').length).toBeGreaterThan(0);
  });
});

describe('Burn wave 6 — Remainder Islands secondary UI', () => {
  it('renderDice placeholder and rolled faces', () => {
    const empty = renderRemainderDice(null);
    expect(empty.classList.contains('remainder-dice')).toBe(true);
    expect(empty.querySelector('.dice-placeholder')).toBeTruthy();

    const rolled = renderRemainderDice({ die1: 3, die2: 4, total: 7 });
    expect(rolled.querySelector('.dice-total')?.textContent).toBe('7');
  });

  it('renderScores / preview / gameOver mount', () => {
    const state = createRemainder();
    const scores = renderRemainderScores(state);
    const preview = renderDivisionPreview(state);
    document.body.appendChild(scores);
    document.body.appendChild(preview);
    expect(scores.classList.contains('remainder-scores')).toBe(true);
    expect(preview.classList.contains('remainder-preview')).toBe(true);
    expect(remainderName('player1').length).toBeGreaterThan(0);

    const over = renderRemainderGameOver({
      ...state,
      phase: 'gameOver',
      winner: 'player1',
    });
    expect(over.classList.contains('remainder-game-over')).toBe(true);
    expect(over.textContent).toMatch(/Blue|Wins|win/i);
  });
});

describe('Burn wave 6 — Fraction Pinball secondary UI', () => {
  it('renderScores and gameOver mount', () => {
    const state = createPinball();
    const scores = renderPinballScores(state);
    document.body.appendChild(scores);
    expect(scores.classList.contains('pinball-scores')).toBe(true);
    expect(pinballName('player2').length).toBeGreaterThan(0);

    const over = renderPinballGameOver({
      ...state,
      phase: 'gameOver',
      winner: 'player2',
    });
    expect(over.classList.contains('pinball-game-over')).toBe(true);
  });

  it('renderResult mounts empty shell outside showResult phase', () => {
    const state = createPinball();
    const result = renderPinballResult(state, () => undefined);
    document.body.appendChild(result);
    expect(result.classList.contains('pinball-result')).toBe(true);
  });

  it('renderResult shows feedback in showResult phase', () => {
    const base = createPinball();
    const state = {
      ...base,
      phase: 'showResult' as const,
      isCorrect: true,
      currentChallenge: {
        id: 'probe',
        type: 'fractionToDecimal' as const,
        fraction: { numerator: 1, denominator: 2 },
        decimal: 0.5,
        answerChoices: ['0.5', '0.25', '0.75', '1'],
        correctAnswer: '0.5',
      },
    };
    const result = renderPinballResult(state, () => undefined);
    expect(result.querySelector('.pinball-feedback')).toBeTruthy();
    expect(result.querySelector('.pinball-continue-btn')).toBeTruthy();
  });
});

describe('Burn wave 6 — Frac Fact secondary UI', () => {
  it('renderScores and gameOver mount', () => {
    const state = createFrac();
    const scores = renderFracScores(state);
    document.body.appendChild(scores);
    expect(scores.classList.contains('frac-scores')).toBe(true);
    expect(scores.textContent).toMatch(/Blue|Red|Problem/i);
    expect(fracName('player1').length).toBeGreaterThan(0);

    const over = renderFracGameOver({
      ...state,
      phase: 'gameOver',
      winner: 'player1',
    });
    expect(over.classList.contains('frac-game-over')).toBe(true);
  });
});

describe('Burn wave 6 — Hex-a-Gone renderStatus', () => {
  it('writes turn text into the status container', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderHexAGoneStatus(createHexAGone(), container);
    expect(container.querySelector('.hex-a-gone-status')).toBeTruthy();
    expect(container.querySelector('.status-turn')?.textContent).toMatch(
      /Select|Blue|turn/i
    );
  });

  it('shows winner chrome when game is over', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderHexAGoneStatus(
      {
        ...createHexAGone(),
        phase: 'gameOver',
        winner: 'player2',
      },
      container
    );
    expect(container.querySelector('.status-winner')).toBeTruthy();
    expect(container.textContent).toMatch(/Red|Wins/i);
  });
});
