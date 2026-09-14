/**
 * Wave 56 leftover after #243 — Sum Dominoes die pip count residual.
 * Sum label covered in wave49; per-face pip nodes were not. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 56 sum — die pip count', () => {
  it('renders 5 and 1 .sd-die-pip nodes for faces [5,1]', () => {
    const el = renderDice([5, 1], () => undefined, false);
    const dies = el.querySelectorAll('.sd-die');
    expect(dies.length).toBe(2);
    expect(dies[0]!.querySelectorAll('.sd-die-pip').length).toBe(5);
    expect(dies[1]!.querySelectorAll('.sd-die-pip').length).toBe(1);
  });
});
