/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Remainder value font-size. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderBoard } from '../../src/games/remainder-islands/board-ui';

describe('Wave 56 remainder — value font size', () => {
  it('island value text font-size 24 bold leftover', () => {
    const el = renderBoard(createInitialState(), () => undefined);
    const texts = [...el.querySelectorAll('text')];
    const valueText = texts.find((t) => t.getAttribute('font-size') === '24');
    expect(valueText?.getAttribute('font-weight')).toBe('bold');
  });
});
