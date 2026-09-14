/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl draw-1/draw-2 exact pair.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — draw pair copy', () => {
  it('pins draw-1 and draw-2 exact library texts', () => {
    const end = owlMessages.getMessagesByCategory('game:end');
    expect(end.find((m) => m.id === 'draw-1')!.text).toBe(
      'A draw! Both players matched wits perfectly. Impressive!'
    );
    expect(end.find((m) => m.id === 'draw-2')!.text).toBe(
      'Tied game! That means you were evenly matched. Great job!'
    );
  });
});
