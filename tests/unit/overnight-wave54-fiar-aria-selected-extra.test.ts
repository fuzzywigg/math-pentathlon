/**
 * Wave 54 leftover after #237 — FIAR selected node aria extras leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 54 fiar — aria selected extra', () => {
  it('selected movement chip aria includes selected', () => {
    const base = createInitialState();
    const n = base.board.nodes.get('0-0')!;
    base.board.nodes.set('0-0', { ...n, chip: 'player1' });
    const state = {
      ...base,
      phase: 'movement' as const,
      chipsPlaced: { player1: 4, player2: 4 },
      selectedNode: '0-0',
    };
    const svg = renderBoard(state, () => undefined);
    const label = svg.querySelector('[data-node-id="0-0"]')!.getAttribute('aria-label') || '';
    expect(label).toMatch(/selected/);
    expect(label).toMatch(/Blue/);
  });
});
