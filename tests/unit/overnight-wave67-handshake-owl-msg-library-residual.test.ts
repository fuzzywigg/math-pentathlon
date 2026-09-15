/**
 * Overnight TOKENMAXX HEAVY leftovers after #314 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #324. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 67 handshake — owl MESSAGE_LIBRARY residual', () => {
  it('stitches format/condition leftovers across categories', () => {
    expect(
      owlMessages
        .getMessagesByCategory('app:start')
        .find((m) => m.id === 'welcome-3')!.conditions
    ).toEqual([{ type: 'firstTime', value: true }]);
    expect(
      owlMessages
        .getMessagesByCategory('app:return')
        .find((m) => m.id === 'return-evening-1')!.conditions
    ).toEqual([{ type: 'timeOfDay', value: 'evening' }]);
    expect(
      owlMessages
        .getMessagesByCategory('app:return')
        .find((m) => m.id === 'return-streak-big-1')!.conditions
    ).toEqual([{ type: 'streak', value: 7, operator: 'gte' }]);
    expect(
      owlMessages
        .getMessagesByCategory('game:start')
        .find((m) => m.id === 'game-start-first-1')!.conditions
    ).toEqual([{ type: 'firstTime', value: true }]);
    expect(
      owlMessages
        .getMessagesByCategory('game:end')
        .find((m) => m.id === 'win-generic-1')!.conditions
    ).toEqual([{ type: 'playerWon', value: true }]);
    expect(
      owlMessages
        .getMessagesByCategory('game:end')
        .find((m) => m.id === 'loss-encouraging-4')!.conditions
    ).toEqual([{ type: 'playerWon', value: false }]);
    expect(
      owlMessages
        .getMessagesByCategory('game:end')
        .find((m) => m.id === 'draw-2')!.conditions
    ).toBeUndefined();
    expect(
      owlMessages
        .getMessagesByCategory('streak:update')
        .find((m) => m.id === 'streak-week-1')!.conditions
    ).toEqual([{ type: 'streak', value: 7, operator: 'eq' }]);
    expect(
      owlMessages
        .getMessagesByCategory('milestone:reached')
        .map((m) => m.id)
        .sort()
    ).toEqual([
      'milestone-games-10',
      'milestone-games-100',
      'milestone-games-50',
    ]);
    expect(owlMessages.getMessagesByCategory('app:return')).toHaveLength(9);
  });
});
