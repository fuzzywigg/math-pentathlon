/**
 * Overnight HEAVY leftovers after #236 — Contig expr option callback leftover. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { renderExpressionSelector } from '../../src/games/contig-60/board-ui';

describe('Wave 53 contig — expr option click', () => {
  it('passes .expr-result and formula source to onSelect', () => {
    const state = {
      ...createInitialState(),
      currentDice: [1, 2, 3] as [number, number, number],
      phase: 'calculating' as const,
    };
    const onSelect = vi.fn();
    const el = renderExpressionSelector(state, onSelect, () => undefined);
    const option = el.querySelector('.contig-expr-option') as HTMLButtonElement;
    const result = Number(option.querySelector('.expr-result')?.textContent);
    option.click();
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0]![0]).toBe(result);
    expect(String(onSelect.mock.calls[0]![1])).toMatch(/\d/);
  });
});
