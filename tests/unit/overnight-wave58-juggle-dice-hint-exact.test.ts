/**
 * Wave 58 leftover after #262 (retry #273 RED) — Juggle dice-area hint exact copy.
 * Distinct from controller "Click a die to choose shape category". Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/juggle/board-ui';

describe('Wave 58 juggle — dice hint exact', () => {
  it('shows exact die-category hint when dice are present', () => {
    const el = renderDice(
      [3, 5],
      () => undefined,
      () => undefined,
      false,
      'selectingShape'
    );
    expect(el.querySelector('.juggle-hint')?.textContent).toBe(
      'Click a die to choose that shape category'
    );
  });
});
