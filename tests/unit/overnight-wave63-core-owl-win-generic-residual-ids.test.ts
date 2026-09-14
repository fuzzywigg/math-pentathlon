/**
 * Overnight TOKENMAXX HEAVY leftovers after #298 — Owl win-generic-3/4/5 id catalog.
 * Tip alpha after #301. MESSAGE_LIBRARY residual only. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 63 core owl — win-generic residual ids', () => {
  it('game:end includes win-generic-3/4/5 with playerWon true', () => {
    const wins = owlMessages
      .getMessagesByCategory('game:end')
      .filter((m) => m.id.startsWith('win-generic-'));
    expect(wins.map((m) => m.id).sort()).toEqual([
      'win-generic-1',
      'win-generic-2',
      'win-generic-3',
      'win-generic-4',
      'win-generic-5',
    ]);
    expect(
      wins
        .filter((m) =>
          ['win-generic-3', 'win-generic-4', 'win-generic-5'].includes(m.id)
        )
        .every(
          (m) =>
            m.priority === 'normal' &&
            m.conditions?.length === 1 &&
            m.conditions[0].type === 'playerWon' &&
            m.conditions[0].value === true
        )
    ).toBe(true);
  });
});
