/**
 * Overnight TOKENMAXX — multiplayer-sync leftovers: seat / mode sync matrix.
 * Deepens player-colors apply/clear cycles and isAITurn gates across more seats.
 * Existing modules only. Tests-only. Avoids game-engine leftover collision.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import {
  applyGameModeChrome,
  clearGameModeChrome,
  getPlayerSeatColors,
  colorForSeat,
  seatIcon,
  getGameModeChromeRoot,
} from '../../src/ui/player-colors';

import { createInitialState as createPrime } from '../../src/games/prime-gold/rules';
import { isAITurn as primeIsAITurn } from '../../src/games/prime-gold/ai';

import { createInitialState as createSum } from '../../src/games/sum-dominoes/rules';
import { isAITurn as sumIsAITurn } from '../../src/games/sum-dominoes/ai';

import { createInitialState as createPar } from '../../src/games/par-55/rules';
import { isAITurn as parIsAITurn } from '../../src/games/par-55/ai';

import { createInitialState as createRamrod } from '../../src/games/ramrod/rules';
import { isAITurn as ramrodIsAITurn } from '../../src/games/ramrod/ai';

import { createInitialState as createStars } from '../../src/games/stars-bars/rules';
import { isAITurn as starsIsAITurn } from '../../src/games/stars-bars/ai';

import { createInitialState as createKwatro } from '../../src/games/kwatro-sinko/rules';
import { isAITurn as kwatroIsAITurn } from '../../src/games/kwatro-sinko/ai';

describe('Wave 41 multiplayer-sync — seat chrome sync matrix', () => {
  let app: HTMLElement;

  beforeEach(() => {
    app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
  });

  afterEach(() => {
    clearGameModeChrome(app);
    app.remove();
  });

  it('rapid 2P↔AI↔2P apply cycles leave consistent dataset', () => {
    for (let i = 0; i < 5; i++) {
      applyGameModeChrome(app, 'human-vs-ai', i % 2 === 0 ? 'player2' : 'player1');
      expect(app.dataset.opponent).toBe('ai');
      applyGameModeChrome(app, 'human-vs-human');
      expect(app.dataset.opponent).toBeUndefined();
      expect(app.dataset.aiSeat).toBeUndefined();
    }
    const colors = getPlayerSeatColors(app);
    expect(colors.player1).toBe('#3b82f6');
    expect(colors.player2).toBe('#ef4444');
  });

  it('getGameModeChromeRoot falls back to #app when nullish', () => {
    applyGameModeChrome(app, 'human-vs-ai');
    expect(getGameModeChromeRoot(null)).toBe(app);
    expect(getGameModeChromeRoot(undefined)).toBe(app);
    expect(colorForSeat('player2')).toBe('#8b5cf6');
  });

  it('clear then colorForSeat matches human defaults without document vars', () => {
    applyGameModeChrome(app, 'human-vs-ai', 'player1');
    clearGameModeChrome(app);
    expect(colorForSeat('player1', app)).toBe('#3b82f6');
    expect(colorForSeat('player2', app)).toBe('#ef4444');
    expect(seatIcon('player1', app)).toBe('🔵');
    expect(seatIcon('player2', app)).toBe('🔴');
  });
});

describe('Wave 41 multiplayer-sync — more isAITurn disconnect stubs', () => {
  const cases = [
    ['prime', createPrime, primeIsAITurn],
    ['sum', createSum, sumIsAITurn],
    ['par', createPar, parIsAITurn],
    ['ramrod', createRamrod, ramrodIsAITurn],
    ['stars', createStars, starsIsAITurn],
    ['kwatro', createKwatro, kwatroIsAITurn],
  ] as const;

  it.each(cases)(
    '%s: human-vs-human and null seat stub false at opening',
    (_name, create, isAI) => {
      const state = create();
      expect(isAI(state, 'player2', 'human-vs-human')).toBe(false);
      expect(isAI(state, null, 'human-vs-ai')).toBe(false);
    }
  );

  it.each(cases)(
    '%s: vs-AI with matching opening seat is true only for current player',
    (_name, create, isAI) => {
      const state = create();
      const current = state.currentPlayer as 'player1' | 'player2';
      const other = current === 'player1' ? 'player2' : 'player1';
      expect(isAI(state, current, 'human-vs-ai')).toBe(true);
      expect(isAI(state, other, 'human-vs-ai')).toBe(false);
    }
  );
});
