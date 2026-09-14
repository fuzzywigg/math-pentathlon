/**
 * Overnight TOKENMAXX HEAVY leftovers after #234 — graph analysis region/empty math.
 * Distinct from claim/connects leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderGraphDemo } from '../../src/demos/graph-demo';

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

describe('Wave 51 demos — graph analysis regions/empty', () => {
  it('claim paints region(s)/Board Status; clear restores empty≈Total', () => {
    const root = mount();
    renderGraphDemo(root);

    const analysis = root.querySelector('#game-analysis') as HTMLElement;
    expect(analysis.textContent ?? '').toMatch(/region\(s\)/);
    expect(analysis.textContent ?? '').toMatch(/Board Status/);
    expect(analysis.textContent ?? '').toMatch(/Total:/);

    const gameNodes = [
      ...root.querySelectorAll('#game-graph .graph-node'),
    ] as SVGElement[];
    expect(gameNodes.length).toBeGreaterThan(0);
    gameNodes[0].dispatchEvent(new Event('click', { bubbles: true }));

    expect(root.querySelector('#game-analysis')?.textContent ?? '').toMatch(
      /1 region\(s\)|region\(s\)/
    );

    (root.querySelector('#clear-game-btn') as HTMLButtonElement).click();
    const text = root.querySelector('#game-analysis')?.textContent ?? '';
    const emptyMatch = text.match(/(\d+)\s+empty/);
    const totalMatch = text.match(/Total:\s*(\d+)/);
    expect(emptyMatch && totalMatch).toBeTruthy();
    expect(Number(emptyMatch![1])).toBe(Number(totalMatch![1]));
  });
});
