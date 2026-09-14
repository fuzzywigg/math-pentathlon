/**
 * Wave 60 leftover after #290 (unit-only) — Expression section support paragraphs.
 * Distinct from wave59 h2 section titles leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderExpressionDemo } from '../../src/demos/expression-demo';

function mount(): HTMLElement {
  const root = document.createElement('div');
  document.body.appendChild(root);
  return root;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 60 demos — expr section paras', () => {
  it('exposes exact expression section support paragraphs', () => {
    const root = mount();
    renderExpressionDemo(root);
    const paras = [...root.querySelectorAll('.demo-section > p')].map(
      (el) => el.textContent ?? ''
    );
    expect(paras).toContain(
      'Type mathematical expressions and see the result'
    );
    expect(paras).toContain(
      'Select a challenge and build an expression to reach the target'
    );
    expect(paras).toContain('Enter 4 numbers and find all ways to make 24');
    expect(paras).toContain(
      'Enter an equation to verify if both sides are equal'
    );
    expect(paras).toContain('Drag cards to build expressions');
  });
});
