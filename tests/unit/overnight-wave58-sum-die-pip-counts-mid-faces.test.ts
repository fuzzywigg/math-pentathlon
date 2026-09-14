/**
 * Wave 58 Contig/SD residual — Sum die pip counts for faces 2 and 5. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 58 sum — mid-face pip counts', () => {
  it('renderDice [2,5] yields 2 and 5 pips', () => {
    const el = renderDice([2, 5], () => undefined, false);
    const dies = [...el.querySelectorAll('.sd-die')];
    expect(dies).toHaveLength(2);
    expect(dies[0]!.querySelectorAll('.sd-die-pip').length).toBe(2);
    expect(dies[1]!.querySelectorAll('.sd-die-pip').length).toBe(5);
  });
});
