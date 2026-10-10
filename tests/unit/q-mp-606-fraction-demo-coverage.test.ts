/**
 * q-mp-606 — Raise `fraction-demo` dedicated-suite line coverage from 0%.
 *
 * Tip re-measure @ `cursor/mp-tip-post1012` (`780db960`):
 *   `src/demos/fraction-demo.ts` 793 LOC / 0 dedicated
 *   `tests/unit/` fraction-demo files / targeted coverage 0.0%
 *   lines (0 of 155) via the backlog verification command
 *   (coverage.include=src/demos/fraction-demo.ts + unit/*fraction-demo*).
 *
 * Overnight demos-frac / overnight-demo-fraction suites already exercise
 * the host under other globs; this ticket owns a dedicated fraction-demo
 * file so the verification command measures a real gain.
 *
 * Constraints: tests only; zero `src/` edits; no arithmetic product edits;
 * no AI / rules / scoring / copy / aria / label asserts; no ratchet JSON;
 * no network. Prefer structural probes (ids, classes, children, lengths).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({
  navigate: vi.fn(),
}));

import { navigate } from '../../src/core/router';
import { renderFractionDemo } from '../../src/demos/fraction-demo';
import { mountRoot } from './helpers/dom';

beforeEach(() => {
  document.body.innerHTML = '';
  vi.clearAllMocks();
});

afterEach(() => {
  document.body.innerHTML = '';
  document
    .querySelectorAll('#fraction-bar-styles')
    .forEach((el) => el.remove());
  vi.clearAllMocks();
});

describe('q-mp-606 fraction-demo — mount chrome', () => {
  it('mounts section hosts, inputs, and gallery items', () => {
    const root = mountRoot();
    renderFractionDemo(root);

    expect(root.querySelector('#back-btn')).toBeTruthy();
    expect(
      root.querySelector('#horizontal-bars')?.children.length
    ).toBeGreaterThan(0);
    expect(
      root.querySelector('#vertical-bars')?.children.length
    ).toBeGreaterThan(0);
    expect(root.querySelector('#circle-bars')?.children.length).toBeGreaterThan(
      0
    );
    expect(root.querySelector('#fraction-a')).toBeTruthy();
    expect(root.querySelector('#fraction-b')).toBeTruthy();
    expect(root.querySelectorAll('.op-btn').length).toBe(4);
    expect(root.querySelector('#calculate-btn')).toBeTruthy();
    expect(
      root.querySelector('#interactive-bar')?.children.length
    ).toBeGreaterThan(0);
    expect(root.querySelector('#interactive-value')).toBeTruthy();
    expect(root.querySelector('#compare-btn')).toBeTruthy();
    expect(root.querySelector('#find-equiv-btn')).toBeTruthy();
    expect(
      root.querySelectorAll('#fraction-gallery .gallery-item').length
    ).toBeGreaterThan(0);
    expect(
      root.querySelector('#fraction-gallery .gallery-item .label')
    ).toBeTruthy();
    expect(
      root.querySelector('#fraction-gallery .gallery-item .decimal')
    ).toBeTruthy();
  });

  it('back button navigates home', () => {
    const root = mountRoot();
    renderFractionDemo(root);
    (root.querySelector('#back-btn') as HTMLButtonElement).click();
    expect(navigate).toHaveBeenCalledWith('/');
  });
});

describe('q-mp-606 fraction-demo — arithmetic', () => {
  it('auto-calculates on mount with visual result bar', () => {
    const root = mountRoot();
    renderFractionDemo(root);
    const result = root.querySelector('#arithmetic-result');
    expect(result?.querySelector('.final-result')).toBeTruthy();
    expect(
      result?.querySelector('#result-bar')?.children.length
    ).toBeGreaterThan(0);
    expect(result?.querySelector('.steps')).toBeTruthy();
  });

  it('op buttons toggle selected class without auto-recalculate', () => {
    const root = mountRoot();
    renderFractionDemo(root);
    const before = root.querySelector('#arithmetic-result')?.innerHTML;
    const multiply = root.querySelector(
      '.op-btn[data-op="multiply"]'
    ) as HTMLButtonElement;
    multiply.click();
    expect(multiply.classList.contains('selected')).toBe(true);
    expect(
      root
        .querySelector('.op-btn[data-op="add"]')
        ?.classList.contains('selected')
    ).toBe(false);
    expect(root.querySelector('#arithmetic-result')?.innerHTML).toBe(before);
  });

  it('all four ops produce distinct final-result chrome', () => {
    const root = mountRoot();
    renderFractionDemo(root);
    const a = root.querySelector('#fraction-a') as HTMLInputElement;
    const b = root.querySelector('#fraction-b') as HTMLInputElement;
    a.value = '2/3';
    b.value = '1/4';

    const seen = new Set<string>();
    for (const op of ['add', 'subtract', 'multiply', 'divide'] as const) {
      (
        root.querySelector(`.op-btn[data-op="${op}"]`) as HTMLButtonElement
      ).click();
      (root.querySelector('#calculate-btn') as HTMLButtonElement).click();
      const final = root.querySelector('#arithmetic-result .final-result');
      expect(final).toBeTruthy();
      expect((final?.textContent ?? '').length).toBeGreaterThan(0);
      seen.add(final?.textContent ?? '');
      expect(
        root.querySelector('#result-bar')?.children.length
      ).toBeGreaterThan(0);
    }
    expect(seen.size).toBeGreaterThanOrEqual(3);
  });

  it('invalid arithmetic inputs paint red error node without result bar', () => {
    const root = mountRoot();
    renderFractionDemo(root);
    (root.querySelector('#fraction-a') as HTMLInputElement).value =
      'not-a-frac';
    (root.querySelector('#fraction-b') as HTMLInputElement).value = '1/2';
    (root.querySelector('#calculate-btn') as HTMLButtonElement).click();
    const result = root.querySelector('#arithmetic-result');
    const err = result?.querySelector('p');
    expect(err).toBeTruthy();
    expect(err?.getAttribute('style') ?? err?.style.color).toMatch(/red/i);
    expect(result?.querySelector('#result-bar')).toBeNull();
  });
});

describe('q-mp-606 fraction-demo — interactive bar', () => {
  it('segment click updates interactive-value structurally', () => {
    const root = mountRoot();
    renderFractionDemo(root);
    const segments = root.querySelectorAll(
      '#interactive-bar .fraction-segment'
    );
    expect(segments.length).toBe(4);
    const before = root.querySelector('#interactive-value')?.textContent;
    (segments[2] as HTMLElement).click();
    const after = root.querySelector('#interactive-value')?.textContent;
    expect((after ?? '').length).toBeGreaterThan(0);
    expect(after).not.toBe(before);
  });

  it('denominator change rebuilds segments and clamps numerator', () => {
    const root = mountRoot();
    renderFractionDemo(root);
    const select = root.querySelector(
      '#denominator-select'
    ) as HTMLSelectElement;
    const value = root.querySelector('#interactive-value') as HTMLElement;

    select.value = '8';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    const segments8 = root.querySelectorAll(
      '#interactive-bar .fraction-segment'
    );
    expect(segments8.length).toBe(8);
    expect(value.textContent).toMatch(/\/8/);
    (segments8[7] as HTMLElement).click();

    select.value = '3';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    expect(
      root.querySelectorAll('#interactive-bar .fraction-segment').length
    ).toBe(3);
    expect(value.textContent).toMatch(/\/3/);
  });
});

describe('q-mp-606 fraction-demo — comparison', () => {
  it('mount auto-compares defaults with visual + text + decimal chrome', () => {
    const root = mountRoot();
    renderFractionDemo(root);
    const result = root.querySelector('#comparison-result');
    expect(result?.children.length).toBeGreaterThanOrEqual(2);
    expect(result?.querySelector('.comparison-text')).toBeTruthy();
    expect(
      (result?.querySelector('.comparison-text')?.textContent ?? '').length
    ).toBeGreaterThan(0);
  });

  it('compare equals / less / greater paths refresh comparison-text', () => {
    const root = mountRoot();
    renderFractionDemo(root);
    const a = root.querySelector('#compare-a') as HTMLInputElement;
    const b = root.querySelector('#compare-b') as HTMLInputElement;
    const btn = root.querySelector('#compare-btn') as HTMLButtonElement;
    const texts: string[] = [];

    for (const [av, bv] of [
      ['1/2', '2/4'],
      ['1/3', '1/2'],
      ['3/4', '1/2'],
    ] as const) {
      a.value = av;
      b.value = bv;
      btn.click();
      const text =
        root.querySelector('#comparison-result .comparison-text')
          ?.textContent ?? '';
      expect(text.length).toBeGreaterThan(0);
      texts.push(text);
      expect(
        root.querySelector('#comparison-result')?.children.length
      ).toBeGreaterThanOrEqual(2);
    }
    expect(new Set(texts).size).toBe(3);
  });

  it('invalid compare input paints red error without comparison-text', () => {
    const root = mountRoot();
    renderFractionDemo(root);
    (root.querySelector('#compare-a') as HTMLInputElement).value = 'xx';
    (root.querySelector('#compare-btn') as HTMLButtonElement).click();
    const result = root.querySelector('#comparison-result');
    const err = result?.querySelector('p');
    expect(err).toBeTruthy();
    expect(err?.getAttribute('style') ?? err?.style.color).toMatch(/red/i);
    expect(result?.querySelector('.comparison-text')).toBeNull();
  });
});

describe('q-mp-606 fraction-demo — equivalents', () => {
  it('mount finds equivalents with simplified + denom items', () => {
    const root = mountRoot();
    renderFractionDemo(root);
    expect(
      root.querySelectorAll('#equivalent-result .equivalent-item').length
    ).toBeGreaterThan(0);
  });

  it('find button refreshes equivalent items for a new input', () => {
    const root = mountRoot();
    renderFractionDemo(root);
    (root.querySelector('#equiv-fraction') as HTMLInputElement).value = '2/4';
    (root.querySelector('#find-equiv-btn') as HTMLButtonElement).click();
    const items = root.querySelectorAll('#equivalent-result .equivalent-item');
    expect(items.length).toBeGreaterThan(0);
    expect(items[0].querySelector('span')).toBeTruthy();
  });

  it('invalid equiv input paints red error without equivalent-item', () => {
    const root = mountRoot();
    renderFractionDemo(root);
    (root.querySelector('#equiv-fraction') as HTMLInputElement).value = 'bad';
    (root.querySelector('#find-equiv-btn') as HTMLButtonElement).click();
    const result = root.querySelector('#equivalent-result');
    const err = result?.querySelector('p');
    expect(err).toBeTruthy();
    expect(err?.getAttribute('style') ?? err?.style.color).toMatch(/red/i);
    expect(result?.querySelector('.equivalent-item')).toBeNull();
  });
});
