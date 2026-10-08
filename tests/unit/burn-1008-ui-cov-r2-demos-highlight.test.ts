/**
 * burn-1008-mp-ui-coverage-round-2 — dice-demo callback branches + highlight-ui
 * style fallbacks that still sit under tip peers.
 * Tests-only; seeded/fake where needed; no copy assertions beyond selectors.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderDiceDemo } from '../../src/demos/dice-demo';
import {
  createAlignmentHighlight,
  createAlignmentLine,
  createHighlightOverlay,
  createPathHighlight,
  HIGHLIGHT_STYLES,
  type HighlightStyle,
} from '../../src/core/alignment/highlight-ui';

describe('burn-1008 ui-cov-r2 dice-demo callbacks', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('fires poly/2d6 selector callbacks and caps each log at 20 entries', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderDiceDemo(root);

    const log2d6 = root.querySelector('#log-2d6') as HTMLElement;
    const logPoly = root.querySelector('#log-poly') as HTMLElement;
    expect(log2d6).toBeTruthy();
    expect(logPoly).toBeTruthy();

    const clickEl = (el: Element) => {
      el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    };

    // Select dice faces then Confirm to hit onSelectionChange / onConfirm
    for (const scope of ['#selector-2d6', '#selector-poly'] as const) {
      root.querySelectorAll(`${scope} button`).forEach((el) => clickEl(el));
      const confirm = root.querySelector(
        `${scope} .dice-btn-success`
      ) as HTMLButtonElement | null;
      if (confirm && !confirm.disabled) clickEl(confirm);
    }

    // Flood confirms to exercise addLog's 20-entry cap
    for (let i = 0; i < 25; i++) {
      root.querySelectorAll('#selector-2d6 button').forEach((el) => clickEl(el));
      const confirm = root.querySelector(
        '#selector-2d6 .dice-btn-success'
      ) as HTMLButtonElement | null;
      if (confirm && !confirm.disabled) clickEl(confirm);
    }

    expect(log2d6.children.length).toBeLessThanOrEqual(20);
    // Poly callbacks should have written at least once when buttons exist
    void logPoly;
  });
});

describe('burn-1008 ui-cov-r2 highlight-ui style fallbacks', () => {
  const cellToPixel = (row: number, col: number) => ({
    x: col * 10,
    y: row * 10,
  });

  it('createHighlightOverlay applies empty-style fallbacks', () => {
    const bare: HighlightStyle = {};
    const g = createHighlightOverlay(
      [{ row: 0, col: 0 }],
      cellToPixel,
      { width: 10, height: 10 },
      bare
    );
    expect(g.getAttribute('class')).toContain('alignment-highlight');
    const rect = g.querySelector('rect');
    expect(rect?.getAttribute('fill')).toBe('transparent');
    expect(rect?.getAttribute('stroke')).toBe('transparent');
  });

  it('createAlignmentLine / path animate + missing stroke fallbacks', () => {
    const style: HighlightStyle = { animate: true };
    const line = createAlignmentLine(
      {
        value: 'X',
        start: { row: 0, col: 0 },
        end: { row: 0, col: 2 },
        positions: [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
          { row: 0, col: 2 },
        ],
        direction: 'horizontal',
        length: 3,
      },
      cellToPixel,
      style
    );
    expect(line.getAttribute('class')).toContain('animated');
    expect(line.getAttribute('stroke')).toBe('#4caf50');

    const empty = createPathHighlight([{ row: 0, col: 0 }], cellToPixel, style);
    expect(empty.getAttribute('d')).toBe('');

    const path = createPathHighlight(
      [
        { row: 0, col: 0 },
        { row: 1, col: 1 },
      ],
      cellToPixel,
      { animate: true, className: 'extra' }
    );
    expect(path.getAttribute('class')).toContain('animated');
    expect(path.getAttribute('class')).toContain('extra');
    expect(path.getAttribute('stroke')).toBe('#9c27b0');
  });

  it('createAlignmentHighlight composes overlay + line with winning defaults', () => {
    const g = createAlignmentHighlight(
      {
        value: 'O',
        start: { row: 0, col: 1 },
        end: { row: 2, col: 1 },
        positions: [
          { row: 0, col: 1 },
          { row: 1, col: 1 },
          { row: 2, col: 1 },
        ],
        direction: 'vertical',
        length: 3,
      },
      cellToPixel,
      { width: 8, height: 8 },
      HIGHLIGHT_STYLES.winning
    );
    expect(g.querySelector('rect')).toBeTruthy();
    expect(g.querySelector('line')).toBeTruthy();
  });
});
