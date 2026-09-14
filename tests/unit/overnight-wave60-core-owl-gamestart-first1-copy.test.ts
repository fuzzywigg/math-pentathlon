/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl game-start-first-1 exact copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — game-start-first-1 copy', () => {
  it('pins first-time game start template', () => {
    const msg = owlMessages
      .getMessagesByCategory('game:start')
      .find((m) => m.id === 'game-start-first-1');
    expect(msg!.priority).toBe('high');
    expect(msg!.text).toBe(
      'Your first time playing {gameName}! Take your time and have fun learning!'
    );
    expect(msg!.conditions).toEqual([{ type: 'firstTime', value: true }]);
  });
});
