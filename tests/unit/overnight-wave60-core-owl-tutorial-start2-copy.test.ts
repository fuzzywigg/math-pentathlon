/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl tutorial-start-2 exact copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — tutorial-start-2 copy', () => {
  it('pins learning-mode-activated tutorial start text', () => {
    const msg = owlMessages
      .getMessagesByCategory('tutorial:start')
      .find((m) => m.id === 'tutorial-start-2');
    expect(msg!.priority).toBe('high');
    expect(msg!.text).toBe(
      "Learning mode activated! Let's discover how to play {gameName} together!"
    );
  });
});
