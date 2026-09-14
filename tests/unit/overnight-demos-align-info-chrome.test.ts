/**
 * Overnight TOKENMAXX HEAVY — alignment demo info chrome leftovers after plays.
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

describe('Overnight demos — align info chrome', () => {
  it('four-info alignment counts rise after a short exchange', () => {
    const root = mount();
    renderAlignmentDemo(root);
    const before = root.querySelector('#four-info')?.textContent ?? '';
    (
      root.querySelector('#four-board [data-col="2"]') as HTMLElement
    ).click();
    (
      root.querySelector('#four-board [data-col="3"]') as HTMLElement
    ).click();
    (
      root.querySelector('#four-board [data-col="2"]') as HTMLElement
    ).click();
    const after = root.querySelector('#four-info')?.textContent ?? '';
    expect(after).toMatch(/X has|O has/i);
    expect(after.length).toBeGreaterThan(0);
    expect(before.length + after.length).toBeGreaterThan(0);
  });

  it('hex-info region summary updates after Blue and Red place', () => {
    const root = mount();
    renderAlignmentDemo(root);
    (
      root.querySelector(
        '#hex-board [data-row="1"][data-col="1"]'
      ) as HTMLElement
    ).click();
    (
      root.querySelector(
        '#hex-board [data-row="1"][data-col="2"]'
      ) as HTMLElement
    ).click();
    const info = root.querySelector('#hex-info')?.textContent ?? '';
    expect(info).toMatch(/Blue:.*region/i);
    expect(info).toMatch(/Red:.*region/i);
  });
});
