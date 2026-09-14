/**
 * Wave 40 — owl messages placeholder defaults + compare operators leftovers.
 * Tests-only.
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
  vi.restoreAllMocks();
  localStorage.clear();
  storage.resetAll();
});

describe('Wave 40 owl-messages — placeholders + operators', () => {
  it('missing playerName / gameName use friend / this game defaults', () => {
    // Mark stock high-priority first-time messages seen so a formatting path is stable
    for (const m of owlMessages.getMessagesByCategory('game:start')) {
      if (m.conditions?.some((c) => c.type === 'firstTime')) {
        storage.markMessageSeen(m.id);
      }
    }

    owlMessages.addMessage({
      id: 'w40-placeholder-defaults',
      category: 'game:start',
      priority: 'high',
      text: 'Hello {playerName} — try {gameName}!',
    });

    const msg = owlMessages.selectMessage('game:start', {
      gamesPlayedThisGame: 1,
    });
    expect(msg?.id).toBe('w40-placeholder-defaults');
    expect(msg?.text).toBe('Hello friend — try this game!');
  });

  it('provided names replace placeholders', () => {
    owlMessages.addMessage({
      id: 'w40-placeholder-named',
      category: 'tutorial:start',
      priority: 'high',
      text: '{playerName} starts {gameName}',
    });
    for (const m of owlMessages.getMessagesByCategory('tutorial:start')) {
      if (m.id !== 'w40-placeholder-named') storage.markMessageSeen(m.id);
    }

    const msg = owlMessages.selectMessage('tutorial:start', {
      playerName: 'Ada',
      gameName: 'Hex',
    });
    expect(msg?.text).toBe('Ada starts Hex');
  });

  it('streak gte operator selects high-priority return streak copy', () => {
    const msg = owlMessages.selectMessage('app:return', {
      playerName: 'Bo',
      currentStreak: 7,
      timeOfDay: 'afternoon',
    });
    expect(msg).toBeTruthy();
    expect(msg!.priority).toBe('high');
    expect(msg!.text).toMatch(/7/);
  });

  it('numeric placeholders default to 0 when absent', () => {
    owlMessages.addMessage({
      id: 'w40-num-defaults',
      category: 'streak:update',
      priority: 'high',
      text: 'streak={currentStreak} wins={winStreak} total={totalGamesPlayed}',
    });
    for (const m of owlMessages.getMessagesByCategory('streak:update')) {
      if (m.id !== 'w40-num-defaults') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('streak:update', {});
    expect(msg?.text).toBe('streak=0 wins=0 total=0');
  });
});
