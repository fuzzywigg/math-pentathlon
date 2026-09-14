/**
 * Wave 57 leftover after #267 — Sum Roll Dice button exact label. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 57 sum — roll btn label', () => {
  it('opening roll button text is Roll Dice', () => {
    const el = renderDice(null, () => undefined, true);
    expect(el.querySelector('.sd-roll-btn')?.textContent).toBe('Roll Dice');
  });
});
