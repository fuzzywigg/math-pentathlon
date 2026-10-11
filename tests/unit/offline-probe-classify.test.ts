/**
 * Hermetic classify coverage for offline resilience probes (q-mp-1251 + q-mp-1252).
 * Pure module import — runs under unit-shared (jsdom) without vitest.config edits.
 */
import { describe, expect, it } from 'vitest';
import {
  classifyOfflineProbeUrl,
  isOfflineProbeLazyGameChunk,
} from '../../scripts/lib/offline-probe-classify.mjs';

describe('classifyOfflineProbeUrl (q-mp-1251 / q-mp-1252)', () => {
  it('buckets Vite game-<id>-*.js chunks as lazy-game-chunk (prod + dev)', () => {
    const urls = [
      'http://x/assets/game-hex-Ba7.js',
      'http://x/assets/game-calla-Xx1.js',
      'http://x/assets/game-hex-a-gone-DWW_girN.js',
      'http://x/assets/game-routes-abc123.js',
    ];
    for (const url of urls) {
      expect(classifyOfflineProbeUrl(url, { mode: 'prod' })).toBe(
        'lazy-game-chunk'
      );
      expect(classifyOfflineProbeUrl(url, { mode: 'dev' })).toBe(
        'lazy-game-chunk'
      );
      expect(isOfflineProbeLazyGameChunk(url)).toBe(true);
    }
  });

  it('aligns prod and dev on *.worker* URLs', () => {
    const worker = 'http://x/assets/hex-ai.worker-Ab.js';
    expect(classifyOfflineProbeUrl(worker, { mode: 'prod' })).toBe(
      'lazy-game-chunk'
    );
    expect(classifyOfflineProbeUrl(worker, { mode: 'dev' })).toBe(
      'lazy-game-chunk'
    );
  });

  it('keeps menu/vendor js and game-controller /games/ paths', () => {
    expect(
      classifyOfflineProbeUrl('http://x/assets/index-abc.js', { mode: 'prod' })
    ).toBe('js');
    expect(
      classifyOfflineProbeUrl('http://x/assets/vendor-xyz.js', { mode: 'prod' })
    ).toBe('js');
    expect(
      classifyOfflineProbeUrl('http://x/assets/index-abc.js', { mode: 'dev' })
    ).toBe('js');
    const controller = 'http://x/src/games/hex/game-controller.ts';
    expect(classifyOfflineProbeUrl(controller, { mode: 'prod' })).toBe(
      'lazy-game-chunk'
    );
    expect(classifyOfflineProbeUrl(controller, { mode: 'dev' })).toBe(
      'lazy-game-chunk'
    );
  });

  it('preserves mode-specific font / 3d / css buckets', () => {
    expect(
      classifyOfflineProbeUrl('http://x/assets/fonts/foo.woff2', {
        mode: 'prod',
      })
    ).toBe('font');
    expect(
      classifyOfflineProbeUrl('http://x/vendor/three-abc.js', { mode: 'prod' })
    ).toBe('3d-asset');
    expect(
      classifyOfflineProbeUrl('http://x/src/ui/three.ts', { mode: 'dev' })
    ).toBe('3d-asset');
    expect(
      classifyOfflineProbeUrl('http://x/assets/app.css', { mode: 'prod' })
    ).toBe('css');
    expect(
      classifyOfflineProbeUrl('http://x/assets/app.css', { mode: 'dev' })
    ).toBe('css');
  });
});
