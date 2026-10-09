/**
 * Overnight TOKENMAXX HEAVY — fraction demo visual bars mount leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderFractionDemo } from '../../src/demos/fraction-demo';
import { mountRoot } from './helpers/dom';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Overnight demos — fraction visual bars', () => {
  it('horizontal / vertical / circle bar sections each mount 4 samples', () => {
    const root = mountRoot();
    renderFractionDemo(root);
    expect(root.querySelector('#horizontal-bars')?.children.length).toBe(4);
    expect(root.querySelector('#vertical-bars')?.children.length).toBe(4);
    expect(root.querySelector('#circle-bars')?.children.length).toBe(4);
  });

  it('initial arithmetic + compare + equiv auto-fires on mount', () => {
    const root = mountRoot();
    renderFractionDemo(root);
    expect(
      (root.querySelector('#arithmetic-result')?.innerHTML.length ?? 0) > 0
    ).toBe(true);
    expect(
      (root.querySelector('#comparison-result')?.innerHTML.length ?? 0) > 0
    ).toBe(true);
    expect(
      (root.querySelector('#equivalent-result')?.querySelectorAll('.equivalent-item')
        .length ?? 0) > 0
    ).toBe(true);
  });
});
