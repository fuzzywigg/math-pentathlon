/**
 * q-mp-272 mutation audit UI wave 8 — kill survivors in expressions/expression-ui.
 * Structural / numeric pins only — no player-facing copy asserts.
 *
 * Note: L18 `stylesInjected = false → true` is intentionally not pinned here.
 * `tests/unit/setup.ts` clears `document.head` styles between tests while the
 * module flag stays true under isolate:false, so DOM style-count asserts flake
 * in the full suite. Documented survivor in docs/dev/mutation-audit-ui-8.md.
 */
import { afterEach, describe, expect, it } from 'vitest';

import { renderCardSVG } from '../../src/core/expressions/expression-ui';
import { createNumberCard } from '../../src/core/expressions/types';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('mutation-ui8 expression-ui', () => {
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
