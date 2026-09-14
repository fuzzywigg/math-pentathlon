/**
 * Wave 38 — createInteractiveDie locked / selected / size edges.
 * Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';

import { createInteractiveDie, renderDie } from '../../src/core/dice/dice-ui';
import type { DieRoll } from '../../src/core/dice';

function die(partial: Partial<DieRoll> & Pick<DieRoll, 'id' | 'value'>): DieRoll {
  return {
    diceType: 'd6',
    isSelected: false,
    isLocked: false,
    ...partial,
  };
}

describe('Wave 38 dice-ui — locked noclick', () => {
  it('locked die has used class and no pointer/handler', () => {
    const onClick = vi.fn();
    const el = createInteractiveDie(
      die({ id: 'a', value: 4, isLocked: true }),
      48,
      onClick
    );
    expect(el.className).toContain('used');
    expect(el.style.cursor).not.toBe('pointer');
    el.click();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('selected + locked combine classes', () => {
    const el = createInteractiveDie(
      die({ id: 'b', value: 2, isSelected: true, isLocked: true }),
      40
    );
    expect(el.className).toContain('selected');
    expect(el.className).toContain('used');
  });

  it('unlocked with handler gets pointer cursor and fires', () => {
    const onClick = vi.fn();
    const d = die({ id: 'c', value: 6 });
    const el = createInteractiveDie(d, 60, onClick);
    expect(el.style.cursor).toBe('pointer');
    el.click();
    expect(onClick).toHaveBeenCalledWith(d);
  });

  it('size 0 and 1 still render SVG without throwing', () => {
    const d = die({ id: 'd', value: 1, diceType: 'd6' });
    expect(() => renderDie(d, 0)).not.toThrow();
    expect(() => renderDie(d, 1)).not.toThrow();
    expect(createInteractiveDie(d, 1).querySelector('svg')).toBeTruthy();
  });
});
