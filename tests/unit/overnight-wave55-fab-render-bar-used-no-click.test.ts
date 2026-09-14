/**
 * Wave 55 leftover after #249/#250 — Fab used bar click no-op + empty fill. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { renderFractionBarPool } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 55 fab — used bar no click', () => {
  it('used wrapper does not fire onBarClick; unused unselected uses denom color', () => {
    const base = createInitialState();
    const [usedId, unusedId] = [...base.fractionBars.keys()];
    const bars = new Map(base.fractionBars);
    bars.set(usedId, { ...bars.get(usedId)!, used: true });
    const onClick = vi.fn();
    const el = renderFractionBarPool({ ...base, fractionBars: bars }, onClick);
    const used = el.querySelector(`[data-bar-id="${usedId}"]`) as HTMLElement;
    used.click();
    expect(onClick).not.toHaveBeenCalled();
    expect(used.classList.contains('fab-bar-used')).toBe(true);

    const unused = el.querySelector(`[data-bar-id="${unusedId}"]`) as HTMLElement;
    const fills = [...unused.querySelectorAll('rect')].map((r) =>
      r.getAttribute('fill')
    );
    expect(fills).toContain('#e0e0e0');
    expect(fills.some((f) => f && f !== '#e0e0e0' && f !== '#ff9800')).toBe(
      true
    );
  });
});
