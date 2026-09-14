/**
 * Wave 49 — Contig renderDice disabled roll leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/contig-60/board-ui';

describe('Wave 49 contig — roll button', () => {
  it('disables roll when canRoll is false', () => {
    const el = renderDice(null, () => undefined, false);
    const btn = el.querySelector('.contig-roll-btn') as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.disabled).toBe(true);
  });
});
