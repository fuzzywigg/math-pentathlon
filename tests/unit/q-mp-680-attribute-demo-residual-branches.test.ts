/**
 * q-mp-680 — Close `src/demos/attribute-demo.ts` residual branches (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1059` @ `70da293f`) before this suite:
 *   Spec glob `tests/unit/*attribute-demo*`: **93.36%** lines / **86.07%** branches
 *     (68/79). Uncovered stmts: 272, 376, 407, 485–496, 536–537, 637.
 *
 * After this suite (same glob): **100%** lines / **98.73%** branches (78/79).
 * Sole residual arm: L671 `displayName || attr.name` — owned by undrafted
 * `q-mp-581` nullish clear; characterize-only / leave **contained**.
 *
 * This suite owns the branch residuals under the dedicated `*attribute-demo*`
 * basename glob (tip-fold overnight suites stay **contained** — different
 * basenames; no comments/labels/closes per worker brief). L407 is exercised
 * via `Math.floor → NaN` (sole Math.floor sites in attribute-demo.ts).
 *
 * Constraints: tests only; zero `src/` edits; no copy / aria / label pins;
 * no AI / rules / scoring; no ratchet JSON; Hex Hard 450ms; no network.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({
  navigate: vi.fn(),
}));

import { navigate } from '../../src/core/router';
import { renderAttributeDemo } from '../../src/demos/attribute-demo';
import { mountRoot } from './helpers/dom';

beforeEach(() => {
  document.body.innerHTML = '';
  vi.clearAllMocks();
});

afterEach(() => {
  document.body.innerHTML = '';
  // clearAllMocks only — restoreAllMocks kills hoisted router.navigate mock
  vi.clearAllMocks();
});

function setCardWrappers(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll('#set-grid .set-card')].map(
    (el) => el.parentElement as HTMLElement
  );
}

function compareWrappers(root: HTMLElement): HTMLElement[] {
  return [
    ...root.querySelectorAll('#compare-grid .piece-wrapper'),
  ] as HTMLElement[];
}

describe('q-mp-680 attribute-demo — residual branches', () => {
  it('back-btn click exercises navigate listener body (L272)', () => {
    const root = mountRoot();
    renderAttributeDemo(root);

    const backBtn = document.getElementById('back-btn') as HTMLButtonElement;
    expect(backBtn).toBeTruthy();
    expect(backBtn.classList.contains('back-button')).toBe(true);

    backBtn.click();
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith('/');
  });

  it('math→basic set-switch hits BASIC_ATTRIBUTES else arm (L376)', () => {
    const root = mountRoot();
    renderAttributeDemo(root);

    const mathBtn = root.querySelector(
      '.attribute-set-selector .set-btn[data-set="math"]'
    ) as HTMLButtonElement;
    const basicBtn = root.querySelector(
      '.attribute-set-selector .set-btn[data-set="basic"]'
    ) as HTMLButtonElement;
    expect(mathBtn).toBeTruthy();
    expect(basicBtn).toBeTruthy();

    mathBtn.click();
    expect(mathBtn.classList.contains('selected')).toBe(true);
    expect(basicBtn.classList.contains('selected')).toBe(false);
    const mathCount = root.querySelectorAll(
      '#piece-grid .piece-wrapper'
    ).length;
    expect(mathCount).toBeGreaterThan(0);

    // Select a math piece so showInfo paints non-placeholder; basic switch
    // clears selection and restores the placeholder soft arm.
    (root.querySelector('#piece-grid .piece-wrapper') as HTMLElement).click();
    expect(root.querySelector('#selected-info .placeholder')).toBeNull();

    basicBtn.click();
    expect(basicBtn.classList.contains('selected')).toBe(true);
    expect(mathBtn.classList.contains('selected')).toBe(false);
    expect(
      root.querySelectorAll('#piece-grid .piece-wrapper').length
    ).toBeGreaterThan(0);
    expect(root.querySelector('#selected-info .placeholder')).toBeTruthy();
  });

  it('SET cards 0,1,2 paint .valid; 0,1,3 paint .invalid reason path (L480–496)', () => {
    const root = mountRoot();
    renderAttributeDemo(root);
    const cards = setCardWrappers(root);
    expect(cards.length).toBeGreaterThanOrEqual(4);

    cards[0]!.click();
    cards[1]!.click();
    cards[2]!.click();
    const result = root.querySelector('#set-result');
    expect(result?.classList.contains('valid')).toBe(true);
    expect(result?.classList.contains('invalid')).toBe(false);

    // Deselect card 2, select card 3 → forced invalid (reason loop arms).
    cards[2]!.click();
    cards[3]!.click();
    expect(result?.classList.contains('invalid')).toBe(true);
    expect(result?.classList.contains('valid')).toBe(false);
    expect((result?.textContent ?? '').length).toBeGreaterThan(0);
  });

  it('SET fourth-card click soft-caps selection at 3 (L451 else-if false)', () => {
    const root = mountRoot();
    renderAttributeDemo(root);
    const cards = setCardWrappers(root);
    expect(cards.length).toBeGreaterThanOrEqual(4);

    cards[0]!.click();
    cards[1]!.click();
    cards[2]!.click();
    const result = root.querySelector('#set-result');
    expect(result?.classList.contains('valid')).toBe(true);
    const verdictBefore = result?.textContent ?? '';

    // size === 3 → else-if (size < 3) false; card 3 ignored, verdict stable.
    expect(() => cards[3]!.click()).not.toThrow();
    expect(result?.classList.contains('valid')).toBe(true);
    expect(result?.textContent).toBe(verdictBefore);
  });

  it('SET invalid after passing earlier attrs hits reason-loop skip arms (L490)', () => {
    // Cards 0,4,11: number+shape all-diff/same pass; shading fails first.
    const root = mountRoot();
    renderAttributeDemo(root);
    const cards = setCardWrappers(root);
    expect(cards.length).toBeGreaterThanOrEqual(12);

    cards[0]!.click();
    cards[4]!.click();
    cards[11]!.click();
    const result = root.querySelector('#set-result');
    expect(result?.classList.contains('invalid')).toBe(true);
    expect(result?.classList.contains('valid')).toBe(false);
    expect((result?.textContent ?? '').length).toBeGreaterThan(0);
  });

  it('third compare pick restarts slot1 and clears slot2 (L536–537)', () => {
    const root = mountRoot();
    renderAttributeDemo(root);
    const pieces = compareWrappers(root);
    expect(pieces.length).toBeGreaterThanOrEqual(3);

    pieces[0]!.click();
    pieces[1]!.click();
    expect(
      root.querySelector('#compare-piece-1')?.classList.contains('filled')
    ).toBe(true);
    expect(
      root.querySelector('#compare-piece-2')?.classList.contains('filled')
    ).toBe(true);
    expect(root.querySelector('#comparison-results .match-list')).toBeTruthy();

    pieces[2]!.click();
    expect(
      root.querySelector('#compare-piece-1')?.classList.contains('filled')
    ).toBe(true);
    expect(
      root.querySelector('#compare-piece-2')?.classList.contains('filled')
    ).toBe(false);
    expect(root.querySelector('#comparison-results .placeholder')).toBeTruthy();
  });

  it('SET undefined-attr continue soft-skips cards when Math.floor yields NaN (L407)', () => {
    // shapes[Math.floor(i/4)%3] / shadings[Math.floor(i/3)%3] — only Math.floor
    // sites in attribute-demo.ts. NaN index → undefined → continue arm.
    const floorSpy = vi.spyOn(Math, 'floor').mockReturnValue(Number.NaN);
    try {
      const root = mountRoot();
      expect(() => renderAttributeDemo(root)).not.toThrow();
      expect(root.querySelectorAll('#set-grid .set-card')).toHaveLength(0);
      // Other sections still mount (piece/compare/filter hosts).
      expect(
        root.querySelectorAll('#piece-grid .piece-wrapper').length
      ).toBeGreaterThan(0);
      expect(
        root.querySelectorAll('#compare-grid .piece-wrapper').length
      ).toBeGreaterThan(0);
    } finally {
      floorSpy.mockRestore();
    }
  });

  it('compare pair with ≥2 diffs hits diff-list spacer arm (L637)', () => {
    const root = mountRoot();
    renderAttributeDemo(root);
    const pieces = compareWrappers(root);
    expect(pieces.length).toBeGreaterThanOrEqual(2);

    let found = false;
    for (let i = 0; i < pieces.length && !found; i++) {
      for (let j = i + 1; j < pieces.length; j++) {
        // Fresh mount each attempt so slots restart cleanly.
        document.body.innerHTML = '';
        const attempt = mountRoot();
        renderAttributeDemo(attempt);
        const wrappers = compareWrappers(attempt);
        wrappers[i]!.click();
        wrappers[j]!.click();
        const diffs = attempt.querySelectorAll(
          '#comparison-results .attr-tag.diff'
        );
        if (diffs.length >= 2) {
          found = true;
          expect(
            attempt.querySelector('#comparison-results .diff-list')
          ).toBeTruthy();
          expect(diffs.length).toBeGreaterThanOrEqual(2);
          break;
        }
      }
    }
    expect(found).toBe(true);
  });
});
