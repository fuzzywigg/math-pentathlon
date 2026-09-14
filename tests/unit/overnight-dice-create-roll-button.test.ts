/**
 * Overnight TOKENMAXX HEAVY — createRollButton set name leftover.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createRollButton } from '../../src/core/dice/dice-selector';
import { COMMON_DICE_SETS } from '../../src/core/dice/types';

afterEach(() => vi.restoreAllMocks());

describe('Overnight dice-selector — createRollButton', () => {
  it('labels with set name and returns matching roll length', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const root = document.createElement('div');
    const rolls: number[] = [];
    const btn = createRollButton(root, COMMON_DICE_SETS.primeGold, (r) => {
      rolls.push(r.rolls.length);
    });
    expect(btn.textContent).toBe('Roll Prime Gold (3 polyhedral)');
    btn.click();
    expect(rolls).toEqual([3]);
  });
});
