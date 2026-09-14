/**
 * Wave 49 leftover after #221/#226/#227 — Stars empty move history. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/stars-bars/rules';
import { renderMoveHistory } from '../../src/games/stars-bars/board-ui';

describe('Wave 49 stars — empty history', () => {
  it('renders title with no move items', () => {
    const el = renderMoveHistory(createInitialState());
    expect(el.classList.contains('stars-move-history')).toBe(true);
    expect(el.querySelector('h3')?.textContent).toBe('Move History');
    expect(el.querySelectorAll('.stars-move-item')).toHaveLength(0);
  });
});
