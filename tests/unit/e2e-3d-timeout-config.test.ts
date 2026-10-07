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
    expect(pw).toMatch(/process\.env\.CI\s*\?\s*1\s*:\s*2/);
    expect(pw).toMatch(/timeout:\s*60_000/);
  });

  it('ships mp3d ready-wait helper and heavy timeout constant', () => {
    expect(helper).toContain('waitForMp3dReady');
    expect(helper).toContain('MP3D_HEAVY_TEST_TIMEOUT_MS');
    expect(helper).toContain('board3dLQ');
    expect(helper).toContain('data-mp3d-ready');
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

  it('exposes test-only board3dLQ pixel-ratio path', () => {
    expect(tablet).toContain('BOARD_3D_LQ_PARAM');
    expect(tablet).toContain('resolveBoard3dPixelRatio');
    expect(tablet).toContain('markBoard3dCanvasReady');
  });
});
