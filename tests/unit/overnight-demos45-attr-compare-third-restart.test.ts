/**
 * Overnight TOKENMAXX HEAVY — attribute compare third-pick restart leftovers.
 * Distinct from #202 two-slot fill. Tests-only.
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

describe('Overnight demos45 — attr compare third restart', () => {
  it('third compare pick restarts slot1 and clears slot2', () => {
    const root = mount();
    renderAttributeDemo(root);
    const pieces = [
      ...root.querySelectorAll('#compare-grid .piece-wrapper'),
    ] as HTMLElement[];
    expect(pieces.length).toBeGreaterThanOrEqual(3);

    pieces[0].click();
    pieces[1].click();
    expect(
      root.querySelector('#compare-piece-1')?.classList.contains('filled')
    ).toBe(true);
    expect(
      root.querySelector('#compare-piece-2')?.classList.contains('filled')
    ).toBe(true);
    expect(root.querySelector('#comparison-results')?.textContent).toMatch(
      /Match Score/i
    );

    pieces[2].click();
    expect(
      root.querySelector('#compare-piece-1')?.classList.contains('filled')
    ).toBe(true);
    expect(
      root.querySelector('#compare-piece-2')?.classList.contains('filled')
    ).toBe(false);
  });
});
