/**
 * Overnight TOKENMAXX HEAVY leftovers after #298 — Owl game-start-generic-1 exact copy.
 * Tip alpha after #301. MESSAGE_LIBRARY residual only. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 63 core owl — game-start-generic-1 copy', () => {
  it('pins excellent-choice generic start template', () => {
    const msg = owlMessages
      .getMessagesByCategory('game:start')
      .find((m) => m.id === 'game-start-generic-1');
    expect(msg!.priority).toBe('normal');
    expect(msg!.text).toBe(
      '{gameName} - excellent choice! Show me what you can do!'
    );
  });
});
