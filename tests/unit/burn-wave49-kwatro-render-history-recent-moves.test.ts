/**
 * Wave 49 leftover after #221/#226/#227 — Kwatro history shows recent moves. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderMoveHistory } from '../../src/games/kwatro-sinko/board-ui';
import type { KwaState, Chip } from '../../src/games/kwatro-sinko/types';

describe('Wave 49 kwatro — history recent', () => {
  it('renders last move with Blue label and chip value', () => {
    const base = createInitialState();
    const chip: Chip = { id: 'p1-0', value: 2, owner: 'player1', position: 'n1-0' };
    const state: KwaState = {
      ...base,
      moveHistory: [
        {
          moveNumber: 1,
          player: 'player1',
          chip,
          fromNode: 'n0-0',
          toNode: 'n1-0',
          alignment: null,
        },
      ],
    };
    const el = renderMoveHistory(state);
    expect(el.querySelectorAll('.kwa-history-move')).toHaveLength(1);
    expect(el.textContent).toMatch(/Blue/);
    expect(el.textContent).toMatch(/2/);
  });
});
