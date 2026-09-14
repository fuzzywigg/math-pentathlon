/**
 * Wave 54 leftover after #240 — Fab history section header copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { renderMoveHistory } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 54 fab — history header', () => {
  it('renders Move History heading on empty list', () => {
    const el = renderMoveHistory(createInitialState());
    expect(el.querySelector('.fab-section-header')?.textContent).toBe('Move History');
    expect(el.querySelector('.fab-history-list')?.children.length).toBe(0);
  });
});
