/**
 * Overnight TOKENMAXX HEAVY leftovers after #298 — Owl loss-encouraging residual ids.
 * Tip alpha after #301. MESSAGE_LIBRARY residual only. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 63 core owl — loss residual ids', () => {
  it('game:end loss catalog includes encouraging-1/2/4', () => {
    const losses = owlMessages
      .getMessagesByCategory('game:end')
      .filter((m) => m.id.startsWith('loss-encouraging-'));
    expect(losses.map((m) => m.id).sort()).toEqual([
      'loss-encouraging-1',
      'loss-encouraging-2',
      'loss-encouraging-3',
      'loss-encouraging-4',
      'loss-encouraging-5',
    ]);
    for (const id of [
      'loss-encouraging-1',
      'loss-encouraging-2',
      'loss-encouraging-4',
    ]) {
      const msg = losses.find((m) => m.id === id)!;
      expect(msg.conditions).toEqual([{ type: 'playerWon', value: false }]);
    }
  });
});
