/**
 * Wave 40 — owl messages category catalogs / condition fallbacks leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';
import type { OwlEventType } from '../../src/core/owl';

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

describe('Wave 40 owl-messages — categories + fallbacks', () => {
  it('catalogs expose expected categories with stable ids', () => {
    const expected: Array<{ cat: OwlEventType; idPrefix: string }> = [
      { cat: 'app:start', idPrefix: 'welcome-' },
      { cat: 'app:return', idPrefix: 'return-' },
      { cat: 'game:start', idPrefix: 'game-start-' },
      { cat: 'game:end', idPrefix: 'win-' },
      { cat: 'tutorial:start', idPrefix: 'tutorial-start-' },
      { cat: 'tutorial:complete', idPrefix: 'tutorial-complete-' },
      { cat: 'streak:broken', idPrefix: 'streak-broken-' },
    ];

    for (const { cat, idPrefix } of expected) {
      const list = owlMessages.getMessagesByCategory(cat);
      expect(list.length).toBeGreaterThan(0);
      expect(list.every((m) => m.category === cat)).toBe(true);
      expect(list.some((m) => m.id.startsWith(idPrefix))).toBe(true);
    }
  });

  it('empty category returns null (game:move)', () => {
    expect(owlMessages.selectMessage('game:move', {})).toBeNull();
    expect(owlMessages.getMessagesByCategory('game:move')).toEqual([]);
  });

  it('unmatched conditions fall back to no-condition messages', () => {
    // timeOfDay 'morning' with streak 0 — morning-conditioned OR generics
    const msg = owlMessages.selectMessage('app:return', {
      playerName: 'Casey',
      timeOfDay: 'morning',
      currentStreak: 0,
    });
    expect(msg).toBeTruthy();
    expect(msg!.text.length).toBeGreaterThan(5);
    // Should not be the big streak line
    expect(msg!.text).not.toMatch(/UNSTOPPABLE/);
  });

  it('draw end can select unconditional draw catalog entries', () => {
    const draws = owlMessages
      .getMessagesByCategory('game:end')
      .filter((m) => m.id.startsWith('draw-'));
    expect(draws.length).toBeGreaterThan(0);
    expect(draws.every((m) => !m.conditions || m.conditions.length === 0)).toBe(
      true
    );

    // Force draw ids by marking win/loss seen
    for (const m of owlMessages.getMessagesByCategory('game:end')) {
      if (!m.id.startsWith('draw-')) storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('game:end', {
      playerWon: false,
      isDraw: true,
      gameName: 'Hex',
    });
    expect(msg?.id.startsWith('draw-')).toBe(true);
  });

  it('all-conditioned category with no match and no fallback returns null', () => {
    owlMessages.addMessage({
      id: 'w40-only-cond-cat',
      category: 'milestone:reached',
      priority: 'high',
      text: 'only if streak',
      conditions: [{ type: 'streak', value: 99, operator: 'gte' }],
    });
    // Stock milestones have no conditions — mark them seen and add only-cond
    // Actually stock milestones have NO conditions, so fallback always exists.
    // Use achievement:unlock stock (no conditions) — instead verify firstTime
    // mismatch on app:start when gamesPlayedThisGame !== 0 falls to null
    // because all welcome messages require firstTime true and there is no
    // unconditional app:start fallback.
    const msg = owlMessages.selectMessage('app:start', {
      gamesPlayedThisGame: 5,
    });
    expect(msg).toBeNull();
  });
});
