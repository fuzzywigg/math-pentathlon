/**
 * Wave 22 — dice-ui SVG / interactive / roll-result / animate / styles.
 * Distinct from wave 14 dice-expr-score roller math and waves 20–21 controllers/attributes.
 * Used by Prime Gold / Remainder / dice demos. Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';

import {
  renderDie,
  createInteractiveDie,
  renderRollResult,
  animateRoll,
  getDiceStyles,
} from '../../src/core/dice/dice-ui';
import type { DieRoll, RollResult } from '../../src/core/dice/types';

function makeDie(
  partial: Partial<DieRoll> & Pick<DieRoll, 'id' | 'diceType' | 'value'>
): DieRoll {
  return {
    isSelected: false,
    isLocked: false,
    timestamp: 1,
    ...partial,
  };
}

afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Wave 22 dice-ui — renderDie shapes', () => {
  it('d6 renders pip circles matching face value', () => {
    for (const value of [1, 2, 3, 4, 5, 6] as const) {
      const svg = renderDie(makeDie({ id: `d6-${value}`, diceType: 'd6', value }));
      expect(svg.classList.contains('die')).toBe(true);
      expect(svg.classList.contains('die-d6')).toBe(true);
      expect(svg.querySelectorAll('circle').length).toBe(value);
      expect(svg.getAttribute('width')).toBe('60');
    }
  });

  it('polyhedral dice show number text and type class', () => {
    const cases = [
      ['d4', 3],
      ['d8', 7],
      ['d10', 10],
      ['d12', 11],
      ['d20', 20],
    ] as const;
    for (const [type, value] of cases) {
      const svg = renderDie(
        makeDie({ id: type, diceType: type, value }),
        48
      );
      expect(svg.classList.contains(`die-${type}`)).toBe(true);
      expect(svg.querySelector('text')?.textContent).toBe(String(value));
      expect(svg.querySelector('polygon, rect')).toBeTruthy();
      expect(svg.getAttribute('width')).toBe('48');
    }
  });
});

describe('Wave 22 dice-ui — interactive + roll result', () => {
  it('createInteractiveDie toggles click when unlocked and ignores locked', () => {
    const clicks: string[] = [];
    const open = createInteractiveDie(
      makeDie({ id: 'open', diceType: 'd6', value: 4, isSelected: true }),
      40,
      (d) => clicks.push(d.id)
    );
    expect(open.classList.contains('selected')).toBe(true);
    expect(open.getAttribute('data-die-id')).toBe('open');
    open.click();
    expect(clicks).toEqual(['open']);

    const locked = createInteractiveDie(
      makeDie({
        id: 'locked',
        diceType: 'd8',
        value: 5,
        isLocked: true,
      }),
      40,
      (d) => clicks.push(d.id)
    );
    expect(locked.classList.contains('used')).toBe(true);
    locked.click();
    expect(clicks).toEqual(['open']);
  });

  it('renderRollResult mounts dice + total and remounts cleanly', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const result: RollResult = {
      id: 'r1',
      total: 9,
      rolls: [
        makeDie({ id: 'a', diceType: 'd6', value: 4 }),
        makeDie({ id: 'b', diceType: 'd6', value: 5 }),
      ],
    };
    const seen: string[] = [];
    renderRollResult(result, container, {
      selectable: true,
      onDieClick: (d) => seen.push(d.id),
    });
    expect(container.classList.contains('dice-roll-result')).toBe(true);
    expect(container.querySelectorAll('.die-wrapper')).toHaveLength(2);
    expect(container.querySelector('.total-value')?.textContent).toBe('9');
    (container.querySelector('.die-wrapper') as HTMLElement).click();
    expect(seen).toEqual(['a']);

    renderRollResult(result, container, { showTotal: false });
    expect(container.querySelector('.dice-total')).toBeNull();
    expect(container.querySelectorAll('.die-wrapper')).toHaveLength(2);
  });
});

describe('Wave 22 dice-ui — animateRoll + styles', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('animateRoll settles to final faces and fires onComplete', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const finalResult: RollResult = {
      id: 'anim',
      total: 7,
      rolls: [
        makeDie({ id: 'x', diceType: 'd6', value: 2 }),
        makeDie({ id: 'y', diceType: 'd6', value: 5 }),
      ],
    };
    const done = vi.fn();
    animateRoll(container, finalResult, {
      duration: 200,
      dieSize: 50,
      onComplete: done,
    });
    expect(container.classList.contains('rolling')).toBe(true);
    expect(container.querySelectorAll('.die-wrapper.rolling')).toHaveLength(2);

    vi.advanceTimersByTime(250);
    expect(done).toHaveBeenCalledTimes(1);
    expect(container.classList.contains('rolling')).toBe(false);
    expect(container.querySelectorAll('.die-wrapper.settled')).toHaveLength(2);
    expect(container.querySelector('.total-value')?.textContent).toBe('7');
  });

  it('getDiceStyles covers selector contract classes', () => {
    const css = getDiceStyles();
    expect(css).toContain('.dice-roll-result');
    expect(css).toContain('.die-wrapper.selected');
    expect(css).toContain('.die-wrapper.used');
    expect(css).toContain('@keyframes dice-tumble');
  });
});
