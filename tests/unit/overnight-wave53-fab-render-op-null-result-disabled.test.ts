/**
 * Wave 53 leftover after #235 — Fab null-result op disabled (÷0). Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState, selectBar1, selectBar2 } from '../../src/games/fab-a-diffy/rules';
import { renderOperationSelector } from '../../src/games/fab-a-diffy/board-ui';
import type { FabADiffyState } from '../../src/games/fab-a-diffy/types';

describe('Wave 53 fab — op null-result disabled', () => {
  it('disables divide when bar2 numerator is 0 (null result)', () => {
    const base = createInitialState();
    const [b1, b2] = [...base.fractionBars.keys()];
    const bars = new Map(base.fractionBars);
    bars.set(b2, {
      ...bars.get(b2)!,
      fraction: { numerator: 0, denominator: 4 },
    });
    let state: FabADiffyState = { ...base, fractionBars: bars };
    state = selectBar2(selectBar1(state, b1), b2);
    const onSelect = vi.fn();
    const el = renderOperationSelector(state, onSelect);
    const btns = [...el.querySelectorAll('.fab-op-btn')] as HTMLButtonElement[];
    const divide = btns.find((b) => {
      const sym = b.querySelector('.fab-op-symbol')?.textContent;
      return sym === '÷' || sym === '/';
    });
    expect(divide).toBeTruthy();
    expect(divide!.disabled).toBe(true);
    expect(divide!.classList.contains('fab-op-disabled')).toBe(true);
    expect(divide!.querySelector('.fab-op-result')?.textContent).toBe('—');
    divide!.click();
    expect(onSelect).not.toHaveBeenCalled();
  });
});
