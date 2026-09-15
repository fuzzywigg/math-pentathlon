/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro history strong moveNumber.
 * Wave49/55 soft-match Blue/Red; deepen exact <strong>N.</strong> markup. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderMoveHistory } from '../../src/games/kwatro-sinko/board-ui';
import type { Chip, KwaState } from '../../src/games/kwatro-sinko/types';

describe('Wave 66 kwatro — render history strong number', () => {
  it('history move uses strong moveNumber and Blue label', () => {
    const base = createInitialState();
    const chip: Chip = {
      id: 'p1-0',
      value: 0,
      owner: 'player1',
      position: 'n1-0',
    };
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
    const move = el.querySelector('.kwa-history-move.player1');
    expect(move?.innerHTML).toBe('<strong>1.</strong> Blue: 0');
  });
});
