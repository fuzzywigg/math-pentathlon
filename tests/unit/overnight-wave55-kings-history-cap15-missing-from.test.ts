/**
 * Wave 55 leftover after #250 — Kings history cap 15 + missing-from "?" + move-p2. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderMoveHistory } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 kings — history cap + p2 missing from', () => {
  it('shows last 15, newest numbered 16, player2 missing-from as ?', () => {
    const base = createInitialGameState();
    const moveHistory = Array.from({ length: 16 }, (_, i) => ({
      player: (i % 2 === 0 ? 'player1' : 'player2') as const,
      action: 'moveKing' as const,
      ...(i === 15 ? {} : { from: { row: 2, col: 5 } }),
      to: { row: 3, col: 5 },
    }));
    const el = document.createElement('div');
    renderMoveHistory({ ...base, moveHistory }, el);
    const entries = el.querySelectorAll('.move-history-entry');
    expect(entries).toHaveLength(15);
    expect(entries[0]?.textContent).toMatch(/^16\./);
    expect(entries[0]?.classList.contains('move-p2')).toBe(true);
    expect(entries[0]?.textContent).toMatch(/\?→/);
  });
});
