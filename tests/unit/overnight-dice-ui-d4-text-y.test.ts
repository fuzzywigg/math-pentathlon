/**
 * Overnight TOKENMAXX HEAVY — dice-ui polyhedral d4 text y leftover.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDie } from '../../src/core/dice/dice-ui';
import type { DieRoll } from '../../src/core/dice/types';

function die(type: DieRoll['diceType'], value: number): DieRoll {
  return {
    id: 'x',
    diceType: type,
    value,
    isSelected: false,
    isLocked: false,
    timestamp: 1,
  };
}

describe('Overnight dice-ui — d4 text y vs non-d4', () => {
  it('d4 number sits at y=65; d8/d20 at y=58', () => {
    const d4 = renderDie(die('d4', 3), 60);
    const d8 = renderDie(die('d8', 3), 60);
    const d20 = renderDie(die('d20', 11), 60);
    expect(d4.querySelector('text')?.getAttribute('y')).toBe('65');
    expect(d8.querySelector('text')?.getAttribute('y')).toBe('58');
    expect(d20.querySelector('text')?.getAttribute('y')).toBe('58');
    expect(d20.querySelector('text')?.getAttribute('font-size')).toBe('28');
  });
});
