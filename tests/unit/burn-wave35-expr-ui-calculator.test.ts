/**
 * Wave 35 — renderCalculatorDisplay expression / result / error matrix.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { renderCalculatorDisplay } from '../../src/core/expressions/expression-ui';

describe('Wave 35 expr-ui — calculator display', () => {
  it('renders expression and green result', () => {
    const el = renderCalculatorDisplay('6 * 7', 42);
    expect(el.textContent).toContain('6 * 7');
    expect(el.textContent).toMatch(/=\s*42/);
  });

  it('renders error path in preference to result', () => {
    const el = renderCalculatorDisplay(
      '1 /',
      undefined,
      'Incomplete expression'
    );
    expect(el.textContent).toContain('Incomplete expression');
    expect(el.textContent).not.toMatch(/=\s*\d/);
  });

  it('empty expression shows 0 placeholder', () => {
    const el = renderCalculatorDisplay('');
    expect(el.textContent).toContain('0');
  });

  it('expression-only (no result) keeps body without equals', () => {
    const el = renderCalculatorDisplay('(1+2)');
    expect(el.textContent).toContain('(1+2)');
  });
});
