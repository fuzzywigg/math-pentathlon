/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Owl MESSAGE_LIBRARY format residual.
 * Distinct from open #314 wave64 format slice; lock unsaturated select leftovers. Tests-only.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 65 core owl — format milestone-games-50', () => {
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

  it('selects milestone-games-50 when 10/100 are seen', () => {
    for (const m of owlMessages.getMessagesByCategory('milestone:reached')) {
      if (m.id !== 'milestone-games-50') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('milestone:reached', {});
    expect(msg!.id).toBe('milestone-games-50');
    expect(msg!.text).toBe(
      '50 games! You are officially a Math Pentathlon enthusiast!'
    );
  });
});
