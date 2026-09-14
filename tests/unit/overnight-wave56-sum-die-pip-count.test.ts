/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Sum die pip count. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 56 sum — die pip count', () => {
  it('die faces mount sd-die-pip counts leftover', () => {
    const el = renderDice([5, 3], () => undefined, false);
    const dies = [...el.querySelectorAll('.sd-die')];
    expect(dies[0]!.querySelectorAll('.sd-die-pip').length).toBe(5);
    expect(dies[1]!.querySelectorAll('.sd-die-pip').length).toBe(3);
  });
});
