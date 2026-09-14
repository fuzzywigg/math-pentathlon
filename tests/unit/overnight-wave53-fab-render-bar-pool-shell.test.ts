/**
 * Wave 53 leftover after #235 — Fab bar pool shell. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { renderFractionBarPool } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 53 fab — bar pool shell', () => {
  it('renders Fraction Bars header + pool/grid shells', () => {
    const el = renderFractionBarPool(createInitialState(), () => undefined);
    expect(el.classList.contains('fab-bar-pool')).toBe(true);
    expect(el.querySelector('.fab-section-header')?.textContent).toBe('Fraction Bars');
    expect(el.querySelector('.fab-bar-grid')).toBeTruthy();
  });
});
