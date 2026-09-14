/**
 * Wave 48 overnight — Calla valid pit click/keyboard activate. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 48 calla overnight — pit activate keys', () => {
  it('valid pit click invokes callback', () => {
    const onPit = vi.fn();
    const container = document.createElement('div');
    renderBoard(createInitialState(), container, onPit);
    const valid = container.querySelector('.calla-pit-valid') as SVGElement;
    expect(valid).not.toBeNull();
    valid.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onPit).toHaveBeenCalled();
  });

  it('Enter on valid pit activates via keyboard binding', () => {
    const onPit = vi.fn();
    const container = document.createElement('div');
    renderBoard(createInitialState(), container, onPit);
    const valid = container.querySelector('.calla-pit-valid') as SVGElement;
    valid.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(onPit).toHaveBeenCalled();
  });
});
