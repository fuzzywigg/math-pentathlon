/**
 * Wave 49 — Par55 empty move history leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { renderMoveHistory } from '../../src/games/par-55/board-ui';

describe('Wave 49 par55 — history empty', () => {
  it('renders title with empty list', () => {
    const el = renderMoveHistory(createInitialState());
    expect(el.querySelector('h4')?.textContent).toBe('Move History');
    expect(el.querySelectorAll('.par55-history-move').length).toBe(0);
  });
});
