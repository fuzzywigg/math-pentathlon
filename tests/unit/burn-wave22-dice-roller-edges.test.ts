/**
 * Wave 22 — dice roller / types / subset-arithmetic edges.
 * Distinct from wave14 game-local dice helpers and #124 attribute/fraction/polyomino.
 * Powers Contig / Juggle / Sum / Prime die surfaces. Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  DICE_FACES,
  DICE_CONFIGS,
  COMMON_DICE_SETS,
  rollDie,
  rollDice,
  roll,
  rollMultiple,
  rerollDice,
  lockDice,
  unlockDice,
  toggleDiceSelection,
  selectDice,
  clearSelection,
  getSelectedValues,
  getSelectedTotal,
  isValidSelection,
  getAllPossibleSums,
  getAllPossibleProducts,
  getTwoDiceResults,
  getDiceConfig,
  type DieRoll,
  type RollResult,
} from '../../src/core/dice';

afterEach(() => {
  vi.restoreAllMocks();
});

function pinnedResult(values: number[], type: DieRoll['diceType'] = 'd6'): RollResult {
  const rolls: DieRoll[] = values.map((value, i) => ({
    id: `die-${i}`,
    diceType: type,
    value,
    isSelected: false,
    isLocked: false,
    timestamp: 1_700_000_000_000 + i,
  }));
  return {
    id: 'roll-pinned',
    rolls,
    total: values.reduce((a, b) => a + b, 0),
  };
}

describe('Wave 22 dice-roller — catalogs & configs', () => {
  it('DICE_FACES / DICE_CONFIGS stay aligned for every type', () => {
    const types = Object.keys(DICE_FACES) as Array<keyof typeof DICE_FACES>;
    expect(types).toEqual(['d4', 'd6', 'd8', 'd10', 'd12', 'd20']);
    for (const t of types) {
      expect(DICE_CONFIGS[t].type).toBe(t);
      expect(DICE_CONFIGS[t].faces).toBe(DICE_FACES[t]);
      expect(DICE_CONFIGS[t].color).toMatch(/^#/);
      expect(getDiceConfig(t)).toEqual(DICE_CONFIGS[t]);
    }
  });

  it('COMMON_DICE_SETS expose standard / triple / polyhedral / primeGold', () => {
    expect(COMMON_DICE_SETS.standard.dice).toHaveLength(2);
    expect(COMMON_DICE_SETS.triple.dice).toHaveLength(3);
    expect(COMMON_DICE_SETS.polyhedral.dice.map((d) => d.type)).toEqual([
      'd4',
      'd6',
      'd8',
      'd10',
      'd12',
      'd20',
    ]);
    expect(COMMON_DICE_SETS.primeGold.dice.map((d) => d.type)).toEqual([
      'd6',
      'd8',
      'd10',
    ]);
    expect(COMMON_DICE_SETS.standard.id).toBe('standard');
    expect(COMMON_DICE_SETS.triple.name).toMatch(/Triple/);
  });
});

describe('Wave 22 dice-roller — roll / reroll / lock matrix', () => {
  it('rollDie respects Math.random pin for every face type', () => {
    // rollDie consumes Math.random for value, then again for generateId
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(rollDie('d4').value).toBe(1);

    vi.spyOn(Math, 'random').mockReturnValue(0.999999);
    expect(rollDie('d20').value).toBe(20);

    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(rollDie('d10').value).toBe(6);
  });

  it('roll / rollMultiple / rollDice agree on totals and empty dice', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // always face 1
    const viaRoll = roll('d6', 'd8');
    expect(viaRoll.rolls.map((r) => r.value)).toEqual([1, 1]);
    expect(viaRoll.total).toBe(2);

    const multi = rollMultiple('d12', 4);
    expect(multi.rolls).toHaveLength(4);
    expect(multi.total).toBe(4);

    const empty = rollDice({ dice: [] });
    expect(empty.rolls).toEqual([]);
    expect(empty.total).toBe(0);
  });

  it('rerollDice skips locked ids and unknown ids; regenerates unlocked', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999); // max face
    const base = pinnedResult([2, 3, 4]);
    const locked = lockDice(base, ['die-1']);
    const rerolled = rerollDice(locked, ['die-0', 'die-1', 'missing']);

    expect(rerolled.rolls[0].value).toBe(6);
    expect(rerolled.rolls[0].id).not.toBe('die-0');
    expect(rerolled.rolls[1].value).toBe(3);
    expect(rerolled.rolls[1].id).toBe('die-1');
    expect(rerolled.rolls[2].value).toBe(4);
    expect(rerolled.total).toBe(6 + 3 + 4);
    expect(rerolled.id).not.toBe(base.id);
  });

  it('lock / unlock are id-scoped and preserve other fields', () => {
    const base = pinnedResult([1, 2]);
    const locked = lockDice(base, ['die-0', 'ghost']);
    expect(locked.rolls[0].isLocked).toBe(true);
    expect(locked.rolls[1].isLocked).toBe(false);
    expect(locked.id).toBe(base.id);

    const unlocked = unlockDice(locked, ['die-0']);
    expect(unlocked.rolls[0].isLocked).toBe(false);
    expect(unlocked.rolls[0].value).toBe(1);
  });
});

describe('Wave 22 dice-roller — selection + validity constraints', () => {
  it('toggle / select / clear compose selection ledgers', () => {
    let result = pinnedResult([5, 6, 1]);
    result = toggleDiceSelection(result, 'die-0');
    expect(result.rolls[0].isSelected).toBe(true);
    result = toggleDiceSelection(result, 'die-0');
    expect(result.rolls[0].isSelected).toBe(false);

    result = selectDice(result, ['die-0', 'die-2'], true);
    expect(getSelectedValues(result)).toEqual([5, 1]);
    expect(getSelectedTotal(result)).toBe(6);

    result = selectDice(result, ['die-0'], false);
    expect(getSelectedValues(result)).toEqual([1]);

    result = clearSelection(result);
    expect(getSelectedValues(result)).toEqual([]);
    expect(getSelectedTotal(result)).toBe(0);
  });

  it('isValidSelection enforces min/max selectable bounds', () => {
    let result = pinnedResult([1, 2, 3]);
    expect(isValidSelection(result, { dice: ['d6', 'd6', 'd6'] })).toBe(true);
    expect(
      isValidSelection(result, { dice: ['d6', 'd6', 'd6'], minSelectable: 1 })
    ).toBe(false);

    result = selectDice(result, ['die-0', 'die-1'], true);
    expect(
      isValidSelection(result, { dice: ['d6', 'd6', 'd6'], minSelectable: 2 })
    ).toBe(true);
    expect(
      isValidSelection(result, { dice: ['d6', 'd6', 'd6'], maxSelectable: 1 })
    ).toBe(false);
    expect(
      isValidSelection(result, {
        dice: ['d6', 'd6', 'd6'],
        minSelectable: 2,
        maxSelectable: 2,
      })
    ).toBe(true);
  });
});

describe('Wave 22 dice-roller — subset sums / products / two-dice ops', () => {
  it('getAllPossibleSums covers empty, singles, and duplicates', () => {
    expect(getAllPossibleSums([])).toEqual([]);
    expect(getAllPossibleSums([7])).toEqual([7]);
    expect(getAllPossibleSums([1, 2, 3])).toEqual([1, 2, 3, 4, 5, 6]);
    // duplicate values still enumerate masks (set collapses identical sums)
    expect(getAllPossibleSums([2, 2])).toEqual([2, 4]);
  });

  it('getAllPossibleProducts covers empty and multiplicative masks', () => {
    expect(getAllPossibleProducts([])).toEqual([]);
    expect(getAllPossibleProducts([2, 3, 4])).toEqual([2, 3, 4, 6, 8, 12, 24]);
    expect(getAllPossibleProducts([5])).toEqual([5]);
  });

  it('getTwoDiceResults includes integer division only and both subtraction orders', () => {
    const map = getTwoDiceResults(6, 3);
    expect(map.get('6 + 3')).toBe(9);
    expect(map.get('6 - 3')).toBe(3);
    expect(map.get('3 - 6')).toBe(-3);
    expect(map.get('6 × 3')).toBe(18);
    expect(map.get('6 ÷ 3')).toBe(2);
    expect(map.get('3 ÷ 6')).toBeUndefined();

    const zero = getTwoDiceResults(4, 0);
    expect(zero.has('4 ÷ 0')).toBe(false);
    expect(zero.get('0 ÷ 4')).toBe(0);

    const neither = getTwoDiceResults(5, 3);
    expect(neither.has('5 ÷ 3')).toBe(false);
    expect(neither.has('3 ÷ 5')).toBe(false);
  });
});
