/**
 * Overnight TOKENMAXX HEAVY leftovers after #298 — Owl MESSAGE_LIBRARY residual handshake.
 * Tip alpha after #301. MESSAGE_LIBRARY residual only. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 63 handshake — owl MESSAGE_LIBRARY residual', () => {
  it('stitches unpinned residual ids across categories', () => {
    expect(
      owlMessages
        .getMessagesByCategory('app:return')
        .find((m) => m.id === 'return-generic-1')!.text
    ).toMatch(/Welcome back/);
    expect(
      owlMessages
        .getMessagesByCategory('game:start')
        .find((m) => m.id === 'game-start-return-2')!.text
    ).toMatch(/Back for more/);
    expect(
      owlMessages
        .getMessagesByCategory('game:end')
        .find((m) => m.id === 'win-generic-5')!.text
    ).toMatch(/Champion/);
    expect(
      owlMessages
        .getMessagesByCategory('game:end')
        .find((m) => m.id === 'loss-encouraging-4')!.text
    ).toMatch(/Close game/);
    expect(
      owlMessages
        .getMessagesByCategory('tutorial:start')
        .find((m) => m.id === 'tutorial-start-1')!.text
    ).toMatch(/Smart choice/);
    expect(
      owlMessages
        .getMessagesByCategory('achievement:unlock')
        .find((m) => m.id === 'achievement-unlock-1')!.text
    ).toMatch(/ACHIEVEMENT UNLOCKED/);
    expect(
      owlMessages
        .getMessagesByCategory('streak:update')
        .find((m) => m.id === 'streak-record-1')!.text
    ).toMatch(/PERSONAL RECORD/);
    expect(
      owlMessages
        .getMessagesByCategory('app:return')
        .find((m) => m.id === 'return-streak-big-1')!.text
    ).toMatch(/UNSTOPPABLE/);
  });
});
