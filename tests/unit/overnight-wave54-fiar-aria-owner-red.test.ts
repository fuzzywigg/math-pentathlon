/**
 * Wave 54 leftover after #237 — FIAR player2 chip aria Red leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 54 fiar — aria owner Red', () => {
  it('player2 chip aria-label includes Red', () => {
    const base = createInitialState();
    const n = base.board.nodes.get('4-4')!;
    base.board.nodes.set('4-4', { ...n, chip: 'player2' });
    const svg = renderBoard(base, () => undefined);
    const label = svg.querySelector('[data-node-id="4-4"]')!.getAttribute('aria-label') || '';
    expect(label).toMatch(/Red/);
  });
});
