/**
 * Wave 59 leftover after #276 — kings × hex × hexagone residual chrome handshake. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';
import { hexTutorial } from '../../src/games/hex/tutorial';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard as renderKingsRenderer } from '../../src/games/kings-quadraphages/board-renderer';
import { createInitialState as hexInit } from '../../src/games/hex/types';
import { renderBoard as renderHex } from '../../src/games/hex/board-ui';
import { createInitialState as hexagoneInit } from '../../src/games/hex-a-gone/types';
import { selectBlock } from '../../src/games/hex-a-gone/rules';
import { renderBoard as renderHexagone } from '../../src/games/hex-a-gone/board-ui';
import { injectPar55Styles } from '../../src/games/par-55/board-ui';

describe('Wave 59 handshake — kings/hex leftovers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('par55-styles')?.remove();
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  });

  afterEach(() => {
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
    document.getElementById('par55-styles')?.remove();
  });

  it('residual tutorial + renderer + edges + confirm3 + par hover mount', () => {
    expect(
      kingsQuadraphagesTutorial.steps.find((s) => s.id === 'select-king')?.title
    ).toBe('Step 1: Select Your King');
    expect(hexTutorial.steps.find((s) => s.id === 'complete')?.title).toBe(
      'Ready to Play!'
    );
    expect(
      hexAGoneTutorial.steps.find((s) => s.id === 'shapes-intro')?.message
    ).toMatch(/Red Trapezoids/);

    renderKingsRenderer(createInitialBoard());
    const kingsCss =
      document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(kingsCss).toContain('#daa520');
    expect(kingsCss).toContain('width: 450px');

    const hexEl = document.createElement('div');
    renderHex(hexInit(5), hexEl);
    expect(hexEl.querySelectorAll('.hex-edges')).toHaveLength(1);

    let gone = selectBlock(hexagoneInit(), 'triangle');
    gone = selectBlock(gone, 'square');
    gone = selectBlock(gone, 'rhombus');
    const goneEl = document.createElement('div');
    renderHexagone(gone, goneEl, undefined, undefined, () => {});
    expect(goneEl.querySelector('.hex-a-gone-confirm-btn')?.textContent).toBe(
      'Confirm (3 blocks)'
    );

    injectPar55Styles();
    expect(document.getElementById('par55-styles')?.textContent ?? '').toMatch(
      /\.par55-valid-base:hover/
    );
  });
});
