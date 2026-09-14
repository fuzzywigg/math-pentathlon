/**
 * Wave 55 leftover after #250 — Par 55 history slice(-6) + Red entry. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { renderMoveHistory } from '../../src/games/par-55/board-ui';
import type { AttributeBlock, Par55Move } from '../../src/games/par-55/types';

const block: AttributeBlock = {
  id: 'b',
  shape: 'circle',
  color: 'blue',
  size: 'small',
  thickness: 'thin',
};

describe('Wave 55 par55 — history cap', () => {
  it('keeps last 6; Red chrome on newest shown', () => {
    const base = createInitialState();
    const moveHistory: Par55Move[] = Array.from({ length: 8 }, (_, i) => ({
      player: i === 7 ? 'player2' : 'player1',
      block,
      baseId: `b${i}`,
      pointsScored: i === 7 ? 3 : 1,
      matchDetails: [],
      moveNumber: i + 1,
    }));
    const el = renderMoveHistory({ ...base, moveHistory });
    const items = el.querySelectorAll('.par55-history-move');
    expect(items).toHaveLength(6);
    expect(el.textContent).not.toMatch(/1\./);
    expect(el.textContent).not.toMatch(/2\./);
    expect(items[0]?.textContent).toMatch(/3\./);
    expect(items[5]?.textContent).toMatch(/8\.\s*Red: blue circle \(\+3\)/);
  });
});
