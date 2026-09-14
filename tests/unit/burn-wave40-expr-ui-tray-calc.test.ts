/**
 * Wave 40 — expr-ui tray hides used + calculator + empty tray leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  renderCardTray,
  renderCalculatorDisplay,
  injectExpressionStyles,
} from '../../src/core/expressions/expression-ui';
import {
  createNumberCard,
  createOperatorCard,
} from '../../src/core/expressions/types';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 40 expr-ui — tray + calculator', () => {
  it('tray hides usedIds cards', () => {
    const cards = [
      createNumberCard(1, 'a'),
      createNumberCard(2, 'b'),
      createOperatorCard('*', 'mul'),
    ];
    const tray = renderCardTray(cards, {
      usedIds: new Set(['a', 'mul']),
    });
    const shown = [...tray.querySelectorAll('.expression-card')].map(
      (c) => c.textContent
    );
    expect(shown).toEqual(['2']);
  });

  it('empty tray renders card-tray with zero children', () => {
    const tray = renderCardTray([]);
    expect(tray.className).toBe('card-tray');
    expect(tray.children).toHaveLength(0);

    const allUsed = renderCardTray(
      [createNumberCard(3, 'c')],
      { usedIds: new Set(['c']) }
    );
    expect(allUsed.children).toHaveLength(0);
  });

  it('calculator shows expression, result, and error paths', () => {
    const ok = renderCalculatorDisplay('3*3', 9);
    expect(ok.textContent).toContain('3*3');
    expect(ok.textContent).toContain('= 9');

    const err = renderCalculatorDisplay('1/', undefined, 'Incomplete');
    expect(err.textContent).toContain('Incomplete');
    expect(
      (err.lastElementChild as HTMLElement).style.color
    ).toMatch(/#f44336|rgb\(244,\s*67,\s*54\)/);

    const blank = renderCalculatorDisplay('');
    expect(blank.textContent).toContain('0');
  });

  it('tray selectedId marks matching card', () => {
    const cards = [
      createNumberCard(4, 'n4'),
      createNumberCard(8, 'n8'),
    ];
    const tray = renderCardTray(cards, { selectedId: 'n8' });
    const selected = tray.querySelector('.expression-card.selected');
    expect(selected?.textContent).toBe('8');
    expect(tray.querySelectorAll('.selected')).toHaveLength(1);
  });

  it('styles inject once and include card-tray selector', () => {
    const before = document.head.querySelectorAll('style').length;
    injectExpressionStyles();
    injectExpressionStyles();
    const after = document.head.querySelectorAll('style').length;
    expect(after - before).toBeLessThanOrEqual(1);
    const css = [...document.head.querySelectorAll('style')]
      .map((s) => s.textContent ?? '')
      .join('\n');
    expect(css).toContain('.card-tray');
    expect(css).toContain('.expression-slot.locked');
  });
});
