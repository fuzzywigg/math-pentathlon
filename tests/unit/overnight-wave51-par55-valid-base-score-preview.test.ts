/**
 * Overnight HEAVY leftovers after #234 — Par55 valid bases + score preview. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectBlock } from '../../src/games/par-55/rules';
import { renderBoard } from '../../src/games/par-55/board-ui';

describe('Wave 51 par55 — valid preview', () => {
  it('marks valid bases and may show +N score preview when selected', () => {
    const base = createInitialState();
    const id = base.hands.player1[0]!.id;
    const state = selectBlock(base, id);
    const el = renderBoard(state, () => undefined);
    expect(el.querySelectorAll('.par55-valid-base').length).toBeGreaterThan(0);
    // preview only when calculateScore > 0 for a valid base
    const previews = el.querySelectorAll('.par55-score-preview');
    for (const p of previews) {
      expect(p.textContent).toMatch(/^\+\d+$/);
    }
  });
});
