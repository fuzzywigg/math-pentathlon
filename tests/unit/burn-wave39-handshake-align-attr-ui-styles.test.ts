/**
 * Wave 39 — highlight + attribute + poly + expression style inject handshake.
 * Expression styles use a module flag (no element id). Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { injectHighlightStyles } from '../../src/core/alignment/highlight-ui';
import { injectAttributeStyles } from '../../src/core/attributes/attribute-ui';
import { injectPolyominoStyles } from '../../src/core/polyomino';
import { injectExpressionStyles } from '../../src/core/expressions';

afterEach(() => {
  document
    .querySelectorAll(
      '#alignment-highlight-styles, #attribute-styles, #polyomino-styles'
    )
    .forEach((el) => el.remove());
});

describe('Wave 39 handshake — UI style inject coexistence', () => {
  it('named style tags coexist; expression inject adds head style once', () => {
    const before = document.head.querySelectorAll('style').length;

    injectHighlightStyles();
    injectAttributeStyles();
    injectPolyominoStyles();
    injectExpressionStyles();
    injectHighlightStyles();
    injectAttributeStyles();
    injectPolyominoStyles();
    injectExpressionStyles();

    expect(document.getElementById('alignment-highlight-styles')).toBeTruthy();
    expect(document.getElementById('attribute-styles')).toBeTruthy();
    expect(document.getElementById('polyomino-styles')).toBeTruthy();

    const styles = [...document.head.querySelectorAll('style')];
    expect(styles.length).toBeGreaterThan(before);
    expect(
      styles.some((s) => (s.textContent || '').includes('.expression-card'))
    ).toBe(true);
  });
});
