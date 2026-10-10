/**
 * q-mp-521 — Characterize `dice-selector` soft-fail residuals (tests-only).
 *
 * Live tip re-measure @ `cursor/mp-tip-post949` (`8698fffb`):
 *   `dice-selector.ts` **463** LOC / **23** dedicated `*dice-selector*` files
 *     (**63** `it`/`test`) before this suite; overlay nullish residual **5**
 *     (`??` defaults — clear owned by undrafted `308`; do not clear here).
 *   Coverage under existing `*dice-selector*` suites: stmts/lines/funcs/branches
 *     **100%** — residual work is soft-fail contract characterization, not
 *     hole-filling. Densest unclaimed dice residual surface after tip `#920`
 *     / `#432` dice-ui/roller char.
 *
 * Ownership (leave alone; do not edit product / competing suites):
 *   `#920` / `#432` / q-mp-432 — dice-ui + roller char; leave **contained**
 *   Undrafted `308` — nullish dice-selector clear; leave open **contained**
 *   `#803` / q-mp-300 — enable/disable + mid-roll soft paths; leave **contained**
 *   Mutation `527` (wave 18) — same host; this suite sticks to soft-fail /
 *     early-return / optional-chain / inject-skip arms only (no happy-path
 *     multiSelect/dieSize/default mutation pins)
 *
 * This suite owns soft-fail residual contracts still thin after those:
 *   source keep-sites, inject claimed-id soft-skip, cancelRollAnim `?.`
 *   no-ops, missing `#dice-result-area` stuck-roll, roll-while-rolling,
 *   confirm null/empty, getSelected* empty returns, locked/isRolling click
 *   soft-returns, empty `customDice` fall-through, showPossibleSums soft-omit.
 *
 * Constraints: tests only; no src / AI / scoring / rules / legal-move /
 * copy-body / aria / label asserts; no nullish ceiling write; Hex Hard stays
 * 450ms; no network.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  DiceSelector,
  createRollButton,
} from '../../src/core/dice/dice-selector';
import { COMMON_DICE_SETS, DICE_CONFIGS } from '../../src/core/dice/types';

const DICE_SELECTOR_SRC = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    '../../src/core/dice/dice-selector.ts'
  ),
  'utf8'
);

function mockSteppedRandom(): void {
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n += 1;
    return (n % 997) / 997;
  });
}

function mount(options: ConstructorParameters<typeof DiceSelector>[1] = {}): {
  root: HTMLDivElement;
  selector: DiceSelector;
} {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const selector = new DiceSelector(root, {
    diceSet: COMMON_DICE_SETS.standard,
    ...options,
  });
  return { root, selector };
}

afterEach(() => {
  document.body.innerHTML = '';
  document
    .querySelectorAll('#dice-selector-styles')
    .forEach((el) => el.remove());
  vi.useRealTimers();
  vi.restoreAllMocks();
});

// =============================================================================
// 1. Source soft-fail keep-sites
// =============================================================================

describe('q-mp-521 dice-selector — source soft-fail keep-sites', () => {
  it('keeps option ?? soft-fail defaults (nullish clear owned by 308)', () => {
    expect(DICE_SELECTOR_SRC).toMatch(/options\.multiSelect\s*\?\?\s*true/);
    expect(DICE_SELECTOR_SRC).toMatch(
      /options\.showPossibleSums\s*\?\?\s*false/
    );
    expect(DICE_SELECTOR_SRC).toMatch(/options\.showRollButton\s*\?\?\s*true/);
    expect(DICE_SELECTOR_SRC).toMatch(/options\.autoRoll\s*\?\?\s*false/);
    expect(DICE_SELECTOR_SRC).toMatch(/options\.dieSize\s*\?\?\s*60/);
  });

  it('keeps inject id soft-skip + cancelRollAnim optional-chain arms', () => {
    expect(DICE_SELECTOR_SRC).toMatch(
      /if\s*\(\s*!document\.getElementById\(styleId\)\s*\)/
    );
    // Three cancel sites: roll start, reset, destroy.
    const cancelMatches = DICE_SELECTOR_SRC.match(
      /this\.cancelRollAnim\?\.\(\)/g
    );
    expect(cancelMatches).not.toBeNull();
    expect(cancelMatches!.length).toBe(3);
  });

  it('keeps early-return soft arms for click / roll / confirm / getters', () => {
    expect(DICE_SELECTOR_SRC).toMatch(
      /if\s*\(\s*!this\.currentResult\s*\|\|\s*this\.isRolling\s*\|\|\s*die\.isLocked\s*\)/
    );
    expect(DICE_SELECTOR_SRC).toMatch(/if\s*\(\s*this\.isRolling\s*\)/);
    expect(DICE_SELECTOR_SRC).toMatch(/if\s*\(\s*resultArea\s*\)/);
    expect(DICE_SELECTOR_SRC).toMatch(
      /if\s*\(\s*!this\.currentResult\s*\)\s*\{\s*return;/
    );
    expect(DICE_SELECTOR_SRC).toMatch(
      /if\s*\(\s*selectedDice\.length\s*>\s*0\s*\)/
    );
    expect(DICE_SELECTOR_SRC).toMatch(/return\s*\[\];/);
    expect(DICE_SELECTOR_SRC).toMatch(/return\s*0;/);
  });
});

// =============================================================================
// 2. Inject claimed-id soft-skip
// =============================================================================

describe('q-mp-521 dice-selector — inject claimed-id soft-skip', () => {
  it('pre-seeded empty #dice-selector-styles soft-skips style rewrite', () => {
    const claimed = document.createElement('style');
    claimed.id = 'dice-selector-styles';
    claimed.textContent = '/* q-mp-521 claimed */';
    document.head.appendChild(claimed);

    const { root, selector } = mount();
    expect(document.querySelectorAll('#dice-selector-styles')).toHaveLength(1);
    expect(document.getElementById('dice-selector-styles')?.textContent).toBe(
      '/* q-mp-521 claimed */'
    );
    expect(root.classList.contains('dice-selector')).toBe(true);
    selector.destroy();
  });

  it('second mount shares one style element (no duplicate inject)', () => {
    const a = mount();
    const b = mount({ diceSet: COMMON_DICE_SETS.triple });
    expect(document.querySelectorAll('#dice-selector-styles')).toHaveLength(1);
    a.selector.destroy();
    b.selector.destroy();
    // destroy soft-leaves the shared style element (does not clear head).
    expect(document.getElementById('dice-selector-styles')).toBeTruthy();
  });
});

// =============================================================================
// 3. cancelRollAnim ?. soft no-ops (never started)
// =============================================================================

describe('q-mp-521 dice-selector — cancelRollAnim optional soft no-ops', () => {
  it('reset before any roll soft-noops cancel and stays idle', () => {
    const onRoll = vi.fn();
    const { root, selector } = mount({ onRollComplete: onRoll });
    expect(() => selector.reset()).not.toThrow();
    expect(selector.getResult()).toBeNull();
    expect(onRoll).not.toHaveBeenCalled();
    expect(root.querySelector('.dice-btn-primary')).toBeTruthy();
    expect(root.querySelector('.dice-btn-success')).toBeNull();
    selector.destroy();
  });

  it('destroy before any roll soft-noops cancel and clears container', () => {
    const onRoll = vi.fn();
    const { root, selector } = mount({ onRollComplete: onRoll });
    expect(() => selector.destroy()).not.toThrow();
    expect(onRoll).not.toHaveBeenCalled();
    expect(root.innerHTML).toBe('');
    // Shared style id soft-survives destroy.
    expect(document.getElementById('dice-selector-styles')).toBeTruthy();
  });
});

// =============================================================================
// 4. Missing result-area + roll-while-rolling soft-fails
// =============================================================================

describe('q-mp-521 dice-selector — missing result-area / roll soft-fails', () => {
  it('removed #dice-result-area leaves isRolling stuck; further rolls soft-return', async () => {
    vi.useFakeTimers();
    mockSteppedRandom();
    const onRoll = vi.fn();
    const { root, selector } = mount({ onRollComplete: onRoll });
    root.querySelector('#dice-result-area')?.remove();
    selector.roll();
    await vi.advanceTimersByTimeAsync(900);
    expect(onRoll).not.toHaveBeenCalled();
    expect(selector.getResult()).toBeNull();

    selector.roll();
    await vi.advanceTimersByTimeAsync(900);
    expect(onRoll).not.toHaveBeenCalled();
    expect(selector.getResult()).toBeNull();
    selector.destroy();
  });

  it('roll while isRolling soft-returns without double onRollComplete', async () => {
    vi.useFakeTimers();
    mockSteppedRandom();
    const onRoll = vi.fn();
    const { root, selector } = mount({ onRollComplete: onRoll });
    selector.roll();
    selector.roll(); // soft-return while first animation in flight
    await vi.advanceTimersByTimeAsync(900);
    expect(onRoll).toHaveBeenCalledTimes(1);
    expect(selector.getResult()).not.toBeNull();
    expect(root.querySelectorAll('.die-wrapper').length).toBeGreaterThan(0);
    selector.destroy();
  });

  it('destroy after stuck missing-area roll soft-clears without completing', async () => {
    vi.useFakeTimers();
    mockSteppedRandom();
    const onRoll = vi.fn();
    const { root, selector } = mount({ onRollComplete: onRoll });
    root.querySelector('#dice-result-area')?.remove();
    selector.roll();
    selector.destroy();
    await vi.advanceTimersByTimeAsync(900);
    expect(onRoll).not.toHaveBeenCalled();
    expect(root.innerHTML).toBe('');
  });
});

// =============================================================================
// 5. Confirm / getter empty soft-fails
// =============================================================================

describe('q-mp-521 dice-selector — confirm / getter empty soft-fails', () => {
  it('confirm with null result soft-returns without onConfirm', () => {
    const onConfirm = vi.fn();
    const { selector } = mount({ onConfirm, autoRoll: false });
    expect(selector.getResult()).toBeNull();
    expect(selector.getSelectedDice()).toEqual([]);
    expect(selector.getSelectedSum()).toBe(0);
    selector.confirm();
    expect(onConfirm).not.toHaveBeenCalled();
    expect(selector.getResult()).toBeNull();
    selector.destroy();
  });

  it('confirm with roll but zero selection soft-skips lock + onConfirm', async () => {
    vi.useFakeTimers();
    mockSteppedRandom();
    const onConfirm = vi.fn();
    const { root, selector } = mount({ onConfirm });
    selector.roll();
    await vi.advanceTimersByTimeAsync(900);
    expect(selector.getSelectedDice()).toEqual([]);
    expect(selector.getSelectedSum()).toBe(0);
    selector.confirm();
    expect(onConfirm).not.toHaveBeenCalled();
    const rolls = selector.getResult()!.rolls;
    expect(rolls.every((d) => !d.isLocked)).toBe(true);
    expect(root.querySelector('.dice-btn-success')).toBeTruthy();
    selector.destroy();
  });
});

// =============================================================================
// 6. Click soft-returns (locked / isRolling)
// =============================================================================

describe('q-mp-521 dice-selector — click soft-return arms', () => {
  it('locked die click soft-returns without onSelectionChange', async () => {
    vi.useFakeTimers();
    mockSteppedRandom();
    const onSelectionChange = vi.fn();
    const { root, selector } = mount({ onSelectionChange });
    selector.roll();
    await vi.advanceTimersByTimeAsync(900);

    const die = selector.getResult()!.rolls[0]!;
    die.isLocked = true;
    const wrapper = root.querySelector(
      `[data-die-id="${die.id}"]`
    ) as HTMLElement;
    wrapper.click();
    expect(onSelectionChange).not.toHaveBeenCalled();
    expect(selector.getSelectedDice()).toHaveLength(0);
    selector.destroy();
  });

  it('die click during mid-roll soft-returns (isRolling arm)', async () => {
    vi.useFakeTimers();
    mockSteppedRandom();
    const onSelectionChange = vi.fn();
    const { root, selector } = mount({
      multiSelect: true,
      onSelectionChange,
    });
    selector.roll();
    await vi.advanceTimersByTimeAsync(900);
    const rolls = selector.getResult()!.rolls;
    expect(rolls.length).toBeGreaterThanOrEqual(2);
    const first = rolls[0]!;
    const second = rolls[1]!;
    (root.querySelector(`[data-die-id="${first.id}"]`) as HTMLElement).click();
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    onSelectionChange.mockClear();

    // Start Roll Again, then confirm to re-render while isRolling is still true
    // so die wrappers remain wired and the click soft-return arm is reachable.
    selector.roll();
    selector.confirm();
    const locked = root.querySelector(
      `[data-die-id="${first.id}"]`
    ) as HTMLElement;
    const sibling = root.querySelector(
      `[data-die-id="${second.id}"]`
    ) as HTMLElement | null;
    locked.click();
    sibling?.click();
    expect(onSelectionChange).not.toHaveBeenCalled();
    expect(selector.getSelectedDice().map((d) => d.id)).toEqual([first.id]);
    await vi.advanceTimersByTimeAsync(900);
    selector.destroy();
  });
});

// =============================================================================
// 7. Option soft-omit / empty-custom fall-through (not nullish clear)
// =============================================================================

describe('q-mp-521 dice-selector — option soft-omit / empty-custom', () => {
  it('showPossibleSums false soft-omits .possible-sums after selection', async () => {
    vi.useFakeTimers();
    mockSteppedRandom();
    const { root, selector } = mount({ showPossibleSums: false });
    selector.roll();
    await vi.advanceTimersByTimeAsync(900);
    const id = selector.getResult()!.rolls[0]!.id;
    (root.querySelector(`[data-die-id="${id}"]`) as HTMLElement).click();
    expect(root.querySelector('.possible-sums')).toBeNull();
    expect(root.querySelector('.dice-selection-info')).toBeTruthy();
    selector.destroy();
  });

  it('empty customDice soft-falls through to diceSet types', async () => {
    vi.useFakeTimers();
    mockSteppedRandom();
    const { root, selector } = mount({
      diceSet: COMMON_DICE_SETS.triple,
      customDice: [],
    });
    selector.roll();
    await vi.advanceTimersByTimeAsync(900);
    expect(selector.getResult()?.rolls).toHaveLength(3);
    expect(root.querySelectorAll('.die-wrapper')).toHaveLength(3);
    selector.destroy();
  });

  it('showRollButton false soft-omits primary; getters stay empty until select', async () => {
    vi.useFakeTimers();
    mockSteppedRandom();
    const { root, selector } = mount({ showRollButton: false });
    expect(root.querySelector('.dice-btn-primary')).toBeNull();
    expect(selector.getSelectedDice()).toEqual([]);
    expect(selector.getSelectedSum()).toBe(0);
    selector.roll();
    await vi.advanceTimersByTimeAsync(900);
    expect(root.querySelector('.dice-btn-primary')).toBeNull();
    expect(root.querySelector('.dice-btn-success')).toBeTruthy();
    selector.destroy();
  });

  it('createRollButton sync path does not touch DiceSelector soft-fail state', () => {
    mockSteppedRandom();
    const host = document.createElement('div');
    document.body.appendChild(host);
    const onRoll = vi.fn();
    const btn = createRollButton(host, COMMON_DICE_SETS.standard, onRoll);
    expect(btn.classList.contains('dice-btn-primary')).toBe(true);
    btn.click();
    expect(onRoll).toHaveBeenCalledTimes(1);
    expect(onRoll.mock.calls[0]![0].rolls.length).toBeGreaterThan(0);
    // Standalone helper — no shared isRolling / confirm soft state.
    expect(host.querySelector('.dice-btn-success')).toBeNull();
  });

  it('customDice non-empty overrides diceSet (soft branch opposite of empty)', async () => {
    // Characterizes the getDiceTypes early branch so empty-[] fall-through
    // above stays meaningful; not a mutation dieSize/default pin.
    vi.useFakeTimers();
    mockSteppedRandom();
    const { root, selector } = mount({
      diceSet: COMMON_DICE_SETS.triple,
      customDice: [DICE_CONFIGS.d20],
    });
    selector.roll();
    await vi.advanceTimersByTimeAsync(900);
    expect(selector.getResult()?.rolls).toHaveLength(1);
    expect(selector.getResult()?.rolls[0]?.diceType).toBe('d20');
    expect(root.querySelectorAll('.die-wrapper')).toHaveLength(1);
    selector.destroy();
  });
});
