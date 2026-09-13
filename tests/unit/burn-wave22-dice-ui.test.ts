/**
 * Wave 22 — dice-ui DOM contracts (render / interactive / animate / styles).
 * First dedicated burn coverage of src/core/dice/dice-ui.ts.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  renderDie,
  createInteractiveDie,
  renderRollResult,
  animateRoll,
  getDiceStyles,
  type DieRoll,
  type RollResult,
} from '../../src/core/dice';

afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function die(
  partial: Partial<DieRoll> & Pick<DieRoll, 'id' | 'diceType' | 'value'>
): DieRoll {
  return {
    isSelected: false,
    isLocked: false,
    timestamp: 1,
    ...partial,
  };
}

function result(rolls: DieRoll[]): RollResult {
  return {
    id: 'r1',
    rolls,
    total: rolls.reduce((s, d) => s + d.value, 0),
  };
}

describe('Wave 22 dice-ui — renderDie shapes', () => {
  it('d6 draws pip circles for faces 1–6', () => {
    for (let v = 1; v <= 6; v++) {
      const svg = renderDie(die({ id: `d${v}`, diceType: 'd6', value: v }), 48);
      expect(svg.classList.contains('die-d6')).toBe(true);
      expect(svg.querySelectorAll('circle').length).toBe(v);
      expect(svg.getAttribute('width')).toBe('48');
    }
  });

  it('polyhedral types stamp class + face text (incl. double-digit font)', () => {
    const cases: Array<[DieRoll['diceType'], string]> = [
      ['d4', 'die-d4'],
      ['d8', 'die-d8'],
      ['d10', 'die-d10'],
      ['d12', 'die-d12'],
      ['d20', 'die-d20'],
    ];
    for (const [type, cls] of cases) {
      const svg = renderDie(die({ id: type, diceType: type, value: 11 }), 72);
      expect(svg.classList.contains(cls)).toBe(true);
      expect(svg.querySelector('polygon, rect')).toBeTruthy();
      expect(svg.querySelector('text')?.textContent).toBe('11');
      expect(svg.querySelector('text')?.getAttribute('font-size')).toBe('28');
    }
  });

  it('unknown d6 out-of-range value renders body without pips', () => {
    const svg = renderDie(die({ id: 'bad', diceType: 'd6', value: 99 }), 40);
    expect(svg.querySelectorAll('circle').length).toBe(0);
    expect(svg.querySelector('rect')).toBeTruthy();
  });
});

describe('Wave 22 dice-ui — interactive wrappers', () => {
  it('createInteractiveDie sets selected/used classes and data-die-id', () => {
    const selected = createInteractiveDie(
      die({ id: 's1', diceType: 'd6', value: 3, isSelected: true }),
      50
    );
    expect(selected.classList.contains('selected')).toBe(true);
    expect(selected.getAttribute('data-die-id')).toBe('s1');
    expect(selected.querySelector('svg.die-d6')).toBeTruthy();

    const locked = createInteractiveDie(
      die({ id: 'l1', diceType: 'd8', value: 4, isLocked: true }),
      50,
      () => {
        throw new Error('locked should not fire');
      }
    );
    expect(locked.classList.contains('used')).toBe(true);
    locked.click(); // no throw
  });

  it('unlocked die forwards click callback once', () => {
    const clicks: string[] = [];
    const el = createInteractiveDie(
      die({ id: 'c1', diceType: 'd6', value: 2 }),
      40,
      (d) => clicks.push(d.id)
    );
    expect(el.style.cursor).toBe('pointer');
    el.click();
    el.click();
    expect(clicks).toEqual(['c1', 'c1']);
  });
});

describe('Wave 22 dice-ui — renderRollResult container contracts', () => {
  it('renders dice + total by default and clears prior children', () => {
    const host = document.createElement('div');
    host.innerHTML = '<span class="stale">old</span>';
    document.body.appendChild(host);

    const rolls = [
      die({ id: 'a', diceType: 'd6', value: 2 }),
      die({ id: 'b', diceType: 'd4', value: 3 }),
    ];
    renderRollResult(result(rolls), host, { dieSize: 32 });

    expect(host.className).toBe('dice-roll-result');
    expect(host.querySelector('.stale')).toBeNull();
    expect(host.querySelectorAll('.die-wrapper')).toHaveLength(2);
    expect(host.querySelector('.total-value')?.textContent).toBe('5');
  });

  it('hides total and wires selectable clicks when requested', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const seen: string[] = [];
    const rolls = [
      die({ id: 'x', diceType: 'd6', value: 1 }),
      die({ id: 'y', diceType: 'd6', value: 6, isLocked: true }),
    ];

    renderRollResult(result(rolls), host, {
      showTotal: false,
      selectable: true,
      onDieClick: (d) => seen.push(d.id),
    });

    expect(host.querySelector('.dice-total')).toBeNull();
    (host.querySelector('[data-die-id="x"]') as HTMLElement).click();
    (host.querySelector('[data-die-id="y"]') as HTMLElement).click();
    expect(seen).toEqual(['x']);
  });
});

describe('Wave 22 dice-ui — animateRoll + styles', () => {
  it('animateRoll settles to final values and invokes onComplete', () => {
    vi.useFakeTimers();
    const host = document.createElement('div');
    document.body.appendChild(host);
    const final = result([
      die({ id: 'f1', diceType: 'd6', value: 4 }),
      die({ id: 'f2', diceType: 'd10', value: 9 }),
    ]);
    let done = 0;

    animateRoll(host, final, {
      duration: 200,
      dieSize: 28,
      onComplete: () => {
        done += 1;
      },
    });

    expect(host.classList.contains('rolling')).toBe(true);
    expect(host.querySelectorAll('.die-wrapper.rolling')).toHaveLength(2);

    vi.advanceTimersByTime(250);

    expect(host.classList.contains('rolling')).toBe(false);
    expect(host.querySelectorAll('.die-wrapper.settled')).toHaveLength(2);
    expect(host.querySelector('.total-value')?.textContent).toBe('13');
    const texts = [...host.querySelectorAll('text')].map((t) => t.textContent);
    // d6 has no text; d10 should show 9 after settle
    expect(texts).toContain('9');
    expect(done).toBe(1);
  });

  it('getDiceStyles ships selection / used / tumble keyframes', () => {
    const css = getDiceStyles();
    expect(css).toContain('.die-wrapper.selected');
    expect(css).toContain('.die-wrapper.used');
    expect(css).toContain('@keyframes dice-tumble');
    expect(css).toContain('@keyframes dice-bounce');
    expect(css).toContain('.dice-total');
  });
});
