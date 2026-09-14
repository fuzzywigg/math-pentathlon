/**
 * Wave 54 leftover after #240 — Fab selected bar SVG stroke leftover (wave53 fill). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectBar1 } from '../../src/games/fab-a-diffy/rules';
import { renderFractionBarPool } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 54 fab — selected bar border', () => {
  it('selected bar rect stroke is #ff9800', () => {
    const base = createInitialState();
    const id = [...base.fractionBars.keys()][0]!;
    const el = renderFractionBarPool(selectBar1(base, id), () => undefined);
    const strokes = [...el.querySelectorAll(`[data-bar-id="${id}"] rect`)].map((r) =>
      r.getAttribute('stroke')
    );
    expect(strokes).toContain('#ff9800');
  });
});
