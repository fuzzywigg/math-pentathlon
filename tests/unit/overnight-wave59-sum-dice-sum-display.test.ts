/**
 * Wave 59 Contig/SD residual — Sum dice sum display chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 59 sum — dice sum display', () => {
  it('shows = N for rolled faces', () => {
    const el = renderDice([4, 5], () => undefined, false);
    expect(el.querySelector('.sd-dice-sum')?.textContent).toBe('= 9');
  });
});
