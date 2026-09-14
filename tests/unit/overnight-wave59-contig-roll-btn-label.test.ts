/**
 * Wave 59 Contig/SD residual — Contig Roll Dice label. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/contig-60/board-ui';

describe('Wave 59 contig — roll btn label', () => {
  it('renders exact Roll Dice label when canRoll', () => {
    const el = renderDice(null, () => undefined, true);
    const btn = el.querySelector('.contig-roll-btn') as HTMLButtonElement;
    expect(btn.textContent).toBe('Roll Dice');
    expect(btn.disabled).toBe(false);
  });
});
