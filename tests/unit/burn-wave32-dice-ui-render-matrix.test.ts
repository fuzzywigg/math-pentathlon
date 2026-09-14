/**
 * Wave 32 — dice-ui renderDie / interactive / roll-result matrix.
 * Deepens wave 22 UI coverage across sizes, totals, selection chrome.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  renderDie,
  createInteractiveDie,
  renderRollResult,
  DICE_CONFIGS,
  type DieRoll,
  type RollResult,
  type DiceType,
} from '../../src/core/dice';

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
});

describe('Wave 32 dice-ui-render — size + class matrix', () => {
  const types: DiceType[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];

  it('renderDie applies size and die-<type> for every type', () => {
    for (const type of types) {
      for (const size of [32, 48, 60, 80]) {
        const value = Math.min(DICE_CONFIGS[type].faces, 3);
        const svg = renderDie(
          makeDie({ id: `${type}-${size}`, diceType: type, value }),
          size
        );
        expect(svg.getAttribute('width')).toBe(String(size));
        expect(svg.getAttribute('height')).toBe(String(size));
        expect(svg.classList.contains('die')).toBe(true);
        expect(svg.classList.contains(`die-${type}`)).toBe(true);
      }
    }
  });

  it('d6 pip count equals face value for 1..6', () => {
    for (let value = 1; value <= 6; value++) {
      const svg = renderDie(makeDie({ id: `p${value}`, diceType: 'd6', value }));
      expect(svg.querySelectorAll('circle').length).toBe(value);
    }
  });

  it('polyhedral text shows the face value', () => {
    for (const type of ['d4', 'd8', 'd10', 'd12', 'd20'] as DiceType[]) {
      const value = DICE_CONFIGS[type].faces;
      const svg = renderDie(makeDie({ id: type, diceType: type, value }));
      expect(svg.querySelector('text')?.textContent).toBe(String(value));
    }
  });
});

describe('Wave 32 dice-ui-render — interactive + roll result', () => {
  it('createInteractiveDie selected/used classes and click gating', () => {
    const clicks: string[] = [];
    const selected = createInteractiveDie(
      makeDie({
        id: 's',
        diceType: 'd6',
        value: 2,
        isSelected: true,
      }),
      40,
      (d) => clicks.push(d.id)
    );
    expect(selected.classList.contains('selected')).toBe(true);
    selected.click();
    expect(clicks).toEqual(['s']);

    const locked = createInteractiveDie(
      makeDie({
        id: 'l',
        diceType: 'd8',
        value: 5,
        isLocked: true,
      }),
      40,
      (d) => clicks.push(d.id)
    );
    expect(locked.classList.contains('used')).toBe(true);
    locked.click();
    expect(clicks).toEqual(['s']);
  });

  it('renderRollResult showTotal toggle and selectable clicks', () => {
    const result: RollResult = {
      id: 'r1',
      total: 9,
      rolls: [
        makeDie({ id: 'a', diceType: 'd6', value: 4 }),
        makeDie({ id: 'b', diceType: 'd6', value: 5 }),
      ],
    };
    const host = document.createElement('div');
    document.body.appendChild(host);

    renderRollResult(result, host, { showTotal: true, selectable: false });
    expect(host.querySelector('.dice-total')?.textContent).toMatch(/9/);
    expect(host.querySelectorAll('.die-wrapper')).toHaveLength(2);

    const clicks: string[] = [];
    renderRollResult(result, host, {
      showTotal: false,
      selectable: true,
      dieSize: 36,
      onDieClick: (d) => clicks.push(d.id),
    });
    expect(host.querySelector('.dice-total')).toBeNull();
    (host.querySelector('.die-wrapper') as HTMLElement).click();
    expect(clicks).toEqual(['a']);
  });
});
