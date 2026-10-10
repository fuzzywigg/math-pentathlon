/**
 * q-mp-679 — Close `fraction-demo` residual branches after tip-fold coverage.
 *
 * Live tip re-measure (`cursor/mp-tip-post1059` @ `70da293f`):
 *   `src/demos/fraction-demo.ts` under `*fraction-demo*` suites:
 *     **98.7%** lines (153/155) / **67.3%** branches (35/52)
 *   Uncovered stmts: ~604, 764 (interactive-bar / gallery null early-returns).
 *   Residual branches: missing-host soft-fails (`if (host)`, `btn?.…`),
 *     `result.steps ?? []`, `FRACTION_COLORS[d] || '#607d8b'`, and the
 *     equivalent-item skip when eq matches simplified denom.
 *
 * Ownership (leave open; do not edit product / competing suites):
 *   Tip-folded `#1044` / q-mp-606 — 0%→non-zero lines; leave **contained**
 *   Soft serialize with `686` (demo race) — different acceptance; leave alone
 *
 * Constraints: tests only; ZERO `src/` edits; no fraction arithmetic /
 * scoring asserts; no AI / rules / copy / aria / label pins; no ratchet JSON;
 * no network. Prefer structural probes (ids, classes, children, lengths).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({
  navigate: vi.fn(),
}));

import * as arithmetic from '../../src/core/fractions/arithmetic';
import { FRACTION_COLORS } from '../../src/core/fractions/types';
import { renderFractionDemo } from '../../src/demos/fraction-demo';
import { mountRoot } from './helpers/dom';

let getIdSpy: ReturnType<typeof vi.spyOn> | undefined;

beforeEach(() => {
  document.body.innerHTML = '';
  vi.clearAllMocks();
});

afterEach(() => {
  getIdSpy?.mockRestore();
  getIdSpy = undefined;
  document.body.innerHTML = '';
  document
    .querySelectorAll('#fraction-bar-styles')
    .forEach((el) => el.remove());
  vi.clearAllMocks();
});

function spyMissingIds(...missing: string[]): void {
  getIdSpy?.mockRestore();
  const realGet = document.getElementById.bind(document);
  getIdSpy = vi
    .spyOn(document, 'getElementById')
    .mockImplementation((id: string) => {
      if (missing.includes(id)) {
        return null;
      }
      return realGet(id);
    });
}

// =============================================================================
// 1. Mount-time missing-host soft-fails
// =============================================================================

describe('q-mp-679 fraction-demo — mount missing-host soft-fails', () => {
  it('missing back-btn soft-skips navigate wire (no throw)', () => {
    spyMissingIds('back-btn');
    const root = mountRoot();
    expect(() => renderFractionDemo(root)).not.toThrow();
    expect(
      root.querySelector('#horizontal-bars')?.children.length
    ).toBeGreaterThan(0);
  });

  it('missing visual-bar hosts soft-skip sample paints', () => {
    spyMissingIds('horizontal-bars', 'vertical-bars', 'circle-bars');
    const root = mountRoot();
    expect(() => renderFractionDemo(root)).not.toThrow();
    expect(root.querySelector('#fraction-a')).toBeTruthy();
    expect(root.querySelector('#interactive-bar')).toBeTruthy();
  });

  it('missing interactive-bar hits renderInteractive early-return', () => {
    spyMissingIds('interactive-bar');
    const root = mountRoot();
    expect(() => renderFractionDemo(root)).not.toThrow();
    // Host absent at wiring time — early return leaves no segments.
    expect(
      root.querySelectorAll('#interactive-bar .fraction-segment').length
    ).toBe(0);
  });

  it('missing fraction-gallery hits gallery early-return', () => {
    spyMissingIds('fraction-gallery');
    const root = mountRoot();
    expect(() => renderFractionDemo(root)).not.toThrow();
    expect(
      root.querySelectorAll('#fraction-gallery .gallery-item').length
    ).toBe(0);
  });

  it('missing calculate-btn soft-skips arithmetic wire + initial click', () => {
    spyMissingIds('calculate-btn');
    const root = mountRoot();
    expect(() => renderFractionDemo(root)).not.toThrow();
    expect(root.querySelector('#arithmetic-result')?.children.length ?? 0).toBe(
      0
    );
  });

  it('missing compare-btn soft-skips comparison wire + initial click', () => {
    spyMissingIds('compare-btn');
    const root = mountRoot();
    expect(() => renderFractionDemo(root)).not.toThrow();
    expect(root.querySelector('#comparison-result')?.children.length ?? 0).toBe(
      0
    );
  });

  it('missing find-equiv-btn soft-skips equivalent wire + initial click', () => {
    spyMissingIds('find-equiv-btn');
    const root = mountRoot();
    expect(() => renderFractionDemo(root)).not.toThrow();
    expect(root.querySelector('#equivalent-result')?.children.length ?? 0).toBe(
      0
    );
  });

  it('missing denominator-select soft-skips change wire; interactive still paints', () => {
    spyMissingIds('denominator-select');
    const root = mountRoot();
    expect(() => renderFractionDemo(root)).not.toThrow();
    expect(
      root.querySelectorAll('#interactive-bar .fraction-segment').length
    ).toBeGreaterThan(0);
  });
});

// =============================================================================
// 2. Handler-time missing result / value hosts
// =============================================================================

describe('q-mp-679 fraction-demo — handler missing-host soft-fails', () => {
  it('missing arithmetic-result soft-skips invalid + success paint', () => {
    spyMissingIds('arithmetic-result');
    const root = mountRoot();
    expect(() => renderFractionDemo(root)).not.toThrow();

    const a = root.querySelector('#fraction-a') as HTMLInputElement;
    const b = root.querySelector('#fraction-b') as HTMLInputElement;
    const calc = root.querySelector('#calculate-btn') as HTMLButtonElement;
    expect(calc).toBeTruthy();

    a.value = 'bad';
    b.value = '1/2';
    expect(() => calc.click()).not.toThrow();

    a.value = '1/2';
    b.value = '1/3';
    expect(() => calc.click()).not.toThrow();
    expect(root.querySelector('#result-bar')).toBeNull();
  });

  it('missing result-bar after calculate soft-skips visual append', () => {
    const root = mountRoot();
    renderFractionDemo(root);

    const realGet = document.getElementById.bind(document);
    getIdSpy = vi
      .spyOn(document, 'getElementById')
      .mockImplementation((id: string) => {
        if (id === 'result-bar') {
          return null;
        }
        return realGet(id);
      });

    const calc = root.querySelector('#calculate-btn') as HTMLButtonElement;
    expect(() => calc.click()).not.toThrow();
    expect(root.querySelector('#arithmetic-result .final-result')).toBeTruthy();
  });

  it('missing comparison-result soft-skips invalid + success paint', () => {
    spyMissingIds('comparison-result');
    const root = mountRoot();
    expect(() => renderFractionDemo(root)).not.toThrow();

    const a = root.querySelector('#compare-a') as HTMLInputElement;
    const b = root.querySelector('#compare-b') as HTMLInputElement;
    const btn = root.querySelector('#compare-btn') as HTMLButtonElement;
    expect(btn).toBeTruthy();

    a.value = 'xx';
    b.value = '1/2';
    expect(() => btn.click()).not.toThrow();

    a.value = '1/2';
    b.value = '1/3';
    expect(() => btn.click()).not.toThrow();
    expect(root.querySelector('.comparison-text')).toBeNull();
  });

  it('missing equivalent-result soft-skips invalid + success paint', () => {
    spyMissingIds('equivalent-result');
    const root = mountRoot();
    expect(() => renderFractionDemo(root)).not.toThrow();

    const input = root.querySelector('#equiv-fraction') as HTMLInputElement;
    const btn = root.querySelector('#find-equiv-btn') as HTMLButtonElement;
    expect(btn).toBeTruthy();

    input.value = 'bad';
    expect(() => btn.click()).not.toThrow();

    input.value = '1/2';
    expect(() => btn.click()).not.toThrow();
    expect(root.querySelector('.equivalent-item')).toBeNull();
  });

  it('missing interactive-value soft-skips value text on segment + denom change', () => {
    spyMissingIds('interactive-value');
    const root = mountRoot();
    expect(() => renderFractionDemo(root)).not.toThrow();

    const segments = root.querySelectorAll(
      '#interactive-bar .fraction-segment'
    );
    expect(segments.length).toBeGreaterThan(0);
    expect(() => (segments[1] as HTMLElement).click()).not.toThrow();

    const select = root.querySelector(
      '#denominator-select'
    ) as HTMLSelectElement;
    select.value = '6';
    expect(() =>
      select.dispatchEvent(new Event('change', { bubbles: true }))
    ).not.toThrow();
    expect(
      root.querySelectorAll('#interactive-bar .fraction-segment').length
    ).toBe(6);
  });

  it('invalid B-only arithmetic still paints error without result bar', () => {
    const root = mountRoot();
    renderFractionDemo(root);
    (root.querySelector('#fraction-a') as HTMLInputElement).value = '1/2';
    (root.querySelector('#fraction-b') as HTMLInputElement).value = 'nope';
    (root.querySelector('#calculate-btn') as HTMLButtonElement).click();
    const result = root.querySelector('#arithmetic-result');
    expect(result?.querySelector('p')).toBeTruthy();
    expect(result?.querySelector('#result-bar')).toBeNull();
  });
});

// =============================================================================
// 3. Soft residual arms (steps ?? / color fallback / equiv skip)
// =============================================================================

describe('q-mp-679 fraction-demo — soft residual arms', () => {
  it('performOperation without steps uses empty steps fragment', () => {
    const spy = vi.spyOn(arithmetic, 'performOperation').mockReturnValue({
      result: { numerator: 5, denominator: 4 },
      simplified: { numerator: 5, denominator: 4 },
      decimal: 1.25,
      // omit steps → hits `result.steps ?? []`
    });

    const root = mountRoot();
    renderFractionDemo(root);
    const calc = root.querySelector('#calculate-btn') as HTMLButtonElement;
    calc.click();

    const steps = root.querySelector('#arithmetic-result .steps');
    expect(steps).toBeTruthy();
    expect(steps?.children.length ?? 0).toBe(0);
    expect(root.querySelector('#arithmetic-result .final-result')).toBeTruthy();
    spy.mockRestore();
  });

  it('gallery color soft-falls when FRACTION_COLORS omits a catalog denom', () => {
    const saved = FRACTION_COLORS[2];
    // COMMON_FRACTIONS includes 1/2 — force the `|| '#607d8b'` arm.
    Reflect.deleteProperty(FRACTION_COLORS, 2);

    try {
      const root = mountRoot();
      expect(() => renderFractionDemo(root)).not.toThrow();
      const items = root.querySelectorAll('#fraction-gallery .gallery-item');
      expect(items.length).toBeGreaterThan(0);
      expect(items[0]?.querySelector('svg')).toBeTruthy();
    } finally {
      FRACTION_COLORS[2] = saved;
    }
  });

  it('equivalent finder skips the simplified-denom duplicate item', () => {
    const root = mountRoot();
    renderFractionDemo(root);
    (root.querySelector('#equiv-fraction') as HTMLInputElement).value = '2/4';
    (root.querySelector('#find-equiv-btn') as HTMLButtonElement).click();

    const items = root.querySelectorAll('#equivalent-result .equivalent-item');
    // At least the Simplified chrome item; structural only — no copy pins.
    expect(items.length).toBeGreaterThan(0);
    expect(items[0]?.querySelector('span')).toBeTruthy();
    // Remaining items are denom variants (not the simplified duplicate).
    expect(items.length).toBeGreaterThan(1);
  });
});
