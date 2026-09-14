/**
 * Wave 49 — Kwatro history seat class leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderMoveHistory } from '../../src/games/kwatro-sinko/board-ui';
import type { KwaMove } from '../../src/games/kwatro-sinko/types';

describe('Wave 49 kwatro — history seat class', () => {
  it('applies player1/player2 class on rows', () => {
    const base = createInitialState();
    const chip = [...base.chips.values()][0]!;
    const moves: KwaMove[] = [
      { player: 'player1', chip, fromNode: 'a', toNode: 'b', alignment: null, moveNumber: 1 },
      { player: 'player2', chip, fromNode: 'b', toNode: 'c', alignment: null, moveNumber: 2 },
    ];
    const el = renderMoveHistory({ ...base, moveHistory: moves });
    expect(el.querySelector('.kwa-history-move.player1')).toBeTruthy();
    expect(el.querySelector('.kwa-history-move.player2')).toBeTruthy();
  });
});
