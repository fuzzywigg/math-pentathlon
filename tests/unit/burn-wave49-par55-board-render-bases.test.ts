/**
 * Wave 49 — Par55 renderBoard bases leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { renderBoard } from '../../src/games/par-55/board-ui';

describe('Wave 49 par55 — renderBoard bases', () => {
  it('renders board with data-base-id for every base', () => {
    const s = createInitialState();
    const el = renderBoard(s, () => undefined);
    expect(el.classList.contains('par55-board')).toBe(true);
    const ids = [...el.querySelectorAll('[data-base-id]')].map((n) =>
      n.getAttribute('data-base-id')
    );
    expect(ids.length).toBe(s.bases.size);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
