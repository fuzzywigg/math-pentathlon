/**
 * Overnight TOKENMAXX HEAVY leftovers after #234 — attribute compare tag CSS classes.
 * Distinct from Match Score text leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderAttributeDemo } from '../../src/demos/attribute-demo';

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

describe('Wave 51 demos — attr compare tag classes', () => {
  it('two picks paint .attr-tag.match and/or .attr-tag.diff with N/M score', () => {
    const root = mount();
    renderAttributeDemo(root);
    const pieces = root.querySelectorAll('#compare-grid .piece-wrapper');
    expect(pieces.length).toBeGreaterThanOrEqual(2);
    (pieces[0] as HTMLElement).click();
    (pieces[1] as HTMLElement).click();

    const results = root.querySelector('#comparison-results') as HTMLElement;
    expect(results.querySelector('.attr-tag.match, .attr-tag.diff')).toBeTruthy();
    expect(results.textContent ?? '').toMatch(/Match Score:\s*\d+\/\d+/);
  });
});
