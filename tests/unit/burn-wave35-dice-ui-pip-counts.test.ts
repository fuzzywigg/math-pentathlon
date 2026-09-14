/**
 * Wave 35 — d6 pip count matrix via renderDie leftovers.
 * Distinct from #161 fallback. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { renderDie, type DieRoll } from '../../src/core/dice';

afterEach(() => {
  document.body.innerHTML = '';
});

function die(value: number): DieRoll {
  return {
    id: `d-${value}`,
    diceType: 'd6',
    value,
    isSelected: false,
    isLocked: false,
    timestamp: 0,
  };
}

describe('Wave 35 dice-ui-pips — circle counts', () => {
  it.each([
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 4],
    [5, 5],
    [6, 6],
  ] as const)('face %i renders %i pip circles', (value, pips) => {
    const svg = renderDie(die(value), 60);
    // pip circles are small filled circles inside the die (exclude body overlays)
    const circles = svg.querySelectorAll('circle');
    expect(circles.length).toBe(pips);
  });
});
