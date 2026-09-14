/**
 * Overnight TOKENMAXX HEAVY — alignment demo four-in-row vertical win leftover.
 * Distinct from wave25 mount smoke and #188–#191 / open wave42 engines.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { renderAlignmentDemo } from '../../src/demos/alignment-demo';

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

function clickCol(root: HTMLElement, col: number): void {
  const cell = root.querySelector(
    `#four-board [data-row][data-col="${col}"]`
  ) as HTMLElement;
  cell.click();
}

describe('Overnight demos — align four vertical win', () => {
  it('X wins with four stacked in one column after alternating drops', () => {
    const root = mount();
    renderAlignmentDemo(root);

    // X col0, O col1, repeat → X vertical four in col0
    for (let i = 0; i < 3; i++) {
      clickCol(root, 0);
      clickCol(root, 1);
    }
    clickCol(root, 0);

    const status = root.querySelector('#four-status')?.textContent ?? '';
    expect(status).toMatch(/Winner:\s*X/i);
    expect(root.querySelectorAll('#four-board .winning-cell').length).toBeGreaterThanOrEqual(
      4
    );
  });

  it('post-win column clicks are no-ops (status stays winner)', () => {
    const root = mount();
    renderAlignmentDemo(root);
    for (let i = 0; i < 3; i++) {
      clickCol(root, 0);
      clickCol(root, 1);
    }
    clickCol(root, 0);
    const before = root.querySelector('#four-status')?.innerHTML;
    clickCol(root, 2);
    clickCol(root, 3);
    expect(root.querySelector('#four-status')?.innerHTML).toBe(before);
  });
});
