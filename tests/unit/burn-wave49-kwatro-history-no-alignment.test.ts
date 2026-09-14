/**
 * Wave 49 — Kwatro history without alignment leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderMoveHistory } from '../../src/games/kwatro-sinko/board-ui';
import type { KwaMove } from '../../src/games/kwatro-sinko/types';

describe('Wave 49 kwatro — history no align', () => {
  it('omits arrow when alignment null', () => {
    const base = createInitialState();
    const chip = [...base.chips.values()][0]!;
    const move: KwaMove = {
      player: 'player2',
      chip,
      fromNode: 'n4-0',
      toNode: 'n3-0',
      alignment: null,
      moveNumber: 2,
    };
    const el = renderMoveHistory({ ...base, moveHistory: [move] });
    expect(el.querySelector('.kwa-history-move')?.textContent).toMatch(/Red:/);
    expect(el.querySelector('.kwa-history-move')?.textContent).not.toContain('→');
  });
});
