/**
 * Overnight HEAVY leftover after #241 — shape selector hover chrome.
 * Distinct from wave23 click + wave52 no-flip controls. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createShapeSelector, SIMPLE_SHAPES } from '../../src/core/polyomino';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 53 core poly-ui — selector hover', () => {
  it('mouseenter paints border with shape color; mouseleave clears', () => {
    const shapes = SIMPLE_SHAPES.slice(0, 2);
    const panel = createShapeSelector(shapes, () => undefined);
    document.body.appendChild(panel);
    const option = panel.querySelector('.shape-option') as HTMLElement;
    expect(option).toBeTruthy();
    option.dispatchEvent(new Event('mouseenter'));
    expect(option.style.borderColor.replace(/\s/g, '')).toMatch(
      /rgb\(158,158,158\)|#9e9e9e/i
    );
    expect(option.style.background.replace(/\s/g, '')).toMatch(
      /rgb\(255,255,255\)|#fff/i
    );
    option.dispatchEvent(new Event('mouseleave'));
    expect(option.style.borderColor).toBe('transparent');
  });
});
