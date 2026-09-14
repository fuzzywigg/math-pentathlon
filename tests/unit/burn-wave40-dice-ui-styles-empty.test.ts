/**
 * Wave 40 — dice-ui empty rolls + styles + unlocked without onClick leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  renderRollResult,
  createInteractiveDie,
  getDiceStyles,
  type DieRoll,
} from '../../src/core/dice';

function die(
  partial: Partial<DieRoll> & Pick<DieRoll, 'id' | 'value'>
): DieRoll {
  return {
    diceType: 'd6',
    isSelected: false,
    isLocked: false,
    ...partial,
  };
}

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 40 dice-ui — styles + empty + unlocked no onClick', () => {
  it('empty rolls render container without die wrappers', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    renderRollResult({ id: 'empty', rolls: [], total: 0 }, host, {
      showTotal: true,
    });
    expect(host.className).toBe('dice-roll-result');
    expect(host.querySelectorAll('.die-wrapper')).toHaveLength(0);
    expect(host.querySelector('.total-value')?.textContent).toBe('0');
  });

  it('getDiceStyles includes rolling/settled/selected/used selectors', () => {
    const css = getDiceStyles();
    for (const needle of [
      '.die-wrapper.rolling',
      '.die-wrapper.settled',
      '.die-wrapper.selected',
      '.die-wrapper.used',
      '@keyframes dice-tumble',
      '.dice-total',
    ]) {
      expect(css).toContain(needle);
    }
  });

  it('unlocked die without onClick has no pointer and ignores click', () => {
    const el = createInteractiveDie(die({ id: 'u', value: 2 }), 40);
    expect(el.style.cursor).not.toBe('pointer');
    expect(() => el.click()).not.toThrow();
    expect(el.className).not.toContain('used');
  });

  it('unlocked with onClick is pointer; locked never fires', () => {
    const onClick = vi.fn();
    const unlocked = createInteractiveDie(
      die({ id: 'ok', value: 5 }),
      48,
      onClick
    );
    expect(unlocked.style.cursor).toBe('pointer');
    unlocked.click();
    expect(onClick).toHaveBeenCalledTimes(1);

    const locked = createInteractiveDie(
      die({ id: 'lk', value: 1, isLocked: true }),
      48,
      onClick
    );
    locked.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('selectable false ignores onDieClick in renderRollResult', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const onDieClick = vi.fn();
    renderRollResult(
      {
        id: 'ns',
        total: 4,
        rolls: [die({ id: 'z', value: 4 })],
      },
      host,
      { selectable: false, onDieClick, showTotal: false }
    );
    (host.querySelector('.die-wrapper') as HTMLElement).click();
    expect(onDieClick).not.toHaveBeenCalled();
  });
});
