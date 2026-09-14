/**
 * Wave 56 leftover after #256 — Prime Gold history Red player2 entry.
 * Distinct from wave50 Blue-only history leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { renderMoveHistory } from '../../src/games/prime-gold/board-ui';

describe('Wave 56 prime — history Red entry', () => {
  it('renders .pg-move-item.player2 with Red: expression', () => {
    const state = {
      ...createInitialState(),
      moveHistory: [
        {
          player: 'player2' as const,
          dice: { die1: 2, die2: 3, die3: 5 },
          expression: '5-2',
          result: 3,
          row: 1,
          col: 2,
        },
      ],
    };
    const el = renderMoveHistory(state);
    const item = el.querySelector('.pg-move-item.player2');
    expect(item?.textContent).toMatch(/Red: 5-2/);
    expect(item?.querySelector('strong')?.textContent).toBe('3');
  });
});
