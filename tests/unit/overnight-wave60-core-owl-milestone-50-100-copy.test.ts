/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl milestone 50/100 exact copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — milestone 50/100 copy', () => {
  it('pins enthusiast and LEGEND milestone texts', () => {
    const ms = owlMessages.getMessagesByCategory('milestone:reached');
    expect(ms.find((m) => m.id === 'milestone-games-50')!.text).toBe(
      '50 games! You are officially a Math Pentathlon enthusiast!'
    );
    expect(ms.find((m) => m.id === 'milestone-games-100')!.text).toBe(
      '100 GAMES! You are a Math Pentathlon LEGEND!'
    );
  });
});
