/**
 * Overnight HEAVY leftovers after #236 — Contig dice-area class leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/contig-60/board-ui';

describe('Wave 53 contig — dice-area', () => {
  it('wraps both roll and faces in contig-dice-area', () => {
    expect(renderDice(null, () => undefined, true).className).toBe('contig-dice-area');
    expect(renderDice([4, 5, 6], () => undefined, false).className).toBe('contig-dice-area');
  });
});
