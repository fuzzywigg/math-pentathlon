/**
 * Hermetic coverage for offline probe board / recovery predicates
 * (q-mp-1295 / q-mp-1296). Pure module import — unit-shared (jsdom).
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  isOfflineProbeMountOk,
  OFFLINE_PROBE_CALLA_MOUNT,
  OFFLINE_PROBE_HAG_MOUNT,
  OFFLINE_PROBE_HEX_MOUNT,
  OFFLINE_PROBE_LOAD_ERROR,
  OFFLINE_PROBE_PENT_MOUNT,
} from '../../scripts/lib/offline-probe-board.mjs';

const PROBE_SRC = readFileSync(
  resolve(process.cwd(), 'scripts/probe-offline-resilience.mjs'),
  'utf8'
);

describe('isOfflineProbeMountOk (q-mp-1295 / q-mp-1296)', () => {
  it('accepts game-specific mount with no load-error', () => {
    expect(isOfflineProbeMountOk({ mountCount: 1, loadErrorCount: 0 })).toBe(
      true
    );
    expect(isOfflineProbeMountOk({ mountCount: 2, loadErrorCount: 0 })).toBe(
      true
    );
  });

  it('rejects load-error even when a mount count is present', () => {
    expect(isOfflineProbeMountOk({ mountCount: 1, loadErrorCount: 1 })).toBe(
      false
    );
  });

  it('rejects shell-only / zero mounts (no game mount)', () => {
    expect(isOfflineProbeMountOk({ mountCount: 0, loadErrorCount: 0 })).toBe(
      false
    );
    expect(isOfflineProbeMountOk({ mountCount: 0, loadErrorCount: 1 })).toBe(
      false
    );
  });

  it('rejects non-finite counts', () => {
    expect(isOfflineProbeMountOk({ mountCount: NaN, loadErrorCount: 0 })).toBe(
      false
    );
    expect(
      isOfflineProbeMountOk({ mountCount: 1, loadErrorCount: undefined })
    ).toBe(false);
    expect(isOfflineProbeMountOk({})).toBe(false);
  });
});

describe('offline probe mount selectors (q-mp-1295 / q-mp-1296)', () => {
  it('exposes game-specific mounts without shell #board / h1', () => {
    expect(OFFLINE_PROBE_HEX_MOUNT).toBe('.hex-board');
    expect(OFFLINE_PROBE_PENT_MOUNT).toBe('.pent-board');
    expect(OFFLINE_PROBE_HAG_MOUNT).toBe(
      '.hex-a-gone-board, canvas[data-mp3d]'
    );
    expect(OFFLINE_PROBE_CALLA_MOUNT).toBe('.calla-wrapper, .calla-pit');
    expect(OFFLINE_PROBE_LOAD_ERROR).toBe('[data-testid="game-load-error"]');
    for (const sel of [
      OFFLINE_PROBE_HEX_MOUNT,
      OFFLINE_PROBE_PENT_MOUNT,
      OFFLINE_PROBE_HAG_MOUNT,
      OFFLINE_PROBE_CALLA_MOUNT,
    ]) {
      expect(sel).not.toMatch(/#board|\bh1\b/);
    }
  });

  it('wires prod probe board-ok / recovered through isOfflineProbeMountOk', () => {
    expect(PROBE_SRC).toMatch(/offline-probe-board\.mjs/);
    expect(PROBE_SRC).toMatch(/isOfflineProbeMountOk/);
    expect(PROBE_SRC).toMatch(/OFFLINE_PROBE_HEX_MOUNT/);
    expect(PROBE_SRC).toMatch(/OFFLINE_PROBE_PENT_MOUNT/);
    expect(PROBE_SRC).toMatch(/OFFLINE_PROBE_HAG_MOUNT/);
    expect(PROBE_SRC).toMatch(/OFFLINE_PROBE_CALLA_MOUNT/);
    // Board-ok predicates must not count shell chrome as mounts.
    expect(PROBE_SRC).not.toMatch(/locator\('\.hex-board, #board'\)/);
    expect(PROBE_SRC).not.toMatch(/locator\('\.pent-board, #board, h1'\)/);
    expect(PROBE_SRC).not.toMatch(
      /locator\('\.hex-a-gone-board, #board, canvas\[data-mp3d\]'\)/
    );
    expect(PROBE_SRC).not.toMatch(
      /locator\('\.calla-wrapper, \.calla-pit, #board'\)/
    );
  });
});
