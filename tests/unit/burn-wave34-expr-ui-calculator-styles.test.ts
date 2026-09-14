/**
 * Wave 34 — expression calculator display + styles leftovers.
 * Covers error / empty result branches and style inject idempotency.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  injectExpressionStyles,
  renderCalculatorDisplay,
} from '../../src/core/expressions';

afterEach(() => {
  document.body.innerHTML = '';
  document
    .querySelectorAll('style')
    .forEach((el) => {
      if (el.textContent?.includes('expression-card')) el.remove();
    });
});

describe('Wave 34 expr-ui-calculator — display branches', () => {
  it('renders error chrome when error string provided', () => {
    const el = renderCalculatorDisplay('1/0', undefined, 'Division by zero');
    document.body.appendChild(el);
    expect(el.textContent).toMatch(/Division by zero/);
    expect(el.textContent).toMatch(/1\/0/);
  });

  it('empty expression defaults display to 0 with blank result', () => {
    const el = renderCalculatorDisplay('');
    expect(el.textContent?.startsWith('0')).toBe(true);
  });

  it('numeric result formats with equals prefix', () => {
    const el = renderCalculatorDisplay('2^3', 8);
    expect(el.textContent).toMatch(/=\s*8/);
  });
});

describe('Wave 34 expr-ui-calculator — style inject', () => {
  it('injectExpressionStyles is idempotent', () => {
    injectExpressionStyles();
    injectExpressionStyles();
    const styles = [...document.querySelectorAll('style')].filter((el) =>
      el.textContent?.includes('expression-card')
    );
    expect(styles.length).toBe(1);
  });
});
