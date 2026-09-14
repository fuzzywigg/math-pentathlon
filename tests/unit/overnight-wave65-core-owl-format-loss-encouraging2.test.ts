/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Owl MESSAGE_LIBRARY format residual.
 * Distinct from open #314 wave64 format slice; lock unsaturated select leftovers. Tests-only.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 65 core owl — format loss-encouraging-2', () => {
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

  it('selects loss-encouraging-2 when other losses are seen', () => {
    for (const m of owlMessages.getMessagesByCategory('game:end')) {
      if (m.id !== 'loss-encouraging-2') storage.markMessageSeen(m.id);
    }
    const msg = owlMessages.selectMessage('game:end', { playerWon: false });
    expect(msg!.id).toBe('loss-encouraging-2');
    expect(msg!.text).toBe(
      'Not this time, but I saw some great moves in there! Try again?'
    );
  });
});
