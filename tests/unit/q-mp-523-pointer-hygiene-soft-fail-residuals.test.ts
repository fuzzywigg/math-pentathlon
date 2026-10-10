/**
 * q-mp-523 — Characterize `pointer-hygiene` soft-fail residuals (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post949` @ `8698fffb`):
 * - `src/ui/pointer-hygiene.ts` **326** LOC (matches backlog)
 * - Dedicated `*pointer-hygiene*` suites before this file: **4**
 *   (`pointer-hygiene`, `q-mp-278`, `mutation-ui2`, `mutation-ui13`)
 * - Void residual already cleared via tip `#901`/`423` path
 * - Soft-fail keep-sites: two empty `catch` arms around
 *   `setPointerCapture` (down) and `releasePointerCapture` (cancel)
 * - Prior suites cover release-throw swallow (`q-mp-278`) and
 *   `capture:false` skip (`burn-1008`); **setPointerCapture throw** and
 *   **hasPointerCapture throw → release catch** remain thin
 *
 * Ownership (leave alone; do not edit product / competing suites):
 * - `#901` / q-mp-423 void brace — leave open (**contained**)
 * - `#896` / q-mp-402 mutation UI w13 — leave open (**contained**)
 * - Mutation `q-mp-527` may share host — keep this file on soft-fail /
 *   catch arms only (no general gesture / mutation score pins)
 *
 * Constraints: tests only; no `src/` / AI / scoring / rules / legal-move /
 * copy / aria edits; Hex Hard 450ms untouched; no network; no ratchet JSON.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { bindCanvasPointerTap } from '../../src/ui/pointer-hygiene';

const POINTER_HYGIENE_SRC = readFileSync(
  resolve(process.cwd(), 'src/ui/pointer-hygiene.ts'),
  'utf8'
);

function pointer(
  type: string,
  init: Partial<PointerEventInit> & { pointerId?: number } = {}
): PointerEvent {
  const pointerId = init.pointerId ?? 1;
  return new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerId,
    pointerType: 'touch',
    isPrimary: true,
    button: 0,
    buttons: type === 'pointerup' || type === 'pointercancel' ? 0 : 1,
    clientX: 0,
    clientY: 0,
    ...init,
  });
}

describe('q-mp-523 pointer-hygiene — source soft-fail keep-sites', () => {
  it('keeps setPointerCapture try/catch soft-fail on pointerdown', () => {
    expect(POINTER_HYGIENE_SRC).toMatch(
      /try\s*\{\s*canvas\.setPointerCapture\(e\.pointerId\);\s*\}\s*catch\s*\{/
    );
    expect(POINTER_HYGIENE_SRC).toMatch(
      /\/\/ Pointer may already be gone\./
    );
  });

  it('keeps releasePointerCapture try/catch soft-fail on pointercancel', () => {
    expect(POINTER_HYGIENE_SRC).toMatch(
      /canvas\.hasPointerCapture\?\.?\(id\)/
    );
    expect(POINTER_HYGIENE_SRC).toMatch(
      /canvas\.releasePointerCapture\(id\)/
    );
    expect(POINTER_HYGIENE_SRC).toMatch(
      /releasePointerCapture\(id\);\s*\}\s*\}\s*catch\s*\{/
    );
  });

  it('keeps exactly two empty catch soft-fail arms in bindCanvasPointerTap', () => {
    const catchBlocks = POINTER_HYGIENE_SRC.match(/catch\s*\{[^}]*\}/g) ?? [];
    expect(catchBlocks).toHaveLength(2);
    for (const block of catchBlocks) {
      // Empty catch bodies (comment-only) — soft-fail swallow, no rethrow.
      expect(block).not.toMatch(/throw\b/);
      expect(block).not.toMatch(/console\./);
    }
  });
});

describe('q-mp-523 pointer-hygiene — setPointerCapture catch soft-fail', () => {
  let canvas: HTMLDivElement;

  beforeEach(() => {
    canvas = document.createElement('div');
    document.body.appendChild(canvas);
  });

  afterEach(() => {
    canvas.remove();
    vi.restoreAllMocks();
  });

  it('swallows setPointerCapture throw and still activates on matching up', () => {
    canvas.setPointerCapture = vi.fn(() => {
      throw new Error('q-mp-523 pointer already gone');
    });
    canvas.releasePointerCapture = vi.fn();
    canvas.hasPointerCapture = vi.fn(() => false);

    const onTap = vi.fn();
    const onGestureEnd = vi.fn();
    const unbind = bindCanvasPointerTap(canvas, { onTap, onGestureEnd });

    expect(() => {
      canvas.dispatchEvent(pointer('pointerdown', { pointerId: 7 }));
    }).not.toThrow();
    expect(canvas.setPointerCapture).toHaveBeenCalledWith(7);

    canvas.dispatchEvent(pointer('pointerup', { pointerId: 7 }));
    expect(onTap).toHaveBeenCalledTimes(1);
    expect(onGestureEnd).not.toHaveBeenCalled();

    unbind();
  });

  it('setPointerCapture throw does not strand cancel / gesture-end path', () => {
    canvas.setPointerCapture = vi.fn(() => {
      throw new Error('q-mp-523 capture lost');
    });
    canvas.releasePointerCapture = vi.fn();
    canvas.hasPointerCapture = vi.fn(() => false);

    const onTap = vi.fn();
    const onGestureEnd = vi.fn();
    const unbind = bindCanvasPointerTap(canvas, { onTap, onGestureEnd });

    expect(() => {
      canvas.dispatchEvent(pointer('pointerdown', { pointerId: 8 }));
    }).not.toThrow();
    expect(() => {
      canvas.dispatchEvent(pointer('pointercancel', { pointerId: 8 }));
    }).not.toThrow();
    expect(onTap).not.toHaveBeenCalled();
    expect(onGestureEnd).toHaveBeenCalledTimes(1);

    unbind();
  });
});

describe('q-mp-523 pointer-hygiene — releasePointerCapture catch soft-fail', () => {
  let canvas: HTMLDivElement;

  beforeEach(() => {
    canvas = document.createElement('div');
    document.body.appendChild(canvas);
  });

  afterEach(() => {
    canvas.remove();
    vi.restoreAllMocks();
  });

  it('swallows releasePointerCapture throw and still fires onGestureEnd', () => {
    canvas.setPointerCapture = vi.fn();
    canvas.releasePointerCapture = vi.fn(() => {
      throw new Error('q-mp-523 already released');
    });
    canvas.hasPointerCapture = vi.fn(() => true);

    const onTap = vi.fn();
    const onGestureEnd = vi.fn();
    const unbind = bindCanvasPointerTap(canvas, { onTap, onGestureEnd });

    canvas.dispatchEvent(pointer('pointerdown', { pointerId: 11 }));
    expect(() => {
      canvas.dispatchEvent(pointer('pointercancel', { pointerId: 11 }));
    }).not.toThrow();
    expect(canvas.releasePointerCapture).toHaveBeenCalledWith(11);
    expect(onGestureEnd).toHaveBeenCalledTimes(1);
    expect(onTap).not.toHaveBeenCalled();

    unbind();
  });

  it('swallows hasPointerCapture throw inside release try/catch soft-fail', () => {
    canvas.setPointerCapture = vi.fn();
    canvas.releasePointerCapture = vi.fn();
    canvas.hasPointerCapture = vi.fn(() => {
      throw new Error('q-mp-523 hasPointerCapture unavailable');
    });

    const onTap = vi.fn();
    const onGestureEnd = vi.fn();
    const unbind = bindCanvasPointerTap(canvas, { onTap, onGestureEnd });

    canvas.dispatchEvent(pointer('pointerdown', { pointerId: 12 }));
    expect(() => {
      canvas.dispatchEvent(pointer('pointercancel', { pointerId: 12 }));
    }).not.toThrow();
    // Throw happens before releasePointerCapture — soft-fail must not escape.
    expect(canvas.releasePointerCapture).not.toHaveBeenCalled();
    expect(onGestureEnd).toHaveBeenCalledTimes(1);
    expect(onTap).not.toHaveBeenCalled();

    unbind();
  });

  it('cancel with no tracked id skips release try and still soft-ends', () => {
    canvas.setPointerCapture = vi.fn();
    canvas.releasePointerCapture = vi.fn(() => {
      throw new Error('q-mp-523 should not release');
    });
    canvas.hasPointerCapture = vi.fn(() => true);

    const onGestureEnd = vi.fn();
    const unbind = bindCanvasPointerTap(canvas, {
      onTap: vi.fn(),
      onGestureEnd,
    });

    // No prior down → pointerId null → release try skipped.
    expect(() => {
      canvas.dispatchEvent(pointer('pointercancel', { pointerId: 99 }));
    }).not.toThrow();
    expect(canvas.releasePointerCapture).not.toHaveBeenCalled();
    expect(onGestureEnd).toHaveBeenCalledTimes(1);

    unbind();
  });
});
