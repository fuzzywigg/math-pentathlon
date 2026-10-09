/**
 * burn-1008-mp-ui-coverage-round-3 — tutorial Escape-when-inactive + demo
 * residual branches (expression/graph/polyomino/fraction/attribute).
 * Tests-only; pins current behavior; no new copy assertions.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TutorialManager } from '../../src/core/tutorial';
import { renderExpressionDemo } from '../../src/demos/expression-demo';
import { renderGraphDemo } from '../../src/demos/graph-demo';
import { renderPolyominoDemo } from '../../src/demos/polyomino-demo';
import { renderFractionDemo } from '../../src/demos/fraction-demo';
import { renderAttributeDemo } from '../../src/demos/attribute-demo';

describe('burn-1008 ui-cov-r3 tutorial inactive Escape', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    // Ensure any leftover overlay is gone
    document.querySelectorAll('.tutorial-overlay, .tutorial-tooltip').forEach((el) => {
      el.remove();
    });
  });

  it('Escape is ignored while tutorial is inactive; starts and exits cleanly', () => {
    const mgr = new TutorialManager();
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    expect(mgr.getIsActive()).toBe(false);

    const host = document.createElement('div');
    host.id = 'r3-tutorial-host';
    document.body.appendChild(host);
    mgr.start({
      id: 'r3-cov',
      name: 'R3 coverage',
      steps: [
        {
          id: 's1',
          title: 'One',
          message: 'Step one',
          target: '#r3-tutorial-host',
          position: 'center',
        },
      ],
    });
    expect(mgr.getIsActive()).toBe(true);
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    expect(mgr.getIsActive()).toBe(false);
  });
});

describe('burn-1008 ui-cov-r3 demos residual', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('expression demo mounts and exposes calculator controls', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderExpressionDemo(root);
    expect(root.querySelector('button')).toBeTruthy();
  });

  it('graph demo mounts interactive board section', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderGraphDemo(root);
    expect(root.querySelector('svg, .graph-container, canvas')).toBeTruthy();
  });

  it('polyomino demo mounts board or shape chrome', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderPolyominoDemo(root);
    expect(root.querySelector('svg, button')).toBeTruthy();
  });

  it('fraction demo mounts comparison / bar controls', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderFractionDemo(root);
    expect(root.querySelector('button, svg')).toBeTruthy();
  });

  it('attribute demo mounts attribute controls', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderAttributeDemo(root);
    expect(root.querySelector('button, select, svg')).toBeTruthy();
  });
});
