/**
 * Wave 58 leftover after #267 — Expr Searching... pending copy.
 * Distinct from solver chrome / no-solutions leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderExpressionDemo } from '../../src/demos/expression-demo';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 58 demos — expr Searching ellipsis', () => {
  it('solve click shows exact Searching... before results settle', () => {
    vi.useFakeTimers();
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderExpressionDemo(root);
    (root.querySelector('#solve-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#solutions-list')?.textContent?.trim()).toBe(
      'Searching...'
    );
    vi.useRealTimers();
  });
});
