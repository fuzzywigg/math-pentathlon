/**
 * Overnight HEAVY leftover after #274 — createRotationControls CCW click fires.
 * Distinct from wave57 CW-only leftover. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { createRotationControls } from '../../src/core/polyomino';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 58 core poly-ui — rotation controls CCW', () => {
  it('counter-clockwise button invokes onRotate with ccw', () => {
    const onRotate = vi.fn();
    const onFlip = vi.fn();
    const el = createRotationControls(onRotate, onFlip, false);
    document.body.appendChild(el);
    const ccw = [...el.querySelectorAll('button')].find(
      (b) => b.title === 'Rotate counter-clockwise'
    )!;
    ccw.click();
    expect(onRotate).toHaveBeenCalledWith('ccw');
    expect(onFlip).not.toHaveBeenCalled();
  });
});
