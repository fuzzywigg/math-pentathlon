/**
 * Overnight TOKENMAXX HEAVY leftovers after #298 — Owl game:start residual id catalog.
 * Tip alpha after #301. MESSAGE_LIBRARY residual only. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 63 core owl — game:start residual ids', () => {
  it('exposes return-2 + generic-1/3 among game:start catalog', () => {
    const ids = owlMessages
      .getMessagesByCategory('game:start')
      .map((m) => m.id);
    expect(ids).toContain('game-start-return-2');
    expect(ids).toContain('game-start-generic-1');
    expect(ids).toContain('game-start-generic-3');
    expect(ids).toHaveLength(8);
  });
});
