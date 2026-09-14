/**
 * Wave 49 — Kwatro history last-6 slice leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderMoveHistory } from '../../src/games/kwatro-sinko/board-ui';
import type { KwaMove, Chip } from '../../src/games/kwatro-sinko/types';

describe('Wave 49 kwatro — history last six', () => {
  it('shows only the trailing six moves', () => {
    const base = createInitialState();
    const chip: Chip = { id: 'x', value: 2, owner: 'player1', position: null };
    const moves: KwaMove[] = Array.from({ length: 8 }, (_, i) => ({
      player: i % 2 === 0 ? 'player1' : 'player2',
      chip,
      fromNode: 'a',
      toNode: 'b',
      alignment: null,
      moveNumber: i + 1,
    }));
    const el = renderMoveHistory({ ...base, moveHistory: moves });
    const rows = [...el.querySelectorAll('.kwa-history-move')];
    expect(rows.length).toBe(6);
    expect(rows[0]?.textContent).toMatch(/^3\./);
    expect(rows[5]?.textContent).toMatch(/^8\./);
  });
});
