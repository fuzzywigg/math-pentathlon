/**
 * Overnight HEAVY leftover after #229 — Prime Gold move history empty + entry. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { renderMoveHistory } from '../../src/games/prime-gold/board-ui';

describe('Wave 50 prime — move history', () => {
  it('empty history is header-only; entry shows Blue expression', () => {
    const empty = renderMoveHistory(createInitialState());
    expect(empty.querySelector('h3')?.textContent).toBe('Move History');
    expect(empty.querySelectorAll('.pg-move-item').length).toBe(0);

    const withMove = {
      ...createInitialState(),
      moveHistory: [
        {
          player: 'player1' as const,
          dice: { die1: 2, die2: 3, die3: 5 },
          expression: '2+3',
          result: 5,
          row: 0,
          col: 1,
        },
      ],
    };
    const el = renderMoveHistory(withMove);
    const item = el.querySelector('.pg-move-item.player1');
    expect(item?.textContent).toMatch(/Blue: 2\+3/);
    expect(item?.querySelector('strong')?.textContent).toBe('5');
  });
});
