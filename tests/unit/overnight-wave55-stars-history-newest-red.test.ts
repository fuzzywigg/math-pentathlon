/**
 * Wave 55 leftover after #250 — Stars history newest-first + Red (row+1, colLetter). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/stars-bars/rules';
import { renderMoveHistory } from '../../src/games/stars-bars/board-ui';
import type { AttributeCard, MoveRecord } from '../../src/games/stars-bars/types';

const card = (shape: AttributeCard['shape'], id: string): AttributeCard => ({
  id,
  shape,
  color: 'blue',
  size: 'small',
  thickness: 'thin',
});

describe('Wave 55 stars — history order', () => {
  it('newest first; Red at (3,C)', () => {
    const base = createInitialState();
    const moveHistory: MoveRecord[] = [
      { player: 'player1', card: card('hexagon', 'a'), row: 0, col: 0, score: 1, breakdown: '' },
      { player: 'player1', card: card('square', 'b'), row: 0, col: 1, score: 2, breakdown: '' },
      {
        player: 'player2',
        card: card('circle', 'c'),
        row: 2,
        col: 2,
        score: 3,
        breakdown: '',
      },
    ];
    const el = renderMoveHistory({ ...base, moveHistory });
    const items = el.querySelectorAll('.stars-move-item');
    expect(items[0]?.textContent).toBe('Red: circle at (3,C) = +3');
    expect(items[2]?.textContent).toMatch(/\+1/);
  });
});
