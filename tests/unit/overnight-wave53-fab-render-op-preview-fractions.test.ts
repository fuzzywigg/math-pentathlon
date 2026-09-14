/**
 * Wave 53 leftover after #235 — Fab op preview fractions. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectBar1, selectBar2 } from '../../src/games/fab-a-diffy/rules';
import { renderOperationSelector } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 53 fab — op preview', () => {
  it('shows fraction / placeholder / equals / result chrome', () => {
    const base = createInitialState();
    const [a, b] = [...base.fractionBars.keys()];
    const state = selectBar2(selectBar1(base, a), b);
    const el = renderOperationSelector(state, () => undefined);
    const preview = el.querySelector('.fab-operation-preview');
    expect(preview).toBeTruthy();
    expect(preview?.querySelectorAll('.fab-fraction').length).toBe(2);
    expect(preview?.querySelector('.fab-op-placeholder')?.textContent).toBe('?');
    expect(preview?.querySelector('.fab-equals')?.textContent).toBe('=');
    expect(preview?.querySelector('.fab-result')?.textContent).toBe('?');
  });
});
