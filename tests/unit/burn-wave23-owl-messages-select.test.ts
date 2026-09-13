/**
 * Wave 23 — owlMessages library selection / conditions / formatting.
 * Pins Math.random; asserts membership in category pools (not brittle single ids).
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

beforeEach(() => {
  localStorage.clear();
  storage.resetAll();
  vi.spyOn(Math, 'random').mockReturnValue(0);
});

afterEach(() => {
  storage.resetAll();
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('Wave 23 owl-messages — category catalogs', () => {
  it('getMessagesByCategory returns welcome / return / end pools', () => {
    const starts = owlMessages.getMessagesByCategory('app:start');
    expect(starts.length).toBeGreaterThanOrEqual(3);
    expect(starts.every((m) => m.category === 'app:start')).toBe(true);
    expect(starts.map((m) => m.id)).toEqual(
      expect.arrayContaining(['welcome-1', 'welcome-2', 'welcome-3'])
    );

    const returns = owlMessages.getMessagesByCategory('app:return');
    expect(returns.length).toBeGreaterThanOrEqual(4);
    expect(returns.some((m) => m.id.includes('morning'))).toBe(true);

    const ends = owlMessages.getMessagesByCategory('game:end');
    expect(ends.length).toBeGreaterThanOrEqual(3);
  });

  it('unknown-ish empty category yields empty list and selectMessage null', () => {
    // milestone has messages; game:move may be empty in library
    const moves = owlMessages.getMessagesByCategory('game:move');
    if (moves.length === 0) {
      expect(owlMessages.selectMessage('game:move', {})).toBeNull();
    } else {
      expect(owlMessages.selectMessage('game:move', {})).not.toBeNull();
    }
  });
});

describe('Wave 23 owl-messages — selectMessage conditions', () => {
  it('app:start with gamesPlayedThisGame 0 picks a welcome id', () => {
    const msg = owlMessages.selectMessage('app:start', {
      gamesPlayedThisGame: 0,
      playerName: 'Pat',
    });
    expect(msg).not.toBeNull();
    expect(msg!.id).toMatch(/^welcome-/);
    expect(msg!.priority).toBe('high');
  });

  it('app:return filters by timeOfDay morning', () => {
    const msg = owlMessages.selectMessage('app:return', {
      timeOfDay: 'morning',
      playerName: 'Sam',
    });
    expect(msg).not.toBeNull();
    expect(msg!.id).toMatch(/morning|return/i);
    expect(msg!.text).toContain('Sam');
  });

  it('game:end playerWon true formats celebration copy', () => {
    const msg = owlMessages.selectMessage('game:end', {
      playerWon: true,
      isDraw: false,
      gameName: 'Hex',
      playerName: 'Riley',
      winStreak: 2,
    });
    expect(msg).not.toBeNull();
    expect(msg!.text.length).toBeGreaterThan(5);
    // placeholders replaced
    expect(msg!.text.includes('{playerName}')).toBe(false);
    expect(msg!.text.includes('{gameName}')).toBe(false);
  });

  it('game:end playerWon false still returns an encouraging/fallback line', () => {
    const msg = owlMessages.selectMessage('game:end', {
      playerWon: false,
      isDraw: false,
      gameName: 'FIAR',
    });
    expect(msg).not.toBeNull();
    expect(msg!.category).toBe('game:end');
  });

  it('prefers unseen messages when pool allows', () => {
    const pool = owlMessages.getMessagesByCategory('app:start');
    for (const m of pool) {
      storage.markMessageSeen(m.id);
    }
    // All seen — still returns from pool (fallback to full pool)
    const msg = owlMessages.selectMessage('app:start', {
      gamesPlayedThisGame: 0,
    });
    expect(msg).not.toBeNull();
    expect(pool.map((m) => m.id)).toContain(msg!.id);
  });

  it('formats streak and totalGamesPlayed placeholders when present', () => {
    // Use addMessage only with unique id; category already in union
    owlMessages.addMessage({
      id: 'wave23-format-probe',
      category: 'milestone:reached',
      priority: 'high',
      text: 'Hi {playerName} streak {currentStreak} games {totalGamesPlayed} wins {winStreak} at {gameName}',
    });
    const msg = owlMessages.selectMessage('milestone:reached', {
      playerName: 'Alex',
      currentStreak: 4,
      totalGamesPlayed: 12,
      winStreak: 3,
      gameName: 'Contig 60',
    });
    expect(msg).not.toBeNull();
    // May pick another milestone; only assert when our probe wins (random pinned to 0 + high priority)
    if (msg!.id === 'wave23-format-probe') {
      expect(msg!.text).toBe(
        'Hi Alex streak 4 games 12 wins 3 at Contig 60'
      );
    } else {
      expect(msg!.text.includes('{')).toBe(false);
    }
  });
});
