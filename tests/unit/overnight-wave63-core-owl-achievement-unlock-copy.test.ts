/**
 * Overnight TOKENMAXX HEAVY leftovers after #298 — Owl achievement-unlock-1 exact copy.
 * Tip alpha after #301. MESSAGE_LIBRARY residual only. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 63 core owl — achievement-unlock-1 copy', () => {
  it('pins stock achievement unlock template with literal placeholder', () => {
    const msg = owlMessages
      .getMessagesByCategory('achievement:unlock')
      .find((m) => m.id === 'achievement-unlock-1');
    expect(msg!.priority).toBe('high');
    expect(msg!.text).toBe(
      'ACHIEVEMENT UNLOCKED! {achievementName}! You earned it!'
    );
  });
});
