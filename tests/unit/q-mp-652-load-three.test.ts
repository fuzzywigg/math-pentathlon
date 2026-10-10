/**
 * q-mp-652 — Raise `load-three` coverage from 0% lines (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1023` @ tip head):
 * `src/ui/three/load-three.ts` — **0%** lines (0/1) under the `*load-three*`
 * verification glob (no dedicated suite; uncovered executable L8).
 *
 * Mocks the dynamic `import('three')` — no real Three.js / network / board-3d
 * product edits. Structural asserts only. No AI / rules / scoring / legal-move
 * changes. Hex Hard 450ms untouched. No ratchet JSON. Zero `src/` edits.
 *
 * Open-draft check: no PR into `cursor/mp-tip-post1023` or
 * `cursor/mp-tip-post1012` owns a `*load-three*` suite. Leave
 * `burn-1008-ui-cov-r2-shell-helpers` characterization open (**contained** —
 * not under the `*load-three*` verification glob).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

// Factory must be self-contained: vi.mock is hoisted above imports/consts.
vi.mock('three', () => ({
  REVISION: 'q-mp-652-mock-three',
}));

describe('q-mp-652 load-three — mocked dynamic import', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it('loadThree resolves the mocked three module (covers L8)', async () => {
    const { loadThree } = await import('../../src/ui/three/load-three');
    const three = await loadThree();
    expect(three).toBeTruthy();
    expect(typeof three).toBe('object');
    expect(three).toMatchObject({ REVISION: 'q-mp-652-mock-three' });
  });

  it('loadThree returns a Promise that settles to the same module shape', async () => {
    const { loadThree } = await import('../../src/ui/three/load-three');
    const pending = loadThree();
    expect(pending).toBeInstanceOf(Promise);
    await expect(pending).resolves.toMatchObject({
      REVISION: 'q-mp-652-mock-three',
    });
  });
});
