/**
 * Wave 49 leftover after #221/#226/#227 — Sum Dominoes dice sum display. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 49 sum — dice sum', () => {
  it('shows pip dice and sum text', () => {
    const el = renderDice([3, 4], () => undefined, false);
    expect(el.querySelectorAll('.sd-die')).toHaveLength(2);
    expect(el.querySelector('.sd-dice-sum')?.textContent).toBe('= 7');
  });
});
