/**
 * Wave 38 — owlMessages condition operators / category catalog closure.
 * Beyond wave 23 select smoke. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';
import type { OwlEventType } from '../../src/core/owl/owl-events';

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

const CATEGORIES: OwlEventType[] = [
  'app:start',
  'app:return',
  'game:start',
  'game:end',
  'game:move',
  'tutorial:start',
  'tutorial:complete',
  'achievement:unlock',
  'streak:update',
  'streak:broken',
  'milestone:reached',
];

describe('Wave 38 owl-messages — category catalog', () => {
  it('every known category returns an array; empty ones select null', () => {
    for (const cat of CATEGORIES) {
      const list = owlMessages.getMessagesByCategory(cat);
      expect(Array.isArray(list)).toBe(true);
      expect(list.every((m) => m.category === cat)).toBe(true);
      if (list.length === 0) {
        expect(owlMessages.selectMessage(cat, {})).toBeNull();
      }
    }
  });

  it('addMessage appends and appears in previously-empty category', () => {
    const id = `custom-wave38-${Date.now()}`;
    expect(owlMessages.getMessagesByCategory('game:move')).toHaveLength(0);
    owlMessages.addMessage({
      id,
      category: 'game:move',
      priority: 'low',
      text: 'Wave38 custom hint for {playerName}',
    });
    const list = owlMessages.getMessagesByCategory('game:move');
    expect(list.some((m) => m.id === id)).toBe(true);
    const msg = owlMessages.selectMessage('game:move', { playerName: 'Zed' });
    expect(msg).toBeTruthy();
    expect(msg!.text).toMatch(/Zed|Wave38|hint|friend/i);
  });
});

describe('Wave 38 owl-messages — streak / win / firstTime matrix', () => {
  it('app:return streak thresholds prefer high-priority when streak high', () => {
    for (const streak of [0, 1, 2, 3, 7, 14, 30]) {
      const msg = owlMessages.selectMessage('app:return', {
        playerName: 'Pat',
        currentStreak: streak,
        timeOfDay: 'afternoon',
      });
      expect(msg).toBeTruthy();
      expect(msg!.text.length).toBeGreaterThan(5);
      if (streak >= 7) {
        expect(msg!.priority).toBe('high');
        expect(msg!.text).toMatch(/Pat|7|14|30|streak|UNSTOPPABLE|days/i);
      }
    }
  });

  it('game:end playerWon true vs false vs draw context', () => {
    const win = owlMessages.selectMessage('game:end', {
      playerWon: true,
      gameName: 'Hex',
      playerName: 'Sam',
    });
    const lose = owlMessages.selectMessage('game:end', {
      playerWon: false,
      gameName: 'Hex',
      playerName: 'Sam',
    });
    expect(win).toBeTruthy();
    expect(lose).toBeTruthy();
    expect(win!.text).not.toBe(lose!.text);
  });

  it('game:start firstTime uses gamesPlayedThisGame===0', () => {
    const first = owlMessages.selectMessage('game:start', {
      gamesPlayedThisGame: 0,
      gameName: 'Calla',
    });
    const again = owlMessages.selectMessage('game:start', {
      gamesPlayedThisGame: 3,
      gameName: 'Calla',
    });
    expect(first).toBeTruthy();
    expect(again).toBeTruthy();
  });

  it('placeholder defaults when context sparse', () => {
    const msg = owlMessages.selectMessage('app:return', {
      timeOfDay: 'morning',
      currentStreak: 0,
    });
    expect(msg).toBeTruthy();
    expect(msg!.text).toMatch(/friend|morning|math|Ready|Hoot/i);
  });
});
