/**
 * q-mp-571 — Characterize `attribute-ui` soft-fail residuals (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1012` @ `dcdc0bf47d102c480e2fff9ff2287886843f17be`):
 *   `attribute-ui.ts` **542** LOC (matches backlog stamp)
 *   Files mentioning `attribute-ui`: **37** (backlog “35 test-name matches” stale)
 *   Files importing `attributes/attribute-ui`: **31**
 *   Dedicated soft-fail residual suite before this file: **1** (`q-mp-403`)
 *   Branch coverage saturated after tip-folded engine r19 (`#1002` / `q-mp-547`)
 *     — soft-fail residual value is contract ownership, not hole-filling.
 *
 * Ownership (leave alone; do not edit product / competing suites):
 *   Tip-folded `#1002` / `q-mp-547` — SET empty-string `shape`/`color` `||`
 *     defaults + selected mouseleave guard — **do not duplicate** those pins
 *   Tip-folded `#893` / `q-mp-403` — empty-def circle/square, sparse secondary
 *     labels, number `0` / empty shading, inject after-create idempotent
 *   Tip-folded engine r12 — missing-attr `continue`, glossy shading default,
 *     `custom`→card, selected mouseenter
 *   Undrafted `q-mp-466` attributes/logic nnnull — leave **contained**
 *   Mutation `569` may share host — keep this file on soft-fail residuals only
 *
 * This suite owns soft-fail residual contracts still thin after those:
 *   source keep-sites (`||` / undefined-continue / inject skip / selected
 *     guards), absent-attr SET soft-defaults (undefined, not `''`), falsy
 *     `number: null`, claimed-id inject soft-skip, colorMap-miss raw stroke
 *     under empty/striped shading, colorMap-miss leave default fill, non-hex
 *     contrast soft-parse, primary-present/value-absent String coerce,
 *     inject reduced-motion selector keep-sites (structural; no copy pins).
 *
 * Constraints: tests only; zero `src/` edits; no nnnull ceiling write; no AI /
 * rules / scoring / copy / aria pins; Hex Hard 450ms; no network; no ratchet
 * JSON.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createPieceGrid,
  injectAttributeStyles,
  renderAttributePiece,
  renderSetCard,
} from '../../src/core/attributes/attribute-ui';
import {
  BASIC_ATTRIBUTES,
  createPiece,
  type AttributeDefinition,
} from '../../src/core/attributes/types';

const ATTRIBUTE_UI_SRC = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    '../../src/core/attributes/attribute-ui.ts'
  ),
  'utf8'
);

afterEach(() => {
  document.body.innerHTML = '';
  document.querySelectorAll('#attribute-styles').forEach((el) => el.remove());
});

// =============================================================================
// 1. Source soft-fail keep-sites
// =============================================================================

describe('q-mp-571 attribute-ui — source soft-fail keep-sites', () => {
  it('keeps definition walk undefined-continue + color/includes bg soft path', () => {
    expect(ATTRIBUTE_UI_SRC).toMatch(
      /if\s*\(\s*value\s*===\s*undefined\s*\)\s*\{\s*continue;/
    );
    expect(ATTRIBUTE_UI_SRC).toMatch(
      /def\.name\s*===\s*'color'\s*\|\|\s*def\.name\.includes\('color'\)/
    );
    expect(ATTRIBUTE_UI_SRC).toMatch(/if\s*\(\s*color\s*\)\s*\{/);
  });

  it('keeps SET || soft-default quartet + colorMap miss raw-stroke arm', () => {
    // Behavioral empty-string shape/color pins stay with tip-folded #1002 —
    // this suite only locks the source keep-sites.
    expect(ATTRIBUTE_UI_SRC).toMatch(
      /\(piece\.attributes\.number as number\)\s*\|\|\s*1/
    );
    expect(ATTRIBUTE_UI_SRC).toMatch(
      /\(piece\.attributes\.shape as string\)\s*\|\|\s*'oval'/
    );
    expect(ATTRIBUTE_UI_SRC).toMatch(
      /\(piece\.attributes\.shading as string\)\s*\|\|\s*'solid'/
    );
    expect(ATTRIBUTE_UI_SRC).toMatch(
      /\(piece\.attributes\.color as string\)\s*\|\|\s*'red'/
    );
    expect(ATTRIBUTE_UI_SRC).toMatch(/colorMap\[color\]\s*\|\|\s*color/);
  });

  it('keeps shape/shading switch defaults + inject claimed-id soft-skip', () => {
    expect(ATTRIBUTE_UI_SRC).toMatch(
      /default:\s*renderCard\(svg,\s*size,\s*bgColor/
    );
    expect(ATTRIBUTE_UI_SRC).toMatch(
      /default:\s*element\s*=\s*document\.createElementNS\([^)]*'rect'\)/
    );
    // Unknown shading: default break leaves fill/stroke unset.
    expect(ATTRIBUTE_UI_SRC).toMatch(/case 'empty': \{[\s\S]*?default:\s*break;/);
    expect(ATTRIBUTE_UI_SRC).toMatch(
      /if\s*\(\s*document\.getElementById\(styleId\)\s*\)\s*\{\s*return;/
    );
  });

  it('keeps selected mouseenter/mouseleave soft-guards (leave #1002 leave-pin)', () => {
    // Two identical `if (!selectedIds.has(piece.id))` guards — enter + leave.
    const guards = ATTRIBUTE_UI_SRC.match(
      /if\s*\(\s*!selectedIds\.has\(piece\.id\)\s*\)/g
    );
    expect(guards).not.toBeNull();
    expect(guards!.length).toBe(2);
  });
});

// =============================================================================
// 2. Absent / null SET soft-defaults (orthogonal to #1002 empty-string pins)
// =============================================================================

describe('q-mp-571 attribute-ui — absent-attr SET soft-defaults', () => {
  it('fully absent SET attrs soft-default to one solid red oval', () => {
    // Undefined attrs hit L266–269 `||` arms (not the '' pins owned by #1002).
    const svg = renderSetCard(createPiece('absent-all', {}));
    expect(svg.classList.contains('set-card')).toBe(true);
    const ovals = svg.querySelectorAll('ellipse');
    expect(ovals).toHaveLength(1);
    expect(ovals[0]?.getAttribute('fill')).toBe('#f44336');
    expect(ovals[0]?.getAttribute('stroke')).toBe('#f44336');
    expect(svg.querySelector('polygon')).toBeNull();
    expect(svg.querySelector('path')).toBeNull();
  });

  it('null number soft-defaults to a single shape (falsy || 1)', () => {
    // Orthogonal to q-mp-403's `number: 0` pin — null is also falsy.
    const svg = renderSetCard(
      createPiece('n-null', {
        number: null as unknown as number,
        shape: 'diamond',
        shading: 'solid',
        color: 'green',
      })
    );
    expect(svg.querySelectorAll('polygon')).toHaveLength(1);
    expect(svg.querySelector('polygon')?.getAttribute('fill')).toBe('#4caf50');
  });

  it('absent shading + known color still soft-defaults shading to solid', () => {
    // Omit shading key entirely (403 pins shading: '').
    const svg = renderSetCard(
      createPiece('shade-absent', {
        number: 1,
        shape: 'oval',
        color: 'purple',
      })
    );
    const oval = svg.querySelector('ellipse');
    expect(oval?.getAttribute('fill')).toBe('#9c27b0');
    expect(oval?.getAttribute('stroke')).toBe('#9c27b0');
  });
});

// =============================================================================
// 3. colorMap miss / contrast / primary-value soft-fails
// =============================================================================

describe('q-mp-571 attribute-ui — colorMap miss + contrast soft-fails', () => {
  it('unknown SET color under empty shading uses raw stroke (colorMap || color)', () => {
    const svg = renderSetCard(
      createPiece('raw-empty', {
        number: 1,
        shape: 'oval',
        shading: 'empty',
        color: '#abcdef',
      })
    );
    const oval = svg.querySelector('ellipse');
    expect(oval?.getAttribute('fill')).toBe('none');
    expect(oval?.getAttribute('stroke')).toBe('#abcdef');
  });

  it('unknown SET color under striped shading paints pattern stroke with raw color', () => {
    const svg = renderSetCard(
      createPiece('raw-striped', {
        number: 1,
        shape: 'diamond',
        shading: 'striped',
        color: '#112233',
      })
    );
    const diamond = svg.querySelector('polygon');
    expect(diamond?.getAttribute('stroke')).toBe('#112233');
    expect(diamond?.getAttribute('fill')?.startsWith('url(#')).toBe(true);
    const line = svg.querySelector('pattern line');
    expect(line?.getAttribute('stroke')).toBe('#112233');
  });

  it('definition without colorMap leaves default bg fill (if (color) false)', () => {
    const defs: AttributeDefinition[] = [
      {
        name: 'color',
        possibleValues: ['red', 'blue'],
        // intentionally omit colorMap → getAttributeColor returns undefined
      },
    ];
    const svg = renderAttributePiece(
      createPiece('no-map', { color: 'red' }),
      defs,
      { shape: 'card', showLabels: false, pieceSize: 40 }
    );
    expect(svg.querySelector('rect')?.getAttribute('fill')).toBe('#e0e0e0');
  });

  it('non-hex card bg soft-parses contrast to light text fill', () => {
    // getContrastColor substr parse → NaN luminance → NaN > 0.5 is false → #fff
    const defs: AttributeDefinition[] = [
      {
        name: 'color',
        possibleValues: ['orange'],
        colorMap: { orange: 'orange' },
      },
    ];
    const svg = renderAttributePiece(
      createPiece('nonhex', { color: 'orange' }),
      defs,
      { shape: 'card', showLabels: false, pieceSize: 48 }
    );
    expect(svg.querySelector('rect')?.getAttribute('fill')).toBe('orange');
    expect(svg.querySelector('text')?.getAttribute('fill')).toBe('#fff');
  });

  it('primary def present with missing piece value still mounts String(undefined) text node', () => {
    // Soft coerce — structural presence only; do not pin player-facing copy body.
    const defs: AttributeDefinition[] = [
      {
        name: 'shape',
        possibleValues: ['circle', 'square'],
      },
    ];
    const svg = renderAttributePiece(
      createPiece('no-val', { color: 'red' }), // shape key absent
      defs,
      { shape: 'card', showLabels: false, pieceSize: 40 }
    );
    const text = svg.querySelector('text');
    expect(text).toBeTruthy();
    expect(typeof text?.textContent).toBe('string');
    expect(text?.textContent?.length).toBeGreaterThan(0);
  });
});

// =============================================================================
// 4. Inject claimed-id + reduced-motion keep-sites
// =============================================================================

describe('q-mp-571 attribute-ui — inject claimed-id + motion keep-sites', () => {
  it('pre-seeded empty style id soft-skips append (claimed-id residual)', () => {
    // Orthogonal to q-mp-403 (which injects first, then re-calls).
    const claimed = document.createElement('style');
    claimed.id = 'attribute-styles';
    claimed.textContent = '/* claimed */';
    document.head.appendChild(claimed);

    injectAttributeStyles();
    expect(document.querySelectorAll('#attribute-styles')).toHaveLength(1);
    expect(document.getElementById('attribute-styles')).toBe(claimed);
    expect(claimed.textContent).toBe('/* claimed */');
  });

  it('inject CSS keeps reduced-motion selector keep-sites (structural)', () => {
    injectAttributeStyles();
    const css = document.getElementById('attribute-styles')?.textContent ?? '';
    // Selector / media presence only — no player-facing copy / aria pins.
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain("html[data-reduced-motion='true']");
    expect(css).toContain('.piece-wrapper.highlight .attribute-piece');
    expect(css).toContain('animation: none');
  });
});

// =============================================================================
// 5. Grid shell residuals still thin after 403 / r12 / r19
// =============================================================================

describe('q-mp-571 attribute-ui — grid shell soft-fail residuals', () => {
  it('empty selectedIds default still mounts unselected transparent borders', () => {
    const pieces = [
      createPiece('a', { shape: 'circle', color: 'red', size: 'small' }),
    ];
    // Omit selectedIds arg → default `new Set()` soft shell.
    const grid = createPieceGrid(pieces, BASIC_ATTRIBUTES, () => undefined);
    const wrapper = grid.querySelector('.piece-wrapper') as HTMLElement;
    expect(wrapper).toBeTruthy();
    expect(wrapper.classList.contains('selected')).toBe(false);
    expect(wrapper.style.borderColor).toBe('transparent');
  });

  it('square below-labels with empty attributes yields empty label text soft-fail', () => {
    const svg = renderAttributePiece(createPiece('empty-attrs', {}), [], {
      shape: 'square',
      showLabels: true,
      labelPosition: 'below',
      pieceSize: 48,
    });
    expect(svg.querySelector('rect')).toBeTruthy();
    // No primary def → no center text; below label still mounts with ''.
    expect(svg.querySelectorAll('text')).toHaveLength(1);
    expect(svg.querySelector('text')?.textContent).toBe('');
  });
});
