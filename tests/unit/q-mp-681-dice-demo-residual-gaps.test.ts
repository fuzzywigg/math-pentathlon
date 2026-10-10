/**
 * q-mp-681 — close `dice-demo` residual gaps (tests-only).
 *
 * Live tip re-measure @ `cursor/mp-tip-post1059` (`70da293f`):
 *   Related suites alone: **86.04%** lines / **80.0%** branches
 *   (backlog stamp was 81.4%L / 80.0%B — line gain from earlier folds;
 *   residual branch gap still open). Uncovered lines 188–200, 228 +
 *   2d6 onConfirm 170–172 under the narrow `*dice-demo*` glob.
 *
 * Residuals this suite owns:
 *   1. Poly DiceSelector callbacks (onSelectionChange / onRollComplete /
 *      onConfirm) — inert under full mount because three selectors share
 *      `id="dice-result-area"`; jsdom `querySelector('#…')` resolves the
 *      first document id (2d6). Uniquify sibling ids so poly's container
 *      querySelector finds its own result area, then roll/select/confirm.
 *   1b. 2d6 onConfirm body — overnight confirm suite is outside `*dice-demo*`.
 *   2. `addLog` `lastChild === null` break arm — force via defineProperty
 *      after pre-filling >20 log children.
 *   3. `COMMON_DICE_SETS.standard` undefined soft-omit (false arm of the
 *      `!== undefined` ternary) — soft-delete before mount; DiceSelector
 *      default then throws (characterization only; not a product clear).
 *
 * Ownership (leave alone; do not edit product / competing suites):
 *   `#1030` / `597` — soft-fail characterization (leave open)
 *   Overnight wave51/55/56/59/60/64 + burn-1008 r5 — chrome / happy paths
 *
 * Constraints: tests only; zero `src/` edits; do not touch dice/roller.ts;
 * no AI / rules / scoring / copy / aria / label asserts; no ratchet JSON;
 * no network. Prefer structural probes (ids, classes, children, lengths).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { COMMON_DICE_SETS } from '../../src/core/dice/types';
import { renderDiceDemo } from '../../src/demos/dice-demo';
import { mountRoot } from './helpers/dom';

const savedStandard = { value: undefined as unknown };

function softDeleteStandard(): void {
  savedStandard.value = COMMON_DICE_SETS.standard;
  delete (COMMON_DICE_SETS as Record<string, unknown>).standard;
}

function restoreStandard(): void {
  if (savedStandard.value !== undefined) {
    (COMMON_DICE_SETS as Record<string, unknown>).standard =
      savedStandard.value;
    savedStandard.value = undefined;
  }
}

/** Sibling selectors keep duplicate #dice-result-area; uniquify so poly roll works. */
function uniquifySiblingResultAreas(root: ParentNode): void {
  const twoD6 = root.querySelector(
    '#selector-2d6 #dice-result-area'
  ) as HTMLElement | null;
  const sums = root.querySelector(
    '#selector-sums #dice-result-area'
  ) as HTMLElement | null;
  if (twoD6) {
    twoD6.id = 'dice-result-area-2d6';
  }
  if (sums) {
    sums.id = 'dice-result-area-sums';
  }
}

beforeEach(() => {
  document.body.innerHTML = '';
  vi.useFakeTimers();
});

afterEach(() => {
  restoreStandard();
  vi.useRealTimers();
  document.body.innerHTML = '';
  document
    .querySelectorAll('#dice-selector-styles')
    .forEach((el) => el.remove());
});

// =============================================================================
// 1. Poly selector callbacks (lines 187–201)
// =============================================================================

describe('q-mp-681 dice-demo — poly selector residual callbacks', () => {
  it('poly roll/select/confirm writes isolated log-poly entries', async () => {
    const root = mountRoot();
    renderDiceDemo(root);
    await vi.advanceTimersByTimeAsync(1200);

    uniquifySiblingResultAreas(root);

    const poly = root.querySelector('#selector-poly') as HTMLElement;
    const logPoly = root.querySelector('#log-poly') as HTMLElement;
    expect(poly.querySelector('#dice-result-area')).toBeTruthy();
    expect(logPoly.children.length).toBe(0);

    const rollBtn = poly.querySelector(
      '.dice-btn-primary'
    ) as HTMLButtonElement;
    expect(rollBtn).toBeTruthy();
    rollBtn.click();
    await vi.advanceTimersByTimeAsync(1200);

    expect(
      logPoly.querySelectorAll('.log-entry').length
    ).toBeGreaterThanOrEqual(1);
    expect(poly.querySelectorAll('.die-wrapper').length).toBeGreaterThan(0);

    const die = poly.querySelector('.die-wrapper') as HTMLElement;
    die.click();
    expect(
      logPoly.querySelectorAll('.log-entry').length
    ).toBeGreaterThanOrEqual(2);

    const confirm = poly.querySelector(
      '.dice-btn-success'
    ) as HTMLButtonElement;
    expect(confirm).toBeTruthy();
    expect(confirm.disabled).toBe(false);
    confirm.click();
    expect(
      logPoly.querySelectorAll('.log-entry').length
    ).toBeGreaterThanOrEqual(3);

    // Isolation: 2d6 log stays empty through poly-only churn.
    expect(
      (root.querySelector('#log-2d6') as HTMLElement).children.length
    ).toBe(0);
  });

  it('poly remount after uniquify still exposes result-area host', async () => {
    const root = mountRoot();
    renderDiceDemo(root);
    await vi.advanceTimersByTimeAsync(1200);
    uniquifySiblingResultAreas(root);

    renderDiceDemo(root);
    await vi.advanceTimersByTimeAsync(1200);
    // Remount restores duplicate ids — structural check only.
    expect(root.querySelectorAll('#dice-result-area')).toHaveLength(3);
    expect(root.querySelector('#selector-poly .dice-btn-primary')).toBeTruthy();
  });
});

// =============================================================================
// 1b. 2d6 onConfirm residual (lines 169–174) — not in *dice-demo* overnight suite
// =============================================================================

describe('q-mp-681 dice-demo — 2d6 onConfirm residual', () => {
  it('2d6 roll/select/confirm appends a confirm log entry', async () => {
    const root = mountRoot();
    renderDiceDemo(root);
    await vi.advanceTimersByTimeAsync(1200);

    const box = root.querySelector('#selector-2d6') as HTMLElement;
    const log2d6 = root.querySelector('#log-2d6') as HTMLElement;

    const rollBtn = box.querySelector('.dice-btn-primary') as HTMLButtonElement;
    rollBtn.click();
    await vi.advanceTimersByTimeAsync(1200);

    const die = box.querySelector('.die-wrapper') as HTMLElement;
    expect(die).toBeTruthy();
    die.click();

    const confirm = box.querySelector('.dice-btn-success') as HTMLButtonElement;
    expect(confirm).toBeTruthy();
    expect(confirm.disabled).toBe(false);
    confirm.click();

    expect(log2d6.querySelectorAll('.log-entry').length).toBeGreaterThanOrEqual(
      2
    );
    // Structural: newest-first insert; at least one entry exists after confirm.
    expect(log2d6.firstChild).toBeTruthy();
    expect(
      (log2d6.firstChild as HTMLElement).classList.contains('log-entry')
    ).toBe(true);
  });
});

// =============================================================================
// 2. addLog lastChild === null break (line 228)
// =============================================================================

describe('q-mp-681 dice-demo — addLog lastChild null break', () => {
  it('trim loop breaks when lastChild is forced null with >20 children', async () => {
    const root = mountRoot();
    renderDiceDemo(root);
    await vi.advanceTimersByTimeAsync(1200);

    const log2d6 = root.querySelector('#log-2d6') as HTMLElement;
    for (let i = 0; i < 20; i++) {
      const entry = document.createElement('div');
      entry.className = 'log-entry';
      log2d6.appendChild(entry);
    }
    expect(log2d6.children.length).toBe(20);

    Object.defineProperty(log2d6, 'lastChild', {
      configurable: true,
      get: () => null,
    });

    const box = root.querySelector('#selector-2d6') as HTMLElement;
    const rollBtn = box.querySelector('.dice-btn-primary') as HTMLButtonElement;
    rollBtn.click();
    await vi.advanceTimersByTimeAsync(1200);

    // insertBefore still added an entry; null lastChild aborted the trim.
    expect(log2d6.children.length).toBeGreaterThan(20);

    // Restore so afterEach cleanup / other suites are not poisoned.
    Reflect.deleteProperty(log2d6, 'lastChild');
  });
});

// =============================================================================
// 3. standard diceSet undefined soft-omit
// =============================================================================

describe('q-mp-681 dice-demo — standard diceSet soft-omit', () => {
  it('missing standard key takes !== undefined false arm then DiceSelector default throws', () => {
    // Soft-omit spreads `{}` when standard is undefined (false arm of the
    // ternary). DiceSelector then falls back to COMMON_DICE_SETS.standard!
    // which is also missing — characterization of that residual throw only.
    softDeleteStandard();
    expect(COMMON_DICE_SETS.standard).toBeUndefined();

    const root = mountRoot();
    expect(() => renderDiceDemo(root)).toThrow();
  });
});
