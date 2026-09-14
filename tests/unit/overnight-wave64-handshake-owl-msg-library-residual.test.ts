/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 64 handshake — owl MESSAGE_LIBRARY residual', () => {
  it('stitches soft-condition + catalog leftovers across categories', () => {
    expect(
      owlMessages
        .getMessagesByCategory('app:start')
        .find((m) => m.id === 'welcome-2')!.conditions
    ).toEqual([{ type: 'firstTime', value: true }]);
    expect(
      owlMessages
        .getMessagesByCategory('app:return')
        .find((m) => m.id === 'return-night-1')!.conditions
    ).toEqual([{ type: 'timeOfDay', value: 'night' }]);
    expect(
      owlMessages
        .getMessagesByCategory('game:start')
        .find((m) => m.id === 'game-start-first-2')!.conditions
    ).toEqual([{ type: 'firstTime', value: true }]);
    expect(
      owlMessages
        .getMessagesByCategory('game:end')
        .find((m) => m.id === 'win-generic-2')!.conditions
    ).toEqual([{ type: 'playerWon', value: true }]);
    expect(
      owlMessages
        .getMessagesByCategory('game:end')
        .find((m) => m.id === 'loss-encouraging-5')!.conditions
    ).toEqual([{ type: 'playerWon', value: false }]);
    expect(
      owlMessages
        .getMessagesByCategory('game:end')
        .find((m) => m.id === 'draw-1')!.conditions
    ).toBeUndefined();
    expect(
      owlMessages
        .getMessagesByCategory('streak:broken')
        .map((m) => m.id)
        .sort()
    ).toEqual(['streak-broken-1', 'streak-broken-2']);
    expect(owlMessages.getMessagesByCategory('game:end')).toHaveLength(14);
  });
});
