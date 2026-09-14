/**
 * Wave 55 leftover after #250 — Juggle getDieFace fallback for non-1..6.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/juggle/board-ui';

describe('Wave 55 juggle — invalid die face fallback', () => {
  it('renders numeric text for 0 and 7', () => {
    const el = renderDice([0, 7], () => undefined, () => undefined, false, 'placing');
    const texts = [...el.querySelectorAll('.juggle-die')].map((d) => d.textContent);
    expect(texts).toEqual(['0', '7']);
  });
});
