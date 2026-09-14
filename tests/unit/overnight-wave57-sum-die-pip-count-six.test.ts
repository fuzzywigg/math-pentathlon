/**
 * Wave 57 leftover after #267 — Sum die pip counts for faces 6 and 1. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 57 sum — die pip counts', () => {
  it('face 6 has six pips and face 1 has one', () => {
    const el = renderDice([6, 1], () => undefined, false);
    const dice = el.querySelectorAll('.sd-die');
    expect(dice[0]!.querySelectorAll('.sd-die-pip')).toHaveLength(6);
    expect(dice[1]!.querySelectorAll('.sd-die-pip')).toHaveLength(1);
  });
});
