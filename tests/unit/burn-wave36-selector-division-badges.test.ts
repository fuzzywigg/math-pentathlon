/**
 * Wave 36 — division game-count badges + difficulty class matrix.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { renderGameSelector } from '../../src/ui/game-selector';
import {
  DIVISIONS,
  getGamesByDivision,
  getGameById,
} from '../../src/core/game-registry';

describe('Wave 36 selector — badges vs registry', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
    renderGameSelector(root);
  });

  afterEach(() => {
    root.remove();
  });

  it('each division-game-count matches getGamesByDivision length', () => {
    const counts = [...root.querySelectorAll('.division-game-count')];
    expect(counts.length).toBe(DIVISIONS.length);
    counts.forEach((el, i) => {
      const n = getGamesByDivision(DIVISIONS[i].name).length;
      expect(el.textContent).toMatch(new RegExp(`${n}`));
    });
  });

  it('sampled cards use difficulty-* class matching registry', () => {
    for (const id of ['hex', 'calla', 'kings-quadraphages']) {
      const game = getGameById(id);
      expect(game).toBeTruthy();
      const card = [...root.querySelectorAll('.game-card')].find((c) =>
        c.textContent?.includes(game!.name)
      ) as HTMLElement;
      expect(card).toBeTruthy();
      const diff = card.querySelector('.game-card-difficulty') as HTMLElement;
      expect(diff.className).toContain(`difficulty-${game!.difficulty}`);
    }
  });
});
