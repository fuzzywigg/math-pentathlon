/**
 * q-mp-272 mutation audit UI wave 8 — kill survivors in expressions/expression-ui.
 * Structural / numeric pins only — no player-facing copy asserts.
 */
import { afterEach, describe, expect, it } from 'vitest';

import {
  injectExpressionStyles,
  renderCardSVG,
} from '../../src/core/expressions/expression-ui';
import { createNumberCard } from '../../src/core/expressions/types';

afterEach(() => {
  document.body.innerHTML = '';
});

function expressionCardStyleCount(): number {
  return [...document.head.querySelectorAll('style')].filter((el) =>
    el.textContent?.includes('.expression-card')
  ).length;
}

describe('mutation-ui8 expression-ui', () => {
  it('injectExpressionStyles writes stylesheet; second call is idempotent (kills stylesInjected false→true)', () => {
    // Survivor: L18 BooleanLiteral false → true — initializer already "injected"
    // so a fresh process never appends a style tag.
    injectExpressionStyles();
    const afterFirst = expressionCardStyleCount();
    expect(afterFirst).toBeGreaterThanOrEqual(1);
    injectExpressionStyles();
    expect(expressionCardStyleCount()).toBe(afterFirst);
  });

  it('renderCardSVG centers text at width/2 and height/2+6 (kills L332–L333 arith)', () => {
    // Survivors: L332 width/2 → width*2 / 2→3 / 2→1; L333 height/2+6 flips.
    const g = renderCardSVG(createNumberCard(7, 'n7'), 0, 0);
    const text = g.querySelector('text');
    expect(text).toBeTruthy();
    // defaults: width 40, height 56 → x=20, y=28+6=34
    expect(text!.getAttribute('x')).toBe('20');
    expect(text!.getAttribute('y')).toBe('34');

    const custom = renderCardSVG(createNumberCard(1, 'n1'), 0, 0, {
      width: 60,
      height: 80,
    });
    const t2 = custom.querySelector('text');
    expect(t2!.getAttribute('x')).toBe('30');
    expect(t2!.getAttribute('y')).toBe('46');
  });
});
