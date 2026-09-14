/**
 * Overnight HEAVY leftover after #274 — Flip button when canFlip true.
 * Distinct from wave57 CW; wave52 noflip count. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { createRotationControls } from '../../src/core/polyomino';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 58 core poly-ui — rotation controls flip', () => {
  it('flip button invokes onFlip when canFlip', () => {
    const onRotate = vi.fn();
    const onFlip = vi.fn();
    const el = createRotationControls(onRotate, onFlip, true);
    document.body.appendChild(el);
    expect(el.querySelectorAll('button')).toHaveLength(3);
    const flip = [...el.querySelectorAll('button')].find(
      (b) => b.title === 'Flip horizontally'
    )!;
    flip.click();
    expect(onFlip).toHaveBeenCalledOnce();
    expect(onRotate).not.toHaveBeenCalled();
  });
});
