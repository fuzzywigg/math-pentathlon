/**
 * Wave 49 — Sum Dominoes dice sum label leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 49 sum — dice sum label', () => {
  it('shows = N for rolled pair', () => {
    const el = renderDice([3, 4], () => undefined, false);
    expect(el.querySelector('.sd-dice-sum')?.textContent).toBe('= 7');
  });
});
