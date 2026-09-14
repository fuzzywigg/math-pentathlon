/**
 * Overnight TOKENMAXX HEAVY — graph demo template matrix leftovers.
 * Tests-only. No product inventing.
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

const TEMPLATES = ['grid', 'circular', 'star', 'hex', 'track', 'complete'] as const;

describe('Overnight demos — graph template matrix', () => {
  it('each template updates selection, svg, and Nodes/Edges info', () => {
    const root = mount();
    renderGraphDemo(root);

    for (const name of TEMPLATES) {
      const btn = root.querySelector(
        `.template-btn[data-template="${name}"]`
      ) as HTMLButtonElement;
      btn.click();
      expect(btn.classList.contains('selected')).toBe(true);
      expect(
        root.querySelectorAll('.template-btn.selected').length
      ).toBe(1);
      expect(root.querySelector('#template-graph svg')).toBeTruthy();
      const info = root.querySelector('#template-info')?.textContent ?? '';
      expect(info).toMatch(/Nodes/i);
      expect(info).toMatch(/Edges/i);
    }
  });

  it('template-info Connected/Components fields update across switches', () => {
    const root = mount();
    renderGraphDemo(root);
    for (const name of ['star', 'complete'] as const) {
      (
        root.querySelector(
          `.template-btn[data-template="${name}"]`
        ) as HTMLButtonElement
      ).click();
      const info = root.querySelector('#template-info')?.textContent ?? '';
      expect(info).toMatch(/Connected/i);
      expect(info).toMatch(/Components/i);
    }
    // leftover #connectivity-info mount point remains present (shell stub)
    expect(root.querySelector('#connectivity-info')).toBeTruthy();
  });
});
