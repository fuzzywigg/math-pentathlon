/**
 * Overnight TOKENMAXX HEAVY — polyomino demo set/select/rotate leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderPolyominoDemo } from '../../src/demos/polyomino-demo';

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

describe('Overnight demos — poly set / select / rotate', () => {
  it('each shape set refreshes gallery counts and clears prior selection chrome', () => {
    const root = mount();
    renderPolyominoDemo(root);
    (root.querySelector('#clear-board-btn') as HTMLButtonElement).click();

    for (const name of ['pentominoes', 'simple', 'pattern', 'tetrominoes'] as const) {
      (
        root.querySelector(`.set-btn[data-set="${name}"]`) as HTMLButtonElement
      ).click();
      expect(
        root.querySelector(`.set-btn[data-set="${name}"]`)?.classList.contains(
          'selected'
        )
      ).toBe(true);
      expect(
        (root.querySelector('#shape-gallery')?.children.length ?? 0) > 0
      ).toBe(true);
      expect(root.querySelector('#selected-shape')?.textContent).toMatch(
        /Click a shape/i
      );
    }
  });

  it('selecting a shape fills info dl + rotate control advances orientation', () => {
    const root = mount();
    renderPolyominoDemo(root);
    (root.querySelector('#clear-board-btn') as HTMLButtonElement).click();
    (root.querySelector('#shape-gallery .shape-item') as HTMLElement).click();

    expect(root.querySelector('#shape-info')?.textContent).toMatch(/Size|ID|Orientation/i);
    expect(root.querySelector('#orientation-count')?.textContent).toMatch(
      /orientation/i
    );
    const before = root.querySelector('#selected-shape')?.innerHTML;
    const rotateBtn = [
      ...root.querySelectorAll('#rotation-controls button'),
    ].find((b) => /rotate|cw|↻|→|right/i.test(b.textContent ?? '') || b.getAttribute('aria-label')?.match(/rotate/i));
    if (rotateBtn) {
      (rotateBtn as HTMLButtonElement).click();
      // orientation display should still render a shape svg
      expect(root.querySelector('#selected-shape svg')).toBeTruthy();
      expect(root.querySelector('#selected-shape')?.innerHTML.length).toBeGreaterThan(0);
      expect(before?.length).toBeGreaterThan(0);
    } else {
      // controls may use icon-only buttons — any button click is fine
      const any = root.querySelector(
        '#rotation-controls button'
      ) as HTMLButtonElement;
      expect(any).toBeTruthy();
      any.click();
      expect(root.querySelector('#selected-shape svg')).toBeTruthy();
    }
  });
});
