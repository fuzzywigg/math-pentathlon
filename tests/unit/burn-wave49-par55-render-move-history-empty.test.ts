/**
 * Wave 49 leftover after #221/#226/#227 — Par55 empty move history. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { renderMoveHistory } from '../../src/games/par-55/board-ui';

describe('Wave 49 par55 — empty history', () => {
  it('renders title with empty list', () => {
    const el = renderMoveHistory(createInitialState());
    expect(el.classList.contains('par55-history')).toBe(true);
    expect(el.querySelector('h4')?.textContent).toBe('Move History');
    expect(el.querySelectorAll('.par55-history-move')).toHaveLength(0);
  });
});
