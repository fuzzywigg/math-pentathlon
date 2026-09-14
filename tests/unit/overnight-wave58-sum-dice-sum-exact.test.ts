/**
 * Wave 58 leftover after #267 — Sum dice sum exact = N copy.
 * Distinct from role=grid leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 58 sum — dice sum exact', () => {
  it('rolled [3,4] exposes = 7 sum chrome', () => {
    const el = renderDice([3, 4], () => undefined, false);
    expect(el.querySelector('.sd-dice-sum')?.textContent).toBe('= 7');
  });
});
