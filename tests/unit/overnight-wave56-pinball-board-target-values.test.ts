/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball board high-value target count.
 * Wave54 covered fills; 100/50 position leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderPinballBoard } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 56 pinball board — target values', () => {
  it('renders ten targets including one 100 leftover', () => {
    const svg = renderPinballBoard(createInitialState());
    const texts = Array.from(svg.querySelectorAll('text')).map(
      (t) => t.textContent
    );
    expect(texts).toHaveLength(10);
    expect(texts.filter((t) => t === '100')).toHaveLength(1);
    expect(texts.filter((t) => t === '50')).toHaveLength(2);
    expect(texts.filter((t) => t === '30')).toHaveLength(2);
    expect(texts.filter((t) => t === '20')).toHaveLength(3);
    expect(texts.filter((t) => t === '10')).toHaveLength(2);
  });
});
