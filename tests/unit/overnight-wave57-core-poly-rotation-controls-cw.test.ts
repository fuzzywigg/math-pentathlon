/**
 * Overnight HEAVY leftover after #264 — createRotationControls CW click fires.
 * Distinct from wave52 noflip button count. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { createRotationControls } from '../../src/core/polyomino';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 57 core poly-ui — rotation controls CW', () => {
  it('clockwise button invokes onRotate with cw', () => {
    const onRotate = vi.fn();
    const onFlip = vi.fn();
    const el = createRotationControls(onRotate, onFlip, false);
    document.body.appendChild(el);
    const cw = [...el.querySelectorAll('button')].find(
      (b) => b.title === 'Rotate clockwise'
    )!;
    cw.click();
    expect(onRotate).toHaveBeenCalledWith('cw');
    expect(onFlip).not.toHaveBeenCalled();
  });
});
