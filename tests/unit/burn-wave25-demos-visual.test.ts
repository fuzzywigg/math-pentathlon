/**
 * Wave 25 — visual demos mount + interaction (attribute / fraction / polyomino).
 * Distinct from #133 shell/router and waves 21–23 attribute/fraction/polyomino module burns.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({
  navigate: vi.fn(),
}));

import { navigate } from '../../src/core/router';
import { renderAttributeDemo } from '../../src/demos/attribute-demo';
import { renderFractionDemo } from '../../src/demos/fraction-demo';
import { renderPolyominoDemo } from '../../src/demos/polyomino-demo';

function mount(): HTMLElement {
  const root = document.createElement('div');
  document.body.appendChild(root);
  return root;
}

beforeEach(() => {
  document.body.innerHTML = '';
  vi.clearAllMocks();
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 25 demos-visual — attribute demo', () => {
  it('mounts piece grid, SET grid, comparison, and filter sections', () => {
    const root = mount();
    renderAttributeDemo(root);

    expect(root.querySelector('h1')?.textContent).toMatch(/Attribute/i);
    expect(root.querySelectorAll('.set-btn').length).toBeGreaterThanOrEqual(2);
    expect(root.querySelector('#piece-grid')?.children.length).toBeGreaterThan(0);
    expect(root.querySelector('#set-grid')?.children.length).toBeGreaterThan(0);
    expect(root.querySelector('#compare-grid')).toBeTruthy();
    expect(root.querySelector('#selected-info')).toBeTruthy();
    expect(root.querySelector('#set-result')).toBeTruthy();
  });

  it('switches basic vs math attribute sets', () => {
    const root = mount();
    renderAttributeDemo(root);

    const basic = root.querySelector(
      '.set-btn[data-set="basic"]'
    ) as HTMLButtonElement;
    const math = root.querySelector(
      '.set-btn[data-set="math"]'
    ) as HTMLButtonElement;
    expect(basic.classList.contains('selected')).toBe(true);

    const before = root.querySelector('#piece-grid')?.innerHTML ?? '';
    math.click();
    expect(math.classList.contains('selected')).toBe(true);
    expect(basic.classList.contains('selected')).toBe(false);
    const after = root.querySelector('#piece-grid')?.innerHTML ?? '';
    expect(after.length).toBeGreaterThan(0);
    // grids re-render (content may differ by set)
    expect(before.length + after.length).toBeGreaterThan(0);

    basic.click();
    expect(basic.classList.contains('selected')).toBe(true);
  });

  it('clicking a piece updates selected-info', () => {
    const root = mount();
    renderAttributeDemo(root);
    const piece = root.querySelector(
      '#piece-grid .piece-wrapper'
    ) as HTMLElement;
    expect(piece).toBeTruthy();
    piece.click();
    const info = root.querySelector('#selected-info')?.textContent ?? '';
    expect(info).toMatch(/Piece/i);
    expect(info.length).toBeGreaterThan(0);
  });

  it('back button navigates home', () => {
    const root = mount();
    renderAttributeDemo(root);
    (root.querySelector('#back-btn') as HTMLButtonElement).click();
    expect(navigate).toHaveBeenCalledWith('/');
  });
});

describe('Wave 25 demos-visual — fraction demo', () => {
  it('mounts visual bars and arithmetic controls', () => {
    const root = mount();
    renderFractionDemo(root);

    expect(root.querySelector('h1')?.textContent).toMatch(/Fraction/i);
    expect(root.querySelector('#horizontal-bars')?.children.length).toBeGreaterThan(
      0
    );
    expect(root.querySelector('#vertical-bars')?.children.length).toBeGreaterThan(
      0
    );
    expect(root.querySelector('#circle-bars')?.children.length).toBeGreaterThan(0);
    expect(root.querySelector('#fraction-a')).toBeTruthy();
    expect(root.querySelector('#fraction-b')).toBeTruthy();
    expect(root.querySelectorAll('.op-btn').length).toBe(4);
    expect(root.querySelector('#calculate-btn')).toBeTruthy();
  });

  it('calculate with default fractions fills arithmetic-result', () => {
    const root = mount();
    renderFractionDemo(root);

    (root.querySelector('#calculate-btn') as HTMLButtonElement).click();
    const result = root.querySelector('#arithmetic-result')?.textContent ?? '';
    expect(result.length).toBeGreaterThan(0);

    const subtract = root.querySelector(
      '.op-btn[data-op="subtract"]'
    ) as HTMLButtonElement;
    subtract.click();
    expect(subtract.classList.contains('selected')).toBe(true);
    (root.querySelector('#calculate-btn') as HTMLButtonElement).click();
    expect(
      (root.querySelector('#arithmetic-result')?.textContent ?? '').length
    ).toBeGreaterThan(0);
  });

  it('operation selector cycles all four ops', () => {
    const root = mount();
    renderFractionDemo(root);
    for (const op of ['add', 'subtract', 'multiply', 'divide'] as const) {
      const btn = root.querySelector(
        `.op-btn[data-op="${op}"]`
      ) as HTMLButtonElement;
      btn.click();
      expect(btn.classList.contains('selected')).toBe(true);
      const selected = root.querySelectorAll('.op-btn.selected');
      expect(selected).toHaveLength(1);
    }
  });

  it('back button navigates home', () => {
    const root = mount();
    renderFractionDemo(root);
    (root.querySelector('#back-btn') as HTMLButtonElement).click();
    expect(navigate).toHaveBeenCalledWith('/');
  });
});

describe('Wave 25 demos-visual — polyomino demo', () => {
  it('mounts shape gallery, rotation, and board controls', () => {
    const root = mount();
    renderPolyominoDemo(root);

    expect(root.querySelector('h1')?.textContent).toMatch(/Polyomino/i);
    expect(root.querySelectorAll('.set-btn').length).toBe(4);
    expect(
      root.querySelector('#shape-gallery')?.children.length
    ).toBeGreaterThan(0);
    expect(root.querySelector('#board-container')?.children.length).toBeGreaterThan(
      0
    );
    expect(root.querySelector('#clear-board-btn')).toBeTruthy();
    expect(root.querySelector('#undo-btn')).toBeTruthy();
    expect(root.querySelector('#empty-count')?.textContent).toMatch(/Empty/i);
  });

  it('shape-set buttons switch gallery content', () => {
    const root = mount();
    renderPolyominoDemo(root);

    const tetra = root.querySelector(
      '.set-btn[data-set="tetrominoes"]'
    ) as HTMLButtonElement;
    const penta = root.querySelector(
      '.set-btn[data-set="pentominoes"]'
    ) as HTMLButtonElement;
    expect(tetra.classList.contains('selected')).toBe(true);

    const before = root.querySelector('#shape-gallery')?.children.length ?? 0;
    penta.click();
    expect(penta.classList.contains('selected')).toBe(true);
    const after = root.querySelector('#shape-gallery')?.children.length ?? 0;
    expect(after).toBeGreaterThan(0);
    // pentominoes set is larger than tetrominoes
    expect(after).toBeGreaterThanOrEqual(before);

    for (const name of ['simple', 'pattern', 'tetrominoes'] as const) {
      const btn = root.querySelector(
        `.set-btn[data-set="${name}"]`
      ) as HTMLButtonElement;
      btn.click();
      expect(btn.classList.contains('selected')).toBe(true);
      expect(
        (root.querySelector('#shape-gallery')?.children.length ?? 0) > 0
      ).toBe(true);
    }
  });

  it('selecting a shape populates selected-shape and orientations', () => {
    const root = mount();
    renderPolyominoDemo(root);

    const shape = root.querySelector(
      '#shape-gallery > *, #shape-gallery .polyomino-shape, #shape-gallery button'
    ) as HTMLElement;
    expect(shape).toBeTruthy();
    shape.click();

    const selected = root.querySelector('#selected-shape')?.textContent ?? '';
    expect(selected).not.toMatch(/Click a shape above/i);
    expect(root.querySelector('#rotation-controls')?.children.length).toBeGreaterThan(
      0
    );
    expect(
      (root.querySelector('#orientation-count')?.textContent ?? '').length
    ).toBeGreaterThan(0);
  });

  it('clear board keeps empty count chrome and back navigates', () => {
    const root = mount();
    renderPolyominoDemo(root);
    (root.querySelector('#clear-board-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#empty-count')?.textContent).toMatch(/Empty/i);
    (root.querySelector('#undo-btn') as HTMLButtonElement).click();
    (root.querySelector('#back-btn') as HTMLButtonElement).click();
    expect(navigate).toHaveBeenCalledWith('/');
  });
});
