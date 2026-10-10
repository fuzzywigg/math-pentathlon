/**
 * q-mp-674 — Close `attribute-ui` residual branches under the `*attribute-ui*`
 * verification glob (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1059` @ `70da293f`) before this suite,
 * with related `tests/unit/*attribute-ui*` (5 files):
 *   **95.31%** lines (224/235) / **90%** branches (63/70)
 *   (backlog stamp was 95.3% / 85.7% — earlier tip folds lifted branches)
 * Uncovered under that glob: shape-switch `default`→card (L74); SET shape
 *   `default`→rect (L349–353); SET shading `default` break (L403); grid
 *   mouseenter/leave bodies (L448–454). Engine r12/r19 already pin these
 *   outside the `*attribute-ui*` glob — this suite owns them inside it.
 *
 * Ownership (leave open; do not edit product / competing suites):
 *   `#1028` / q-mp-598 — attribute-demo soft-fail (**contained**)
 *   `#893` / q-mp-403 — soft-fail / empty-board residuals (**contained**)
 *   `#1025` / q-mp-571 — soft-fail residual contracts (**contained**)
 *   Tip-folded engine r12 / r19 — same arms outside this verification glob
 *   Mutation `#1032` / q-mp-569 — happy-path DEFAULT_CONFIG pins (**contained**)
 *
 * Constraints: tests only; ZERO `src/` edits; pin CURRENT chrome behavior
 * only — no AI / scoring / rules / player-facing copy / aria pins; no ratchet
 * JSON; Hex Hard 450ms untouched; no network.
 */
import { afterEach, describe, expect, it } from 'vitest';

import {
  createPieceGrid,
  renderAttributePiece,
  renderSetCard,
} from '../../src/core/attributes/attribute-ui';
import { BASIC_ATTRIBUTES, createPiece } from '../../src/core/attributes/types';

afterEach(() => {
  document.body.innerHTML = '';
  document.querySelectorAll('#attribute-styles').forEach((el) => el.remove());
});

// =============================================================================
// 1. Piece shape switch — `custom` / unknown → default card (L63/L74)
// =============================================================================

describe('q-mp-674 attribute-ui — piece shape default → card', () => {
  it('shape custom falls through to card rect chrome (no circle)', () => {
    // L63 switch default → renderCard; public union includes 'custom' with no case.
    const piece = createPiece('custom-shape', {
      shape: 'circle',
      color: 'blue',
      size: 'small',
    });
    const svg = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
      shape: 'custom',
      showLabels: false,
      pieceSize: 64,
    });
    expect(svg.classList.contains('attribute-piece')).toBe(true);
    expect(svg.dataset.pieceId).toBe('custom-shape');
    const rect = svg.querySelector('rect');
    expect(rect).toBeTruthy();
    expect(rect?.getAttribute('rx')).toBe('8');
    expect(svg.querySelector('circle')).toBeNull();
  });
});

// =============================================================================
// 2. SET shape switch — unknown → default rect (L316/L349–353)
// =============================================================================

describe('q-mp-674 attribute-ui — SET shape default → rect', () => {
  it('unknown SET shape paints a rect with solid fill/stroke', () => {
    // L348–353: shape switch default → <rect> sized from width/height.
    const svg = renderSetCard(
      createPiece('shape-x', {
        number: 1,
        shape: 'triangle',
        shading: 'solid',
        color: 'green',
      })
    );
    expect(svg.classList.contains('set-card')).toBe(true);
    expect(svg.querySelector('ellipse')).toBeNull();
    expect(svg.querySelector('polygon')).toBeNull();
    expect(svg.querySelector('path')).toBeNull();
    const shapes = [...svg.querySelectorAll('rect')];
    // Card chrome rect + shape rect.
    expect(shapes.length).toBeGreaterThanOrEqual(2);
    const shapeRect = shapes[shapes.length - 1];
    expect(shapeRect?.getAttribute('fill')).toBe('#4caf50');
    expect(shapeRect?.getAttribute('stroke')).toBe('#4caf50');
    expect(shapeRect?.getAttribute('stroke-width')).toBe('2');
    expect(shapeRect?.getAttribute('width')).toBeTruthy();
    expect(shapeRect?.getAttribute('height')).toBeTruthy();
  });
});

// =============================================================================
// 3. SET shading switch — unknown → default break (L357/L403)
// =============================================================================

describe('q-mp-674 attribute-ui — SET shading default break', () => {
  it('unknown SET shading leaves fill/stroke unset until shared stroke-width', () => {
    // L402–403: shading switch default break — no fill/stroke mutation.
    const svg = renderSetCard(
      createPiece('shade-x', {
        number: 1,
        shape: 'oval',
        shading: 'glossy',
        color: 'red',
      })
    );
    const oval = svg.querySelector('ellipse');
    expect(oval).toBeTruthy();
    expect(oval?.getAttribute('fill')).toBeNull();
    expect(oval?.getAttribute('stroke')).toBeNull();
    expect(oval?.getAttribute('stroke-width')).toBe('2');
  });
});

// =============================================================================
// 4. createPieceGrid — mouseenter / mouseleave residual bodies (L448–454)
// =============================================================================

describe('q-mp-674 attribute-ui — grid hover residual branches', () => {
  it('unselected wrapper hover paints then clears border; selected stays pinned', () => {
    // L448–449 true: unselected mouseenter → #90caf9
    // L453–454 true: unselected mouseleave → transparent
    // L448/L453 false: selected wrappers skip border mutation
    const pieces = [
      createPiece('sel', { shape: 'circle', color: 'red', size: 'small' }),
      createPiece('open', { shape: 'square', color: 'blue', size: 'large' }),
    ];
    const grid = createPieceGrid(
      pieces,
      BASIC_ATTRIBUTES,
      () => undefined,
      new Set(['sel'])
    );
    document.body.appendChild(grid);
    const wrappers = [
      ...grid.querySelectorAll('.piece-wrapper'),
    ] as HTMLElement[];
    expect(wrappers).toHaveLength(2);
    expect(wrappers[0]?.classList.contains('selected')).toBe(true);
    expect(wrappers[1]?.classList.contains('selected')).toBe(false);

    const selected = wrappers[0]!;
    const open = wrappers[1]!;
    const selectedBefore = selected.style.borderColor;

    selected.dispatchEvent(new Event('mouseenter'));
    expect(selected.style.borderColor).toBe(selectedBefore);
    selected.dispatchEvent(new Event('mouseleave'));
    expect(selected.style.borderColor).toBe(selectedBefore);

    open.dispatchEvent(new Event('mouseenter'));
    expect(open.style.borderColor).toBe('rgb(144, 202, 249)');
    open.dispatchEvent(new Event('mouseleave'));
    expect(open.style.borderColor).toBe('transparent');
  });
});
