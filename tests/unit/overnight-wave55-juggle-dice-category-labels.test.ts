/**
 * Wave 55 leftover after #250 — Juggle die labels via getCategoryName.
 * Distinct from wave43 DICE_TO_CATEGORY catalog. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/juggle/board-ui';
import { getCategoryFromDie, getCategoryName } from '../../src/games/juggle/types';

describe('Wave 55 juggle — dice category labels', () => {
  it('labels each die with its category display name', () => {
    const el = renderDice([1, 4], () => undefined, () => undefined, false, 'selectingShape');
    const labels = [...el.querySelectorAll('.juggle-die-label')].map((n) => n.textContent);
    expect(labels[0]).toBe(getCategoryName(getCategoryFromDie(1)));
    expect(labels[1]).toBe(getCategoryName(getCategoryFromDie(4)));
    expect(labels[0]).toMatch(/Monomino/);
    expect(labels[1]).toMatch(/Tetromino/);
  });
});
