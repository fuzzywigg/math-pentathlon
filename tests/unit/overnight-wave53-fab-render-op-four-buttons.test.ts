/**
 * Wave 53 leftover after #235 — Fab four op buttons. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectBar1, selectBar2 } from '../../src/games/fab-a-diffy/rules';
import { renderOperationSelector } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 53 fab — op four buttons', () => {
  it('renders four op buttons with symbol + result spans', () => {
    const base = createInitialState();
    const [a, b] = [...base.fractionBars.keys()];
    const el = renderOperationSelector(selectBar2(selectBar1(base, a), b), () => undefined);
    const btns = el.querySelectorAll('.fab-op-btn');
    expect(btns.length).toBe(4);
    for (const btn of btns) {
      expect(btn.querySelector('.fab-op-symbol')).toBeTruthy();
      expect(btn.querySelector('.fab-op-result')).toBeTruthy();
    }
  });
});
