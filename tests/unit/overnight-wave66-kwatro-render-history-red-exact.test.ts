/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro history Red exact.
 * Wave55 soft-matches Red: 7; deepen exact innerHTML. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderMoveHistory } from '../../src/games/kwatro-sinko/board-ui';
import type { Chip, KwaState } from '../../src/games/kwatro-sinko/types';

describe('Wave 66 kwatro — render history Red exact', () => {
  it('history move uses strong moveNumber and Red label', () => {
    const base = createInitialState();
    const chip: Chip = {
      id: 'p2-0',
      value: 1,
      owner: 'player2',
      position: 'n3-0',
    };
    const state: KwaState = {
      ...base,
      moveHistory: [
        {
          moveNumber: 2,
          player: 'player2',
          chip,
          fromNode: 'n4-0',
          toNode: 'n3-0',
          alignment: null,
        },
      ],
    };
    const el = renderMoveHistory(state);
    const move = el.querySelector('.kwa-history-move.player2');
    expect(move?.innerHTML).toBe('<strong>2.</strong> Red: 1');
  });
});
