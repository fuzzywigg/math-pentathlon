/**
 * Wave 59 leftover after #281 — Sum dice = N exact + vertical flex CSS body.
 * Distinct from wave58 role=grid leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectSDStyles, renderDice } from '../../src/games/sum-dominoes/board-ui';

beforeEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 59 sum — dice sum + vertical CSS', () => {
  it('rolled [3,4] shows = 7; inject locks flex-direction column body', () => {
    const el = renderDice([3, 4], () => undefined, false);
    expect(el.querySelector('.sd-dice-sum')?.textContent).toBe('= 7');
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-domino-vertical\s*\{[^}]*flex-direction:\s*column/s);
  });
});
