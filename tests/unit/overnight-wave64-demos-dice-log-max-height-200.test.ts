/**
 * Wave 64 leftover after tip/#303 (unit-only) — dice log max height 200.
 * Distinct from wave58–60 demos chrome leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderDiceDemo } from '../../src/demos/dice-demo';
import { mountRoot } from './helpers/dom';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 64 demos — dice log max-height 200', () => {
  it('locks .log-area max-height 200px + overflow-y auto', () => {
    const root = mountRoot();
    renderDiceDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('max-height: 200px');
    expect(css).toContain('overflow-y: auto');
  });
});
