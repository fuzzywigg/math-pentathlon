/**
 * Overnight TOKENMAXX HEAVY leftovers after #298 — Owl tutorial-start-1 exact copy.
 * Tip alpha after #301. MESSAGE_LIBRARY residual only. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 63 core owl — tutorial-start-1 copy', () => {
  it('pins smart-choice tutorial start template', () => {
    const msg = owlMessages
      .getMessagesByCategory('tutorial:start')
      .find((m) => m.id === 'tutorial-start-1');
    expect(msg!.priority).toBe('high');
    expect(msg!.text).toBe(
      "Smart choice starting with the tutorial! I'll guide you through {gameName} step by step."
    );
  });
});
