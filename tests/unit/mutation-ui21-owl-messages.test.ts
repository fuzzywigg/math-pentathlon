/**
 * q-mp-587 mutation audit UI wave 21 — owl-messages first-20 kills.
 * Structural id / condition / priority pins only — no player-facing message text.
 * Leave #727 (HELD nullish owl-messages clear) alone.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

beforeEach(() => {
  localStorage.clear();
  storage.resetAll();
  vi.spyOn(Math, 'random').mockReturnValue(0);
});

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  storage.resetAll();
});

function markSeenExcept(
  category: Parameters<typeof owlMessages.getMessagesByCategory>[0],
  keepIds: ReadonlySet<string>
): void {
  for (const m of owlMessages.getMessagesByCategory(category)) {
    if (!keepIds.has(m.id)) storage.markMessageSeen(m.id);
  }
}

describe('mutation-ui21 owl-messages', () => {
  it('catalog pins return-streak thresholds (kills L102/L109 ±1)', () => {
    const msgs = owlMessages.getMessagesByCategory('app:return');
    const s2 = msgs.find((m) => m.id === 'return-streak-1');
    const s7 = msgs.find((m) => m.id === 'return-streak-big-1');
    expect(s2?.priority).toBe('high');
    expect(s2?.conditions).toEqual([
      { type: 'streak', value: 2, operator: 'gte' },
    ]);
    expect(s7?.priority).toBe('high');
    expect(s7?.conditions).toEqual([
      { type: 'streak', value: 7, operator: 'gte' },
    ]);
  });

  it('catalog pins game-start firstTime + gamesPlayed gates (kills L138–L159)', () => {
    const msgs = owlMessages.getMessagesByCategory('game:start');
    const first1 = msgs.find((m) => m.id === 'game-start-first-1');
    const first2 = msgs.find((m) => m.id === 'game-start-first-2');
    const ret5 = msgs.find((m) => m.id === 'game-start-return-1');
    const ret3 = msgs.find((m) => m.id === 'game-start-return-2');
    expect(first1?.conditions).toEqual([{ type: 'firstTime', value: true }]);
    expect(first2?.conditions).toEqual([{ type: 'firstTime', value: true }]);
    expect(ret5?.conditions).toEqual([
      { type: 'gamesPlayed', value: 5, operator: 'gte' },
    ]);
    expect(ret3?.conditions).toEqual([
      { type: 'gamesPlayed', value: 3, operator: 'gte' },
    ]);
  });

  it('catalog pins game:end win conditions (kills L195–L214)', () => {
    const msgs = owlMessages.getMessagesByCategory('game:end');
    const winFirst = msgs.find((m) => m.id === 'win-first-1');
    const winStreak = msgs.find((m) => m.id === 'win-streak-1');
    const winGeneric = msgs.find((m) => m.id === 'win-generic-1');
    expect(winFirst?.conditions).toEqual([
      { type: 'playerWon', value: true },
      { type: 'gamesPlayed', value: 1 },
    ]);
    expect(winStreak?.conditions).toEqual([
      { type: 'playerWon', value: true },
      { type: 'winStreak', value: 3, operator: 'gte' },
    ]);
    expect(winGeneric?.conditions).toEqual([
      { type: 'playerWon', value: true },
    ]);
  });

  it('selectMessage streak boundary selects return-streak ids (no text pins)', () => {
    markSeenExcept('app:return', new Set(['return-streak-1', 'return-streak-big-1']));
    const at2 = owlMessages.selectMessage('app:return', {
      currentStreak: 2,
      playerName: 'Pat',
    });
    expect(at2?.id).toBe('return-streak-1');
    expect(at2?.priority).toBe('high');

    // Below gte-2: high streak templates must not match.
    markSeenExcept('app:return', new Set(['return-streak-1', 'return-streak-big-1']));
    const at1 = owlMessages.selectMessage('app:return', {
      currentStreak: 1,
      playerName: 'Pat',
    });
    expect(at1?.id).not.toBe('return-streak-1');
    expect(at1?.id).not.toBe('return-streak-big-1');

    markSeenExcept('app:return', new Set(['return-streak-big-1']));
    const at7 = owlMessages.selectMessage('app:return', {
      currentStreak: 7,
      playerName: 'Pat',
    });
    expect(at7?.id).toBe('return-streak-big-1');

    markSeenExcept('app:return', new Set(['return-streak-big-1']));
    const at6 = owlMessages.selectMessage('app:return', {
      currentStreak: 6,
      playerName: 'Pat',
    });
    expect(at6?.id).not.toBe('return-streak-big-1');
  });

  it('selectMessage firstTime / gamesPlayed gates by id only', () => {
    markSeenExcept(
      'game:start',
      new Set(['game-start-first-1', 'game-start-first-2'])
    );
    const first = owlMessages.selectMessage('game:start', {
      gamesPlayedThisGame: 0,
      gameName: 'Hex',
    });
    expect(first?.id).toMatch(/^game-start-first-/);
    expect(first?.priority).toBe('high');

    markSeenExcept(
      'game:start',
      new Set(['game-start-return-1', 'game-start-return-2'])
    );
    const at5 = owlMessages.selectMessage('game:start', {
      gamesPlayedThisGame: 5,
      gameName: 'Hex',
    });
    expect(at5?.id).toBe('game-start-return-1');

    markSeenExcept('game:start', new Set(['game-start-return-2']));
    const at3 = owlMessages.selectMessage('game:start', {
      gamesPlayedThisGame: 3,
      gameName: 'Hex',
    });
    expect(at3?.id).toBe('game-start-return-2');

    markSeenExcept(
      'game:start',
      new Set(['game-start-return-1', 'game-start-return-2'])
    );
    const at2 = owlMessages.selectMessage('game:start', {
      gamesPlayedThisGame: 2,
      gameName: 'Hex',
    });
    expect(at2?.id).not.toBe('game-start-return-1');
    expect(at2?.id).not.toBe('game-start-return-2');
  });

  it('selectMessage game:end win gates by id only', () => {
    markSeenExcept('game:end', new Set(['win-first-1']));
    const firstWin = owlMessages.selectMessage('game:end', {
      playerWon: true,
      gamesPlayedThisGame: 1,
      gameName: 'Hex',
    });
    expect(firstWin?.id).toBe('win-first-1');
    expect(firstWin?.priority).toBe('high');

    markSeenExcept('game:end', new Set(['win-streak-1']));
    const streakWin = owlMessages.selectMessage('game:end', {
      playerWon: true,
      winStreak: 3,
      gamesPlayedThisGame: 4,
      gameName: 'Hex',
    });
    expect(streakWin?.id).toBe('win-streak-1');

    markSeenExcept('game:end', new Set(['win-streak-1']));
    const streak2 = owlMessages.selectMessage('game:end', {
      playerWon: true,
      winStreak: 2,
      gamesPlayedThisGame: 4,
      gameName: 'Hex',
    });
    expect(streak2?.id).not.toBe('win-streak-1');

    markSeenExcept('game:end', new Set(['win-generic-1', 'win-generic-2']));
    const genericWin = owlMessages.selectMessage('game:end', {
      playerWon: true,
      gamesPlayedThisGame: 4,
      winStreak: 1,
      gameName: 'Hex',
    });
    expect(genericWin?.id).toMatch(/^win-generic-/);
    expect(genericWin?.priority).toBe('normal');

    const loss = owlMessages.selectMessage('game:end', {
      playerWon: false,
      gamesPlayedThisGame: 4,
      gameName: 'Hex',
    });
    expect(loss?.id).not.toMatch(/^win-/);
  });

  it('empty category still returns null; placeholders format without copy pins', () => {
    expect(owlMessages.selectMessage('game:move', {})).toBeNull();
    markSeenExcept('app:return', new Set(['return-streak-1']));
    const msg = owlMessages.selectMessage('app:return', {
      currentStreak: 2,
      playerName: 'Ada',
    });
    expect(msg?.id).toBe('return-streak-1');
    // Placeholder substitution only — digit / name presence, not stock copy.
    expect(msg!.text.includes('2')).toBe(true);
    expect(msg!.text.includes('Ada')).toBe(true);
  });
});
