/**
 * Wave 49 — Kwatro empty move history leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderMoveHistory } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 49 kwatro — history empty', () => {
  it('renders title with empty list', () => {
    const el = renderMoveHistory(createInitialState());
    expect(el.querySelector('h4')?.textContent).toBe('Move History');
    expect(el.querySelectorAll('.kwa-history-move').length).toBe(0);
  });
});
