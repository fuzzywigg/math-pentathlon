/**
 * Wave 49 — Sum Dominoes roll disabled leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 49 sum — roll disabled', () => {
  it('disables roll CTA when canRoll is false', () => {
    const el = renderDice(null, () => undefined, false);
    const btn = el.querySelector('.sd-roll-btn') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });
});
