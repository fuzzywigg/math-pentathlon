/**
 * Wave 49 — Contig renderDice face chrome leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/contig-60/board-ui';

describe('Wave 49 contig — dice faces', () => {
  it('mounts three contig-die faces for a rolled triple', () => {
    const el = renderDice([2, 5, 6], () => undefined, false);
    expect(el.querySelector('.contig-dice-display')).toBeTruthy();
    expect(el.querySelectorAll('.contig-die')).toHaveLength(3);
  });
});
