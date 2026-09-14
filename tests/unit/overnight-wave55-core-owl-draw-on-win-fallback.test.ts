/**
 * Overnight HEAVY leftover after #250 — unconditioned draw copy can win the
 * game:end pool when win-generic ids are already seen.
 * Distinct from wave53 null-winner / wave40 draw-ai moods. Tests-only.
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

describe('Wave 55 core owl — draw copy on win fallback', () => {
  it('marking win-generic seen leaves draw-* eligible on playerWon true', () => {
    for (const m of owlMessages.getMessagesByCategory('game:end')) {
      if (m.id.startsWith('win-')) storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('game:end', {
      playerWon: true,
      gamesPlayedThisGame: 4,
      winStreak: 1,
    });
    expect(msg).not.toBeNull();
    expect(msg!.id.startsWith('draw-')).toBe(true);
    expect(msg!.text.toLowerCase()).toMatch(/draw|tied/);
  });
});
