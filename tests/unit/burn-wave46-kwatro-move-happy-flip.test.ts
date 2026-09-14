/**
 * Wave 46 — Kwatro moveChip happy seat flip leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectChip, moveChip } from '../../src/games/kwatro-sinko/rules';

describe('Wave 46 kwatro — move happy flip', () => {
  it('opening move advances to player2 with history', () => {
    const next = moveChip(selectChip(createInitialState(), 'p1-0'), 'n1-0');
    expect(next.currentPlayer).toBe('player2');
    expect(next.moveHistory).toHaveLength(1);
    expect(next.chips.get('p1-0')?.position).toBe('n1-0');
    expect(next.phase).toBe('selectingChip');
  });
});
