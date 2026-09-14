/**
 * Wave 57 leftover after #262 — Juggle Roll Dice button exact text.
 * Distinct from roll CTA existence. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/juggle/board-ui';

describe('Wave 57 juggle — roll dice exact', () => {
  it('renders exact Roll Dice button label', () => {
    const el = renderDice(
      null,
      () => undefined,
      () => undefined,
      true,
      'rolling'
    );
    expect(el.querySelector('.juggle-roll-btn')?.textContent).toBe('Roll Dice');
  });
});
