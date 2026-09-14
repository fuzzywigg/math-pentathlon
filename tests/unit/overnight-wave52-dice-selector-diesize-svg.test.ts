/**
 * Overnight HEAVY leftover after #234 — DiceSelector dieSize → settled SVG width.
 * dieSize tested on animateRoll/renderRollResult, not selector options. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { DiceSelector } from '../../src/core/dice/dice-selector';
import { COMMON_DICE_SETS } from '../../src/core/dice/types';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
  document.getElementById('dice-selector-styles')?.remove();
});

describe('Wave 52 dice-selector — dieSize', () => {
  it('settled dice SVG width matches dieSize: 40', () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.42);
    const root = document.createElement('div');
    document.body.appendChild(root);
    const sel = new DiceSelector(root, {
      diceSet: COMMON_DICE_SETS.standard,
      dieSize: 40,
    });
    sel.roll();
    vi.advanceTimersByTime(900);
    const svg = root.querySelector('#dice-result-area svg, .die-wrapper svg, svg.die');
    expect(svg?.getAttribute('width')).toBe('40');
    sel.destroy();
  });
});
