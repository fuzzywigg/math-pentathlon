/**
 * Wave 49 leftover after #221/#226/#227 — Kwatro empty move history chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderMoveHistory } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 49 kwatro — empty history', () => {
  it('renders title with empty list at opening', () => {
    const el = renderMoveHistory(createInitialState());
    expect(el.classList.contains('kwa-history')).toBe(true);
    expect(el.querySelector('h4')?.textContent).toBe('Move History');
    expect(el.querySelectorAll('.kwa-history-move')).toHaveLength(0);
  });
});
