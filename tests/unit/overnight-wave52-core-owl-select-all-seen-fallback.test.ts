/**
 * Overnight HEAVY leftover after #234 — selectMessage falls back to full pool when all seen.
 * Distinct from burn-wave23 unseen preference. Tests-only.
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

describe('Wave 52 core owl — select all-seen fallback', () => {
  it('marking every tutorial:complete seen still returns a message', () => {
    const all = owlMessages.getMessagesByCategory('tutorial:complete');
    expect(all.length).toBeGreaterThan(0);
    for (const m of all) storage.markMessageSeen(m.id);
    const msg = owlMessages.selectMessage('tutorial:complete', {
      playerName: 'Bo',
      gameName: 'Hex',
    });
    expect(msg).not.toBeNull();
    expect(msg!.category).toBe('tutorial:complete');
  });
});
