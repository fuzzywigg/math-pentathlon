/**
 * Guards Playwright worker / timeout posture for mp3d Chromium stability.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('e2e 3D timeout config', () => {
  const pw = readFileSync(
    resolve(process.cwd(), 'playwright.config.ts'),
    'utf8'
  );
  const helper = readFileSync(
    resolve(process.cwd(), 'tests/e2e/helpers/mp3d.ts'),
    'utf8'
  );
  const tablet = readFileSync(
    resolve(process.cwd(), 'src/ui/three/tablet-gl.ts'),
    'utf8'
  );

  it('caps workers in CI and locally (no unbounded parallel GL)', () => {
    // CI defaults to 2 (ubuntu-latest vCPU); override via PLAYWRIGHT_WORKERS.
    // Local stays at 2. Never leave workers unset (unbounded GL thrash).
    expect(pw).toMatch(/PLAYWRIGHT_WORKERS/);
    expect(pw).toMatch(/process\.env\.CI/);
    expect(pw).toMatch(/:\s*2\b/);
    expect(pw).toMatch(/timeout:\s*60_000/);
  });

  it('ships mp3d ready-wait helper and heavy timeout constant', () => {
    expect(helper).toContain('waitForMp3dReady');
    expect(helper).toContain('MP3D_HEAVY_TEST_TIMEOUT_MS');
    expect(helper).toContain('board3dLQ');
    expect(helper).toContain('data-mp3d-ready');
    expect(helper).toContain('data-mp3d-fallback');
    expect(helper).toMatch(/MP3D_READY_TIMEOUT_MS\s*=\s*process\.env\.CI/);
  });

  it('pins Chromium SwiftShader launch args for CI-like software GL', () => {
    expect(pw).toContain('enable-unsafe-swiftshader');
    expect(pw).toContain('swiftshader-webgl');
    expect(pw).toContain('launchOptions');
  });

  it('ships keyboard a11y + human-status helpers (no union strict-mode flake)', () => {
    expect(helper).toContain('keyboardActivateA11yCell');
    expect(helper).toContain('primeGoldValidA11yCell');
    expect(helper).toContain('waitForHumanStatus');
    expect(helper).toContain('toBeAttached');
    expect(helper).toContain('Computer is thinking');
    // Guard against regressing to tabindex=0 targeting (restoreGridFocus flake).
    expect(helper).toContain('pg-expr-item strong');
  });

  it('exposes test-only board3dLQ pixel-ratio path + reliable paint ready', () => {
    expect(tablet).toContain('BOARD_3D_LQ_PARAM');
    expect(tablet).toContain('resolveBoard3dPixelRatio');
    expect(tablet).toContain('markBoard3dCanvasReady');
    expect(tablet).toContain('paintBoard3dAndMarkReady');
    expect(tablet).toContain('scheduleBoard3dMountPaint');
    expect(tablet).toContain('markBoard3dWebGlFallback');
  });
});
