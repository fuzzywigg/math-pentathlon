/**
 * q-mp-598 — Characterize `src/demos/attribute-demo.ts` soft-fail residuals
 * (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1012` @ `ed034b44`):
 *   `attribute-demo.ts` **733** LOC (matches backlog)
 *   Dedicated `*attribute-demo*` basename soft-fail suites before: **0**
 *   Files importing `demos/attribute-demo`: **36** (overnight happy-path /
 *     handshake chrome; no soft-fail residual owner)
 *   Overlay nullish residual **1** (`displayName || attr.name` @ L671) —
 *     clear owned by undrafted `q-mp-581`; do **not** clear here
 *   Soft-fail inventory: `getElementById` **13**; early `return;` **10**;
 *     host-null / incomplete-selection / SET-undefined-continue /
 *     optional-wire (`backBtn` / `validSetsContainer` / slots) guards
 *
 * Ownership (leave alone; do not edit product / competing suites):
 *   Undrafted `q-mp-581` — nullish clear in this file; leave **contained**
 *   Open `#1025` / `q-mp-571` — `attribute-ui` soft-fail (different host);
 *     leave **contained**
 *   Overnight `*attr*` / handshake demos — happy-path chrome; this suite
 *     owns missing-host / incomplete-selection / optional-wire residuals
 *
 * Constraints: tests only; zero `src/` edits; no nullish ceiling write;
 * no AI / rules / scoring / player-facing copy / aria / label pins;
 * Hex Hard 450ms; no network; no ratchet JSON.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({
  navigate: vi.fn(),
}));

import { navigate } from '../../src/core/router';
import { renderAttributeDemo } from '../../src/demos/attribute-demo';
import { mountRoot } from './helpers/dom';

const ATTR_DEMO_SRC = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    '../../src/demos/attribute-demo.ts'
  ),
  'utf8'
);

let getIdSpy: ReturnType<typeof vi.spyOn> | undefined;

beforeEach(() => {
  document.body.innerHTML = '';
  vi.clearAllMocks();
});

afterEach(() => {
  getIdSpy?.mockRestore();
  getIdSpy = undefined;
  document.body.innerHTML = '';
  // clearAllMocks only — restoreAllMocks kills hoisted router.navigate mock
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

function setCardWrappers(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll('#set-grid .set-card')].map(
    (el) => el.parentElement as HTMLElement
  );
}

// =============================================================================
// 1. Source soft-fail keep-sites
// =============================================================================

describe('q-mp-598 attribute-demo — source soft-fail keep-sites', () => {
  it('keeps optional back-btn / validSets wire soft-guards', () => {
    expect(ATTR_DEMO_SRC).toMatch(
      /const backBtn = document\.getElementById\('back-btn'\);\s*if \(backBtn\)/
    );
    expect(ATTR_DEMO_SRC).toMatch(/if \(validSetsContainer\)/);
  });

  it('keeps piece-section host / selection soft early-returns', () => {
    expect(ATTR_DEMO_SRC).toMatch(
      /function render\(\): void \{\s*if \(!gridContainer\) \{\s*return;/
    );
    expect(ATTR_DEMO_SRC).toMatch(
      /if \(!infoContainer \|\| !selectedPiece\) \{\s*if \(infoContainer\)/
    );
  });

  it('keeps SET host / incomplete / undefined-attr soft arms', () => {
    expect(ATTR_DEMO_SRC).toMatch(
      /if \(shape === undefined \|\| color === undefined \|\| shading === undefined\) \{\s*continue;/
    );
    expect(ATTR_DEMO_SRC).toMatch(
      /function checkSet\(\): void \{\s*if \(!resultContainer\) \{\s*return;/
    );
    expect(ATTR_DEMO_SRC).toMatch(
      /if \(selectedCards\.size < 3\) \{[\s\S]*?return;/
    );
  });

  it('keeps compare host / incomplete-pair soft early-returns', () => {
    expect(ATTR_DEMO_SRC).toMatch(
      /function updateComparison\(\): void \{\s*if \(!resultsContainer\) \{\s*return;/
    );
    expect(ATTR_DEMO_SRC).toMatch(
      /if \(!piece1 \|\| !piece2\) \{[\s\S]*?return;/
    );
    expect(ATTR_DEMO_SRC).toMatch(/if \(slot1\)/);
    expect(ATTR_DEMO_SRC).toMatch(/if \(slot2\)/);
  });

  it('keeps filter host soft-returns + nullish residual (581 owns clear)', () => {
    expect(ATTR_DEMO_SRC).toMatch(
      /function renderControls\(\): void \{\s*if \(!controlsContainer\) \{\s*return;/
    );
    expect(ATTR_DEMO_SRC).toMatch(
      /function renderFiltered\(\): void \{\s*if \(!gridContainer \|\| !countContainer\) \{\s*return;/
    );
    // Overlay nullish residual — characterize only; do not clear.
    expect(ATTR_DEMO_SRC).toMatch(
      /label\.textContent = attr\.displayName \|\| attr\.name;/
    );
    expect(ATTR_DEMO_SRC).toMatch(
      /select\.value = filters\[attr\.name\] \|\| '';/
    );
  });

  it('inventory stamps match tip remasure (733 LOC / 10 return; / 13 getElementById)', () => {
    // wc -l counts newlines; tip remasure stamped 733.
    expect((ATTR_DEMO_SRC.match(/\n/g) ?? []).length).toBe(733);
    expect((ATTR_DEMO_SRC.match(/return;/g) ?? []).length).toBe(10);
    expect((ATTR_DEMO_SRC.match(/getElementById/g) ?? []).length).toBe(13);
    expect((ATTR_DEMO_SRC.match(/\?\?/g) ?? []).length).toBe(0);
  });
});

// =============================================================================
// 2. Missing-host soft-fail residuals (getElementById null)
// =============================================================================

describe('q-mp-598 attribute-demo — missing-host soft-fail residuals', () => {
  it('missing back-btn soft-skips navigate wire (no throw)', () => {
    spyMissingIds('back-btn');
    const root = mountRoot();
    expect(() => renderAttributeDemo(root)).not.toThrow();
    expect(root.querySelector('#piece-grid')).toBeTruthy();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('missing piece-grid soft-returns piece render; other sections still mount', () => {
    spyMissingIds('piece-grid');
    const root = mountRoot();
    expect(() => renderAttributeDemo(root)).not.toThrow();
    expect(root.querySelector('#set-grid')?.children.length).toBeGreaterThan(0);
    expect(
      root.querySelector('#compare-grid')?.children.length
    ).toBeGreaterThan(0);
    expect(
      root.querySelector('#filter-controls')?.querySelectorAll('select').length
    ).toBeGreaterThan(0);
  });

  it('missing selected-info soft-skips info paint on piece click', () => {
    spyMissingIds('selected-info');
    const root = mountRoot();
    expect(() => renderAttributeDemo(root)).not.toThrow();
    const piece = root.querySelector(
      '#piece-grid .piece-wrapper'
    ) as HTMLElement | null;
    expect(piece).toBeTruthy();
    expect(() => piece!.click()).not.toThrow();
    // Host was null at init — markup id may exist in HTML string but wiring
    // used null; click must not throw.
    expect(root.querySelector('#set-grid')).toBeTruthy();
  });

  it('missing set-grid soft-returns SET render; result host stays idle', () => {
    spyMissingIds('set-grid');
    const root = mountRoot();
    expect(() => renderAttributeDemo(root)).not.toThrow();
    expect(root.querySelector('#set-result')?.classList.contains('valid')).toBe(
      false
    );
    expect(
      root.querySelector('#set-result')?.classList.contains('invalid')
    ).toBe(false);
    expect(root.querySelector('#piece-grid')?.children.length).toBeGreaterThan(
      0
    );
  });

  it('missing set-result soft-returns checkSet on card click', () => {
    spyMissingIds('set-result');
    const root = mountRoot();
    expect(() => renderAttributeDemo(root)).not.toThrow();
    const cards = setCardWrappers(root);
    expect(cards.length).toBeGreaterThanOrEqual(1);
    expect(() => cards[0]!.click()).not.toThrow();
  });

  it('missing valid-sets-info soft-skips tip wire; SET grid still paints', () => {
    spyMissingIds('valid-sets-info');
    const root = mountRoot();
    expect(() => renderAttributeDemo(root)).not.toThrow();
    expect(root.querySelectorAll('#set-grid .set-card').length).toBe(12);
  });

  it('missing compare-grid soft-returns compare render; slots stay empty shells', () => {
    spyMissingIds('compare-grid');
    const root = mountRoot();
    expect(() => renderAttributeDemo(root)).not.toThrow();
    expect(
      root.querySelector('#compare-piece-1')?.classList.contains('filled')
    ).toBe(false);
    expect(
      root.querySelector('#compare-piece-2')?.classList.contains('filled')
    ).toBe(false);
  });

  it('missing comparison-results soft-returns updateComparison on click', () => {
    spyMissingIds('comparison-results');
    const root = mountRoot();
    expect(() => renderAttributeDemo(root)).not.toThrow();
    const pieces = root.querySelectorAll('#compare-grid .piece-wrapper');
    expect(pieces.length).toBeGreaterThanOrEqual(2);
    expect(() => {
      (pieces[0] as HTMLElement).click();
      (pieces[1] as HTMLElement).click();
    }).not.toThrow();
    expect(
      root.querySelector('#compare-piece-1')?.classList.contains('filled')
    ).toBe(true);
  });

  it('missing compare slots soft-skip slot fill; results still update', () => {
    spyMissingIds('compare-piece-1', 'compare-piece-2');
    const root = mountRoot();
    expect(() => renderAttributeDemo(root)).not.toThrow();
    const pieces = root.querySelectorAll('#compare-grid .piece-wrapper');
    expect(pieces.length).toBeGreaterThanOrEqual(2);
    (pieces[0] as HTMLElement).click();
    (pieces[1] as HTMLElement).click();
    const results = root.querySelector('#comparison-results');
    expect(results?.querySelector('.match-list')).toBeTruthy();
    expect(results?.querySelector('.diff-list')).toBeTruthy();
  });

  it('missing filter-controls soft-returns controls paint; filtered grid still mounts', () => {
    spyMissingIds('filter-controls');
    const root = mountRoot();
    expect(() => renderAttributeDemo(root)).not.toThrow();
    expect(
      root.querySelector('#filtered-grid')?.querySelectorAll('.piece-wrapper')
        .length
    ).toBeGreaterThan(0);
    expect(root.querySelector('#filter-count')).toBeTruthy();
  });

  it('missing filtered-grid soft-returns filtered paint (count host alone insufficient)', () => {
    spyMissingIds('filtered-grid');
    const root = mountRoot();
    expect(() => renderAttributeDemo(root)).not.toThrow();
    expect(
      root.querySelector('#filter-controls')?.querySelectorAll('select').length
    ).toBeGreaterThan(0);
  });

  it('missing filter-count soft-returns filtered paint (grid host alone insufficient)', () => {
    spyMissingIds('filter-count');
    const root = mountRoot();
    expect(() => renderAttributeDemo(root)).not.toThrow();
    // Dual-host guard: either missing → no filtered grid children painted.
    expect(
      root.querySelector('#filtered-grid')?.querySelectorAll('.piece-wrapper')
        .length ?? 0
    ).toBe(0);
  });
});

// =============================================================================
// 3. Behavioral soft-fail residuals (happy-path hosts present)
// =============================================================================

describe('q-mp-598 attribute-demo — behavioral soft-fail residuals', () => {
  it('SET incomplete selection keeps base set-result class (no valid/invalid)', () => {
    const root = mountRoot();
    renderAttributeDemo(root);
    const cards = setCardWrappers(root);
    cards[0]!.click();
    const result = root.querySelector('#set-result');
    expect(result?.classList.contains('set-result')).toBe(true);
    expect(result?.classList.contains('valid')).toBe(false);
    expect(result?.classList.contains('invalid')).toBe(false);
    cards[1]!.click();
    expect(result?.classList.contains('valid')).toBe(false);
    expect(result?.classList.contains('invalid')).toBe(false);
  });

  it('SET deselect soft-returns from verdict back to incomplete class', () => {
    const root = mountRoot();
    renderAttributeDemo(root);
    const cards = setCardWrappers(root);
    cards[0]!.click();
    cards[1]!.click();
    cards[2]!.click();
    const result = root.querySelector('#set-result');
    expect(
      result?.classList.contains('valid') ||
        result?.classList.contains('invalid')
    ).toBe(true);
    cards[0]!.click(); // deselect → size 2 soft-incomplete
    expect(result?.classList.contains('valid')).toBe(false);
    expect(result?.classList.contains('invalid')).toBe(false);
    expect(result?.className).toBe('set-result');
  });

  it('compare incomplete pair keeps placeholder chrome (structural)', () => {
    const root = mountRoot();
    renderAttributeDemo(root);
    const pieces = root.querySelectorAll('#compare-grid .piece-wrapper');
    (pieces[0] as HTMLElement).click();
    expect(
      root.querySelector('#compare-piece-1')?.classList.contains('filled')
    ).toBe(true);
    expect(
      root.querySelector('#compare-piece-2')?.classList.contains('filled')
    ).toBe(false);
    expect(root.querySelector('#comparison-results .placeholder')).toBeTruthy();
    expect(root.querySelector('#comparison-results .match-list')).toBeNull();
  });

  it('math set-switch soft-clears selection and restores info placeholder', () => {
    const root = mountRoot();
    renderAttributeDemo(root);
    // Idle mount leaves #selected-info empty (showInfo not called until click /
    // set-switch). Soft-fail residual is the null-selection restore arm.
    const piece = root.querySelector(
      '#piece-grid .piece-wrapper'
    ) as HTMLElement;
    piece.click();
    expect(root.querySelector('#selected-info .placeholder')).toBeNull();
    expect(root.querySelector('#selected-info strong')).toBeTruthy();

    (
      root.querySelector('.set-btn[data-set="math"]') as HTMLButtonElement
    ).click();
    // selectedPiece = null → soft placeholder restore via showInfo()
    expect(root.querySelector('#selected-info .placeholder')).toBeTruthy();
    expect(
      root.querySelectorAll('#piece-grid .piece-wrapper.selected')
    ).toHaveLength(0);
  });

  it('filter Any option soft-clears attr filter key back to full grid', () => {
    const root = mountRoot();
    renderAttributeDemo(root);
    const selects = [
      ...root.querySelectorAll('#filter-controls select'),
    ] as HTMLSelectElement[];
    expect(selects.length).toBeGreaterThanOrEqual(1);
    const select = selects[0]!;
    const valued = [...select.options].find((o) => o.value !== '');
    expect(valued).toBeTruthy();
    const full = root.querySelectorAll('#filtered-grid .piece-wrapper').length;
    select.value = valued!.value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    const narrowed = root.querySelectorAll(
      '#filtered-grid .piece-wrapper'
    ).length;
    expect(narrowed).toBeLessThanOrEqual(full);

    select.value = '';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    expect(root.querySelectorAll('#filtered-grid .piece-wrapper').length).toBe(
      full
    );
  });

  it('filter label soft-fallback keep-site remains displayName || name (581)', () => {
    // Runtime: BASIC_ATTRIBUTES all have displayName, so both arms are
    // structurally present via source keep-site (section 1). Here assert
    // each filter-group has a label element (no copy pin).
    const root = mountRoot();
    renderAttributeDemo(root);
    const labels = root.querySelectorAll(
      '#filter-controls .filter-group label'
    );
    expect(labels.length).toBeGreaterThanOrEqual(1);
    for (const label of labels) {
      expect((label.textContent ?? '').length).toBeGreaterThan(0);
    }
  });

  it('detached empty container remount soft-fails document hosts without throw', () => {
    const detached = document.createElement('div');
    // Markup is written into detached, but getElementById looks at document —
    // every section host is null → soft early-returns; must not throw.
    expect(() => renderAttributeDemo(detached)).not.toThrow();
    expect(detached.querySelector('h1')).toBeTruthy();
    expect(detached.querySelectorAll('.demo-section').length).toBe(4);
    expect(detached.querySelector('#piece-grid')?.children.length ?? 0).toBe(0);
    expect(detached.querySelector('#set-grid')?.children.length ?? 0).toBe(0);
  });
});
