/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Owl MESSAGE_LIBRARY format residual.
 * Distinct from open #314 wave64 format slice; lock unsaturated select leftovers. Tests-only.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 65 core owl — format return-generic-2', () => {
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

  it('selects return-generic-2 when TOD/streak msgs are seen', () => {
    for (const m of owlMessages.getMessagesByCategory('app:return')) {
      if (m.id !== 'return-generic-2') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('app:return', { currentStreak: 0 });
    expect(msg!.id).toBe('return-generic-2');
    expect(msg!.text).toBe(
      'Great to see you again! Your math skills have been missed!'
    );
  });
});
