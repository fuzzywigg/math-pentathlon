/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball board value order catalog.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderPinballBoard } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 56 pinball board — value order', () => {
  it('board texts follow 100,50,50,30,30,20,20,20,10,10 leftover', () => {
    const svg = renderPinballBoard(createInitialState());
    const values = [...svg.querySelectorAll('text')].map((t) => t.textContent);
    expect(values).toEqual([
      '100',
      '50',
      '50',
      '30',
      '30',
      '20',
      '20',
      '20',
      '10',
      '10',
    ]);
  });
});
