/**
 * q-mp-630 — Close `dice/roller` branch gaps under the `*roller*` verification
 * glob (tests-only characterization).
 *
 * Tip re-measure @ `cursor/mp-tip-post1023` (`166d132d`) before this suite:
 *   With `tests/unit/*roller*` + `q-mp-432*`: **81.25%** lines / **62.5%** branches.
 *   Uncovered clusters: L56 (locked skip in reroll), L82 (unlock true arm),
 *   L144 (minSelectable under), L189–201 (`getTwoDiceResults` body — not
 *   imported by prior *roller* suites).
 *
 * Ownership (leave alone; do not edit):
 *   `#920` / q-mp-432 — dice-ui/roller residual soft edges (contained)
 *   `#1009`/`564` roller nnnull + `#995`/`545` dice-ui nnnull (contained)
 *   burn-wave32/35/38/44 dice suites cover these arms outside the *roller* glob
 *
 * Constraints: tests only; ZERO src; pin CURRENT behavior; seeded/stubbed RNG;
 * no AI / scoring / copy / aria pins; Hex Hard 450ms untouched; no network.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  getTwoDiceResults,
  isValidSelection,
  lockDice,
  rerollDice,
  selectDice,
  unlockDice,
} from '../../src/core/dice/roller';
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

function makeResult(rolls: DieRoll[], id = 'r'): RollResult {
  return {
    id,
    rolls,
    total: rolls.reduce((sum, die) => sum + die.value, 0),
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

// =============================================================================
// L56 — rerollDice skips when id is targeted AND die is locked
// =============================================================================

describe('q-mp-630 roller — locked reroll skip (L56)', () => {
  it('targeted locked die keeps value and id; unlocked sibling rerolls', () => {
    // Pin CURRENT: `dieIds.includes(die.id) && !die.isLocked` — locked arm skips.
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const base = makeResult([
      makeDie({ id: 'locked', diceType: 'd6', value: 2, isLocked: true }),
      makeDie({ id: 'free', diceType: 'd6', value: 3 }),
    ]);
    const next = rerollDice(base, ['locked', 'free']);
    const kept = next.rolls.find((d) => d.id === 'locked');
    const rolled = next.rolls.find((d) => d.id !== 'locked');
    expect(kept?.value).toBe(2);
    expect(kept?.isLocked).toBe(true);
    expect(rolled?.id).not.toBe('free');
    expect(rolled?.value).toBe(6); // floor(0.99 * 6) + 1
    expect(next.id).not.toBe(base.id);
  });

  it('lockDice then reroll of only the locked id is a value no-op', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const base = makeResult([
      makeDie({ id: 'a', diceType: 'd20', value: 11 }),
      makeDie({ id: 'b', diceType: 'd20', value: 7 }),
    ]);
    const locked = lockDice(base, ['a']);
    const next = rerollDice(locked, ['a']);
    expect(next.rolls.map((d) => d.value)).toEqual([11, 7]);
    expect(next.rolls[0]?.id).toBe('a');
    expect(next.rolls[0]?.isLocked).toBe(true);
  });

  it('unlockDice clears isLocked on targeted id only (L82 true arm)', () => {
    // Residual under *roller* glob: q-mp-432 unlocks ghosts only (false arm).
    const locked = makeResult([
      makeDie({ id: 'a', diceType: 'd6', value: 1, isLocked: true }),
      makeDie({ id: 'b', diceType: 'd6', value: 2, isLocked: true }),
    ]);
    const next = unlockDice(locked, ['a']);
    expect(next.rolls.find((d) => d.id === 'a')?.isLocked).toBe(false);
    expect(next.rolls.find((d) => d.id === 'b')?.isLocked).toBe(true);
  });
});

// =============================================================================
// L144 — isValidSelection rejects selectedCount < minSelectable
// =============================================================================

describe('q-mp-630 roller — minSelectable under-select (L144)', () => {
  it('selectedCount below minSelectable returns false (pin current)', () => {
    // q-mp-432 covers min==selected (true) and max over (false); L144 under-arm
    // is the residual under the *roller* glob.
    const base = makeResult([
      makeDie({ id: 'a', diceType: 'd6', value: 1 }),
      makeDie({ id: 'b', diceType: 'd6', value: 2 }),
      makeDie({ id: 'c', diceType: 'd6', value: 3 }),
    ]);
    const one = selectDice(base, ['b'], true);
    expect(
      isValidSelection(one, {
        dice: ['d6', 'd6', 'd6'],
        minSelectable: 2,
      })
    ).toBe(false);
    expect(
      isValidSelection(one, {
        dice: ['d6', 'd6', 'd6'],
        minSelectable: 1,
      })
    ).toBe(true);
  });

  it('empty selection fails minSelectable > 0; passes when min unset', () => {
    const empty = makeResult([
      makeDie({ id: 'a', diceType: 'd6', value: 4 }),
      makeDie({ id: 'b', diceType: 'd6', value: 5 }),
    ]);
    expect(
      isValidSelection(empty, { dice: ['d6', 'd6'], minSelectable: 1 })
    ).toBe(false);
    expect(isValidSelection(empty, { dice: ['d6', 'd6'] })).toBe(true);
  });
});

// =============================================================================
// L189–201 — getTwoDiceResults body + integer-division arms
// =============================================================================

describe('q-mp-630 roller — getTwoDiceResults branch matrix (L189–201)', () => {
  it('enumerates + − × and both integer divisions when both divide evenly', () => {
    // Pin CURRENT key spellings and values — do not change product ops.
    const map = getTwoDiceResults(6, 3);
    expect(map.get('6 + 3')).toBe(9);
    expect(map.get('6 - 3')).toBe(3);
    expect(map.get('3 - 6')).toBe(-3);
    expect(map.get('6 × 3')).toBe(18);
    expect(map.get('6 ÷ 3')).toBe(2);
    // 3 % 6 !== 0 → omit reverse division
    expect(map.has('3 ÷ 6')).toBe(false);
  });

  it('equal nonzero pair includes both division directions', () => {
    const map = getTwoDiceResults(4, 4);
    expect(map.get('4 ÷ 4')).toBe(1);
    // a-b and b-a share key "4 - 4"; both ÷ arms share "4 ÷ 4"
    expect([...map.keys()].sort()).toEqual([
      '4 + 4',
      '4 - 4',
      '4 × 4',
      '4 ÷ 4',
    ]);
    expect(map.size).toBe(4);
  });

  it('non-divisible pair omits both division keys', () => {
    const map = getTwoDiceResults(5, 3);
    expect(map.has('5 ÷ 3')).toBe(false);
    expect(map.has('3 ÷ 5')).toBe(false);
    expect(map.get('5 × 3')).toBe(15);
  });

  it('zero operands omit ÷0 while keeping integer 0÷n', () => {
    // Pin CURRENT: `b !== 0 && a % b === 0` / `a !== 0 && b % a === 0`.
    const aZero = getTwoDiceResults(0, 4);
    expect(aZero.has('0 ÷ 4')).toBe(true);
    expect(aZero.get('0 ÷ 4')).toBe(0);
    expect(aZero.has('4 ÷ 0')).toBe(false);

    const bZero = getTwoDiceResults(5, 0);
    expect(bZero.has('5 ÷ 0')).toBe(false);
    expect(bZero.has('0 ÷ 5')).toBe(true);
    expect(bZero.get('0 ÷ 5')).toBe(0);

    const bothZero = getTwoDiceResults(0, 0);
    expect([...bothZero.keys()].some((k) => k.includes('÷'))).toBe(false);
    expect(bothZero.get('0 × 0')).toBe(0);
  });
});
