/**
 * Overnight HEAVY leftover after #229 — Prime Gold expression items + prime class. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState, getValidPlacements } from '../../src/games/prime-gold/rules';
import { isPrime } from '../../src/games/prime-gold/types';
import { renderExpressions } from '../../src/games/prime-gold/board-ui';

describe('Wave 50 prime — expression items', () => {
  it('lists placements; prime values get .prime; click selects', () => {
    const state = {
      ...createInitialState(),
      phase: 'placing' as const,
      diceRoll: { die1: 2, die2: 3, die3: 5 },
    };
    const placements = getValidPlacements(state);
    expect(placements.length).toBeGreaterThan(0);
    const onSelect = vi.fn();
    const el = renderExpressions(state, onSelect);
    const items = el.querySelectorAll('.pg-expr-item');
    expect(items.length).toBe(placements.length);
    const primeItem = [...items].find((n) => n.classList.contains('prime'));
    const anyPrime = placements.some((p) => isPrime(p.value));
    if (anyPrime) expect(primeItem).toBeTruthy();
    (items[0] as HTMLElement).click();
    expect(onSelect).toHaveBeenCalledWith(placements[0].value, placements[0].expr);
  });
});
