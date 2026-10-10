/**
 * q-mp-654 — Close `game-selector` residual branches (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1023`): with related `*game-selector*`
 * suites, lines **100%** / branches **97.61%** (41/42). Sole residual arm is
 * L441 `DIVISIONS[0]?.name ?? ''` (empty-catalog fallback).
 *
 * Structural asserts only (classes, counts, spy args). No player-facing copy /
 * aria / label string pins. Zero `src/` edits.
 *
 * Open-PR check: leave `#932`/`454` soft-fail char + `#668` mutation-ui4
 * **contained** (no comments/labels/closes per worker brief).
 *
 * Listed in `vitest.config.ts` `isolatedFiles` for registry + prefetch mocks.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/core/game-registry', async () => {
  const actual = await vi.importActual<
    typeof import('../../src/core/game-registry')
  >('../../src/core/game-registry');
  return {
    ...actual,
    DIVISIONS: [],
    getGamesByDivision: () => [],
  };
});

vi.mock('../../src/ui/game-prefetch', () => ({
  prefetchGameChunk: vi.fn(),
  prefetchGameChunksIdle: vi.fn(),
}));

import { prefetchGameChunksIdle } from '../../src/ui/game-prefetch';
import { renderGameSelector } from '../../src/ui/game-selector';

describe('q-mp-654 game-selector — residual branches', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
    HTMLElement.prototype.scrollIntoView = vi.fn();
    vi.mocked(prefetchGameChunksIdle).mockClear();
  });

  afterEach(() => {
    root.remove();
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('idle-warm uses empty-string division when DIVISIONS[0] is absent (L441)', () => {
    // Exercises `DIVISIONS[0]?.name ?? ''` — the sole uncovered branch on tip.
    expect(() => renderGameSelector(root)).not.toThrow();

    expect(root.querySelectorAll('.game-selector').length).toBe(1);
    expect(root.querySelectorAll('.division-accordion').length).toBe(0);
    expect(root.querySelectorAll('.division-tab').length).toBe(0);

    expect(prefetchGameChunksIdle).toHaveBeenCalledTimes(1);
    const [ids, opts] = vi.mocked(prefetchGameChunksIdle).mock.calls[0]!;
    expect(ids).toEqual([]);
    expect(opts).toEqual({ max: 3 });
  });
});
