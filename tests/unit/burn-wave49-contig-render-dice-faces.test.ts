/**
 * Wave 49 leftover after #221/#226/#227 — Contig renderDice faces. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/contig-60/board-ui';

describe('Wave 49 contig — renderDice faces', () => {
  it('renders three die faces for a roll', () => {
    const el = renderDice([1, 3, 6], () => undefined, false);
    expect(el.querySelectorAll('.contig-die')).toHaveLength(3);
    expect(el.querySelector('.contig-roll-btn')).toBeNull();
  });
});
