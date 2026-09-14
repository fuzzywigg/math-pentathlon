/**
 * Overnight HEAVY leftover after #234 — renderDie/createInteractiveDie default size 60.
 * Call sites always passed an explicit size. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import {
  renderDie,
  createInteractiveDie,
  type DieRoll,
} from '../../src/core/dice';

const d6: DieRoll = {
  id: 'd6-1',
  diceType: 'd6',
  value: 4,
  isSelected: false,
  isLocked: false,
  timestamp: 1,
};

describe('Wave 52 dice-ui — default size 60', () => {
  it('renderDie and createInteractiveDie default SVG width to 60', () => {
    expect(renderDie(d6).getAttribute('width')).toBe('60');
    const wrap = createInteractiveDie(d6);
    expect(wrap.querySelector('svg')?.getAttribute('width')).toBe('60');
    const onClick = vi.fn();
    const clickable = createInteractiveDie(d6, undefined, onClick);
    expect(clickable.querySelector('svg')?.getAttribute('width')).toBe('60');
  });
});
