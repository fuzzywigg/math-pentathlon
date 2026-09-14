/**
 * Overnight HEAVY leftover after #234 — createRotationControls omits Flip when canFlip false.
 * Distinct from burn-wave40-poly-ui-selector-rotate-drag. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createRotationControls } from '../../src/core/polyomino';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 52 core poly-ui — noflip controls', () => {
  it('canFlip false → exactly 2 rotate buttons; no Flip title', () => {
    const el = createRotationControls(
      () => {},
      () => {},
      false
    );
    const btns = el.querySelectorAll('button');
    expect(btns).toHaveLength(2);
    expect([...btns].map((b) => b.title).join('|')).not.toMatch(/Flip/i);
  });

  it('canFlip true → Flip button present', () => {
    const el = createRotationControls(
      () => {},
      () => {},
      true
    );
    expect(el.querySelectorAll('button')).toHaveLength(3);
    expect([...el.querySelectorAll('button')].some((b) => /Flip/i.test(b.title))).toBe(
      true
    );
  });
});
