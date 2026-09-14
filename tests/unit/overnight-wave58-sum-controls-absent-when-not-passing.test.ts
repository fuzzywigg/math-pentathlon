/**
 * Wave 58 Contig/SD residual — Sum controls absent outside passing. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 58 sum — controls absent rolling', () => {
  it('opening rolling mount has no .sd-controls', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    newGameVsHuman(root);
    expect(root.querySelector('.sd-controls')).toBeNull();
  });
});
