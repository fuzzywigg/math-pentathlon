/**
 * Wave 56 leftover after #256 — Handshake demos × juggle rotate × ramrod scores.
 * Avoids kings/hex/par #256 and contig #243 slices. Tests-only.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderDiceDemo } from '../../src/demos/dice-demo';
import { renderGraphDemo } from '../../src/demos/graph-demo';
import { renderAttributeDemo } from '../../src/demos/attribute-demo';
import { createInitialState as juggleInit } from '../../src/games/juggle/rules';
import { createInitialState as ramrodInit } from '../../src/games/ramrod/rules';
import { PENTOMINOES } from '../../src/core/polyomino/types';
import {
  injectJuggleStyles,
  renderShapeControls,
  renderDice,
} from '../../src/games/juggle/board-ui';
import {
  injectRamrodStyles,
  renderScores,
  renderBoard as renderRamrod,
} from '../../src/games/ramrod/board-ui';

describe('Wave 56 handshake — demos/juggle/ramrod', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('juggle-styles')?.remove();
    document.getElementById('ramrod-styles')?.remove();
    const proto = HTMLCanvasElement.prototype as unknown as {
      getContext: (typeof HTMLCanvasElement.prototype)['getContext'];
    };
    vi.spyOn(proto, 'getContext').mockReturnValue({
      fillRect: () => undefined,
      strokeRect: () => undefined,
      fillStyle: '',
      strokeStyle: '',
    } as unknown as CanvasRenderingContext2D);
  });

  it('mounts leftover demo + rotate controls + ramrod scores together', () => {
    injectJuggleStyles();
    injectRamrodStyles();
    expect(document.getElementById('juggle-styles')?.textContent).toMatch(/#ffc107/);
    expect(document.getElementById('ramrod-styles')?.textContent).toMatch(/#e8d4b8/);

    const demos = document.createElement('div');
    document.body.appendChild(demos);
    renderDiceDemo(demos);
    expect(demos.querySelector('#selector-sums')).toBeTruthy();
    renderGraphDemo(demos);
    expect(demos.querySelector('.template-btn[data-template="star"]')).toBeTruthy();
    renderAttributeDemo(demos);
    expect(demos.querySelector('.set-btn[data-set="basic"]')?.textContent).toMatch(
      /Basic/
    );

    const shape = PENTOMINOES.find((s) => s.canRotate && s.canFlip)!;
    const controls = renderShapeControls(
      {
        ...juggleInit(),
        phase: 'placing',
        selectedShape: shape,
        selectedRotation: 0,
        selectedFlipped: false,
      },
      () => undefined,
      () => undefined
    );
    expect(controls.textContent).toMatch(/↻ Rotate/);
    expect(renderDice(null, () => undefined, () => undefined, true, 'rolling').textContent).toMatch(
      /Roll Dice/
    );

    const ramrod = ramrodInit();
    expect(renderScores(ramrod).textContent).toMatch(/Goal:\s*24cm/);
    expect(renderRamrod(ramrod, () => undefined).querySelectorAll('.ramrod-box-label').length).toBe(
      ramrod.boxes.size
    );
  });
});
