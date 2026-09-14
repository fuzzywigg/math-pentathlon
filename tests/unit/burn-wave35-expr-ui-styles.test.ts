/**
 * Wave 35 — injectExpressionStyles idempotency / CSS contracts.
 * Deepens expression-ui leftover after evaluator waves 30/31 and thin wave 22.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { injectExpressionStyles } from '../../src/core/expressions/expression-ui';

afterEach(() => {
  document.head.querySelectorAll('style').forEach((s) => s.remove());
});

describe('Wave 35 expr-ui — styles', () => {
  it('injects a single style tag with card/slot/builder selectors', () => {
    const before = document.head.querySelectorAll('style').length;
    injectExpressionStyles();
    injectExpressionStyles();
    injectExpressionStyles();
    expect(document.head.querySelectorAll('style').length).toBe(before + 1);
    const css = document.head.querySelector('style')!.textContent ?? '';
    expect(css).toContain('.expression-card');
    expect(css).toContain('.expression-slot');
    expect(css).toContain('.expression-builder');
    expect(css).toContain('.card-tray');
    expect(css).toContain('.expression-result');
  });
});
