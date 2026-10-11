/**
 * Overnight TOKENMAXX — injectHexStyles is idempotent and reinjects after removal.
 * Tests-only. After #214/#215. q-mp-1304: no sticky stylesInjected latch.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectHexStyles, createInteractiveHexGrid } from '../helpers/core-hex/hex-ui';
import { createLayout } from '../helpers/core-hex/types';

const HEX_UI_STYLES_SELECTOR = 'style[data-mp-hex-ui-styles]';

afterEach(() => {
  document.body.innerHTML = '';
  document.querySelectorAll(HEX_UI_STYLES_SELECTOR).forEach((s) => s.remove());
});

describe('Overnight core hex-ui — styles idempotent', () => {
  it('repeated injectHexStyles does not stack duplicate style tags beyond first module inject', () => {
    const before = document.querySelectorAll(HEX_UI_STYLES_SELECTOR).length;
    injectHexStyles();
    injectHexStyles();
    injectHexStyles();
    const after = document.querySelectorAll(HEX_UI_STYLES_SELECTOR).length;
    expect(after - before).toBe(1);

    const host = document.createElement('div');
    document.body.appendChild(host);
    createInteractiveHexGrid(host, 0, createLayout());
    const afterInteractive = document.querySelectorAll(HEX_UI_STYLES_SELECTOR).length;
    expect(afterInteractive).toBe(after);
  });

  it('reinjects after the tagged style node is removed', () => {
    injectHexStyles();
    expect(document.querySelectorAll(HEX_UI_STYLES_SELECTOR).length).toBe(1);

    document.querySelectorAll(HEX_UI_STYLES_SELECTOR).forEach((s) => s.remove());
    expect(document.querySelectorAll(HEX_UI_STYLES_SELECTOR).length).toBe(0);

    injectHexStyles();
    expect(document.querySelectorAll(HEX_UI_STYLES_SELECTOR).length).toBe(1);
    injectHexStyles();
    expect(document.querySelectorAll(HEX_UI_STYLES_SELECTOR).length).toBe(1);
  });
});
