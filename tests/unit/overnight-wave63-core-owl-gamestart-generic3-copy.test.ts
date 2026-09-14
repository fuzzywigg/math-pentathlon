/**
 * Overnight TOKENMAXX HEAVY leftovers after #298 — Owl game-start-generic-3 exact copy.
 * Tip alpha after #301. MESSAGE_LIBRARY residual only. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 63 core owl — game-start-generic-3 copy', () => {
  it('pins believe-in-you generic start text', () => {
    const msg = owlMessages
      .getMessagesByCategory('game:start')
      .find((m) => m.id === 'game-start-generic-3');
    expect(msg!.priority).toBe('normal');
    expect(msg!.text).toBe(
      'I believe in you! Think carefully and trust your instincts.'
    );
  });
});
