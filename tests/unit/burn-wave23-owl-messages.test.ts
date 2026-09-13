/**
 * Wave 23 — owlMessages library select / conditions / placeholders / categories.
 * Distinct from owl-physics and wave 22 toolkit UI. Tests-only. No product inventing.
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

describe('Wave 23 owl-messages — categories + first-time', () => {
  it('getMessagesByCategory returns catalog entries', () => {
    const welcome = owlMessages.getMessagesByCategory('app:start');
    expect(welcome.length).toBeGreaterThan(0);
    expect(welcome.every((m) => m.category === 'app:start')).toBe(true);
    expect(welcome.some((m) => m.id.startsWith('welcome'))).toBe(true);
  });

  it('selectMessage first-time app:start prefers high priority welcome', () => {
    const msg = owlMessages.selectMessage('app:start', {
      gamesPlayedThisGame: 0,
      playerName: 'Ada',
    });
    expect(msg).toBeTruthy();
    expect(msg!.priority).toBe('high');
    expect(msg!.id).toMatch(/^welcome-/);
    expect(msg!.text.length).toBeGreaterThan(10);
  });

  it('category with empty library returns null', () => {
    // game:move is a valid event type but has no MESSAGE_LIBRARY entries
    expect(owlMessages.selectMessage('game:move', {})).toBeNull();
  });
});

describe('Wave 23 owl-messages — conditions + formatting', () => {
  it('timeOfDay morning vs night return messages', () => {
    const morning = owlMessages.selectMessage('app:return', {
      playerName: 'Bo',
      timeOfDay: 'morning',
      currentStreak: 0,
    });
    expect(morning).toBeTruthy();
    expect(morning!.text).toMatch(/morning|Bo|Welcome|Hoot|math/i);

    const night = owlMessages.selectMessage('app:return', {
      playerName: 'Bo',
      timeOfDay: 'night',
      currentStreak: 0,
    });
    expect(night).toBeTruthy();
    expect(night!.text.length).toBeGreaterThan(5);
  });

  it('streak condition formats {currentStreak} and {playerName}', () => {
    const msg = owlMessages.selectMessage('app:return', {
      playerName: 'Casey',
      currentStreak: 7,
      timeOfDay: 'afternoon',
    });
    expect(msg).toBeTruthy();
    // High-priority streak messages when streak >= 2/7
    expect(msg!.priority).toBe('high');
    expect(msg!.text).toMatch(/7/);
    expect(msg!.text).toMatch(/Casey|UNSTOPPABLE|streak/i);
  });

  it('game:start firstTime vs return; game:end playerWon', () => {
    const first = owlMessages.selectMessage('game:start', {
      gameName: 'Hex',
      gamesPlayedThisGame: 0,
    });
    expect(first?.text).toMatch(/Hex|first|explore|learning/i);

    const returning = owlMessages.selectMessage('game:start', {
      gameName: 'Hex',
      gamesPlayedThisGame: 3,
    });
    expect(returning).toBeTruthy();
    expect(returning!.text).toMatch(/Hex|this game|friend/i);

    const win = owlMessages.selectMessage('game:end', {
      gameName: 'FIAR',
      playerWon: true,
      winStreak: 2,
    });
    expect(win).toBeTruthy();
    expect(win!.text.length).toBeGreaterThan(5);
  });

  it('addMessage extends catalog and formats placeholders', () => {
    owlMessages.addMessage({
      id: 'custom-test-wave23',
      category: 'tutorial:complete',
      priority: 'high',
      text: 'Custom done {gameName}!',
    });
    const catalog = owlMessages.getMessagesByCategory('tutorial:complete');
    expect(catalog.some((m) => m.id === 'custom-test-wave23')).toBe(true);

    // Mark stock tutorial-complete messages seen so select prefers the custom one
    for (const m of catalog) {
      if (m.id !== 'custom-test-wave23') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('tutorial:complete', {
      gameName: 'Contig 60',
    });
    expect(msg?.id).toBe('custom-test-wave23');
    expect(msg?.text).toBe('Custom done Contig 60!');
  });

  it('prefers unseen messages when Math.random pinned', () => {
    const first = owlMessages.selectMessage('app:start', {
      gamesPlayedThisGame: 0,
    });
    expect(first).toBeTruthy();
    storage.markMessageSeen(first!.id);

    const second = owlMessages.selectMessage('app:start', {
      gamesPlayedThisGame: 0,
    });
    expect(second).toBeTruthy();
    // With random=0 and first marked seen, pool should shift
    expect(second!.id).not.toBe(first!.id);
  });
});
