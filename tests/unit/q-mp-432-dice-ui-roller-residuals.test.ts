/**
 * q-mp-432 — Characterize `dice-ui` / `roller` residuals (tests-only).
 *
 * Tip re-measure @ `cursor/mp-tip-post898` (`946d6f95`):
 *   Overlay nnnull still **2** each on `dice-ui.ts` / `roller.ts` (not cleared).
 *   Line residual after engine r12 (#876 fold): dice-ui L360 finish cancelled-guard
 *     (documented public-API unreachable by r12).
 *   Branch residual: dice-ui L246 `config.color || '#2196f3'` false arm (all
 *     catalog colors present → fallback never exercised until color is stripped).
 *   roller.ts lines/branches already 100% under existing dice suites — this file
 *     pins soft-edge / RNG contracts that r12 + mutation-ui5 leave thin.
 *
 * Ownership (leave alone; do not edit):
 *   `#876` / engine-coverage-round-12 — animateRoll cancel arms (L424 / L360 doc)
 *   `#803` / q-mp-300 — dice-selector enable/disable soft paths
 *   `#726` / mutation-ui5 — reduced-motion flag + matchMedia throw + generateId
 *
 * Constraints: tests only; no src / AI / scoring / rules / copy-body asserts;
 * Hex Hard stays 450ms; no network.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  animateRoll,
  createInteractiveDie,
  getDiceStyles,
  renderDie,
  renderRollResult,
} from '../../src/core/dice/dice-ui';
import {
  clearSelection,
  getAllPossibleProducts,
  getAllPossibleSums,
  getDiceConfig,
  getSelectedTotal,
  getSelectedValues,
  isValidSelection,
  lockDice,
  rerollDice,
  roll,
  rollDice,
  rollDie,
  rollMultiple,
  selectDice,
  toggleDiceSelection,
  unlockDice,
} from '../../src/core/dice/roller';
import {
  DICE_CONFIGS,
  DICE_FACES,
  type DiceType,
  type DieRoll,
  type RollResult,
} from '../../src/core/dice/types';
import {
  resetSettingsFlagsForTests,
  setUserReducedMotionFlag,
} from '../../src/core/settings-flags';

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

function makeResult(rolls: DieRoll[], id = 'r'): RollResult {
  return {
    id,
    rolls,
    total: rolls.reduce((sum, die) => sum + die.value, 0),
  };
}

const originalMatchMedia = window.matchMedia;

afterEach(() => {
  document.body.innerHTML = '';
  resetSettingsFlagsForTests();
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: originalMatchMedia,
  });
  vi.useRealTimers();
  vi.restoreAllMocks();
});

beforeEach(() => {
  resetSettingsFlagsForTests();
});

// =============================================================================
// 1. dice-ui — color fallback residual (L246 branch miss)
// =============================================================================

describe('q-mp-432 dice-ui — missing color falls back to #2196f3', () => {
  it('renderDie uses catalog fallback fill when config.color is stripped', () => {
    // L246: `const color = config.color || '#2196f3'` — arm 1 never hits while
    // every DICE_CONFIGS entry ships a color. Strip temporarily; restore after.
    const cfg = DICE_CONFIGS.d8;
    const saved = cfg.color;
    delete cfg.color;
    try {
      const svg = renderDie(
        makeDie({ id: 'no-color', diceType: 'd8', value: 3 })
      );
      const shape = svg.querySelector('polygon');
      expect(shape?.getAttribute('fill')).toBe('#2196f3');
      expect(svg.classList.contains('die-d8')).toBe(true);
    } finally {
      cfg.color = saved;
    }
  });

  it('d6 body fill also takes the same missing-color fallback', () => {
    const cfg = DICE_CONFIGS.d6;
    const saved = cfg.color;
    delete cfg.color;
    try {
      const svg = renderDie(makeDie({ id: 'd6-nc', diceType: 'd6', value: 1 }));
      const body = svg.querySelector('rect');
      expect(body?.getAttribute('fill')).toBe('#2196f3');
    } finally {
      cfg.color = saved;
    }
  });
});

// =============================================================================
// 2. dice-ui — matchMedia soft arms (beyond mutation-ui5 throw path)
// =============================================================================

describe('q-mp-432 dice-ui — matchMedia soft arms', () => {
  it('non-function matchMedia falls through to motion-on (no instant settle)', () => {
    // L19–22: typeof window.matchMedia !== 'function' → return false.
    setUserReducedMotionFlag(false);
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: 'not-a-function',
    });
    vi.useFakeTimers();
    const host = document.createElement('div');
    document.body.appendChild(host);
    const done = vi.fn();
    animateRoll(
      host,
      makeResult([makeDie({ id: 'a', diceType: 'd6', value: 4 })]),
      { duration: 200, onComplete: done }
    );
    expect(host.classList.contains('rolling')).toBe(true);
    expect(done).not.toHaveBeenCalled();
    vi.advanceTimersByTime(250);
    expect(done).toHaveBeenCalledTimes(1);
    expect(host.querySelectorAll('.die-wrapper.settled')).toHaveLength(1);
  });

  it('OS prefers-reduced-motion match forces instant settle without user flag', () => {
    // L25: matchMedia(...).matches === true (user flag still false).
    setUserReducedMotionFlag(false);
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: (query: string) => ({
        matches: /prefers-reduced-motion:\s*reduce/.test(query),
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }),
    });
    vi.useFakeTimers();
    const host = document.createElement('div');
    document.body.appendChild(host);
    const done = vi.fn();
    animateRoll(
      host,
      makeResult([makeDie({ id: 'rm', diceType: 'd6', value: 2 })]),
      { duration: 1000, onComplete: done }
    );
    expect(host.classList.contains('rolling')).toBe(false);
    expect(done).toHaveBeenCalledTimes(1);
    expect(host.querySelectorAll('.die-wrapper.settled')).toHaveLength(0);
    expect(host.querySelectorAll('.die-wrapper')).toHaveLength(1);
  });
});

// =============================================================================
// 3. dice-ui — cancel soft edges orthogonal to engine r12 mid-tumble pin
// =============================================================================

describe('q-mp-432 dice-ui — cancel soft edges', () => {
  it('idempotent cancel after settle does not re-fire onComplete', () => {
    setUserReducedMotionFlag(false);
    vi.useFakeTimers();
    const host = document.createElement('div');
    document.body.appendChild(host);
    const done = vi.fn();
    const cancel = animateRoll(
      host,
      makeResult([makeDie({ id: 'c', diceType: 'd6', value: 6 })]),
      { duration: 150, dieSize: 36, onComplete: done }
    );
    vi.advanceTimersByTime(200);
    expect(done).toHaveBeenCalledTimes(1);
    expect(() => {
      cancel();
      cancel();
    }).not.toThrow();
    vi.advanceTimersByTime(100);
    expect(done).toHaveBeenCalledTimes(1);
  });

  it('cancel before first tumble tick suppresses onComplete and settled chrome', () => {
    // Soft edge: cancel() while rolling class is set but before any timeout fires.
    // Distinct from r12 mid-tumble replaceChildren race that hits L424.
    setUserReducedMotionFlag(false);
    vi.useFakeTimers();
    const host = document.createElement('div');
    document.body.appendChild(host);
    const done = vi.fn();
    const cancel = animateRoll(
      host,
      makeResult([
        makeDie({ id: 'a', diceType: 'd6', value: 1 }),
        makeDie({ id: 'b', diceType: 'd8', value: 5 }),
      ]),
      { duration: 300, onComplete: done }
    );
    expect(host.classList.contains('rolling')).toBe(true);
    cancel();
    vi.advanceTimersByTime(400);
    expect(done).not.toHaveBeenCalled();
    expect(host.querySelectorAll('.die-wrapper.settled')).toHaveLength(0);
  });
});

// =============================================================================
// 4. dice-ui — nnnull tumble path structural pin (L431–432) + render edges
// =============================================================================

describe('q-mp-432 dice-ui — tumble nnnull path + render edges', () => {
  it('multi-die tumble keeps one SVG per wrapper before settle (nnnull indices)', () => {
    // L431–432: finalResult.rolls[index]! + DICE_CONFIGS[die.diceType]! during
    // tumble updates. Pin length/type alignment; do not clear the assertions.
    setUserReducedMotionFlag(false);
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.25);
    const host = document.createElement('div');
    document.body.appendChild(host);
    const types: DiceType[] = ['d4', 'd6', 'd10', 'd20'];
    const result = makeResult(
      types.map((diceType, i) =>
        makeDie({ id: `t${i}`, diceType, value: i + 1 })
      )
    );
    animateRoll(host, result, { duration: 200, dieSize: 40 });
    expect(host.classList.contains('rolling')).toBe(true);
    const wrappers = host.querySelectorAll('.die-wrapper.rolling');
    expect(wrappers).toHaveLength(4);
    for (const wrapper of wrappers) {
      expect(wrapper.querySelector('svg.die')).toBeTruthy();
    }
    vi.advanceTimersByTime(250);
    expect(host.querySelectorAll('.die-wrapper.settled')).toHaveLength(4);
  });

  it('selectable renderRollResult wires click; non-selectable omits handler path', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const clicks: string[] = [];
    const result = makeResult([
      makeDie({ id: 's1', diceType: 'd6', value: 3 }),
      makeDie({ id: 's2', diceType: 'd6', value: 4, isLocked: true }),
    ]);
    renderRollResult(result, host, {
      selectable: true,
      showTotal: false,
      onDieClick: (die) => {
        clicks.push(die.id);
      },
    });
    const unlocked = host.querySelector('[data-die-id="s1"]') as HTMLElement;
    const locked = host.querySelector('[data-die-id="s2"]') as HTMLElement;
    unlocked.click();
    locked.click();
    expect(clicks).toEqual(['s1']);
    expect(host.querySelector('.dice-total')).toBeNull();
  });

  it('createInteractiveDie selected+used classes compose without click wiring', () => {
    const el = createInteractiveDie(
      makeDie({
        id: 'su',
        diceType: 'd12',
        value: 11,
        isSelected: true,
        isLocked: true,
      }),
      48,
      () => {
        throw new Error('locked must not click');
      }
    );
    expect(el.classList.contains('selected')).toBe(true);
    expect(el.classList.contains('used')).toBe(true);
    expect(el.style.cursor).not.toBe('pointer');
    el.click();
  });

  it('getDiceStyles keeps reduced-motion CSS keep-sites (structural)', () => {
    const css = getDiceStyles();
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain("html[data-reduced-motion='true']");
    expect(css).toContain('.die-wrapper.rolling');
    expect(css).toContain('.die-wrapper.settled');
  });
});

// =============================================================================
// 5. roller — pin current RNG / empty / selection soft contracts (no product edits)
// =============================================================================

describe('q-mp-432 roller — RNG floor+1 contract (pin current)', () => {
  it('Math.random 0 maps to face 1; just-below-1 maps to max faces', () => {
    // rollDie: Math.floor(Math.random() * faces) + 1 — pin, do not change.
    for (const type of Object.keys(DICE_FACES) as DiceType[]) {
      const faces = DICE_FACES[type];
      vi.spyOn(Math, 'random').mockReturnValue(0);
      expect(rollDie(type).value).toBe(1);
      vi.mocked(Math.random).mockReturnValue(0.999999999);
      expect(rollDie(type).value).toBe(faces);
      vi.restoreAllMocks();
    }
  });

  it('roll / rollDice / rollMultiple empty inputs yield total 0', () => {
    expect(roll().rolls).toEqual([]);
    expect(roll().total).toBe(0);
    expect(rollDice({ dice: [] }).rolls).toEqual([]);
    expect(rollDice({ dice: [] }).total).toBe(0);
    expect(rollMultiple('d6', 0).rolls).toEqual([]);
    expect(rollMultiple('d6', 0).total).toBe(0);
  });
});

describe('q-mp-432 roller — nnnull subset mask soft edges', () => {
  it('three-value powerset yields 7 distinct sums and 7 products', () => {
    // L163 / L179: values[i]! inside mask loops — pin cardinality + members.
    const values = [2, 3, 5];
    const sums = getAllPossibleSums(values);
    const products = getAllPossibleProducts(values);
    // Unique sorted: 2,3,5,7,8,10 (5 appears as singleton and as 2+3 → Set collapses)
    expect(sums).toEqual([2, 3, 5, 7, 8, 10]);
    expect(products).toEqual([2, 3, 5, 6, 10, 15, 30]);
    expect(products).toHaveLength(7);
  });

  it('getDiceConfig returns the shared catalog entry (reference equality)', () => {
    for (const type of Object.keys(DICE_FACES) as DiceType[]) {
      expect(getDiceConfig(type)).toBe(DICE_CONFIGS[type]);
    }
  });
});

describe('q-mp-432 roller — selection / lock soft no-ops', () => {
  it('ghost lock/unlock/reroll ids leave values unchanged', () => {
    const base = makeResult([
      makeDie({ id: 'a', diceType: 'd6', value: 2 }),
      makeDie({ id: 'b', diceType: 'd6', value: 5 }),
    ]);
    const locked = lockDice(base, ['ghost']);
    expect(locked.rolls.every((d) => d.isLocked === false)).toBe(true);
    const unlocked = unlockDice(lockDice(base, ['a']), ['ghost', 'missing']);
    expect(unlocked.rolls.find((d) => d.id === 'a')?.isLocked).toBe(true);
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const rerolled = rerollDice(base, []);
    expect(rerolled.rolls.map((d) => d.value)).toEqual([2, 5]);
    expect(rerolled.id).not.toBe(base.id);
  });

  it('selection helpers stay immutable and fence min/max-only configs', () => {
    const base = makeResult([
      makeDie({ id: 'a', diceType: 'd6', value: 1 }),
      makeDie({ id: 'b', diceType: 'd6', value: 2 }),
      makeDie({ id: 'c', diceType: 'd6', value: 3 }),
    ]);
    const toggled = toggleDiceSelection(base, 'b');
    expect(base.rolls[1]?.isSelected).toBe(false);
    expect(toggled.rolls[1]?.isSelected).toBe(true);
    expect(getSelectedValues(toggled)).toEqual([2]);
    expect(getSelectedTotal(toggled)).toBe(2);

    const two = selectDice(base, ['a', 'c'], true);
    expect(
      isValidSelection(two, { dice: ['d6', 'd6', 'd6'], minSelectable: 2 })
    ).toBe(true);
    expect(
      isValidSelection(two, { dice: ['d6', 'd6', 'd6'], maxSelectable: 1 })
    ).toBe(false);
    expect(
      isValidSelection(clearSelection(two), { dice: ['d6', 'd6', 'd6'] })
    ).toBe(true);
  });
});
