/**
 * q-mp-597 — Characterize `dice-demo` soft-fail residuals (tests-only).
 *
 * Live tip re-measure @ `cursor/mp-tip-post1012` (`ed034b44`):
 *   `dice-demo.ts` **228** LOC / **21** dedicated `*demos-dice*` /
 *     `*dice-demo*` / `overnight-demo-dice*` files (**31** `it`/`test`)
 *     before this suite — mostly chrome / happy-path; thin dedicated
 *     soft-fail residual coverage (no prior `*soft-fail*` suite).
 *   Overlay nnnull residual **1** (`container.lastChild!` in addLog trim)
 *     — clear owned by open draft `#1024` / `580`; do not clear /
 *     ceiling-write here. Keep-site assert accepts post-580 null-guard.
 *
 * Soft-fail keep-sites this suite owns (characterization only):
 *   `data-count || '1'` quick-roll fallback, three `!== undefined`
 *     diceSet soft-omits, addLog `while > 20` + `lastChild!` trim arm,
 *     parseInt radix keep-site, remount via `clearElement`.
 *
 * Ownership (leave alone; do not edit product / competing suites):
 *   `#1024` / `580` — nnnull clear in `demos/dice-demo.ts` (+ ceiling −1);
 *     leave open (do not comment / close from this worker)
 *   Overnight wave51/55/56/59/60/64 + burn-1008 r5 — chrome / log /
 *     quick-roll happy paths; this suite sticks to soft-fail residuals
 *
 * Constraints: tests only; zero `src/` edits; no nnnull ceiling write;
 * no AI / rules / scoring / copy / aria / label asserts; Hex Hard 450ms;
 * no network; no ratchet JSON.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { COMMON_DICE_SETS } from '../../src/core/dice/types';
import { renderDiceDemo } from '../../src/demos/dice-demo';
import { mountRoot } from './helpers/dom';

const DICE_DEMO_SRC = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    '../../src/demos/dice-demo.ts'
  ),
  'utf8'
);

const DICE_SET_KEYS = ['standard', 'primeGold', 'triple'] as const;

const savedDiceSets: Partial<Record<(typeof DICE_SET_KEYS)[number], unknown>> =
  {};

function restoreDiceSets(): void {
  for (const key of DICE_SET_KEYS) {
    if (key in savedDiceSets) {
      (COMMON_DICE_SETS as Record<string, unknown>)[key] = savedDiceSets[key];
      delete savedDiceSets[key];
    }
  }
}

function softDeleteDiceSet(key: (typeof DICE_SET_KEYS)[number]): void {
  if (!(key in savedDiceSets)) {
    savedDiceSets[key] = COMMON_DICE_SETS[key];
  }
  delete (COMMON_DICE_SETS as Record<string, unknown>)[key];
}

beforeEach(() => {
  document.body.innerHTML = '';
  vi.useFakeTimers();
});

afterEach(() => {
  restoreDiceSets();
  vi.useRealTimers();
  document.body.innerHTML = '';
  document
    .querySelectorAll('#dice-selector-styles')
    .forEach((el) => el.remove());
});

// =============================================================================
// 1. Source soft-fail keep-sites
// =============================================================================

describe('q-mp-597 dice-demo — source soft-fail keep-sites', () => {
  it('keeps data-count || 1 quick-roll fallback + parseInt radix', () => {
    expect(DICE_DEMO_SRC).toMatch(
      /parseInt\(\s*btn\.getAttribute\(\s*['"]data-count['"]\s*\)\s*\|\|\s*['"]1['"]\s*,\s*10\s*\)/
    );
  });

  it('keeps three COMMON_DICE_SETS !== undefined soft-omits', () => {
    const omitMatches = DICE_DEMO_SRC.match(
      /\.\.\.\(\s*\w+\s*!==\s*undefined\s*\?\s*\{\s*diceSet:\s*\w+\s*\}\s*:\s*\{\s*\}\s*\)/g
    );
    expect(omitMatches).not.toBeNull();
    expect(omitMatches!.length).toBe(3);
    expect(DICE_DEMO_SRC).toMatch(/COMMON_DICE_SETS\.standard/);
    expect(DICE_DEMO_SRC).toMatch(/COMMON_DICE_SETS\.primeGold/);
    expect(DICE_DEMO_SRC).toMatch(/COMMON_DICE_SETS\.triple/);
  });

  it('keeps addLog trim arm (nnnull lastChild! residual owned by 580)', () => {
    expect(DICE_DEMO_SRC).toMatch(
      /while\s*\(\s*container\.children\.length\s*>\s*20\s*\)/
    );
    expect(DICE_DEMO_SRC).toMatch(/container\.removeChild\(/);
    expect(DICE_DEMO_SRC).toMatch(/container\.lastChild/);
    // Tip post1012 head: lastChild! residual = 1. After #1024/580 folds,
    // the same trim arm stays via a null-guard (nnnull count → 0).
    const nnnullMatches = DICE_DEMO_SRC.match(/lastChild!/g);
    expect((nnnullMatches ?? []).length).toBeLessThanOrEqual(1);
  });

  it('keeps clearElement remount soft-clear at render entry', () => {
    expect(DICE_DEMO_SRC).toMatch(
      /export\s+function\s+renderDiceDemo[\s\S]*?clearElement\(\s*container\s*\)/
    );
  });
});

// =============================================================================
// 2. Quick-roll data-count soft-fail fallback
// =============================================================================

describe('q-mp-597 dice-demo — data-count soft-fail fallback', () => {
  it('missing data-count attribute soft-falls back to a single die roll', () => {
    const root = mountRoot();
    renderDiceDemo(root);

    const btn = root.querySelector(
      '.quick-roll-btn[data-dice="d6"][data-count="3"]'
    ) as HTMLButtonElement;
    expect(btn).toBeTruthy();
    btn.removeAttribute('data-count');
    expect(btn.hasAttribute('data-count')).toBe(false);

    btn.click();

    // renderRollResult stamps .dice-roll-result on the host itself.
    const result = root.querySelector('#quick-roll-result') as HTMLElement;
    expect(result.classList.contains('dice-roll-result')).toBe(true);
    expect(result.querySelectorAll('.die-wrapper').length).toBe(1);
  });

  it('present data-count=2 still rolls two dice (fallback not taken)', () => {
    const root = mountRoot();
    renderDiceDemo(root);

    const btn = root.querySelector(
      '.quick-roll-btn[data-dice="d6"][data-count="2"]'
    ) as HTMLButtonElement;
    btn.click();

    const result = root.querySelector('#quick-roll-result') as HTMLElement;
    expect(result.classList.contains('dice-roll-result')).toBe(true);
    expect(result.querySelectorAll('.die-wrapper').length).toBe(2);
  });
});

// =============================================================================
// 3. COMMON_DICE_SETS undefined soft-omits (primeGold / triple)
// =============================================================================

describe('q-mp-597 dice-demo — diceSet undefined soft-omits', () => {
  it('missing primeGold key soft-omits diceSet and still mounts poly selector', () => {
    softDeleteDiceSet('primeGold');
    expect(COMMON_DICE_SETS.primeGold).toBeUndefined();

    const root = mountRoot();
    expect(() => renderDiceDemo(root)).not.toThrow();

    // DiceSelector stamps .dice-selector on the host container.
    const poly = root.querySelector('#selector-poly') as HTMLElement;
    expect(poly.classList.contains('dice-selector')).toBe(true);
    // Soft-omit falls through to DiceSelector default (standard catalog name).
    expect(poly.querySelector('.dice-selector-header')?.textContent).toBe(
      COMMON_DICE_SETS.standard.name
    );
  });

  it('missing triple key soft-omits diceSet and still mounts sums selector', () => {
    softDeleteDiceSet('triple');
    expect(COMMON_DICE_SETS.triple).toBeUndefined();

    const root = mountRoot();
    expect(() => renderDiceDemo(root)).not.toThrow();

    const sums = root.querySelector('#selector-sums') as HTMLElement;
    expect(sums.classList.contains('dice-selector')).toBe(true);
    expect(sums.querySelector('.dice-selector-header')?.textContent).toBe(
      COMMON_DICE_SETS.standard.name
    );
  });

  it('missing both primeGold + triple soft-omits leave 2d6 standard host intact', () => {
    softDeleteDiceSet('primeGold');
    softDeleteDiceSet('triple');

    const root = mountRoot();
    renderDiceDemo(root);

    const sel2d6 = root.querySelector('#selector-2d6') as HTMLElement;
    expect(sel2d6.classList.contains('dice-selector')).toBe(true);
    expect(
      (root.querySelector('#selector-poly') as HTMLElement).classList.contains(
        'dice-selector'
      )
    ).toBe(true);
    expect(
      (root.querySelector('#selector-sums') as HTMLElement).classList.contains(
        'dice-selector'
      )
    ).toBe(true);
  });
});

// =============================================================================
// 4. addLog lastChild! trim + duplicate result-area residual
// =============================================================================

describe('q-mp-597 dice-demo — addLog lastChild! trim residual', () => {
  it('full demo mount stamps three duplicate #dice-result-area ids', () => {
    // Known residual (wave56): three DiceSelector hosts share one id.
    // Characterization only — product clear owned elsewhere / not this ticket.
    const root = mountRoot();
    renderDiceDemo(root);
    expect(root.querySelectorAll('#dice-result-area')).toHaveLength(3);
    expect(root.querySelectorAll('.dice-result-area')).toHaveLength(3);
  });

  it('2d6 log trim residual still caps at 20 after selection churn', () => {
    const root = mountRoot();
    renderDiceDemo(root);
    vi.advanceTimersByTime(1200);

    const box = root.querySelector('#selector-2d6') as HTMLElement;
    const rollBtn = [...box.querySelectorAll('button')].find((b) =>
      /Roll/i.test(b.textContent ?? '')
    ) as HTMLButtonElement;
    rollBtn.click();
    vi.advanceTimersByTime(1200);

    const die = box.querySelector('.die-wrapper') as HTMLElement;
    expect(die).toBeTruthy();
    for (let i = 0; i < 26; i++) {
      die.click();
    }

    expect(root.querySelectorAll('#log-2d6 .log-entry').length).toBe(20);
  });
});

// =============================================================================
// 5. Remount soft-clear residual
// =============================================================================

describe('q-mp-597 dice-demo — remount clearElement soft-clear', () => {
  it('second renderDiceDemo clears prior .dice-demo before remount', () => {
    const root = mountRoot();
    renderDiceDemo(root);
    expect(root.querySelectorAll('.dice-demo')).toHaveLength(1);

    const firstStyle = root.querySelector('.dice-demo > style');
    expect(firstStyle).toBeTruthy();

    renderDiceDemo(root);
    expect(root.querySelectorAll('.dice-demo')).toHaveLength(1);
    expect(root.querySelectorAll('#selector-2d6')).toHaveLength(1);
    expect(root.querySelectorAll('#quick-roll-result')).toHaveLength(1);
    // Prior wrapper is gone — only one style child under the remounted host.
    expect(root.querySelectorAll('.dice-demo > style')).toHaveLength(1);
  });

  it('remount resets quick-roll result host to empty placeholder structure', () => {
    const root = mountRoot();
    renderDiceDemo(root);
    (
      root.querySelector(
        '.quick-roll-btn[data-dice="d6"][data-count="1"]'
      ) as HTMLButtonElement
    ).click();
    expect(
      (
        root.querySelector('#quick-roll-result') as HTMLElement
      ).querySelectorAll('.die-wrapper').length
    ).toBe(1);

    renderDiceDemo(root);
    const result = root.querySelector('#quick-roll-result') as HTMLElement;
    expect(result.querySelector('.dice-roll-result')).toBeNull();
    expect(result.querySelectorAll('.die-wrapper').length).toBe(0);
  });
});
